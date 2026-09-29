import { createHash } from 'crypto';

export type VoteOutcome = 'claimant_wins' | 'respondent_wins' | 'partial';

export interface VoteCommitment {
  voterAddress: string;
  commitmentHash: string;
  revealed: boolean;
  outcome?: VoteOutcome;
}

export class TwoPhaseVotingSystem {
  private commits: Map<string, Map<string, VoteCommitment>> = new Map();

  commitVote(disputeId: string, voterAddress: string, outcome: VoteOutcome, salt: string): string {
    const payload = `${outcome}:${salt}`;
    const commitmentHash = createHash('sha256').update(payload).digest('hex');

    let disputeVotes = this.commits.get(disputeId);
    if (!disputeVotes) {
      disputeVotes = new Map();
      this.commits.set(disputeId, disputeVotes);
    }

    disputeVotes.set(voterAddress, {
      voterAddress,
      commitmentHash,
      revealed: false,
    });

    return commitmentHash;
  }

  revealVote(disputeId: string, voterAddress: string, outcome: VoteOutcome, salt: string): VoteOutcome {
    const disputeVotes = this.commits.get(disputeId);
    if (!disputeVotes) throw new Error('No voting session found for dispute');

    const record = disputeVotes.get(voterAddress);
    if (!record) throw new Error('No vote commitment found for voter');

    const payload = `${outcome}:${salt}`;
    const verifyHash = createHash('sha256').update(payload).digest('hex');

    if (verifyHash !== record.commitmentHash) {
      throw new Error('Invalid vote reveal: hash mismatch');
    }

    record.revealed = true;
    record.outcome = outcome;
    return outcome;
  }

  tallyVotes(disputeId: string): VoteOutcome {
    const disputeVotes = this.commits.get(disputeId);
    if (!disputeVotes) throw new Error('No votes found');

    const counts: Record<string, number> = {};
    for (const vote of disputeVotes.values()) {
      if (vote.revealed && vote.outcome) {
        counts[vote.outcome] = (counts[vote.outcome] || 0) + 1;
      }
    }

    let winningOutcome: VoteOutcome = 'partial';
    let maxCount = -1;
    for (const [outcome, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        winningOutcome = outcome as VoteOutcome;
      }
    }

    return winningOutcome;
  }
}

export const votingSystem = new TwoPhaseVotingSystem();
