import { useQuery } from "react-query";
import { api } from "@/services/api";
import { Document } from "@/types/document";

export const useDocuments = () => {
  return useQuery<Document[]>("documents", async () => {
    const response = await api.get("/documents");
    return response.data;
  });
};
