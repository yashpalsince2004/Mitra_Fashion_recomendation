import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Sparkles, Wand2 } from "lucide-react";
import { startQuickChat, sendChatMessageStream } from "../../services/geminiService";
import { Button } from "./Button";
import { Input } from "./Input";

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! I'm your personal style assistant. How can I help you refine your look today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef(null);
  const scrollRef = useRef(null);

  // Initialize chat session when opened
  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      chatSessionRef.current = startQuickChat();
    }
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    // Placeholder for AI response
    setMessages((prev) => [...prev, { role: "ai", text: "", isStreaming: true }]);

    try {
      const aiText = await sendChatMessageStream(chatSession, userText, (chunkText) => {
        setMessages((prev) => {
          const newMsgs = [...prev];
          const lastMsg = newMsgs[newMsgs.length - 1];
          if (lastMsg.role === "ai") {
            lastMsg.text = chunkText;
          }
          return newMsgs;
        });
      });
      
      if (!aiText) {
        throw new Error("No response from AI");
      }
      
      setMessages((prev) => {
        const newMsgs = [...prev];
        const lastMsg = newMsgs[newMsgs.length - 1];
        if (lastMsg.role === "ai") {
          lastMsg.isStreaming = false;
        }
        return newMsgs;
      });
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "I'm having a technical glitch. Could you try asking that again?" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[380px] h-[520px] glass border ghost-border rounded-3xl shadow-whisper overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b ghost-border bg-silk-gradient flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-low border ghost-border flex items-center justify-center backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-main" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-main">AI Stylist</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-muted uppercase tracking-widest">Always Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface-low border ghost-border text-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-hide"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent text-main rounded-br-sm soft-shadow"
                        : "bg-surface-high/50 text-muted rounded-bl-sm border ghost-border"
                    }`}
                  >
                    {msg.text || (msg.isStreaming ? <Loader2 className="w-4 h-4 animate-spin opacity-50" /> : "")}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t ghost-border bg-black/10">
              <div className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask for style advice..."
                  className="pr-12 bg-surface-low border ghost-border ghost-border focus:border-accent/50 text-main"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl text-accent hover:bg-accent/10 transition-all disabled:opacity-30"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen ? "bg-white text-accent rotate-90" : "bg-silk-gradient text-main"
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-accent"></span>
            </span>
        )}
      </motion.button>
    </div>
  );
}
