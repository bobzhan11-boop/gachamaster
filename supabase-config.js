// ===================================================================
// GachaMaster - Supabase Backend Configuration
// ===================================================================
// To enable online features:
// 1. Create a free Supabase project at https://supabase.com
// 2. Run supabase-setup.sql in the SQL Editor
// 3. Replace the values below with your project's URL and anon key
//    (Settings → API → Project URL / anon public key)
// ===================================================================

const SUPABASE_URL = 'https://euwhazzcnfnhfclhegkv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1d2hhenpjbmZuaGZjbGhlZ2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4ODk0NDQsImV4cCI6MjA4ODQ2NTQ0NH0.gQfMbBmzcxphHVNZaJGk8fEkyAvd0zydk87MFuJnYnA';

// ===== Supabase Client =====
// Named "sb" to avoid conflict with the global "supabase" from the CDN
let sb = null;
let currentUser = null;
let chatSubscription = null;

function isSupabaseConfigured() {
  return SUPABASE_URL && SUPABASE_KEY && SUPABASE_URL.startsWith('https://');
}

function initSupabase() {
  if (!isSupabaseConfigured()) return false;
  try {
    if (!window.supabase || !window.supabase.createClient) {
      console.warn('Supabase CDN not loaded yet');
      return false;
    }
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return true;
  } catch (e) {
    console.error('Supabase init failed:', e);
    return false;
  }
}

// Retry init - called when user tries to login but sb is null
function ensureSupabase() {
  if (sb) return true;
  return initSupabase();
}

// Auto-initialize immediately since CDN script loads before this file
initSupabase();

// ===================================================================
// Authentication
// ===================================================================

// Password validation rules
const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { id: 'upper', label: 'At least 1 uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { id: 'lower', label: 'At least 1 lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
  { id: 'number', label: 'At least 1 number (0-9)', test: (p) => /[0-9]/.test(p) },
  { id: 'symbol', label: 'At least 1 symbol (#@!$%^&* etc.)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function validatePassword(password) {
  const results = PASSWORD_RULES.map(rule => ({
    ...rule,
    passed: rule.test(password),
  }));
  const passedCount = results.filter(r => r.passed).length;
  let strength = 'weak';
  if (passedCount >= 4) strength = 'medium';
  if (passedCount === 5) strength = 'strong';
  return { results, strength, allPassed: passedCount === 5 };
}

function validateUsername(username) {
  if (username.length < 3) return { ok: false, msg: 'Username must be at least 3 characters' };
  if (username.length > 20) return { ok: false, msg: 'Username must be 20 characters or less' };
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return { ok: false, msg: 'Username: letters, numbers, underscore only' };
  return { ok: true, msg: '' };
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Sign up with email + password + username
async function signUpWithEmail(email, password, username) {
  if (!sb) return { error: 'Supabase not configured' };

  // Validate username
  const uv = validateUsername(username);
  if (!uv.ok) return { error: uv.msg };

  // Validate email
  if (!validateEmail(email)) return { error: 'Please enter a valid email address' };

  // Validate password
  const pv = validatePassword(password);
  if (!pv.allPassed) return { error: 'Password does not meet all requirements' };

  // Check username availability
  try {
    const { data: existing } = await sb
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (existing) return { error: 'Username is already taken' };
  } catch (e) {
    console.warn('Username check failed:', e);
  }

  // Create auth user (profile is auto-created by database trigger)
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    }
  });

  if (error) return { error: error.message };

  // Check if user already exists (Supabase returns fake success for existing emails)
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { error: 'An account with this email already exists. Try logging in.' };
  }

  return {
    success: true,
    needsVerification: true,
    message: 'Account created! Check your email for a verification link, then log in.',
  };
}

// Sign in with email + password
async function signInWithEmail(email, password) {
  if (!sb) return { error: 'Supabase not configured' };

  const { data, error } = await sb.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };

  currentUser = data.user;

  // Fetch profile
  const { data: profile } = await sb
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profile) {
    currentUser.profile = profile;
  } else {
    // Profile doesn't exist yet (trigger may have missed) - create it now
    const username = data.user.user_metadata?.username || 'player_' + data.user.id.substring(0, 8);
    const { data: newProfile } = await sb
      .from('profiles')
      .insert({ id: data.user.id, username: username })
      .select()
      .single();
    if (newProfile) {
      currentUser.profile = newProfile;
    }
  }

  return { success: true, user: currentUser };
}

// Sign out
async function signOutUser() {
  if (!sb) return;
  await sb.auth.signOut();
  currentUser = null;
  if (chatSubscription) {
    sb.removeChannel(chatSubscription);
    chatSubscription = null;
  }
}

// Get current session on page load
async function getCurrentSession() {
  if (!sb) return null;

  const { data: { session } } = await sb.auth.getSession();
  if (!session) return null;

  currentUser = session.user;

  // Fetch profile
  const { data: profile } = await sb
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  if (profile) {
    currentUser.profile = profile;
  }

  return currentUser;
}

// Send password reset email
async function resetPassword(email) {
  if (!sb) return { error: 'Supabase not configured' };
  const { error } = await sb.auth.resetPasswordForEmail(email);
  if (error) return { error: error.message };
  return { success: true, message: 'Password reset email sent! Check your inbox.' };
}

// ===================================================================
// Cloud Saves
// ===================================================================

async function saveToCloud(gameState) {
  if (!sb || !currentUser) return { error: 'Not logged in' };

  const { error } = await sb
    .from('game_saves')
    .upsert({
      user_id: currentUser.id,
      save_data: gameState,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) return { error: error.message };
  return { success: true };
}

async function loadFromCloud() {
  if (!sb || !currentUser) return { error: 'Not logged in' };

  const { data, error } = await sb
    .from('game_saves')
    .select('save_data, updated_at')
    .eq('user_id', currentUser.id)
    .maybeSingle();

  if (error) return { error: error.message };
  if (!data) return { data: null };

  return { data: data.save_data, updatedAt: data.updated_at };
}

// ===================================================================
// Public Feedback
// ===================================================================

async function submitFeedbackOnline(entry) {
  if (!sb || !currentUser) return { error: 'Not logged in' };

  const username = currentUser.profile?.username || 'Anonymous';

  const { error } = await sb.from('feedback').insert({
    user_id: currentUser.id,
    username: username,
    type: entry.type,
    rating: entry.rating,
    message: entry.text,
    stats: entry.stats || {},
  });

  if (error) return { error: error.message };
  return { success: true };
}

async function loadPublicFeedback(limit = 50) {
  if (!sb) return { data: [] };

  const { data, error } = await sb
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return { data: [], error: error.message };
  return { data: data || [] };
}

// ===================================================================
// Chat
// ===================================================================

async function sendChatMessage(text) {
  if (!sb || !currentUser) return { error: 'Not logged in' };

  const username = currentUser.profile?.username || 'Anonymous';
  const avatar = currentUser.profile?.avatar || '🎮';

  // Basic sanitization
  const cleanText = text.trim().substring(0, 500);
  if (!cleanText) return { error: 'Message cannot be empty' };

  const { error } = await sb.from('chat_messages').insert({
    user_id: currentUser.id,
    username: username,
    avatar: avatar,
    message: cleanText,
  });

  if (error) return { error: error.message };
  return { success: true };
}

async function loadRecentChat(limit = 50) {
  if (!sb) return { data: [] };

  const { data, error } = await sb
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return { data: [], error: error.message };
  // Reverse so oldest first for display
  return { data: (data || []).reverse() };
}

function subscribeToChatMessages(callback) {
  if (!sb) return null;

  chatSubscription = sb
    .channel('public:chat_messages')
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'chat_messages' },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return chatSubscription;
}

function unsubscribeFromChat() {
  if (chatSubscription && sb) {
    sb.removeChannel(chatSubscription);
    chatSubscription = null;
  }
}

// ===================================================================
// Update last_seen (marks player as "online")
// ===================================================================

async function updateLastSeen() {
  if (!sb || !currentUser) return;
  try {
    await sb
      .from('profiles')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', currentUser.id);
  } catch (e) {
    console.warn('Failed to update last_seen:', e);
  }
}

// ===================================================================
// Player Count
// ===================================================================

async function getPlayerCount() {
  if (!sb) return { total: 0, online: 0 };

  try {
    const { data: totalData } = await sb.rpc('get_total_player_count');
    const { data: onlineData } = await sb.rpc('get_online_player_count');
    return {
      total: totalData || 0,
      online: onlineData || 0,
    };
  } catch (e) {
    return { total: 0, online: 0 };
  }
}

// ===================================================================
// Guest Account Upgrade
// ===================================================================

async function upgradeGuestToAccount(email, password, username) {
  const result = await signUpWithEmail(email, password, username);
  if (result.success || result.needsVerification) {
    return result;
  }
  return result;
}
