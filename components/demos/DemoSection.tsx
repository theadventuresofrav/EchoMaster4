
import React from 'react';
import NarratorControl from '../NarratorControl';

interface DemoSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const DemoSection: React.FC<DemoSectionProps> = ({ title, description, children }) => {
  // Combine title and description for a smoother natural reading flow
  const narrationText = `${title}. ${description}`;

  return (
    <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-4 sm:p-6 mb-8">
      <div className="flex justify-between items-start mb-4">
          <div>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-2">{title}</h2>
              <p className="text-sm sm:text-base text-white/60 max-w-3xl">{description}</p>
          </div>
          <div className="flex-shrink-0 ml-4">
              <NarratorControl text={narrationText} label="Explain" />
          </div>
      </div>
      <div className="w-full overflow-x-hidden mt-6">{children}</div>
    </div>
  );
};

export default DemoSection;
