// supabaseClient.js
const { createClient } = require('@supabase/supabase-js');
const env = require('./env');
const { SUPABASE_URL, SUPABASE_PUBLIC_KEY } = env;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

// Export the client
module.exports = { supabase };