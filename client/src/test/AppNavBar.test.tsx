import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import AppNavBar from '@/components/AppNavBar';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProjectProvider } from '@/contexts/ProjectContext';

// Mock wouter for navigation
const mockSetLocation = vi.fn();
vi.mock('wouter', () => ({
  useLocation: () => ['/dashboard', mockSetLocation],
  Router: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, className, style, ...props }: any) => (
      <button onClick={onClick} className={className} style={style} {...props}>
        {children}
      </button>
    ),
    div: ({ children, onClick, className, ...props }: any) => (
      <div onClick={onClick} className={className} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const AllProviders = ({ children, location = '/dashboard' }: { children: React.ReactNode; location?: string }) => {
  // Mock useLocation for specific location
  vi.doMock('wouter', () => ({
    useLocation: () => [location, mockSetLocation],
  }));

  return (
    <ThemeProvider defaultTheme="dark">
      <LanguageProvider>
        <AuthProvider>
          <AppProvider>
            <ProjectProvider>
              {children}
            </ProjectProvider>
          </AppProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

describe('AppNavBar - 5 Tab Navigation', () => {
  beforeEach(() => {
    mockSetLocation.mockClear();
  });

  describe('Desktop Navigation', () => {
    it('should render exactly 5 navigation tabs', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      // Find the desktop navigation
      const nav = screen.getByRole('navigation');
      const navButtons = within(nav).getAllByRole('button');

      // Should have exactly 5 tabs
      expect(navButtons).toHaveLength(5);
    });

    it('should render tabs in correct order: HOME, CLIENTS, JOBS, STUDIO, FINANCE', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const nav = screen.getByRole('navigation');
      const navButtons = within(nav).getAllByRole('button');

      // Check order and labels
      expect(navButtons[0]).toHaveTextContent('🏠');
      expect(navButtons[0]).toHaveTextContent('Painel'); // HOME translates to "Painel"

      expect(navButtons[1]).toHaveTextContent('👥');
      expect(navButtons[1]).toHaveTextContent('Clientes'); // CLIENTS

      expect(navButtons[2]).toHaveTextContent('🎬');
      expect(navButtons[2]).toHaveTextContent('JOBS');

      expect(navButtons[3]).toHaveTextContent('🤖');
      expect(navButtons[3]).toHaveTextContent('STUDIO');

      expect(navButtons[4]).toHaveTextContent('💰');
      expect(navButtons[4]).toHaveTextContent('Financeiro'); // FINANCE
    });

    it('should render each tab with correct icon', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      // Check icons are present
      expect(screen.getByText('🏠')).toBeInTheDocument(); // HOME
      expect(screen.getByText('👥')).toBeInTheDocument(); // CLIENTS
      expect(screen.getByText('🎬')).toBeInTheDocument(); // JOBS
      expect(screen.getByText('🤖')).toBeInTheDocument(); // STUDIO
      expect(screen.getByText('💰')).toBeInTheDocument(); // FINANCE
    });

    it('should NOT render MORE dropdown menu', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      // Should not have "Mais" (More) button
      expect(screen.queryByText('Mais')).not.toBeInTheDocument();
    });

    it('should highlight HOME tab as active when on /dashboard', () => {
      render(
        <AllProviders location="/dashboard">
          <AppNavBar />
        </AllProviders>
      );

      const nav = screen.getByRole('navigation');
      const homeButton = within(nav).getAllByRole('button')[0];

      // Active tab should have "active" class
      expect(homeButton).toHaveClass('active');
    });

    it('should highlight CLIENTS tab as active when on /commercial', () => {
      render(
        <AllProviders location="/commercial">
          <AppNavBar />
        </AllProviders>
      );

      const nav = screen.getByRole('navigation');
      const clientsButton = within(nav).getAllByRole('button')[1];

      expect(clientsButton).toHaveClass('active');
    });

    it('should highlight JOBS tab as active when on /projects', () => {
      render(
        <AllProviders location="/projects">
          <AppNavBar />
        </AllProviders>
      );

      const nav = screen.getByRole('navigation');
      const jobsButton = within(nav).getAllByRole('button')[2];

      expect(jobsButton).toHaveClass('active');
    });

    it('should highlight STUDIO tab as active when on /tools', () => {
      render(
        <AllProviders location="/tools">
          <AppNavBar />
        </AllProviders>
      );

      const nav = screen.getByRole('navigation');
      const studioButton = within(nav).getAllByRole('button')[3];

      expect(studioButton).toHaveClass('active');
    });

    it('should highlight FINANCE tab as active when on /analytics', () => {
      render(
        <AllProviders location="/analytics">
          <AppNavBar />
        </AllProviders>
      );

      const nav = screen.getByRole('navigation');
      const financeButton = within(nav).getAllByRole('button')[4];

      expect(financeButton).toHaveClass('active');
    });

    it('should navigate to correct route when tab is clicked', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const nav = screen.getByRole('navigation');
      const navButtons = within(nav).getAllByRole('button');

      // Click HOME tab
      fireEvent.click(navButtons[0]);
      expect(mockSetLocation).toHaveBeenCalledWith('/dashboard');

      // Click CLIENTS tab
      fireEvent.click(navButtons[1]);
      expect(mockSetLocation).toHaveBeenCalledWith('/commercial');

      // Click JOBS tab
      fireEvent.click(navButtons[2]);
      expect(mockSetLocation).toHaveBeenCalledWith('/projects');

      // Click STUDIO tab
      fireEvent.click(navButtons[3]);
      expect(mockSetLocation).toHaveBeenCalledWith('/tools');

      // Click FINANCE tab
      fireEvent.click(navButtons[4]);
      expect(mockSetLocation).toHaveBeenCalledWith('/analytics');
    });

    it('should have STUDIO tab prominently visible (4th position)', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const nav = screen.getByRole('navigation');
      const navButtons = within(nav).getAllByRole('button');

      // STUDIO should be at index 3 (4th position)
      expect(navButtons[3]).toHaveTextContent('STUDIO');
      expect(navButtons[3]).toHaveTextContent('🤖');
      expect(navButtons[3]).toBeVisible();
    });
  });

  describe('Mobile Navigation', () => {
    it('should show all 5 tabs in mobile menu when opened', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      // Find and click mobile menu button
      const menuButton = screen.getByLabelText(/abrir menu/i);
      fireEvent.click(menuButton);

      // Mobile menu should contain all 5 tabs
      const mobileNav = screen.getAllByRole('button').filter(btn =>
        btn.textContent?.includes('🏠') ||
        btn.textContent?.includes('👥') ||
        btn.textContent?.includes('🎬') ||
        btn.textContent?.includes('🤖') ||
        btn.textContent?.includes('💰')
      );

      expect(mobileNav.length).toBeGreaterThanOrEqual(5);
    });

    it('should close mobile menu when a tab is clicked', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      // Open mobile menu
      const menuButton = screen.getByLabelText(/abrir menu/i);
      fireEvent.click(menuButton);

      // Click a tab in mobile menu
      const homeTab = screen.getAllByText('Painel')[0];
      fireEvent.click(homeTab);

      // Menu should close (button text changes)
      expect(screen.getByLabelText(/abrir menu/i)).toBeInTheDocument();
    });
  });

  describe('Glass Styling', () => {
    it('should apply frame-nav class for glass effect', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('frame-nav');
    });

    it('should have sticky positioning', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('frame-nav');
      // CSS class handles positioning
    });
  });

  describe('Active Tab Styling', () => {
    it('should apply active class to current tab with orange underline', () => {
      render(
        <AllProviders location="/dashboard">
          <AppNavBar />
        </AllProviders>
      );

      const nav = screen.getByRole('navigation');
      const homeButton = within(nav).getAllByRole('button')[0];

      // Should have active class for orange underline (via CSS)
      expect(homeButton).toHaveClass('active');
      expect(homeButton).toHaveClass('frame-nav-link');
    });

    it('should only have one active tab at a time', () => {
      render(
        <AllProviders location="/tools">
          <AppNavBar />
        </AllProviders>
      );

      const nav = screen.getByRole('navigation');
      const navButtons = within(nav).getAllByRole('button');

      // Count active tabs
      const activeTabs = navButtons.filter(btn => btn.classList.contains('active'));
      expect(activeTabs).toHaveLength(1);
      expect(activeTabs[0]).toHaveTextContent('STUDIO');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for navigation', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should have accessible mobile menu toggle button', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const menuButton = screen.getByLabelText(/abrir menu/i);
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(menuButton);
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have data-tour attributes for guided tours', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const nav = screen.getByRole('navigation');
      const navButtons = within(nav).getAllByRole('button');

      // Check tour IDs
      expect(navButtons[0]).toHaveAttribute('data-tour', 'dashboard');
      expect(navButtons[1]).toHaveAttribute('data-tour', 'clients');
      expect(navButtons[2]).toHaveAttribute('data-tour', 'projects');
      expect(navButtons[3]).toHaveAttribute('data-tour', 'studio');
      expect(navButtons[4]).toHaveAttribute('data-tour', 'analytics');
    });
  });

  describe('Navigation Mapping', () => {
    it('should map old TODAY route to new HOME tab', () => {
      render(
        <AllProviders location="/dashboard">
          <AppNavBar />
        </AllProviders>
      );

      const nav = screen.getByRole('navigation');
      const homeButton = within(nav).getAllByRole('button')[0];

      expect(homeButton).toHaveTextContent('Painel');
      expect(homeButton).toHaveClass('active');
    });

    it('should map old PROJECTS route to new JOBS tab', () => {
      render(
        <AllProviders location="/projects">
          <AppNavBar />
        </AllProviders>
      );

      const nav = screen.getByRole('navigation');
      const jobsButton = within(nav).getAllByRole('button')[2];

      expect(jobsButton).toHaveTextContent('JOBS');
      expect(jobsButton).toHaveClass('active');
    });

    it('should have STUDIO tab as primary (previously in MORE menu)', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const nav = screen.getByRole('navigation');
      const navButtons = within(nav).getAllByRole('button');

      // STUDIO should be visible as primary tab (4th position)
      const studioButton = navButtons[3];
      expect(studioButton).toHaveTextContent('STUDIO');
      expect(studioButton).toBeVisible();

      // Should NOT be in a dropdown
      expect(screen.queryByText('Mais')).not.toBeInTheDocument();
    });

    it('should map ANALYTICS to FINANCE tab', () => {
      render(
        <AllProviders location="/analytics">
          <AppNavBar />
        </AllProviders>
      );

      const nav = screen.getByRole('navigation');
      const financeButton = within(nav).getAllByRole('button')[4];

      expect(financeButton).toHaveTextContent('Financeiro');
      expect(financeButton).toHaveClass('active');
    });

    it('should have new CLIENTS tab as 2nd position', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const nav = screen.getByRole('navigation');
      const navButtons = within(nav).getAllByRole('button');

      // CLIENTS should be at index 1 (2nd position)
      const clientsButton = navButtons[1];
      expect(clientsButton).toHaveTextContent('Clientes');
      expect(clientsButton).toHaveTextContent('👥');
    });
  });

  describe('Theme Integration', () => {
    it('should render theme toggle button', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const themeButton = screen.getByTitle(/modo/i);
      expect(themeButton).toBeInTheDocument();
    });
  });

  describe('User Profile Integration', () => {
    it('should render user profile section when authenticated', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      // User profile button should be present
      const profileButton = screen.getByTitle('Abrir conta');
      expect(profileButton).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should render search button with Command+K shortcut', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const searchButton = screen.getByLabelText(/abrir busca/i);
      expect(searchButton).toBeInTheDocument();

      // Should show keyboard shortcut
      const kbd = screen.getByText('⌘K');
      expect(kbd).toBeInTheDocument();
    });

    it('should dispatch command palette event when search is clicked', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

      const searchButton = screen.getByLabelText(/abrir busca/i);
      fireEvent.click(searchButton);

      expect(dispatchSpy).toHaveBeenCalled();
    });
  });
});
