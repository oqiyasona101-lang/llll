import React, { useState } from 'react';
import { LotteryType, LotteryRecord, PredictionResult, ModelConfig } from './types';
import { MOCK_HISTORY, DEFAULT_CONFIG } from './constants';
import { analyzeLotteryData } from './services/geminiService';
import LotteryTabs from './components/LotteryTabs';
import HistoryTable from './components/HistoryTable';
import ConfigPanel from './components/ConfigPanel';
import AnalysisResultView from './components/AnalysisResult';

const App: React.FC = () => {
  const [selectedLottery, setSelectedLottery] = useState<LotteryType>(LotteryType.SSQ);
  const [config, setConfig] = useState<ModelConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // In a real app, users might upload data here. For now, we use MOCK.
  const currentHistory: LotteryRecord[] = MOCK_HISTORY[selectedLottery] || [];

  const handleRunAnalysis = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Simulate training delay for effect (UI/UX)
    // The API call itself takes time, but this adds to the "Model Training" feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const prediction = await analyzeLotteryData(selectedLottery, currentHistory, config);
      setResult(prediction);
    } catch (err: any) {
      setError(err.message || "分析过程中发生未知错误，请检查 API Key 或重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-purple-500 selection:text-white pb-20">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold">AI</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              彩票预测分析师
            </h1>
          </div>
          <div className="text-xs text-gray-500 hidden sm:block">
            Powered by Gemini • LSTM • Monte Carlo
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Controls & Data */}
          <div className="lg:col-span-1 space-y-6">
            <LotteryTabs selected={selectedLottery} onSelect={setSelectedLottery} />
            
            <ConfigPanel 
              config={config} 
              setConfig={setConfig} 
              disabled={loading} 
              onRun={handleRunAnalysis} 
            />

            <HistoryTable data={currentHistory} />
            
            <div className="bg-gray-800/50 p-4 rounded-lg text-xs text-gray-500 border border-gray-700/50">
              <p className="font-bold text-gray-400 mb-1">免责声明:</p>
              <p>本应用仅用于统计学演示和算法研究，彩票中奖概率极低且为独立随机事件。预测结果仅供娱乐，不构成任何投资或购彩建议。请理性购彩。</p>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-2">
            {error && (
               <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-xl mb-6 flex items-center">
                 <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 {error}
               </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-96 bg-gray-800 rounded-xl border border-gray-700">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/30 rounded-full animate-ping"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">正在进行深度运算...</h3>
                <div className="space-y-1 text-sm text-gray-400 text-center">
                  <p>Training LSTM Neural Network (Epoch {Math.floor(Math.random() * config.lstmEpochs)}/{config.lstmEpochs})</p>
                  <p>Running Monte Carlo Simulation ({Math.floor(Math.random() * config.monteCarloIterations)} iterations)</p>
                  <p>Analyzing Deviation & CRF Dependencies</p>
                </div>
              </div>
            )}

            {!loading && result && (
              <AnalysisResultView result={result} />
            )}

            {!loading && !result && !error && (
              <div className="flex flex-col items-center justify-center h-full bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-700 p-12 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h3 className="text-lg font-medium text-gray-300">等待分析</h3>
                <p className="text-gray-500 max-w-sm mt-2">请在左侧配置模型参数并点击“开始智能预测分析”以生成预测报告。</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
