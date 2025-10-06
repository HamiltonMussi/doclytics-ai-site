import { useMutation, useQueryClient } from "react-query";
import { api } from "@/services/api";

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (documentId: string) => {
      await api.delete(`/documents/${documentId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("documents");
      },
    }
  );
};
