import { useMutation, useQueryClient } from "react-query";
import { api } from "@/services/api";

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/documents/upload", formData);

      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("documents");
      },
    }
  );
};
