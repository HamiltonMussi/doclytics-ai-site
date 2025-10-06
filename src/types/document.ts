export enum OcrStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export type Document = {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  extractedText: string | null;
  summary: string | null;
  ocrStatus: OcrStatus;
  createdAt: string;
  updatedAt: string;
};
