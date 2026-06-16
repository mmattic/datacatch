const { supabase } = require('../config/database');

async function getUserByUsername(username) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      if (error.code === 'PGRST205') {
        throw new Error('Users table not found in Supabase. Please create the table first.');
      }
      throw error;
    }
    
    return data;
  } catch (e) {
    throw new Error(`Error fetching user: ${e.message}`);
  }
}

async function createUser(username, password, role = 'user') {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        username,
        password,
        role,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (e) {
    throw new Error(`Error creating user: ${e.message}`);
  }
}

async function initializeAdminUser() {
  console.log('Initializing admin user...');
  
  try {
    const user = await getUserByUsername('jcc');
    
    if (!user) {
      console.log('Creating default admin user...');
      await createUser('jcc', '333666', 'admin');
      console.log('Default admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (e) {
    console.warn('Could not initialize admin user:', e.message);
    console.log('Please create the users table in Supabase first.');
  }
}

module.exports = {
  getUserByUsername,
  createUser,
  initializeAdminUser
};