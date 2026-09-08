import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Sparkles, Download, Copy } from "lucide-react";
import { askAIAssistantAPI } from "../../service/chat";

interface Message {
  text: string;
  isBot: boolean;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi Manager! I'm your AI Assistant. Ask me anything about this week's team reports, blockers, or you can ask me to 'Generate a summary report' and download it!", isBot: true }
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

  // 1. Markdown to HTML Parser (For both UI and Word Document)
  const parseMarkdown = (text: string, isWordDoc: boolean) => {
    let html = text
      .replace(/</g, "&lt;") // Security: Escape HTML tags
      .replace(/>/g, "&gt;")
      
      // Headings
      .replace(/^### (.*$)/gim, isWordDoc ? "<h3>$1</h3>" : '<h3 class="text-lg font-bold mt-4 mb-2 text-primary">$1</h3>')
      .replace(/^## (.*$)/gim, isWordDoc ? "<h2>$1</h2>" : '<h2 class="text-xl font-bold mt-5 mb-3 text-primary border-b border-border/50 pb-1">$1</h2>')
      .replace(/^# (.*$)/gim, isWordDoc ? "<h1>$1</h1>" : '<h1 class="text-2xl font-bold mt-6 mb-4 text-primary">$1</h1>')
      
      // Horizontal Rule
      .replace(/^---/gim, isWordDoc ? "<hr>" : '<hr class="border-border/50 my-4">')
      
      // Lists (Matches '* item' or '- item')
      .replace(/^[\*\-] (.*$)/gim, isWordDoc ? "<li>$1</li>" : '<li class="ml-5 list-disc mb-1 marker:text-primary">$1</li>')
      
      // Bold & Italic
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>");

    // Line Breaks to Paragraphs
    const lines = html.split('\n');
    const processedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('<h') || trimmed.startsWith('<li') || trimmed.startsWith('<hr')) return line;
      if (trimmed === '') return isWordDoc ? '<br>' : '<div class="h-2"></div>';
      return isWordDoc ? `<p>${line}</p>` : `<p class="mb-2 leading-relaxed">${line}</p>`;
    });

    let finalHtml = processedLines.join('\n');
    // Group consecutive <li> into <ul> for proper rendering
    finalHtml = finalHtml.replace(/(<li>.*?<\/li>\n?)+/gim, "<ul>$&</ul>");

    return finalHtml;
  };

  // 2. Generate Professional Word Document
  const downloadAsDocument = (text: string) => {
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Sisenco AI Report</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1f2937; line-height: 1.6; }
        h1, h2, h3 { color: #4f46e5; margin-bottom: 10px; }
        h1 { font-size: 24pt; border-bottom: 2px solid #4f46e5; padding-bottom: 5px; }
        h2 { font-size: 18pt; margin-top: 25px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        h3 { font-size: 14pt; margin-top: 20px; }
        p { margin-bottom: 15px; font-size: 11pt; }
        ul { margin-bottom: 15px; padding-left: 30px; }
        li { margin-bottom: 5px; font-size: 11pt; }
        strong { color: #111827; }
        hr { border: 0; border-top: 1px solid #d1d5db; margin: 25px 0; }
      </style>
      </head><body>
    `;
    const footer = "</body></html>";
    
    const html = header + parseMarkdown(text, true) + footer;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sisenco_Team_Report_${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="clay-card w-[90vw] sm:w-112.5 h-150 max-h-[80vh] mb-4 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-white/80" />
                <h3 className="font-bold text-lg">Sisenco AI Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-background/50 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.isBot ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.isBot ? "bg-indigo-500/10 text-indigo-500" : "bg-primary text-white"}`}>
                    {msg.isBot ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  
                  <div className={`flex flex-col gap-2 max-w-[85%]`}>
                    {/* Render parsed HTML safely */}
                    <div 
                      className={`p-4 rounded-2xl text-sm shadow-sm ${msg.isBot ? "bg-surface border border-border/50 text-text-main rounded-tl-none" : "bg-primary text-white rounded-tr-none"}`}
                      dangerouslySetInnerHTML={{ __html: msg.isBot ? parseMarkdown(msg.text, false) : msg.text }}
                    />
                    
                    {/* Action Buttons for AI Responses */}
                    {msg.isBot && idx !== 0 && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => downloadAsDocument(msg.text)} className="flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-primary transition-colors bg-surface px-3 py-1.5 rounded-lg border border-border/80 hover:border-primary/50 shadow-sm">
                          <Download size={14} /> Export to Word
                        </button>
                        <button onClick={() => copyToClipboard(msg.text)} className="flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-primary transition-colors bg-surface px-3 py-1.5 rounded-lg border border-border/80 hover:border-primary/50 shadow-sm">
                          <Copy size={14} /> Copy Text
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-500/10 text-indigo-500">
                    <Bot size={16} />
                  </div>
                  <div className="p-4 rounded-2xl bg-surface border border-border/50 rounded-tl-none flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
                  placeholder="E.g., Generate a summary report..."
                  className="clay-input flex-1 px-4 py-3 text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="clay-btn w-12 h-12 flex items-center justify-center shrink-0 disabled:opacity-50">
                  <Send size={18} className="-ml-0.5" />
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