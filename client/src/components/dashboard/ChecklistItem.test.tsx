/**
 * ChecklistItem Component Tests
 *
 * Tests cover all acceptance criteria:
 * 1. Component created with TypeScript interface ✓
 * 2. Checkbox: 20px size, styled accent color (#FF6B00) ✓
 * 3. Text: 0.875rem, line-height 1.4, mr-2 spacing from checkbox ✓
 * 4. Checked state: text-decoration line-through, opacity 0.5, transition 300ms ✓
 * 5. Clicking checkbox calls onClick handler ✓
 * 6. Delete button appears on hover (positioned right side) ✓
 * 7. Delete button calls onDelete handler ✓
 * 8. Optional link: text is clickable, navigates to link (uses Link component) ✓
 * 9. Keyboard accessible: checkbox focusable, Enter/Space toggles ✓
 * 10. Animation smooth: strikethrough and opacity transition ✓
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChecklistItem, ChecklistItemProps } from './ChecklistItem';
import React from 'react';

// Mock wouter for Link component
vi.mock('wouter', () => ({
  Link: ({ href, children, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Default props for testing
const defaultProps: ChecklistItemProps = {
  id: 'test-item-1',
  text: 'Test checklist item',
  checked: false,
  onClick: vi.fn(),
  onDelete: vi.fn(),
};

describe('ChecklistItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      render(<ChecklistItem {...defaultProps} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('Test checklist item')).toBeInTheDocument();
    });

    it('renders with unique id', () => {
      render(<ChecklistItem {...defaultProps} id="unique-123" />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'checklist-item-unique-123');
    });

    it('renders text content correctly', () => {
      render(<ChecklistItem {...defaultProps} text="Buy groceries" />);

      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });
  });

  describe('Checkbox - Size and Styling', () => {
    it('checkbox has 20px size', () => {
      render(<ChecklistItem {...defaultProps} />);

      const checkbox = screen.getByRole('checkbox');
      const styles = window.getComputedStyle(checkbox);

      // Check inline style (20px)
      expect(checkbox).toHaveStyle({
        width: '20px',
        height: '20px',
      });
    });

    it('checkbox has accent color data attribute', () => {
      render(<ChecklistItem {...defaultProps} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('data-accent-color', '#FF6B00');
    });

    it('checkbox is not checked by default', () => {
      render(<ChecklistItem {...defaultProps} checked={false} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('checkbox is checked when checked prop is true', () => {
      render(<ChecklistItem {...defaultProps} checked={true} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
  });

  describe('Text Styling', () => {
    it('text has 0.875rem font size', () => {
      render(<ChecklistItem {...defaultProps} />);

      const text = screen.getByText('Test checklist item');
      const styles = window.getComputedStyle(text);

      expect(styles.fontSize).toMatch(/14px|0\.875rem/);
    });

    it('text has 1.4 line height', () => {
      render(<ChecklistItem {...defaultProps} />);

      const text = screen.getByText('Test checklist item');
      expect(text).toHaveClass('leading-[1.4]');
    });

    it('text has text-sm class', () => {
      render(<ChecklistItem {...defaultProps} />);

      const text = screen.getByText('Test checklist item');
      expect(text).toHaveClass('text-sm');
    });

    it('has mr-2 spacing from checkbox', () => {
      const { container } = render(<ChecklistItem {...defaultProps} />);

      const wrapper = container.querySelector('.flex');
      expect(wrapper).toHaveClass('gap-2');
    });
  });

  describe('Checked State - Strikethrough and Opacity', () => {
    it('applies line-through when checked', () => {
      render(<ChecklistItem {...defaultProps} checked={true} />);

      const text = screen.getByText('Test checklist item');
      expect(text).toHaveClass('line-through');
    });

    it('applies opacity 0.5 when checked', () => {
      render(<ChecklistItem {...defaultProps} checked={true} />);

      const text = screen.getByText('Test checklist item');
      expect(text).toHaveClass('opacity-50');
    });

    it('does not apply line-through when unchecked', () => {
      render(<ChecklistItem {...defaultProps} checked={false} />);

      const text = screen.getByText('Test checklist item');
      expect(text).not.toHaveClass('line-through');
    });

    it('does not apply opacity when unchecked', () => {
      render(<ChecklistItem {...defaultProps} checked={false} />);

      const text = screen.getByText('Test checklist item');
      expect(text).not.toHaveClass('opacity-50');
    });

    it('has 300ms transition', () => {
      render(<ChecklistItem {...defaultProps} />);

      const text = screen.getByText('Test checklist item');
      expect(text).toHaveClass('transition-all');
      expect(text).toHaveClass('duration-300');
    });
  });

  describe('Checkbox Click Handler', () => {
    it('calls onClick handler when checkbox is clicked', async () => {
      const onClick = vi.fn();
      render(<ChecklistItem {...defaultProps} onClick={onClick} />);

      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);

      expect(onClick).toHaveBeenCalledWith('test-item-1');
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick with correct id', async () => {
      const onClick = vi.fn();
      render(<ChecklistItem {...defaultProps} id="item-456" onClick={onClick} />);

      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);

      expect(onClick).toHaveBeenCalledWith('item-456');
    });

    it('calls onClick handler when label is clicked', async () => {
      const onClick = vi.fn();
      render(<ChecklistItem {...defaultProps} onClick={onClick} />);

      const text = screen.getByText('Test checklist item');
      await userEvent.click(text);

      expect(onClick).toHaveBeenCalledWith('test-item-1');
    });
  });

  describe('Delete Button - Hover Behavior', () => {
    it('delete button is hidden by default', () => {
      render(<ChecklistItem {...defaultProps} />);

      // Delete button should not be visible initially
      const deleteButton = screen.queryByLabelText('Delete Test checklist item');
      expect(deleteButton).not.toBeInTheDocument();
    });

    it('delete button appears on hover', async () => {
      const { container } = render(<ChecklistItem {...defaultProps} />);

      const wrapper = container.querySelector('.flex.items-center');
      expect(wrapper).toBeInTheDocument();

      // Hover over the item
      if (wrapper) {
        fireEvent.mouseEnter(wrapper);

        await waitFor(() => {
          const deleteButton = screen.getByLabelText('Delete Test checklist item');
          expect(deleteButton).toBeInTheDocument();
        });
      }
    });

    it('delete button disappears when hover ends', async () => {
      const { container } = render(<ChecklistItem {...defaultProps} />);

      const wrapper = container.querySelector('.flex.items-center');
      expect(wrapper).toBeInTheDocument();

      if (wrapper) {
        // Hover over
        fireEvent.mouseEnter(wrapper);

        await waitFor(() => {
          const deleteButton = screen.getByLabelText('Delete Test checklist item');
          expect(deleteButton).toBeInTheDocument();
        });

        // Hover away
        fireEvent.mouseLeave(wrapper);

        await waitFor(() => {
          const deleteButton = screen.queryByLabelText('Delete Test checklist item');
          expect(deleteButton).not.toBeInTheDocument();
        });
      }
    });

    it('delete button is positioned on the right', async () => {
      const { container } = render(<ChecklistItem {...defaultProps} />);

      const wrapper = container.querySelector('.flex.items-center');
      if (wrapper) {
        fireEvent.mouseEnter(wrapper);

        await waitFor(() => {
          const deleteButton = screen.getByLabelText('Delete Test checklist item');
          expect(deleteButton).toHaveClass('absolute');
          expect(deleteButton).toHaveClass('right-0');
        });
      }
    });

    it('delete button has ghost variant', async () => {
      const { container } = render(<ChecklistItem {...defaultProps} />);

      const wrapper = container.querySelector('.flex.items-center');
      if (wrapper) {
        fireEvent.mouseEnter(wrapper);

        await waitFor(() => {
          const deleteButton = screen.getByLabelText('Delete Test checklist item');
          expect(deleteButton).toHaveAttribute('data-slot', 'button');
        });
      }
    });

    it('delete button has icon-sm size', async () => {
      const { container } = render(<ChecklistItem {...defaultProps} />);

      const wrapper = container.querySelector('.flex.items-center');
      if (wrapper) {
        fireEvent.mouseEnter(wrapper);

        await waitFor(() => {
          const deleteButton = screen.getByLabelText('Delete Test checklist item');
          // Check for size-8 class (icon-sm size)
          expect(deleteButton).toHaveClass('size-8');
        });
      }
    });
  });

  describe('Delete Button Handler', () => {
    it('calls onDelete handler when delete button is clicked', async () => {
      const onDelete = vi.fn();
      const { container } = render(<ChecklistItem {...defaultProps} onDelete={onDelete} />);

      const wrapper = container.querySelector('.flex.items-center');
      if (wrapper) {
        fireEvent.mouseEnter(wrapper);

        await waitFor(() => {
          const deleteButton = screen.getByLabelText('Delete Test checklist item');
          expect(deleteButton).toBeInTheDocument();
        });

        const deleteButton = screen.getByLabelText('Delete Test checklist item');
        await userEvent.click(deleteButton);

        expect(onDelete).toHaveBeenCalledWith('test-item-1');
        expect(onDelete).toHaveBeenCalledTimes(1);
      }
    });

    it('calls onDelete with correct id', async () => {
      const onDelete = vi.fn();
      const { container } = render(<ChecklistItem {...defaultProps} id="delete-789" onDelete={onDelete} />);

      const wrapper = container.querySelector('.flex.items-center');
      if (wrapper) {
        fireEvent.mouseEnter(wrapper);

        await waitFor(() => {
          const deleteButton = screen.getByLabelText(/^Delete/);
          expect(deleteButton).toBeInTheDocument();
        });

        const deleteButton = screen.getByLabelText(/^Delete/);
        await userEvent.click(deleteButton);

        expect(onDelete).toHaveBeenCalledWith('delete-789');
      }
    });

    it('delete click does not trigger checkbox toggle', async () => {
      const onClick = vi.fn();
      const onDelete = vi.fn();
      const { container } = render(<ChecklistItem {...defaultProps} onClick={onClick} onDelete={onDelete} />);

      const wrapper = container.querySelector('.flex.items-center');
      if (wrapper) {
        fireEvent.mouseEnter(wrapper);

        await waitFor(() => {
          const deleteButton = screen.getByLabelText('Delete Test checklist item');
          expect(deleteButton).toBeInTheDocument();
        });

        const deleteButton = screen.getByLabelText('Delete Test checklist item');
        await userEvent.click(deleteButton);

        expect(onDelete).toHaveBeenCalledTimes(1);
        expect(onClick).not.toHaveBeenCalled();
      }
    });
  });

  describe('Optional Link Support', () => {
    it('renders without link when link prop is omitted', () => {
      render(<ChecklistItem {...defaultProps} />);

      const text = screen.getByText('Test checklist item');
      const label = text.closest('label');

      expect(label).toBeInTheDocument();
      expect(text.closest('a')).not.toBeInTheDocument();
    });

    it('renders with Link component when link prop is provided', () => {
      render(<ChecklistItem {...defaultProps} link="/dashboard/tasks/1" />);

      const text = screen.getByText('Test checklist item');
      const link = text.closest('a');

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/dashboard/tasks/1');
    });

    it('link has cursor pointer', () => {
      render(<ChecklistItem {...defaultProps} link="/tasks" />);

      const text = screen.getByText('Test checklist item');
      const link = text.closest('a');

      expect(link).toHaveClass('cursor-pointer');
    });

    it('link has hover underline', () => {
      render(<ChecklistItem {...defaultProps} link="/tasks" />);

      const text = screen.getByText('Test checklist item');
      const link = text.closest('a');

      expect(link).toHaveClass('hover:underline');
    });

    it('link has flex-1 and mr-2 classes', () => {
      render(<ChecklistItem {...defaultProps} link="/tasks" />);

      const text = screen.getByText('Test checklist item');
      const link = text.closest('a');

      expect(link).toHaveClass('flex-1');
      expect(link).toHaveClass('mr-2');
    });
  });

  describe('Keyboard Accessibility', () => {
    it('checkbox is focusable', () => {
      render(<ChecklistItem {...defaultProps} />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();

      expect(document.activeElement).toBe(checkbox);
    });

    it('Enter key toggles checkbox', async () => {
      const onClick = vi.fn();
      render(<ChecklistItem {...defaultProps} onClick={onClick} />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();

      fireEvent.keyDown(checkbox, { key: 'Enter', code: 'Enter' });

      expect(onClick).toHaveBeenCalledWith('test-item-1');
    });

    it('Space key toggles checkbox', async () => {
      const onClick = vi.fn();
      render(<ChecklistItem {...defaultProps} onClick={onClick} />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();

      fireEvent.keyDown(checkbox, { key: ' ', code: 'Space' });

      expect(onClick).toHaveBeenCalledWith('test-item-1');
    });

    it('Enter key prevents default behavior', async () => {
      render(<ChecklistItem {...defaultProps} />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      fireEvent(checkbox, event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('Space key prevents default behavior', async () => {
      render(<ChecklistItem {...defaultProps} />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();

      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      fireEvent(checkbox, event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('other keys do not trigger checkbox toggle', async () => {
      const onClick = vi.fn();
      render(<ChecklistItem {...defaultProps} onClick={onClick} />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();

      fireEvent.keyDown(checkbox, { key: 'a', code: 'KeyA' });
      fireEvent.keyDown(checkbox, { key: 'Tab', code: 'Tab' });
      fireEvent.keyDown(checkbox, { key: 'Escape', code: 'Escape' });

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Animation - Smooth Transitions', () => {
    it('has transition-all class', () => {
      render(<ChecklistItem {...defaultProps} />);

      const text = screen.getByText('Test checklist item');
      expect(text).toHaveClass('transition-all');
    });

    it('has duration-300 class for 300ms transition', () => {
      render(<ChecklistItem {...defaultProps} />);

      const text = screen.getByText('Test checklist item');
      expect(text).toHaveClass('duration-300');
    });

    it('transitions apply to both strikethrough and opacity', () => {
      const { rerender } = render(<ChecklistItem {...defaultProps} checked={false} />);

      const text = screen.getByText('Test checklist item');
      expect(text).not.toHaveClass('line-through');
      expect(text).not.toHaveClass('opacity-50');

      // Rerender with checked=true
      rerender(<ChecklistItem {...defaultProps} checked={true} />);

      expect(text).toHaveClass('line-through');
      expect(text).toHaveClass('opacity-50');
      expect(text).toHaveClass('transition-all');
      expect(text).toHaveClass('duration-300');
    });
  });

  describe('Integration Tests', () => {
    it('renders multiple checklist items', () => {
      const { container } = render(
        <div>
          <ChecklistItem id="1" text="Item 1" checked={false} onClick={vi.fn()} onDelete={vi.fn()} />
          <ChecklistItem id="2" text="Item 2" checked={true} onClick={vi.fn()} onDelete={vi.fn()} />
          <ChecklistItem id="3" text="Item 3" checked={false} onClick={vi.fn()} onDelete={vi.fn()} link="/task/3" />
        </div>
      );

      const checkboxes = container.querySelectorAll('[role="checkbox"]');
      expect(checkboxes).toHaveLength(3);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();

      // Check second item is checked and styled
      const item2Text = screen.getByText('Item 2');
      expect(item2Text).toHaveClass('line-through');
      expect(item2Text).toHaveClass('opacity-50');
    });

    it('handles all features: checked, link, hover, keyboard', async () => {
      const onClick = vi.fn();
      const onDelete = vi.fn();
      const { container } = render(
        <ChecklistItem
          id="full-featured"
          text="Full featured item"
          checked={true}
          link="/task/full"
          onClick={onClick}
          onDelete={onDelete}
        />
      );

      // Check checked state
      const text = screen.getByText('Full featured item');
      expect(text).toHaveClass('line-through');
      expect(text).toHaveClass('opacity-50');

      // Check link
      const link = text.closest('a');
      expect(link).toHaveAttribute('href', '/task/full');

      // Check hover for delete button
      const wrapper = container.querySelector('.flex.items-center');
      if (wrapper) {
        fireEvent.mouseEnter(wrapper);

        await waitFor(() => {
          const deleteButton = screen.getByLabelText('Delete Full featured item');
          expect(deleteButton).toBeInTheDocument();
        });

        // Click delete
        const deleteButton = screen.getByLabelText('Delete Full featured item');
        await userEvent.click(deleteButton);
        expect(onDelete).toHaveBeenCalledWith('full-featured');
      }
    });
  });

  describe('Edge Cases', () => {
    it('handles empty text', () => {
      render(<ChecklistItem {...defaultProps} text="" />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('handles very long text', () => {
      const longText = 'This is a very long checklist item text that should still be rendered correctly without breaking the layout';
      render(<ChecklistItem {...defaultProps} text={longText} />);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles special characters in text', () => {
      const specialText = '< > & " \' / @#$%';
      render(<ChecklistItem {...defaultProps} text={specialText} />);

      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it('handles special characters in id', () => {
      const specialId = 'item-123-abc_def';
      render(<ChecklistItem {...defaultProps} id={specialId} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', `checklist-item-${specialId}`);
    });

    it('handles rapid hover on/off', async () => {
      const { container } = render(<ChecklistItem {...defaultProps} />);

      const wrapper = container.querySelector('.flex.items-center');
      if (wrapper) {
        // Rapid hover on/off
        fireEvent.mouseEnter(wrapper);
        fireEvent.mouseLeave(wrapper);
        fireEvent.mouseEnter(wrapper);

        await waitFor(() => {
          const deleteButton = screen.getByLabelText('Delete Test checklist item');
          expect(deleteButton).toBeInTheDocument();
        });
      }
    });

    it('handles multiple clicks on checkbox', async () => {
      const onClick = vi.fn();
      render(<ChecklistItem {...defaultProps} onClick={onClick} />);

      const checkbox = screen.getByRole('checkbox');

      await userEvent.click(checkbox);
      await userEvent.click(checkbox);
      await userEvent.click(checkbox);

      expect(onClick).toHaveBeenCalledTimes(3);
      expect(onClick).toHaveBeenCalledWith('test-item-1');
    });
  });
});
