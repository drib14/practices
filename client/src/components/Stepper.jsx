import React from 'react';

export default function Stepper({ currentStep, totalSteps = 3 }) {
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  return (
    <div className="stepper-container" aria-label="Registration Steps">
      <div className="stepper-line" aria-hidden="true"></div>
      <div 
        className="stepper-progress" 
        style={{ width: `${progressPercent}%` }} 
        aria-hidden="true"
      ></div>
      
      {[...Array(totalSteps)].map((_, i) => {
        const stepNum = i + 1;
        const isActive = currentStep === stepNum;
        const isCompleted = currentStep > stepNum;
        
        return (
          <div 
            key={stepNum} 
            className={`step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            aria-current={isActive ? 'step' : undefined}
          >
            {isCompleted ? <i className="fa-solid fa-check"></i> : stepNum}
          </div>
        );
      })}
    </div>
  );
}
