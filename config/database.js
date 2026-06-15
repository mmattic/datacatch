require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

async function saveSearchHistory(keyword) {
  const record = {
    id: Date.now(),
    keyword,
    search_time: new Date().toISOString()
  };
  
  try {
    const { error } = await supabase
      .from('search_history')
      .insert(record);
    
    if (error) {
      console.warn('Failed to save search history to Supabase:', error.message);
    }
  } catch (e) {
    console.warn('Supabase connection error:', e.message);
  }
}

async function getSearchHistory() {
  return getSearchHistoryFromSupabase();
}

async function getSearchHistoryFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .order('search_time', { ascending: false });
    
    if (error) {
      console.warn('Failed to fetch search history from Supabase:', error.message);
      return [];
    }
    
    return data || [];
  } catch (e) {
    console.warn('Supabase connection error:', e.message);
    return [];
  }
}

async function saveAnalysisReport(reportName, data) {
  const report = {
    id: Date.now(),
    report_name: reportName,
    data: JSON.stringify(data),
    created_at: new Date().toISOString()
  };
  
  try {
    const { error } = await supabase
      .from('analysis_reports')
      .insert(report);
    
    if (error) {
      console.warn('Failed to save analysis report to Supabase:', error.message);
    }
  } catch (e) {
    console.warn('Supabase connection error:', e.message);
  }
  
  return report;
}

async function getAnalysisReports() {
  return getAnalysisReportsFromSupabase();
}

async function getAnalysisReportsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('analysis_reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn('Failed to fetch analysis reports from Supabase:', error.message);
      return [];
    }
    
    return data || [];
  } catch (e) {
    console.warn('Supabase connection error:', e.message);
    return [];
  }
}

async function verifyConnection() {
  try {
    const { error } = await supabase.from('search_history').select('*').limit(1);
    if (error && error.code !== 'PGRST205') {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Successfully connected to Supabase!' };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

module.exports = {
  supabase,
  saveSearchHistory,
  getSearchHistory,
  getSearchHistoryFromSupabase,
  saveAnalysisReport,
  getAnalysisReports,
  getAnalysisReportsFromSupabase,
  verifyConnection
};