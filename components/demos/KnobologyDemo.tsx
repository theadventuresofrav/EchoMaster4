
import React, { useState, useMemo } from 'react';
import DemoSection from './DemoSection';

const KnobologyDemo: React.FC = () => {
  // State for all our controls
  const [overallGain, setOverallGain] = useState(50); // 0-100
  const [dynamicRange, setDynamicRange] = useState(70); // 40-120 dB
  const [tgc, setTgc] = useState([4, 5, 6, 7, 8]); // 5 sliders, 0-10
  const [focusPos, setFocusPos] = useState(50); // 0-100% of depth
  const [depth, setDepth] = useState(12); // cm

  const handleTgcChange = (index: number, value: number) => {
    const newTgc = [...tgc];
    newTgc[index] = value;
    setTgc(newTgc);
  };
  
  // Memoize computed styles for performance
  const imageStyle = useMemo(() => {
    const brightness = 0.5 + overallGain / 100;
    const contrast = 1.5 - (dynamicRange - 40) / 100;
    return {
      filter: `brightness(${brightness}) contrast(${contrast})`,
    };
  }, [overallGain, dynamicRange]);

  const tgcGradients = useMemo(() => {
    return tgc.map((gain, index) => {
      const pos = (index + 0.5) * (100 / tgc.length);
      const intensity = gain / 20; // scale gain to a reasonable opacity
      return `radial-gradient(circle at 50% ${pos}%, rgba(255,255,255,${intensity}) 0%, transparent 40%)`;
    }).join(',');
  }, [tgc]);
  
  const focusBlur = useMemo(() => {
    const focusZoneSize = 25; // % of depth
    return Array.from({ length: 5 }).map((_, i) => {
        const zoneCenter = (i + 0.5) * 20;
        const distFromFocus = Math.abs(zoneCenter - focusPos);
        const blurAmount = Math.max(0, (distFromFocus - focusZoneSize/2) / 20);
        return { blur: `${blurAmount}px` };
    });
  }, [focusPos]);
  
  return (
    <div className="space-y-8">
      <DemoSection
        title="Virtual Ultrasound Console"
        description="Welcome to the Knobology lab. Adjust the primary imaging controls on the console to optimize the phantom image. A well-optimized image is uniformly bright with the highest possible resolution at the area of interest."
      >
        <div className="flex flex-col xl:flex-row gap-4 bg-gray-900/50 p-4 rounded-2xl border border-white/10">
          {/* Image Display */}
          <div className="flex-grow h-[60vh] bg-gray-700 rounded-xl p-2 relative overflow-hidden">
            <div 
              className="w-full h-full bg-gray-700 bg-cover bg-center transition-all duration-100"
              style={{...imageStyle, backgroundImage: "url('https://picsum.photos/seed/ultrasound/800/600')"}}
            >
                {/* Phantom Objects with Focus effect */}
                {Array.from({length: 5}).map((_, i) => (
                    <div key={i} className="absolute left-1/2 -translate-x-1/2 w-16 h-16 bg-gray-500/30 rounded-full"
                    style={{
                        top: `calc(${i * 20 + 5}% - 32px)`,
                        filter: `blur(${focusBlur[i].blur})`,
                        transition: 'filter 0.3s ease'
                    }}>
                        <div className="w-4 h-4 bg-gray-300/30 rounded-full m-2"></div>
                    </div>
                ))}

              {/* TGC Overlay */}
              <div className="absolute inset-0" style={{ backgroundImage: tgcGradients }} />
            </div>

            {/* Focus Indicator */}
            <div className="absolute left-0 w-2 h-full top-0">
                <div className="absolute right-0 w-2 h-2 bg-yellow-400 -mr-2 -mt-1 transition-all duration-300" style={{top: `${focusPos}%`}}>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-yellow-400"></div>
                </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="xl:w-[400px] bg-gray-800/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-4">
               {/* GAIN & DR */}
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-2 bg-black/20 rounded-lg">
                    <label className="font-bold text-sm mb-2">GAIN</label>
                    <input type="range" min="0" max="100" value={overallGain} onChange={e => setOverallGain(Number(e.target.value))} className="w-20 h-20 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:bg-gray-600 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-400" />
                    <span className="font-mono text-lg">{overallGain}</span>
                </div>
                 <div className="flex flex-col items-center p-2 bg-black/20 rounded-lg">
                    <label className="font-bold text-sm mb-2">D.RANGE</label>
                    <input type="range" min="40" max="120" value={dynamicRange} onChange={e => setDynamicRange(Number(e.target.value))} className="w-20 h-20 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:bg-gray-600 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-400" />
                    <span className="font-mono text-lg">{dynamicRange}dB</span>
                </div>
              </div>
              
              {/* DEPTH & FOCUS */}
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div className="p-2 bg-black/20 rounded-lg text-center">
                    <label className="font-bold text-sm mb-2">DEPTH</label>
                    <div className="flex items-center justify-center gap-2">
                         <button onClick={() => setDepth(d => Math.max(4, d-1))} className="w-8 h-8 rounded-full bg-gray-600">-</button>
                         <span className="font-mono text-lg w-12 text-center">{depth}cm</span>
                         <button onClick={() => setDepth(d => Math.min(20, d+1))} className="w-8 h-8 rounded-full bg-gray-600">+</button>
                    </div>
                </div>
                <div className="p-2 bg-black/20 rounded-lg text-center">
                    <label className="font-bold text-sm mb-2">FOCUS</label>
                    <div className="flex items-center justify-center gap-2">
                         <button onClick={() => setFocusPos(p => Math.max(0, p-5))} className="w-8 h-8 rounded-full bg-gray-600">▲</button>
                         <span className="font-mono text-lg w-12 text-center">{focusPos}%</span>
                         <button onClick={() => setFocusPos(p => Math.min(100, p+5))} className="w-8 h-8 rounded-full bg-gray-600">▼</button>
                    </div>
                </div>
              </div>
            </div>
            
             {/* TGC */}
            <div className="mt-4">
                <label className="font-bold text-center block mb-2 text-sm">TGC</label>
                <div className="bg-black/20 p-2 rounded-lg flex justify-around items-center">
                    {tgc.map((gain, index) => (
                        <div key={index} className="h-48">
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={gain}
                                onChange={(e) => handleTgcChange(index, Number(e.target.value))}
                                className="w-full h-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:w-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:rounded-md [&::-webkit-slider-thumb]:bg-yellow-400"
                                style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                            />
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </DemoSection>
    </div>
  );
};

export default KnobologyDemo;
