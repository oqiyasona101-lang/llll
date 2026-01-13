import React, { useMemo } from 'react';
import { PredictionResult, LotteryRecord, LotteryType } from '../types';
import { calculateStatistics } from '../utils/statistics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

interface Props {
  result: PredictionResult;
  history: LotteryRecord[]; // Pass history for statistical calculation
}

const AnalysisResult: React.FC<Props> = ({ result, history }) => {
  // Sort probabilities to show highest first
  const sortedRed = [...result.redBallProbabilities].sort((a, b) => b.probability - a.probability).slice(0, 15);
  
  // Calculate Statistics
  const statistics = useMemo(() => calculateStatistics(history), [history]);
  
  // Prepare data for frequency charts (Top 20 most frequent)
  const redFreqData = statistics.redFreq.slice(0, 20);
  const blueFreqData = statistics.blueFreq.slice(0, 15);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Summary Card */}
      <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-green-500 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-2">AI 分析摘要</h3>
        <p className="text-gray-300 leading-relaxed">{result.analysisSummary}</p>
      </div>

      {/* Suggested Combinations */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          智能推荐组合
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {result.suggestedCombinations.map((combo, idx) => (
            <div key={idx} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-sm font-mono text-gray-500 mr-2">#{idx + 1}</span>
                {combo.red.map((n) => (
                  <span key={`r-${n}`} className="w-8 h-8 flex items-center justify-center bg-red-600 rounded-full text-white font-bold shadow-sm">
                    {n}
                  </span>
                ))}
                {combo.blue && combo.blue.map((n) => (
                  <span key={`b-${n}`} className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full text-white font-bold shadow-sm">
                    {n}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-400 italic border-t border-gray-800 pt-2">
                推荐理由: {combo.reasoning}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Probabilities Chart (Prediction) */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-6">本期预测：高概率号码 (Top 15)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedRed} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="number" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="probability" name="Probability %" radius={[4, 4, 0, 0]}>
                {sortedRed.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={`rgba(239, 68, 68, ${0.4 + (entry.probability / 200)})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Red Ball Frequency */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">历史数据：红球出现次数 (Top 20)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={redFreqData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                <XAxis type="number" stroke="#9CA3AF" hide />
                <YAxis dataKey="number" type="category" stroke="#9CA3AF" width={30} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                />
                <Bar dataKey="count" name="出现次数" fill="#DC2626" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Pairs */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">历史数据：最热红球组合 (双号)</h3>
          <div className="overflow-hidden">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                <tr>
                  <th className="px-4 py-3">组合</th>
                  <th className="px-4 py-3 text-right">出现次数</th>
                </tr>
              </thead>
              <tbody>
                {statistics.topRedPairs.map((pair, idx) => (
                  <tr key={idx} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="px-4 py-2 font-medium text-white flex gap-2">
                       {pair.pair.split('-').map(n => (
                         <span key={n} className="inline-block bg-red-900 text-red-200 px-2 py-0.5 rounded text-xs">{n}</span>
                       ))}
                    </td>
                    <td className="px-4 py-2 text-right text-blue-400 font-mono">{pair.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Blue Ball Frequency (Only for types that have blue balls) */}
        {statistics.blueFreq.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-4">历史数据：蓝球/特别号出现次数</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={blueFreqData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="number" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" name="出现次数" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;