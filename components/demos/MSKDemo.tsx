
import React, { useState } from 'react';
import DemoSection from './DemoSection';

const MSKDemo: React.FC = () => {
    const [angle, setAngle] = useState(90); // degrees, 90 is perpendicular

    const anisotropyEffect = Math.abs(angle - 90) / 20; // 0 to 1 as angle deviates from 90

    return (
        <DemoSection
            title="Clinical Application: Anisotropy"
            description="Anisotropy is a critical concept in MSK imaging. A tendon's brightness depends on the ultrasound beam being perfectly perpendicular (90°) to its fibers. Adjust the transducer angle to see how a normal tendon can appear pathologically dark (hypoechoic) if the angle is incorrect."
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80 bg-gray-800 rounded-xl flex items-center justify-center p-4 relative">
                    {/* Tendon Fibers */}
                    <div className="w-3/4 h-24 bg-white/10 p-2 rounded">
                        <div 
                            className="w-full h-full" 
                            style={{
                                background: `repeating-linear-gradient(90deg, #fff, #fff 1px, #ddd 1px, #ddd 3px)`,
                                opacity: 1 - anisotropyEffect * 0.8
                            }}
                        />
                    </div>
                    {/* Transducer */}
                    <div className="absolute top-4 w-24 h-6 bg-yellow-400 rounded transition-transform duration-200" style={{ transform: `rotate(${90-angle}deg)`}}/>
                </div>
                <div className="flex flex-col justify-center">
                    <div>
                        <label className="block text-white/80 mb-2">Transducer Angle (degrees)</label>
                        <input
                            type="range"
                            min="70"
                            max="110"
                            value={angle}
                            onChange={(e) => setAngle(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                        />
                        <div className="text-center mt-2 font-mono text-lg text-yellow-400">{angle}°</div>
                    </div>
                    <div className="mt-6 bg-white/10 p-4 rounded-lg text-center">
                        <h3 className="font-bold text-lg">Tendon Appearance</h3>
                        <p className={`text-xl font-semibold mt-1 transition-colors ${angle === 90 ? 'text-green-400' : 'text-red-400'}`}>
                            {angle === 90 ? 'Correctly Imaged (Echogenic)' : 'Anisotropy Present (Hypoechoic)'}
                        </p>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

export default MSKDemo;
