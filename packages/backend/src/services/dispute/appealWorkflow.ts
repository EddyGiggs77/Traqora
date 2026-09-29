import { DisputeDTO } from './disputeService';

export interface AppealRecord {
  disputeId: string;
  appellant: string;
  reason: string;
  appendedEvidenceIds: string[];
  status: 'pending_review' | 'accepted' | 'rejected';
  createdAt: string;
}

export class AppealWorkflowService {
  private appeals: Map<string, AppealRecord> = new Map();

  fileAppeal(dispute: DisputeDTO, appellant: string, reason: string): AppealRecord {
    if (dispute.status !== 'resolved') {
      throw new Error('Only resolved disputes can be appealed');
    }
    if (dispute.claimantAddress !== appellant && dispute.respondentAddress !== appellant) {
      throw new Error('Only direct participants can file an appeal');
    }

    const appeal: AppealRecord = {
      disputeId: dispute.id,
      appellant,
      reason,
      appendedEvidenceIds: [],
      status: 'pending_review',
      createdAt: new Date().toISOString(),
    };

    this.appeals.set(dispute.id, appeal);
    return appeal;
  }

  getAppeal(disputeId: string): AppealRecord | undefined {
    return this.appeals.get(disputeId);
  }
}

export const appealWorkflowService = new AppealWorkflowService();
