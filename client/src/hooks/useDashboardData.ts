/**
 * useDashboardData Hook
 *
 * Custom hook for loading and caching dashboard data.
 * Provides loading states, error handling, and automatic refresh.
 *
 * Features:
 * - Automatic data fetching on mount
 * - Loading and error states
 * - Manual refresh capability
 * - Optimistic updates for checklist operations
 * - 5-minute cache TTL
 *
 * @example
 * ```tsx
 * const { data, loading, error, refresh, updateChecklist } = useDashboardData();
 *
 * if (loading) return <SkeletonLoader />;
 * if (error) return <ErrorMessage error={error} />;
 * return <Dashboard data={data} />;
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import type { DashboardData } from '@/pages/Home';
import type { ChecklistTask } from '@/components/dashboard/ChecklistColumn';

// Cache configuration
const CACHE_KEY = 'dashboard-data';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  data: DashboardData;
  timestamp: number;
}

interface UseDashboardDataOptions {
  /** Enable automatic refresh on mount (default: true) */
  autoFetch?: boolean;
  /** Cache TTL in milliseconds (default: 5 minutes) */
  cacheTTL?: number;
  /** Polling interval in milliseconds (default: disabled) */
  pollingInterval?: number;
}

interface UseDashboardDataReturn {
  /** Dashboard data (null if loading or error) */
  data: DashboardData | null;
  /** Loading state */
  loading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Manually refresh data (bypasses cache) */
  refresh: () => Promise<void>;
  /** Update checklist item optimistically */
  updateChecklist: (id: string, updates: Partial<ChecklistTask>) => void;
  /** Add new checklist item optimistically */
  addChecklistItem: (text: string) => void;
  /** Delete checklist item optimistically */
  deleteChecklistItem: (id: string) => void;
}

/**
 * Fetch dashboard data from API
 */
async function fetchDashboardData(): Promise<DashboardData> {
  // Fetch all data in parallel for optimal performance
  const [stats, financeStrip, userInfo, checklistItems, activeJobs] = await Promise.all([
    api.dashboard.stats(),
    api.dashboard.financeStrip(),
    api.dashboard.userInfo(),
    api.checklist.list(),
    api.dashboard.jobsActive(),
  ]);

  return {
    user: { name: userInfo.name },
    workflowStats: {
      activeJobs: stats.activeJobs,
      clientsWaiting: stats.clientsWaiting,
      reviewsPending: stats.reviewsPending,
    },
    checklistItems: checklistItems.map((item) => ({
      id: item.id,
      text: item.text,
      checked: item.checked,
      link: item.link,
    })),
    activeJobs: activeJobs.map((job) => ({
      id: job.id,
      title: job.title,
      client: job.client,
      status: job.status as any,
      deadline: job.deadline,
      daysLeft: job.daysLeft,
      progress: job.progress,
      urgent: job.urgent,
    })),
    financeStrip: {
      monthlyRevenue: financeStrip.monthlyRevenue,
      jobsCompleted: financeStrip.jobsCompleted,
    },
  };
}

/**
 * Get cached data if valid
 */
function getCachedData(cacheTTL: number): DashboardData | null {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp }: CachedData = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age < cacheTTL) {
      return data;
    }

    // Cache expired
    sessionStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    return null;
  }
}

/**
 * Set cached data
 */
function setCachedData(data: DashboardData): void {
  try {
    const cached: CachedData = {
      data,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch (error) {
    // Ignore cache errors (quota exceeded, etc.)
    console.warn('Failed to cache dashboard data:', error);
  }
}

/**
 * Clear cached data
 */
export function clearDashboardCache(): void {
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignore errors
  }
}

/**
 * useDashboardData Hook
 */
export function useDashboardData(
  options: UseDashboardDataOptions = {}
): UseDashboardDataReturn {
  const {
    autoFetch = true,
    cacheTTL = CACHE_TTL,
    pollingInterval,
  } = options;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Polling timer ref
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetch data from API or cache
   */
  const fetchData = useCallback(
    async (bypassCache = false) => {
      try {
        setLoading(true);
        setError(null);

        // Try cache first (unless bypassing)
        if (!bypassCache) {
          const cached = getCachedData(cacheTTL);
          if (cached) {
            setData(cached);
            setLoading(false);
            return;
          }
        }

        // Fetch from API
        const freshData = await fetchDashboardData();
        setData(freshData);
        setCachedData(freshData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load dashboard data';
        setError(message);
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    },
    [cacheTTL]
  );

  /**
   * Manual refresh (bypasses cache)
   */
  const refresh = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  /**
   * Optimistic checklist update
   */
  const updateChecklist = useCallback(
    (id: string, updates: Partial<ChecklistTask>) => {
      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          checklistItems: prev.checklistItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        };
      });

      // API call with error handling
      api.checklist.update(id, updates).catch((error) => {
        console.error('Failed to update checklist item:', error);
        // Revert on error
        refresh();
      });
    },
    [refresh]
  );

  /**
   * Optimistic checklist add
   */
  const addChecklistItem = useCallback((text: string) => {
    const tempId = `temp-${Date.now()}`;
    const newItem: ChecklistTask = {
      id: tempId,
      text,
      checked: false,
    };

    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        checklistItems: [...prev.checklistItems, newItem],
      };
    });

    // API call with ID replacement
    api.checklist.create({ text }).then((savedItem) => {
      // Replace temp ID with real ID from server
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          checklistItems: prev.checklistItems.map(item =>
            item.id === tempId ? { ...item, id: savedItem.id } : item
          ),
        };
      });
    }).catch((error) => {
      console.error('Failed to create checklist item:', error);
      // Revert on error
      refresh();
    });
  }, [refresh]);

  /**
   * Optimistic checklist delete
   */
  const deleteChecklistItem = useCallback((id: string) => {
    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        checklistItems: prev.checklistItems.filter((item) => item.id !== id),
      };
    });

    // API call with error handling
    api.checklist.delete(id).catch((error) => {
      console.error('Failed to delete checklist item:', error);
      // Revert on error
      refresh();
    });
  }, [refresh]);

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  // Polling setup
  useEffect(() => {
    if (pollingInterval && pollingInterval > 0) {
      pollingTimerRef.current = setInterval(() => {
        fetchData();
      }, pollingInterval);

      return () => {
        if (pollingTimerRef.current) {
          clearInterval(pollingTimerRef.current);
        }
      };
    }
  }, [pollingInterval, fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    updateChecklist,
    addChecklistItem,
    deleteChecklistItem,
  };
}

export default useDashboardData;
