import { ReactNode } from "react";

type DropdownMenuProps = {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
};

export const DropdownMenu = ({
  isOpen,
  children,
  className = "",
}: DropdownMenuProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute bg-[#0F555A] rounded-xl shadow-2xl overflow-hidden z-10 border border-[#456478] ${className}`}
    >
      {children}
    </div>
  );
};

type DropdownMenuItemProps = {
  onClick: () => void;
  icon?: ReactNode;
  children: ReactNode;
  variant?: "default" | "danger";
};

export const DropdownMenuItem = ({
  onClick,
  icon,
  children,
  variant = "default",
}: DropdownMenuItemProps) => {
  const textColor = variant === "danger" ? "text-red-400" : "text-white";

  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`w-full text-left px-4 py-3 text-sm hover:bg-[#456478] transition-colors ${textColor} flex items-center gap-2`}
    >
      {icon}
      {children}
    </button>
  );
};
