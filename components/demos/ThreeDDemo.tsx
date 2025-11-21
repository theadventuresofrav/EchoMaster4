
import React, { useState, useMemo } from 'react';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';


// --- Knowledge Check Component ---
const KnowledgeCheck: React.FC<{
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}> = ({ question, options, correctAnswer, explanation }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (option: string) => {
    if (showResult) return;
    setSelected(option);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelected(null);
    setShowResult(false);
  }

  return (
    <DemoSection title="🧠 Knowledge Check" description="Test your understanding of the concepts presented in this module.">
      <p className="font-semibold text-white/90 mb-4">{question}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map(option => {
          const isCorrect = option === correctAnswer;
          const isSelected = option === selected;
          let buttonClass = 'bg-white/10 border border-white/20 text-white hover:bg-white/20';
          if (showResult) {
            if (isCorrect) buttonClass = 'bg-green-500/80 border-green-400 text-white';
            else if (isSelected) buttonClass = 'bg-red-500/80 border-red-400 text-white';
            else buttonClass = 'bg-white/10 border border-white/20 text-white opacity-50';
          }
          return (
            <button key={option} onClick={() => handleSelect(option)} disabled={showResult} className={`p-3 rounded-lg text-left transition-all duration-300 w-full ${buttonClass}`}>
              {option}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg animate-fade-in">
          <p className="font-bold text-yellow-400">Explanation:</p>
          <p className="text-white/80 mt-2 text-sm">{explanation}</p>
           <div className="text-right mt-2">
            <button onClick={handleReset} className="text-xs bg-white/10 text-white px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors">Try another question</button>
          </div>
        </div>
      )}
    </DemoSection>
  );
};


// --- Section 1: 3D Data Acquisition ---
const DataAcquisitionSection: React.FC = () => {
    const [isSweeping, setIsSweeping] = useState(false);
    return (
        <DemoSection
            title="3D Data Acquisition"
            description="A 3D volume is created by acquiring multiple 2D slices. This can be done with a mechanical transducer sweeping back and forth. Click to initiate the volume sweep."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-80 bg-gray-800/50 rounded-xl p-4 flex items-center justify-center" style={{ perspective: '800px' }}>
                    <div className="relative w-56 h-56" style={{ transform: 'rotateX(60deg)', transformStyle: 'preserve-3d' }}>
                        {/* Static Volume Box */}
                        <div className="absolute w-full h-full border border-dashed border-gray-500">
                             {/* Fetal head placeholder */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-yellow-400/20" />
                        </div>
                        {/* Sweeping Plane */}
                        {isSweeping && (
                            <div key={Date.now()} className="absolute w-48 h-48 bg-yellow-400/50 border border-yellow-300" style={{ animation: 'sweep-3d 3s ease-in-out forwards' }} onAnimationEnd={() => setIsSweeping(false)}/>
                        )}
                    </div>
                </div>
                <div className="w-full md:w-1/3 flex items-center justify-center">
                    <ControlButton onClick={() => setIsSweeping(true)} disabled={isSweeping}>
                        {isSweeping ? 'Acquiring...' : 'Start Volume Sweep'}
                    </ControlButton>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 2: Volume Rendering ---
const VolumeRenderingSection: React.FC = () => {
    const [renderMode, setRenderMode] = useState<'surface' | 'mpr'>('surface');

    // State for Surface Render
    const [threshold, setThreshold] = useState(50);

    // State for MPR
    const [slices, setSlices] = useState({ x: 50, y: 50, z: 50 }); // in %

    const handleSliceChange = (axis: 'x' | 'y' | 'z', value: number) => {
        setSlices(prev => ({ ...prev, [axis]: value }));
    };

    // Sphere data for MPR
    const sphere = { cx: 50, cy: 50, cz: 50, r: 35 }; // center and radius in %

    const renderSliceContent = (axis: 'x' | 'y' | 'z') => {
        const slicePos = slices[axis];
        const center = sphere[axis === 'x' ? 'cx' : axis === 'y' ? 'cy' : 'cz'];
        const radius = sphere.r;

        const distFromCenter = Math.abs(slicePos - center);

        if (distFromCenter >= radius) {
            return null; // Slice is outside the sphere
        }

        const circleRadius = Math.sqrt(radius * radius - distFromCenter * distFromCenter);
        const diameterPercent = (circleRadius * 2);

        return (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/80"
                 style={{ width: `${diameterPercent}%`, height: `${diameterPercent}%` }} />
        );
    };


    return (
        <DemoSection
            title="Interactive Volume Rendering & MPR"
            description="Once the data volume is acquired, it can be visualized. Surface rendering shows the 'outside', while Multi-Planar Reconstruction (MPR) lets you slice through the volume."
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visualization Pane */}
                <div className="lg:col-span-2 min-h-[400px] bg-gray-800/50 rounded-xl p-4 flex items-center justify-center">
                   {renderMode === 'surface' && (
                        <div className="w-full h-80 flex items-center justify-center" style={{ perspective: '400px' }}>
                            <div className="relative w-40 h-40" style={{ transform: 'rotateX(20deg) rotateY(-30deg)', transformStyle: 'preserve-3d' }}>
                                <div className="absolute w-40 h-40 rounded-full border border-gray-500 transition-opacity duration-300" style={{ opacity: Math.max(0, (threshold - 20) / 100) }} />
                                <div className="absolute w-28 h-28 rounded-full border border-yellow-500 top-6 left-6 transition-opacity duration-300" style={{ opacity: Math.max(0, (threshold - 50) / 80) }} />
                                <div className="absolute w-16 h-16 rounded-full bg-red-500/80 top-12 left-12 transition-opacity duration-300" style={{ opacity: Math.max(0, (threshold - 70) / 50) }} />
                            </div>
                        </div>
                    )}
                    {renderMode === 'mpr' && (
                        <div className="w-full flex flex-col md:flex-row gap-4 items-center">
                            <div className="w-full md:w-1/2 h-64 flex items-center justify-center" style={{ perspective: '600px' }}>
                                <div className="relative w-40 h-40" style={{ transform: 'rotateX(-20deg) rotateY(-30deg)', transformStyle: 'preserve-3d' }}>
                                    <div className="absolute w-full h-full border border-dashed border-gray-600"/>
                                    <div className="absolute w-28 h-28 rounded-full bg-yellow-400/10 top-6 left-6" style={{ transform: 'translateZ(6px)' }}/>
                                    <div className="absolute w-40 h-40 border-2 border-red-500/70" style={{ transform: `rotateY(90deg) translateZ(${slices.x / 100 * 40 - 20}px)` }} />
                                    <div className="absolute w-40 h-40 border-2 border-green-500/70" style={{ transform: `rotateX(90deg) translateZ(-${slices.y / 100 * 40 - 20}px)` }} />
                                    <div className="absolute w-40 h-40 border-2 border-blue-500/70" style={{ transform: `translateZ(${slices.z / 100 * 40 - 20}px)` }} />
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 grid grid-cols-2 gap-2">
                                <div className="bg-black/50 aspect-square rounded relative"><div className="absolute inset-0">{renderSliceContent('x')}</div><span className="absolute top-1 left-1 text-xs text-red-400">Sagittal</span></div>
                                <div className="bg-black/50 aspect-square rounded relative"><div className="absolute inset-0">{renderSliceContent('y')}</div><span className="absolute top-1 left-1 text-xs text-green-400">Coronal</span></div>
                                <div className="bg-black/50 aspect-square rounded col-span-2 relative"><div className="absolute inset-0">{renderSliceContent('z')}</div><span className="absolute top-1 left-1 text-xs text-blue-400">Axial</span></div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Controls Pane */}
                <div className="lg:col-span-1 flex flex-col justify-center">
                    <div className="flex flex-col gap-2">
                        <ControlButton onClick={() => setRenderMode('surface')} secondary={renderMode !== 'surface'}>Surface Render</ControlButton>
                        <ControlButton onClick={() => setRenderMode('mpr')} secondary={renderMode !== 'mpr'}>Multi-Planar (MPR)</ControlButton>
                    </div>

                    <div className="mt-4 bg-white/10 p-4 rounded-lg">
                        {renderMode === 'surface' && (
                            <div>
                                <label className="block text-white/80 mb-2">Opacity Threshold</label>
                                <input type="range" min="0" max="100" value={threshold} onChange={e => setThreshold(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                                <div className="text-center mt-2 font-mono text-lg text-yellow-400">{threshold}%</div>
                            </div>
                        )}
                        {renderMode === 'mpr' && (
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-red-400 font-semibold">Sagittal Slice (X)</label>
                                    <input type="range" min="0" max="100" value={slices.x} onChange={e => handleSliceChange('x', Number(e.target.value))} className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-400" />
                                </div>
                                <div>
                                    <label className="text-xs text-green-400 font-semibold">Coronal Slice (Y)</label>
                                    <input type="range" min="0" max="100" value={slices.y} onChange={e => handleSliceChange('y', Number(e.target.value))} className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-400" />
                                </div>
                                 <div>
                                    <label className="text-xs text-blue-400 font-semibold">Axial Slice (Z)</label>
                                    <input type="range" min="0" max="100" value={slices.z} onChange={e => handleSliceChange('z', Number(e.target.value))} className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-400" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 3: 4D Imaging ---
const FourDImagingSection: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    return (
        <DemoSection
            title="4D Imaging: Real-Time 3D"
            description="4D imaging is simply 3D imaging over time, creating a live, moving volume. The frame rate is determined by the system's ability to rapidly acquire and render volumes."
        >
            <div className="text-center">
                 <div className="h-64 w-64 mx-auto bg-gray-800/50 rounded-xl p-4 flex items-center justify-center" style={{ perspective: '400px' }}>
                     <div className={`relative w-32 h-32 ${isPlaying ? 'animate-pulse' : ''}`} style={{ transform: 'rotateX(20deg) rotateY(-30deg)', transformStyle: 'preserve-3d' }}>
                         <div className="absolute w-32 h-32 rounded-full border border-gray-500"/>
                         <div className="absolute w-24 h-24 rounded-full border border-yellow-500 top-4 left-4"/>
                         <div className="absolute w-12 h-12 rounded-full bg-red-500/80 top-10 left-10"/>
                     </div>
                 </div>
                <div className="mt-6">
                    <ControlButton onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? 'Pause 4D' : 'Play 4D'}
                    </ControlButton>
                </div>
            </div>
        </DemoSection>
    );
};

const ThreeDDemo: React.FC = () => {
    return (
        <div className="space-y-8">
            <DataAcquisitionSection />
            <VolumeRenderingSection />
            <FourDImagingSection />
            <KnowledgeCheck
                question="The technique of displaying orthogonal Axial, Sagittal, and Coronal planes from a 3D volume is known as:"
                options={["Surface Rendering", "Maximum Intensity Projection (MIP)", "Multi-Planar Reconstruction (MPR)", "Volume Averaging"]}
                correctAnswer="Multi-Planar Reconstruction (MPR)"
                explanation="MPR is a fundamental technique in 3D/4D imaging that allows the user to slice through the acquired data volume in any plane, most commonly the three orthogonal planes (axial, sagittal, coronal)."
            />
        </div>
    );
};

export default ThreeDDemo;
