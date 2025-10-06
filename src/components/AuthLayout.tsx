import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
  showHero?: boolean;
  heroTitle?: ReactNode;
  heroSubtitle?: ReactNode;
};

export const AuthLayout = ({
  children,
  showHero = false,
  heroTitle,
  heroSubtitle,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAFBFF] px-4 lg:px-0">
      <div
        className={`w-full ${showHero ? "max-w-6xl lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center" : ""}`}
      >
        {children}

        {showHero && (
          <div className="hidden lg:flex lg:flex-col lg:justify-center lg:pl-8">
            <h1 className="text-6xl font-bold text-[#263743] leading-tight mb-6">
              {heroTitle}
            </h1>
            <p className="text-xl text-[#456478] leading-relaxed">
              {heroSubtitle}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
