const { supabase } = require('../config/database');

async function getUserByUsername(username) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .limit(1);
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return data && data.length > 0 ? data[0] : null;
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
      throw new Error(`Supabase error: ${error.message}`);
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