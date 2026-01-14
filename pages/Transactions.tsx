
import React, { useState } from 'react';
import { Search, Filter, Download, Coffee, ShoppingBag, Car, Wallet, Zap, ShieldCheck, CreditCard } from 'lucide-react';
import { useBanking } from '../context/BankingContext';

const getIconForCategory = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food & drink': return { icon: <Coffee className="w-5 h-5" />, color: 'bg-orange-100 text-orange-600' };
    case 'transport': return { icon: <Car className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' };
    case 'income': return { icon: <Wallet className="w-5 h-5" />, color: 'bg-emerald-100 text-emerald-600' };
    case 'shopping': return { icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' };
    case 'bills': return { icon: <Zap className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-600' };
    case 'finance': return { icon: <ShieldCheck className="w-5 h-5" />, color: 'bg-slate-100 text-slate-600' };
    default: return { icon: <CreditCard className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-600' };
  }
};

const Transactions: React.FC = () => {
  const { transactions, isLoading } = useBanking();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(tx => 
    tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading transactions...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Transaction History</h1>
          <p className="text-slate-500">View and manage your recent financial activities.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold transition-all">
          <Download className="w-4 h-4" />
          Export Statements
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
                const { icon, color } = getIconForCategory(tx.category);
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                          {icon}
                        </div>
                        <span className="font-semibold text-slate-900">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{tx.category}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Completed
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-sm text-slate-500">
          <p>Showing {filteredTransactions.length} results</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 bg-indigo-600 text-white border border-indigo-600 rounded-lg">1</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
