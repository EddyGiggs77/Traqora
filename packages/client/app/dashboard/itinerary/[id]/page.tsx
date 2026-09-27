'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

interface Collaborator {
  id: string;
  email: string;
  permissionLevel: 'view' | 'edit' | 'admin';
  status: string;
}

interface ItineraryDetail {
  id: string;
  title: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  collaborators: Collaborator[];
}

export default function ItineraryCollaborationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const itineraryId = params?.id as string;
  const token = searchParams?.get('token');

  const [itinerary, setItinerary] = useState<ItineraryDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [permissionLevel, setPermissionLevel] = useState<'view' | 'edit'>('edit');
  const [message, setMessage] = useState<string>('');
  const [shareLoading, setShareLoading] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (token) {
      // Accept share if token is present in query
      fetch('/api/itineraries/accept-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itineraryId, invitationToken: token }),
      }).catch((err) => console.error('Failed to auto-accept share token', err));
    }

    // Fetch itinerary details
    fetch(`/api/itineraries/${itineraryId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load itinerary');
        return res.json();
      })
      .then((data) => {
        setItinerary(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Setup WebSocket connection for real-time collaboration sync
    const ws = io({ path: '/socket.io' });
    setSocket(ws);

    ws.emit('join_itinerary', { itineraryId });

    ws.on('itinerary_updated', (updatedData: Partial<ItineraryDetail>) => {
      setItinerary((prev) => (prev ? { ...prev, ...updatedData } : null));
    });

    return () => {
      ws.disconnect();
    };
  }, [itineraryId, token]);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setShareLoading(true);
    setShareSuccess(null);
    setError(null);

    try {
      const res = await fetch('/api/itineraries/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itineraryId,
          recipientEmail,
          permissionLevel,
          message,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to share itinerary');
      }

      setShareSuccess(`Invitation successfully sent to ${recipientEmail}`);
      setRecipientEmail('');
      setMessage('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setShareLoading(false);
    }
  };

  const handleRevoke = async (collaboratorEmail: string) => {
    if (!confirm(`Are you sure you want to revoke access for ${collaboratorEmail}?`)) return;

    try {
      const res = await fetch('/api/itineraries/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itineraryId, collaboratorEmail }),
      });

      if (!res.ok) throw new Error('Failed to revoke access');

      setItinerary((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          collaborators: prev.collaborators.filter((c) => c.email !== collaboratorEmail),
        };
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading shared itinerary...</div>;
  }

  if (error && !itinerary) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {itinerary?.title || 'Travel Itinerary'}
        </h1>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
          <div>
            <span className="font-semibold">Flight:</span> {itinerary?.flightNumber}
          </div>
          <div>
            <span className="font-semibold">Route:</span> {itinerary?.origin} → {itinerary?.destination}
          </div>
          <div>
            <span className="font-semibold">Departure:</span> {itinerary?.departureTime}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Share with Co-Travelers</h2>
        {shareSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
            {shareSuccess}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleShare} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Recipient Email</label>
            <input
              type="email"
              required
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              placeholder="colleague@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Permission Level</label>
            <select
              value={permissionLevel}
              onChange={(e) => setPermissionLevel(e.target.value as 'view' | 'edit')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            >
              <option value="edit">Can Edit</option>
              <option value="view">Can View Only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Personal Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              placeholder="Check out our flight itinerary!"
            />
          </div>
          <button
            type="submit"
            disabled={shareLoading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {shareLoading ? 'Sending Invitation...' : 'Send Share Invitation'}
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Collaborators & Permissions</h2>
        {itinerary?.collaborators && itinerary.collaborators.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {itinerary.collaborators.map((collab) => (
              <li key={collab.id || collab.email} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{collab.email}</p>
                  <p className="text-xs text-gray-500">
                    Permission: <span className="capitalize font-semibold">{collab.permissionLevel}</span> | Status: <span className="capitalize text-green-600">{collab.status}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleRevoke(collab.email)}
                  className="text-sm text-red-600 hover:text-red-900 font-medium"
                >
                  Revoke Access
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No co-travelers invited yet.</p>
        )}
      </div>
    </div>
  );
}
