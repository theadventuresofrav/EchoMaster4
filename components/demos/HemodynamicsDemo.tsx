
import React, { useState, useMemo } from 'react';
import DemoSection from './DemoSection';

const HemodynamicsDemo: React.FC = () => {
    const [stenosis, setStenosis] = useState(50); // % diameter reduction

    const { preStenosis, atStenosis, postStenosis } = useMemo(() => {
        const pre = { velocity: 50, pressure: 120 };
        const stenosisRatio = 1 - (stenosis / 100);
        const at = {
            velocity: pre.velocity / stenosisRatio,
            pressure: pre.pressure - 0.5 * 1.06 * Math.pow(pre.velocity / stenosisRatio / 100, 2) // Simplified Bernoulli
        };
        const post = {
            velocity: pre.velocity * 1.2, // Turbulence
            pressure: pre.pressure * 0.95
        };
        return { preStenosis: pre, atStenosis: at, postStenosis: post };
    }, [stenosis]);

    const vesselHeight = 100;
    const stenosisHeight = vesselHeight * (1 - stenosis / 100);

    return (
        <div className="space-y-8">
            <DemoSection
                title="Hemodynamics in a Stenosis"
                description="Adjust the severity of the stenosis and observe the effects on blood flow velocity and pressure, demonstrating the Continuity Rule and the Bernoulli Effect."
            >
                <div>
                    <label className="block text-white/80 mb-2">Stenosis Severity (% Diameter Reduction)</label>
                    <input
                        type="range"
                        min="0"
                        max="90"
                        value={stenosis}
                        onChange={(e) => setStenosis(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                    />
                    <div className="text-center mt-2 font-mono text-lg text-yellow-400">{stenosis}%</div>
                </div>

                <div className="mt-6 h-48 bg-gray-800/50 rounded-xl p-4 relative">
                     {/* Vessel shape */}
                    <div className="absolute left-0 top-1/2 w-full h-px -translate-y-[50px] bg-white/30" />
                    <div className="absolute left-1/3 top-1/2 w-1/3 h-px bg-white/30 transition-all duration-300" style={{transform: `translateY(-${stenosisHeight/2}px)`}}/>
                    <div className="absolute left-1/3 top-1/2 w-1/3 h-px bg-white/30 transition-all duration-300" style={{transform: `translateY(${stenosisHeight/2}px)`}}/>
                    <div className="absolute left-0 top-1/2 w-full h-px translate-y-[50px] bg-white/30" />
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-white/10 p-4 rounded-lg">
                        <h3 className="font-bold text-lg mb-2">Pre-Stenosis</h3>
                        <p className="text-sm text-white/70">Velocity: <span className="font-mono text-xl text-yellow-300">{preStenosis.velocity.toFixed(0)} cm/s</span></p>
                        <p className="text-sm text-white/70">Pressure: <span className="font-mono text-xl text-yellow-300">{preStenosis.pressure.toFixed(0)} mmHg</span></p>
                    </div>
                     <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-400">
                        <h3 className="font-bold text-lg mb-2 text-yellow-200">At Stenosis</h3>
                        <p className="text-sm text-white/70">Velocity: <span className="font-mono text-xl text-yellow-300">{atStenosis.velocity.toFixed(0)} cm/s</span></p>
                        <p className="text-sm text-white/70">Pressure: <span className="font-mono text-xl text-yellow-300">{atStenosis.pressure.toFixed(0)} mmHg</span></p>
                    </div>
                     <div className="bg-white/10 p-4 rounded-lg">
                        <h3 className="font-bold text-lg mb-2">Post-Stenosis</h3>
                        <p className="text-sm text-white/70">Velocity: <span className="font-mono text-xl text-yellow-300">{postStenosis.velocity.toFixed(0)} cm/s</span></p>
                        <p className="text-sm text-white/70">Pressure: <span className="font-mono text-xl text-yellow-300">{postStenosis.pressure.toFixed(0)} mmHg</span></p>
                    </div>
                </div>
            </DemoSection>
        </div>
    );
};

export default HemodynamicsDemo;
