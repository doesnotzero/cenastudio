/**
 * ActiveJobsColumn Component Examples
 *
 * Usage examples for the ActiveJobsColumn component demonstrating various states
 * and configurations.
 */

import React from 'react';
import { ActiveJobsColumn } from './ActiveJobsColumn';
import { Job } from './JobCard';

/**
 * Example 1: Basic Usage with Active Jobs
 */
export const BasicExample = () => {
  const activeJobs: Job[] = [
    {
      id: '1',
      title: 'Product Launch Video',
      client: 'Acme Corporation',
      status: 'production',
      deadline: '2024-12-31',
      daysLeft: 5,
      progress: 65,
      urgent: false,
    },
    {
      id: '2',
      title: 'Brand Refresh Campaign',
      client: 'Tech Startup Inc',
      status: 'briefing',
      deadline: '2024-12-25',
      daysLeft: 2,
      progress: 30,
      urgent: true,
    },
    {
      id: '3',
      title: 'Social Media Content',
      client: 'Marketing Agency',
      status: 'review',
      deadline: '2025-01-05',
      daysLeft: 10,
      progress: 80,
      urgent: false,
    },
  ];

  const handlePlay = (id: string) => {
    console.log('Play job:', id);
  };

  const handleEdit = (id: string) => {
    console.log('Edit job:', id);
    // Navigate to edit page or open edit modal
  };

  const handleView = (id: string) => {
    console.log('View job:', id);
    // Navigate to job details page
  };

  const handleCreateNew = () => {
    console.log('Create new job');
    // Navigate to job creation page or open modal
  };

  return (
    <ActiveJobsColumn
      jobs={activeJobs}
      onPlay={handlePlay}
      onEdit={handleEdit}
      onView={handleView}
      onCreateNew={handleCreateNew}
    />
  );
};

/**
 * Example 2: Empty State
 */
export const EmptyStateExample = () => {
  const handleCreateNew = () => {
    console.log('Create first job');
  };

  return <ActiveJobsColumn jobs={[]} onCreateNew={handleCreateNew} />;
};

/**
 * Example 3: Many Jobs (Scroll Behavior)
 */
export const ManyJobsExample = () => {
  const manyJobs: Job[] = Array.from({ length: 15 }, (_, i) => ({
    id: `job-${i + 1}`,
    title: `Project ${i + 1}`,
    client: `Client ${i + 1}`,
    status: (['briefing', 'production', 'review', 'delivered'] as const)[i % 4],
    deadline: `2024-12-${String(i + 15).padStart(2, '0')}`,
    daysLeft: i + 1,
    progress: Math.min((i + 1) * 7, 100),
    urgent: i < 3,
  }));

  const handleCreateNew = () => {
    console.log('Create new job');
  };

  return (
    <ActiveJobsColumn
      jobs={manyJobs}
      onCreateNew={handleCreateNew}
      onView={(id) => console.log('View:', id)}
      onEdit={(id) => console.log('Edit:', id)}
    />
  );
};

/**
 * Example 4: Urgent Jobs Only
 */
export const UrgentJobsExample = () => {
  const urgentJobs: Job[] = [
    {
      id: '1',
      title: 'Emergency Client Pitch',
      client: 'VIP Client',
      status: 'production',
      deadline: '2024-12-20',
      daysLeft: 1,
      progress: 45,
      urgent: true,
    },
    {
      id: '2',
      title: 'Last Minute Revisions',
      client: 'Important Account',
      status: 'review',
      deadline: '2024-12-21',
      daysLeft: 2,
      progress: 90,
      urgent: true,
    },
  ];

  return (
    <ActiveJobsColumn
      jobs={urgentJobs}
      onCreateNew={() => console.log('Create')}
      onView={(id) => console.log('View:', id)}
    />
  );
};

/**
 * Example 5: Integration with Router (wouter)
 */
export const WithRouterExample = () => {
  // Assuming you have wouter's useLocation hook
  // import { useLocation } from 'wouter';
  // const [, navigate] = useLocation();

  const jobs: Job[] = [
    {
      id: '1',
      title: 'Sample Project',
      client: 'Sample Client',
      status: 'production',
      deadline: '2024-12-25',
      daysLeft: 5,
      progress: 50,
    },
  ];

  const navigate = (path: string) => {
    console.log('Navigate to:', path);
    // Replace with actual navigation: navigate(path)
  };

  return (
    <ActiveJobsColumn
      jobs={jobs}
      onView={(id) => navigate(`/jobs/${id}`)}
      onEdit={(id) => navigate(`/jobs/${id}/edit`)}
      onCreateNew={() => navigate('/jobs/new')}
    />
  );
};

/**
 * Example 6: Custom Styling
 */
export const CustomStyledExample = () => {
  const jobs: Job[] = [
    {
      id: '1',
      title: 'Styled Project',
      client: 'Client A',
      status: 'briefing',
      deadline: '2024-12-30',
      daysLeft: 8,
      progress: 25,
    },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <ActiveJobsColumn
        jobs={jobs}
        onCreateNew={() => console.log('Create')}
        className="custom-active-jobs"
      />
    </div>
  );
};

/**
 * Example 7: Loading State (with skeleton or spinner)
 */
export const LoadingStateExample = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [jobs, setJobs] = React.useState<Job[]>([]);

  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobs([
        {
          id: '1',
          title: 'Loaded Project',
          client: 'Loaded Client',
          status: 'production',
          deadline: '2024-12-28',
          daysLeft: 6,
          progress: 55,
        },
      ]);
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <div>Loading active jobs...</div>;
  }

  return (
    <ActiveJobsColumn
      jobs={jobs}
      onCreateNew={() => console.log('Create')}
      onView={(id) => console.log('View:', id)}
    />
  );
};
