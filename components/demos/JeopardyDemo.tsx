
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

interface Question {
  id: string;
  category: string;
  value: number;
  question: string;
  answer: string; // The "Question" in Jeopardy format (e.g. "What is...")
  options?: string[]; // Optional multiple choice for easier gameplay
}

const CATEGORIES = ['Physics', 'Transducers', 'Doppler', 'Artifacts', 'Safety'];
const VALUES = [100, 200, 300, 400, 500];

// Sample Data Generator
const generateQuestions = (): Question[] => {
  const questions: Question[] = [];
  CATEGORIES.forEach(cat => {
    VALUES.forEach(val => {
      questions.push({
        id: `${cat}-${val}`,
        category: cat,
        value: val,
        question: `A question about ${cat} worth $${val}.`, // Placeholder logic, real app would have a DB
        answer: "Correct Answer",
        options: ["Correct Answer", "Wrong A", "Wrong B", "Wrong C"].sort(() => Math.random() - 0.5)
      });
    });
  });
  
  // Overwrite a few for demo purposes
  const physics100 = questions.find(q => q.id === 'Physics-100');
  if (physics100) {
      physics100.question = "This acoustic variable is measured in Pascals (Pa).";
      physics100.answer = "Pressure";
      physics100.options = ["Pressure", "Density", "Temperature", "Distance"];
  }
  
  return questions;
};

const QUESTIONS = generateQuestions();

const JeopardyDemo: React.FC = () => {
  const [score, setScore] = useState(0);
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const handleQuestionClick = (q: Question) => {
    if (answeredIds.includes(q.id)) return;
    setActiveQuestion(q);
    setSelectedOption(null);
    setFeedback(null);
  };

  const handleSubmit = () => {
    if (!activeQuestion || !selectedOption) return;

    const isCorrect = selectedOption === activeQuestion.answer;
    if (isCorrect) {
      setScore(s => s + activeQuestion.value);
      setFeedback('correct');
    } else {
      setScore(s => s - activeQuestion.value);
      setFeedback('incorrect');
    }
    
    setAnsweredIds(prev => [...prev, activeQuestion.id]);

    setTimeout(() => {
      setActiveQuestion(null);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <DemoSection
        title="SPI Jeopardy Challenge"
        description="Test your knowledge across 5 key categories. Select a clue, answer correctly to earn points, but beware—incorrect answers will deduct from your score!"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-gray-800 p-4 rounded-xl border border-yellow-400/50 gap-2">
            <h3 className="text-xl sm:text-2xl font-bold text-yellow-400">Score: ${score}</h3>
            <div className="text-xs sm:text-sm text-white/60">
                Cleared: {answeredIds.length} / {QUESTIONS.length}
            </div>
        </div>

        <div className="w-full overflow-x-auto pb-4">
            <div className="grid grid-cols-5 gap-2 min-w-[600px]">
                {CATEGORIES.map(cat => (
                    <div key={cat} className="text-center font-bold text-yellow-400 bg-black/40 p-2 rounded uppercase text-xs sm:text-sm md:text-base truncate">
                        {cat}
                    </div>
                ))}
                {VALUES.map(val => (
                    <React.Fragment key={val}>
                        {CATEGORIES.map(cat => {
                            const q = QUESTIONS.find(q => q.category === cat && q.value === val);
                            if (!q) return <div key={`${cat}-${val}`}></div>;
                            const isAnswered = answeredIds.includes(q.id);
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => handleQuestionClick(q)}
                                    disabled={isAnswered}
                                    className={`aspect-video flex items-center justify-center rounded-lg font-bold text-lg sm:text-xl md:text-2xl transition-all duration-300 ${
                                        isAnswered 
                                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                                        : 'bg-blue-600 text-yellow-300 hover:bg-blue-500 hover:scale-105 shadow-lg hover:shadow-yellow-400/20'
                                    }`}
                                >
                                    {isAnswered ? '' : `$${val}`}
                                </button>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>

        <AnimatePresence>
            {activeQuestion && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-blue-800 border-4 border-yellow-400 p-4 sm:p-8 rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="text-center mb-6 sm:mb-8">
                            <span className="inline-block bg-black/30 px-3 py-1 rounded-full text-yellow-400 font-bold mb-4 text-xs sm:text-sm">
                                {activeQuestion.category} for ${activeQuestion.value}
                            </span>
                            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white uppercase leading-relaxed shadow-black drop-shadow-md">
                                "{activeQuestion.question}"
                            </h2>
                        </div>

                        {!feedback ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {activeQuestion.options?.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedOption(opt)}
                                        className={`p-3 sm:p-4 rounded-xl text-left font-semibold transition-colors text-sm sm:text-lg ${
                                            selectedOption === opt 
                                            ? 'bg-yellow-400 text-blue-900' 
                                            : 'bg-blue-900/50 text-white hover:bg-blue-700 border border-blue-500'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        ) : (
                             <div className={`text-center p-4 sm:p-6 rounded-xl ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
                                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                    {feedback === 'correct' ? 'CORRECT!' : 'INCORRECT'}
                                </h3>
                                <p className="text-white/90 text-sm sm:text-base">The answer is: {activeQuestion.answer}</p>
                             </div>
                        )}

                        {!feedback && (
                            <div className="mt-6 sm:mt-8 flex justify-center">
                                <ControlButton onClick={handleSubmit} disabled={!selectedOption} className="w-full sm:w-auto px-12">
                                    Submit Answer
                                </ControlButton>
                            </div>
                        )}
                        
                        <div className="mt-4 text-center sm:hidden">
                            <button onClick={() => setActiveQuestion(null)} className="text-white/50 text-sm underline">Cancel / Close</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

      </DemoSection>
    </div>
  );
};

export default JeopardyDemo;
