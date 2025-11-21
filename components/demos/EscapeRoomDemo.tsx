
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

const TissueAnalysisVisual: React.FC = () => (
  <div className="w-full h-40 sm:h-48 bg-black/60 rounded-lg border border-gray-700 p-2 sm:p-4 flex items-end justify-around gap-2 sm:gap-4 relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10"></div>
    {/* Grid Lines */}
    <div className="absolute w-full h-full flex flex-col justify-between pointer-events-none opacity-30">
        <div className="w-full h-px bg-green-500/50"></div>
        <div className="w-full h-px bg-green-500/50"></div>
        <div className="w-full h-px bg-green-500/50"></div>
        <div className="w-full h-px bg-green-500/50"></div>
    </div>
    
    {/* Bars */}
    {[
        { label: 'Air', height: '10%', color: 'bg-blue-500' },
        { label: 'Fat', height: '35%', color: 'bg-blue-400' },
        { label: 'Water', height: '36%', color: 'bg-blue-300' },
        { label: 'Musc', height: '40%', color: 'bg-blue-600' },
    ].map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-1 sm:gap-2 w-1/6 h-full justify-end group">
            <div className={`w-full rounded-t-sm ${item.color} bg-opacity-80 transition-all duration-500 group-hover:bg-opacity-100`} style={{ height: item.height }}></div>
            <span className="text-[10px] sm:text-xs text-white/70 font-mono">{item.label}</span>
        </div>
    ))}

    {/* Error Bar */}
    <div className="flex flex-col items-center gap-1 sm:gap-2 w-1/6 h-full justify-end">
        <div className="w-full h-[95%] bg-red-500/20 border-2 border-dashed border-red-500 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-red-500 font-bold font-mono text-xs sm:text-base animate-pulse">ERR</span>
            </div>
        </div>
        <span className="text-[10px] sm:text-xs text-red-400 font-bold font-mono">BONE</span>
    </div>
  </div>
);

const PulseOscilloscope: React.FC<{ dutyFactor: number }> = ({ dutyFactor }) => {
    // Calculate path for square wave
    // 2 cycles shown. Width 100% = 200 units.
    // Period = 100 units. 
    // On Width = dutyFactor (0-100).
    
    const hHigh = 10;
    const hLow = 50;
    const cycleWidth = 100;
    const onW = (dutyFactor / 100) * cycleWidth;
    
    let path = "";
    if (dutyFactor === 100) {
        path = `M 0 ${hHigh} L 200 ${hHigh}`;
    } else if (dutyFactor === 0) {
        path = `M 0 ${hLow} L 200 ${hLow}`;
    } else {
        // Cycle 1
        path += `M 0 ${hHigh} L ${onW} ${hHigh} L ${onW} ${hLow} L ${cycleWidth} ${hLow}`;
        // Cycle 2
        path += ` L ${cycleWidth} ${hHigh} L ${cycleWidth + onW} ${hHigh} L ${cycleWidth + onW} ${hLow} L 200 ${hLow}`;
    }

    return (
        <div className="w-full h-32 bg-black rounded-lg border-2 border-gray-700 relative overflow-hidden shadow-[0_0_15px_rgba(74,222,128,0.2)]">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle, #4ade80 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
            <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
                <path d={path} stroke="#4ade80" strokeWidth="2" fill="none" className="drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]" />
            </svg>
            <div className="absolute top-2 right-3 text-green-500 font-mono text-xs tracking-widest">OSCILLOSCOPE // LIVE</div>
            <div className="absolute bottom-2 left-3 text-green-500 font-mono text-xs">DF: {dutyFactor}%</div>
        </div>
    );
};

const EscapeRoomDemo: React.FC = () => {
    const [level, setLevel] = useState(1);
    const [isSolved, setIsSolved] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    // Level 1 State
    const [input1, setInput1] = useState('');
    
    // Level 2 State
    const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null);

    // Level 3 State
    const [sliderValue, setSliderValue] = useState(50);


    const handleLevel1Submit = () => {
        if (input1 === '4080') {
            setFeedback("Access Granted. Door 1 Unlocked.");
            setTimeout(() => { setFeedback(null); setLevel(2); }, 1500);
        } else {
            setFeedback("Access Denied. Incorrect Propagation Speed.");
        }
    };

    const handleLevel2Submit = () => {
        if (selectedArtifact === 'shadowing') {
            setFeedback("Visual Analysis Correct. Door 2 Unlocked.");
            setTimeout(() => { setFeedback(null); setLevel(3); }, 1500);
        } else {
            setFeedback("Incorrect Analysis. Try Again.");
        }
    };

    const handleLevel3Submit = () => {
        // Target is 100% Duty Factor (CW)
        if (sliderValue === 100) {
            setIsSolved(true);
        } else {
            setFeedback("System Optimization Failed. Duty Factor Incorrect for Continuous Wave.");
        }
    };

    if (isSolved) {
        return (
            <DemoSection title="Mission Accomplished" description="You have successfully escaped the lab!">
                <div className="text-center p-8 sm:p-12 bg-green-900/30 border border-green-500 rounded-xl animate-fade-in">
                    <div className="text-6xl mb-6 animate-bounce">🔓</div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-green-400 mb-4">ESCAPE SUCCESSFUL!</h2>
                    <p className="text-white/80 text-base sm:text-lg">You demonstrated mastery of physics principles to unlock the facility.</p>
                    <div className="mt-8">
                         <button onClick={() => window.location.reload()} className="bg-white/10 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-all font-bold">Play Again</button>
                    </div>
                </div>
            </DemoSection>
        );
    }

    return (
        <DemoSection title={`The Phantom Lab Escape - Level ${level}`} description="Solve the physics puzzles to unlock the doors and escape.">
            <div className="max-w-3xl mx-auto bg-gray-900 p-4 sm:p-8 rounded-xl border border-yellow-400/30 shadow-2xl relative overflow-hidden min-h-[400px] sm:min-h-[500px]">
                <AnimatePresence mode="wait">
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`absolute top-0 left-0 w-full p-4 text-center font-bold z-50 ${feedback.includes('Access Granted') || feedback.includes('Correct') ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}
                        >
                            {feedback}
                        </motion.div>
                    )}

                    {level === 1 && (
                        <motion.div key="level1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold flex-shrink-0">1</div>
                                <h3 className="text-lg sm:text-xl font-bold text-yellow-400">Door 1: The Speed Trap</h3>
                            </div>
                            <p className="mb-6 text-white/80 text-sm sm:text-base">
                                The security system has analyzed local tissue propagation speeds. A critical data point for <span className="text-red-400 font-bold">BONE</span> is corrupted. Enter the correct speed to proceed.
                            </p>
                            
                            <div className="mb-8">
                                <TissueAnalysisVisual />
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <input 
                                    type="tel" 
                                    maxLength={4}
                                    value={input1}
                                    onChange={(e) => setInput1(e.target.value)}
                                    placeholder="####" 
                                    className="bg-black text-white text-center text-3xl tracking-widest p-4 rounded border-2 border-gray-600 focus:border-yellow-400 outline-none w-full max-w-[200px] font-mono shadow-[0_0_15px_rgba(250,204,21,0.2)]"
                                />
                                <div className="text-xs text-white/50">ENTER SPEED (m/s)</div>
                                <ControlButton onClick={handleLevel1Submit}>Submit Code</ControlButton>
                            </div>
                        </motion.div>
                    )}

                    {level === 2 && (
                        <motion.div key="level2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold flex-shrink-0">2</div>
                                <h3 className="text-lg sm:text-xl font-bold text-yellow-400">Door 2: The Visual Cipher</h3>
                            </div>
                            <p className="mb-6 text-white/80 text-sm sm:text-base">
                                The biometric scanner is glitching. It's displaying a common ultrasound artifact. Identify it to bypass the lock.
                            </p>
                            <div className="flex justify-center mb-8">
                                <div className="w-56 h-56 sm:w-72 sm:h-72 bg-gray-800 rounded-lg relative overflow-hidden border-4 border-gray-700 shadow-2xl">
                                    <div className="absolute top-2 left-2 text-xs text-green-500 font-mono">SCAN_MODE: B-MODE</div>
                                    {/* Shadowing Artifact Simulation */}
                                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-white rounded-full shadow-lg z-10 border border-gray-300"></div>
                                    {/* The Shadow */}
                                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-24 h-[150%] bg-gradient-to-b from-black via-black/90 to-black/50 blur-[2px]"></div>
                                    {/* Scan Lines Overlay */}
                                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                                {['Enhancement', 'Reverberation', 'Shadowing', 'Mirror Image'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setSelectedArtifact(opt.toLowerCase().split(' ')[0])}
                                        className={`p-3 sm:p-4 rounded-lg border font-semibold transition-all text-sm sm:text-base ${selectedArtifact === opt.toLowerCase().split(' ')[0] ? 'bg-yellow-500 text-black border-yellow-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                            <div className="text-center">
                                <ControlButton onClick={handleLevel2Submit}>Verify Identification</ControlButton>
                            </div>
                        </motion.div>
                    )}

                    {level === 3 && (
                        <motion.div key="level3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                             <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold flex-shrink-0">3</div>
                                <h3 className="text-lg sm:text-xl font-bold text-yellow-400">Door 3: The Optimization Override</h3>
                            </div>
                            <p className="mb-6 text-white/80 text-sm sm:text-base">
                                The final airlock is controlled by a waveform generator. The protocol demands <strong className="text-green-400">Continuous Wave (CW)</strong> operation.
                                Adjust the Duty Factor until the system is optimized.
                            </p>
                            
                            <div className="mb-8">
                                <PulseOscilloscope dutyFactor={sliderValue} />
                            </div>

                            <div className="mb-8 bg-gray-800 p-4 rounded-lg">
                                <div className="flex justify-between text-xs text-white/50 mb-2 font-mono">
                                    <span>PULSED (0.1%)</span>
                                    <span>CONTINUOUS (100%)</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0.1" 
                                    max="100"
                                    step="0.1"
                                    value={sliderValue} 
                                    onChange={(e) => setSliderValue(Number(e.target.value))}
                                    className="w-full h-6 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400 touch-none"
                                />
                                <div className="text-center mt-4">
                                     <span className="font-mono text-4xl text-green-400 font-bold">{sliderValue.toFixed(1)}%</span>
                                     <p className="text-xs text-white/50 mt-1">DUTY FACTOR</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <ControlButton onClick={handleLevel3Submit}>Engage Override</ControlButton>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DemoSection>
    );
};

export default EscapeRoomDemo;
