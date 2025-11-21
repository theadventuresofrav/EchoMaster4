
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { spiCoursesExpanded } from '../../spi-course-data';
import { ChevronRightIcon, BrainIcon, CheckCircleIcon } from '../Icons';
import ControlButton from './ControlButton';
import { AIStudyPlan } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import NarratorControl from '../NarratorControl';

// --- Types ---
type Topic = typeof spiCoursesExpanded.courses[0]['modules'][0]['topics'][0];
type ModuleType = typeof spiCoursesExpanded.courses[0]['modules'][0];

// --- Icons ---
const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);


// --- AI Review Display Component ---
const AIReviewDisplay: React.FC<{ review: AIStudyPlan, moduleTitle: string }> = ({ review, moduleTitle }) => (
    <div className="mt-6 text-left w-full bg-black/40 p-4 rounded-lg border border-yellow-400/30 animate-fade-in">
        <h3 className="text-lg font-bold text-yellow-400 mb-2 text-center">✨ Personalized Review for {moduleTitle}</h3>
        <p className="text-center italic text-white/80 mb-4 text-sm">{review.summary}</p>
        {review.weakAreas.map((area, index) => (
            <div key={index} className="mb-4 pb-2 border-b border-white/10 last:border-b-0">
                <h4 className="font-bold text-white">{index + 1}. Focus On: {area.concept}</h4>
                <p className="text-xs text-white/70 mt-1">{area.explanation}</p>
                <div className="mt-2 bg-yellow-400/10 p-2 rounded-md border border-yellow-400/20">
                    <p className="font-semibold text-yellow-300 text-xs">Key Takeaway:</p>
                    <p className="text-xs text-yellow-200/90">{area.keyTakeaway}</p>
                </div>
            </div>
        ))}
        <p className="text-xs text-white/40 text-right mt-2 font-sans">Powered by Gemini</p>
    </div>
);

// --- Interactive Visual Sub-Components ---

const AcousticVariablesVisual: React.FC = () => {
    const [intensity, setIntensity] = useState(50);

    return (
        <div className="w-full bg-gray-900 rounded-lg border border-white/10 mb-6 p-4">
            <h4 className="text-sm font-bold text-yellow-400 mb-4 text-center">Interactive Acoustic Wave</h4>
            <div className="h-40 relative overflow-hidden bg-gray-800/50 rounded-lg mb-4 flex items-center justify-center">
                 {/* Particles */}
                 <div className="flex gap-1">
                    {[...Array(25)].map((_, i) => (
                        <div key={i} className="w-1.5 h-24 bg-blue-400/60 rounded-full" style={{
                            animation: `acoustic-wave 1s infinite ease-in-out`,
                            animationDelay: `${i * 0.1}s`,
                            // Intensity affects the scale (compression)
                            transformOrigin: 'center'
                        }} />
                    ))}
                </div>
                <div className="absolute bottom-2 left-2 text-[10px] text-white/50 font-mono">
                    High Pressure (Compression) vs Low Pressure (Rarefaction)
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <span className="text-xs text-white/70">Intensity:</span>
                <input 
                    type="range" min="10" max="100" value={intensity} 
                    onChange={e => setIntensity(Number(e.target.value))}
                    className="flex-grow h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
            </div>
             <style>{`
                @keyframes acoustic-wave {
                    0%, 100% { transform: scaleX(1) translateX(0); opacity: 0.4; background-color: #60a5fa; }
                    50% { transform: scaleX(${1 - intensity/150}) translateX(${intensity/5}px); opacity: 1; background-color: #f87171; }
                }
            `}</style>
        </div>
    );
};

const PropagationSpeedVisual: React.FC = () => {
    const [racing, setRacing] = useState(false);

    const startRace = () => {
        setRacing(false);
        setTimeout(() => setRacing(true), 50);
    };

    return (
        <div className="w-full bg-gray-900 rounded-lg border border-white/10 mb-6 p-4">
             <div className="flex justify-between items-center mb-4">
                 <h4 className="text-sm font-bold text-yellow-400">Speed of Sound Race</h4>
                 <button onClick={startRace} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition-colors border border-white/20">
                     ▶ Trigger Pulse
                 </button>
             </div>
             <div className="space-y-4">
                 {[
                    {l: 'Air (Gas)', speed: '330 m/s', time: '5s', color: 'bg-gray-500'},
                    {l: 'Soft Tissue', speed: '1540 m/s', time: '2s', color: 'bg-blue-500'}, 
                    {l: 'Bone (Solid)', speed: '4080 m/s', time: '0.8s', color: 'bg-white'}
                ].map(m => (
                     <div key={m.l} className="relative">
                         <div className="flex justify-between text-xs text-white/80 mb-1">
                             <span>{m.l}</span>
                             <span className="font-mono text-yellow-400">{m.speed}</span>
                         </div>
                         <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden relative">
                             {/* Pulse */}
                             <div 
                                className={`absolute top-0 left-0 h-full w-8 ${m.color} rounded-full shadow-[0_0_10px_currentColor] opacity-80`}
                                style={{
                                    animation: racing ? `travel-right ${m.time} linear forwards` : 'none',
                                    left: racing ? '100%' : '0'
                                }}
                             ></div>
                         </div>
                     </div>
                 ))}
             </div>
             <style>{`
                @keyframes travel-right {
                    from { left: -10%; }
                    to { left: 100%; }
                }
             `}</style>
        </div>
    );
};

const FrequencyWavelengthVisual: React.FC = () => {
    const [frequency, setFrequency] = useState(5); // MHz

    // Wavelength is inversely proportional
    // Visual representation: simpler path d calculation
    const getPath = (freq: number) => {
        let d = `M 0 20`;
        const width = 300;
        const cycles = freq * 1.5; 
        const step = width / cycles;
        
        for(let i=0; i <= cycles; i++) {
            const x = i * step;
            const y = i % 2 === 0 ? 20 : (i % 4 === 1 ? 5 : 35); // rough peaks/valleys
            // Using Q curves for smoother sine approximation
            // Actually let's just use Q points. 
            // For simplicity in this demo string builder:
        }
        // Cleaner approach:
        let path = "M 0 20 ";
        for(let x=0; x <= 300; x+=5) {
            const y = 20 + 15 * Math.sin((x / 300) * freq * Math.PI * 2);
            path += `L ${x} ${y} `;
        }
        return path;
    };

    return (
        <div className="w-full bg-gray-900 rounded-lg border border-white/10 mb-6 p-4">
            <h4 className="text-sm font-bold text-yellow-400 mb-4 text-center">Frequency vs. Wavelength</h4>
            
            <div className="h-24 bg-black rounded-lg border border-gray-700 mb-4 flex items-center overflow-hidden relative">
                 <svg width="100%" height="100%" viewBox="0 0 300 40" preserveAspectRatio="none">
                    <path d={getPath(frequency)} stroke={frequency > 6 ? "#22d3ee" : "#facc15"} strokeWidth="2" fill="none" className="transition-all duration-300" />
                </svg>
                
                {/* Wavelength Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-24 h-px bg-white/30"></div>
                <div className="absolute top-1/2 left-1/2 -translate-y-6 text-[10px] text-white/50">
                    λ = c / f
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-xs text-white/70 w-16 font-mono">f: {frequency}MHz</span>
                <input 
                    type="range" min="2" max="12" step="1" value={frequency} 
                    onChange={e => setFrequency(Number(e.target.value))}
                    className="flex-grow h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                />
                <span className="text-xs text-white/70 w-16 font-mono text-right">λ: {(1.54/frequency).toFixed(2)}mm</span>
            </div>
        </div>
    );
};

const PiezoelectricVisual: React.FC = () => {
    const [activeMode, setActiveMode] = useState<'none' | 'transmit' | 'receive'>('none');

    const trigger = (mode: 'transmit' | 'receive') => {
        setActiveMode(mode);
        setTimeout(() => setActiveMode('none'), 1500);
    };

    return (
         <div className="w-full bg-gray-900 rounded-lg border border-white/10 mb-6 p-4">
            <h4 className="text-sm font-bold text-yellow-400 mb-4 text-center">Interactive PZT Effect</h4>
            
            <div className="flex justify-around items-center mb-6">
                 {/* Crystal */}
                <div className={`w-32 h-16 rounded-lg border-2 flex items-center justify-center transition-all duration-200 relative
                    ${activeMode === 'transmit' ? 'bg-yellow-400 border-white scale-110' : ''}
                    ${activeMode === 'receive' ? 'bg-yellow-600 border-yellow-400 scale-y-75' : ''}
                    ${activeMode === 'none' ? 'bg-yellow-500 border-yellow-300' : ''}
                `}>
                    <span className="font-black text-black">PZT</span>
                    
                    {/* Effects */}
                    {activeMode === 'transmit' && (
                        <>
                            <div className="absolute -right-12 text-2xl animate-ping">🔊</div>
                            <div className="absolute inset-0 border-4 border-white rounded-lg animate-pulse"></div>
                        </>
                    )}
                    {activeMode === 'receive' && (
                        <div className="absolute -top-8 text-yellow-300 font-bold animate-bounce">⚡ VOLTAGE ⚡</div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => trigger('receive')}
                    disabled={activeMode !== 'none'}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 py-2 rounded text-xs font-bold text-white transition-colors disabled:opacity-50"
                >
                    Apply Pressure (Receive)
                </button>
                <button 
                    onClick={() => trigger('transmit')}
                    disabled={activeMode !== 'none'}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 py-2 rounded text-xs font-bold text-white transition-colors disabled:opacity-50"
                >
                    Apply Voltage (Transmit)
                </button>
            </div>
        </div>
    );
};

const TransducerComponentsVisual: React.FC = () => {
    const [highlight, setHighlight] = useState<string | null>(null);

    const parts = [
        { id: 'backing', name: 'Backing Material', desc: 'Shortens pulse, improves axial resolution.', color: 'bg-gray-700' },
        { id: 'crystal', name: 'PZT Crystal', desc: 'Active element. Converts energy.', color: 'bg-yellow-500' },
        { id: 'matching', name: 'Matching Layer', desc: 'Reduces impedance mismatch with skin.', color: 'bg-blue-500' }
    ];

    return (
        <div className="w-full bg-gray-900 rounded-lg border border-white/10 mb-6 p-4">
             <h4 className="text-sm font-bold text-yellow-400 mb-2 text-center">Interactive Transducer Anatomy</h4>
             <p className="text-center text-[10px] text-white/50 mb-4">Click a component to identify it.</p>

             <div className="flex flex-col items-center relative mb-4">
                 {/* Wire */}
                <div className="w-1 h-6 bg-gray-500"></div>
                
                {/* Backing */}
                <div 
                    onClick={() => setHighlight('backing')}
                    className={`w-32 h-12 border border-white/20 cursor-pointer transition-all ${highlight === 'backing' ? 'bg-gray-600 ring-2 ring-white' : 'bg-gray-800'} flex items-center justify-center`}
                >
                    <span className="text-[10px] text-white/30 pointer-events-none">Backing</span>
                </div>

                {/* Crystal */}
                <div 
                    onClick={() => setHighlight('crystal')}
                    className={`w-32 h-4 border-x border-white/20 cursor-pointer transition-all ${highlight === 'crystal' ? 'bg-yellow-300 ring-2 ring-white z-10' : 'bg-yellow-500'} flex items-center justify-center`}
                >
                </div>

                {/* Matching */}
                <div 
                    onClick={() => setHighlight('matching')}
                    className={`w-32 h-2 border-x border-b border-white/20 cursor-pointer transition-all ${highlight === 'matching' ? 'bg-blue-300 ring-2 ring-white' : 'bg-blue-500'}`}
                ></div>
             </div>

             <div className="h-16 bg-white/5 rounded p-2 text-center flex items-center justify-center">
                 {highlight ? (
                     <div>
                         <p className="text-sm font-bold text-white">{parts.find(p => p.id === highlight)?.name}</p>
                         <p className="text-xs text-white/70">{parts.find(p => p.id === highlight)?.desc}</p>
                     </div>
                 ) : (
                     <p className="text-xs text-white/40 italic">Select a component above</p>
                 )}
             </div>
        </div>
    );
};

const CrystalFrequencyVisual: React.FC = () => {
    const [thickness, setThickness] = useState(50); // 10 - 100 scale
    
    // Thicker = Lower Freq
    // Thinner = Higher Freq
    const frequency = (100 - thickness) / 8 + 2; // Approx mapping

    return (
        <div className="w-full bg-gray-900 rounded-lg border border-white/10 mb-6 p-4">
            <h4 className="text-sm font-bold text-yellow-400 mb-4 text-center">Crystal Thickness vs. Frequency</h4>

            <div className="h-32 flex items-center justify-center gap-8 mb-4">
                <div className="flex flex-col items-center justify-center h-full w-32 relative">
                    <div 
                        className="w-24 bg-gradient-to-b from-yellow-400 to-yellow-600 border border-yellow-200 shadow-lg transition-all duration-300"
                        style={{ height: `${thickness}%` }}
                    ></div>
                    <p className="text-xs text-white/50 mt-2">PZT Thickness</p>
                </div>
                
                <div className="text-center">
                    <p className="text-3xl font-bold font-mono text-cyan-400">{frequency.toFixed(1)} MHz</p>
                    <p className="text-xs text-white/70 mt-1">Operating Frequency</p>
                </div>
            </div>

            <input 
                type="range" min="10" max="90" value={thickness}
                onChange={e => setThickness(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between text-[10px] text-white/40 mt-1">
                <span>Thin (High Freq)</span>
                <span>Thick (Low Freq)</span>
            </div>
        </div>
    );
};

// --- Main TopicVisual Wrapper ---
const TopicVisual: React.FC<{ topicId: string }> = ({ topicId }) => {
    switch (topicId) {
        case '1-1': return <AcousticVariablesVisual />;
        case '1-2': return <PropagationSpeedVisual />;
        case '1-3': return <FrequencyWavelengthVisual />;
        case '2-1': return <PiezoelectricVisual />;
        case '2-2': return <TransducerComponentsVisual />;
        case '2-3': return <CrystalFrequencyVisual />;
        default: return null;
    }
};

// --- Quiz Modal Component ---
const ModuleQuiz: React.FC<{ 
    module: ModuleType; 
    onClose: () => void;
    onReviewGenerated: (review: AIStudyPlan) => void;
}> = ({ module, onClose, onReviewGenerated }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [userAnswers, setUserAnswers] = useState<(string | null)[]>(Array(module.quiz?.questions.length ?? 0).fill(null));

    // AI Review State
    const [aiReview, setAiReview] = useState<AIStudyPlan | null>(null);
    const [isReviewLoading, setIsReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState<string | null>(null);

    const questions = module.quiz?.questions ?? [];
    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswer = (answer: string) => {
        if (showExplanation) return;
        setSelectedAnswer(answer);
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = answer;
        setUserAnswers(newAnswers);

        if (answer === currentQuestion.correctAnswer) {
            setScore(prev => prev + 1);
        }
        setShowExplanation(true);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            setQuizFinished(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore(0);
        setQuizFinished(false);
        setUserAnswers(Array(questions.length).fill(null));
        setAiReview(null);
        setReviewError(null);
    };

    const handleGetAiReview = async () => {
        setIsReviewLoading(true);
        setReviewError(null);
        setAiReview(null);

        if (!process.env.API_KEY) {
            setReviewError("API Key is not configured.");
            setIsReviewLoading(false);
            return;
        }

        const incorrectAnswers = questions
            .map((q, i) => ({ ...q, userAnswer: userAnswers[i] }))
            .filter((q) => q.userAnswer !== null && q.userAnswer !== q.correctAnswer);

        if (incorrectAnswers.length === 0) {
            const perfectScoreReview: AIStudyPlan = { summary: "Excellent! You answered all questions for this module correctly. Keep up the great work!", weakAreas: [] };
            setAiReview(perfectScoreReview);
            onReviewGenerated(perfectScoreReview);
            setIsReviewLoading(false);
            return;
        }

        const prompt = `You are an expert ultrasound physics tutor. A student just finished a quiz for the module "${module.title}" and answered some questions incorrectly. Based on their errors, provide a concise, personalized study plan in JSON format.
The plan should:
1.  Provide a brief, encouraging summary (1-2 sentences).
2.  Identify 1-2 core "weak areas" based on their errors.
3.  For each weak area:
    - State the concept.
    - Briefly explain its importance.
    - Provide one key takeaway to help them remember.
Do NOT recommend other modules. Focus only on the concepts within this module.
Here are the questions they answered incorrectly:
${JSON.stringify(incorrectAnswers.map(q => ({ question: q.questionText, userAnswer: q.userAnswer, correctAnswer: q.correctAnswer, explanation: q.explanation })))}
Provide only the JSON object in your response.`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                 config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            summary: { type: Type.STRING },
                            weakAreas: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        concept: { type: Type.STRING },
                                        explanation: { type: Type.STRING },
                                        keyTakeaway: { type: Type.STRING },
                                    },
                                    required: ['concept', 'explanation', 'keyTakeaway']
                                }
                            }
                        },
                        required: ['summary', 'weakAreas']
                    }
                }
            });

            const jsonText = response.text.trim();
            const parsedReview: AIStudyPlan = JSON.parse(jsonText);
            setAiReview(parsedReview);
            onReviewGenerated(parsedReview);
        } catch (e) {
            console.error(e);
            setReviewError("Failed to generate your review. Please try again.");
        } finally {
            setIsReviewLoading(false);
        }
    };


    const QuizContent = () => {
        if (quizFinished) {
            const finalScore = (score / questions.length) * 100;
            return (
                <div className="text-center flex flex-col items-center">
                    <h3 className="text-2xl font-bold text-yellow-400">Quiz Complete!</h3>
                    <p className="text-lg mt-4">Your score: <span className="font-bold">{score} / {questions.length}</span> ({(finalScore).toFixed(0)}%)</p>
                    <div className="mt-6 flex justify-center gap-4">
                        <ControlButton onClick={restartQuiz} secondary>Try Again</ControlButton>
                        <ControlButton onClick={onClose}>Close</ControlButton>
                    </div>
                    <div className="mt-6 w-full max-w-lg">
                        <ControlButton onClick={handleGetAiReview} disabled={isReviewLoading}>
                            {isReviewLoading ? "Analyzing..." : "Get AI-Powered Review ✨"}
                        </ControlButton>
                         {reviewError && <p className="text-red-400 mt-2 text-sm">{reviewError}</p>}
                         {aiReview && <AIReviewDisplay review={aiReview} moduleTitle={module.title} />}
                    </div>
                </div>
            );
        }

        if (!currentQuestion) {
            return <div className="text-center">No questions available for this module.</div>;
        }

        return (
            <>
                <h3 className="text-xl font-bold mb-4">Question {currentQuestionIndex + 1} of {questions.length}</h3>
                <p className="mb-6 text-white/90">{currentQuestion.questionText}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => {
                        const isCorrect = option === currentQuestion.correctAnswer;
                        const isSelected = option === selectedAnswer;
                        let buttonClass = 'bg-white/10 border border-white/20 text-white hover:bg-white/20';
                        if (showExplanation) {
                            if (isCorrect) buttonClass = 'bg-green-500/80 border-green-400 text-white';
                            else if (isSelected) buttonClass = 'bg-red-500/80 border-red-400 text-white';
                            else buttonClass = 'bg-white/10 border border-white/20 text-white opacity-60';
                        }
                        return (
                            <button key={index} onClick={() => handleAnswer(option)} disabled={showExplanation} className={`p-4 rounded-lg text-left transition-all duration-300 w-full font-semibold ${buttonClass}`}>
                                {option}
                            </button>
                        );
                    })}
                </div>

                {showExplanation && (
                    <div className="mt-6 p-4 bg-black/30 rounded-lg animate-fade-in">
                        <p className="font-bold text-yellow-400">Explanation:</p>
                        <p className="text-white/80 mt-2">{currentQuestion.explanation}</p>
                        <div className="text-right mt-4">
                            <ControlButton onClick={handleNext}>
                                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                            </ControlButton>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gray-800 rounded-lg p-6 sm:p-8 w-full max-w-3xl max-h-[90vh] flex flex-col border border-white/20">
                <header className="flex justify-between items-center mb-6 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-yellow-400">Module {module.id} Quiz</h2>
                    <button onClick={onClose} className="text-2xl text-white/70 hover:text-white">&times;</button>
                </header>
                <div className="overflow-y-auto">
                    <QuizContent />
                </div>
            </div>
        </div>
    );
};

// --- Main Component: CourseDetailDemo ---

const CourseDetailDemo: React.FC = () => {
    const course = spiCoursesExpanded.courses[0];
    
    // Navigation State
    const [activeModuleId, setActiveModuleId] = useState<number>(course.modules[0].id);
    const [activeTopicId, setActiveTopicId] = useState<string>(course.modules[0].topics[0].id);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Quiz State
    const [activeQuizModule, setActiveQuizModule] = useState<ModuleType | null>(null);
    const [moduleReviews, setModuleReviews] = useState<{[moduleId: number]: AIStudyPlan}>({});

    // Flatten topics for easier next/prev navigation
    const flatTopics = useMemo(() => {
        return course.modules.flatMap(m => m.topics.map(t => ({ ...t, moduleId: m.id })));
    }, [course]);

    const activeTopicIndex = flatTopics.findIndex(t => t.id === activeTopicId);
    const activeTopic = flatTopics[activeTopicIndex];
    const activeModule = course.modules.find(m => m.id === activeModuleId) || course.modules[0];

    // Auto-scroll content to top when topic changes
    const contentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [activeTopicId]);

    const navigateToTopic = (topicId: string, moduleId: number) => {
        setActiveTopicId(topicId);
        setActiveModuleId(moduleId);
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false); // Close mobile sidebar on selection
        }
    };

    const handlePrev = () => {
        if (activeTopicIndex > 0) {
            const prev = flatTopics[activeTopicIndex - 1];
            navigateToTopic(prev.id, prev.moduleId);
        }
    };

    const handleNext = () => {
        if (activeTopicIndex < flatTopics.length - 1) {
            const next = flatTopics[activeTopicIndex + 1];
            navigateToTopic(next.id, next.moduleId);
        }
    };

    const handleQuizOpen = (module: ModuleType, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setActiveQuizModule(module);
    };

    const handleReviewGenerated = (moduleId: number, review: AIStudyPlan) => {
        setModuleReviews(prev => ({ ...prev, [moduleId]: review }));
    };

    // Narrator text for current topic
    const narratorContent = `${activeTopic.title}. ${activeTopic.content} Key Takeaways: ${activeTopic.keyPoints.join('. ')}. Exam Focus: ${activeTopic.examFocus}`;

    return (
        <div className="flex h-[75vh] lg:h-[800px] bg-gray-900/80 border border-white/10 rounded-xl overflow-hidden relative shadow-2xl">
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden absolute top-4 right-4 z-30">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="bg-gray-800 p-2 rounded-full border border-white/20 text-white">
                    {isSidebarOpen ? <XIcon className="w-6 h-6"/> : <MenuIcon className="w-6 h-6"/>}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`
                absolute inset-y-0 left-0 z-20 w-64 bg-gray-900 border-r border-white/10 transform transition-transform duration-300 ease-in-out
                lg:static lg:translate-x-0 flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-4 border-b border-white/10 bg-black/20">
                    <h2 className="font-bold text-yellow-400">Course Content</h2>
                    <p className="text-xs text-white/50 mt-1">{flatTopics.length} Topics • {course.modules.length} Modules</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 space-y-4">
                    {course.modules.map(module => {
                        const isActiveModule = module.id === activeModuleId;
                        return (
                            <div key={module.id} className="rounded-lg overflow-hidden bg-white/5">
                                <div 
                                    className="p-3 flex justify-between items-center cursor-pointer hover:bg-white/10 transition-colors"
                                    onClick={() => setActiveModuleId(isActiveModule ? 0 : module.id)}
                                >
                                    <span className="font-bold text-sm text-white/90">Module {module.id}</span>
                                    <ChevronDownIcon className={`w-4 h-4 text-white/50 transition-transform ${isActiveModule ? 'rotate-180' : ''}`} />
                                </div>
                                
                                <AnimatePresence>
                                    {isActiveModule && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex flex-col pl-3 pr-2 pb-2 gap-1">
                                                {module.topics.map(topic => (
                                                    <button
                                                        key={topic.id}
                                                        onClick={() => navigateToTopic(topic.id, module.id)}
                                                        className={`text-left text-xs py-2 px-3 rounded-md transition-colors flex items-center gap-2 ${
                                                            activeTopicId === topic.id 
                                                                ? 'bg-yellow-500/20 text-yellow-400 font-semibold border-l-2 border-yellow-400' 
                                                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                                                        }`}
                                                    >
                                                       <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${activeTopicId === topic.id ? 'bg-yellow-400' : 'bg-white/20'}`}></div>
                                                       <span className="truncate">{topic.title}</span>
                                                    </button>
                                                ))}
                                                <button 
                                                    onClick={(e) => handleQuizOpen(module, e)}
                                                    className="mt-2 text-xs font-bold text-center bg-yellow-600/20 text-yellow-500 py-2 rounded hover:bg-yellow-600/30 transition-colors border border-yellow-600/30"
                                                >
                                                    Take Module Quiz
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative bg-gray-800/50">
                {/* Content Header */}
                <header className="p-6 border-b border-white/10 bg-gray-900/50 backdrop-blur-md z-10 flex justify-between items-center">
                    <div>
                        <div className="flex items-center text-xs text-white/40 mb-2 gap-2 font-mono">
                            <span>MODULE {activeModule.id}</span>
                            <ChevronRightIcon className="w-3 h-3" />
                            <span className="text-yellow-400/80 uppercase tracking-wide">TOPIC {activeTopic.id}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">{activeTopic.title}</h1>
                    </div>
                    <div className="hidden sm:block">
                        <NarratorControl text={narratorContent} label="Read Lesson" />
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 scroll-smooth" ref={contentRef}>
                     <div className="max-w-3xl mx-auto">
                        {/* Mobile Narrator Control */}
                        <div className="sm:hidden mb-4 flex justify-end">
                             <NarratorControl text={narratorContent} label="Read" compact />
                        </div>

                        {/* Visual */}
                        <TopicVisual topicId={activeTopic.id} />

                        {/* Text Content */}
                        <div className="prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed mb-8">
                            <p className="whitespace-pre-wrap">{activeTopic.content}</p>
                        </div>

                        {/* Key Points */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                    Key Takeaways
                                </h3>
                                <ul className="space-y-2">
                                    {activeTopic.keyPoints.map((point, i) => (
                                        <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/30 mt-1.5 flex-shrink-0"></span>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-yellow-500/10 p-5 rounded-xl border border-yellow-500/20">
                                <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                                    <BrainIcon className="w-5 h-5" />
                                    Exam Focus
                                </h3>
                                <p className="text-sm text-yellow-100/80 italic">"{activeTopic.examFocus}"</p>
                            </div>
                        </div>

                        {/* Display Saved Review */}
                        {moduleReviews[activeModule.id] && (
                             <AIReviewDisplay review={moduleReviews[activeModule.id]} moduleTitle={activeModule.title} />
                        )}
                     </div>
                </div>

                {/* Footer Navigation */}
                <footer className="p-4 border-t border-white/10 bg-gray-900 flex justify-between items-center">
                    <button 
                        onClick={handlePrev} 
                        disabled={activeTopicIndex === 0}
                        className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
                    >
                        <ChevronRightIcon className="w-4 h-4 rotate-180" />
                        Previous
                    </button>
                    
                    <span className="text-xs text-white/30 hidden sm:block">
                        {activeTopicIndex + 1} of {flatTopics.length}
                    </span>

                    <button 
                        onClick={handleNext} 
                        disabled={activeTopicIndex === flatTopics.length - 1}
                        className="px-6 py-2 rounded-lg bg-yellow-500 text-black text-sm font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next Topic
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </footer>
            </main>

            {/* Quiz Modal */}
            {activeQuizModule && (
                <ModuleQuiz 
                    module={activeQuizModule} 
                    onClose={() => setActiveQuizModule(null)} 
                    onReviewGenerated={(review) => handleReviewGenerated(activeQuizModule.id, review)}
                />
            )}
        </div>
    );
};

export default CourseDetailDemo;
