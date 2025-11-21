
import React, { useState } from 'react';
import DemoSection from './DemoSection';

const SafetyDemo: React.FC = () => {
    const [mi, setMi] = useState(0.5);
    const [ti, setTi] = useState(0.3);
    const [mode, setMode] = useState<'b-mode' | 'color' | 'spectral'>('b-mode');

    const handleModeChange = (newMode: 'b-mode' | 'color' | 'spectral') => {
        setMode(newMode);
        switch (newMode) {
            case 'b-mode':
                setMi(0.5);
                setTi(0.3);
                break;
            case 'color':
                setMi(0.9);
                setTi(0.8);
                break;
            case 'spectral':
                setMi(1.2);
                setTi(1.5);
                break;
        }
    };

    return (
        <div className="space-y-8">
            <DemoSection
                title="Ultrasound Bioeffects & Safety Indices"
                description="Understand the two primary safety indices displayed on ultrasound systems: the Mechanical Index (MI) related to cavitation, and the Thermal Index (TI) related to tissue heating. Observe how these values change with different imaging modes."
            >
                <div className="flex justify-center gap-4 mb-8">
                    <button onClick={() => handleModeChange('b-mode')} className={`px-4 py-2 rounded-lg font-semibold ${mode === 'b-mode' ? 'bg-yellow-500 text-black' : 'bg-white/10'}`}>B-Mode</button>
                    <button onClick={() => handleModeChange('color')} className={`px-4 py-2 rounded-lg font-semibold ${mode === 'color' ? 'bg-yellow-500 text-black' : 'bg-white/10'}`}>Color Doppler</button>
                    <button onClick={() => handleModeChange('spectral')} className={`px-4 py-2 rounded-lg font-semibold ${mode === 'spectral' ? 'bg-yellow-500 text-black' : 'bg-white/10'}`}>Spectral Doppler</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-lg text-center transition-all duration-300 ${mi > 1.0 ? 'bg-red-500/20' : 'bg-white/10'}`}>
                        <h3 className="text-lg font-bold text-white/80 mb-2">Mechanical Index (MI)</h3>
                        <p className="text-5xl font-mono text-yellow-300">{mi.toFixed(1)}</p>
                        <p className="text-sm text-white/60 mt-2">Risk of Cavitation</p>
                        {mi > 1.0 && <p className="mt-4 text-red-400 font-bold animate-pulse">High MI: Use with caution</p>}
                    </div>
                    <div className={`p-6 rounded-lg text-center transition-all duration-300 ${ti > 1.0 ? 'bg-red-500/20' : 'bg-white/10'}`}>
                        <h3 className="text-lg font-bold text-white/80 mb-2">Thermal Index (TI)</h3>
                        <p className="text-5xl font-mono text-yellow-300">{ti.toFixed(1)}</p>
                        <p className="text-sm text-white/60 mt-2">Potential for Tissue Heating</p>
                        {ti > 1.0 && <p className="mt-4 text-red-400 font-bold animate-pulse">High TI: Monitor exposure time</p>}
                    </div>
                </div>

                <div className="mt-8 bg-gray-800/50 p-4 rounded-lg text-center">
                    <h3 className="font-bold text-yellow-400">ALARA Principle</h3>
                    <p className="text-white/80">As Low As Reasonably Achievable. Always use the lowest output power and shortest scan time necessary to obtain diagnostic information.</p>
                </div>
            </DemoSection>
        </div>
    );
};

export default SafetyDemo;
