import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import { askAIAssistantAPI } from "../../service/chat";

interface Message {
  text: string;
  isBot: boolean;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi Manager! I'm your AI Assistant. Ask me anything about this week's team reports, blockers, or achievements.", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuestion = input.trim();
    setInput("");
    setMessages(prev => [...prev, { text: userQuestion, isBot: false }]);
    setIsLoading(true);

    try {
      const answer = await askAIAssistantAPI(userQuestion);
      setMessages(prev => [...prev, { text: answer, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I couldn't connect to the server right now.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="clay-card w-[350px] sm:w-[400px] h-[500px] mb-4 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-white/80" />
                <h3 className="font-bold">Sisenco AI Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/30">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.isBot ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.isBot ? "bg-indigo-500/10 text-indigo-500" : "bg-primary text-white"}`}>
                    {msg.isBot ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl max-w-[75%] text-sm shadow-sm ${msg.isBot ? "bg-surface border border-border/50 text-text-main rounded-tl-none" : "bg-primary text-white rounded-tr-none"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-500/10 text-indigo-500">
                    <Bot size={16} />
                  </div>
                  <div className="p-4 rounded-2xl bg-surface border border-border/50 rounded-tl-none flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-surface border-t border-border/50">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about team activity..."
                  className="clay-input flex-1 px-4 py-2 text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="clay-btn w-10 h-10 flex items-center justify-center shrink-0 disabled:opacity-50">
                  <Send size={16} className="-ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center relative border border-white/20"
      >
        <MessageSquare size={24} />
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-surface rounded-full animate-pulse"></span>
        )}
      </motion.button>

    </div>
  );
}