/**
 * Example Integration: Navigation State Management with AppNavBar
 *
 * This file demonstrates how to integrate the navigation state management
 * utility with the AppNavBar component.
 *
 * NOTE: This is an example file for reference. The actual integration
 * should be done in the AppNavBar.tsx component.
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  manageNavigationState,
  createDefaultNavigationTabs,
  type NavTab,
} from './navigationState';

/**
 * Example 1: Basic Integration with React Component
 */
export function ExampleNavBar() {
  const [location, setLocation] = useLocation();
  const [tabs, setTabs] = useState<NavTab[]>(createDefaultNavigationTabs());

  // Update active tab whenever location changes
  useEffect(() => {
    const updatedTabs = manageNavigationState(location, tabs);
    setTabs(updatedTabs);
  }, [location]);

  return (
    <nav className="frame-nav">
      <div className="nav-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${tab.isActive ? 'active' : ''}`}
            onClick={() => setLocation(tab.path)}
            aria-current={tab.isActive ? 'page' : undefined}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

/**
 * Example 2: Integration with Browser History API
 *
 * This example shows how to handle browser back/forward buttons.
 */
export function ExampleNavBarWithHistory() {
  const [location, setLocation] = useLocation();
  const [tabs, setTabs] = useState<NavTab[]>(createDefaultNavigationTabs());

  useEffect(() => {
    // Handle initial load and navigation
    const updateActiveTabs = () => {
      const updatedTabs = manageNavigationState(window.location.pathname, tabs);
      setTabs(updatedTabs);
    };

    // Update on mount
    updateActiveTabs();

    // Listen for popstate (browser back/forward)
    window.addEventListener('popstate', updateActiveTabs);

    return () => {
      window.removeEventListener('popstate', updateActiveTabs);
    };
  }, [location]);

  const handleNavigation = (path: string) => {
    setLocation(path);
    // State will be updated by the useEffect above
  };

  return (
    <nav className="frame-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={tab.isActive ? 'active' : ''}
          onClick={() => handleNavigation(tab.path)}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </nav>
  );
}

/**
 * Example 3: Custom Hook for Navigation State
 *
 * This creates a reusable hook that can be used in any component.
 */
export function useNavigationState() {
  const [location] = useLocation();
  const [tabs, setTabs] = useState<NavTab[]>(createDefaultNavigationTabs());

  useEffect(() => {
    const updatedTabs = manageNavigationState(location, tabs);
    setTabs(updatedTabs);
  }, [location]);

  return { tabs, activeTab: tabs.find((t) => t.isActive) };
}

// Usage of the custom hook
export function ExampleComponentUsingHook() {
  const { tabs, activeTab } = useNavigationState();

  return (
    <div>
      <h1>Current Page: {activeTab?.label}</h1>
      <nav>
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={tab.path}
            className={tab.isActive ? 'active' : ''}
          >
            {tab.icon} {tab.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

/**
 * Example 4: Server-Side Rendering (SSR) Compatible
 *
 * This example shows how to handle SSR scenarios where the location
 * might come from the server.
 */
export function ExampleSSRNavBar({ initialPath }: { initialPath: string }) {
  const [location, setLocation] = useLocation();
  const [tabs, setTabs] = useState<NavTab[]>(() => {
    // Initialize with correct active state based on initial path
    return manageNavigationState(initialPath, createDefaultNavigationTabs());
  });

  useEffect(() => {
    // Update when client-side location changes
    if (location !== initialPath) {
      const updatedTabs = manageNavigationState(location, tabs);
      setTabs(updatedTabs);
    }
  }, [location]);

  return (
    <nav className="frame-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={tab.isActive ? 'active' : ''}
          onClick={() => setLocation(tab.path)}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </nav>
  );
}

/**
 * Example 5: Integration with Framer Motion for Animations
 *
 * This example adds smooth animations when tabs change.
 */
import { motion } from 'framer-motion';

export function ExampleAnimatedNavBar() {
  const [location, setLocation] = useLocation();
  const [tabs, setTabs] = useState<NavTab[]>(createDefaultNavigationTabs());

  useEffect(() => {
    const updatedTabs = manageNavigationState(location, tabs);
    setTabs(updatedTabs);
  }, [location]);

  return (
    <nav className="frame-nav">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          className={`nav-tab ${tab.isActive ? 'active' : ''}`}
          onClick={() => setLocation(tab.path)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="mr-1.5">{tab.icon}</span>
          {tab.label}
          {tab.isActive && (
            <motion.div
              className="active-indicator"
              layoutId="activeTab"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: '#FF6B00',
              }}
            />
          )}
        </motion.button>
      ))}
    </nav>
  );
}

/**
 * Example 6: Testing Helper Functions
 *
 * Helper functions for testing components that use navigation state.
 */
export function createTestNavigationState(activeTabId: string): NavTab[] {
  const tabs = createDefaultNavigationTabs();
  return tabs.map((tab) => ({
    ...tab,
    isActive: tab.id === activeTabId,
  }));
}

// Usage in tests:
// const tabs = createTestNavigationState('clients');
// expect(tabs.find(t => t.id === 'clients')?.isActive).toBe(true);

/**
 * Example 7: Validation and Error Handling
 *
 * Shows how to handle edge cases and validate state.
 */
import { validateSingleActiveTab } from './navigationState';

export function ExampleNavBarWithValidation() {
  const [location] = useLocation();
  const [tabs, setTabs] = useState<NavTab[]>(createDefaultNavigationTabs());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const updatedTabs = manageNavigationState(location, tabs);

      // Additional validation (already done internally, but shown for example)
      if (!validateSingleActiveTab(updatedTabs)) {
        throw new Error('Navigation state invariant violated');
      }

      setTabs(updatedTabs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Navigation state error:', err);
    }
  }, [location]);

  if (error) {
    return <div className="error">Navigation Error: {error}</div>;
  }

  return (
    <nav className="frame-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={tab.isActive ? 'active' : ''}
          disabled={!tab.isActive && error !== null}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </nav>
  );
}

/**
 * Example 8: Debug Mode
 *
 * Helpful for development to see which tab is active and why.
 */
import { extractTabIdFromPath } from './navigationState';

export function ExampleNavBarWithDebug({ debug = false }: { debug?: boolean }) {
  const [location] = useLocation();
  const [tabs, setTabs] = useState<NavTab[]>(createDefaultNavigationTabs());

  useEffect(() => {
    const tabId = extractTabIdFromPath(location);

    if (debug) {
      console.log('[Navigation Debug]', {
        currentPath: location,
        extractedTabId: tabId,
        tabsBeforeUpdate: tabs.map((t) => ({ id: t.id, isActive: t.isActive })),
      });
    }

    const updatedTabs = manageNavigationState(location, tabs);

    if (debug) {
      console.log('[Navigation Debug] After update:', {
        tabsAfterUpdate: updatedTabs.map((t) => ({ id: t.id, isActive: t.isActive })),
        activeTab: updatedTabs.find((t) => t.isActive)?.id,
      });
    }

    setTabs(updatedTabs);
  }, [location, debug]);

  return (
    <nav className="frame-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={tab.isActive ? 'active' : ''}
          data-tab-id={tab.id}
          data-active={tab.isActive}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </nav>
  );
}
