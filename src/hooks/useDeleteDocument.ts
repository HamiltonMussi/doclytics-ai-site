import { useMutation, useQueryClient } from "react-query";
import { api } from "@/services/api";

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (documentId: string) => {
      await api.delete(`/documents/${documentId}`);
    },
    {
      onSuccess: (_data, documentId) => {
        queryClient.setQueryData("documents", (old: any) => {
          if (!old) return [];
          return old.filter((doc: any) => doc.id !== documentId);
        });
      },
    },
  );
};
