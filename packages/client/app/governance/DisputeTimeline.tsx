import React from 'react';

export interface TimelineEvent {
  title: string;
  date: string;
  description: string;
}

export const DisputeTimeline: React.FC<{ events: TimelineEvent[] }> = ({ events }) => {
  return (
    <div className="dispute-timeline">
      <h3>Dispute Resolution Timeline</h3>
      <ul>
        {events.map((evt, idx) => (
          <li key={idx} className="timeline-item">
            <h4>{evt.title}</h4>
            <span className="date">{evt.date}</span>
            <p>{evt.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
