
import React, { useState, useMemo } from 'react';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

// --- Section 1: Piezoelectric Effect ---
const PiezoelectricEffectSection: React.FC = () => {
    const [isApplyingPressure, setIsApplyingPressure] = useState(false);
    const [isApplyingVoltage, setIsApplyingVoltage] = useState(false);

    const handlePressure = () => {
        setIsApplyingPressure(true);
        setTimeout(() => setIsApplyingPressure(false), 1000);
    };

    const handleVoltage = () => {
        setIsApplyingVoltage(true);
        setTimeout(() => setIsApplyingVoltage(false), 1000);
    };

    return (
        <DemoSection
            title="The Piezoelectric Effect"
            description="The core principle of any ultrasound transducer. See how applying pressure to a piezoelectric crystal generates voltage (for receiving echoes) and how applying voltage creates a pressure wave (for transmitting sound)."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                {/* Direct Effect */}
                <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="font-bold mb-4">Direct Effect (Receiving)</h3>
                    <div className="h-40 flex items-center justify-center">
                        <div className={`w-32 h-16 bg-yellow-400 rounded transition-all duration-200 flex items-center justify-center relative ${isApplyingPressure ? 'scale-x-95 scale-y-105' : ''}`}>
                            <span className="text-black font-semibold">PZT</span>
                            {isApplyingPressure && <div className="absolute -top-6 text-2xl animate-bounce">👇</div>}
                            {isApplyingPressure && <div className="absolute -bottom-10 text-xl font-bold text-yellow-300 animate-pulse">⚡ Voltage! ⚡</div>}
                        </div>
                    </div>
                    <ControlButton onClick={handlePressure} disabled={isApplyingPressure}>Apply Pressure</ControlButton>
                </div>

                {/* Reverse Effect */}
                <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="font-bold mb-4">Reverse Effect (Transmitting)</h3>
                    <div className="h-40 flex items-center justify-center">
                         <div className={`w-32 h-16 bg-yellow-400 rounded transition-all duration-200 flex items-center justify-center relative ${isApplyingVoltage ? 'scale-105' : ''}`}>
                            <span className="text-black font-semibold">PZT</span>
                            {isApplyingVoltage && <div className="absolute -top-6 text-2xl animate-ping">⚡</div>}
                            {isApplyingVoltage && <div className="absolute -bottom-10 text-xl font-bold text-yellow-300 animate-pulse">🔊 Sound! 🔊</div>}
                        </div>
                    </div>
                    <ControlButton onClick={handleVoltage} disabled={isApplyingVoltage}>Apply Voltage</ControlButton>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 2: Transducer Anatomy ---
const TransducerAnatomySection: React.FC = () => {
    const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

    const layers = [
        { id: 'case', name: 'Case/Housing', description: 'Protects the internal components and insulates the patient from electric shock.' },
        { id: 'backing', name: 'Backing/Damping Material', description: 'Shortens the pulse duration (improves axial resolution) and reduces backward ringing.' },
        { id:
'crystal', name: 'Piezoelectric Crystal (PZT)', description: 'The active element that converts electrical to mechanical energy and vice-versa.' },
        { id: 'matching', name: 'Matching Layer', description: 'Reduces the acoustic impedance mismatch between the crystal and the skin, improving sound transmission.' },
    ];

    return (
        <DemoSection
            title="Anatomy of a Transducer"
            description="A transducer is more than just a crystal. Hover over the layers to learn about the function of each critical component."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-800/50 rounded-xl p-4">
                    {layers.map((layer, index) => (
                         <div
                            key={layer.id}
                            onMouseEnter={() => setHoveredLayer(layer.id)}
                            onMouseLeave={() => setHoveredLayer(null)}
                            className={`w-4/5 p-3 text-center font-semibold border-2 transition-all duration-300 cursor-pointer ${hoveredLayer === layer.id ? 'bg-yellow-400 text-black border-yellow-200 scale-105' : 'bg-white/10 border-white/20'}`}
                            style={{ borderBottomWidth: index === layers.length - 1 ? '2px' : '0px',
                                     borderRadius: index === 0 ? '8px 8px 0 0' : (index === layers.length - 1 ? '0 0 8px 8px' : '0')
                            }}
                        >
                            {layer.name}
                        </div>
                    ))}
                </div>
                <div className="w-full md:w-1/2 min-h-[150px] bg-white/5 p-4 rounded-lg flex items-center justify-center">
                    <p className="text-center text-lg italic text-white/80">
                        {hoveredLayer ? layers.find(l => l.id === hoveredLayer)?.description : 'Hover over a layer to see its function.'}
                    </p>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 3: Transducer Types & Beam Formation ---
type TransducerType = 'linear' | 'curvilinear' | 'phased';

const TransducerTypesSection: React.FC = () => {
    const [type, setType] = useState<TransducerType>('linear');

    const typeInfo = useMemo(() => {
        switch (type) {
            case 'linear':
                return {
                    title: "Linear Sequential Array",
                    description: "Elements are fired in sequential groups to create parallel scan lines. This produces a rectangular image. Ideal for superficial structures and vascular imaging due to its high frequency and clear near-field.",
                    imageShape: <rect x="10" y="20" width="80" height="130" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />,
                    transducerShape: <rect x="10" y="0" width="80" height="15" rx="2" fill="#fbbF24" />,
                    animation: (
                        <>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <g key={i} style={{ animation: `line-scan 1s linear infinite`, animationDelay: `${i * 0.2}s`}}>
                                   <line 
                                    x1={20 + i * 15} y1="15" 
                                    x2={20 + i * 15} y2="150" 
                                    stroke="#f97316" strokeWidth="1"
                                    />
                                </g>
                            ))}
                        </>
                    )
                };
            case 'curvilinear':
                 return {
                    title: "Curvilinear (Convex) Array",
                    description: "Elements are arranged on a curve and fired sequentially. The beams naturally diverge, creating a blunted sector image. Excellent for abdominal and OB/GYN imaging due to its wide field of view and good depth.",
                    imageShape: <path d="M 20 20 Q 50 30, 80 20 L 100 150 Q 50 160, 0 150 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />,
                    transducerShape: <path d="M 20 0 Q 50 15, 80 0 L 80 15 Q 50 30, 20 15 Z" fill="#fbbF24" />,
                     animation: (
                        <>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <g key={i} style={{ animation: `line-scan 1.2s linear infinite`, animationDelay: `${i * 0.24}s`, opacity: 0}}>
                                    <path 
                                        d={`M ${30 + i * 10} 15 L ${10 + i * 20} 150`}
                                        stroke="#f97316" strokeWidth="1"
                                    />
                                </g>
                            ))}
                        </>
                    )
                };
            case 'phased':
                return {
                    title: "Phased Array",
                    description: "All elements are fired with precise time delays to steer and focus the beam. This creates a sector (pie-shaped) image from a very small footprint, perfect for fitting between ribs for cardiac imaging.",
                    imageShape: <path d="M 50 15 L 95 150 Q 50 140, 5 150 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />,
                    transducerShape: <rect x="35" y="0" width="30" height="15" rx="2" fill="#fbbF24" />,
                     animation: (
                        <g transform="translate(50, 15)">
                            <path 
                                d="M 0 0 L 0 135" 
                                stroke="#f97316" strokeWidth="2"
                                style={{ animation: `beam-sweep 1.5s ease-in-out infinite alternate`}}
                            />
                        </g>
                    )
                };
        }
    }, [type]);

    return (
        <DemoSection
            title="Transducer Types & Beam Formation"
            description="Modern transducers are arrays of elements fired in different ways to create specific beam shapes and image formats. Each type is optimized for different clinical applications."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-80 bg-gray-800/50 rounded-xl p-4 relative flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 100 160" preserveAspectRatio="xMidYMid meet">
                        {typeInfo.imageShape}
                        {typeInfo.transducerShape}
                        {typeInfo.animation}
                    </svg>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center gap-4">
                     <div className="flex flex-col gap-2">
                        <ControlButton onClick={() => setType('linear')} secondary={type !== 'linear'}>Linear Array</ControlButton>
                        <ControlButton onClick={() => setType('curvilinear')} secondary={type !== 'curvilinear'}>Curvilinear Array</ControlButton>
                        <ControlButton onClick={() => setType('phased')} secondary={type !== 'phased'}>Phased Array</ControlButton>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg mt-2">
                        <h4 className="font-bold text-yellow-400 mb-2">{typeInfo.title}</h4>
                        <p className="text-sm text-white/80">{typeInfo.description}</p>
                    </div>
                </div>
            </div>
        </DemoSection>
    )
};


// --- Section 4: Operating Frequency & The Clinical Trade-Off ---
const OperatingFrequencySection: React.FC = () => {
    const [frequency, setFrequency] = useState(5); // MHz
    const SPEED_OF_SOUND = 1540; // m/s
    const ATTENUATION_COEFF = 0.5; // dB/cm/MHz

    const wavelength = useMemo(() => (SPEED_OF_SOUND / (frequency * 1_000_000)) * 1_000_000, [frequency]); // in µm
    const penetration = useMemo(() => 60 / (frequency * ATTENUATION_COEFF), [frequency]); // Simplified penetration depth in cm

    return (
        <DemoSection
            title="Operating Frequency & The Clinical Trade-Off"
            description="The most important decision in clinical ultrasound: choosing the right frequency. Higher frequencies provide better resolution but cannot penetrate as deep. Lower frequencies can see deeper but sacrifice resolution."
        >
             <div className="w-full lg:w-2/3 mx-auto">
              <label className="block text-white/80 mb-2 text-center">Adjust Frequency</label>
              <input type="range" min="2" max="15" step="0.5" value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
              <div className="text-center mt-2 font-mono text-xl text-yellow-400">{frequency.toFixed(1)} MHz</div>
            </div>
             <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">Axial Resolution</h4>
                    <p className="text-3xl font-mono text-green-400 transition-all duration-300">{wavelength.toFixed(2)} µm</p>
                    <p className="text-xs text-white/60">(Shorter wavelength = better resolution)</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">Penetration Depth</h4>
                    <p className="text-3xl font-mono text-blue-400 transition-all duration-300">{penetration.toFixed(1)} cm</p>
                    <p className="text-xs text-white/60">(Lower frequency = better penetration)</p>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 5: Bandwidth & Pulse Duration ---
const BandwidthSection: React.FC = () => {
    const [isShortPulse, setIsShortPulse] = useState(true);

    return (
        <DemoSection
            title="Bandwidth & Pulse Duration"
            description="A transducer's backing material shortens the pulse. A shorter pulse contains a wider range of frequencies (wide bandwidth), which is crucial for good axial resolution."
        >
            <div className="flex justify-center mb-6">
                <div className="flex gap-4 p-2 bg-gray-800 rounded-lg">
                    <ControlButton onClick={() => setIsShortPulse(true)} secondary={!isShortPulse}>Short Pulse</ControlButton>
                    <ControlButton onClick={() => setIsShortPulse(false)} secondary={isShortPulse}>Long Pulse</ControlButton>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 p-4 rounded-lg text-center">
                    <h4 className="font-bold mb-2">Ultrasound Pulse</h4>
                    <div className="h-24 w-full bg-gray-800/50 rounded flex items-center justify-center p-2">
                         <svg width="100%" height="100%" viewBox="0 0 100 50">
                             <path d={isShortPulse ? "M10 25 C 20 0, 30 50, 40 25 S 50 0, 60 25" : "M10 25 C 15 0, 20 50, 25 25 S 30 0, 35 25 S 40 50, 45 25 S 50 0, 55 25 S 60 50, 65 25 S 70 0, 75 25 S 80 50, 85 25 S 90 0, 95 25"} stroke="#f97316" strokeWidth="1.5" fill="none" className="transition-all duration-500" />
                         </svg>
                    </div>
                    <p className="mt-2 text-sm text-white/80">{isShortPulse ? "Good Damping" : "Poor Damping"}</p>
                </div>
                 <div className="bg-white/5 p-4 rounded-lg text-center">
                    <h4 className="font-bold mb-2">Frequency Bandwidth</h4>
                    <div className="h-24 w-full bg-gray-800/50 rounded flex items-center justify-center p-2">
                        <svg width="100%" height="100%" viewBox="0 0 100 50">
                             <path d={isShortPulse ? "M10 45 C 30 5, 70 5, 90 45" : "M40 45 C 45 5, 55 5, 60 45" } stroke="#facc15" fill="#facc15" fillOpacity="0.3" strokeWidth="1.5" className="transition-all duration-500"/>
                             <text x="50" y="40" fontSize="6" fill="white" textAnchor="middle">5 MHz</text>
                        </svg>
                    </div>
                     <p className="mt-2 text-sm text-white/80">{isShortPulse ? "Wide Bandwidth (Good)" : "Narrow Bandwidth (Poor)"}</p>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 6: Interactive Clinical Simulation ---
const ClinicalSimulationSection: React.FC = () => {
    const [task, setTask] = useState<'thyroid' | 'renal' | null>(null);
    const [frequency, setFrequency] = useState(7.5);

    const isCorrect = (task === 'thyroid' && frequency >= 9) || (task === 'renal' && frequency <= 5);
    const feedback = task ? (isCorrect ? "Excellent choice! This frequency is well-suited for the target depth and required resolution." : "This frequency may not be optimal. Consider the trade-off between resolution and penetration for this exam.") : "Select an exam to begin.";

    return (
        <DemoSection
            title="Clinical Simulation: Frequency Selection"
            description="Choose a clinical task and then select the optimal transducer frequency. Remember: high frequency for superficial structures, low frequency for deep structures."
        >
            <div className="flex justify-center gap-4 mb-6">
                <ControlButton onClick={() => setTask('thyroid')} secondary={task !== 'thyroid'}>Scan Thyroid (Superficial)</ControlButton>
                <ControlButton onClick={() => setTask('renal')} secondary={task !== 'renal'}>Scan Kidney (Deep)</ControlButton>
            </div>
            {task && (
                <div className="w-full lg:w-2/3 mx-auto">
                    <label className="block text-white/80 mb-2 text-center">Select Transducer Frequency</label>
                    <input type="range" min="2" max="15" step="0.5" value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                    <div className="text-center mt-2 font-mono text-xl text-yellow-400">{frequency.toFixed(1)} MHz</div>
                </div>
            )}
            <div className={`mt-6 p-4 rounded-lg text-center font-semibold transition-colors duration-300 ${task && isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {feedback}
            </div>
        </DemoSection>
    );
};

const TransducersDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <PiezoelectricEffectSection />
      <TransducerAnatomySection />
      <TransducerTypesSection />
      <OperatingFrequencySection />
      <BandwidthSection />
      <ClinicalSimulationSection />
    </div>
  );
};

export default TransducersDemo;
