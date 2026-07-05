import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  elevated?: boolean;
}

export function StatCard({ title, value, subtitle, icon, trend, className, elevated }: StatCardProps) {
  return (
    <motion.div
      className={cn(
        "frame-card p-ds-space-6 rounded-ds-space-2",
        "bg-gradient-to-br from-ds-surface-2 to-ds-surface-1",
        elevated && "shadow-ds-elevated",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-ds-space-2">
          <p className="text-xs font-medium text-ds-text-3 uppercase tracking-wider">
            {title}
          </p>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-ds-text-1">{value}</p>
            {subtitle && (
              <p className="text-sm text-ds-text-2">{subtitle}</p>
            )}
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-xs">
              {trend.value > 0 ? (
                <ArrowUpRight className="w-3 h-3 text-ds-success" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-ds-danger" />
              )}
              <span className={trend.value > 0 ? "text-ds-success" : "text-ds-danger"}>
                {Math.abs(trend.value)}%
              </span>
              <span className="text-ds-text-3">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-ds-surface-3 text-ds-text-2">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}