
import React from 'react';

interface CurrencyConverterProps {
  jpyToSgdRate: number;
  setJpyToSgdRate: (rate: number) => void;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ jpyToSgdRate, setJpyToSgdRate }) => {
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setJpyToSgdRate(value);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-slate-700 mb-3">Exchange Rate</h3>
      <div className="flex items-center space-x-3">
        <span className="font-medium text-slate-600">1 SGD =</span>
        <input
          type="number"
          value={jpyToSgdRate}
          onChange={handleRateChange}
          className="w-28 p-2 text-lg font-semibold text-slate-800 bg-slate-100 rounded-md border-2 border-transparent focus:border-sky-500 focus:outline-none focus:ring-0 transition"
        />
        <span className="font-medium text-slate-600">JPY</span>
      </div>
      <p className="text-xs text-slate-400 mt-2">Update the rate to recalculate totals.</p>
    </div>
  );
};

export default CurrencyConverter;
