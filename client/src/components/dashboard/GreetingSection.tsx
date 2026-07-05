import * as React from "react";
import { cn } from "@/lib/utils";

export interface GreetingSectionProps {
  userName: string;
  currentDate?: Date;
  className?: string;
  align?: "left" | "center";
  showGlassEffect?: boolean;
}

type TimeOfDay = "morning" | "afternoon" | "evening";
type DayOfWeek =
  | "Domingo"
  | "Segunda"
  | "Terça"
  | "Quarta"
  | "Quinta"
  | "Sexta"
  | "Sábado";
type Month =
  | "janeiro"
  | "fevereiro"
  | "março"
  | "abril"
  | "maio"
  | "junho"
  | "julho"
  | "agosto"
  | "setembro"
  | "outubro"
  | "novembro"
  | "dezembro";

const MOTIVATIONAL_MESSAGES = [
  "Vamos criar algo incrível hoje!",
  "Pronto para transformar ideias em realidade?",
  "Seus projetos aguardam. Vamos nessa!",
  "Hora de fazer acontecer! 🚀",
] as const;

const DAYS_OF_WEEK: DayOfWeek[] = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const MONTHS: Month[] = [
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

/**
 * Gets the time-based greeting based on the hour of day
 * @param hour - Hour in 24-hour format (0-23)
 * @returns Greeting string in Portuguese
 */
export function getTimeBasedGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) {
    return "Bom dia";
  } else if (hour >= 12 && hour < 18) {
    return "Boa tarde";
  } else {
    return "Boa noite";
  }
}

/**
 * Gets the icon for the time of day
 * @param hour - Hour in 24-hour format (0-23)
 * @returns Emoji icon for the time of day
 */
export function getTimeIcon(hour: number): string {
  if (hour >= 5 && hour < 12) {
    return "☀️";
  } else if (hour >= 12 && hour < 18) {
    return "☁️";
  } else {
    return "🌙";
  }
}

/**
 * Extracts the first name from a full name
 * @param fullName - Full name string
 * @returns First name or full name if single word
 */
export function extractFirstName(fullName: string): string {
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);
  return parts[0] || trimmed;
}

/**
 * Gets a motivational message based on the day of year (deterministic)
 * @param date - Date object to base the selection on
 * @returns Motivational message string
 */
export function getMotivationalMessage(date: Date): string {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % MOTIVATIONAL_MESSAGES.length;
  return MOTIVATIONAL_MESSAGES[index];
}

/**
 * Formats the date in Portuguese format
 * @param date - Date object to format
 * @returns Formatted date string
 */
export function formatDateInPortuguese(date: Date): string {
  const dayOfWeek = DAYS_OF_WEEK[date.getDay()];
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];

  return `Hoje é ${dayOfWeek}, ${day} de ${month}`;
}

export function GreetingSection({
  userName,
  currentDate = new Date(),
  className,
  align = "left",
  showGlassEffect = false,
}: GreetingSectionProps) {
  const hour = currentDate.getHours();
  const timeGreeting = getTimeBasedGreeting(hour);
  const timeIcon = getTimeIcon(hour);
  const firstName = extractFirstName(userName);
  const motivationalMessage = getMotivationalMessage(currentDate);
  const formattedDate = formatDateInPortuguese(currentDate);

  const textAlign = align === "center" ? "text-center" : "text-left";
  const justifyContent = align === "center" ? "justify-center" : "justify-start";

  return (
    <section
      className={cn(
        "mb-6 p-6 rounded-2xl transition-all duration-300",
        showGlassEffect && "glass-card-standard",
        textAlign,
        className
      )}
      style={{
        marginBottom: "var(--space-lg)",
      }}
      aria-label="Greeting section"
    >
      {/* Main Greeting with Icon */}
      <div
        className={cn("flex items-center gap-3 mb-2", justifyContent)}
        style={{ marginBottom: "var(--space-sm)" }}
      >
        <span
          className="text-3xl"
          style={{ fontSize: "2rem" }}
          role="img"
          aria-label={`${timeGreeting} icon`}
        >
          {timeIcon}
        </span>
        <h1
          className="font-bold text-primary"
          style={{
            fontSize: "2rem",
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
          }}
        >
          {timeGreeting}, {firstName}!
        </h1>
      </div>

      {/* Motivational Subtitle */}
      <p
        className="text-muted mb-3"
        style={{
          fontSize: "1rem",
          color: "var(--text-muted)",
          marginBottom: "var(--space-sm)",
        }}
      >
        {motivationalMessage}
      </p>

      {/* Date Display */}
      <p
        className="text-secondary"
        style={{
          fontSize: "0.875rem",
          color: "var(--text-secondary)",
        }}
      >
        {formattedDate}
      </p>
    </section>
  );
}
