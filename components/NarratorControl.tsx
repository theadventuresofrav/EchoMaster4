
import React from 'react';
import { useNarrator } from '../hooks/useNarrator';

interface NarratorControlProps {
    text: string;
    label?: string;
    compact?: boolean;
}

const NarratorControl: React.FC<NarratorControlProps> = ({ text, label = "Narrate", compact = false }) => {
    const { isPlaying, isLoading, play, stop } = useNarrator();

    const handleClick = () => {
        if (isPlaying) {
            stop();
        } else {
            play(text);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`flex items-center gap-2 transition-all duration-300 rounded-full border ${
                isPlaying 
                ? 'bg-red-500/20 border-red-400 text-red-300 hover:bg-red-500/30' 
                : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-yellow-400 hover:border-yellow-400/50'
            } ${compact ? 'p-2' : 'px-4 py-2'}`}
            title={isPlaying ? "Stop Narration" : "Read Aloud"}
        >
            {isLoading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : isPlaying ? (
                <>
                    {/* Stop Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
                    </svg>
                    {!compact && <span className="text-xs font-bold uppercase">Stop</span>}
                    {/* Visualizer Bars */}
                     <div className="flex items-end gap-0.5 h-3">
                        <div className="w-0.5 bg-current animate-[pulse_0.6s_ease-in-out_infinite] h-full"></div>
                        <div className="w-0.5 bg-current animate-[pulse_0.8s_ease-in-out_infinite] h-2/3"></div>
                        <div className="w-0.5 bg-current animate-[pulse_0.5s_ease-in-out_infinite] h-full"></div>
                    </div>
                </>
            ) : (
                <>
                    {/* Speaker/Play Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                         <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                         <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                    </svg>
                    {!compact && <span className="text-xs font-bold uppercase">{label}</span>}
                </>
            )}
        </button>
    );
};

export default NarratorControl;
