import { useQuery } from "react-query";
import { api } from "@/services/api";
import { Interaction } from "@/types/interaction";

export const useInteractions = (documentId: string | null) => {
  return useQuery<Interaction[]>(
    ["interactions", documentId],
    async () => {
      if (!documentId) return [];
      const response = await api.get(`/documents/${documentId}/interactions`);
      return response.data;
    },
    {
      enabled: !!documentId,
    }
  );
};
