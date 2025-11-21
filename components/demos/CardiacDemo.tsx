
import React, { useState } from 'react';
import DemoSection from './DemoSection';

const CardiacDemo: React.FC = () => {
    const [sectorWidth, setSectorWidth] = useState(60); // degrees

    const frameRate = 120 - sectorWidth; // simplified inverse relationship

    return (
        <DemoSection
            title="Clinical Application: Cardiac Sector Width vs. Frame Rate"
            description="In cardiac imaging, high temporal resolution (frame rate) is crucial. A narrower sector requires fewer scan lines, allowing for a higher frame rate. Adjust the sector width to see this fundamental trade-off."
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="h-80 bg-black rounded-xl flex items-center justify-center p-4 relative overflow-hidden">
                    {/* Sector */}
                    <div
                        className="absolute top-0 h-full w-[200%] bg-gradient-to-t from-yellow-400/20 to-transparent origin-bottom transition-all duration-300"
                        style={{
                            clipPath: `polygon(50% 100%, ${50 - sectorWidth/2}% 0, ${50 + sectorWidth/2}% 0)`,
                        }}
                    />
                    {/* Heart */}
                    <div className="w-24 h-24 bg-red-600 rounded-full animate-pulse" />
                </div>
                <div className="flex flex-col justify-center">
                    <div>
                        <label className="block text-white/80 mb-2">Sector Width (degrees)</label>
                        <input
                            type="range"
                            min="30"
                            max="90"
                            value={sectorWidth}
                            onChange={(e) => setSectorWidth(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                        />
                        <div className="text-center mt-2 font-mono text-lg text-yellow-400">{sectorWidth}°</div>
                    </div>
                    <div className="mt-6 bg-white/10 p-4 rounded-lg text-center">
                        <h3 className="font-bold text-lg">Resulting Frame Rate</h3>
                        <p className={`text-3xl font-mono mt-1 transition-colors ${frameRate > 70 ? 'text-green-400' : 'text-orange-400'}`}>
                            {frameRate.toFixed(0)} Hz
                        </p>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

export default CardiacDemo;
