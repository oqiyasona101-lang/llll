import React from 'react';
import { PredictionResult, BallProbability } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  result: PredictionResult;
}

const AnalysisResult: React.FC<Props> = ({ result }) => {
  // Sort probabilities to show highest first
  const sortedRed = [...result.redBallProbabilities].sort((a, b) => b.probability - a.probability).slice(0, 15);
  const sortedBlue = result.blueBallProbabilities ? [...result.blueBallProbabilities].sort((a, b) => b.probability - a.probability).slice(0, 8) : [];

  return (
    <div className="space-y-6 animate-fade-in">
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

      {/* Probabilities Chart */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-6">高概率号码分布 (Top 15)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedRed} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
        <div className="mt-4 text-center text-sm text-gray-500">
          基于 {sortedRed.length} 个高频号码的 LSTM 预测权重分布
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
