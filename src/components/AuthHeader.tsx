import { SparklesIcon } from "@heroicons/react/24/outline";

interface AuthHeaderProps {
  title?: string;
  subtitle: string;
}

export const AuthHeader = ({ title = "Doclytics", subtitle }: AuthHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-[#B1EC04]/20 rounded-full mb-4">
        <SparklesIcon className="w-8 h-8 text-[#0F555A]" />
      </div>
      <h2 className="text-3xl font-bold text-[#263743]">{title}</h2>
      <p className="mt-2 text-sm text-[#456478]">{subtitle}</p>
    </div>
  );
};
