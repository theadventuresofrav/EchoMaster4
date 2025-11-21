
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { CourseModuleData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// Import all demo components to extract their text content
import { spiCoursesExpanded } from '../spi-course-data';

interface AIAssistantProps {
  activeModule: CourseModuleData | null;
}

type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};

const getModuleContent = (moduleId: string | null): string => {
    if (!moduleId) return "General ultrasound physics principles.";
    
    const course = spiCoursesExpanded.courses[0];
    let module;
    
    // Find module by string id from COURSE_MODULES
    if (moduleId === 'course_detail') {
        let content = '';
        course.modules.forEach(mod => {
            content += `Module: ${mod.title}\nDescription: ${mod.description}\n`;
            mod.topics.forEach(topic => {
                content += `Topic: ${topic.title}\n${topic.content}\nKey Points: ${topic.keyPoints.join(', ')}\nExam Focus: ${topic.examFocus}\n\n`;
            });
        });
        return content;
    } else {
        // A simple lookup for other modules. In a real app this might be more robust.
        // This mapping is simplified.
        const mapping: {[key: string]: number} = {'waves': 1, 'transducers': 2};
        const numericId = mapping[moduleId];
        module = course.modules.find(m => m.id === numericId);
    }

    if (module) {
        let content = `Module: ${module.title}\nDescription: ${module.description}\n`;
        module.topics.forEach(topic => {
            content += `Topic: ${topic.title}\n${topic.content}\nKey Points: ${topic.keyPoints.join(', ')}\nExam Focus: ${topic.examFocus}\n\n`;
        });
        return content;
    }

    return "General ultrasound physics principles.";
};


const AIAssistant: React.FC<AIAssistantProps> = ({ activeModule }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    const moduleContent = getModuleContent(activeModule?.id || null);
    if (!process.env.API_KEY) {
        console.error("API_KEY is not set for the AI Assistant.");
        return;
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const systemInstruction = `You are EchoBot, an expert AI tutor specializing in ultrasound physics. Your task is to help a student understand the material.
    
    Current Context: The user is viewing a module titled "${activeModule?.title || 'Dashboard'}".
    Your knowledge base for this conversation is primarily the following content:
    ---
    ${moduleContent}
    ---
    
    Instructions:
    1.  Answer questions concisely and clearly, based on the provided context.
    2.  If the user asks a question outside the scope of the current module's content, gently guide them back or state that the topic is covered in another module if you know which one.
    3.  Be encouraging and supportive.
    4.  Keep responses focused on education and avoid conversational filler.
    5.  Do not use markdown in your response.`;

    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
      },
    });
    // Reset chat history when module changes
    setHistory([]);
  }, [activeModule]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !chatRef.current) return;

    const newUserMessage: ChatMessage = { role: 'user', content: input };
    const newHistory = [...history, newUserMessage];
    setHistory(newHistory);
    setInput('');
    setIsLoading(true);

    try {
        const response = await chatRef.current.sendMessage({ message: input });
        setHistory([...newHistory, { role: 'model', content: response.text }]);
    } catch (e) {
      console.error(e);
      setHistory([...newHistory, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center text-black text-3xl z-[100]"
        aria-label="Open AI Assistant"
      >
        ✨
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 w-[90vw] max-w-sm h-[60vh] max-h-[500px] bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-[99]"
          >
            <header className="flex-shrink-0 p-4 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-yellow-400">EchoBot Assistant</h3>
                <p className="text-xs text-white/60">Context: {activeModule?.title || 'General'}</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-2xl text-white/70 hover:text-white">&times;</button>
            </header>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {history.length === 0 && (
                  <div className="text-center text-sm text-white/60 p-4">
                      <p>Welcome! I'm EchoBot.</p>
                      <p>Ask me anything about "{activeModule?.title || 'Ultrasound Physics'}".</p>
                  </div>
              )}
              {history.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-lg max-w-[80%] whitespace-pre-wrap text-sm ${msg.role === 'user' ? 'bg-yellow-600 text-black' : 'bg-gray-700 text-white'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                   <div className="flex justify-start">
                      <div className="p-3 rounded-lg bg-gray-700 text-sm">Thinking...</div>
                  </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <footer className="flex-shrink-0 p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  className="flex-grow bg-gray-700 p-3 rounded-lg text-white border border-gray-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm"
                  disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-yellow-500 text-black font-bold px-4 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50">
                    Send
                </button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
