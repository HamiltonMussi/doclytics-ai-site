import ReactMarkdown from "react-markdown";

interface Interaction {
  id: string;
  question: string;
  answer: string;
}

interface ChatMessagesProps {
  interactions: Interaction[];
}

export const ChatMessages = ({ interactions }: ChatMessagesProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#EAFBFF] min-h-0">
      {interactions.map((interaction) => (
        <div key={interaction.id} className="space-y-3">
          <div className="flex justify-end">
            <div className="bg-[#0F555A] text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-md shadow-md">
              <p className="text-sm leading-relaxed">{interaction.question}</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-white border border-[#88A0B0]/30 text-[#263743] px-5 py-3 rounded-2xl rounded-tl-sm max-w-md shadow-sm">
              <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                <ReactMarkdown>{interaction.answer}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
