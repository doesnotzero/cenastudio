/**
 * CreateJobModal Usage Examples
 *
 * Demonstrates how to integrate CreateJobModal with ActiveJobsColumn
 * and handle job creation flow.
 */

import React, { useState, useEffect } from 'react';
import { ActiveJobsColumn } from '@/components/dashboard/ActiveJobsColumn';
import { CreateJobModal } from './CreateJobModal';
import { Job } from '@/components/dashboard/JobCard';
import { Client, api } from '@/lib/api';

/**
 * Example 1: Basic Integration with ActiveJobsColumn
 */
export function BasicJobCreationExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  // Fetch clients on mount
  useEffect(() => {
    api.clients
      .list()
      .then(setClients)
      .catch((error) => console.error('Error fetching clients:', error));
  }, []);

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleJobCreated = (newJob: Job) => {
    // Optimistic update: Add new job to list immediately
    setJobs([...jobs, newJob]);
    console.log('Job created:', newJob);
  };

  return (
    <div style={{ padding: '24px' }}>
      <ActiveJobsColumn
        jobs={jobs}
        onCreateNew={handleCreateNew}
        onView={(id) => console.log('View job:', id)}
        onEdit={(id) => console.log('Edit job:', id)}
      />
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleJobCreated}
        clients={clients}
      />
    </div>
  );
}

/**
 * Example 2: With Navigation on Success
 */
export function JobCreationWithNavigationExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const handleJobCreated = (newJob: Job) => {
    // Add to list
    setJobs([...jobs, newJob]);

    // Navigate to job details page
    // In real app: navigate(`/jobs/${newJob.id}`)
    console.log('Navigate to:', `/jobs/${newJob.id}`);
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>+ Create New Job</button>
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleJobCreated}
        clients={clients}
      />
    </>
  );
}

/**
 * Example 3: With Toast Notifications
 */
export function JobCreationWithToastExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  const handleJobCreated = (newJob: Job) => {
    // Show success toast (using sonner or similar)
    console.log('Toast: Job created successfully!', newJob.title);
    // toast.success(`Job "${newJob.title}" created successfully!`);
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Create Job</button>
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleJobCreated}
        clients={clients}
      />
    </>
  );
}

/**
 * Example 4: With React Query for Data Fetching and Mutations
 */
export function JobCreationWithReactQueryExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // In real app with React Query:
  // const { data: clients = [] } = useQuery('clients', api.clients.list);
  // const { mutate: createJob } = useMutation(api.jobs.create, {
  //   onSuccess: (newJob) => {
  //     queryClient.invalidateQueries('jobs');
  //   }
  // });

  const clients: Client[] = []; // Mock for example

  const handleJobCreated = (newJob: Job) => {
    // React Query mutation would handle cache invalidation
    console.log('Job created, cache invalidated:', newJob);
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Create Job</button>
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleJobCreated}
        clients={clients}
      />
    </>
  );
}

/**
 * Example 5: Standalone Modal (No ActiveJobsColumn)
 */
export function StandaloneModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h1>Jobs Management</h1>
      <button onClick={() => setIsOpen(true)}>+ Add New Job</button>

      <CreateJobModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={(job) => console.log('Created:', job)}
        clients={[
          { id: 1, name: 'Client A', company: 'Company A' },
          { id: 2, name: 'Client B', company: null },
        ]}
      />
    </div>
  );
}

/**
 * Example 6: Empty State Integration
 */
export function EmptyStateExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  return (
    <div>
      {/* ActiveJobsColumn shows empty state with "+ Criar Job" button */}
      <ActiveJobsColumn
        jobs={jobs}
        onCreateNew={() => setIsModalOpen(true)}
      />

      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newJob) => setJobs([newJob])}
        clients={[]}
      />
    </div>
  );
}

/**
 * Example 7: With Loading States
 */
export function JobCreationWithLoadingExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    setLoadingClients(true);
    api.clients
      .list()
      .then(setClients)
      .finally(() => setLoadingClients(false));
  }, []);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} disabled={loadingClients}>
        {loadingClients ? 'Loading...' : '+ Create Job'}
      </button>

      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clients={clients}
      />
    </>
  );
}

/**
 * Example 8: Complete Dashboard Integration
 */
export function CompleteDashboardExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Existing Project',
      client: 'Client A',
      status: 'production',
      deadline: '2024-12-31',
      daysLeft: 10,
      progress: 50,
      urgent: false,
    },
  ]);
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: 'Client A',
      company: 'Company A',
      email: 'contact@clienta.com',
      phone: null,
      tax_id: null,
      address: null,
      city: null,
      state: null,
      country: null,
      industry: null,
    },
    {
      id: 2,
      name: 'Client B',
      company: 'Company B',
      email: 'hello@clientb.com',
      phone: null,
      tax_id: null,
      address: null,
      city: null,
      state: null,
      country: null,
      industry: null,
    },
  ]);

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleJobCreated = (newJob: Job) => {
    setJobs([...jobs, newJob]);
    console.log('Job added to dashboard:', newJob);
  };

  const handleView = (id: string) => {
    console.log('Navigate to job details:', id);
  };

  const handleEdit = (id: string) => {
    console.log('Open edit modal for job:', id);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px' }}>Dashboard</h1>

      <ActiveJobsColumn
        jobs={jobs}
        onCreateNew={handleCreateNew}
        onView={handleView}
        onEdit={handleEdit}
      />

      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleJobCreated}
        clients={clients}
      />
    </div>
  );
}
