
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Transfer from './pages/Transfer';
import FinancialAdvice from './pages/FinancialAdvice';
import { BankingProvider } from './context/BankingContext';

const App: React.FC = () => {
  return (
    <BankingProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/advice" element={<FinancialAdvice />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </BankingProvider>
  );
};

export default App;
