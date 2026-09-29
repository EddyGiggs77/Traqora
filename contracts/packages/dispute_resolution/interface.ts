export interface IDisputeResolutionContract {
  createDispute(refundId: string, claimant: string, respondent: string, arbitrator: string, deadline: number): Promise<string>;
  submitEvidence(disputeId: string, submitter: string, ipfsCid: string): Promise<void>;
  commitVote(disputeId: string, voter: string, commitmentHash: string): Promise<void>;
  revealVote(disputeId: string, voter: string, outcome: number, salt: string): Promise<void>;
  appeal(disputeId: string, appellant: string, reason: string): Promise<void>;
}
