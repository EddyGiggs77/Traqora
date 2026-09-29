import React, { useState } from 'react';

export function ItineraryShare({ itineraryId }: { itineraryId: string }) {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('edit');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/itineraries/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itineraryId, recipientEmail: email, permissionLevel: permission, message }),
      });
      if (res.ok) {
        setStatus('Invitation sent successfully!');
      } else {
        setStatus('Failed to send invitation.');
      }
    } catch {
      setStatus('Error sending invitation.');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-2">Share Itinerary</h3>
      <form onSubmit={handleShare} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Recipient Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Permission Level</label>
          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="view">View</option>
            <option value="edit">Edit</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Message (optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Send Invite
        </button>
        {status && <p className="text-sm mt-2">{status}</p>}
      </form>
    </div>
  );
}
