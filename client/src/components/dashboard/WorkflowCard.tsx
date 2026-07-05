import * as React from "react";
import { cn } from "@/lib/utils";

export interface WorkflowCardProps {
  icon: string;
  count: number | string;
  label: string;
  sublabel?: string;
  status?: 'active' | 'warning' | 'neutral' | 'success' | 'info' | 'primary';
  onClick: () => void;
}

export function WorkflowCard({
  icon,
  count,
  label,
  sublabel,
  status = 'neutral',
  onClick,
}: WorkflowCardProps) {
  const statusBorderColors = {
    active: 'border-green-500',
    warning: 'border-yellow-500',
    neutral: 'border-gray-300',
    success: 'border-green-500',
    info: 'border-blue-500',
    primary: 'border-[#FF6B00]',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "glass-card flex flex-col items-start justify-between p-6",
        "rounded-[24px] border-2 transition-all duration-300 ease-out",
        "hover:translate-y-[-4px] hover:shadow-lg",
        "cursor-pointer text-left w-full",
        "bg-white/70 backdrop-blur-[20px] backdrop-saturate-[180%]",
        "border-gray-200/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
        "active:scale-[0.95]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2",
        statusBorderColors[status]
      )}
      aria-label={`${label}: ${count}`}
    >
      <div className="text-3xl mb-4" role="img" aria-label={icon}>
        {icon}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-5xl font-bold text-gray-900 leading-none mb-2">
          {count}
        </div>

        <div className="text-xs font-bold uppercase tracking-wider text-gray-700">
          {label}
        </div>

        {sublabel && (
          <div className="text-sm text-gray-500 mt-1">
            {sublabel}
          </div>
        )}
      </div>
    </button>
  );
}
