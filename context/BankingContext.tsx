
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, AccountStats } from '../types';

interface BankingContextType {
  balance: number;
  transactions: Transaction[];
  stats: AccountStats;
  performTransfer: (recipient: string, amount: number, note: string) => Promise<boolean>;
  isLoading: boolean;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

const INITIAL_BALANCE = 12450.00;

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'Starbucks Coffee', category: 'Food & Drink', amount: -12.50, date: new Date().toISOString(), type: 'DEBIT' },
  { id: '2', description: 'Shell Gas Station', category: 'Transport', amount: -55.00, date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), type: 'DEBIT' },
  { id: '3', description: 'Monthly Salary Deposit', category: 'Income', amount: 4500.00, date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), type: 'CREDIT' },
  { id: '4', description: 'Apple Online Store', category: 'Shopping', amount: -1299.00, date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), type: 'DEBIT' },
  { id: '5', description: 'Utility Bill - Power & Water', category: 'Bills', amount: -210.40, date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), type: 'DEBIT' },
];

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(INITIAL_BALANCE);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedBalance = localStorage.getItem('nova_balance');
    const savedTx = localStorage.getItem('nova_transactions');
    
    if (savedBalance !== null) {
      setBalance(parseFloat(savedBalance));
    }
    
    if (savedTx) {
      try {
        setTransactions(JSON.parse(savedTx));
      } catch (e) {
        setTransactions(INITIAL_TRANSACTIONS);
      }
    } else {
      setTransactions(INITIAL_TRANSACTIONS);
    }
    
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('nova_balance', balance.toString());
      localStorage.setItem('nova_transactions', JSON.stringify(transactions));
    }
  }, [balance, transactions, isLoading]);

  const stats: AccountStats = {
    totalBalance: balance,
    monthlyIncome: transactions
      .filter(t => t.type === 'CREDIT' && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((acc, t) => acc + t.amount, 0),
    monthlyExpenses: Math.abs(transactions
      .filter(t => t.type === 'DEBIT' && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((acc, t) => acc + t.amount, 0)),
    savingsRate: 45.2,
  };

  const performTransfer = async (recipient: string, amount: number, note: string) => {
    if (amount <= 0 || amount > balance) return false;

    // Simulate network delay for realistic banking feel
    await new Promise(resolve => setTimeout(resolve, 1800));

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      description: `Transfer to ${recipient}${note ? ': ' + note : ''}`,
      category: 'Transfer',
      amount: -amount,
      date: new Date().toISOString(),
      type: 'DEBIT'
    };

    setBalance(prev => prev - amount);
    setTransactions(prev => [newTransaction, ...prev]);
    return true;
  };

  return (
    <BankingContext.Provider value={{ balance, transactions, stats, performTransfer, isLoading }}>
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) throw new Error('useBanking must be used within a BankingProvider');
  return context;
};
