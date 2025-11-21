import React, { useState, useEffect, useRef, useMemo } from 'react';
import DemoSection from './DemoSection';

const DopplerDemo: React.FC = () => {
    const [flowVelocity, setFlowVelocity] = useState(60); // cm/s
    const [dopplerAngle, setDopplerAngle] = useState(60); // degrees
    const [prf, setPrf] = useState(4000); // Hz (Scale)

    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const transmittedFrequency = 5_000_000; // 5 MHz
    const speedOfSound = 154000; // cm/s

    const dopplerShift = useMemo(() => {
        const angleInRadians = (dopplerAngle * Math.PI) / 180;
        const cosAngle = Math.cos(angleInRadians);
        return (2 * transmittedFrequency * flowVelocity * cosAngle) / speedOfSound;
    }, [flowVelocity, dopplerAngle]);

    const nyquistLimit = prf / 2;
    const isAliasing = Math.abs(dopplerShift) > nyquistLimit;

    // Ref to hold current values for the animation loop to avoid re-binding the effect
    const paramsRef = useRef({ dopplerShift, nyquistLimit });
    useEffect(() => {
        paramsRef.current = { dopplerShift, nyquistLimit };
    }, [dopplerShift, nyquistLimit]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Handle High DPI Displays
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;
        const baselineY = height / 2;

        // Initial black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        let animationId: number;
        let xPos = 0;

        const draw = () => {
            const { dopplerShift, nyquistLimit } = paramsRef.current;
            
            // "Sweeping" update: Clear a small bar ahead of the cursor
            ctx.fillStyle = '#000000';
            const clearWidth = 5;
            if (xPos + clearWidth < width) {
                 ctx.fillRect(xPos, 0, clearWidth, height);
            } else {
                 // Wrap around clear
                 ctx.fillRect(xPos, 0, width - xPos, height);
                 ctx.fillRect(0, 0, clearWidth - (width - xPos), height);
            }
            
            // Draw Baseline
            ctx.fillStyle = '#4b5563'; // gray-600
            ctx.fillRect(xPos, baselineY, 1, 1);
            
            // Draw Scale Markers (Top/Bottom limits)
            ctx.fillStyle = '#374151'; // gray-700
            ctx.fillRect(xPos, 0, 1, 2);
            ctx.fillRect(xPos, height-2, 1, 2);

            // Calculate Y position
            // Screen pixels per Hz = (half height) / Nyquist Limit
            const pixelsPerHz = (height / 2) / nyquistLimit;
            const shiftHz = dopplerShift;
            
            // Set color: Yellow for normal, Red/Orange for aliasing or warning
            ctx.strokeStyle = '#facc15'; // yellow-400
            if (Math.abs(shiftHz) > nyquistLimit) ctx.strokeStyle = '#ef4444'; // red-500
            
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            if (Math.abs(shiftHz) <= nyquistLimit) {
                // Normal plotting (No aliasing)
                // Negative shift (away) -> Below baseline (Y increases)
                // Positive shift (towards) -> Above baseline (Y decreases)
                const y = baselineY - (shiftHz * pixelsPerHz);
                ctx.moveTo(xPos, baselineY);
                ctx.lineTo(xPos, y);
            } else {
                // Aliasing Logic
                if (shiftHz > 0) {
                    // Positive aliasing (Wraps to bottom)
                    // 1. Draw from baseline to top (limit)
                    ctx.moveTo(xPos, baselineY);
                    ctx.lineTo(xPos, 0);
                    
                    // 2. Draw wrapped part from bottom up
                    const overflowHz = shiftHz - nyquistLimit;
                    // Wrapped frequency appears at -Nyquist + overflow
                    const wrappedFreq = -nyquistLimit + overflowHz;
                    const yWrapped = baselineY - (wrappedFreq * pixelsPerHz);
                    
                    ctx.moveTo(xPos, height);
                    ctx.lineTo(xPos, yWrapped);
                } else {
                    // Negative aliasing (Wraps to top)
                    // 1. Draw from baseline to bottom (limit)
                    ctx.moveTo(xPos, baselineY);
                    ctx.lineTo(xPos, height);
                    
                    // 2. Draw wrapped part from top down
                    const overflowHz = Math.abs(shiftHz) - nyquistLimit;
                    // Wrapped frequency appears at +Nyquist - overflow
                    const wrappedFreq = nyquistLimit - overflowHz;
                    const yWrapped = baselineY - (wrappedFreq * pixelsPerHz);
                    
                    ctx.moveTo(xPos, 0);
                    ctx.lineTo(xPos, yWrapped);
                }
            }
            ctx.stroke();

            // Draw Green Cursor Line
            ctx.fillStyle = '#10b981'; // green-500
            ctx.fillRect(xPos + 1, 0, 2, height);

            // Advance X Position
            xPos = (xPos + 1) % width;
            
            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
       <div className="space-y-8">
            <DemoSection
                title="Doppler Simulation: Spectral Waveform & Aliasing"
                description="Observe how Flow Velocity, Doppler Angle, and PRF (Scale) affect the spectral waveform. When the Doppler shift exceeds the Nyquist Limit (1/2 PRF), the waveform 'wraps around' to the opposite side of the baseline—a phenomenon called Aliasing."
            >
                 <div className="flex flex-col lg:flex-row gap-6">
                    {/* Spectral Display */}
                    <div className="w-full lg:w-2/3 bg-black rounded-xl border border-gray-700 relative overflow-hidden shadow-inner h-80">
                        <canvas 
                            ref={canvasRef}
                            className="w-full h-full block cursor-crosshair"
                        />
                        <div className="absolute top-2 left-2 text-xs font-mono text-green-500 pointer-events-none bg-black/50 px-1 rounded">
                             PRF: {prf} Hz <br/>
                             Nyquist: {nyquistLimit} Hz
                        </div>
                        {isAliasing && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-900/90 border border-red-500 text-white px-4 py-2 rounded animate-pulse font-bold pointer-events-none z-10">
                                ALIASING
                            </div>
                        )}
                        <div className="absolute bottom-2 right-2 text-xs text-white/50 pointer-events-none bg-black/50 px-1 rounded">
                            Doppler Shift: {dopplerShift.toFixed(0)} Hz
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="w-full lg:w-1/3 space-y-6 bg-gray-900/50 p-6 rounded-xl border border-white/10">
                        <div>
                            <label className="flex justify-between text-sm font-bold text-white/80 mb-2">
                                <span>Flow Velocity</span>
                                <span className="text-yellow-400">{flowVelocity} cm/s</span>
                            </label>
                            <input 
                                type="range" 
                                min="-200" 
                                max="200" 
                                value={flowVelocity}
                                onChange={(e) => setFlowVelocity(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                            />
                            <p className="text-xs text-white/40 mt-1">Speed of blood cells</p>
                        </div>

                        <div>
                            <label className="flex justify-between text-sm font-bold text-white/80 mb-2">
                                <span>Doppler Angle</span>
                                <span className="text-yellow-400">{dopplerAngle}°</span>
                            </label>
                            <input 
                                type="range" 
                                min="0" 
                                max="89" 
                                value={dopplerAngle}
                                onChange={(e) => setDopplerAngle(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                            />
                            <p className="text-xs text-white/50 mt-1">
                                {dopplerAngle > 60 ? <span className="text-red-400">Warning: Angle {'>'} 60° yields inaccurate velocities.</span> : "Keep angle ≤ 60° for accuracy."}
                            </p>
                        </div>

                        <div>
                             <label className="flex justify-between text-sm font-bold text-white/80 mb-2">
                                <span>PRF (Scale)</span>
                                <span className="text-yellow-400">{prf} Hz</span>
                            </label>
                            <input 
                                type="range" 
                                min="1000" 
                                max="10000" 
                                step="500"
                                value={prf}
                                onChange={(e) => setPrf(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-400"
                            />
                            <p className="text-xs text-white/50 mt-1">Increase Scale (PRF) to eliminate aliasing.</p>
                        </div>
                        
                        <div className="bg-white/5 p-3 rounded-lg text-xs text-white/60">
                            <strong className="text-yellow-400">Tip:</strong> Aliasing occurs when the Doppler shift exceeds the Nyquist Limit (PRF / 2). To fix it, you can increase the PRF (Scale), lower the frequency, or adjust the angle/baseline.
                        </div>
                    </div>
                </div>
            </DemoSection>
       </div>
    );
}

export default DopplerDemo;