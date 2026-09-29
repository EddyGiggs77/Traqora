import React from 'react';

export interface TimelineEvent {
  type: string;
  at: string;
  actor: string;
  notes?: string;
}

export default function DisputeTimeline({ events }: { events: TimelineEvent[] }) {
  if (!events || events.length === 0) {
    return <div className="text-gray-500 text-sm">No timeline events recorded yet.</div>;
  }

  return (
    <div className="border-l-2 border-blue-200 ml-4 pl-4 space-y-6 my-4">
      {events.map((evt, idx) => (
        <div key={idx} className="relative flex items-start space-x-3">
          <div className="absolute -left-[23px] top-1 bg-blue-600 rounded-full w-3 h-3 ring-4 ring-white" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                {evt.type.replace('_', ' ')}
              </span>
              <span className="text-xs text-gray-400">{new Date(evt.at).toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-800 mt-1 font-medium">Actor: {evt.actor.slice(0, 8)}...</p>
            {evt.notes && <p className="text-sm text-gray-600 mt-0.5 bg-gray-50 p-2 rounded">{evt.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
