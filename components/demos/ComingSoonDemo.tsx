
import React from 'react';

interface ComingSoonDemoProps {
    moduleName: string;
}

const ComingSoonDemo: React.FC<ComingSoonDemoProps> = ({ moduleName }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center bg-gray-900/50 border border-white/10 rounded-2xl p-8">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-2">Coming Soon!</h2>
            <p className="text-white/80 text-lg">The interactive module for "{moduleName}" is under construction.</p>
            <p className="text-white/60 mt-2">We're building something amazing. Please check back later!</p>
        </div>
    );
};

export default ComingSoonDemo;
