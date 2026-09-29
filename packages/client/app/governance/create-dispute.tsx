'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateDisputePage() {
  const router = useRouter();
  const [refundId, setRefundId] = useState('');
  const [disputeType, setDisputeType] = useState('refund_denied');
  const [description, setDescription] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [evidenceDescription, setEvidenceDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        refundId,
        disputeType,
        description,
        desiredOutcome,
      };

      if (evidenceDescription.trim()) {
        payload.evidence = [
          {
            description: evidenceDescription,
            fileUrl: evidenceUrl.trim() || undefined,
          },
        ];
      }

      const res = await fetch('/api/v1/disputes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create dispute');
      }

      const dispute = await res.json();
      router.push(`/refunds/dispute/${dispute.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">File a Dispute</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Refund ID (UUID)</label>
          <input
            type="text"
            required
            value={refundId}
            onChange={(e) => setRefundId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dispute Type</label>
          <select
            value={disputeType}
            onChange={(e) => setDisputeType(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="refund_denied">Refund Denied</option>
            <option value="refund_amount">Refund Amount</option>
            <option value="processing_delay">Processing Delay</option>
            <option value="service_quality">Service Quality</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description (min 20 characters)</label>
          <textarea
            required
            rows={4}
            minLength={20}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Explain the reason for your dispute in detail..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Desired Outcome (min 10 characters)</label>
          <input
            type="text"
            required
            minLength={10}
            value={desiredOutcome}
            onChange={(e) => setDesiredOutcome(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g. Full refund credited to wallet"
          />
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-medium mb-2">Initial Evidence (Optional)</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Evidence Description</label>
              <input
                type="text"
                value={evidenceDescription}
                onChange={(e) => setEvidenceDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Description of the uploaded evidence"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Evidence URL / IPFS CID</label>
              <input
                type="text"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="ipfs://Qm... or https://..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-750 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Dispute'}
          </button>
        </div>
      </form>
    </div>
  );
}
