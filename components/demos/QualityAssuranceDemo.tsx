
import React, { useState } from 'react';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

const QualityAssuranceDemo: React.FC = () => {
    const [test, setTest] = useState<'deadZone' | 'accuracy'>('deadZone');
    const [measuredValue, setMeasuredValue] = useState<number | null>(null);

    // Phantom properties
    const deadZoneDepth = 1.5; // cm
    const targetDistance = 5.0; // cm

    const performTest = () => {
        if (test === 'deadZone') {
            setMeasuredValue(deadZoneDepth + (Math.random() - 0.5) * 0.2); // slight variation
        } else {
            setMeasuredValue(targetDistance + (Math.random() - 0.5) * 0.3);
        }
    };
    
    const getTestDetails = () => {
        switch(test) {
            case 'deadZone':
                return {
                    title: 'Dead Zone Measurement',
                    description: 'The dead zone is the region close to the transducer where imaging is inaccurate. We measure the distance from the top of the phantom to the first visible pin.',
                    phantom: (
                        <div className="relative w-full h-full bg-gray-600 p-4">
                            <div className="absolute top-0 left-0 w-full h-6 bg-gray-800/50" />
                            {Array.from({length: 5}).map((_, i) => (
                                <div key={i} className="absolute w-2 h-2 rounded-full bg-white" style={{left: `${20+i*15}%`, top: `${(i+1)*15}%`}} />
                            ))}
                        </div>
                    ),
                    expected: `${deadZoneDepth} cm`
                };
            case 'accuracy':
                 return {
                    title: 'Caliper Accuracy',
                    description: 'We test the accuracy of the electronic calipers by measuring the distance between two pins with a known separation.',
                    phantom: (
                         <div className="relative w-full h-full bg-gray-600 p-4">
                            <div className="absolute w-2 h-2 rounded-full bg-white" style={{left: '30%', top: '30%'}} />
                            <div className="absolute w-2 h-2 rounded-full bg-white" style={{left: '70%', top: '30%'}} />
                         </div>
                    ),
                    expected: `${targetDistance} cm`
                };
        }
    };
    
    const details = getTestDetails();
    const isPass = measuredValue !== null && Math.abs(measuredValue - (test === 'deadZone' ? deadZoneDepth : targetDistance)) < 0.2;

    return (
        <div className="space-y-8">
            <DemoSection
                title="Virtual Quality Assurance Phantom"
                description="Perform standard QA tests on a simulated phantom to ensure the ultrasound system is functioning correctly."
            >
                 <div className="flex justify-center gap-4 mb-8">
                    <ControlButton onClick={() => { setTest('deadZone'); setMeasuredValue(null); }} secondary={test !== 'deadZone'}>Dead Zone</ControlButton>
                    <ControlButton onClick={() => { setTest('accuracy'); setMeasuredValue(null); }} secondary={test !== 'accuracy'}>Caliper Accuracy</ControlButton>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80 bg-gray-800 rounded-xl flex items-center justify-center p-8 relative overflow-hidden">
                        {details.phantom}
                        <div className="absolute top-2 left-2 text-sm text-white/50">AI-100 Phantom</div>
                    </div>
                    <div className="bg-white/10 p-6 rounded-lg flex flex-col justify-center text-center">
                        <h3 className="text-xl font-bold text-yellow-400 mb-2">{details.title}</h3>
                        <p className="text-sm text-white/80 mb-6">{details.description}</p>
                        <ControlButton onClick={performTest}>Perform Measurement</ControlButton>
                        
                        {measuredValue !== null && (
                            <div className="mt-6">
                                <p>Expected: <span className="font-mono">{details.expected}</span></p>
                                <p>Measured: <span className="font-mono text-lg text-yellow-300">{measuredValue.toFixed(2)} cm</span></p>
                                <p className={`mt-2 font-bold text-2xl ${isPass ? 'text-green-400' : 'text-red-400'}`}>
                                    {isPass ? 'PASS' : 'FAIL'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </DemoSection>
        </div>
    );
};

export default QualityAssuranceDemo;
