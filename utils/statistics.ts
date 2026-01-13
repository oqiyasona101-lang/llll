import { LotteryRecord, LotteryStatistics } from '../types';

export const calculateStatistics = (records: LotteryRecord[]): LotteryStatistics => {
  const redCounts: Record<number, number> = {};
  const blueCounts: Record<number, number> = {};
  const pairCounts: Record<string, number> = {};

  records.forEach(record => {
    // Count Red Balls
    record.redBalls.forEach(num => {
      redCounts[num] = (redCounts[num] || 0) + 1;
    });

    // Count Blue Balls
    if (record.blueBalls) {
      record.blueBalls.forEach(num => {
        blueCounts[num] = (blueCounts[num] || 0) + 1;
      });
    }

    // Count Red Pairs (Combinations of 2)
    // Assuming sorted red balls for consistent keys
    const sortedReds = [...record.redBalls].sort((a, b) => a - b);
    for (let i = 0; i < sortedReds.length; i++) {
      for (let j = i + 1; j < sortedReds.length; j++) {
        const pairKey = `${sortedReds[i]}-${sortedReds[j]}`;
        pairCounts[pairKey] = (pairCounts[pairKey] || 0) + 1;
      }
    }
  });

  // Convert to array and sort
  const redFreq = Object.entries(redCounts)
    .map(([num, count]) => ({ number: parseInt(num), count }))
    .sort((a, b) => b.count - a.count); // Descending by count

  const blueFreq = Object.entries(blueCounts)
    .map(([num, count]) => ({ number: parseInt(num), count }))
    .sort((a, b) => b.count - a.count);

  const topRedPairs = Object.entries(pairCounts)
    .map(([pair, count]) => ({ pair, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12); // Top 12 pairs

  return {
    redFreq,
    blueFreq,
    topRedPairs
  };
};