
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

const TERMS = [
    { term: "Frequency", def: "Number of cycles per second" },
    { term: "Period", def: "Time it takes for one cycle to occur" },
    { term: "Wavelength", def: "Distance or length of one complete cycle" },
    { term: "Speed", def: "Rate at which sound travels through a medium" }, // Shortened for visual fit
    { term: "Power", def: "Rate of energy transfer (Watts)" },
    { term: "Intensity", def: "Concentration of energy in a sound beam" },
    { term: "Amplitude", def: "Difference between max value and average value" },
    { term: "Impedance", def: "Resistance to sound traveling in a medium" },
    { term: "Refraction", def: "Change in direction of wave propagation" },
    { term: "Reflection", def: "Sound bouncing back from a boundary" },
    { term: "Attenuation", def: "Weakening of sound as it propagates" },
    { term: "HVL", def: "Thickness of tissue that reduces intensity by 3 dB" }, // Shortened
    { term: "PZT", def: "Lead Zirconate Titanate" },
    { term: "Curie Point", def: "Temperature at which PZT is polarized" },
    { term: "Matching", def: "Component that reduces impedance mismatch" }, // Shortened
    { term: "Backing", def: "Component that reduces ringing (damping)" }, // Shortened
    { term: "Bandwidth", def: "Range of frequencies in a pulse" },
    { term: "Q Factor", def: "Main frequency divided by bandwidth" }, // Shortened
    { term: "Fraunhofer", def: "The far zone" },
    { term: "Fresnel", def: "The near zone" },
    { term: "Axial Res", def: "Ability to distinguish structures parallel to beam" },
    { term: "Lateral Res", def: "Ability to distinguish structures perpendicular to beam" },
    { term: "A-Mode", def: "Amplitude Mode" },
    { term: "B-Mode", def: "Brightness Mode" },
    { term: "M-Mode", def: "Motion Mode" },
];

const BingoDemo: React.FC = () => {
    const [board, setBoard] = useState<string[]>([]);
    const [marked, setMarked] = useState<boolean[]>([]);
    const [currentDef, setCurrentDef] = useState<string | null>(null);
    const [gameActive, setGameActive] = useState(false);
    const [hasBingo, setHasBingo] = useState(false);
    const [lastDrawnTerm, setLastDrawnTerm] = useState<string | null>(null);

    // Generate board on mount
    useEffect(() => {
        resetGame();
    }, []);

    const resetGame = () => {
        // Shuffle terms and pick 25
        const shuffled = [...TERMS].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 25);
        // Center is free space
        selected[12] = { term: "FREE", def: "Free Space" };
        
        setBoard(selected.map(t => t.term));
        const initialMarks = Array(25).fill(false);
        initialMarks[12] = true; // Mark free space
        setMarked(initialMarks);
        setGameActive(true);
        setHasBingo(false);
        setCurrentDef("Press 'Draw Ball' to start!");
        setLastDrawnTerm(null);
    };

    const drawCard = () => {
        // Find un-marked terms that aren't FREE
        const availableIndices = board.map((t, i) => ({t, i})).filter(x => !marked[x.i] && x.t !== "FREE");
        
        if (availableIndices.length === 0) {
            setCurrentDef("All items marked!");
            return;
        }
        
        // Simulate drawing animation
        setLastDrawnTerm("...");
        setTimeout(() => {
            const randomItem = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            const fullTermObj = TERMS.find(t => t.term === randomItem.t);
            setCurrentDef(fullTermObj ? fullTermObj.def : "Error");
            setLastDrawnTerm(randomItem.t);
        }, 500);
    };

    const handleCellClick = (index: number) => {
        if (!gameActive || hasBingo) return;
        
        // Toggle mark
        const newMarked = [...marked];
        newMarked[index] = !newMarked[index];
        setMarked(newMarked);

        checkForBingo(newMarked);
    };

    const checkForBingo = (marks: boolean[]) => {
        const wins = [
            [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24], // Rows
            [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24], // Cols
            [0,6,12,18,24], [4,8,12,16,20] // Diagonals
        ];

        for (let combo of wins) {
            if (combo.every(i => marks[i])) {
                setHasBingo(true);
                setCurrentDef("BINGO! You Win!");
                setLastDrawnTerm("WIN!");
                return;
            }
        }
    };

    return (
        <DemoSection title="Physics Bingo" description="Match the definition to the term. Get 5 in a row to win!">
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start justify-center">
                
                {/* Draw Section */}
                <div className="w-full lg:w-1/3 flex flex-col items-center gap-4 sm:gap-6">
                    <div className="relative w-32 h-32 sm:w-48 sm:h-48 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={lastDrawnTerm || 'start'}
                                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full shadow-2xl border-4 border-yellow-200 flex items-center justify-center"
                            >
                                <div className="bg-white w-20 h-20 sm:w-32 sm:h-32 rounded-full flex items-center justify-center shadow-inner">
                                    <span className="text-sm sm:text-2xl font-bold text-black text-center px-2 leading-tight break-words">
                                        {lastDrawnTerm || "?"}
                                    </span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="w-full bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-white/10 min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] sm:text-xs font-bold text-yellow-500 uppercase tracking-widest mb-2">DEFINITION</p>
                        <p className="text-sm sm:text-lg text-white font-medium">{currentDef}</p>
                    </div>

                    <div className="flex gap-2 sm:gap-4 w-full">
                        <ControlButton onClick={drawCard} disabled={hasBingo} className="flex-grow text-sm sm:text-base">Draw Ball</ControlButton>
                        <ControlButton onClick={resetGame} secondary className="text-sm sm:text-base">Reset</ControlButton>
                    </div>
                </div>

                {/* Board Section */}
                <div className="w-full lg:w-2/3 max-w-lg aspect-square bg-gray-900 p-2 sm:p-4 rounded-xl border-4 border-gray-700 shadow-2xl mx-auto">
                    <div className="grid grid-cols-5 h-full gap-1 sm:gap-2">
                         {/* Headers */}
                         {['B','I','N','G','O'].map(letter => (
                             <div key={letter} className="h-6 sm:h-8 flex items-center justify-center font-black text-lg sm:text-2xl text-gray-700 select-none">{letter}</div>
                         ))}
                         
                         {/* Cells */}
                        {board.map((term, i) => {
                            const isFree = term === 'FREE';
                            const isMarked = marked[i];
                            return (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 0.95 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleCellClick(i)}
                                    className={`relative rounded-md sm:rounded-lg flex items-center justify-center text-[8px] sm:text-xs p-0.5 sm:p-1 font-bold transition-colors duration-300 border sm:border-2 overflow-hidden shadow-sm sm:shadow-md
                                        ${isMarked 
                                            ? 'bg-green-500 border-green-400 text-black' 
                                            : 'bg-gray-800 border-gray-600 text-white/80 hover:border-white/50'
                                        } 
                                        ${isFree ? 'bg-yellow-500 border-yellow-400 text-black' : ''}
                                    `}
                                >
                                    <span className="relative z-10 text-center break-words w-full leading-tight">{term}</span>
                                    {isMarked && !isFree && (
                                        <motion.div 
                                            initial={{ scale: 0 }} 
                                            animate={{ scale: 1 }} 
                                            className="absolute inset-0 bg-green-500 rounded-lg z-0" 
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

export default BingoDemo;
