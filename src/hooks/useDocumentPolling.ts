import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { api } from "@/services/api";
import { Document, OcrStatus } from "@/types/document";

export const useDocumentPolling = (documentId: string | null) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!documentId) return;

    let interval: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const response = await api.get(`/documents/${documentId}`);
        const document: Document = response.data;

        queryClient.setQueryData<Document[]>("documents", (old = []) =>
          old.map((doc) => (doc.id === documentId ? document : doc)),
        );

        if (
          document.ocrStatus === OcrStatus.COMPLETED ||
          document.ocrStatus === OcrStatus.FAILED
        ) {
          clearInterval(interval);
        }
      } catch (error: any) {
        if (
          error.code === "ERR_NETWORK" ||
          error.message?.includes("Network Error")
        ) {
          clearInterval(interval);
        }
      }
    };

    interval = setInterval(checkStatus, 3000);

    return () => clearInterval(interval);
  }, [documentId, queryClient]);
};
