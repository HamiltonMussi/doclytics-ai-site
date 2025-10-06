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
import { toast } from "react-toastify";
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { DocumentHeader } from "@/components/DocumentHeader";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Spinner } from "@/components/Spinner";

const ChatPage = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { data: documents = [] } = useDocuments();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  );
  const selectedDocument =
    documents.find((doc) => doc.id === selectedDocumentId) || null;
  const { data: interactions = [], isLoading: isLoadingInteractions } =
    useInteractions(selectedDocument?.id || null);
  const uploadDocument = useUploadDocument();
  const deleteDocument = useDeleteDocument();
  const askQuestion = useAskQuestion(selectedDocument?.id || "");
  const clearInteractions = useClearInteractions(selectedDocument?.id || "");
  const downloadDocument = useDownloadDocument();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDocMenu, setShowDocMenu] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    docId: string | null;
  }>({
    isOpen: false,
    docId: null,
  });
  const [confirmClear, setConfirmClear] = useState(false);

  useDocumentPolling(
    selectedDocument?.ocrStatus === OcrStatus.PENDING ||
      selectedDocument?.ocrStatus === OcrStatus.PROCESSING
      ? selectedDocument.id
      : null,
  );

  const handleFileUpload = async (file: File) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];

    if (file.size > MAX_FILE_SIZE) {
      toast.error("O arquivo deve ter no máximo 10MB");
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Apenas arquivos JPG, PNG e PDF são permitidos");
      return;
    }

    try {
      const newDocument = await uploadDocument.mutateAsync(file);
      setSelectedDocumentId(newDocument.id);
      toast.success("Documento enviado com sucesso!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao fazer upload");
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || !selectedDocument) return;

    try {
      await askQuestion.mutateAsync(question);
      setQuestion("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao fazer pergunta");
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    setConfirmDelete({ isOpen: true, docId });
  };

  const confirmDeleteDocument = async () => {
    if (!confirmDelete.docId) return;

    try {
      await deleteDocument.mutateAsync(confirmDelete.docId);
      if (selectedDocumentId === confirmDelete.docId) {
        setSelectedDocumentId(null);
      }
      setShowDocMenu(null);
      setConfirmDelete({ isOpen: false, docId: null });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao apagar documento");
    }
  };

  const handleClearInteractions = async () => {
    setConfirmClear(true);
  };

  const confirmClearInteractions = async () => {
    try {
      await clearInteractions.mutateAsync();
      setConfirmClear(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao limpar conversas");
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
      toast.error(error.response?.data?.message || "Erro ao fazer download");
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

              {isLoadingInteractions ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Spinner className="h-8 w-8" />
                    <p className="text-[#456478] text-sm">
                      Carregando documento...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <ChatMessages interactions={interactions} />

                  <ChatInput
                    value={question}
                    onChange={setQuestion}
                    onSubmit={handleAskQuestion}
                    isLoading={askQuestion.isLoading}
                    ocrStatus={selectedDocument.ocrStatus}
                  />
                </>
              )}
            </>
          ) : (
            <EmptyState userName={user?.name} />
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Apagar documento"
        message="Tem certeza que deseja apagar este documento? Esta ação não pode ser desfeita."
        onConfirm={confirmDeleteDocument}
        onCancel={() => setConfirmDelete({ isOpen: false, docId: null })}
        confirmText="Apagar"
        cancelText="Cancelar"
        isLoading={deleteDocument.isLoading}
      />

      <ConfirmModal
        isOpen={confirmClear}
        title="Limpar histórico"
        message="Tem certeza que deseja limpar todo o histórico de conversas? Esta ação não pode ser desfeita."
        onConfirm={confirmClearInteractions}
        onCancel={() => setConfirmClear(false)}
        confirmText="Limpar"
        cancelText="Cancelar"
        isLoading={clearInteractions.isLoading}
      />
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
