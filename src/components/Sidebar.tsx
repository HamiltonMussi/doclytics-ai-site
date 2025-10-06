import {
  PlusIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
  DocumentTextIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { DropdownMenu, DropdownMenuItem } from "./DropdownMenu";

type Document = {
  id: string;
  fileName: string;
};

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
  selectedDocumentId: string | null;
  onDocumentSelect: (id: string) => void;
  onDocumentDelete: (id: string) => void;
  onFileUpload: (file: File) => void;
  isUploading: boolean;
  userName?: string;
  onProfileClick: () => void;
  onSignOut: () => void;
  showDocMenu: string | null;
  setShowDocMenu: (id: string | null) => void;
  showUserMenu: boolean;
  setShowUserMenu: (show: boolean) => void;
};

export const Sidebar = ({
  isOpen,
  onClose,
  documents,
  selectedDocumentId,
  onDocumentSelect,
  onDocumentDelete,
  onFileUpload,
  isUploading,
  userName,
  onProfileClick,
  onSignOut,
  showDocMenu,
  setShowDocMenu,
  showUserMenu,
  setShowUserMenu,
}: SidebarProps) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-[#263743] text-white flex flex-col shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-6 border-b border-[#456478] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-7 h-7 text-[#B1EC04]" />
            <h1 className="text-2xl font-bold text-white">Doclytics</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white p-1 hover:bg-[#456478] rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 flex-shrink-0">
          <label className="block">
            <input
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileUpload(file);
              }}
              disabled={isUploading}
            />
            <span className="flex items-center justify-center gap-2 bg-[#B1EC04] hover:bg-[#9dd604] text-[#263743] font-semibold px-4 py-3 rounded-xl cursor-pointer text-sm transition-colors shadow-lg">
              <PlusIcon className="w-5 h-5" />
              {isUploading ? "Enviando..." : "Novo documento"}
            </span>
          </label>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-3 space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="relative group">
                <button
                  onClick={() => onDocumentSelect(doc.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3 ${
                    selectedDocumentId === doc.id
                      ? "bg-[#456478] shadow-md"
                      : "hover:bg-[#456478]/50"
                  }`}
                >
                  <DocumentTextIcon className="w-5 h-5 text-[#88A0B0] flex-shrink-0" />
                  <span className="truncate text-white">{doc.fileName}</span>
                </button>
                <div className="absolute right-2 top-2.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDocMenu(showDocMenu === doc.id ? null : doc.id);
                    }}
                    onBlur={() => setTimeout(() => setShowDocMenu(null), 150)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#0F555A] rounded-lg transition-all"
                  >
                    <EllipsisVerticalIcon className="w-5 h-5 text-[#88A0B0]" />
                  </button>
                  <DropdownMenu
                    isOpen={showDocMenu === doc.id}
                    className="right-0 top-10 w-48"
                  >
                    <DropdownMenuItem
                      onClick={() => onDocumentDelete(doc.id)}
                      icon={<TrashIcon className="w-4 h-4" />}
                      variant="danger"
                    >
                      Apagar
                    </DropdownMenuItem>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative p-4 border-t border-[#456478] flex-shrink-0">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            onBlur={() => setTimeout(() => setShowUserMenu(false), 150)}
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#456478]/50 transition-colors flex items-center gap-3"
          >
            <UserCircleIcon className="w-6 h-6 text-[#88A0B0]" />
            <p className="text-sm truncate text-white font-medium">
              {userName}
            </p>
          </button>

          <DropdownMenu
            isOpen={showUserMenu}
            className="bottom-full left-4 right-4 mb-2"
          >
            <DropdownMenuItem
              onClick={onProfileClick}
              icon={<UserCircleIcon className="w-4 h-4" />}
            >
              Editar perfil
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onSignOut}
              icon={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
              variant="danger"
            >
              Sair
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};
