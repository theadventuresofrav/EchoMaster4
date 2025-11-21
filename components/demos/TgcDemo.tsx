
import React, { useState } from 'react';
import DemoSection from './DemoSection';

const TgcDemo: React.FC = () => {
    const [tgc, setTgc] = useState([3, 4, 5, 6, 7]); // 5 sliders

    const handleTgcChange = (index: number, value: number) => {
        const newTgc = [...tgc];
        newTgc[index] = value;
        setTgc(newTgc);
    };

    return (
        <div className="space-y-8">
            <DemoSection
                title="Time Gain Compensation (TGC)"
                description="Adjust the TGC sliders to compensate for attenuation and create a uniformly bright image from top to bottom. Each slider controls the gain at a specific depth."
            >
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="h-96 w-full lg:w-3/4 bg-gray-800 rounded-xl relative overflow-hidden">
                        {/* Image layers */}
                        {tgc.map((gain, index) => (
                            <div
                                key={index}
                                className="absolute left-0 w-full h-1/5 transition-all duration-200"
                                style={{
                                    top: `${index * 20}%`,
                                    backgroundColor: `rgba(255, 255, 255, ${gain / 20 * (1 - index*0.15)})`
                                }}
                            />
                        ))}
                    </div>
                    <div className="w-full lg:w-1/4 flex justify-around items-center bg-gray-900/50 p-4 rounded-xl">
                        {tgc.map((gain, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={gain}
                                    onChange={(e) => handleTgcChange(index, Number(e.target.value))}
                                    className="w-16 h-48 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-black/25 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-400"
                                    style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </DemoSection>
        </div>
    );
};

export default TgcDemo;
