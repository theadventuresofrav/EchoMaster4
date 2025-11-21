
import React, { useState, useMemo } from 'react';
import DemoSection from './DemoSection';

const ResolutionDemo: React.FC = () => {
    const [spl, setSpl] = useState(0.5); // Spatial Pulse Length in mm
    const [beamWidth, setBeamWidth] = useState(2.0); // Beam Width in mm

    const axialResolution = useMemo(() => spl / 2, [spl]);
    const lateralResolution = useMemo(() => beamWidth, [beamWidth]);

    return (
        <div className="space-y-8">
            <DemoSection
                title="Axial vs. Lateral Resolution Simulator"
                description="Adjust the Spatial Pulse Length (SPL) to see its effect on Axial Resolution, and the Beam Width for Lateral Resolution. Understand why a smaller value is better for both."
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Axial Resolution */}
                    <div className="bg-white/5 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-center mb-4">Axial Resolution (LARRD)</h3>
                        <div className="h-64 flex flex-col items-center justify-center relative">
                            {/* Pulse */}
                            <div className="absolute w-2 bg-orange-500 rounded-full transition-all duration-200" style={{height: `${spl*20}px`}}/>
                            {/* Targets */}
                            <div className="absolute w-4 h-4 bg-cyan-400 rounded-full" style={{transform: 'translateY(-15px)'}}/>
                            <div className="absolute w-4 h-4 bg-cyan-400 rounded-full" style={{transform: `translateY(${axialResolution > 0.4 ? 10 : 20}px)`}}/>
                        </div>
                        <label>SPL (mm): {spl.toFixed(1)}</label>
                        <input type="range" min="0.2" max="2.0" step="0.1" value={spl} onChange={e => setSpl(Number(e.target.value))} className="w-full accent-orange-500"/>
                        <p className="text-center text-xl font-bold mt-2">Resolution: <span className="text-orange-400">{axialResolution.toFixed(2)} mm</span></p>
                        <p className="text-center text-sm font-bold mt-2">{axialResolution < 0.4 ? "RESOLVED" : "NOT RESOLVED"}</p>
                    </div>

                    {/* Lateral Resolution */}
                     <div className="bg-white/5 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-center mb-4">Lateral Resolution (LATA)</h3>
                        <div className="h-64 flex items-center justify-center relative">
                             {/* Beam */}
                            <div className="absolute h-40 bg-yellow-400/20 rounded-full transition-all duration-200" style={{width: `${beamWidth*10}px`}}/>
                             {/* Targets */}
                            <div className="absolute w-4 h-4 bg-cyan-400 rounded-full" style={{transform: 'translateX(-15px)'}}/>
                            <div className="absolute w-4 h-4 bg-cyan-400 rounded-full" style={{transform: `translateX(${lateralResolution > 2.5 ? 10 : 20}px)`}}/>
                        </div>
                        <label>Beam Width (mm): {beamWidth.toFixed(1)}</label>
                        <input type="range" min="1.0" max="5.0" step="0.1" value={beamWidth} onChange={e => setBeamWidth(Number(e.target.value))} className="w-full accent-yellow-400"/>
                        <p className="text-center text-xl font-bold mt-2">Resolution: <span className="text-yellow-400">{lateralResolution.toFixed(2)} mm</span></p>
                         <p className="text-center text-sm font-bold mt-2">{lateralResolution < 2.5 ? "RESOLVED" : "NOT RESOLVED"}</p>
                    </div>
                </div>
            </DemoSection>
        </div>
    );
};

export default ResolutionDemo;
