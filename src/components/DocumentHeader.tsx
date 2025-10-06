import { PaperClipIcon, ArrowDownTrayIcon, TrashIcon } from "@heroicons/react/24/outline";
import { OcrStatus } from "@/types/document";
import { DocumentStatusIndicator } from "./DocumentStatusIndicator";

type DocumentHeaderProps = {
  fileName: string;
  ocrStatus: OcrStatus;
  summary?: string | null;
  onDownload: () => void;
  onClearChat: () => void;
  isDownloading: boolean;
  isClearing: boolean;
  hasInteractions: boolean;
};

export const DocumentHeader = ({
  fileName,
  ocrStatus,
  summary,
  onDownload,
  onClearChat,
  isDownloading,
  isClearing,
  hasInteractions,
}: DocumentHeaderProps) => {
  return (
    <div className="border-b border-[#88A0B0]/30 p-4 sm:p-6 bg-white shadow-sm flex-shrink-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <PaperClipIcon className="w-6 h-6 text-[#0F555A] flex-shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold text-[#263743] truncate">{fileName}</h2>
        </div>
        <div className="flex items-center justify-center gap-2 flex-shrink-0">
          <button
            onClick={onDownload}
            disabled={isDownloading || ocrStatus !== OcrStatus.COMPLETED}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#456478] hover:text-white hover:bg-[#456478] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#456478] flex-shrink-0"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={onClearChat}
            disabled={isClearing || !hasInteractions}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#456478] hover:text-white hover:bg-[#456478] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#456478] flex-shrink-0"
          >
            <TrashIcon className="w-4 h-4" />
            Limpar Chat
          </button>
        </div>
      </div>
      <div className="pl-0 sm:pl-9">
        <DocumentStatusIndicator status={ocrStatus} summary={summary} />
      </div>
    </div>
  );
};
