
import React, { useState } from 'react';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

type ArtifactType = 'shadowing' | 'enhancement' | 'reverberation';

const ArtifactsDemo: React.FC = () => {
    const [artifact, setArtifact] = useState<ArtifactType>('shadowing');

    const getArtifactDetails = () => {
        switch (artifact) {
            case 'shadowing':
                return {
                    title: 'Acoustic Shadowing',
                    description: 'Caused by a highly attenuating or reflecting structure (like bone or a gallstone). The area behind the object is anechoic or hypoechoic because the sound beam cannot pass through it.',
                    object: <div className="w-16 h-16 rounded-full bg-white shadow-lg" />,
                    artifact: <div className="absolute top-full left-1/2 -translate-x-1/2 w-16 h-40 bg-gradient-to-b from-black/80 to-transparent" />
                };
            case 'enhancement':
                return {
                    title: 'Acoustic Enhancement',
                    description: 'Occurs behind a structure with low attenuation (like a fluid-filled cyst). The area behind appears brighter because the sound beam is stronger than in adjacent tissues.',
                    object: <div className="w-16 h-16 rounded-full bg-black border-2 border-gray-400" />,
                    artifact: <div className="absolute top-full left-1/2 -translate-x-1/2 w-16 h-40 bg-gradient-to-b from-white/50 to-transparent" />
                };
            case 'reverberation':
                return {
                    title: 'Reverberation',
                    description: 'Caused by sound bouncing back and forth between two strong, parallel reflectors. Appears as multiple, equally spaced echoes deep to the real reflectors.',
                    object: <div className="w-24 h-2 bg-white" />,
                    artifact: (
                        <>
                            <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-24 h-2 bg-white/60" />
                            <div className="absolute top-full mt-8 left-1/2 -translate-x-1/2 w-24 h-2 bg-white/30" />
                            <div className="absolute top-full mt-12 left-1/2 -translate-x-1/2 w-24 h-2 bg-white/10" />
                        </>
                    )
                };
        }
    };
    
    const details = getArtifactDetails();

    return (
        <div className="space-y-8">
            <DemoSection
                title="Common Artifacts Simulator"
                description="Select an artifact to visualize how it appears on an ultrasound image and learn the physical principles behind its creation."
            >
                <div className="flex justify-center gap-4 mb-8">
                    <ControlButton onClick={() => setArtifact('shadowing')} secondary={artifact !== 'shadowing'}>Shadowing</ControlButton>
                    <ControlButton onClick={() => setArtifact('enhancement')} secondary={artifact !== 'enhancement'}>Enhancement</ControlButton>
                    <ControlButton onClick={() => setArtifact('reverberation')} secondary={artifact !== 'reverberation'}>Reverberation</ControlButton>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80 bg-gray-700 rounded-xl flex items-center justify-center p-8 relative overflow-hidden">
                        <div className="absolute top-12">
                            <div className="relative">
                                {details.object}
                                {details.artifact}
                            </div>
                        </div>
                         <div className="absolute top-2 left-2 text-sm text-white/50">Ultrasound Image</div>
                    </div>
                    <div className="bg-white/10 p-6 rounded-lg flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-yellow-400 mb-4">{details.title}</h3>
                        <p className="text-white/80">{details.description}</p>
                    </div>
                </div>
            </DemoSection>
        </div>
    );
};

export default ArtifactsDemo;
