import { useMutation, useQueryClient } from "react-query";
import { api } from "@/services/api";

export const useClearInteractions = (documentId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      await api.delete(`/documents/${documentId}/interactions`);
    },
    {
      onSuccess: () => {
        queryClient.setQueryData(["interactions", documentId], []);
      },
    },
  );
};
