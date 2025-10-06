import { SparklesIcon } from "@heroicons/react/24/outline";

type EmptyStateProps = {
  userName?: string;
};

export const EmptyState = ({ userName }: EmptyStateProps) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#B1EC04]/20 rounded-full mb-4">
          <SparklesIcon className="w-10 h-10 text-[#0F555A]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#263743]">Olá, {userName}!</h2>
        <p className="text-[#456478] mt-3 text-base sm:text-lg">
          Selecione um documento ou faça upload de um novo
        </p>
      </div>
    </div>
  );
};
