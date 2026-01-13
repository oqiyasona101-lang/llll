import React from 'react';
import { LotteryType } from '../types';

interface Props {
  selected: LotteryType;
  onSelect: (type: LotteryType) => void;
}

const LotteryTabs: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 mb-6 border-b border-gray-700">
      {Object.values(LotteryType).map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`px-6 py-3 rounded-t-lg font-medium transition-colors duration-200 whitespace-nowrap ${
            selected === type
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
};

export default LotteryTabs;
