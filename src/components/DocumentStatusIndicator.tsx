import { OcrStatus } from "@/types/document";
import { Spinner } from "./Spinner";
import ReactMarkdown from "react-markdown";

type DocumentStatusIndicatorProps = {
  status: OcrStatus;
  summary?: string | null;
};

export const DocumentStatusIndicator = ({ status, summary }: DocumentStatusIndicatorProps) => {
  if (status === OcrStatus.PENDING) {
    return (
      <div className="flex items-center gap-2">
        <Spinner />
        <p className="text-sm text-[#456478] font-medium">Aguardando processamento...</p>
      </div>
    );
  }

  if (status === OcrStatus.PROCESSING) {
    return (
      <div className="flex items-center gap-2">
        <Spinner />
        <p className="text-sm text-[#456478] font-medium">Analisando documento...</p>
      </div>
    );
  }

  if (status === OcrStatus.FAILED) {
    return (
      <p className="text-sm text-red-600 font-medium">
        Erro ao processar documento
      </p>
    );
  }

  if (status === OcrStatus.COMPLETED && summary) {
    return (
      <div className="text-sm text-[#456478] leading-relaxed prose prose-sm max-w-none">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    );
  }

  return null;
};
