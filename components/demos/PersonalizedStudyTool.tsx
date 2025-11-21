
import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { motion, AnimatePresence } from 'framer-motion';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

// --- Engine Logic (Numerology & Zodiac) ---

const calculateLifePath = (birthdate: string): number => {
    const digits = birthdate.replace(/\D/g, '').split('').map(Number);
    const sum = digits.reduce((a, b) => a + b, 0);
    
    // Simple reduction to single digit for MVP, preserving master numbers logic would go here if needed
    // Recursive reduction
    const reduce = (n: number): number => {
        if (n <= 9 || n === 11 || n === 22 || n === 33) return n;
        const nextSum = n.toString().split('').reduce((a, b) => a + parseInt(b), 0);
        return reduce(nextSum);
    };
    
    return reduce(sum);
};

const getZodiacSign = (day: number, month: number): string => {
    const signs = [
        { sign: "Capricorn", endDay: 19 },
        { sign: "Aquarius", endDay: 18 },
        { sign: "Pisces", endDay: 20 },
        { sign: "Aries", endDay: 19 },
        { sign: "Taurus", endDay: 20 },
        { sign: "Gemini", endDay: 20 },
        { sign: "Cancer", endDay: 22 },
        { sign: "Leo", endDay: 22 },
        { sign: "Virgo", endDay: 22 },
        { sign: "Libra", endDay: 22 },
        { sign: "Scorpio", endDay: 21 },
        { sign: "Sagittarius", endDay: 21 },
        { sign: "Capricorn", endDay: 31 } // Loop back
    ];
    
    // Month is 1-indexed
    if (day <= signs[month - 1].endDay) {
        return signs[month - 1].sign;
    } else {
        return signs[month % 12].sign;
    }
};

const getChineseZodiac = (year: number): string => {
    const animals = ["Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat"];
    return animals[year % 12];
};

const getPersonalYear = (dob: string): number => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const [_, month, day] = dob.split('-').map(Number);
    
    const sum = currentYear + month + day;
    const reduce = (n: number): number => {
        if (n <= 9) return n;
        const nextSum = n.toString().split('').reduce((a, b) => a + parseInt(b), 0);
        return reduce(nextSum);
    };
    return reduce(sum);
};

// --- VARK Quiz ---
const VARK_QUESTIONS = [
    {
        q: "When you are learning something new, you prefer to:",
        options: [
            { type: "V", text: "See diagrams, graphs, or pictures." },
            { type: "A", text: "Listen to explanations or podcasts." },
            { type: "R", text: "Read written instructions or articles." },
            { type: "K", text: "Try it out yourself or build a model." }
        ]
    },
    {
        q: "You have a problem with your heart. You would prefer that the doctor:",
        options: [
            { type: "V", text: "Showed you a diagram of what was wrong." },
            { type: "A", text: "Described what was wrong." },
            { type: "R", text: "Gave you a pamphlet or article to read." },
            { type: "K", text: "Used a plastic model to show what was happening." }
        ]
    },
    {
        q: "To remember a list of items, you are most likely to:",
        options: [
            { type: "V", text: "Write them down and visualize the list." },
            { type: "A", text: "Repeat the list to yourself." },
            { type: "R", text: "Read the list over and over." },
            { type: "K", text: "Use your fingers to count them off." }
        ]
    }
];

type LearningStyle = 'Visual' | 'Auditory' | 'Reading/Writing' | 'Kinesthetic';

// --- Types for Generation ---

interface GeneratedLesson {
    title: string;
    teachingStyle: string;
    format: string;
    steps: {
        title: string;
        duration: string;
        activity: string;
        reasoning: string; // Why this fits their profile
    }[];
    numerologyInsight: string;
}

// --- Main Component ---

const PersonalizedStudyTool: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        topic: 'Doppler Physics', // Default
        quizAnswers: Array(VARK_QUESTIONS.length).fill(null) as string[],
    });
    const [profile, setProfile] = useState<{
        lifePath: number;
        zodiac: string;
        chineseZodiac: string;
        personalYear: number;
        learningStyle: LearningStyle;
    } | null>(null);

    const [lesson, setLesson] = useState<GeneratedLesson | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- Handlers ---

    const handleQuizSelect = (qIdx: number, type: string) => {
        const newAnswers = [...formData.quizAnswers];
        newAnswers[qIdx] = type;
        setFormData({ ...formData, quizAnswers: newAnswers });
    };

    const calculateProfile = () => {
        if (!formData.dob || !formData.name) return;
        
        // Calc Numerology/Zodiac
        const lifePath = calculateLifePath(formData.dob);
        const [y, m, d] = formData.dob.split('-').map(Number);
        const zodiac = getZodiacSign(d, m);
        const chineseZodiac = getChineseZodiac(y);
        const personalYear = getPersonalYear(formData.dob);

        // Calc Learning Style
        const counts: {[key: string]: number} = { V: 0, A: 0, R: 0, K: 0 };
        formData.quizAnswers.forEach(a => { if(a) counts[a]++ });
        const dominantType = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        const styleMap: {[key: string]: LearningStyle} = { 
            V: 'Visual', A: 'Auditory', R: 'Reading/Writing', K: 'Kinesthetic' 
        };

        setProfile({
            lifePath,
            zodiac,
            chineseZodiac,
            personalYear,
            learningStyle: styleMap[dominantType]
        });
        setStep(2);
    };

    const generateLesson = async () => {
        if (!profile || !process.env.API_KEY) return;
        setIsLoading(true);

        const prompt = `
            Generate a highly personalized Ultrasound Physics lesson plan for a student with the following profile:
            - Name: ${formData.name}
            - Topic: ${formData.topic}
            - Numerology Life Path: ${profile.lifePath}
            - Personal Year: ${profile.personalYear}
            - Western Zodiac: ${profile.zodiac}
            - Chinese Zodiac: ${profile.chineseZodiac}
            - Learning Style (VARK): ${profile.learningStyle}

            Use the following "Lesson Logic Matrix" rules:
            1. Numerology:
               - LP 1: Foster independence, challenges.
               - LP 4: High structure, step-by-step.
               - LP 5: Variety, gamification, speed.
               - LP 7: Deep analysis, research, "why" questions.
               - LP 9: Humanitarian/Emotional connection, holistic view.
            2. Zodiac:
               - Fire signs (Aries/Leo/Sag): Energetic, fast-paced.
               - Earth signs (Tau/Vir/Cap): Practical, grounded examples.
               - Air signs (Gem/Lib/Aq): Concepts, theories, communication.
               - Water signs (Can/Sco/Pis): Intuitive, visual flows.
            3. Learning Style:
               - Visual: Diagrams, videos, color-coding.
               - Auditory: Analogies, verbal repetition, teaching back.
               - Reading: Summaries, lists, articles.
               - Kinesthetic: Simulations, drawing, models.

            Generate a JSON response with this structure:
            {
                "title": "Creative Lesson Title",
                "teachingStyle": "Description of the pedagogical approach used",
                "format": "Primary lesson format (e.g., 'Gamified Lab', 'Deep Dive Research')",
                "numerologyInsight": "A sentence explaining how their numbers influenced this plan",
                "steps": [
                    {
                        "title": "Step Title",
                        "duration": "Time (e.g. 10 mins)",
                        "activity": "Specific instruction",
                        "reasoning": "Why this specific activity fits their profile"
                    }
                ]
            }
        `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            teachingStyle: { type: Type.STRING },
                            format: { type: Type.STRING },
                            numerologyInsight: { type: Type.STRING },
                            steps: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        title: { type: Type.STRING },
                                        duration: { type: Type.STRING },
                                        activity: { type: Type.STRING },
                                        reasoning: { type: Type.STRING },
                                    }
                                }
                            }
                        }
                    }
                }
            });
            
            const json = JSON.parse(response.text);
            setLesson(json);
            setStep(3);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render ---

    return (
        <DemoSection 
            title="AI Personalized Learning Engine" 
            description="Harnessing the power of data-driven astrology, numerology, and learning psychology to generate the perfect study plan for YOU."
        >
            <div className="min-h-[400px] bg-gray-900 border border-purple-500/30 rounded-xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.1)] relative overflow-hidden">
                {/* Background Ambient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                <AnimatePresence mode="wait">
                    {/* STEP 1: INTAKE */}
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-2xl mx-auto"
                        >
                            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6 text-center">
                                Profile Initialization
                            </h3>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={formData.name} 
                                            onChange={e => setFormData({...formData, name: e.target.value})} 
                                            className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none"
                                            placeholder="Enter name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Date of Birth</label>
                                        <input 
                                            type="date" 
                                            value={formData.dob} 
                                            onChange={e => setFormData({...formData, dob: e.target.value})} 
                                            className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 p-4 rounded-lg border border-white/5">
                                    <h4 className="font-bold text-purple-300 mb-4">Quick Learning Style Quiz (VARK)</h4>
                                    <div className="space-y-6">
                                        {VARK_QUESTIONS.map((q, i) => (
                                            <div key={i}>
                                                <p className="text-sm text-white/90 mb-2">{i+1}. {q.q}</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {q.options.map(opt => (
                                                        <button 
                                                            key={opt.type}
                                                            onClick={() => handleQuizSelect(i, opt.type)}
                                                            className={`text-left text-xs p-2 rounded border transition-all ${formData.quizAnswers[i] === opt.type ? 'bg-purple-600/50 border-purple-400 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                                                        >
                                                            {opt.text}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center">
                                    <ControlButton 
                                        onClick={calculateProfile}
                                        disabled={!formData.name || !formData.dob || formData.quizAnswers.includes(null)}
                                    >
                                        Analyze Profile
                                    </ControlButton>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: PROFILE REVEAL & TOPIC */}
                    {step === 2 && profile && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-3xl mx-auto"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-gray-800 p-4 rounded-xl border border-purple-500/30 text-center">
                                    <p className="text-xs text-purple-300 uppercase tracking-widest mb-1">Life Path</p>
                                    <p className="text-4xl font-bold text-white">{profile.lifePath}</p>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-xl border border-blue-500/30 text-center">
                                    <p className="text-xs text-blue-300 uppercase tracking-widest mb-1">Archetype</p>
                                    <p className="text-xl font-bold text-white">{profile.zodiac}</p>
                                    <p className="text-xs text-white/50">{profile.chineseZodiac}</p>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-xl border border-green-500/30 text-center">
                                    <p className="text-xs text-green-300 uppercase tracking-widest mb-1">Style</p>
                                    <p className="text-xl font-bold text-white">{profile.learningStyle}</p>
                                </div>
                            </div>

                            <div className="bg-black/40 p-6 rounded-xl border border-white/10 text-center">
                                <h3 className="text-xl font-bold text-white mb-4">Ready to Generate Plan</h3>
                                <p className="text-white/70 mb-6 max-w-lg mx-auto">
                                    Our engine has analyzed your profile. Select a topic to generate your custom lesson plan using the <span className="text-purple-400 font-mono">Lesson Logic Matrix™</span>.
                                </p>

                                <div className="max-w-sm mx-auto mb-6">
                                    <label className="block text-sm text-left text-white/60 mb-1">Target Subject</label>
                                    <select 
                                        value={formData.topic} 
                                        onChange={e => setFormData({...formData, topic: e.target.value})}
                                        className="w-full bg-gray-800 border border-gray-600 text-white p-3 rounded focus:border-purple-500 outline-none"
                                    >
                                        <option>Doppler Physics</option>
                                        <option>Transducers</option>
                                        <option>Artifacts</option>
                                        <option>Hemodynamics</option>
                                        <option>Safety & Bioeffects</option>
                                        <option>Resolution (Axial/Lateral)</option>
                                    </select>
                                </div>

                                <ControlButton onClick={generateLesson} disabled={isLoading}>
                                    {isLoading ? 'Generating Matrix...' : 'Generate AI Lesson Plan'}
                                </ControlButton>
                            </div>
                             <button onClick={() => setStep(1)} className="block mx-auto mt-4 text-white/40 hover:text-white text-sm">Back</button>
                        </motion.div>
                    )}

                    {/* STEP 3: RESULT */}
                    {step === 3 && lesson && (
                        <motion.div 
                            key="step3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                        {lesson.title}
                                    </h2>
                                    <p className="text-white/60 mt-1">{lesson.format} • {lesson.teachingStyle}</p>
                                </div>
                                <button onClick={() => setStep(2)} className="text-sm bg-white/10 px-3 py-1 rounded text-white/70 hover:bg-white/20">
                                    New Topic
                                </button>
                            </div>

                            <div className="mb-8 bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-r-lg">
                                <p className="text-sm text-purple-200 italic">
                                    <span className="font-bold">Profile Insight:</span> {lesson.numerologyInsight}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {lesson.steps.map((step, idx) => (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-gray-800 p-5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-lg text-white">{step.title}</h4>
                                            <span className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-gray-400">{step.duration}</span>
                                        </div>
                                        <p className="text-gray-300 mb-3">{step.activity}</p>
                                        <p className="text-xs text-white/40 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                            personalized logic: {step.reasoning}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <div className="mt-8 text-center">
                                <p className="text-white/30 text-xs">
                                    Plan generated by EchoMasters AI Engine based on Life Path {profile?.lifePath} and {profile?.learningStyle} methodology.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DemoSection>
    );
};

export default PersonalizedStudyTool;