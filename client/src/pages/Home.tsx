/**
 * Home Dashboard Page
 *
 * Integrates all dashboard components into a responsive layout:
 * 1. GreetingSection (full width)
 * 2. WorkflowCardsRow (4-col grid)
 * 3. ChecklistColumn (30%) + ActiveJobsColumn (70%)
 * 4. FinanceStrip (full width)
 *
 * Layout Structure:
 * ┌─────────────────────────────────────────────┐
 * │  1. GreetingSection (full width)            │
 * ├─────────────────────────────────────────────┤
 * │  2. WorkflowCardsRow (4-col grid)           │
 * │     [Jobs] [Clients] [Reviews] [Studio]     │
 * ├──────────────┬──────────────────────────────┤
 * │ 3a.Checklist │ 3b. Active Jobs Column      │
 * │    (30%)     │     (70%)                    │
 * │              │                              │
 * │ [Tasks]      │ [Job Cards List]            │
 * │              │ [+ NOVO JOB button]          │
 * ├──────────────┴──────────────────────────────┤
 * │  4. FinanceStrip (full width)               │
 * └─────────────────────────────────────────────┘
 *
 * Responsive:
 * - Mobile (< 768px): All stacked vertically
 * - Tablet (768px - 1024px): WorkflowCards 2 cols, Main content stacked
 * - Desktop (> 1024px): Full layout as shown above
 */

import * as React from 'react';
import { useLocation } from 'wouter';
import { GreetingSection } from '@/components/dashboard/GreetingSection';
import { WorkflowCardsRow } from '@/components/dashboard/WorkflowCardsRow';
import { ChecklistColumn } from '@/components/dashboard/ChecklistColumn';
import { ActiveJobsColumn } from '@/components/dashboard/ActiveJobsColumn';
import { FinanceStrip } from '@/components/dashboard/FinanceStrip';
import SkeletonLoader from '@/components/dashboard/SkeletonLoader';
import { useDashboardData } from '@/hooks/useDashboardData';
import type { WorkflowStats } from '@/components/dashboard/WorkflowCardsRow';
import type { ChecklistTask } from '@/components/dashboard/ChecklistColumn';
import type { Job } from '@/components/dashboard/JobCard';

export interface DashboardData {
  user: {
    name: string;
  };
  workflowStats: WorkflowStats;
  checklistItems: ChecklistTask[];
  activeJobs: Job[];
  financeStrip: {
    monthlyRevenue: number;
    jobsCompleted: number;
  };
}

export function Home() {
  const [, setLocation] = useLocation();

  // Load dashboard data with caching and loading states
  const {
    data,
    loading,
    error,
    refresh,
    updateChecklist,
    addChecklistItem,
    deleteChecklistItem,
  } = useDashboardData();

  // Handlers
  const handleChecklistToggle = (id: string) => {
    const item = data?.checklistItems.find((item) => item.id === id);
    if (item) {
      updateChecklist(id, { checked: !item.checked });
    }
  };

  const handleChecklistDelete = (id: string) => {
    deleteChecklistItem(id);
  };

  const handleChecklistCreate = (text: string) => {
    addChecklistItem(text);
  };

  const handleJobView = (id: string) => {
    setLocation(`/jobs/${id}`);
  };

  const handleJobEdit = (id: string) => {
    setLocation(`/jobs/${id}/edit`);
  };

  const handleJobCreateNew = () => {
    setLocation('/jobs/new');
  };

  const handleViewFinance = () => {
    setLocation('/finance');
  };

  // Show loading state
  if (loading) {
    return (
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '32px',
        }}
      >
        <SkeletonLoader />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '32px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            padding: '40px',
            borderRadius: '16px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}
        >
          <h2 style={{ color: 'var(--ds-text-1)', marginBottom: '16px' }}>
            Erro ao carregar dashboard
          </h2>
          <p style={{ color: 'var(--ds-text-2)', marginBottom: '24px' }}>
            {error}
          </p>
          <button
            onClick={refresh}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: '#FF6B00',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Data must exist at this point
  if (!data) {
    return null;
  }

  return (
    <div
      className="home-dashboard"
      style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px',
      }}
    >
      {/* 1. Greeting Section - Full Width */}
      <div
        style={{
          marginBottom: '24px',
        }}
      >
        <GreetingSection
          userName={data.user.name}
          currentDate={new Date()}
          showGlassEffect={true}
        />
      </div>

      {/* 2. Workflow Cards Row - 4-column Grid */}
      <div
        style={{
          marginBottom: '24px',
        }}
      >
        <WorkflowCardsRow workflowStats={data.workflowStats} />
      </div>

      {/* 3. Main Content - 2-column Grid (30% | 70%) */}
      <div
        className="main-content-grid"
        style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '24px',
        }}
      >
        {/* 3a. Checklist Column - 30% */}
        <ChecklistColumn
          items={data.checklistItems}
          onToggle={handleChecklistToggle}
          onDelete={handleChecklistDelete}
          onCreate={handleChecklistCreate}
        />

        {/* 3b. Active Jobs Column - 70% */}
        <div
          style={{
            flex: '1',
          }}
        >
          <ActiveJobsColumn
            jobs={data.activeJobs}
            onEdit={handleJobEdit}
            onView={handleJobView}
            onCreateNew={handleJobCreateNew}
          />
        </div>
      </div>

      {/* 4. Finance Strip - Full Width */}
      <FinanceStrip
        monthlyRevenue={data.financeStrip.monthlyRevenue}
        jobsCompleted={data.financeStrip.jobsCompleted}
        onViewFinance={handleViewFinance}
      />

      {/* Responsive Styles */}
      <style>{`
        /* Desktop (default) - already defined inline */

        /* Tablet (768px - 1024px) */
        @media (max-width: 1024px) and (min-width: 768px) {
          .main-content-grid {
            flex-direction: column !important;
          }

          .main-content-grid > * {
            width: 100% !important;
          }
        }

        /* Mobile (< 768px) */
        @media (max-width: 767px) {
          .home-dashboard {
            padding: 16px !important;
          }

          .main-content-grid {
            flex-direction: column !important;
          }

          .main-content-grid > * {
            width: 100% !important;
          }
        }

        /* Smooth scrolling for the entire page */
        .home-dashboard {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}

export default Home;
