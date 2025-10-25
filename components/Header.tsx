
import React from 'react';

interface HeaderProps {
  totalSpent: number;
}

const Header: React.FC<HeaderProps> = ({ totalSpent }) => {
  return (
    <header className="bg-white shadow-md rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">TripSplit</h1>
          <p className="text-slate-500">Your trip's expense summary</p>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-sm">Total Trip Cost</p>
          <p className="text-3xl font-bold text-sky-600">
            {totalSpent.toLocaleString('en-SG', { style: 'currency', currency: 'SGD' })}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
