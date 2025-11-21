
import React, { useState } from 'react';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

type LesionType = 'cyst' | 'mass';

const AbdominalDemo: React.FC = () => {
    const [lesion, setLesion] = useState<LesionType>('cyst');

    const getLesionDetails = () => {
        if (lesion === 'cyst') {
            return {
                name: "Simple Cyst",
                features: ["Anechoic (black)", "Round, smooth borders", "Posterior acoustic enhancement"],
                artifact: <div className="absolute top-full left-1/2 -translate-x-1/2 w-20 h-24 bg-gradient-to-b from-white/40 to-transparent" />,
                object: <div className="w-20 h-20 rounded-full bg-black border-2 border-gray-300" />
            };
        }
        return {
            name: "Solid Mass",
            features: ["Hypoechoic (gray)", "Irregular borders", "No significant artifact"],
            artifact: null,
            object: <div className="w-20 h-20 rounded-2xl bg-gray-500 border-2 border-gray-400" />
        };
    };

    const details = getLesionDetails();

    return (
        <DemoSection
            title="Clinical Application: Differentiating Liver Lesions"
            description="Toggle between a simple cyst and a solid mass to understand the key sonographic features used for differentiation, especially the role of artifacts."
        >
            <div className="flex justify-center gap-4 mb-8">
                <ControlButton onClick={() => setLesion('cyst')} secondary={lesion !== 'cyst'}>Simple Cyst</ControlButton>
                <ControlButton onClick={() => setLesion('mass')} secondary={lesion !== 'mass'}>Solid Mass</ControlButton>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80 bg-orange-900/50 rounded-xl p-4 flex items-center justify-center relative">
                    {/* Liver Parenchyma Texture */}
                    <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '8px 8px'}}></div>
                    {/* Lesion */}
                    <div className="relative">
                        {details.object}
                        {details.artifact}
                    </div>
                </div>
                <div className="bg-white/10 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4">{details.name}</h3>
                    <p className="mb-2 font-semibold">Key Sonographic Features:</p>
                    <ul className="list-disc list-inside space-y-2">
                        {details.features.map(feature => <li key={feature}>{feature}</li>)}
                    </ul>
                </div>
            </div>
        </DemoSection>
    );
};

export default AbdominalDemo;
