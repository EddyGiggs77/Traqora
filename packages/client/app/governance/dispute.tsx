"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, Upload, CheckCircle2, AlertCircle } from "lucide-react";

export interface DisputeTimelineEventItem {
  type: 'dispute_opened' | 'arbitrator_assigned' | 'evidence_submitted' | 'dispute_resolved' | 'dispute_appealed';
  at: string;
  actor: string;
  notes?: string;
}

export interface DisputeViewProps {
  disputeId: string;
  status: string;
  claimantAddress: string;
  respondentAddress: string;
  arbitratorAddress: string | null;
  disputeType: string;
  description: string;
  outcome: string | null;
  timeline: DisputeTimelineEventItem[];
  deadlineAt: string | null;
  onSubmitEvidence?: (description: string, fileUrl?: string) => Promise<void>;
}

export function DisputeResolutionView({
  disputeId,
  status,
  claimantAddress,
  respondentAddress,
  arbitratorAddress,
  disputeType,
  description,
  outcome,
  timeline,
  deadlineAt,
  onSubmitEvidence,
}: DisputeViewProps) {
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleEvidenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmitEvidence || !evidenceDescription.trim()) return;
    try {
      setSubmitting(true);
      await onSubmitEvidence(evidenceDescription, fileUrl || undefined);
      setEvidenceDescription("");
      setFileUrl("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-serif">Dispute #{disputeId}</CardTitle>
            <p className="text-sm text-muted-foreground capitalize">Type: {disputeType.replace('_', ' ')}</p>
          </div>
          <Badge variant={status === 'resolved' ? 'default' : 'secondary'}>
            {status.replace('_', ' ')}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Claimant:</span>
              <p className="font-mono truncate">{claimantAddress}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Respondent:</span>
              <p className="font-mono truncate">{respondentAddress}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Assigned Arbitrator:</span>
              <p className="font-mono truncate">{arbitratorAddress || 'Pending Assignment'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Deadline:</span>
              <p>{deadlineAt ? new Date(deadlineAt).toLocaleString() : 'None'}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Description</h4>
            <p className="text-sm text-foreground bg-muted p-3 rounded-md">{description}</p>
          </div>

          {outcome && (
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-md flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Dispute Resolved</p>
                <p className="text-xs text-muted-foreground capitalize">Outcome: {outcome.replace('_', ' ')}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evidence Upload Form */}
      {['open', 'evidence_submission', 'under_review', 'appealed'].includes(status) && onSubmitEvidence && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-serif flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              Submit Evidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEvidenceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Evidence Description</label>
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                  rows={3}
                  placeholder="Provide supporting details or document explanation..."
                  value={evidenceDescription}
                  onChange={(e) => setEvidenceDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">File URL or IPFS CID (Optional)</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                  placeholder="ipfs://... or https://..."
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Upload Evidence'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Dispute Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-serif flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Dispute Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeline.map((event, idx) => (
              <div key={idx} className="flex items-start gap-3 border-l-2 border-primary/30 pl-4 py-1">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm capitalize">{event.type.replace('_', ' ')}</span>
                    <span className="text-xs text-muted-foreground">{new Date(event.at).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">Actor: {event.actor}</p>
                  {event.notes && <p className="text-sm text-foreground mt-1">{event.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
