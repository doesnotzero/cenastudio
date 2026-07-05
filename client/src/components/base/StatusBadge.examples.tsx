/**
 * StatusBadge Component Examples
 *
 * This file demonstrates various use cases for the StatusBadge component.
 * Can be used for manual testing and as documentation.
 */

import React from 'react';
import { StatusBadge } from './StatusBadge';

// Example icons (in production, these would come from lucide-react or similar)
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/**
 * StatusBadge Examples Component
 */
export const StatusBadgeExamples: React.FC = () => {
  return (
    <div className="p-8 space-y-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold mb-2">StatusBadge Component</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Semantic status badges with 5 color types, optional icons, and pulse animation.
        </p>
      </div>

      {/* Basic Types */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Basic Types</h2>
        <div className="flex flex-wrap gap-3">
          <StatusBadge type="success" text="Success" />
          <StatusBadge type="warning" text="Warning" />
          <StatusBadge type="danger" text="Danger" />
          <StatusBadge type="info" text="Info" />
          <StatusBadge type="neutral" text="Neutral" />
        </div>
      </section>

      {/* With Icons */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">With Icons</h2>
        <div className="flex flex-wrap gap-3">
          <StatusBadge type="success" text="Completed" icon={<CheckIcon />} />
          <StatusBadge type="warning" text="Pending Review" icon={<AlertIcon />} />
          <StatusBadge type="danger" text="Failed" icon={<XIcon />} />
          <StatusBadge type="info" text="In Progress" icon={<InfoIcon />} />
          <StatusBadge type="neutral" text="On Hold" icon={<MinusIcon />} />
        </div>
      </section>

      {/* Size Variants */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Size Variants</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Small (sm)</p>
            <div className="flex flex-wrap gap-3">
              <StatusBadge type="success" text="Active" size="sm" />
              <StatusBadge type="warning" text="Pending" size="sm" icon={<AlertIcon />} />
              <StatusBadge type="danger" text="Error" size="sm" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Medium (md) - Default</p>
            <div className="flex flex-wrap gap-3">
              <StatusBadge type="success" text="Active" size="md" />
              <StatusBadge type="warning" text="Pending" size="md" icon={<AlertIcon />} />
              <StatusBadge type="danger" text="Error" size="md" />
            </div>
          </div>
        </div>
      </section>

      {/* With Pulse Animation */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Pulse Animation</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Use pulse to draw attention to important status changes
        </p>
        <div className="flex flex-wrap gap-3">
          <StatusBadge type="success" text="Recording" pulse icon={<CheckIcon />} />
          <StatusBadge type="warning" text="Processing" pulse icon={<AlertIcon />} />
          <StatusBadge type="danger" text="Critical" pulse icon={<XIcon />} />
          <StatusBadge type="info" text="Syncing" pulse icon={<InfoIcon />} />
        </div>
      </section>

      {/* Real-World Use Cases */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Real-World Use Cases</h2>
        <div className="space-y-6">
          {/* Job Status */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Job Status Tracking</h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge type="neutral" text="Briefing" size="sm" />
              <StatusBadge type="info" text="Em Produção" size="sm" icon={<InfoIcon />} pulse />
              <StatusBadge type="warning" text="Em Revisão" size="sm" icon={<AlertIcon />} />
              <StatusBadge type="success" text="Entregue" size="sm" icon={<CheckIcon />} />
              <StatusBadge type="danger" text="Cancelado" size="sm" icon={<XIcon />} />
            </div>
          </div>

          {/* User Status */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium mb-3">User/Account Status</h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge type="success" text="Online" pulse />
              <StatusBadge type="warning" text="Away" />
              <StatusBadge type="neutral" text="Offline" />
              <StatusBadge type="danger" text="Suspended" />
              <StatusBadge type="info" text="Trial Active" />
            </div>
          </div>

          {/* Payment Status */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Payment Status</h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge type="success" text="Paid" icon={<CheckIcon />} />
              <StatusBadge type="warning" text="Pending" icon={<AlertIcon />} />
              <StatusBadge type="danger" text="Overdue" icon={<XIcon />} pulse />
              <StatusBadge type="neutral" text="Draft" />
            </div>
          </div>

          {/* System Health */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium mb-3">System Health</h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge type="success" text="All Systems Operational" icon={<CheckIcon />} />
              <StatusBadge type="warning" text="Minor Issues" icon={<AlertIcon />} />
              <StatusBadge type="danger" text="Service Disruption" icon={<XIcon />} pulse />
              <StatusBadge type="info" text="Maintenance Mode" icon={<InfoIcon />} />
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Note */}
      <section className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold mb-2">♿ Accessibility</h3>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
          <li>Color is not the only indicator - always include descriptive text</li>
          <li>Pulse animation respects <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">prefers-reduced-motion</code></li>
          <li>Icons enhance meaning but text remains primary information</li>
          <li>High contrast ratios for text readability</li>
        </ul>
      </section>
    </div>
  );
};

export default StatusBadgeExamples;
