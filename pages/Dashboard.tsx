
import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieIcon,
  ArrowUpRight,
  ShoppingBag,
  Zap,
  Coffee,
  Car,
  CreditCard,
  Plus
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useBanking } from '../context/BankingContext';
import { useNavigate } from 'react-router-dom';

const getIconForCategory = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food & drink': return { icon: <Coffee className="w-5 h-5" />, color: 'bg-orange-100 text-orange-600' };
    case 'transport': return { icon: <Car className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' };
    case 'income': return { icon: <Wallet className="w-5 h-5" />, color: 'bg-emerald-100 text-emerald-600' };
    case 'shopping': return { icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' };
    case 'bills': return { icon: <Zap className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-600' };
    case 'transfer': return { icon: <ArrowUpRight className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-600' };
    default: return { icon: <CreditCard className="w-5 h-5" />, color: 'bg-slate-100 text-slate-600' };
  }
};

const Dashboard: React.FC = () => {
  const { stats, transactions, isLoading } = useBanking();
  const navigate = useNavigate();

  const chartData = [
    { name: 'Mon', spending: 240 },
    { name: 'Tue', spending: 130 },
    { name: 'Wed', spending: 450 },
    { name: 'Thu', spending: 120 },
    { name: 'Fri', spending: 680 },
    { name: 'Sat', spending: 340 },
    { name: 'Sun', spending: 210 },
  ];

  if (isLoading) return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Good Morning, Alex</h1>
          <p className="text-slate-500 font-medium">Welcome back to your NovaBank overview.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
            onClick={() => navigate('/transfer')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Send Money
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Total Balance" 
          value={stats.totalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} 
          trend="2.5%" 
          isPositive={true}
          icon={<Wallet className="w-6 h-6" />}
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard 
          label="Monthly Income" 
          value={stats.monthlyIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} 
          trend="12.4%" 
          isPositive={true}
          icon={<TrendingUp className="w-6 h-6" />}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard 
          label="Monthly Expenses" 
          value={stats.monthlyExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} 
          trend="5.1%" 
          isPositive={false}
          icon={<TrendingDown className="w-6 h-6" />}
          colorClass="bg-rose-50 text-rose-600"
        />
        <StatCard 
          label="Savings Goal" 
          value={`${stats.savingsRate}%`}
          trend="0.8%" 
          isPositive={true}
          icon={<PieIcon className="w-6 h-6" />}
          colorClass="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-900">Spending Overview</h2>
            <select className="bg-slate-50 border-slate-200 border rounded-lg text-sm px-3 py-1.5 font-semibold text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ stroke: '#4f46e5', strokeWidth: 2 }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '12px' }}
                  itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="spending" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSpending)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <button onClick={() => navigate('/transactions')} className="text-indigo-600 text-sm font-bold hover:text-indigo-700 transition-colors">View All</button>
          </div>
          <div className="space-y-5 flex-1 overflow-y-auto pr-1">
            {transactions.length > 0 ? (
              transactions.slice(0, 6).map((tx) => {
                const { icon, color } = getIconForCategory(tx.category);
                return (
                  <div key={tx.id} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${color}`}>
                        {icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 truncate max-w-[120px]">{tx.description}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center py-12">
                <CreditCard className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm font-medium">No recent transactions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
