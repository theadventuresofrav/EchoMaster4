
import React from 'react';
import { DemoId } from '../types';
import { COURSE_MODULES } from '../constants';

// Import all demo components
import WavesDemo from './demos/WavesDemo';
import TransducersDemo from './demos/TransducersDemo';
import DopplerDemo from './demos/DopplerDemo';
import PulsedWaveDemo from './demos/PulsedWaveDemo';
import ArtifactsDemo from './demos/ArtifactsDemo';
import HemodynamicsDemo from './demos/HemodynamicsDemo';
import QualityAssuranceDemo from './demos/QualityAssuranceDemo';
import ResolutionDemo from './demos/ResolutionDemo';
import HarmonicsDemo from './demos/HarmonicsDemo';
import ContrastAgentsDemo from './demos/ContrastAgentsDemo';
import SafetyDemo from './demos/SafetyDemo';
import TgcDemo from './demos/TgcDemo';
import DynamicRangeDemo from './demos/DynamicRangeDemo';
import ProcessingDemo from './demos/ProcessingDemo';
import StudyGuideDemo from './demos/StudyGuideDemo';
import ElastographyDemo from './demos/ElastographyDemo';
import ThreeDDemo from './demos/ThreeDDemo';
import MModeDemo from './demos/MModeDemo';
import AdvancedArtifactsDemo from './demos/AdvancedArtifactsDemo';
import KnobologyDemo from './demos/KnobologyDemo';
import BiomedicalPhysicsDemo from './demos/BiomedicalPhysicsDemo';
import AbdominalDemo from './demos/AbdominalDemo';
import VascularDemo from './demos/VascularDemo';
import MSKDemo from './demos/MSKDemo';
import CardiacDemo from './demos/CardiacDemo';
import ComingSoonDemo from './demos/ComingSoonDemo';
import JeopardyDemo from './demos/JeopardyDemo';
import SpiMockExamDemo from './demos/SpiMockExamDemo';
import CourseDetailDemo from './demos/CourseDetailDemo';
import ClinicalCaseDemo from './demos/ClinicalCaseDemo';
import EscapeRoomDemo from './demos/EscapeRoomDemo';
import CrosswordDemo from './demos/CrosswordDemo';
import BingoDemo from './demos/BingoDemo';
import PersonalizedStudyTool from './demos/PersonalizedStudyTool';

interface ModuleViewProps {
  moduleId: DemoId;
  onClose: () => void;
}

const ModuleView: React.FC<ModuleViewProps> = ({ moduleId, onClose }) => {
  const moduleInfo = COURSE_MODULES.find(m => m.id === moduleId);

  if (!moduleInfo) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-red-500 font-bold text-2xl">Module not found.</h2>
        <button onClick={onClose} className="mt-4 text-sm bg-white/10 text-white px-4 py-2 rounded-lg">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const renderDemoComponent = () => {
    switch (moduleId) {
        case 'waves': return <WavesDemo />;
        case 'transducers': return <TransducersDemo />;
        case 'doppler': return <DopplerDemo />;
        case 'pulsed': return <PulsedWaveDemo />;
        case 'tgc': return <TgcDemo />;
        case 'dynamic_range': return <DynamicRangeDemo />;
        case 'processing': return <ProcessingDemo />;
        case 'artifacts': return <ArtifactsDemo />;
        case 'safety': return <SafetyDemo />;
        case 'hemodynamics': return <HemodynamicsDemo />;
        case 'qa': return <QualityAssuranceDemo />;
        case 'resolution': return <ResolutionDemo />;
        case 'harmonics': return <HarmonicsDemo />;
        case 'contrast_agents': return <ContrastAgentsDemo />;
        case 'study_guide': return <StudyGuideDemo />;
        case 'elastography': return <ElastographyDemo />;
        case '3d_4d': return <ThreeDDemo />;
        case 'm_mode': return <MModeDemo />;
        case 'advanced_artifacts': return <AdvancedArtifactsDemo />;
        case 'knobology': return <KnobologyDemo />;
        case 'biomedical_physics': return <BiomedicalPhysicsDemo />;
        case 'abdominal': return <AbdominalDemo />;
        case 'vascular': return <VascularDemo />;
        case 'msk': return <MSKDemo />;
        case 'cardiac': return <CardiacDemo />;
        case 'jeopardy': return <JeopardyDemo />;
        case 'spi_mock_exam': return <SpiMockExamDemo />;
        case 'course_detail': return <CourseDetailDemo />;
        case 'clinical_case_simulator': return <ClinicalCaseDemo />;
        case 'escape_room': return <EscapeRoomDemo />;
        case 'crossword': return <CrosswordDemo />;
        case 'bingo': return <BingoDemo />;
        case 'personalized_study': return <PersonalizedStudyTool />;
        default: return <ComingSoonDemo moduleName={moduleInfo.title} />;
    }
  };

  return (
    <div className="animate-fade-in p-4 sm:p-8">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                {moduleInfo.title}
            </h1>
            <button
                onClick={onClose}
                className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-white/20"
            >
                &times; Close
            </button>
        </div>
        <div className="demo-content">
            {renderDemoComponent()}
        </div>
    </div>
  );
};

export default ModuleView;