interface SpinnerProps {
  className?: string;
}

export const Spinner = ({ className = "" }: SpinnerProps) => {
  return (
    <div className={`animate-spin h-5 w-5 border-2 border-[#0F555A] border-t-transparent rounded-full ${className}`} />
  );
};
