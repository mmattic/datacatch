require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

async function saveSearchHistory(keyword) {
  const record = {
    id: Date.now(),
    keyword,
    searchTime: new Date().toISOString()
  };
  
  let searchHistory = [];
  try {
    const existingData = fs.readFileSync(path.join(dataDir, 'searchHistory.json'), 'utf-8');
    searchHistory = JSON.parse(existingData);
  } catch (e) {
    searchHistory = [];
  }
  
  searchHistory.push(record);
  if (searchHistory.length > 100) {
    searchHistory = searchHistory.slice(-100);
  }
  
  fs.writeFileSync(
    path.join(dataDir, 'searchHistory.json'),
    JSON.stringify(searchHistory, null, 2)
  );
  
  try {
    const { error } = await supabase
      .from('search_history')
      .insert({
        id: record.id,
        keyword: record.keyword,
        search_time: record.searchTime
      });
    
    if (error) {
      console.warn('Failed to save search history to Supabase:', error.message);
    }
  } catch (e) {
    console.warn('Supabase connection error:', e.message);
  }
}

function getSearchHistory() {
  try {
    const data = fs.readFileSync(path.join(dataDir, 'searchHistory.json'), 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
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
    reportName,
    data: JSON.stringify(data),
    createdAt: new Date().toISOString()
  };
  
  let analysisReports = [];
  try {
    const existingData = fs.readFileSync(path.join(dataDir, 'analysisReports.json'), 'utf-8');
    analysisReports = JSON.parse(existingData);
  } catch (e) {
    analysisReports = [];
  }
  
  analysisReports.push(report);
  
  if (analysisReports.length > 50) {
    analysisReports = analysisReports.slice(-50);
  }
  
  fs.writeFileSync(
    path.join(dataDir, 'analysisReports.json'),
    JSON.stringify(analysisReports, null, 2)
  );
  
  try {
    const { error } = await supabase
      .from('analysis_reports')
      .insert({
        id: report.id,
        report_name: report.reportName,
        data: report.data,
        created_at: report.createdAt
      });
    
    if (error) {
      console.warn('Failed to save analysis report to Supabase:', error.message);
    }
  } catch (e) {
    console.warn('Supabase connection error:', e.message);
  }
  
  return report;
}

function getAnalysisReports() {
  try {
    const data = fs.readFileSync(path.join(dataDir, 'analysisReports.json'), 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
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