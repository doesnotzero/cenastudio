/**
 * JobCard Component
 *
 * Reusable job card component showing job details with status-specific border colors,
 * urgency indicators, progress tracking, and quick action buttons.
 *
 * Features:
 * - Status-based border color (briefing, production, review, delivered)
 * - Urgency indicator for jobs with < 3 days remaining
 * - Progress bar with status-matched color
 * - Quick action buttons (Briefing, Review, Hub)
 * - Hover lift animation
 * - Glass effect via GlassCard wrapper
 * - Clickable card with button click event isolation
 *
 * @example
 * ```tsx
 * <JobCard
 *   job={{
 *     id: '1',
 *     title: 'Product Launch Video',
 *     client: 'Acme Corp',
 *     status: 'production',
 *     deadline: '2024-12-31',
 *     daysLeft: 2,
 *     progress: 65,
 *     urgent: true
 *   }}
 *   onQuickAction={(action, jobId) => console.log(action, jobId)}
 *   onCardClick={(jobId) => navigate(`/jobs/${jobId}`)}
 * />
 * ```
 */

import React from 'react';
import { GlassCard } from '@/components/base/GlassCard';
import { ProgressBar } from '@/components/base/ProgressBar';
import { QuickActionButton } from '@/components/base/QuickActionButton';

export type JobStatus = 'briefing' | 'production' | 'review' | 'delivered';

export interface Job {
  id: string;
  title: string;
  client: string;
  status: JobStatus;
  deadline: string; // ISO date string or formatted date
  daysLeft: number;
  progress: number; // 0-100
  urgent?: boolean; // Automatically true when daysLeft < 3
}

export interface JobCardProps {
  job: Job;
  onQuickAction?: (action: 'briefing' | 'review' | 'hub', jobId: string) => void;
  onCardClick?: (jobId: string) => void;
  className?: string;
}

/**
 * Status color mapping for borders and progress bars
 */
const STATUS_COLORS: Record<JobStatus, string> = {
  briefing: '#f59e0b', // amber-500
  production: '#FF6B00', // orange primary
  review: '#3b82f6', // blue-500
  delivered: '#10b981', // green-500
};

/**
 * JobCard Component
 */
export const JobCard: React.FC<JobCardProps> = ({
  job,
  onQuickAction,
  onCardClick,
  className = '',
}) => {
  const { id, title, client, status, deadline, daysLeft, progress, urgent } = job;
  const isUrgent = urgent || daysLeft < 3;
  const borderColor = STATUS_COLORS[status];

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(id);
    }
  };

  const handleQuickAction = (action: 'briefing' | 'review' | 'hub') => (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    // Prevent card click event
    e.stopPropagation();
    if (onQuickAction) {
      onQuickAction(action, id);
    }
  };

  return (
    <GlassCard
      hover
      onClick={handleCardClick}
      className={`job-card ${className}`}
      padding="lg"
      borderRadius="16px"
    >
      <div style={{ position: 'relative' }}>
        {/* Status Border */}
        <div
          style={{
            position: 'absolute',
            left: '-24px',
            top: 0,
            bottom: 0,
            width: '2px',
            backgroundColor: borderColor,
          }}
        />

        {/* Card Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Title */}
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              margin: 0,
              color: 'var(--plan-text-primary, #000)',
            }}
            title={title}
          >
            {title}
          </h3>

          {/* Client */}
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--plan-text-secondary, #6b7280)',
              margin: 0,
            }}
          >
            Cliente: {client}
          </p>

          {/* Deadline & Days Left */}
          <div
            style={{
              fontSize: '0.875rem',
              color: isUrgent ? '#ef4444' : 'var(--plan-text-secondary, #6b7280)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isUrgent && (
              <span role="img" aria-label="urgent" style={{ fontSize: '0.75rem' }}>
                🔴
              </span>
            )}
            <span>
              Deadline: {deadline} ({daysLeft} dias)
            </span>
          </div>

          {/* Progress Bar */}
          <ProgressBar value={progress} color={borderColor} showPercentage />

          {/* Quick Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginTop: '8px',
            }}
          >
            <QuickActionButton
              variant="ghost"
              size="sm"
              label="Briefing"
              onClick={handleQuickAction('briefing')}
            />
            <QuickActionButton
              variant="ghost"
              size="sm"
              label="Review"
              onClick={handleQuickAction('review')}
            />
            <QuickActionButton
              variant="ghost"
              size="sm"
              label="Hub"
              onClick={handleQuickAction('hub')}
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default JobCard;
