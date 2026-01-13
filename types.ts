export enum LotteryType {
  DALETOU = '大乐透',
  SSQ = '双色球',
  HAPPY8 = '快乐八',
  QXC = '七星彩'
}

export interface LotteryRecord {
  issue: string;
  redBalls: number[]; // Main numbers
  blueBalls?: number[]; // Special numbers (optional, depending on lottery)
  date: string;
}

export interface BallProbability {
  number: number;
  probability: number; // 0-100 scale
  deviation: number; // Recent deviation score
}

export interface PredictionResult {
  lotteryType: LotteryType;
  analysisSummary: string;
  redBallProbabilities: BallProbability[];
  blueBallProbabilities: BallProbability[];
  suggestedCombinations: {
    red: number[];
    blue?: number[];
    reasoning: string;
  }[];
}

export interface ModelConfig {
  monteCarloIterations: number;
  lstmEpochs: number;
  recentWeight: number; // 0.1 - 1.0
  useCRF: boolean;
}
