import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { OcrStatus } from "@/types/document";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  ocrStatus: OcrStatus;
};

export const ChatInput = ({ value, onChange, onSubmit, isLoading, ocrStatus }: ChatInputProps) => {
  const isDisabled = isLoading || ocrStatus !== OcrStatus.COMPLETED;

  return (
    <div className="border-t border-[#88A0B0]/30 p-4 sm:p-6 bg-white shadow-lg flex-shrink-0">
      <div className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isDisabled && onSubmit()}
          placeholder={
            ocrStatus === OcrStatus.COMPLETED
              ? "Faça uma pergunta sobre o documento..."
              : "Aguarde o processamento do documento..."
          }
          className="flex-1 px-4 sm:px-5 py-3 border-2 border-[#88A0B0]/40 rounded-xl focus:outline-none focus:border-[#0F555A] transition-colors text-[#263743] placeholder:text-[#88A0B0] text-sm sm:text-base"
          disabled={isDisabled}
        />
        <button
          onClick={onSubmit}
          disabled={isDisabled || !value.trim()}
          className="px-4 sm:px-6 py-3 bg-[#B1EC04] text-[#263743] font-semibold rounded-xl hover:bg-[#9dd604] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center gap-2"
        >
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-[#263743] border-t-transparent rounded-full"></div>
          ) : (
            <>
              Enviar
              <ArrowRightIcon className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
