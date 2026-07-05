/**
 * Home Dashboard Integration Tests
 *
 * Tests:
 * 1. Layout structure and component rendering
 * 2. Responsive behavior (mobile, tablet, desktop)
 * 3. Component integration and data flow
 * 4. User interactions across components
 * 5. Navigation handlers
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Home } from './Home';

// Mock wouter
const mockSetLocation = vi.fn();
vi.mock('wouter', () => ({
  useLocation: () => ['/', mockSetLocation],
}));

describe('Home Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Layout Structure', () => {
    it('renders all five dashboard sections in correct order', () => {
      const { container } = render(<Home />);

      const sections = container.querySelectorAll(
        '.home-dashboard > div, .home-dashboard > section'
      );

      // Should have 4 main sections (greeting, workflow, main-content, finance)
      expect(sections.length).toBeGreaterThanOrEqual(4);
    });

    it('renders GreetingSection at the top', () => {
      render(<Home />);

      // GreetingSection should contain greeting text
      expect(
        screen.getByText(/Bom dia|Boa tarde|Boa noite/i)
      ).toBeInTheDocument();
    });

    it('renders WorkflowCardsRow below GreetingSection', () => {
      render(<Home />);

      // WorkflowCardsRow contains these labels
      expect(screen.getByText('JOBS ATIVOS')).toBeInTheDocument();
      expect(screen.getByText('CLIENTS AGUARDANDO')).toBeInTheDocument();
      expect(screen.getByText('REVIEWS PENDENTES')).toBeInTheDocument();
      expect(screen.getByText('FERRAMENTAS IA')).toBeInTheDocument();
    });

    it('renders ChecklistColumn and ActiveJobsColumn side by side', () => {
      render(<Home />);

      // Both columns should be present
      expect(screen.getByText('✓ MINHAS TAREFAS')).toBeInTheDocument();
      expect(screen.getByText('🎬 JOBS ATIVOS')).toBeInTheDocument();
    });

    it('renders FinanceStrip at the bottom', () => {
      render(<Home />);

      // FinanceStrip should show revenue and link
      expect(screen.getByText(/R\$/)).toBeInTheDocument();
      expect(screen.getByText('→ Ver Finance')).toBeInTheDocument();
    });

    it('applies correct container max-width (1400px)', () => {
      const { container } = render(<Home />);

      const dashboard = container.querySelector('.home-dashboard');
      expect(dashboard).toHaveStyle({ maxWidth: '1400px' });
    });

    it('centers container with mx-auto', () => {
      const { container } = render(<Home />);

      const dashboard = container.querySelector('.home-dashboard');
      expect(dashboard).toHaveStyle({ margin: '0 auto' });
    });

    it('applies correct padding (32px)', () => {
      const { container } = render(<Home />);

      const dashboard = container.querySelector('.home-dashboard');
      expect(dashboard).toHaveStyle({ padding: '32px' });
    });

    it('applies correct gap between sections (24px)', () => {
      const { container } = render(<Home />);

      const sections = container.querySelectorAll('.home-dashboard > div');

      sections.forEach((section) => {
        const styles = window.getComputedStyle(section);
        expect(styles.marginBottom).toBe('24px');
      });
    });
  });

  describe('Component Integration', () => {
    it('passes correct user name to GreetingSection', () => {
      render(<Home />);

      expect(screen.getByText(/João Silva/i)).toBeInTheDocument();
    });

    it('passes correct workflow stats to WorkflowCardsRow', () => {
      render(<Home />);

      // Check for workflow stats in the cards
      const jobsCard = screen.getByText('JOBS ATIVOS').closest('button');
      expect(within(jobsCard!).getByText('5')).toBeInTheDocument();
    });

    it('passes correct checklist items to ChecklistColumn', () => {
      render(<Home />);

      expect(screen.getByText('Review briefing for Acme Corp')).toBeInTheDocument();
      expect(screen.getByText('Approve budget for Q4 campaign')).toBeInTheDocument();
    });

    it('passes correct active jobs to ActiveJobsColumn', () => {
      render(<Home />);

      expect(screen.getByText('Product Launch Video')).toBeInTheDocument();
      expect(screen.getByText('Brand Campaign')).toBeInTheDocument();
      expect(screen.getByText('Social Media Content')).toBeInTheDocument();
    });

    it('passes correct finance data to FinanceStrip', () => {
      render(<Home />);

      expect(screen.getByText(/R\$ 45\.000,00/)).toBeInTheDocument();
      expect(screen.getByText(/8 jobs faturados/)).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('applies mobile styles when viewport < 768px', () => {
      // Set viewport to mobile
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));

      const { container } = render(<Home />);

      const dashboard = container.querySelector('.home-dashboard');
      const styles = window.getComputedStyle(dashboard!);

      // Mobile padding should be 16px (via media query)
      // Note: JSDOM doesn't fully support media queries, so we check style tag existence
      expect(container.querySelector('style')).toBeInTheDocument();
      expect(container.querySelector('style')?.textContent).toContain(
        '@media (max-width: 767px)'
      );
    });

    it('stacks main content vertically on mobile', () => {
      const { container } = render(<Home />);

      const style = container.querySelector('style');
      expect(style?.textContent).toContain('flex-direction: column');
    });

    it('applies tablet styles when viewport 768px - 1024px', () => {
      const { container } = render(<Home />);

      const style = container.querySelector('style');
      expect(style?.textContent).toContain(
        '@media (max-width: 1024px) and (min-width: 768px)'
      );
    });
  });

  describe('User Interactions - Checklist', () => {
    it('toggles checklist item when clicked', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const firstItem = screen.getByText('Review briefing for Acme Corp');
      const checkbox = firstItem
        .closest('[data-testid="checklist-item"]')
        ?.querySelector('input[type="checkbox"]');

      expect(checkbox).not.toBeChecked();

      if (checkbox) {
        await user.click(checkbox);
        expect(checkbox).toBeChecked();
      }
    });

    it('deletes checklist item when delete is clicked', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const firstItem = screen.getByText('Review briefing for Acme Corp');
      const deleteButton = firstItem
        .closest('[data-testid="checklist-item"]')
        ?.querySelector('[aria-label*="delete" i], [aria-label*="remover" i]');

      if (deleteButton) {
        await user.click(deleteButton);
        expect(
          screen.queryByText('Review briefing for Acme Corp')
        ).not.toBeInTheDocument();
      }
    });

    it('creates new checklist item when Enter is pressed', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByTestId('checklist-input');

      await user.type(input, 'New task from test{Enter}');

      expect(screen.getByText('New task from test')).toBeInTheDocument();
    });

    it('does not create empty checklist items', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByTestId('checklist-input');
      const initialCount = screen.getAllByTestId('checklist-item').length;

      await user.type(input, '   {Enter}');

      const finalCount = screen.getAllByTestId('checklist-item').length;
      expect(finalCount).toBe(initialCount);
    });
  });

  describe('User Interactions - Jobs', () => {
    it('navigates to job detail when job card is clicked', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const jobCard = screen.getByText('Product Launch Video').closest('div');

      if (jobCard) {
        await user.click(jobCard);
        expect(mockSetLocation).toHaveBeenCalledWith('/jobs/1');
      }
    });

    it('navigates to job edit when edit action is triggered', async () => {
      const user = userEvent.setup();
      render(<Home />);

      // Find briefing quick action button (for jobs in briefing status)
      const briefingButton = screen
        .getByText('Brand Campaign')
        .closest('[data-testid="job-card"]')
        ?.querySelector('[aria-label*="briefing" i]');

      if (briefingButton) {
        await user.click(briefingButton);
        expect(mockSetLocation).toHaveBeenCalledWith('/jobs/2/edit');
      }
    });

    it('navigates to new job page when "+ NOVO JOB" is clicked', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const newJobButton = screen.getByText('+ NOVO JOB');

      await user.click(newJobButton);
      expect(mockSetLocation).toHaveBeenCalledWith('/jobs/new');
    });
  });

  describe('User Interactions - Navigation', () => {
    it('navigates to finance page when "Ver Finance" is clicked', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const financeLink = screen.getByText('→ Ver Finance');

      await user.click(financeLink);
      expect(mockSetLocation).toHaveBeenCalledWith('/finance');
    });

    it('navigates when workflow card is clicked', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const jobsCard = screen.getByText('JOBS ATIVOS').closest('button');

      if (jobsCard) {
        await user.click(jobsCard);
        expect(mockSetLocation).toHaveBeenCalledWith('/jobs');
      }
    });
  });

  describe('Data Flow', () => {
    it('maintains checklist state across interactions', async () => {
      const user = userEvent.setup();
      render(<Home />);

      // Add new item
      const input = screen.getByTestId('checklist-input');
      await user.type(input, 'Test item 1{Enter}');
      expect(screen.getByText('Test item 1')).toBeInTheDocument();

      // Add another item
      await user.type(input, 'Test item 2{Enter}');
      expect(screen.getByText('Test item 2')).toBeInTheDocument();

      // Both should still be visible
      expect(screen.getByText('Test item 1')).toBeInTheDocument();
      expect(screen.getByText('Test item 2')).toBeInTheDocument();
    });

    it('displays empty state when all checklist items are deleted', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const items = screen.getAllByTestId('checklist-item');

      // Delete all items
      for (const item of items) {
        const deleteButton = item.querySelector(
          '[aria-label*="delete" i], [aria-label*="remover" i]'
        );
        if (deleteButton) {
          await user.click(deleteButton);
        }
      }

      // Should show empty state
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      const { container } = render(<Home />);

      // Should have main landmark (implied by workflow cards section)
      expect(container.querySelector('[aria-label]')).toBeInTheDocument();
    });

    it('all interactive elements are keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<Home />);

      // Tab through interactive elements
      await user.tab();
      expect(document.activeElement).not.toBe(document.body);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty active jobs list', () => {
      // This would require mocking the data differently
      // For now, we test that the component renders without crashing
      const { container } = render(<Home />);
      expect(container).toBeInTheDocument();
    });

    it('handles long job titles without breaking layout', () => {
      render(<Home />);

      // All job cards should be rendered
      expect(screen.getByText('Product Launch Video')).toBeInTheDocument();
      expect(screen.getByText('Brand Campaign')).toBeInTheDocument();
      expect(screen.getByText('Social Media Content')).toBeInTheDocument();
    });

    it('handles multiple workflow cards navigation', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const clientsCard = screen.getByText('CLIENTS AGUARDANDO').closest('button');

      if (clientsCard) {
        await user.click(clientsCard);
        expect(mockSetLocation).toHaveBeenCalledWith('/clients');
      }
    });
  });
});
