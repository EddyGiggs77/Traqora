'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export interface DisputeTimelineEvent {
  type: 'dispute_opened' | 'arbitrator_assigned' | 'evidence_submitted' | 'dispute_resolved' | 'dispute_appealed';
  at: string;
  actor: string;
  notes?: string;
}

export interface DisputeDTO {
  id: string;
  refundId: string;
  bookingId: string;
  claimantAddress: string;
  respondentAddress: string;
  arbitratorAddress: string | null;
  disputeType: string;
  description: string;
  desiredOutcome: string | null;
  status: string;
  outcome: string | null;
  resolutionNotes: string | null;
  evidence: Array<{
    id: string;
    submittedBy: string;
    description: string;
    fileUrl: string | null;
    submittedAt: string;
  }>;
  timeline: DisputeTimelineEvent[];
  createdAt: string;
  updatedAt: string;
  deadlineAt: string | null;
}

export default function DisputesDashboard() {
  const [disputes, setDisputes] = useState<DisputeDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/disputes', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch disputes');
        const data = await res.json();
        setDisputes(data.items || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading disputes...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dispute Resolution Center</h1>
        <Link
          href="/governance/create-dispute"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-750 transition"
        >
          File New Dispute
        </Link>
      </div>

      {disputes.length === 0 ? (
        <p className="text-gray-500">No active or past disputes found.</p>
      ) : (
        <div className="grid gap-4">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="border p-4 rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold uppercase px-2 py-1 bg-gray-100 rounded text-gray-700">
                    {dispute.disputeType}
                  </span>
                  <h2 className="text-lg font-medium mt-2">Dispute #{dispute.id.slice(0, 8)}</h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{dispute.description}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    dispute.status === 'resolved'
                      ? 'bg-green-100 text-green-800'
                      : dispute.status === 'appealed'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {dispute.status.toUpperCase()}
                </span>
              </div>

              <div className="mt-4 text-xs text-gray-500 flex flex-wrap gap-4">
                <div>Claimant: {dispute.claimantAddress.slice(0, 6)}...</div>
                <div>Respondent: {dispute.respondentAddress.slice(0, 6)}...</div>
                <div>
                  Arbitrator: {dispute.arbitratorAddress ? `${dispute.arbitratorAddress.slice(0, 6)}...` : 'Unassigned'}
                </div>
                {dispute.deadlineAt && (
                  <div>Deadline: {new Date(dispute.deadlineAt).toLocaleDateString()}</div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t flex justify-end">
                <Link
                  href={`/refunds/dispute/${dispute.id}`}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  View Details & Timeline &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
