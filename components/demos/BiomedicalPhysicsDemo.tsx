
import React, { useState } from 'react';
import DemoSection from './DemoSection';

const BiomedicalPhysicsDemo: React.FC = () => {
    const [initialIntensity, setInitialIntensity] = useState(10); // mW/cm^2
    const [finalIntensity, setFinalIntensity] = useState(20); // mW/cm^2

    const decibels = 10 * Math.log10(finalIntensity / initialIntensity);

    return (
        <div className="space-y-8">
            <DemoSection
                title="Interactive Decibel Calculator"
                description="Adjust the initial and final intensities of the sound beam to see the corresponding change in decibels (dB). Remember, a 3 dB change means the intensity has doubled, and a 10 dB change means it has increased ten-fold."
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-white/80 mb-2">Initial Intensity (mW/cm²)</label>
                            <input type="range" min="1" max="100" value={initialIntensity} onChange={e => setInitialIntensity(Number(e.target.value))} className="w-full accent-cyan-400"/>
                            <p className="text-center font-mono">{initialIntensity} mW/cm²</p>
                        </div>
                        <div>
                            <label className="block text-white/80 mb-2">Final Intensity (mW/cm²)</label>
                            <input type="range" min="1" max="100" value={finalIntensity} onChange={e => setFinalIntensity(Number(e.target.value))} className="w-full accent-yellow-400"/>
                            <p className="text-center font-mono">{finalIntensity} mW/cm²</p>
                        </div>
                    </div>
                    <div className="bg-white/10 p-6 rounded-lg flex flex-col items-center justify-center">
                        <h3 className="text-lg font-bold">Relative Change</h3>
                        <p className={`text-6xl font-mono transition-colors duration-300 ${decibels > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {decibels.toFixed(1)} dB
                        </p>
                        <p className="text-sm text-white/70 mt-2">
                             {decibels > 0 ? `(A gain of ${decibels.toFixed(1)} dB)` : `(An attenuation of ${Math.abs(decibels).toFixed(1)} dB)`}
                        </p>
                    </div>
                </div>
            </DemoSection>
        </div>
    );
};

export default BiomedicalPhysicsDemo;
