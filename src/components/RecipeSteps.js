import React, { useState } from 'react';
import { ChefHat, Check } from 'lucide-react';

const RecipeSteps = ({ instructions }) => {
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const toggleStep = (index) => {
    const newCompletedSteps = new Set(completedSteps);
    if (newCompletedSteps.has(index)) {
      newCompletedSteps.delete(index);
    } else {
      newCompletedSteps.add(index);
    }
    setCompletedSteps(newCompletedSteps);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <ChefHat className="w-6 h-6 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-800">Instructions</h2>
      </div>

      {/* Steps list */}
      <ol className="space-y-4">
        {instructions.map((step, index) => (
          <li 
            key={index} 
            className="flex gap-4 group"
            onClick={() => toggleStep(index)}
          >
            {/* Step number/Checkbox */}
            <div className={`
              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              cursor-pointer transition-all duration-200
              ${completedSteps.has(index) 
                ? 'bg-green-500 text-white' 
                : 'bg-red-100 text-red-800'}
            `}>
              {completedSteps.has(index) ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="font-semibold">{index + 1}</span>
              )}
            </div>

            {/* Step text */}
            <div className={`
              flex-1 p-4 rounded-xl cursor-pointer transition-all duration-200
              ${completedSteps.has(index) 
                ? 'bg-green-50' 
                : 'bg-red-50 group-hover:bg-red-100'}
            `}>
              <p className={`
                leading-relaxed
                ${completedSteps.has(index) 
                  ? 'text-green-800' 
                  : 'text-gray-700'}
              `}>
                {step}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RecipeSteps;
