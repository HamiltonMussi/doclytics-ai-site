import { Bars3Icon, SparklesIcon } from "@heroicons/react/24/outline";

type MobileHeaderProps = {
  onMenuClick: () => void;
};

export const MobileHeader = ({ onMenuClick }: MobileHeaderProps) => {
  return (
    <div className="lg:hidden bg-[#263743] p-4 flex items-center gap-3 shadow-md flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="text-white p-2 hover:bg-[#456478] rounded-lg transition-colors"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>
      <div className="flex items-center gap-2">
        <SparklesIcon className="w-6 h-6 text-[#B1EC04]" />
        <h1 className="text-xl font-bold text-white">Doclytics</h1>
      </div>
    </div>
  );
};
