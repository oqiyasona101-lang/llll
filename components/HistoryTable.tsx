import React from 'react';
import { LotteryRecord } from '../types';

interface Props {
  data: LotteryRecord[];
}

const HistoryTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-lg overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        近期历史开奖数据 (样本)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs uppercase bg-gray-700 text-gray-300">
            <tr>
              <th className="px-4 py-3">期号</th>
              <th className="px-4 py-3">日期</th>
              <th className="px-4 py-3">开奖号码</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record, idx) => (
              <tr key={idx} className="border-b border-gray-700 hover:bg-gray-750">
                <td className="px-4 py-3 font-medium text-white">{record.issue}</td>
                <td className="px-4 py-3">{record.date}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {record.redBalls.map((num, i) => (
                      <span key={`r-${i}`} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold">
                        {num}
                      </span>
                    ))}
                    {record.blueBalls && record.blueBalls.map((num, i) => (
                      <span key={`b-${i}`} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
                        {num}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-2">* 仅展示部分样本数据用于模型输入演示</p>
    </div>
  );
};

export default HistoryTable;
