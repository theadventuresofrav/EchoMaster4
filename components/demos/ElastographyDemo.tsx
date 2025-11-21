
import React, { useState } from 'react';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

type TissueType = 'soft' | 'stiff';

const ElastographyDemo: React.FC = () => {
    const [tissue, setTissue] = useState<TissueType>('soft');
    const [isMeasuring, setIsMeasuring] = useState(false);

    const getTissueProps = () => {
        if (tissue === 'soft') {
            return {
                name: 'Soft Tissue (e.g., Normal Liver)',
                color: 'bg-blue-500',
                speed: '1.5 m/s',
                stiffness: '5 kPa'
            };
        }
        return {
            name: 'Stiff Tissue (e.g., Fibrotic Liver)',
            color: 'bg-red-500',
            speed: '3.0 m/s',
            stiffness: '20 kPa'
        };
    };

    const props = getTissueProps();

    const handleMeasure = () => {
        setIsMeasuring(true);
        setTimeout(() => setIsMeasuring(false), 2000); // 2s animation
    };

    return (
        <div className="space-y-8">
            <DemoSection
                title="Shear Wave Elastography"
                description="Simulate an Acoustic Radiation Force Impulse (ARFI) push pulse to generate shear waves. The speed of these waves is tracked to determine tissue stiffness—faster waves mean stiffer tissue."
            >
                <div className="flex justify-center gap-4 mb-8">
                    <ControlButton onClick={() => setTissue('soft')} secondary={tissue !== 'soft'}>Normal Tissue</ControlButton>
                    <ControlButton onClick={() => setTissue('stiff')} secondary={tissue !== 'stiff'}>Stiff Tissue</ControlButton>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80 bg-gray-800 rounded-xl flex items-center justify-center p-8 relative overflow-hidden">
                        {/* ARFI Pulse */}
                        {isMeasuring && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1/2 bg-yellow-400 animate-pulse" />}
                        {/* Shear Wave */}
                        {isMeasuring && <div className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-cyan-400 transition-all duration-2000 ease-linear`} style={{animation: `shearwave-${tissue} 2s forwards`}} />}
                        {/* Tissue Box */}
                        <div className={`w-3/4 h-3/4 border-2 border-dashed ${tissue === 'soft' ? 'border-blue-400' : 'border-red-400'}`} />
                        <div className="absolute top-2 left-2 text-sm text-white/70">{props.name}</div>
                    </div>
                    <div className="bg-white/10 p-6 rounded-lg flex flex-col justify-center text-center">
                        <ControlButton onClick={handleMeasure} disabled={isMeasuring}>
                            {isMeasuring ? 'Measuring...' : 'Send Push Pulse'}
                        </ControlButton>
                        <div className="mt-6">
                            <p className="text-sm">Shear Wave Speed:</p>
                            <p className="text-3xl font-mono text-yellow-300">{isMeasuring ? '...' : props.speed}</p>
                            <p className="text-sm mt-4">Calculated Stiffness (Young's Modulus):</p>
                            <p className="text-3xl font-mono text-yellow-300">{isMeasuring ? '...' : props.stiffness}</p>
                        </div>
                    </div>
                </div>
            </DemoSection>
            <style>{`
                @keyframes shearwave-soft {
                    from { transform: translateX(0px) scale(1); opacity: 1; }
                    to { transform: translateX(100px) scale(2); opacity: 0; }
                }
                 @keyframes shearwave-stiff {
                    from { transform: translateX(0px) scale(1); opacity: 1; }
                    to { transform: translateX(150px) scale(2); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default ElastographyDemo;
