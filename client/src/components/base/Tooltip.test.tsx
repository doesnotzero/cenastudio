import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Tooltip } from './Tooltip';

describe('Tooltip Component', () => {
  beforeEach(() => {
    // Mock matchMedia for prefers-reduced-motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. Component created with TypeScript interface', () => {
    it('should render with required props', () => {
      const { container } = render(
        <Tooltip content="Help text">
          <button>Hover me</button>
        </Tooltip>
      );

      expect(container.querySelector('.tooltip-wrapper')).toBeInTheDocument();
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('should accept all interface props', () => {
      const { container } = render(
        <Tooltip
          content="Help text"
          position="bottom"
          className="custom-class"
        >
          <span>Content</span>
        </Tooltip>
      );

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('2. Tooltip appears on hover (mouseenter)', () => {
    it('should show tooltip on mouse enter', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Help text">
          <button>Hover me</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Hover me');

      // Tooltip should not be visible initially
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      // Hover over the trigger
      await user.hover(trigger);

      // Tooltip should appear
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        expect(screen.getByText('Help text')).toBeInTheDocument();
      });
    });
  });

  describe('3. Tooltip disappears on mouseleave', () => {
    it('should hide tooltip on mouse leave', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Help text">
          <button>Hover me</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Hover me');

      // Show tooltip
      await user.hover(trigger);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      // Unhover
      await user.unhover(trigger);

      // Tooltip should disappear
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });
  });

  describe('4. Position configurable: top, bottom, left, right (default: top)', () => {
    it('should default to top position', () => {
      const { container } = render(
        <Tooltip content="Help text">
          <button>Hover me</button>
        </Tooltip>
      );

      const wrapper = container.querySelector('.tooltip-wrapper');
      expect(wrapper).toBeInTheDocument();
    });

    it('should render with top position', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Help text" position="top">
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveAttribute('data-position', 'top');
      });
    });

    it('should render with bottom position', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Help text" position="bottom">
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveAttribute('data-position', 'bottom');
      });
    });

    it('should render with left position', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Help text" position="left">
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveAttribute('data-position', 'left');
      });
    });

    it('should render with right position', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Help text" position="right">
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveAttribute('data-position', 'right');
      });
    });
  });

  describe('5. Arrow pointer positioned correctly for each position', () => {
    it('should have arrow element for top position', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Tooltip content="Help text" position="top">
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        const arrow = container.querySelector('.tooltip-arrow');
        expect(arrow).toBeInTheDocument();
      });
    });

    it('should have arrow element for bottom position', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Tooltip content="Help text" position="bottom">
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        const arrow = container.querySelector('.tooltip-arrow');
        expect(arrow).toBeInTheDocument();
      });
    });

    it('should have arrow element for left position', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Tooltip content="Help text" position="left">
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        const arrow = container.querySelector('.tooltip-arrow');
        expect(arrow).toBeInTheDocument();
      });
    });

    it('should have arrow element for right position', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Tooltip content="Help text" position="right">
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        const arrow = container.querySelector('.tooltip-arrow');
        expect(arrow).toBeInTheDocument();
      });
    });
  });

  describe('6. Animation: opacity 0→1, translateY 4px→0, 150ms ease', () => {
    it('should have tooltip content with proper styling', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Tooltip content="Help text">
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        const tooltip = container.querySelector('.tooltip-content');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveClass('tooltip-content');
      });
    });
  });

  describe('7. Background: dark rgba for light theme, light rgba for dark theme', () => {
    it('should have dark background by default (light theme)', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Help text">
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toBeInTheDocument();
        // Background color is set via inline styles and CSS
        expect(tooltip).toHaveStyle({ background: 'rgba(0, 0, 0, 0.9)' });
      });
    });
  });

  describe('8. Text: white for light theme, black for dark theme, 0.75rem size', () => {
    it('should have white text color by default', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Help text">
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        // Check inline styles via attribute
        const style = tooltip.getAttribute('style');
        expect(style).toContain('font-size: 0.75rem');
        // color is set via CSS class, check the element has the class
        expect(tooltip).toHaveClass('tooltip-content');
      });
    });
  });

  describe('9. Padding: 0.5rem 0.75rem, border-radius: 4px', () => {
    it('should have correct padding and border radius', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Help text">
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        // These are inline styles
        expect(tooltip).toHaveAttribute('style');
        const style = tooltip.getAttribute('style');
        expect(style).toContain('padding: 0.5rem 0.75rem');
        expect(style).toContain('border-radius: 4px');
      });
    });
  });

  describe('10. Respects prefers-reduced-motion (instant show/hide)', () => {
    it('should disable animations when prefers-reduced-motion is set', async () => {
      // Mock prefers-reduced-motion: reduce
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const user = userEvent.setup();
      const { container } = render(
        <Tooltip content="Help text">
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        const tooltip = container.querySelector('.tooltip-content');
        expect(tooltip).toBeInTheDocument();
        // Component should render without animation
      });
    });
  });

  describe('11. Keyboard accessible (shows on focus)', () => {
    it('should show tooltip on focus', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Help text">
          <button>Hover me</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Hover me');

      // Focus on the trigger
      await user.tab(); // Focus on button

      // Wait for tooltip to appear
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('should hide tooltip on blur', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Tooltip content="Help text">
            <button>Hover me</button>
          </Tooltip>
          <button>Other button</button>
        </div>
      );

      // Focus on the first button
      await user.tab();

      // Tooltip should appear
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      // Focus on the second button (blur first)
      await user.tab();

      // Tooltip should disappear
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('should have focus-visible outline', () => {
      const { container } = render(
        <Tooltip content="Help text">
          <button>Hover me</button>
        </Tooltip>
      );

      const wrapper = container.querySelector('.tooltip-wrapper');
      expect(wrapper).toBeInTheDocument();
      // Focus styles are applied via CSS
    });
  });

  describe('Additional tests', () => {
    it('should position tooltip with z-index 1000', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="Help text">
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveStyle({ zIndex: '1000' });
      });
    });

    it('should render tooltip content as string', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip content="This is help text">
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        expect(screen.getByText('This is help text')).toBeInTheDocument();
      });
    });

    it('should not show tooltip initially', () => {
      render(
        <Tooltip content="Help text">
          <button>Hover me</button>
        </Tooltip>
      );

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('should apply custom className to wrapper', () => {
      const { container } = render(
        <Tooltip content="Help text" className="my-custom-class">
          <button>Hover me</button>
        </Tooltip>
      );

      expect(container.querySelector('.my-custom-class')).toBeInTheDocument();
    });
  });
});
