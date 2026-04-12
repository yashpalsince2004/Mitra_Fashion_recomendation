import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Wand2, Loader2, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ImageUploader } from "../components/ui/ImageUploader";
import { AnalysisPanel } from "../components/ui/AnalysisPanel";
import {
  analyzeUserImage,
  generatePersonalizedOutfits,
  createStylistChatSession,
  sendChatMessageStream,
} from "../services/geminiService";

const PHASE = {
  GREETING: "greeting",
  ANALYZING: "analyzing",
  ANALYZED: "analyzed",
  CHATTING: "chatting",
  GENERATING: "generating",
};

export function StylistChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const quizProfile = location.state?.quizProfile || null;

  const bottomRef = useRef(null);
  const chatSessionRef = useRef(null);
  const conversationLogRef = useRef(""); // Accumulate full context for outfit gen

  const [phase, setPhase] = useState(PHASE.GREETING);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: quizProfile
        ? `Welcome back. I've reviewed your style profile — ${quizProfile.styleVibe} with a focus on ${quizProfile.occasion}. Upload a photo and we'll take this to the next level.`
        : "Welcome to your private atelier. I'm your personal AI stylist. Upload a photo of yourself — I'll analyse your features and craft bespoke looks around you.",
      showUploader: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatTurns, setChatTurns] = useState(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Image upload → vision analysis ─────────────────────────────────────────
  const handleImageSelect = async (imagesData) => {
    // imagesData is now an array from ImageUploader
    setUploadedImages(imagesData);
    setPhase(PHASE.ANALYZING);

    setMessages((prev) => [
      ...prev,
      { 
        role: "user", 
        imagePreviews: imagesData.map(img => img.previewUrl), 
        text: imagesData.length > 1 ? `Uploaded ${imagesData.length} wardrobe pieces` : "" 
      },
      { role: "ai", text: "Scanning your features — just a moment…", loading: true },
    ]);
    setIsLoading(true);

    try {
      const result = await analyzeUserImage(imagesData);
      setAnalysis(result);

      // Initialise Gemini chat session with profile context
      chatSessionRef.current = createStylistChatSession(result, quizProfile);

      setPhase(PHASE.CHATTING);
      setMessages((prev) => {
        const clean = prev.filter((m) => !m.loading);
        return [
          ...clean,
          {
            role: "ai",
            text: `Analysis complete. ${result.stylistInsight}`,
            analysis: result,
          },
          {
            role: "ai",
            text: "Now — what are we dressing you for? Tell me about the occasion, the mood, or the impression you want to make.",
          },
        ];
      });
    } catch {
      setPhase(PHASE.CHATTING);
      chatSessionRef.current = createStylistChatSession(null, quizProfile);
      setMessages((prev) => {
        const clean = prev.filter((m) => !m.loading);
        return [
          ...clean,
          {
            role: "ai",
            text: "I couldn't fully read the photo, but that's fine — tell me what occasion we're dressing for and I'll craft something exceptional.",
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClear = () => {
    setUploadedImage(null);
    setAnalysis(null);
    chatSessionRef.current = null;
    conversationLogRef.current = "";
    setChatTurns(0);
    setPhase(PHASE.GREETING);
    setMessages([
      {
        role: "ai",
        text: "No problem — let's start fresh. Upload your photo whenever you're ready.",
        showUploader: true,
      },
    ]);
  };

  // ── User sends a chat message ───────────────────────────────────────────────
  const handleSend = async () => {
    if (!input.trim() || isLoading || phase === PHASE.GENERATING) return;
    const text = input.trim();
    setInput("");

    conversationLogRef.current += `\nClient: ${text}`;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setIsLoading(true);

    // Prepare empty AI message bubble for streaming
    setMessages((prev) => [...prev, { role: "ai", text: "" }]);

    const aiReply = await sendChatMessageStream(chatSessionRef.current, text, (chunkText) => {
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1].text = chunkText;
        return newMsgs;
      });
    });

    conversationLogRef.current += `\nStylist: ${aiReply}`;

    setIsLoading(false);
    setChatTurns((n) => n + 1);
  };

  // ── Generate outfits → navigate to gallery ─────────────────────────────────
  const handleGenerate = async () => {
    if (isLoading) return;
    setPhase(PHASE.GENERATING);
    setMessages((prev) => [
      ...prev,
      { role: "ai", text: "Curating your bespoke looks now…", loading: true },
    ]);
    setIsLoading(true);

    const outfits = await generatePersonalizedOutfits(
      "",
      conversationLogRef.current,
      analysis,
      quizProfile
    );

    setIsLoading(false);

    navigate("/gallery", {
      state: {
        outfits,
        userImages: uploadedImages.map(img => img.previewUrl),
        analysis,
        quizProfile,
        occasion: conversationLogRef.current.slice(0, 80),
      },
    });
  };

  const showInput = phase === PHASE.CHATTING || phase === PHASE.GENERATING;
  const showGenerateBtn = chatTurns >= 1 && phase === PHASE.CHATTING && !isLoading;

  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-6">
      {/* Message thread */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-5 pb-52">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, ease: "easeOut" }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" ? (
                <div className="max-w-[88%] flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    {/* AI avatar */}
                    <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-accent/70 to-accent/20 border border-accent/20 flex items-center justify-center">
                      <Wand2 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="glass rounded-2xl rounded-tl-sm border border-black/5 dark:border-white/5 px-5 py-4">
                      {msg.loading ? (
                        <div className="flex items-center gap-2.5">
                          <Loader2 className="w-4 h-4 text-accent animate-spin" />
                          <p className="text-muted text-sm font-body">{msg.text}</p>
                        </div>
                      ) : (
                        <p className="text-main font-body text-sm leading-relaxed">{msg.text}</p>
                      )}
                    </div>
                  </div>

                  {/* Upload zone */}
                  {msg.showUploader && phase === PHASE.GREETING && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="ml-11"
                    >
                      <ImageUploader onImageSelect={handleImageSelect} onClear={handleImageClear} />
                    </motion.div>
                  )}

                  {/* Analysis panel */}
                  {msg.analysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="ml-11"
                    >
                      <AnalysisPanel analysis={msg.analysis} />
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="max-w-[80%] flex flex-col items-end gap-2">
                  {msg.imagePreviews ? (
                    <div className="flex flex-wrap justify-end gap-2 max-w-[300px]">
                      {msg.imagePreviews.map((src, idx) => (
                        <div key={idx} className="rounded-xl overflow-hidden border border-white/10 w-20 h-20 sm:w-24 sm:h-24">
                           <img src={src} alt="Uploaded" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : msg.imagePreview ? (
                    <div className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 max-w-[180px]">
                      <img
                        src={msg.imagePreview}
                        alt="Uploaded"
                        className="w-full h-40 object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div className="bg-surface-container-high rounded-2xl rounded-br-sm px-5 py-4 border border-black/5 dark:border-white/5 shadow-sm">
                      <p className="text-main font-body text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="fixed bottom-0 left-0 right-0 p-5 glass-drawer border-t border-white/8 z-20">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">

          {/* Generate CTA */}
          <AnimatePresence>
            {showGenerateBtn && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={handleGenerate}
                  className="w-full gap-2 py-3.5 text-base"
                  disabled={isLoading}
                >
                  <Sparkles className="w-4 h-4" />
                  Generate My Looks
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text input */}
          {showInput ? (
            <div className="relative flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  variant="box"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={
                    phase === PHASE.GENERATING
                      ? "Curating your looks…"
                      : "Describe your occasion or answer the stylist…"
                  }
                  disabled={isLoading || phase === PHASE.GENERATING}
                  className="pr-12"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || phase === PHASE.GENERATING}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-accent hover:text-white hover:bg-accent/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-white/20 text-xs tracking-widest uppercase">
              {phase === PHASE.ANALYZING ? "Analysing your photo…" : "Upload a photo to begin"}
            </p>
          )}

          {/* Dev skip */}
          <div className="flex justify-end">
            <button
              onClick={() => navigate("/gallery")}
              className="text-white/15 hover:text-white/35 text-[10px] tracking-wider transition-colors"
            >
              Skip → Dev
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
