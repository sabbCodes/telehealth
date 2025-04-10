import { useEffect, useRef, useState } from "react";

type Message = {
  sender: "user" | "ai";
  text: string;
};

interface AIAssistantPopupProps {
  onClose: () => void;
  userAvatar: string;
}

const AIAssistantPopup: React.FC<AIAssistantPopupProps> = ({
  onClose,
  userAvatar,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "👋 Hi! I'm your AI assistant. What symptoms are you noticing?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        sender: "ai",
        text: data.diagnosis || "Hmm... I couldn’t quite understand that.",
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Could not reach the AI server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-end sm:items-center p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-xl sm:rounded-xl shadow-lg flex flex-col h-[65vh] sm:h-[70vh] overflow-hidden">
        {/* Header */}
        <div className="bg-custom-blue text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">AI Assistant</h2>
          <button onClick={onClose} className="text-white text-xl">
            &times;
          </button>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 flex flex-col">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end space-x-2 ${
                msg.sender === "ai" ? "justify-start" : "justify-end"
              }`}
            >
              {msg.sender === "ai" && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-sm">
                  🤖
                </div>
              )}
              <div
                className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${
                  msg.sender === "ai"
                    ? "bg-gray-200 text-black"
                    : "bg-chat-blue text-white"
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={userAvatar}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}

          {/* Typing animation */}
          {loading && (
            <div className="flex items-center space-x-2 justify-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-sm">
                🤖
              </div>
              <div className="bg-gray-200 text-black px-4 py-2 rounded-xl text-sm animate-pulse">
                <span className="dot-flash">...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe symptoms..."
            className="flex-1 border rounded-full px-4 py-2 outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-custom-blue text-white px-4 py-2 rounded-full hover:bg-blue-700"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPopup;
