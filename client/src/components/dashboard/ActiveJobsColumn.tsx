/**
 * ActiveJobsColumn Component
 *
 * Displays a list of active job cards (status: briefing, production, review) with scroll
 * behavior, "+ NOVO JOB" button, and empty state.
 *
 * Features:
 * - Title: "🎬 JOBS ATIVOS"
 * - List of JobCard components ordered by deadline (soonest first)
 * - Scroll container: max-height 600px with overflow-y: auto
 * - "+ NOVO JOB" button at bottom (solid variant, orange)
 * - Empty state with "+ Criar Job" button
 * - Responsive: 70% width desktop, full width mobile
 * - Action handlers for play, edit, view, and create new
 *
 * @example
 * ```tsx
 * <ActiveJobsColumn
 *   jobs={activeJobs}
 *   onPlay={(id) => console.log('Play:', id)}
 *   onEdit={(id) => console.log('Edit:', id)}
 *   onView={(id) => navigate(`/jobs/${id}`)}
 *   onCreateNew={() => navigate('/jobs/new')}
 * />
 * ```
 */

import React from 'react';
import { JobCard, Job } from './JobCard';
import { Button } from '@/design-system/primitives/Button';

export interface ActiveJobsColumnProps {
  /** Array of active jobs to display */
  jobs: Job[];
  /** Handler for play action (currently not used in JobCard but included for future) */
  onPlay?: (id: string) => void;
  /** Handler for edit action (maps to 'briefing' quick action) */
  onEdit?: (id: string) => void;
  /** Handler for view action (clicking card or 'hub' quick action) */
  onView?: (id: string) => void;
  /** Handler for creating new job */
  onCreateNew: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ActiveJobsColumn Component
 */
export const ActiveJobsColumn: React.FC<ActiveJobsColumnProps> = ({
  jobs,
  onPlay,
  onEdit,
  onView,
  onCreateNew,
  className = '',
}) => {
  // Sort jobs by deadline (soonest first)
  // Parse dates and sort, handling various date formats
  const sortedJobs = React.useMemo(() => {
    return [...jobs].sort((a, b) => {
      // Use daysLeft as primary sort (lower = more urgent)
      return a.daysLeft - b.daysLeft;
    });
  }, [jobs]);

  // Quick action handler
  const handleQuickAction = (action: 'briefing' | 'review' | 'hub', jobId: string) => {
    if (action === 'briefing' && onEdit) {
      onEdit(jobId);
    } else if (action === 'hub' && onView) {
      onView(jobId);
    } else if (action === 'review' && onView) {
      // Review action also navigates to view
      onView(jobId);
    }
  };

  // Card click handler
  const handleCardClick = (jobId: string) => {
    if (onView) {
      onView(jobId);
    }
  };

  // Empty state
  if (jobs.length === 0) {
    return (
      <div
        className={`active-jobs-column ${className}`}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontSize: '0.875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: 0,
            color: 'var(--plan-text-primary, #000)',
          }}
        >
          🎬 JOBS ATIVOS
        </h2>

        {/* Empty State */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--plan-text-secondary, #6b7280)',
              margin: 0,
            }}
          >
            Nenhum job ativo. Crie seu primeiro job!
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={onCreateNew}
            aria-label="Criar primeiro job"
          >
            + Criar Job
          </Button>
        </div>

        <style>{`
          @media (min-width: 768px) {
            .active-jobs-column {
              width: 70%;
            }
          }
        `}</style>
      </div>
    );
  }

  // Jobs list
  return (
    <div
      className={`active-jobs-column ${className}`}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontSize: '0.875rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          margin: 0,
          color: 'var(--plan-text-primary, #000)',
        }}
      >
        🎬 JOBS ATIVOS
      </h2>

      {/* Scroll Container */}
      <div
        className="jobs-list-container"
        style={{
          maxHeight: '600px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          paddingRight: '4px', // Space for scrollbar
        }}
      >
        {sortedJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onQuickAction={handleQuickAction}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      {/* Create New Job Button */}
      <Button
        variant="primary"
        size="md"
        onClick={onCreateNew}
        style={{
          width: '100%',
          backgroundColor: 'var(--color-orange-primary, #FF6B00)',
        }}
        aria-label="Criar novo job"
      >
        + NOVO JOB
      </Button>

      <style>{`
        @media (min-width: 768px) {
          .active-jobs-column {
            width: 70%;
          }
        }

        /* Custom scrollbar styling */
        .jobs-list-container::-webkit-scrollbar {
          width: 6px;
        }

        .jobs-list-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
        }

        .jobs-list-container::-webkit-scrollbar-thumb {
          background: var(--color-orange-primary, #FF6B00);
          border-radius: 3px;
        }

        .jobs-list-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 107, 0, 0.8);
        }
      `}</style>
    </div>
  );
};

export default ActiveJobsColumn;
