import { useMutation, useQueryClient } from "react-query";
import { api } from "@/services/api";

export const useAskQuestion = (documentId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (question: string) => {
      const response = await api.post(
        `/documents/${documentId}/interactions/ask`,
        { question }
      );

      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["interactions", documentId]);
      },
    }
  );
};
