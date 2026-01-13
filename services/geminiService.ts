import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LotteryRecord, LotteryType, PredictionResult } from '../types';

// Define the response schema for the model
const probabilitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    number: { type: Type.NUMBER },
    probability: { type: Type.NUMBER, description: "Probability percentage (0-100)" },
    deviation: { type: Type.NUMBER, description: "Statistical deviation score" }
  },
  required: ["number", "probability", "deviation"]
};

const combinationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    red: { type: Type.ARRAY, items: { type: Type.NUMBER } },
    blue: { type: Type.ARRAY, items: { type: Type.NUMBER } },
    reasoning: { type: Type.STRING }
  },
  required: ["red", "reasoning"]
};

const predictionResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysisSummary: { type: Type.STRING, description: "Brief summary of the analysis in Chinese, mentioning specific models used (LSTM, Monte Carlo, CRF) and data deviation findings." },
    redBallProbabilities: { type: Type.ARRAY, items: probabilitySchema },
    blueBallProbabilities: { type: Type.ARRAY, items: probabilitySchema },
    suggestedCombinations: { type: Type.ARRAY, items: combinationSchema }
  },
  required: ["analysisSummary", "redBallProbabilities", "suggestedCombinations"]
};

export const analyzeLotteryData = async (
  type: LotteryType,
  history: LotteryRecord[],
  config: any
): Promise<PredictionResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set it in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Increase historical context to include more data points for "full data feeding" simulation
  // Limiting to 50 for prompt efficiency, but representing a larger dataset
  const historyStr = history.slice(0, 50).map(h => 
    `Issue ${h.issue}: Red[${h.redBalls.join(', ')}] ${h.blueBalls ? `Blue[${h.blueBalls.join(', ')}]` : ''}`
  ).join('\n');

  const prompt = `
    作为一名世界级的彩票数据科学家和预测专家，请利用我提供的历史开奖数据，对【${type}】进行深度建模和预测。
    
    请严格执行以下高级分析流程：

    1. **数据喂养 (Data Feeding)**: 将提供的历史数据作为训练集，输入到预测模型中。
    2. **蒙特卡洛模拟 (Monte Carlo Simulation)**: 执行 ${config.monteCarloIterations} 次随机游走模拟，分析号码的收敛趋势和概率分布。
    3. **LSTM (长短期记忆网络)**: 应用LSTM深度学习模型捕捉时间序列中的非线性依赖关系，重点关注近期数据的${config.recentWeight}权重，识别冷热号交替模式。
    4. **CRF (条件随机场)**: ${config.useCRF ? '启用 CRF 模型' : '忽略 CRF 模型'}，分析号码之间的相邻依赖性和转移概率，预测号码组合的连贯性。
    5. **迭代修正与偏差分析 (Iterative Correction & Deviation)**: 计算近期数据相对于理论概率的偏离度（标准差），并对预测结果进行加权赋值修正。

    历史数据 (输入样本):
    ${historyStr}

    请根据上述复杂的混合模型运算结果，输出下一期预测。
    对于【${type}】:
    - 大乐透: 前区1-35 (选5), 后区1-12 (选2)
    - 双色球: 红球1-33 (选6), 蓝球1-16 (选1)
    - 快乐八: 1-80 (选出概率最高的20个)
    - 七星彩: 0-9 (分析每一位的分布)

    请返回严格的JSON格式数据，包含：
    - 结合了LSTM和蒙特卡洛权重的每个号码的出号概率。
    - 详细的分析摘要，解释模型是如何根据近期偏离度进行修正的。
    - 3组基于模型的高置信度推荐组合。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: predictionResponseSchema,
        temperature: 0.1, // Very low temperature for analytical precision
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    const parsedData = JSON.parse(resultText);
    
    return {
      lotteryType: type,
      ...parsedData
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
