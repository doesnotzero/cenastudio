import * as React from "react";
import { X } from "lucide-react";
import { Link } from "wouter";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ChecklistItemProps {
  id: string;
  text: string;
  checked: boolean;
  link?: string;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ChecklistItem({
  id,
  text,
  checked,
  link,
  onClick,
  onDelete,
}: ChecklistItemProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleCheckboxChange = () => {
    onClick(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(id);
    }
  };

  const textContent = (
    <span
      className={cn(
        "text-sm leading-[1.4] transition-all duration-300",
        checked && "line-through opacity-50"
      )}
      style={{ fontSize: "0.875rem" }}
    >
      {text}
    </span>
  );

  return (
    <div
      className="flex items-center gap-2 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Checkbox
        id={`checklist-item-${id}`}
        checked={checked}
        onCheckedChange={handleCheckboxChange}
        onKeyDown={handleKeyDown}
        className="size-5 data-[state=checked]:bg-[#FF6B00] data-[state=checked]:border-[#FF6B00]"
        style={{
          width: "20px",
          height: "20px",
        }}
        data-accent-color="#FF6B00"
      />

      {link ? (
        <Link href={link} className="flex-1 mr-2 cursor-pointer hover:underline">
          {textContent}
        </Link>
      ) : (
        <label
          htmlFor={`checklist-item-${id}`}
          className="flex-1 mr-2 cursor-pointer"
        >
          {textContent}
        </label>
      )}

      {isHovered && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleDelete}
          className="absolute right-0 opacity-100 transition-opacity"
          aria-label={`Delete ${text}`}
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
