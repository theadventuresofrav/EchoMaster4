
import React, { useState } from 'react';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

type AdvancedArtifactType = 'mirror' | 'sliceThickness';

const AdvancedArtifactsDemo: React.FC = () => {
    const [artifact, setArtifact] = useState<AdvancedArtifactType>('mirror');
    const [showFix, setShowFix] = useState(false);

    const getArtifactDetails = () => {
        switch (artifact) {
            case 'mirror':
                return {
                    title: 'Mirror Image Artifact',
                    description: "Occurs when sound reflects off a strong, specular reflector (like the diaphragm). The system assumes a straight path and places a duplicate structure deeper than the real one.",
                    fix: "Change the scanning angle or window to avoid the strong reflector.",
                    visualization: (
                        <div className="w-full h-full relative">
                            {/* Diaphragm */}
                            <div className="absolute top-1/2 left-0 w-full h-2 bg-white/80 rounded-full" />
                            {/* Real Liver */}
                            <div className="absolute top-1/4 left-1/4 w-24 h-16 bg-red-800 rounded-lg" />
                            <p className="absolute top-1/4 left-1/4 text-xs text-white">Liver</p>
                            {/* Mirror Artifact */}
                            <div className={`absolute bottom-1/4 left-1/4 w-24 h-16 bg-red-800/70 rounded-lg transition-opacity duration-500 ${showFix ? 'opacity-0' : 'opacity-100'}`} />
                        </div>
                    )
                };
            case 'sliceThickness':
                return {
                    title: 'Slice Thickness (Volume Averaging)',
                    description: "Occurs when the ultrasound beam has a finite thickness. Echoes from structures within the beam's thickness can be averaged, creating artifactual echoes in anechoic structures like cysts.",
                     fix: "Use a higher frequency transducer or adjust the focal zone to the level of the structure.",
                    visualization: (
                        <div className="w-full h-full relative flex items-center justify-center">
                            {/* Anechoic Cyst */}
                            <div className="w-32 h-32 rounded-full bg-black border-2 border-gray-400" />
                            {/* Artifactual Echoes */}
                            <div className={`absolute w-16 h-4 bg-gray-500/50 blur-sm transition-opacity duration-500 ${showFix ? 'opacity-0' : 'opacity-100'}`} />
                        </div>
                    )
                };
        }
    };

    const details = getArtifactDetails();

    return (
        <DemoSection
            title="Advanced Artifacts"
            description="Explore more complex artifacts that can be challenging to recognize. Understand their cause and learn strategies to mitigate them."
        >
            <div className="flex justify-center gap-4 mb-8">
                <ControlButton onClick={() => { setArtifact('mirror'); setShowFix(false); }} secondary={artifact !== 'mirror'}>Mirror Image</ControlButton>
                <ControlButton onClick={() => { setArtifact('sliceThickness'); setShowFix(false); }} secondary={artifact !== 'sliceThickness'}>Slice Thickness</ControlButton>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="h-80 bg-gray-700 rounded-xl p-4">{details.visualization}</div>
                 <div className="bg-white/10 p-6 rounded-lg flex flex-col justify-between">
                     <div>
                        <h3 className="text-xl font-bold text-yellow-400 mb-2">{details.title}</h3>
                        <p className="text-sm text-white/80 mb-4">{details.description}</p>
                        <p className="text-sm font-semibold text-cyan-300">💡 How to Fix:</p>
                        <p className="text-sm text-white/80">{details.fix}</p>
                     </div>
                     <ControlButton onClick={() => setShowFix(!showFix)}>
                        {showFix ? 'Show Artifact' : 'Apply Fix'}
                     </ControlButton>
                 </div>
            </div>
        </DemoSection>
    );
};

export default AdvancedArtifactsDemo;
