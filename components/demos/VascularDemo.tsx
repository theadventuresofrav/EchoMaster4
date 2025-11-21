
import React, { useState, useMemo } from 'react';
import DemoSection from './DemoSection';

const VascularDemo: React.FC = () => {
    const [stenosis, setStenosis] = useState(60); // % diameter reduction

    const { psv, edv, grade, spectralBroadeningOpacity, plaquePath } = useMemo(() => {
        let psv_val = 80 + stenosis * 3.5;
        let edv_val = 25 + stenosis * 1.8;
        let grade_text = "Normal (<50%)";

        if (stenosis >= 70) {
            psv_val = 230 + (stenosis - 70) * 8;
            edv_val = 100 + (stenosis - 70) * 4;
            grade_text = "Severe Stenosis (≥70%)";
        } else if (stenosis >= 50) {
            psv_val = 125 + (stenosis - 50) * 5.25;
            edv_val = 40 + (stenosis - 50) * 3;
            grade_text = "Moderate Stenosis (50-69%)";
        }

        // Spectral broadening increases significantly after 50% stenosis
        const broadening = stenosis > 50 ? Math.min(1, (stenosis - 50) / 40) * 0.7 : 0;

        // Plaque path calculation
        const vesselHeight = 70; // (110 - 40)
        const plaqueBulge = (stenosis / 100) * (vesselHeight / 2);
        const pPath = `M 100 41 Q 150 ${41 + plaqueBulge * 2}, 200 41 L 200 40 L 100 40 Z`;

        return { 
            psv: psv_val, 
            edv: edv_val, 
            grade: grade_text, 
            spectralBroadeningOpacity: broadening,
            plaquePath: pPath 
        };
    }, [stenosis]);

    const waveformPath = `M 0 80 L 50 80 L 75 ${80 - psv/10} L 125 ${80 - edv/10} L 150 80 L 200 80 L 225 ${80 - psv/10} L 275 ${80 - edv/10} L 300 80`;

    return (
        <DemoSection
            title="Carotid Stenosis Measurement Lab"
            description="Grade carotid stenosis using both B-mode measurements (% diameter reduction) and Doppler velocities (PSV & EDV), according to standardized criteria."
        >
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/2 h-80 bg-black rounded-xl relative overflow-hidden p-4">
                    {/* B-mode background texture */}
                    <div className="absolute inset-0 bg-gray-800 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '5px 5px' }}></div>
                    <svg width="100%" height="100%" viewBox="0 0 300 150">
                        {/* Vessel Walls */}
                        <path d="M 0 40 C 50 38, 250 42, 300 40" stroke="#aaa" strokeWidth="2" fill="none"/>
                        <path d="M 0 110 C 50 112, 250 108, 300 110" stroke="#aaa" strokeWidth="2" fill="none" />

                        {/* Lumen */}
                        <rect x="0" y="41" width="300" height="68" fill="#111" />

                        {/* Plaque */}
                        <path d={plaquePath} fill="#facc15" stroke="#eab308" strokeWidth="0.5" style={{ transition: 'd 0.2s ease-in-out' }} />

                        {/* Sample Gate */}
                        <g transform="translate(150, 0)">
                             <line x1="0" y1={40 + (stenosis/100 * 35) + 5} x2="0" y2={110-5} stroke="#67e8f9" strokeWidth="1.5" strokeDasharray="3" />
                            <line x1="-10" y1={40 + (stenosis/100 * 35) + 5} x2="10" y2={40 + (stenosis/100 * 35) + 5} stroke="#67e8f9" strokeWidth="2" />
                            <line x1="-10" y1={110-5} x2="10" y2={110-5} stroke="#67e8f9" strokeWidth="2" />
                        </g>
                    </svg>
                    <div className="absolute top-2 left-2 text-xs font-bold text-white/70 bg-black/50 px-2 py-1 rounded">B-Mode</div>
                </div>
                <div className="w-full lg:w-1/2 h-80 bg-black/80 rounded-xl p-2 relative">
                    <svg width="100%" height="100%" viewBox="0 0 300 100">
                        <defs>
                            <linearGradient id="spectral-fill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#fef08a" />
                                <stop offset="100%" stopColor="#facc15" stopOpacity="0.3" />
                            </linearGradient>
                        </defs>
                        {/* Spectral Broadening Fill */}
                        <path d={waveformPath} fill="url(#spectral-fill)" style={{ transition: 'all 0.3s ease-in-out', fillOpacity: spectralBroadeningOpacity }} />
                        {/* Waveform Outline */}
                        <path d={waveformPath} stroke="#fef08a" strokeWidth="2" fill="none" style={{ transition: 'd 0.3s' }} />
                        {/* Baseline */}
                        <line x1="0" y1="80" x2="300" y2="80" stroke="#555" strokeWidth="1" strokeDasharray="2" />

                        {/* Annotations */}
                        <text x="75" y={78 - psv/10} fill="#fff" fontSize="8" textAnchor="middle" className="font-mono transition-all duration-300">PSV</text>
                        <text x="125" y={88 - edv/10} fill="#fff" fontSize="8" textAnchor="middle" className="font-mono transition-all duration-300">EDV</text>
                    </svg>
                     <div className="absolute top-2 left-2 text-xs font-bold text-white/70 bg-black/50 px-2 py-1 rounded">Spectral Doppler</div>
                </div>
            </div>
            <div className="mt-4">
                <label className="block text-white/80 mb-2">Adjust Plaque Buildup (% Diameter Reduction)</label>
                <input type="range" min="0" max="90" value={stenosis} onChange={e => setStenosis(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
            </div>
            <div className="bg-white/10 p-4 rounded-lg mt-4 text-center">
                <p className="text-sm text-white/70">Stenosis Grade (based on PSV & EDV):</p>
                <p className="text-xl font-bold text-yellow-400 mt-1">{grade}</p>
            </div>
        </DemoSection>
    );
};

export default VascularDemo;
