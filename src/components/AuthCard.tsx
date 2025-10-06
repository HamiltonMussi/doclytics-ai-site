import { ReactNode } from "react";

type AuthCardProps = {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg";
};

export const AuthCard = ({ children, maxWidth = "md" }: AuthCardProps) => {
  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
  };

  return (
    <div className={`${widthClasses[maxWidth]} w-full mx-auto`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-[#88A0B0]/20 p-8">
        {children}
      </div>
    </div>
  );
};
