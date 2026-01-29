
import React, { useState } from 'react';

const ROISimulator = () => {
  const [params, setParams] = useState({
    laborCost: 50000,
    efficiencyGain: 20,
    standardFee: 30000,
    customMultiplier: 1.4
  });

  const calculateROI = () => {
    const standardSavings = (params.laborCost * (params.efficiencyGain / 100)) - params.standardFee;
    const customSavings = (params.laborCost * ((params.efficiencyGain * params.customMultiplier) / 100)) - (params.standardFee * 1.5);
    return { standardSavings, customSavings };
  };

  const { standardSavings, customSavings } = calculateROI();

  return (
    <section id="roi-simulator" className="py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">ROI & ESG Simulator (The Closer)</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <h3 className="text-xl font-semibold text-primary">Simulation Variables</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Annual Labor Cost ($)</label>
                <input
                  type="number"
                  value={params.laborCost}
                  onChange={(e) => setParams({...params, laborCost: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Expected Efficiency Gain (%)</label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={params.efficiencyGain}
                  onChange={(e) => setParams({...params, efficiencyGain: parseInt(e.target.value)})}
                  className="w-full accent-primary"
                />
                <div className="text-right text-xs text-gray-500">{params.efficiencyGain}%</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <h4 className="font-bold text-green-800 mb-2">ESG ESG Impact (Simulated)</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• CO2 Reduction: {Math.round(params.efficiencyGain * 0.8)} tons/year</li>
                <li>• Energy Efficiency: +{Math.round(params.efficiencyGain * 1.2)}%</li>
                <li>• Waste Reduction: {Math.round(params.efficiencyGain * 0.5)}%</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2 bg-gray-50 p-8 rounded-xl flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-8 text-center">Standard vs. Nukle Custom ROI</h3>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center space-y-4">
                <div className="text-gray-500 font-medium">Standard Solution</div>
                <div className="h-48 flex items-end justify-center">
                  <div 
                    className="w-24 bg-gray-300 rounded-t-lg transition-all duration-500"
                    style={{ height: `${Math.max(10, (standardSavings / 50000) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-2xl font-bold text-gray-700">${Math.round(standardSavings).toLocaleString()}</div>
                <div className="text-xs text-gray-400">Net Savings / Year</div>
              </div>

              <div className="text-center space-y-4">
                <div className="text-primary font-bold">Nukle Custom SI</div>
                <div className="h-48 flex items-end justify-center">
                  <div 
                    className="w-24 bg-primary rounded-t-lg transition-all duration-500 relative"
                    style={{ height: `${Math.max(15, (customSavings / 50000) * 100)}%` }}
                  >
                    <div className="absolute -top-10 left-0 right-0 text-primary font-bold">+{Math.round((customSavings/standardSavings - 1) * 100)}%</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">${Math.round(customSavings).toLocaleString()}</div>
                <div className="text-xs text-gray-400">Net Savings / Year</div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-primary/10 rounded-lg text-center">
              <p className="text-primary font-medium">
                Custom SI yields <span className="font-bold">${Math.round(customSavings - standardSavings).toLocaleString()}</span> more profit annually.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROISimulator;
