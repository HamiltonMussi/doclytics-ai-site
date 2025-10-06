import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { WithAuth } from "@/components/WithAuth";
import { useDocuments } from "@/hooks/useDocuments";
import { useInteractions } from "@/hooks/useInteractions";
import { useUploadDocument } from "@/hooks/useUploadDocument";
import { useAskQuestion } from "@/hooks/useAskQuestion";
import { useDocumentPolling } from "@/hooks/useDocumentPolling";
import { useDeleteDocument } from "@/hooks/useDeleteDocument";
import { OcrStatus } from "@/types/document";
import { useRouter } from "next/router";
import {
  PlusIcon,
  PaperClipIcon,
  ArrowRightIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
  DocumentTextIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDocMenu, setShowDocMenu] = useState<string | null>(null);
  const [question, setQuestion] = useState("");

  useDocumentPolling(
    selectedDocument?.ocrStatus === OcrStatus.PENDING ||
      selectedDocument?.ocrStatus === OcrStatus.PROCESSING
      ? selectedDocument.id
      : null
  );

  const handleFileUpload = async (file: File) => {
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

  return (
    <div className="flex h-screen bg-[#EAFBFF]">
      <div className="w-72 bg-[#263743] text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-[#456478]">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-7 h-7 text-[#B1EC04]" />
            <h1 className="text-2xl font-bold text-white">Doclytics</h1>
          </div>
        </div>

        <div className="p-4">
          <label className="block">
            <input
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              disabled={uploadDocument.isLoading}
            />
            <span className="flex items-center justify-center gap-2 bg-[#B1EC04] hover:bg-[#9dd604] text-[#263743] font-semibold px-4 py-3 rounded-xl cursor-pointer text-sm transition-colors shadow-lg">
              <PlusIcon className="w-5 h-5" />
              {uploadDocument.isLoading ? "Enviando..." : "Novo documento"}
            </span>
          </label>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="relative group">
                <button
                  onClick={() => setSelectedDocumentId(doc.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3 ${
                    selectedDocument?.id === doc.id
                      ? "bg-[#456478] shadow-md"
                      : "hover:bg-[#456478]/50"
                  }`}
                >
                  <DocumentTextIcon className="w-5 h-5 text-[#88A0B0] flex-shrink-0" />
                  <span className="truncate text-white">{doc.fileName}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDocMenu(showDocMenu === doc.id ? null : doc.id);
                  }}
                  className="absolute right-2 top-2.5 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#0F555A] rounded-lg transition-all"
                >
                  <EllipsisVerticalIcon className="w-5 h-5 text-[#88A0B0]" />
                </button>
                {showDocMenu === doc.id && (
                  <div className="absolute right-2 top-12 bg-[#0F555A] rounded-xl shadow-2xl overflow-hidden z-10 w-48 border border-[#456478]">
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-[#456478] transition-colors text-red-400 flex items-center gap-2"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Apagar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="relative p-4 border-t border-[#456478]">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#456478]/50 transition-colors flex items-center gap-3"
          >
            <UserCircleIcon className="w-6 h-6 text-[#88A0B0]" />
            <p className="text-sm truncate text-white font-medium">{user?.name}</p>
          </button>

          {showUserMenu && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#0F555A] rounded-xl shadow-2xl overflow-hidden border border-[#456478]">
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  router.push("/profile");
                }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-[#456478] transition-colors text-white flex items-center gap-2"
              >
                <UserCircleIcon className="w-4 h-4" />
                Editar perfil
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  signOut();
                }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-[#456478] transition-colors text-red-400 flex items-center gap-2"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedDocument ? (
          <>
            <div className="border-b border-[#88A0B0]/30 p-6 bg-white shadow-sm">
              <div className="flex items-start gap-3">
                <PaperClipIcon className="w-6 h-6 text-[#0F555A] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#263743]">{selectedDocument.fileName}</h2>
                  {selectedDocument.ocrStatus === OcrStatus.PENDING && (
                    <div className="flex items-center gap-2 mt-3">
                      <div className="animate-spin h-5 w-5 border-2 border-[#0F555A] border-t-transparent rounded-full"></div>
                      <p className="text-sm text-[#456478] font-medium">Aguardando processamento...</p>
                    </div>
                  )}
                  {selectedDocument.ocrStatus === OcrStatus.PROCESSING && (
                    <div className="flex items-center gap-2 mt-3">
                      <div className="animate-spin h-5 w-5 border-2 border-[#0F555A] border-t-transparent rounded-full"></div>
                      <p className="text-sm text-[#456478] font-medium">Analisando documento...</p>
                    </div>
                  )}
                  {selectedDocument.ocrStatus === OcrStatus.FAILED && (
                    <p className="text-sm text-red-600 mt-3 font-medium">
                      Erro ao processar documento
                    </p>
                  )}
                  {selectedDocument.ocrStatus === OcrStatus.COMPLETED && selectedDocument.summary && (
                    <p className="text-sm text-[#456478] mt-2 leading-relaxed">
                      {selectedDocument.summary}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {interactions.map((interaction) => (
                <div key={interaction.id} className="space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-[#0F555A] text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-md shadow-md">
                      <p className="text-sm leading-relaxed">{interaction.question}</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white border border-[#88A0B0]/30 text-[#263743] px-5 py-3 rounded-2xl rounded-tl-sm max-w-md shadow-sm">
                      <p className="text-sm leading-relaxed">{interaction.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#88A0B0]/30 p-6 bg-white shadow-lg">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAskQuestion()}
                  placeholder={
                    selectedDocument.ocrStatus === OcrStatus.COMPLETED
                      ? "Faça uma pergunta sobre o documento..."
                      : "Aguarde o processamento do documento..."
                  }
                  className="flex-1 px-5 py-3 border-2 border-[#88A0B0]/40 rounded-xl focus:outline-none focus:border-[#0F555A] transition-colors text-[#263743] placeholder:text-[#88A0B0]"
                  disabled={
                    askQuestion.isLoading ||
                    selectedDocument.ocrStatus !== OcrStatus.COMPLETED
                  }
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={
                    askQuestion.isLoading ||
                    !question.trim() ||
                    selectedDocument.ocrStatus !== OcrStatus.COMPLETED
                  }
                  className="px-6 py-3 bg-[#B1EC04] text-[#263743] font-semibold rounded-xl hover:bg-[#9dd604] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center gap-2"
                >
                  {askQuestion.isLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-[#263743] border-t-transparent rounded-full"></div>
                  ) : (
                    <>
                      Enviar
                      <ArrowRightIcon className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#B1EC04]/20 rounded-full mb-4">
                <SparklesIcon className="w-10 h-10 text-[#0F555A]" />
              </div>
              <h2 className="text-3xl font-bold text-[#263743]">Olá, {user?.name}!</h2>
              <p className="text-[#456478] mt-3 text-lg">
                Selecione um documento ou faça upload de um novo
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
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
