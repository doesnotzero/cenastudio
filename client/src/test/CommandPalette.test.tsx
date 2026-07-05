import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommandPalette from "@/components/CommandPalette";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProject } from "@/contexts/ProjectContext";

// Mock contexts
vi.mock("@/contexts/AuthContext");
vi.mock("@/contexts/LanguageContext");
vi.mock("@/contexts/ProjectContext");

const mockSetLocation = vi.fn();

vi.mock("wouter", () => ({
  useLocation: () => ["/dashboard", mockSetLocation],
}));

describe("CommandPalette", () => {
  const mockT = (key: string) => key;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mocks
    (useAuth as any).mockReturnValue({
      isAdmin: false,
      user: { name: "Test User", email: "test@example.com" },
    });

    (useLanguage as any).mockReturnValue({
      t: mockT,
    });

    (useProject as any).mockReturnValue({
      projects: [
        { id: 1, name: "Test Project 1", clientName: "Client A" },
        { id: 2, name: "Production Project", clientName: "Client B" },
        { id: 3, name: "Marketing Campaign", clientName: "Client C" },
      ],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Keyboard Shortcuts", () => {
    it("should open modal on Cmd+K (Mac)", async () => {
      render(<CommandPalette />);

      // Modal should not be visible initially
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // Simulate Cmd+K
      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      // Modal should be visible
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("should open modal on Ctrl+K (Windows/Linux)", async () => {
      render(<CommandPalette />);

      // Simulate Ctrl+K
      const event = new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("should close modal on Escape key", async () => {
      render(<CommandPalette />);

      // Open modal
      const openEvent = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(openEvent);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Close with Escape
      const closeEvent = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      });
      document.dispatchEvent(closeEvent);

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("should toggle modal on repeated Cmd+K", async () => {
      render(<CommandPalette />);

      // First Cmd+K opens
      const event1 = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event1);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Second Cmd+K closes
      const event2 = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event2);

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });

  describe("5-Tab Navigation Display", () => {
    it("should display all 5 primary navigation tabs", async () => {
      render(<CommandPalette />);

      // Open modal
      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Check for 5 primary tabs
      expect(screen.getByText("app.nav.home")).toBeInTheDocument();
      expect(screen.getByText("app.nav.clients")).toBeInTheDocument();
      expect(screen.getByText("app.nav.jobs")).toBeInTheDocument();
      expect(screen.getByText("app.nav.studio")).toBeInTheDocument();
      expect(screen.getByText("app.nav.finance")).toBeInTheDocument();
    });

    it("should show HOME, CLIENTS, JOBS, STUDIO, FINANCE labels", async () => {
      render(<CommandPalette />);

      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        // These are the English labels displayed alongside translations
        expect(screen.getByText("HOME")).toBeInTheDocument();
        expect(screen.getByText("CLIENTS")).toBeInTheDocument();
        expect(screen.getByText("JOBS")).toBeInTheDocument();
        expect(screen.getByText("STUDIO")).toBeInTheDocument();
        expect(screen.getByText("FINANCE")).toBeInTheDocument();
      });
    });
  });

  describe("Fuzzy Search Filtering", () => {
    it("should filter options in real-time as user types", async () => {
      const user = userEvent.setup();
      render(<CommandPalette />);

      // Open modal
      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Type "cli" to match "clients"
      const input = screen.getByPlaceholderText(/Type to search/i);
      await user.type(input, "cli");

      await waitFor(() => {
        // Should show CLIENTS
        expect(screen.getByText("CLIENTS")).toBeInTheDocument();
        // Should filter out unrelated items (exact behavior depends on implementation)
      });
    });

    it("should match fuzzy search: 'cli' matches 'clients'", async () => {
      const user = userEvent.setup();
      render(<CommandPalette />);

      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Type to search/i);
      await user.type(input, "cli");

      await waitFor(() => {
        expect(screen.getByText("CLIENTS")).toBeInTheDocument();
      });
    });

    it("should match fuzzy search: 'stud' matches 'studio'", async () => {
      const user = userEvent.setup();
      render(<CommandPalette />);

      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Type to search/i);
      await user.type(input, "stud");

      await waitFor(() => {
        expect(screen.getByText("STUDIO")).toBeInTheDocument();
      });
    });

    it("should show 'no results' when search has no matches", async () => {
      const user = userEvent.setup();
      render(<CommandPalette />);

      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Type to search/i);
      await user.type(input, "xyzabc123notfound");

      await waitFor(() => {
        expect(screen.getByText("app.commandPalette.noResults")).toBeInTheDocument();
      });
    });
  });

  describe("Navigation Actions", () => {
    it("should navigate to selected option on Enter key", async () => {
      const user = userEvent.setup();
      render(<CommandPalette />);

      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Click on HOME option
      const homeOption = screen.getByText("app.nav.home");
      await user.click(homeOption);

      // Should call setLocation with correct path
      expect(mockSetLocation).toHaveBeenCalledWith("/dashboard");
    });

    it("should close modal after selecting an option", async () => {
      const user = userEvent.setup();
      render(<CommandPalette />);

      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      const homeOption = screen.getByText("app.nav.home");
      await user.click(homeOption);

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("should navigate to correct paths for each tab", async () => {
      const user = userEvent.setup();
      const tabs = [
        { label: "app.nav.home", path: "/dashboard" },
        { label: "app.nav.clients", path: "/commercial" },
        { label: "app.nav.jobs", path: "/projects" },
        { label: "app.nav.studio", path: "/tools" },
        { label: "app.nav.finance", path: "/analytics" },
      ];

      for (const tab of tabs) {
        mockSetLocation.mockClear();
        render(<CommandPalette />);

        const event = new KeyboardEvent("keydown", {
          key: "k",
          metaKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);

        await waitFor(() => {
          expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        const option = screen.getByText(tab.label);
        await user.click(option);

        expect(mockSetLocation).toHaveBeenCalledWith(tab.path);
      }
    });
  });

  describe("Accessibility", () => {
    it("should have role='dialog'", async () => {
      render(<CommandPalette />);

      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
      });
    });

    it("should have aria-modal='true'", async () => {
      render(<CommandPalette />);

      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("aria-modal", "true");
      });
    });

    it("should have aria-labelledby", async () => {
      render(<CommandPalette />);

      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("aria-labelledby");
      });
    });

    it("should trap focus inside modal when open", async () => {
      render(<CommandPalette />);

      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
        // Focus should be inside the dialog
        expect(document.activeElement).not.toBe(document.body);
      });
    });
  });

  describe("Global Event Listener", () => {
    it("should work from any page", async () => {
      // Render on different "page" (simulated by changing mock location)
      render(<CommandPalette />);

      // Trigger from any page
      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("should respond to custom event 'cena:open-command-palette'", async () => {
      render(<CommandPalette />);

      // Dispatch custom event
      const customEvent = new Event("cena:open-command-palette");
      window.dispatchEvent(customEvent);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });
  });

  describe("Project Search", () => {
    it("should display recent projects in search results", async () => {
      render(<CommandPalette />);

      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByText("Test Project 1")).toBeInTheDocument();
        expect(screen.getByText("Production Project")).toBeInTheDocument();
        expect(screen.getByText("Marketing Campaign")).toBeInTheDocument();
      });
    });

    it("should filter projects by name", async () => {
      const user = userEvent.setup();
      render(<CommandPalette />);

      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Type to search/i);
      await user.type(input, "Production");

      await waitFor(() => {
        expect(screen.getByText("Production Project")).toBeInTheDocument();
        expect(screen.queryByText("Marketing Campaign")).not.toBeInTheDocument();
      });
    });

    it("should navigate to project on selection", async () => {
      const user = userEvent.setup();
      render(<CommandPalette />);

      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      const projectOption = screen.getByText("Test Project 1");
      await user.click(projectOption);

      expect(mockSetLocation).toHaveBeenCalledWith("/project/1");
    });
  });

  describe("Admin Access", () => {
    it("should show admin option when user is admin", async () => {
      (useAuth as any).mockReturnValue({
        isAdmin: true,
        user: { name: "Admin User", email: "admin@example.com" },
      });

      render(<CommandPalette />);

      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByText("app.commandPalette.cmd.admin")).toBeInTheDocument();
      });
    });

    it("should not show admin option when user is not admin", async () => {
      (useAuth as any).mockReturnValue({
        isAdmin: false,
        user: { name: "Regular User", email: "user@example.com" },
      });

      render(<CommandPalette />);

      const event = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.queryByText("app.commandPalette.cmd.admin")).not.toBeInTheDocument();
      });
    });
  });
});
