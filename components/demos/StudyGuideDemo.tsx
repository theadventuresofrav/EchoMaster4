
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { AIFlashcard, AIQuizQuestion } from '../../types';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

const TOPICS = ['Doppler Physics', 'Transducers', 'Artifacts', 'Hemodynamics', 'Safety & Bioeffects'];

const StudyGuideDemo: React.FC = () => {
    const [topic, setTopic] = useState(TOPICS[0]);
    const [contentType, setContentType] = useState<'flashcards' | 'quiz'>('flashcards');
    const [generatedContent, setGeneratedContent] = useState<(AIFlashcard | AIQuizQuestion)[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateContent = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedContent([]);

        let prompt;
        let responseSchema;

        if (contentType === 'flashcards') {
            prompt = `Generate 5 key flashcards for the ultrasound physics topic: "${topic}". For each flashcard, provide a term and a concise definition suitable for someone studying for the SPI exam.`;
            responseSchema = {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        term: { type: Type.STRING },
                        definition: { type: Type.STRING },
                    },
                     required: ['term', 'definition'],
                },
            };
        } else { // Quiz
            prompt = `Generate 3 multiple-choice quiz questions for the ultrasound physics topic: "${topic}". Each question should have 4 options, one correct answer, and a brief explanation for the correct answer. The questions should be SPI exam level.`;
            responseSchema = {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        correctAnswer: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                    },
                    required: ['question', 'options', 'correctAnswer', 'explanation'],
                },
            };
        }

        try {
            if (!process.env.API_KEY) {
                throw new Error("API key not configured.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                },
            });
            
            const jsonResponse = JSON.parse(response.text);
            setGeneratedContent(jsonResponse);

        } catch (e) {
            console.error(e);
            setError("Sorry, I couldn't generate the content. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [topic, contentType]);

    return (
        <DemoSection title="AI-Powered Study Guide" description="Select a topic and content type, then let Gemini generate personalized study materials to help you prepare for the SPI exam.">
            <div className="bg-white/5 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center">
                <select value={topic} onChange={e => setTopic(e.target.value)} className="bg-gray-700 p-3 rounded-lg w-full md:w-1/3">
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={contentType} onChange={e => setContentType(e.target.value as 'flashcards' | 'quiz')} className="bg-gray-700 p-3 rounded-lg w-full md:w-1/3">
                    <option value="flashcards">Flashcards</option>
                    <option value="quiz">Quiz</option>
                </select>
                <ControlButton onClick={generateContent} disabled={isLoading} >
                    {isLoading ? 'Generating...' : `Generate ${contentType}`}
                </ControlButton>
            </div>

            {error && <p className="text-red-400 text-center mt-4">{error}</p>}

            <div className="mt-6 space-y-4">
                {contentType === 'flashcards' && generatedContent.map((item, index) => (
                    <Flashcard key={index} card={item as AIFlashcard} />
                ))}
                {contentType === 'quiz' && generatedContent.map((item, index) => (
                    <QuizItem key={index} item={item as AIQuizQuestion} />
                ))}
            </div>
        </DemoSection>
    );
};

const Flashcard: React.FC<{ card: AIFlashcard }> = ({ card }) => {
    const [flipped, setFlipped] = useState(false);
    return (
        <div className="bg-gray-800 p-4 rounded-lg cursor-pointer" onClick={() => setFlipped(!flipped)}>
            <p className="font-bold text-yellow-400">{flipped ? 'Definition' : 'Term'}</p>
            <p>{flipped ? card.definition : card.term}</p>
        </div>
    );
};

const QuizItem: React.FC<{ item: AIQuizQuestion }> = ({ item }) => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <p className="font-bold mb-2">{item.question}</p>
            <div className="space-y-2">
                {item.options.map(opt => (
                    <button key={opt} onClick={() => setSelected(opt)} className={`w-full text-left p-2 rounded ${selected === opt ? (opt === item.correctAnswer ? 'bg-green-500/50' : 'bg-red-500/50') : 'bg-white/10'}`}>
                        {opt}
                    </button>
                ))}
            </div>
            {selected && (
                 <div className="mt-3 text-sm bg-black/20 p-2 rounded">
                    <p><span className="font-bold text-yellow-300">Explanation:</span> {item.explanation}</p>
                </div>
            )}
        </div>
    );
};


export default StudyGuideDemo;
