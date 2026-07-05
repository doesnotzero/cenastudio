import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import WorkspaceLoadingShell from "@/components/WorkspaceLoadingShell";

vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ t: () => "Carregando espaço de trabalho" }),
}));

describe("WorkspaceLoadingShell", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("avoids fast loading flashes and reveals an accessible shell after the delay", () => {
    vi.useFakeTimers();
    render(<WorkspaceLoadingShell />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(259));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole("status")).toHaveTextContent("Carregando espaço de trabalho");
  });
});
