import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { WithAuth } from "@/components/WithAuth";
import { useDocuments } from "@/hooks/useDocuments";
import { useInteractions } from "@/hooks/useInteractions";
import { useUploadDocument } from "@/hooks/useUploadDocument";
import { useAskQuestion } from "@/hooks/useAskQuestion";
import { useDocumentPolling } from "@/hooks/useDocumentPolling";
import { useDeleteDocument } from "@/hooks/useDeleteDocument";
import { useClearInteractions } from "@/hooks/useClearInteractions";
import { useDownloadDocument } from "@/hooks/useDownloadDocument";
import { OcrStatus } from "@/types/document";
import { useRouter } from "next/router";
import Head from "next/head";
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { DocumentHeader } from "@/components/DocumentHeader";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { EmptyState } from "@/components/EmptyState";

const ChatPage = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { data: documents = [] } = useDocuments();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const selectedDocument = documents.find((doc) => doc.id === selectedDocumentId) || null;
  const { data: interactions = [] } = useInteractions(selectedDocument?.id || null);
  const uploadDocument = useUploadDocument();
  const deleteDocument = useDeleteDocument();
  const askQuestion = useAskQuestion(selectedDocument?.id || "");
  const clearInteractions = useClearInteractions(selectedDocument?.id || "");
  const downloadDocument = useDownloadDocument();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDocMenu, setShowDocMenu] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useDocumentPolling(
    selectedDocument?.ocrStatus === OcrStatus.PENDING ||
      selectedDocument?.ocrStatus === OcrStatus.PROCESSING
      ? selectedDocument.id
      : null
  );

  const handleFileUpload = async (file: File) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    if (file.size > MAX_FILE_SIZE) {
      alert("O arquivo deve ter no máximo 10MB");
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Apenas arquivos JPG, PNG e PDF são permitidos");
      return;
    }

    try {
      const newDocument = await uploadDocument.mutateAsync(file);
      setSelectedDocumentId(newDocument.id);
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao fazer upload");
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || !selectedDocument) return;

    try {
      await askQuestion.mutateAsync(question);
      setQuestion("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao fazer pergunta");
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Tem certeza que deseja apagar este documento?")) return;

    try {
      await deleteDocument.mutateAsync(docId);
      if (selectedDocumentId === docId) {
        setSelectedDocumentId(null);
      }
      setShowDocMenu(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao apagar documento");
    }
  };

  const handleClearInteractions = async () => {
    if (!confirm("Tem certeza que deseja limpar todo o histórico de conversas?")) return;

    try {
      await clearInteractions.mutateAsync();
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao limpar conversas");
    }
  };

  const handleDownloadDocument = async () => {
    if (!selectedDocument) return;

    try {
      await downloadDocument.mutateAsync({
        documentId: selectedDocument.id,
        fileName: selectedDocument.fileName,
      });
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao fazer download");
    }
  };

  return (
    <>
      <Head>
        <title>Chat - Doclytics</title>
      </Head>
      <div className="fixed inset-0 flex bg-[#EAFBFF] overflow-x-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          documents={documents}
          selectedDocumentId={selectedDocumentId}
          onDocumentSelect={setSelectedDocumentId}
          onDocumentDelete={handleDeleteDocument}
          onFileUpload={handleFileUpload}
          isUploading={uploadDocument.isLoading}
          userName={user?.name}
          onProfileClick={() => {
            setShowUserMenu(false);
            router.push("/profile");
          }}
          onSignOut={() => {
            setShowUserMenu(false);
            signOut();
          }}
          showDocMenu={showDocMenu}
          setShowDocMenu={setShowDocMenu}
          showUserMenu={showUserMenu}
          setShowUserMenu={setShowUserMenu}
        />

        <div className="flex-1 flex flex-col min-h-0 overflow-x-hidden">
          <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />

          {selectedDocument ? (
            <>
              <DocumentHeader
                fileName={selectedDocument.fileName}
                ocrStatus={selectedDocument.ocrStatus}
                summary={selectedDocument.summary}
                onDownload={handleDownloadDocument}
                onClearChat={handleClearInteractions}
                isDownloading={downloadDocument.isLoading}
                isClearing={clearInteractions.isLoading}
                hasInteractions={interactions.length > 0}
              />

              <ChatMessages interactions={interactions} />

              <ChatInput
                value={question}
                onChange={setQuestion}
                onSubmit={handleAskQuestion}
                isLoading={askQuestion.isLoading}
                ocrStatus={selectedDocument.ocrStatus}
              />
            </>
          ) : (
            <EmptyState userName={user?.name} />
          )}
        </div>
      </div>
    </>
  );
};

const Chat = () => {
  return (
    <WithAuth>
      <ChatPage />
    </WithAuth>
  );
};

export default Chat;
