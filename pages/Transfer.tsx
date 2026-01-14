
import React, { useState } from 'react';
import { Send, Users, Globe, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBanking } from '../context/BankingContext';

const Transfer: React.FC = () => {
  const { performTransfer, balance } = useBanking();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }
    
    if (numAmount > balance) {
      setError('Insufficient funds for this transfer.');
      return;
    }

    setError('');
    setStep(2);
    const success = await performTransfer(recipient, numAmount, note);
    if (success) {
      setStep(3);
    } else {
      setError('Transfer failed. Please try again.');
      setStep(1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in duration-300">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Transfer Funds</h1>
        <p className="text-slate-500">Send money instantly to anyone, anywhere.</p>
      </div>

      {step === 1 && (
        <form onSubmit={handleTransfer} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Recipient Email or Account</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  required
                  placeholder="name@email.com or #12345678"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">$</span>
                <input 
                  type="number" 
                  required
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl text-3xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Available balance: {balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Note (Optional)</label>
              <textarea 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-20"
                placeholder="What is this for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
          >
            <Send className="w-5 h-5" />
            Send Money Now
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-bold text-slate-900">Processing Transfer...</h2>
          <p className="text-slate-500">Verifying security protocols and recipient information.</p>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Success!</h2>
            <p className="text-slate-500">You've successfully sent <span className="font-bold text-slate-900">${amount}</span> to <span className="font-bold text-slate-900">{recipient}</span>.</p>
          </div>
          <div className="pt-6">
            <button 
              onClick={() => { setStep(1); setAmount(''); setRecipient(''); setNote(''); }}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              Make Another Transfer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfer;
