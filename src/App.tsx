import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  FileBarChart, 
  Menu, 
  X,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType } from './types';
import DashboardView from './components/DashboardView';
import MasterView from './components/MasterView';
import TransactionView from './components/TransactionView';
import ReportView from './components/ReportView';
import { cn } from './lib/utils';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'master', label: 'Data Master', icon: Users },
    { id: 'transaction', label: 'Transaksi BK', icon: ClipboardList },
    { id: 'report', label: 'Laporan', icon: FileBarChart },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1D1D1F] font-sans flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-[#E5E5E7] transition-all duration-300 flex flex-col z-50",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1D1D1F] rounded-xl flex items-center justify-center shrink-0">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-xl tracking-tight"
            >
              SIM BK
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                activeView === item.id 
                  ? "bg-[#1D1D1F] text-white shadow-lg" 
                  : "text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
              )}
            >
              <item.icon className={cn("w-5 h-5", activeView === item.id ? "text-white" : "group-hover:text-[#1D1D1F]")} />
              {isSidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#E5E5E7]">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-[#FF453A] hover:bg-[#FFF2F1] rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-bottom border-[#E5E5E7] px-8 flex items-center justify-between shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-[#F5F5F7] rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-2xl font-semibold capitalize tracking-tight">
              {menuItems.find(m => m.id === activeView)?.label}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <img 
              src="https://iili.io/KDFk4fI.png" 
              alt="Logo" 
              className="h-10 w-auto object-contain"
              id="app-logo"
            />
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium">Bimbingan Konseling</span>
              <span className="text-xs text-[#86868B]">Dashboard Siswa Asuh</span>
            </div>
          </div>
        </header>

        {/* View Container */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {activeView === 'dashboard' && <DashboardView />}
              {activeView === 'master' && <MasterView />}
              {activeView === 'transaction' && <TransactionView />}
              {activeView === 'report' && <ReportView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
