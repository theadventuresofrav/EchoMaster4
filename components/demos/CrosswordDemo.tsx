
import React, { useState } from 'react';
import DemoSection from './DemoSection';

const CLUES = [
    { id: 1, direction: 'Across', number: 1, text: 'Unit of frequency (5 letters)', answer: 'HERTZ' },
    { id: 4, direction: 'Across', number: 2, text: 'As Low As Reasonably Achievable (5 letters)', answer: 'ALARA' },
    { id: 2, direction: 'Across', number: 4, text: 'Resolution parallel to the sound beam (5 letters)', answer: 'AXIAL' },
    { id: 3, direction: 'Down', number: 3, text: 'Resolution perpendicular to the beam (7 letters)', answer: 'LATERAL' },
];

// Mapping for visual grid
// Grid 8 rows x 10 cols
// HERTZ: (2,1) Across
// ALARA: (0,3) Across
// LATERAL: (0,4) Down
// AXIAL: (5,4) Across
const GRID_MAPPING: {[key: number]: {row: number, col: number}} = {
    1: { row: 2, col: 1 }, // HERTZ
    4: { row: 0, col: 3 }, // ALARA
    2: { row: 5, col: 4 }, // AXIAL
    3: { row: 0, col: 4 }  // LATERAL
};

const CrosswordGrid: React.FC<{ answers: {[key: number]: string}, clues: typeof CLUES }> = ({ answers, clues }) => {
    const rows = 8;
    const cols = 10;
    const cellSize = 30;
    
    // Build grid data
    const grid: {char: string, number?: number, active?: boolean}[][] = Array(rows).fill(null).map(() => Array(cols).fill(null).map(() => ({char: '', active: false})));

    clues.forEach(clue => {
        const pos = GRID_MAPPING[clue.id];
        const currentAnswer = answers[clue.id] || '';
        
        if (clue.direction === 'Across') {
            for (let i = 0; i < clue.answer.length; i++) {
                grid[pos.row][pos.col + i].active = true;
                if (i === 0) grid[pos.row][pos.col + i].number = clue.number;
                // Only fill if user typed it
                if (currentAnswer[i]) grid[pos.row][pos.col + i].char = currentAnswer[i];
            }
        } else {
            for (let i = 0; i < clue.answer.length; i++) {
                grid[pos.row + i][pos.col].active = true;
                if (i === 0) grid[pos.row + i][pos.col].number = clue.number;
                if (currentAnswer[i]) grid[pos.row + i][pos.col].char = currentAnswer[i];
            }
        }
    });

    return (
        <div className="bg-black p-2 sm:p-4 rounded-lg border border-gray-700 flex justify-center overflow-x-auto w-full">
            <svg width={cols * cellSize} height={rows * cellSize} className="min-w-[300px]">
                {grid.map((row, rIndex) => (
                    row.map((cell, cIndex) => (
                        cell.active ? (
                            <g key={`${rIndex}-${cIndex}`}>
                                <rect 
                                    x={cIndex * cellSize} 
                                    y={rIndex * cellSize} 
                                    width={cellSize - 2} 
                                    height={cellSize - 2} 
                                    fill={cell.char ? "#374151" : "#1f2937"} 
                                    stroke={cell.char ? "#fbbf24" : "#4b5563"}
                                    rx="4"
                                />
                                {cell.number && (
                                    <text x={cIndex * cellSize + 3} y={rIndex * cellSize + 10} fontSize="8" fill="#fbbf24" fontWeight="bold">{cell.number}</text>
                                )}
                                {cell.char && (
                                    <text x={cIndex * cellSize + 15} y={rIndex * cellSize + 22} fontSize="16" fill="white" fontWeight="bold" textAnchor="middle">{cell.char}</text>
                                )}
                            </g>
                        ) : null
                    ))
                ))}
            </svg>
        </div>
    );
};

const CrosswordDemo: React.FC = () => {
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [feedback, setFeedback] = useState<{ [key: number]: boolean }>({});

    const handleChange = (id: number, val: string) => {
        setAnswers(prev => ({ ...prev, [id]: val.toUpperCase() }));
        setFeedback(prev => ({ ...prev, [id]: false }));
    };

    const checkAnswer = (id: number) => {
        const clue = CLUES.find(c => c.id === id);
        if (!clue) return;
        const isCorrect = answers[id] === clue.answer;
        setFeedback(prev => ({ ...prev, [id]: isCorrect }));
    };

    const allCorrect = CLUES.every(c => feedback[c.id]);

    return (
        <DemoSection title="Physics Crossword" description="Test your terminology. The grid updates as you solve the clues.">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="order-2 lg:order-1 flex-grow space-y-4 sm:space-y-6">
                    {CLUES.map(clue => (
                        <div key={clue.id} className="bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10 transition-colors hover:bg-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-yellow-400 text-[10px] sm:text-xs uppercase tracking-wider bg-yellow-400/10 px-2 py-1 rounded">{clue.number}. {clue.direction}</span>
                                {feedback[clue.id] && <span className="text-green-400 font-bold text-xs sm:text-sm">✓ Solved</span>}
                            </div>
                            <p className="text-white/90 mb-3 text-sm font-medium">{clue.text}</p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    maxLength={clue.answer.length}
                                    value={answers[clue.id] || ''}
                                    onChange={(e) => handleChange(clue.id, e.target.value)}
                                    placeholder={`${clue.answer.length} Letters`}
                                    className={`flex-grow bg-black/50 border ${feedback[clue.id] ? 'border-green-500 text-green-400' : 'border-white/30 text-white'} rounded px-3 py-2 font-mono tracking-widest uppercase outline-none focus:border-yellow-400 transition-all text-sm sm:text-base`}
                                    disabled={feedback[clue.id]}
                                />
                                <button 
                                    onClick={() => checkAnswer(clue.id)}
                                    className="bg-white/10 hover:bg-white/20 text-white px-3 sm:px-4 rounded font-semibold text-xs uppercase tracking-wider disabled:opacity-50 whitespace-nowrap"
                                    disabled={feedback[clue.id]}
                                >
                                    Check
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="order-1 lg:order-2 flex flex-col gap-6 w-full lg:w-auto flex-shrink-0 items-center">
                    <CrosswordGrid answers={answers} clues={CLUES} />
                    
                    <div className="w-full bg-gray-900 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-white/10 shadow-lg min-h-[150px] sm:min-h-[200px]">
                        {allCorrect ? (
                            <div className="animate-bounce">
                                <div className="text-6xl mb-4">🏆</div>
                                <p className="text-green-400 font-bold text-xl sm:text-2xl">Puzzle Complete!</p>
                                <p className="text-white/60 mt-2 text-sm">Physics Master Status: Unlocked</p>
                            </div>
                        ) : (
                            <div>
                                <div className="text-4xl mb-4 opacity-50">🧩</div>
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Crossword Status</h3>
                                <p className="text-white/60 text-xs sm:text-sm">Solve all clues to complete the grid.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

export default CrosswordDemo;
