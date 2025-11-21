
import React, { useState, useMemo } from 'react';
import DemoSection from './DemoSection';

const PulsedWaveDemo: React.FC = () => {
    const [depth, setDepth] = useState(10); // cm
    const [pulseDuration, setPulseDuration] = useState(1.5); // µs

    // Constants
    const SPEED_OF_SOUND = 1.54; // mm/µs

    // Calculations
    const prp = useMemo(() => depth * 13, [depth]); // µs (13 microsecond rule)
    const prf = useMemo(() => 1000 / prp, [prp]); // kHz
    const dutyFactor = useMemo(() => (pulseDuration / prp) * 100, [pulseDuration, prp]); // %
    const spl = useMemo(() => pulseDuration * SPEED_OF_SOUND, [pulseDuration]); // mm

    // Visualization: Fixed time window of 300µs to show the scale
    const TIME_WINDOW = 300;
    const pulsesToShow = Math.ceil(TIME_WINDOW / prp) + 1;

    return (
        <div className="space-y-8">
            <DemoSection
                title="Key Timing Parameters: PRF, PRP, and Duty Factor"
                description="Pulsed ultrasound systems must 'talk' (transmit) and 'listen' (receive). Adjust the Imaging Depth and Pulse Duration to visualize how they dictate the Pulse Repetition Frequency (PRF), Pulse Repetition Period (PRP), and Duty Factor."
            >
                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-yellow-400 font-bold text-lg">1. Imaging Depth</h3>
                            <span className="text-blue-400 font-mono font-bold text-2xl">{depth} cm</span>
                        </div>
                        <p className="text-sm text-white/70 mb-6 h-10">
                            Deeper imaging requires more listening time for echoes to return. This <span className="text-white font-bold">increases PRP</span> and <span className="text-white font-bold">decreases PRF</span>.
                        </p>
                        <input
                            type="range"
                            min="2"
                            max="20"
                            step="1"
                            value={depth}
                            onChange={(e) => setDepth(Number(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                        />
                        <div className="flex justify-between mt-2 text-xs text-white/40 font-mono uppercase tracking-wider">
                            <span>Shallow (2cm)</span>
                            <span>Deep (20cm)</span>
                        </div>
                    </div>

                    <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-yellow-400 font-bold text-lg">2. Pulse Duration</h3>
                             <span className="text-orange-400 font-mono font-bold text-2xl">{pulseDuration.toFixed(1)} µs</span>
                        </div>
                        <p className="text-sm text-white/70 mb-6 h-10">
                            The time the pulse is actually "on" (Talking time). Determined by the transducer (# cycles × period). Affects <span className="text-white font-bold">SPL</span> and <span className="text-white font-bold">Duty Factor</span>.
                        </p>
                         <input
                            type="range"
                            min="0.5"
                            max="5.0"
                            step="0.1"
                            value={pulseDuration}
                            onChange={(e) => setPulseDuration(Number(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400 transition-all"
                        />
                        <div className="flex justify-between mt-2 text-xs text-white/40 font-mono uppercase tracking-wider">
                            <span>Short (0.5µs)</span>
                            <span>Long (5.0µs)</span>
                        </div>
                    </div>
                </div>

                {/* Visualizations Container */}
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Pulse Train Timeline */}
                    <div className="w-full lg:w-2/3 bg-black rounded-xl border border-gray-600 p-4 relative shadow-inner flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                             <h4 className="text-sm font-bold text-white/90 uppercase tracking-widest">Pulse Train (Time Domain)</h4>
                             <div className="text-xs font-mono text-gray-500">Window: {TIME_WINDOW}µs</div>
                        </div>
                        
                        <div className="h-32 flex items-center relative overflow-hidden">
                            {/* Baseline */}
                            <div className="w-full h-px bg-gray-700 absolute top-1/2"></div>
                            
                            {/* SVG Visualization */}
                            <svg width="100%" height="100%" viewBox={`0 0 ${TIME_WINDOW} 100`} preserveAspectRatio="none" className="overflow-visible">
                                <defs>
                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24" />
                                    </marker>
                                    <marker id="arrowhead-w" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="white" />
                                    </marker>
                                </defs>

                                {Array.from({ length: pulsesToShow }).map((_, i) => {
                                    const start = i * prp;
                                    if (start > TIME_WINDOW) return null;
                                    return (
                                        <g key={i}>
                                            {/* Pulse Rect */}
                                            <rect 
                                                x={start} 
                                                y={35} 
                                                width={pulseDuration} 
                                                height={30} 
                                                fill="#f97316" 
                                                rx="1"
                                                className="animate-pulse"
                                            />
                                            
                                            {/* Annotations (only for first pulse pair to avoid clutter) */}
                                            {i === 0 && (
                                                <>
                                                    {/* PD Arrow */}
                                                    <line x1={start} y1="25" x2={start + pulseDuration} y2="25" stroke="white" strokeWidth="1" markerEnd="url(#arrowhead-w)" />
                                                    <text x={start + pulseDuration/2} y="20" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">PD</text>
                                                    
                                                    {/* PRP Bracket */}
                                                    <line x1={start} y1="80" x2={start + prp - 2} y2="80" stroke="#fbbf24" strokeWidth="1" markerEnd="url(#arrowhead)" />
                                                    <line x1={start} y1="70" x2={start} y2="85" stroke="#fbbf24" strokeWidth="1" />
                                                    <line x1={start + prp} y1="70" x2={start + prp} y2="85" stroke="#fbbf24" strokeWidth="1" />
                                                    <text x={start + prp/2} y="95" fill="#fbbf24" fontSize="10" textAnchor="middle" fontWeight="bold" letterSpacing="1px">PRP ({prp}µs)</text>
                                                    
                                                    {/* Listening Time Label */}
                                                    {prp > 30 && (
                                                         <text x={start + pulseDuration + (prp - pulseDuration)/2} y="60" fill="#60a5fa" fontSize="8" textAnchor="middle" fontStyle="italic">Listening Time</text>
                                                    )}
                                                </>
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                        <div className="mt-2 text-center text-xs text-white/40 italic">
                            Pulses repeat every {prp} microseconds.
                        </div>
                    </div>

                    {/* Calculations & Metrics */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Calculated Values</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-sm font-medium text-white/80">PRP</span>
                                    <div className="text-right">
                                        <div className="font-mono text-yellow-400 font-bold">{prp.toFixed(0)} µs</div>
                                        <div className="text-[10px] text-white/30">Period</div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-sm font-medium text-white/80">PRF</span>
                                    <div className="text-right">
                                        <div className="font-mono text-yellow-400 font-bold">{prf.toFixed(2)} kHz</div>
                                        <div className="text-[10px] text-white/30">Frequency</div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pb-1">
                                    <span className="text-sm font-medium text-white/80">SPL</span>
                                    <div className="text-right">
                                        <div className="font-mono text-orange-400 font-bold">{spl.toFixed(2)} mm</div>
                                        <div className="text-[10px] text-white/30">Axial Res</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Duty Factor Visual */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl flex-grow flex flex-col items-center justify-center border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3">
                                <span className="text-[10px] text-white/30 font-mono uppercase">Duty Factor</span>
                            </div>
                            
                            <div className="relative w-32 h-32 mb-2">
                                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                    {/* Background Circle (Listening) */}
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#1e3a8a"
                                        strokeWidth="3"
                                    />
                                    {/* Foreground Circle (Talking) */}
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#f97316"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeDasharray={`${Math.max(dutyFactor, 0.5)}, 100`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-white">{dutyFactor.toFixed(2)}%</span>
                                    <span className="text-[8px] text-orange-400 uppercase tracking-wider font-bold">Talking</span>
                                </div>
                            </div>
                            <p className="text-xs text-center text-white/50 px-2">
                                Even with maximum pulse duration, the system listens { (100 - dutyFactor).toFixed(2) }% of the time!
                            </p>
                        </div>
                    </div>
                </div>
            </DemoSection>
        </div>
    );
};

export default PulsedWaveDemo;
