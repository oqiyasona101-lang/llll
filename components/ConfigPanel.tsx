import React from 'react';
import { ModelConfig } from '../types';

interface Props {
  config: ModelConfig;
  setConfig: React.Dispatch<React.SetStateAction<ModelConfig>>;
  disabled: boolean;
  onRun: () => void;
}

const ConfigPanel: React.FC<Props> = ({ config, setConfig, disabled, onRun }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        模型参数配置
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            蒙特卡洛模拟次数: <span className="text-white">{config.monteCarloIterations}</span>
          </label>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={config.monteCarloIterations}
            onChange={(e) => setConfig({ ...config, monteCarloIterations: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            LSTM 训练轮数 (Epochs): <span className="text-white">{config.lstmEpochs}</span>
          </label>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={config.lstmEpochs}
            onChange={(e) => setConfig({ ...config, lstmEpochs: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            近期数据权重: <span className="text-white">{config.recentWeight}</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={config.recentWeight}
            onChange={(e) => setConfig({ ...config, recentWeight: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            disabled={disabled}
          />
        </div>

        <div className="flex items-center pt-6">
          <input
            id="use-crf"
            type="checkbox"
            checked={config.useCRF}
            onChange={(e) => setConfig({ ...config, useCRF: e.target.checked })}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-600 focus:ring-offset-gray-800"
            disabled={disabled}
          />
          <label htmlFor="use-crf" className="ml-2 text-sm font-medium text-gray-300">
            启用 CRF (条件随机场) 相邻依赖分析
          </label>
        </div>
      </div>

      <button
        onClick={onRun}
        disabled={disabled}
        className={`w-full py-4 px-6 rounded-lg font-bold text-lg shadow-lg transform transition-all duration-200 flex justify-center items-center ${
          disabled
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        {disabled ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            模型运算中...
          </>
        ) : (
          '开始智能预测分析'
        )}
      </button>
    </div>
  );
};

export default ConfigPanel;