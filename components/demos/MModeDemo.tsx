
import React, { useState } from 'react';
import DemoSection from './DemoSection';

const MModeDemo: React.FC = () => {
    const [linePosition, setLinePosition] = useState(50); // %
    const [heartRate, setHeartRate] = useState(70); // bpm

    const animationDuration = 60 / heartRate;

    return (
        <div className="space-y-8">
            <DemoSection
                title="M-Mode: Motion Over Time"
                description="Position the M-Mode cursor over the simulated heart structure to generate a tracing. M-Mode uses a single line of sight to provide extremely high temporal resolution, ideal for measuring rapid movements like heart valve leaflets."
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* B-Mode View */}
                    <div className="h-96 bg-gray-800 rounded-xl relative p-4 overflow-hidden">
                        {/* Heart structure */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32">
                           <div className="absolute top-0 left-0 w-full h-4 bg-red-400 rounded" style={{animation: `wall-motion ${animationDuration}s ease-in-out infinite`}}/>
                           <div className="absolute bottom-0 left-0 w-full h-4 bg-red-400 rounded" style={{animation: `wall-motion ${animationDuration}s ease-in-out infinite alternate`}}/>
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-white" style={{animation: `leaflet-motion ${animationDuration}s ease-in-out infinite`, transform: 'translateY(-5px)'}}/>
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-white" style={{animation: `leaflet-motion ${animationDuration}s ease-in-out infinite alternate`, transform: 'translateY(5px)'}}/>
                        </div>
                        {/* M-Mode Line */}
                        <div className="absolute top-0 h-full w-px border-l border-dashed border-yellow-400" style={{ left: `${linePosition}%` }} />
                    </div>

                    {/* M-Mode Display */}
                    <div className="h-96 bg-black rounded-xl p-2 relative overflow-hidden">
                       <div className="w-full h-full" style={{
                           background: `repeating-linear-gradient(90deg, #333 0 1px, transparent 1px 20%)`
                       }}>
                           {/* Tracing for wall */}
                           <svg width="100%" height="100%" className="absolute inset-0">
                                <path d="M0,50 C 50,30 100,30 150,50 S 250,70 300,50" stroke="#fef08a" strokeWidth="2" fill="none" style={{ animation: `trace-scroll ${animationDuration*2}s linear infinite`}}/>
                                 <path d="M0,250 C 50,270 100,270 150,250 S 250,230 300,250" stroke="#fef08a" strokeWidth="2" fill="none" style={{ animation: `trace-scroll ${animationDuration*2}s linear infinite`}}/>
                                 {/* Tracing for leaflets (only if line is over them) */}
                                 {linePosition > 35 && linePosition < 65 &&
                                    <>
                                        <path d="M0,150 C 50,120 100,180 150,150 S 250,120 300,180" stroke="#fff" strokeWidth="1.5" fill="none" style={{ animation: `trace-scroll ${animationDuration*2}s linear infinite`}}/>
                                        <path d="M0,155 C 50,185 100,125 150,155 S 250,185 300,125" stroke="#fff" strokeWidth="1.5" fill="none" style={{ animation: `trace-scroll ${animationDuration*2}s linear infinite`}}/>
                                    </>
                                 }
                           </svg>
                       </div>
                    </div>
                </div>
                 <div className="mt-4 space-y-4">
                    <div>
                        <label className="block text-white/80 mb-2">M-Mode Cursor Position</label>
                        <input type="range" min="0" max="100" value={linePosition} onChange={e => setLinePosition(Number(e.target.value))} className="w-full accent-yellow-400" />
                    </div>
                     <div>
                        <label className="block text-white/80 mb-2">Heart Rate (bpm)</label>
                        <input type="range" min="40" max="120" value={heartRate} onChange={e => setHeartRate(Number(e.target.value))} className="w-full accent-red-400" />
                        <p className="text-center font-mono">{heartRate} bpm</p>
                    </div>
                </div>

            </DemoSection>
            <style>{`
                @keyframes wall-motion { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.8); } }
                @keyframes leaflet-motion { 0%, 100% { transform: translateY(-5px) scaleX(1); } 50% { transform: translateY(5px) scaleX(0.2); } }
                @keyframes trace-scroll { from { transform: translateX(0%); } to { transform: translateX(-50%); } }
            `}</style>
        </div>
    );
};

export default MModeDemo;
