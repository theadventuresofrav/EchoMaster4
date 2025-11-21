
import React, { useState } from 'react';
import DemoSection from './DemoSection';

const DynamicRangeDemo: React.FC = () => {
    const [dynamicRange, setDynamicRange] = useState(60); // dB

    const contrast = 1 - (dynamicRange - 40) / 80; // simple mapping to a 0-1 value

    return (
        <div className="space-y-8">
            <DemoSection
                title="Dynamic Range / Compression"
                description="Adjust the dynamic range (also known as compression) to change the number of gray shades displayed. A lower dynamic range results in a higher-contrast image, while a higher dynamic range provides a smoother, lower-contrast image."
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div 
                        className="h-96 bg-gray-500 rounded-xl relative transition-all duration-300"
                        style={{ filter: `contrast(${contrast * 150}%)` }}
                    >
                        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-gray-400" />
                        <div className="absolute top-1/3 left-1/3 w-10 h-10 rounded-full bg-gray-600" />
                        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 rounded-full bg-gray-300" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <div>
                            <label className="block text-white/80 mb-2">Dynamic Range (dB)</label>
                            <input
                                type="range"
                                min="40"
                                max="120"
                                step="5"
                                value={dynamicRange}
                                onChange={(e) => setDynamicRange(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                            />
                            <div className="text-center mt-2 font-mono text-lg text-yellow-400">{dynamicRange} dB</div>
                        </div>
                        <div className="mt-6 bg-white/10 p-4 rounded-lg text-center">
                            <h3 className="font-bold text-lg">{dynamicRange < 70 ? 'High Contrast' : 'Low Contrast'}</h3>
                            <p className="text-sm text-white/70">{dynamicRange < 70 ? 'Fewer shades of gray, more black and white.' : 'More shades of gray, smoother texture.'}</p>
                        </div>
                    </div>
                </div>
            </DemoSection>
        </div>
    );
};

export default DynamicRangeDemo;
