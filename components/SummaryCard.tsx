
import React from 'react';
import { Settlement } from '../types';

interface SummaryCardProps {
  settlements: Settlement[];
}

const ArrowRightIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
    </svg>
);


const SummaryCard: React.FC<SummaryCardProps> = ({ settlements }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Settlement Plan</h3>
      {settlements.length === 0 ? (
        <p className="text-slate-500 text-center py-4">All expenses are settled!</p>
      ) : (
        <ul className="space-y-4">
          {settlements.map((settlement, index) => (
            <li key={index} className="bg-slate-50 p-4 rounded-lg flex items-center justify-between transition hover:bg-slate-100">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-800 text-lg w-24 truncate">{settlement.from}</span>
                <ArrowRightIcon className="h-6 w-6 text-sky-500" />
                <span className="font-bold text-slate-800 text-lg w-24 truncate">{settlement.to}</span>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">
                  {settlement.amount.toLocaleString('en-SG', { style: 'currency', currency: 'SGD' })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SummaryCard;
