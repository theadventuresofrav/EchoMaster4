
import React, { useState } from 'react';
import DemoSection from './DemoSection';

const ContrastAgentsDemo: React.FC = () => {
    const [mi, setMi] = useState(0.1); // Mechanical Index

    const getBubbleState = () => {
        if (mi < 0.2) return { text: "Linear Oscillation", color: "bg-green-500" };
        if (mi < 0.7) return { text: "Non-linear Oscillation (Harmonics)", color: "bg-yellow-500" };
        return { text: "Bubble Disruption", color: "bg-red-500" };
    };
    
    const bubbleState = getBubbleState();

    return (
        <div className="space-y-8">
            <DemoSection
                title="Microbubble Contrast Agent Behavior"
                description="Adjust the Mechanical Index (MI) to observe how it affects the behavior of microbubble contrast agents. This principle is fundamental to contrast-enhanced ultrasound (CEUS)."
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <div className="space-y-4 flex flex-col justify-center">
                        <div>
                            <label className="block text-white/80 mb-2">Mechanical Index (MI)</label>
                            <input
                                type="range"
                                min="0.05"
                                max="1.2"
                                step="0.05"
                                value={mi}
                                onChange={(e) => setMi(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                            />
                            <div className="text-center mt-2 font-mono text-lg text-yellow-400">{mi.toFixed(2)}</div>
                        </div>
                        <div className="bg-white/10 p-4 rounded-lg text-center">
                            <h3 className="text-lg font-bold">Bubble Behavior</h3>
                            <p className={`text-xl font-semibold mt-1 text-${bubbleState.color.replace('bg-','').replace('-500','')}-400`}>{bubbleState.text}</p>
                        </div>
                    </div>
                    <div className="h-80 bg-gray-800/50 rounded-xl flex items-center justify-center relative">
                        <div 
                            className={`w-24 h-24 rounded-full border-4 border-white transition-all duration-300 flex items-center justify-center ${bubbleState.color}`}
                            style={{animation: mi < 0.7 ? `bubble-resonate ${2 - mi}s ease-in-out infinite` : 'none'}}
                        >
                           {mi >= 0.7 && <div className="text-5xl animate-ping">💥</div>}
                        </div>
                         <p className="absolute bottom-2 text-xs text-white/50">Microbubble</p>
                    </div>
                </div>

            </DemoSection>
             <style>{`
                @keyframes bubble-resonate {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(${1 + mi * 0.5}); }
                }
            `}</style>
        </div>
    );
};

export default ContrastAgentsDemo;
