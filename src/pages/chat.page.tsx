import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { WithAuth } from "@/components/WithAuth";
import { useDocuments } from "@/hooks/useDocuments";
import { useInteractions } from "@/hooks/useInteractions";
import { useUploadDocument } from "@/hooks/useUploadDocument";
import { useAskQuestion } from "@/hooks/useAskQuestion";
import { useDocumentPolling } from "@/hooks/useDocumentPolling";
import { OcrStatus } from "@/types/document";
import { useRouter } from "next/router";

const ChatPage = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { data: documents = [] } = useDocuments();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const selectedDocument = documents.find((doc) => doc.id === selectedDocumentId) || null;
  const { data: interactions = [] } = useInteractions(selectedDocument?.id || null);
  const uploadDocument = useUploadDocument();
  const askQuestion = useAskQuestion(selectedDocument?.id || "");
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Doclytics</h1>
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
            <span className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg cursor-pointer text-sm">
              <span>+</span>{" "}
              {uploadDocument.isLoading ? "Enviando..." : "Novo documento"}
            </span>
          </label>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocumentId(doc.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${
                  selectedDocument?.id === doc.id
                    ? "bg-gray-700"
                    : "hover:bg-gray-800"
                }`}
              >
                {doc.fileName}
              </button>
            ))}
          </div>
        </div>

        <div className="relative p-4 border-t border-gray-700">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <p className="text-sm truncate">{user?.name}</p>
          </button>

          {showUserMenu && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  router.push("/profile");
                }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-700 transition-colors"
              >
                Editar perfil
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  signOut();
                }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-700 transition-colors text-red-400"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedDocument ? (
          <>
            <div className="border-b p-4 bg-white">
              <h2 className="text-lg font-semibold">{selectedDocument.fileName}</h2>
              {selectedDocument.ocrStatus === OcrStatus.PENDING && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <p className="text-sm text-gray-600">Aguardando processamento...</p>
                </div>
              )}
              {selectedDocument.ocrStatus === OcrStatus.PROCESSING && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <p className="text-sm text-gray-600">Analisando documento...</p>
                </div>
              )}
              {selectedDocument.ocrStatus === OcrStatus.FAILED && (
                <p className="text-sm text-red-600 mt-2">
                  Erro ao processar documento
                </p>
              )}
              {selectedDocument.ocrStatus === OcrStatus.COMPLETED && selectedDocument.summary && (
                <p className="text-sm text-gray-600 mt-1">
                  {selectedDocument.summary}
                </p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {interactions.map((interaction) => (
                <div key={interaction.id} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg max-w-md">
                      {interaction.question}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-200 px-4 py-2 rounded-lg max-w-md">
                      {interaction.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-4 bg-white">
              <div className="flex gap-2">
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
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {askQuestion.isLoading ? "..." : "Enviar"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Olá, {user?.name}!</h2>
              <p className="text-gray-600 mt-2">
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
