export type Document = {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  extractedText: string | null;
  summary: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
};
