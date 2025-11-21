
import React, { useState } from 'react';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

const HarmonicsDemo: React.FC = () => {
    const [mode, setMode] = useState<'fundamental' | 'harmonic'>('fundamental');

    return (
        <div className="space-y-8">
            <DemoSection
                title="Tissue Harmonic Imaging (THI)"
                description="Compare fundamental imaging with tissue harmonic imaging. Harmonics are generated as the sound beam travels through tissue, creating a cleaner signal on the return path, which reduces artifacts and improves image clarity."
            >
                <div className="flex justify-center gap-4 mb-8">
                    <ControlButton onClick={() => setMode('fundamental')} secondary={mode !== 'fundamental'}>Fundamental Imaging</ControlButton>
                    <ControlButton onClick={() => setMode('harmonic')} secondary={mode !== 'harmonic'}>Harmonic Imaging</ControlButton>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-96 bg-gray-800 rounded-xl relative p-4">
                        <div className="absolute inset-0 bg-gray-600 rounded-xl p-4">
                             {/* Tissue Texture */}
                            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
                            {/* Cyst */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-black border-2 border-gray-400"/>
                            {/* Reverberation Artifact */}
                             <div className={`absolute top-1/4 left-1/4 w-12 h-1 bg-white/40 transition-opacity duration-500 ${mode === 'fundamental' ? 'opacity-100' : 'opacity-0'}`}/>
                             <div className={`absolute top-1/3 left-1/4 w-12 h-1 bg-white/20 transition-opacity duration-500 ${mode === 'fundamental' ? 'opacity-100' : 'opacity-0'}`}/>
                        </div>
                        <div className="absolute top-2 left-2 text-sm font-bold text-white/70 bg-black/50 px-2 py-1 rounded">Ultrasound Image</div>
                    </div>
                    <div className="bg-white/10 p-6 rounded-lg flex flex-col justify-center">
                         <h3 className="text-2xl font-bold text-yellow-400 mb-4">{mode === 'fundamental' ? 'Fundamental' : 'Harmonic'}</h3>
                         {mode === 'fundamental' && (
                             <>
                                <p className="mb-4">Transmits at 2 MHz, listens for returning 2 MHz echoes.</p>
                                <ul className="list-disc list-inside space-y-2 text-red-400">
                                    <li>Prone to artifacts from body wall reverberation.</li>
                                    <li>Lower signal-to-noise ratio.</li>
                                    <li>Poorer lateral resolution.</li>
                                </ul>
                             </>
                         )}
                         {mode === 'harmonic' && (
                              <>
                                <p className="mb-4">Transmits at 2 MHz, but listens ONLY for the 4 MHz harmonic echoes generated within the tissue.</p>
                                <ul className="list-disc list-inside space-y-2 text-green-400">
                                    <li>Artifacts from the body wall are rejected.</li>
                                    <li>Higher signal-to-noise ratio.</li>
                                    <li>Improved lateral resolution.</li>
                                </ul>
                             </>
                         )}
                    </div>
                </div>
            </DemoSection>
        </div>
    );
};

export default HarmonicsDemo;
