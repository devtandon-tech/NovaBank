
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  History, 
  Sparkles, 
  Menu, 
  Bell,
  Search,
  User
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { balance } = useBanking();

  const navItems = [
    { to: '/', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/transactions', icon: <History className="w-5 h-5" />, label: 'History' },
    { to: '/transfer', icon: <ArrowRightLeft className="w-5 h-5" />, label: 'Transfer' },
    { to: '/advice', icon: <Sparkles className="w-5 h-5" />, label: 'Ask Nova AI' },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            N
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">NovaBank</span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Alex Johnson</p>
            <p className="text-xs text-slate-500">Premium Member</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 left-0">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`
        md:hidden fixed inset-y-0 left-0 w-64 z-50 transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <NavContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center bg-slate-100/80 rounded-full px-4 py-1.5 w-96 border border-slate-200/50">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-full relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 hidden md:block mx-1"></div>
            <div className="hidden md:block text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Available Balance</p>
              <p className="text-sm font-bold text-indigo-600">
                {balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </p>
            </div>
          </div>
        </header>

        {/* Page Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
