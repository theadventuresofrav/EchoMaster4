
import React, { useState } from 'react';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

const ProcessingDemo: React.FC = () => {
    const [isFrozen, setIsFrozen] = useState(false);
    const [preProcValue, setPreProcValue] = useState(5); // e.g. TGC
    const [postProcValue, setPostProcValue] = useState(50); // e.g. Grayscale map

    return (
        <div className="space-y-8">
            <DemoSection
                title="Pre- vs. Post-Processing"
                description="Understand the critical difference between pre-processing (functions applied to raw data before freezing) and post-processing (functions applied to the stored image after freezing). Try adjusting controls in both 'Live' and 'Frozen' states."
            >
                <div className="flex justify-center mb-6">
                    <ControlButton onClick={() => setIsFrozen(!isFrozen)}>
                        {isFrozen ? 'Unfreeze Image' : 'Freeze Image'}
                    </ControlButton>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-4 rounded-lg">
                        <h3 className="font-bold text-lg text-center mb-4">Pre-Processing (e.g., TGC)</h3>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={preProcValue}
                            onChange={(e) => setPreProcValue(Number(e.target.value))}
                            disabled={isFrozen}
                            className="w-full accent-orange-500 disabled:opacity-50"
                        />
                        <p className="text-center text-sm mt-2 text-white/70">{isFrozen ? 'Locked while frozen' : 'Adjustable on live image'}</p>
                    </div>
                     <div className="bg-white/5 p-4 rounded-lg">
                        <h3 className="font-bold text-lg text-center mb-4">Post-Processing (e.g., Grayscale)</h3>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={postProcValue}
                            onChange={(e) => setPostProcValue(Number(e.target.value))}
                            className="w-full accent-cyan-400"
                        />
                         <p className="text-center text-sm mt-2 text-white/70">Adjustable on live or frozen image</p>
                    </div>
                </div>
                <div className="mt-6 h-64 bg-gray-800 rounded-xl relative" style={{ filter: `grayscale(${postProcValue}%)` }}>
                    <div className="absolute inset-0 transition-all duration-300" style={{ opacity: preProcValue/10, background: 'linear-gradient(to bottom, #fff2, #fff)' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-black/50">{isFrozen ? "FROZEN" : "LIVE"}</div>
                </div>
            </DemoSection>
        </div>
    );
};

export default ProcessingDemo;
