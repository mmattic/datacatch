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
  try {
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .order('search_time', { ascending: false });
    
    if (error) {
      console.warn('Failed to fetch search history:', error.message);
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
      console.warn('Failed to save report:', error.message);
    }
  } catch (e) {
    console.warn('Supabase connection error:', e.message);
  }
  
  return report;
}

async function getAnalysisReports() {
  try {
    const { data, error } = await supabase
      .from('analysis_reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn('Failed to fetch reports:', error.message);
      return [];
    }
    
    return data || [];
  } catch (e) {
    console.warn('Supabase connection error:', e.message);
    return [];
  }
}

module.exports = {
  supabase,
  saveSearchHistory,
  getSearchHistory,
  saveAnalysisReport,
  getAnalysisReports
};