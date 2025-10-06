import { useMutation } from "react-query";
import { api } from "@/services/api";

export const useDownloadDocument = () => {
  return useMutation(
    async ({ documentId, fileName }: { documentId: string; fileName: string }) => {
      const response = await api.get(`/documents/${documentId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName.replace(/\.[^/.]+$/, '')}_annotated.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  );
};
