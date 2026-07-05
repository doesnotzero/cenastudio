import * as React from "react";
import { useLocation } from "wouter";
import { WorkflowCard } from "./WorkflowCard";

export interface WorkflowStats {
  activeJobs: number;
  clientsWaiting: number;
  reviewsPending: number;
}

export interface WorkflowCardsRowProps {
  workflowStats: WorkflowStats;
}

interface CardConfig {
  icon: string;
  count: number | string;
  label: string;
  sublabel?: string;
  status: 'active' | 'warning' | 'info' | 'primary';
  path: string;
  delay: number;
}

export function WorkflowCardsRow({ workflowStats }: WorkflowCardsRowProps) {
  const [, setLocation] = useLocation();
  const [animated, setAnimated] = React.useState(false);

  // Check for prefers-reduced-motion
  const prefersReducedMotion = React.useMemo(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Trigger animation only on mount
  React.useEffect(() => {
    if (!prefersReducedMotion) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => setAnimated(true), 50);
      return () => clearTimeout(timer);
    } else {
      // If reduced motion, show immediately
      setAnimated(true);
    }
  }, [prefersReducedMotion]);

  const cards: CardConfig[] = [
    {
      icon: "📊",
      count: workflowStats.activeJobs,
      label: "JOBS ATIVOS",
      sublabel: "Ver todos",
      status: 'active',
      path: "/jobs",
      delay: 0,
    },
    {
      icon: "👤",
      count: workflowStats.clientsWaiting,
      label: "CLIENTS AGUARDANDO",
      sublabel: "Ver carteira",
      status: 'warning',
      path: "/clients",
      delay: 50,
    },
    {
      icon: "🎥",
      count: workflowStats.reviewsPending,
      label: "REVIEWS PENDENTES",
      sublabel: "Ver pendências",
      status: 'info',
      path: "/jobs?filter=review",
      delay: 100,
    },
    {
      icon: "🤖",
      count: "IA",
      label: "FERRAMENTAS IA",
      sublabel: "STUDIO",
      status: 'primary',
      path: "/studio",
      delay: 150,
    },
  ];

  const handleCardClick = (path: string) => {
    setLocation(path);
  };

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      aria-label="Workflow overview cards"
    >
      {cards.map((card, index) => (
        <div
          key={card.label}
          className="workflow-card-wrapper"
          style={{
            opacity: animated ? 1 : 0,
            transform: animated ? 'translateY(0)' : 'translateY(20px)',
            transition: prefersReducedMotion
              ? 'none'
              : `opacity 300ms ease-out ${card.delay}ms, transform 300ms ease-out ${card.delay}ms`,
          }}
        >
          <WorkflowCard
            icon={card.icon}
            count={card.count}
            label={card.label}
            sublabel={card.sublabel}
            status={card.status}
            onClick={() => handleCardClick(card.path)}
          />
        </div>
      ))}
    </section>
  );
}
