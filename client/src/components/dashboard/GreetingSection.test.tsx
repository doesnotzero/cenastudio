import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  GreetingSection,
  getTimeBasedGreeting,
  getTimeIcon,
  extractFirstName,
  getMotivationalMessage,
  formatDateInPortuguese,
} from "./GreetingSection";

describe("GreetingSection", () => {
  describe("Component Rendering", () => {
    it("renders the component with all required elements", () => {
      const date = new Date(2024, 0, 15, 10, 30); // January 15, 2024, 10:30 AM
      render(<GreetingSection userName="João Silva" currentDate={date} />);

      expect(screen.getByRole("region", { name: /greeting section/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("displays the correct greeting message", () => {
      const date = new Date(2024, 0, 15, 10, 30);
      render(<GreetingSection userName="Maria Santos" currentDate={date} />);

      expect(screen.getByText(/Bom dia, Maria!/i)).toBeInTheDocument();
    });

    it("displays the motivational message", () => {
      const date = new Date(2024, 0, 15, 10, 30);
      render(<GreetingSection userName="João" currentDate={date} />);

      // Should have one of the motivational messages
      const hasMotivationalMessage =
        screen.queryByText(/Vamos criar algo incrível hoje!/i) ||
        screen.queryByText(/Pronto para transformar ideias em realidade\?/i) ||
        screen.queryByText(/Seus projetos aguardam. Vamos nessa!/i) ||
        screen.queryByText(/Hora de fazer acontecer! 🚀/i);

      expect(hasMotivationalMessage).toBeTruthy();
    });

    it("displays the formatted date", () => {
      const date = new Date(2024, 0, 15, 10, 30); // Monday, January 15, 2024
      render(<GreetingSection userName="João" currentDate={date} />);

      expect(screen.getByText(/Hoje é Segunda, 15 de janeiro/i)).toBeInTheDocument();
    });

    it("displays the time icon", () => {
      const date = new Date(2024, 0, 15, 10, 30);
      render(<GreetingSection userName="João" currentDate={date} />);

      const icon = screen.getByRole("img", { name: /Bom dia icon/i });
      expect(icon).toBeInTheDocument();
      expect(icon.textContent).toBe("☀️");
    });
  });

  describe("Time-Based Greeting Logic", () => {
    it("displays 'Bom dia' for morning time (5:00-11:59)", () => {
      const morningTimes = [5, 6, 7, 8, 9, 10, 11];
      morningTimes.forEach((hour) => {
        const date = new Date(2024, 0, 15, hour, 0);
        const { unmount } = render(
          <GreetingSection userName="João" currentDate={date} />
        );
        expect(screen.getByText(/Bom dia, João!/i)).toBeInTheDocument();
        unmount();
      });
    });

    it("displays 'Boa tarde' for afternoon time (12:00-17:59)", () => {
      const afternoonTimes = [12, 13, 14, 15, 16, 17];
      afternoonTimes.forEach((hour) => {
        const date = new Date(2024, 0, 15, hour, 0);
        const { unmount } = render(
          <GreetingSection userName="João" currentDate={date} />
        );
        expect(screen.getByText(/Boa tarde, João!/i)).toBeInTheDocument();
        unmount();
      });
    });

    it("displays 'Boa noite' for evening time (18:00-4:59)", () => {
      const eveningTimes = [18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4];
      eveningTimes.forEach((hour) => {
        const date = new Date(2024, 0, 15, hour, 0);
        const { unmount } = render(
          <GreetingSection userName="João" currentDate={date} />
        );
        expect(screen.getByText(/Boa noite, João!/i)).toBeInTheDocument();
        unmount();
      });
    });

    it("displays correct icon for morning (☀️)", () => {
      const date = new Date(2024, 0, 15, 8, 0);
      render(<GreetingSection userName="João" currentDate={date} />);
      const icon = screen.getByRole("img", { name: /Bom dia icon/i });
      expect(icon.textContent).toBe("☀️");
    });

    it("displays correct icon for afternoon (☁️)", () => {
      const date = new Date(2024, 0, 15, 14, 0);
      render(<GreetingSection userName="João" currentDate={date} />);
      const icon = screen.getByRole("img", { name: /Boa tarde icon/i });
      expect(icon.textContent).toBe("☁️");
    });

    it("displays correct icon for evening (🌙)", () => {
      const date = new Date(2024, 0, 15, 20, 0);
      render(<GreetingSection userName="João" currentDate={date} />);
      const icon = screen.getByRole("img", { name: /Boa noite icon/i });
      expect(icon.textContent).toBe("🌙");
    });
  });

  describe("Name Extraction", () => {
    it("extracts first name from full name", () => {
      const date = new Date(2024, 0, 15, 10, 0);
      render(<GreetingSection userName="João Silva Santos" currentDate={date} />);
      expect(screen.getByText(/Bom dia, João!/i)).toBeInTheDocument();
    });

    it("uses full name if single word", () => {
      const date = new Date(2024, 0, 15, 10, 0);
      render(<GreetingSection userName="Maria" currentDate={date} />);
      expect(screen.getByText(/Bom dia, Maria!/i)).toBeInTheDocument();
    });

    it("handles names with extra spaces", () => {
      const date = new Date(2024, 0, 15, 10, 0);
      render(<GreetingSection userName="  Pedro   Santos  " currentDate={date} />);
      expect(screen.getByText(/Bom dia, Pedro!/i)).toBeInTheDocument();
    });

    it("handles empty name gracefully", () => {
      const date = new Date(2024, 0, 15, 10, 0);
      render(<GreetingSection userName="" currentDate={date} />);
      expect(screen.getByText(/Bom dia, !/i)).toBeInTheDocument();
    });
  });

  describe("Date Formatting", () => {
    it("formats date correctly for all days of week", () => {
      const dates = [
        { date: new Date(2024, 0, 14), expected: "Domingo" }, // Sunday
        { date: new Date(2024, 0, 15), expected: "Segunda" }, // Monday
        { date: new Date(2024, 0, 16), expected: "Terça" }, // Tuesday
        { date: new Date(2024, 0, 17), expected: "Quarta" }, // Wednesday
        { date: new Date(2024, 0, 18), expected: "Quinta" }, // Thursday
        { date: new Date(2024, 0, 19), expected: "Sexta" }, // Friday
        { date: new Date(2024, 0, 20), expected: "Sábado" }, // Saturday
      ];

      dates.forEach(({ date, expected }) => {
        const { unmount } = render(
          <GreetingSection userName="João" currentDate={date} />
        );
        expect(screen.getByText(new RegExp(`Hoje é ${expected}`, "i"))).toBeInTheDocument();
        unmount();
      });
    });

    it("formats date correctly for all months", () => {
      const months = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro",
      ];

      months.forEach((month, index) => {
        const date = new Date(2024, index, 15);
        const { unmount } = render(
          <GreetingSection userName="João" currentDate={date} />
        );
        expect(screen.getByText(new RegExp(`de ${month}`, "i"))).toBeInTheDocument();
        unmount();
      });
    });

    it("displays correct day number", () => {
      const date = new Date(2024, 0, 25);
      render(<GreetingSection userName="João" currentDate={date} />);
      expect(screen.getByText(/25 de janeiro/i)).toBeInTheDocument();
    });
  });

  describe("Motivational Messages", () => {
    it("returns a motivational message from the available options", () => {
      const date = new Date(2024, 0, 15, 10, 0);
      render(<GreetingSection userName="João" currentDate={date} />);

      const validMessages = [
        "Vamos criar algo incrível hoje!",
        "Pronto para transformar ideias em realidade?",
        "Seus projetos aguardam. Vamos nessa!",
        "Hora de fazer acontecer! 🚀",
      ];

      const messageElements = validMessages.map((msg) =>
        screen.queryByText(msg)
      );
      const foundMessage = messageElements.some((el) => el !== null);

      expect(foundMessage).toBe(true);
    });

    it("returns consistent message for same date", () => {
      const date1 = new Date(2024, 0, 15, 10, 0);
      const date2 = new Date(2024, 0, 15, 14, 0);

      const { unmount: unmount1 } = render(
        <GreetingSection userName="João" currentDate={date1} />
      );
      const message1 = screen.getByText(/^(Vamos criar algo|Pronto para|Seus projetos|Hora de fazer)/i).textContent;
      unmount1();

      const { unmount: unmount2 } = render(
        <GreetingSection userName="João" currentDate={date2} />
      );
      const message2 = screen.getByText(/^(Vamos criar algo|Pronto para|Seus projetos|Hora de fazer)/i).textContent;
      unmount2();

      expect(message1).toBe(message2);
    });
  });

  describe("Visual Design and Styling", () => {
    it("applies left alignment by default", () => {
      const date = new Date(2024, 0, 15, 10, 0);
      const { container } = render(
        <GreetingSection userName="João" currentDate={date} />
      );
      const section = container.querySelector("section");
      expect(section?.classList.contains("text-left")).toBe(true);
    });

    it("applies center alignment when specified", () => {
      const date = new Date(2024, 0, 15, 10, 0);
      const { container } = render(
        <GreetingSection userName="João" currentDate={date} align="center" />
      );
      const section = container.querySelector("section");
      expect(section?.classList.contains("text-center")).toBe(true);
    });

    it("applies glass effect class when enabled", () => {
      const date = new Date(2024, 0, 15, 10, 0);
      const { container } = render(
        <GreetingSection userName="João" currentDate={date} showGlassEffect={true} />
      );
      const section = container.querySelector("section");
      expect(section?.classList.contains("glass-card-standard")).toBe(true);
    });

    it("does not apply glass effect class by default", () => {
      const date = new Date(2024, 0, 15, 10, 0);
      const { container } = render(
        <GreetingSection userName="João" currentDate={date} />
      );
      const section = container.querySelector("section");
      expect(section?.classList.contains("glass-card-standard")).toBe(false);
    });

    it("applies custom className", () => {
      const date = new Date(2024, 0, 15, 10, 0);
      const { container } = render(
        <GreetingSection
          userName="João"
          currentDate={date}
          className="custom-class"
        />
      );
      const section = container.querySelector("section");
      expect(section?.classList.contains("custom-class")).toBe(true);
    });

    it("applies correct font size to greeting (2rem)", () => {
      const date = new Date(2024, 0, 15, 10, 0);
      const { container } = render(<GreetingSection userName="João" currentDate={date} />);
      const heading = screen.getByRole("heading", { level: 1 });
      const style = heading.getAttribute("style");
      expect(style).toContain("font-size: 2rem");
    });

    it("applies correct font size to subtitle (1rem)", () => {
      const date = new Date(2024, 0, 15, 10, 0);
      const { container } = render(
        <GreetingSection userName="João" currentDate={date} />
      );
      const subtitle = container.querySelector("p:first-of-type");
      const style = subtitle?.getAttribute("style");
      expect(style).toContain("font-size: 1rem");
    });

    it("applies correct font size to date (0.875rem)", () => {
      const date = new Date(2024, 0, 15, 10, 0);
      const { container } = render(
        <GreetingSection userName="João" currentDate={date} />
      );
      const dateText = container.querySelector("p:last-of-type");
      const style = dateText?.getAttribute("style");
      expect(style).toContain("font-size: 0.875rem");
    });
  });

  describe("Utility Functions", () => {
    describe("getTimeBasedGreeting", () => {
      it("returns 'Bom dia' for morning hours (5-11)", () => {
        expect(getTimeBasedGreeting(5)).toBe("Bom dia");
        expect(getTimeBasedGreeting(8)).toBe("Bom dia");
        expect(getTimeBasedGreeting(11)).toBe("Bom dia");
      });

      it("returns 'Boa tarde' for afternoon hours (12-17)", () => {
        expect(getTimeBasedGreeting(12)).toBe("Boa tarde");
        expect(getTimeBasedGreeting(15)).toBe("Boa tarde");
        expect(getTimeBasedGreeting(17)).toBe("Boa tarde");
      });

      it("returns 'Boa noite' for evening hours (18-23, 0-4)", () => {
        expect(getTimeBasedGreeting(18)).toBe("Boa noite");
        expect(getTimeBasedGreeting(22)).toBe("Boa noite");
        expect(getTimeBasedGreeting(0)).toBe("Boa noite");
        expect(getTimeBasedGreeting(4)).toBe("Boa noite");
      });

      it("handles boundary cases correctly", () => {
        expect(getTimeBasedGreeting(4)).toBe("Boa noite");
        expect(getTimeBasedGreeting(5)).toBe("Bom dia");
        expect(getTimeBasedGreeting(11)).toBe("Bom dia");
        expect(getTimeBasedGreeting(12)).toBe("Boa tarde");
        expect(getTimeBasedGreeting(17)).toBe("Boa tarde");
        expect(getTimeBasedGreeting(18)).toBe("Boa noite");
      });
    });

    describe("getTimeIcon", () => {
      it("returns sun icon for morning", () => {
        expect(getTimeIcon(8)).toBe("☀️");
      });

      it("returns cloud icon for afternoon", () => {
        expect(getTimeIcon(14)).toBe("☁️");
      });

      it("returns moon icon for evening", () => {
        expect(getTimeIcon(20)).toBe("🌙");
      });
    });

    describe("extractFirstName", () => {
      it("extracts first name from full name", () => {
        expect(extractFirstName("João Silva")).toBe("João");
        expect(extractFirstName("Maria Santos Oliveira")).toBe("Maria");
      });

      it("returns full name if single word", () => {
        expect(extractFirstName("Carlos")).toBe("Carlos");
      });

      it("trims whitespace", () => {
        expect(extractFirstName("  Pedro  ")).toBe("Pedro");
        expect(extractFirstName("  Ana   Silva  ")).toBe("Ana");
      });

      it("handles empty string", () => {
        expect(extractFirstName("")).toBe("");
      });

      it("handles multiple spaces between names", () => {
        expect(extractFirstName("João    Silva    Santos")).toBe("João");
      });
    });

    describe("getMotivationalMessage", () => {
      it("returns one of the valid messages", () => {
        const validMessages = [
          "Vamos criar algo incrível hoje!",
          "Pronto para transformar ideias em realidade?",
          "Seus projetos aguardam. Vamos nessa!",
          "Hora de fazer acontecer! 🚀",
        ];
        const date = new Date(2024, 0, 15);
        const message = getMotivationalMessage(date);
        expect(validMessages).toContain(message);
      });

      it("returns consistent message for same date", () => {
        const date1 = new Date(2024, 0, 15, 10, 0);
        const date2 = new Date(2024, 0, 15, 16, 0);
        expect(getMotivationalMessage(date1)).toBe(getMotivationalMessage(date2));
      });

      it("may return different messages for different dates", () => {
        const messages = new Set();
        for (let day = 1; day <= 10; day++) {
          const date = new Date(2024, 0, day);
          messages.add(getMotivationalMessage(date));
        }
        // At least 2 different messages should appear across 10 days
        expect(messages.size).toBeGreaterThanOrEqual(2);
      });
    });

    describe("formatDateInPortuguese", () => {
      it("formats date with correct components", () => {
        const date = new Date(2024, 0, 15); // Monday, January 15
        const formatted = formatDateInPortuguese(date);
        expect(formatted).toBe("Hoje é Segunda, 15 de janeiro");
      });

      it("formats all days of week correctly", () => {
        const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
        days.forEach((day, index) => {
          const date = new Date(2024, 0, 14 + index); // Jan 14-20, 2024
          const formatted = formatDateInPortuguese(date);
          expect(formatted).toContain(day);
        });
      });

      it("formats all months correctly", () => {
        const months = [
          "janeiro",
          "fevereiro",
          "março",
          "abril",
          "maio",
          "junho",
          "julho",
          "agosto",
          "setembro",
          "outubro",
          "novembro",
          "dezembro",
        ];
        months.forEach((month, index) => {
          const date = new Date(2024, index, 15);
          const formatted = formatDateInPortuguese(date);
          expect(formatted).toContain(month);
        });
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA label for section", () => {
      const date = new Date(2024, 0, 15, 10, 0);
      render(<GreetingSection userName="João" currentDate={date} />);
      expect(screen.getByRole("region", { name: /greeting section/i })).toBeInTheDocument();
    });

    it("has proper heading hierarchy", () => {
      const date = new Date(2024, 0, 15, 10, 0);
      render(<GreetingSection userName="João" currentDate={date} />);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("icon has proper ARIA label", () => {
      const date = new Date(2024, 0, 15, 10, 0);
      render(<GreetingSection userName="João" currentDate={date} />);
      expect(screen.getByRole("img", { name: /icon/i })).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles midnight correctly", () => {
      const date = new Date(2024, 0, 15, 0, 0);
      render(<GreetingSection userName="João" currentDate={date} />);
      expect(screen.getByText(/Boa noite, João!/i)).toBeInTheDocument();
    });

    it("handles noon exactly", () => {
      const date = new Date(2024, 0, 15, 12, 0);
      render(<GreetingSection userName="João" currentDate={date} />);
      expect(screen.getByText(/Boa tarde, João!/i)).toBeInTheDocument();
    });

    it("handles 23:59 correctly", () => {
      const date = new Date(2024, 0, 15, 23, 59);
      render(<GreetingSection userName="João" currentDate={date} />);
      expect(screen.getByText(/Boa noite, João!/i)).toBeInTheDocument();
    });

    it("uses current date when no date provided", () => {
      render(<GreetingSection userName="João" />);
      // Should render without errors
      expect(screen.getByRole("region", { name: /greeting section/i })).toBeInTheDocument();
    });
  });
});
