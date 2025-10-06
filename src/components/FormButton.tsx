import { ReactNode } from "react";

type FormButtonProps = {
  children: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
  onClick?: () => void;
};

export const FormButton = ({
  children,
  isLoading = false,
  loadingText = "Carregando...",
  disabled = false,
  type = "submit",
  onClick,
}: FormButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-[#263743] bg-[#B1EC04] hover:bg-[#9dd604] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F555A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
    >
      {isLoading ? (
        <>
          <div className="animate-spin h-5 w-5 border-2 border-[#263743] border-t-transparent rounded-full"></div>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};
