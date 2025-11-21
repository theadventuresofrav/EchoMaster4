
import React, { useState, useMemo } from 'react';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

const TISSUES = [
  { name: 'Air', speed: 330 },
  { name: 'Fat', speed: 1450 },
  { name: 'Soft Tissue (Avg)', speed: 1540 },
  { name: 'Blood', speed: 1570 },
  { name: 'Muscle', speed: 1580 },
  { name: 'Bone', speed: 4080 },
];

const WavesDemo: React.FC = () => {
  const [frequency, setFrequency] = useState(5); // MHz
  const [tissue, setTissue] = useState(TISSUES[2]); // Default to Soft Tissue

  const wavelength = useMemo(() => {
    // speed (m/s) / frequency (Hz)
    return tissue.speed / (frequency * 1_000_000); // meters
  }, [tissue, frequency]);

  const wavelengthInMicroMeters = (wavelength * 1_000_000).toFixed(2);

  return (
    <div className="space-y-8">
      <DemoSection
        title="Interactive Wave Simulator"
        description="Adjust the transducer frequency and the tissue type to see how it affects the sound wave's properties. Notice the inverse relationship between frequency and wavelength."
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Controls */}
          <div className="w-full lg:w-1/3 space-y-4">
            <div>
              <label className="block text-white/80 mb-2">Frequency (MHz)</label>
              <input
                type="range"
                min="2"
                max="12"
                step="0.5"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
              <div className="text-center mt-2 font-mono text-lg text-yellow-400">{frequency.toFixed(1)} MHz</div>
            </div>
            <div>
              <label className="block text-white/80 mb-2">Tissue Medium</label>
              <div className="grid grid-cols-2 gap-2">
                {TISSUES.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setTissue(t)}
                    className={`p-2 rounded-lg text-sm font-semibold transition-colors ${
                      tissue.name === t.name ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Visualization */}
          <div className="w-full lg:w-2/3 h-80 bg-gray-800/50 rounded-xl p-4 flex flex-col justify-center items-center relative">
              <p className="absolute top-2 left-3 text-sm font-bold text-white/70">Propagation Speed: <span className="text-yellow-300">{tissue.speed} m/s</span></p>
              <p className="absolute top-8 left-3 text-sm font-bold text-white/70">Wavelength (λ): <span className="text-yellow-300">{wavelengthInMicroMeters} µm</span></p>

              <svg width="100%" height="50%" viewBox="0 0 300 100">
                  <path 
                      d={`M0 50 
                          C 37.5 0, 37.5 100, 75 50 
                          S 112.5 0, 150 50
                          S 187.5 100, 225 50
                          S 262.5 0, 300 50`}
                      stroke="#f97316"
                      strokeWidth="3"
                      fill="none"
                      style={{
                          strokeDasharray: 300,
                          strokeDashoffset: 0,
                          transformOrigin: 'center',
                          transition: 'all 0.3s ease-in-out',
                          transform: `scaleX(${1 / (wavelength * 1000)})`
                      }}
                  />
              </svg>
              <div className="w-full text-center text-xs text-white/50 mt-4">Wave visualization is schematic to show wavelength changes</div>
          </div>
        </div>
      </DemoSection>
    </div>
  );
};

export default WavesDemo;
