export interface ArbitratorCandidate {
  address: string;
  stake: number;
  reputationScore: number;
  activeDisputesCount: number;
}

export function selectOptimalArbitrator(candidates: ArbitratorCandidate[], disputeSeed: string): string {
  if (!candidates || candidates.length === 0) {
    throw new Error('No arbitrator candidates available');
  }

  // Filter eligible candidates with stake > 0 and low workload
  const eligible = candidates.filter((c) => c.stake > 0 && c.activeDisputesCount < 5);
  const pool = eligible.length > 0 ? eligible : candidates;

  // Weighted score calculation based on reputation and stake, combined with disputeSeed hash
  let bestCandidate = pool[0];
  let bestScore = -1;

  for (let i = 0; i < pool.length; i++) {
    const candidate = pool[i];
    const seedVal = disputeSeed.charCodeAt(i % disputeSeed.length) || 1;
    const score = (candidate.reputationScore * 1.5 + candidate.stake * 0.5) / (candidate.activeDisputesCount + 1) * seedVal;
    if (score > bestScore) {
      bestScore = score;
      bestCandidate = candidate;
    }
  }

  return bestCandidate.address;
}
