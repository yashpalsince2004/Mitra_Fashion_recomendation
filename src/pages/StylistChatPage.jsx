import { useState } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { Send, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function StylistChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Welcome to the atelier. I am your personal stylist. What occasion are we dressing for today?' }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if(!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput("");
    
    // Mock progression to next phase
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'Excellent. Please select or upload a full-body photo so I can account for fit and structure.' 
      }]);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-8">
      <div className="flex-1 overflow-y-auto flex flex-col gap-6 pb-24">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] md:max-w-[70%] p-5 rounded-2xl ${msg.role === 'user' ? 'bg-[#2d3449] rounded-br-sm' : 'glass rounded-bl-sm border border-white/5'}`}>
              <p className="text-white/90 font-body leading-relaxed">{msg.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 glass-drawer border-t border-white/10 z-20">
        <div className="max-w-4xl mx-auto relative flex items-center gap-4">
           {/* Upload action mock */}
          <button className="w-12 h-12 shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Upload className="w-5 h-5 text-white/70" />
          </button>
          
          <div className="flex-1 relative">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe your style, event, or upload an image..."
              className="pr-14"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-accent hover:text-accent/80 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto flex justify-end mt-4">
           <Button variant="tertiary" onClick={() => navigate('/gallery')}>Skip to Results (Dev)</Button>
        </div>
      </div>
    </div>
  );
}
