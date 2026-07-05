import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="dark" switchable={true}>
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

describe('Theme Toggle Integration - Task 1.2.4', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Reset document attributes
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');

    // Mock fetch for profile API
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ) as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('AC1: Theme toggle button present in TopNav', () => {
    it('should render theme toggle button in AppNavBar', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const themeButton = screen.getByTitle(/modo/i);
      expect(themeButton).toBeInTheDocument();
    });
  });

  describe('AC2: Clicking toggles between light and dark themes', () => {
    it('should toggle from dark to light theme', async () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const themeButton = screen.getByTitle(/modo escuro/i);

      // Initial state: dark theme shows Sun icon
      expect(screen.getByTitle(/modo escuro/i)).toBeInTheDocument();

      // Click to toggle
      fireEvent.click(themeButton);

      // Should now show dark mode title (Moon icon)
      await waitFor(() => {
        expect(screen.getByTitle(/modo claro/i)).toBeInTheDocument();
      });
    });

    it('should toggle back to dark theme when clicked again', async () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const themeButton = screen.getByTitle(/modo/i);

      // Click to light mode
      fireEvent.click(themeButton);
      await waitFor(() => {
        expect(screen.getByTitle(/modo claro/i)).toBeInTheDocument();
      });

      // Click to dark mode
      const updatedButton = screen.getByTitle(/modo/i);
      fireEvent.click(updatedButton);
      await waitFor(() => {
        expect(screen.getByTitle(/modo escuro/i)).toBeInTheDocument();
      });
    });
  });

  describe('AC3: Document root data-theme attribute updates', () => {
    it('should set data-theme="dark" on document root initially', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should update data-theme attribute when toggling theme', async () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const themeButton = screen.getByTitle(/modo/i);

      // Toggle to light
      fireEvent.click(themeButton);

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      });

      // Toggle back to dark
      fireEvent.click(themeButton);

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });
    });
  });

  describe('AC4: All glass components update colors', () => {
    it('should maintain dark class on root element for Tailwind compatibility', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove dark class when switching to light mode', async () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const themeButton = screen.getByTitle(/modo/i);
      fireEvent.click(themeButton);

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false);
      });
    });
  });

  describe('AC5: Theme preference saves to user profile', () => {
    it('should call API to save theme preference when toggling', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch');

      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const themeButton = screen.getByTitle(/modo/i);

      // Toggle theme
      fireEvent.click(themeButton);

      // Wait for API call
      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledWith(
          '/api/profile',
          expect.objectContaining({
            method: 'PUT',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
            body: expect.stringContaining('themePreference'),
            credentials: 'include',
          })
        );
      });
    });

    it('should not break theme toggle if API call fails', async () => {
      // Mock fetch to fail
      global.fetch = vi.fn(() =>
        Promise.reject(new Error('API Error'))
      ) as any;

      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const themeButton = screen.getByTitle(/modo/i);

      // Toggle should still work
      fireEvent.click(themeButton);

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      });
    });
  });

  describe('AC6: Theme persists across browser sessions', () => {
    it('should save theme to localStorage', async () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const themeButton = screen.getByTitle(/modo/i);
      fireEvent.click(themeButton);

      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBe('light');
      });
    });

    it('should load theme from localStorage on mount', () => {
      // Set localStorage before rendering
      localStorage.setItem('theme', 'light');

      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      // Should initialize with light theme from localStorage
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('AC7: Icon changes - Sun (light mode) ↔ Moon (dark mode)', () => {
    it('should show Sun icon in dark mode (to switch to light)', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      // In dark mode, button should have title indicating it switches to light
      const themeButton = screen.getByTitle(/modo escuro/i);
      expect(themeButton).toBeInTheDocument();
    });

    it('should show Moon icon in light mode (to switch to dark)', async () => {
      // Start with light theme
      localStorage.setItem('theme', 'light');

      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      await waitFor(() => {
        const themeButton = screen.getByTitle(/modo claro/i);
        expect(themeButton).toBeInTheDocument();
      });
    });
  });

  describe('AC8: Animation - smooth color transition 300ms ease', () => {
    it('should apply transition CSS to root element', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      // Check that transition styles are applied (via tokens.css)
      const style = window.getComputedStyle(document.documentElement);
      expect(style.getPropertyValue('transition-duration')).toBeTruthy();
    });
  });

  describe('AC9: No FOUC (Flash of Unstyled Content) on page load', () => {
    it('should immediately set data-theme attribute on first render', () => {
      localStorage.setItem('theme', 'light');

      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      // Theme should be set immediately, not after a delay
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should prevent theme change API call on initial mount', () => {
      const fetchSpy = vi.spyOn(global, 'fetch');

      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      // Should not call API on mount (only on user action)
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Integration with Design Tokens', () => {
    it('should work with CSS custom properties from tokens.css', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      // Verify data-theme attribute is set for CSS custom properties
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      // CSS custom properties should be accessible
      const style = window.getComputedStyle(document.documentElement);
      expect(style.getPropertyValue('--duration-normal')).toBeTruthy();
    });

    it('should switch theme which updates CSS custom properties', async () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const themeButton = screen.getByTitle(/modo/i);

      // Initial dark theme
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      // Toggle to light
      fireEvent.click(themeButton);

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      });
    });
  });

  describe('TopNav Integration', () => {
    it('should have theme toggle button in the correct position in TopNav', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const header = screen.getByRole('banner');
      const themeButton = screen.getByTitle(/modo/i);

      // Theme button should be within the header
      expect(header).toContainElement(themeButton);
    });

    it('should apply glass nav styling to TopNav', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('frame-nav');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible title for theme toggle button', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const themeButton = screen.getByTitle(/modo/i);
      expect(themeButton).toHaveAttribute('title');
      expect(themeButton).toHaveAttribute('type', 'button');
    });

    it('should be keyboard accessible', () => {
      render(
        <AllProviders>
          <AppNavBar />
        </AllProviders>
      );

      const themeButton = screen.getByTitle(/modo/i);

      // Should be focusable
      themeButton.focus();
      expect(document.activeElement).toBe(themeButton);
    });
  });
});
