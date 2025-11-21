
import React, { useState, useEffect } from 'react';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';
import { CheckCircleIcon } from '../Icons';

interface ExamQuestion {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number; // index
    explanation: string;
}

const SAMPLE_EXAM_QUESTIONS: ExamQuestion[] = [
    {
        id: 1,
        text: "Which of the following creates the finest (best) axial resolution?",
        options: ["Low frequency, few cycles", "High frequency, many cycles", "Low frequency, many cycles", "High frequency, few cycles"],
        correctAnswer: 3,
        explanation: "Axial resolution is equal to Spatial Pulse Length (SPL) / 2. SPL = wavelength × # of cycles. To get the shortest SPL (best resolution), you need short wavelengths (high frequency) and fewer cycles (damping)."
    },
    {
        id: 2,
        text: "Sound waves attenuate as they travel through the body. Which component of attenuation is the dominant factor in soft tissue?",
        options: ["Reflection", "Scatter", "Absorption", "Refraction"],
        correctAnswer: 2,
        explanation: "Absorption, the conversion of sound energy into heat, accounts for the vast majority (approx. 80%) of attenuation in soft tissue."
    },
    {
        id: 3,
        text: "If the frame rate increases, which of the following must have changed?",
        options: ["Imaging depth increased", "Sector width increased", "Line density decreased", "Number of focal zones increased"],
        correctAnswer: 2,
        explanation: "Frame rate is inversely related to the workload. Decreasing line density reduces the number of pulses required per frame, allowing the frame rate to increase."
    },
    {
        id: 4,
        text: "What is the hydrostatic pressure at the level of the head in a standing patient?",
        options: ["0 mmHg", "100 mmHg", "-30 mmHg", "75 mmHg"],
        correctAnswer: 2,
        explanation: "In a standing patient, hydrostatic pressure above the heart is negative. At the head, it is approximately -30 mmHg."
    },
     {
        id: 5,
        text: "The Doppler shift is lowest when the angle between the sound beam and the direction of flow is:",
        options: ["0 degrees", "60 degrees", "90 degrees", "180 degrees"],
        correctAnswer: 2,
        explanation: "The Doppler shift is proportional to the cosine of the angle. Cosine of 90 degrees is 0. Therefore, there is no Doppler shift measured at 90 degrees."
    }
];

const SpiMockExamDemo: React.FC = () => {
    const [examState, setExamState] = useState<'intro' | 'active' | 'review'>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>(Array(SAMPLE_EXAM_QUESTIONS.length).fill(-1));
    const [timeLeft, setTimeLeft] = useState(120 * 60); // 2 hours in seconds

    useEffect(() => {
        let timer: number;
        if (examState === 'active' && timeLeft > 0) {
            timer = window.setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [examState, timeLeft]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const calculateScore = () => {
        let score = 0;
        answers.forEach((ans, idx) => {
            if (ans === SAMPLE_EXAM_QUESTIONS[idx].correctAnswer) score++;
        });
        return (score / SAMPLE_EXAM_QUESTIONS.length) * 100;
    };

    return (
        <div className="space-y-8">
            {examState === 'intro' && (
                <DemoSection title="SPI Mock Exam Simulation" description="Prepare for the real thing. This simulation mimics the timing and structure of the ARDMS SPI exam.">
                    <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-8 text-center">
                        <div className="text-6xl mb-6">⏱️</div>
                        <h3 className="text-2xl font-bold text-white mb-4">Exam Parameters</h3>
                        <ul className="text-white/70 text-left max-w-md mx-auto space-y-3 mb-8">
                            <li className="flex items-center gap-3">
                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                110 Questions (Demo: 5 Questions)
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                Time Limit: 2 Hours
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                Topics: Physics, Instrumentation, Artifacts, Safety, Doppler
                            </li>
                        </ul>
                        <ControlButton onClick={() => setExamState('active')}>Start Exam</ControlButton>
                    </div>
                </DemoSection>
            )}

            {examState === 'active' && (
                <div className="w-full max-w-4xl mx-auto">
                    {/* Exam Header */}
                    <div className="flex justify-between items-center bg-gray-800 p-4 rounded-t-xl border-b border-white/10">
                        <span className="font-bold text-white/70">Question {currentQuestionIndex + 1} of {SAMPLE_EXAM_QUESTIONS.length}</span>
                        <div className={`font-mono font-bold text-xl ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    {/* Question Area */}
                    <div className="bg-gray-900 p-8 min-h-[400px] flex flex-col">
                        <p className="text-xl font-medium text-white mb-8 leading-relaxed">
                            {SAMPLE_EXAM_QUESTIONS[currentQuestionIndex].text}
                        </p>

                        <div className="space-y-3 flex-grow">
                            {SAMPLE_EXAM_QUESTIONS[currentQuestionIndex].options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    className={`w-full p-4 text-left rounded-lg transition-all duration-200 flex items-center gap-4 border ${
                                        answers[currentQuestionIndex] === idx 
                                        ? 'bg-yellow-500/20 border-yellow-400 text-yellow-100' 
                                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                        answers[currentQuestionIndex] === idx ? 'border-yellow-400 bg-yellow-400 text-black' : 'border-white/30'
                                    }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Footer */}
                    <div className="bg-gray-800 p-4 rounded-b-xl border-t border-white/10 flex justify-between items-center">
                        <button 
                            onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))}
                            disabled={currentQuestionIndex === 0}
                            className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        
                        <div className="flex gap-2">
                            {SAMPLE_EXAM_QUESTIONS.map((_, idx) => (
                                <div 
                                    key={idx}
                                    className={`w-3 h-3 rounded-full ${
                                        idx === currentQuestionIndex ? 'bg-yellow-400' :
                                        answers[idx] !== -1 ? 'bg-green-500' : 'bg-gray-600'
                                    }`} 
                                />
                            ))}
                        </div>

                        <button 
                            onClick={() => {
                                if (currentQuestionIndex < SAMPLE_EXAM_QUESTIONS.length - 1) {
                                    setCurrentQuestionIndex(p => p + 1);
                                } else {
                                    setExamState('review');
                                }
                            }}
                            className="px-6 py-2 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400"
                        >
                            {currentQuestionIndex === SAMPLE_EXAM_QUESTIONS.length - 1 ? 'Finish Exam' : 'Next'}
                        </button>
                    </div>
                </div>
            )}

            {examState === 'review' && (
                <DemoSection title="Exam Results" description="Review your performance. In the full version, you would receive a detailed breakdown by topic area.">
                     <div className="text-center mb-8">
                        <div className="inline-block p-8 rounded-full border-4 border-yellow-400 mb-4">
                            <span className="text-5xl font-bold text-white">{calculateScore().toFixed(0)}%</span>
                        </div>
                        <p className="text-white/60">Passing Score: 76%</p>
                     </div>

                     <div className="space-y-4">
                        {SAMPLE_EXAM_QUESTIONS.map((q, idx) => {
                            const isCorrect = answers[idx] === q.correctAnswer;
                            return (
                                <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                                    <div className="flex gap-3">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${isCorrect ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white mb-2">{q.text}</p>
                                            <p className="text-sm text-white/60 mb-1">Your Answer: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>{q.options[answers[idx]]}</span></p>
                                            {!isCorrect && <p className="text-sm text-green-400 mb-2">Correct Answer: {q.options[q.correctAnswer]}</p>}
                                            <div className="bg-black/30 p-3 rounded text-sm text-white/80 mt-2">
                                                <span className="font-bold text-yellow-400">Explanation: </span>
                                                {q.explanation}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                     </div>

                     <div className="mt-8 text-center">
                        <ControlButton onClick={() => {
                            setExamState('intro');
                            setAnswers(Array(SAMPLE_EXAM_QUESTIONS.length).fill(-1));
                            setCurrentQuestionIndex(0);
                            setTimeLeft(120 * 60);
                        }}>Return to Dashboard</ControlButton>
                     </div>
                </DemoSection>
            )}
        </div>
    );
};

export default SpiMockExamDemo;
