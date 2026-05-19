import React, { useState, useEffect } from 'react';
import { Users, ClipboardCheck, AlertCircle, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function DashboardView() {
  const [stats, setStats] = useState({ students: 0, transactions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setStats(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const cards = [
    { 
      label: 'Total Siswa Asuh', 
      value: stats.students, 
      icon: Users, 
      color: 'bg-blue-50 text-blue-600',
      description: 'Total siswa terdaftar dalam sistem'
    },
    { 
      label: 'Transaksi Bimbingan', 
      value: stats.transactions, 
      icon: ClipboardCheck, 
      color: 'bg-emerald-50 text-emerald-600',
      description: 'Jumlah sesi konseling yang tercatat'
    },
    { 
      label: 'Kebutuhan Khusus', 
      value: '5', 
      icon: AlertCircle, 
      color: 'bg-amber-50 text-amber-600',
      description: 'Siswa yang memerlukan perhatian segera'
    },
    { 
      label: 'Tren Bulanan', 
      value: '+12%', 
      icon: TrendingUp, 
      color: 'bg-purple-50 text-purple-600',
      description: 'Peningkatan interaksi dibanding bulan lalu'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-[#E5E5E7] hover:shadow-xl hover:shadow-black/5 transition-all group cursor-default"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-3 rounded-2xl", card.color)}>
                <card.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">Statistik</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold tracking-tight">
                {loading ? '...' : card.value}
              </h3>
              <p className="text-sm font-medium text-[#1D1D1F]">{card.label}</p>
              <p className="text-xs text-[#86868B] pt-2">{card.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E5E5E7] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Ringkasan Aktivitas Terbaru</h3>
            <button className="text-sm text-[#0066CC] font-medium hover:underline">Lihat Semua</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-[#F5F5F7] rounded-2xl transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-[#F5F5F7] rounded-full flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                  <span className="text-lg font-bold text-[#1D1D1F]">S</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Bimbingan Karir - Siswa A</p>
                  <p className="text-sm text-[#86868B]">Konseling individu mengenai pemilihan jurusan kuliah</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">19 Mei 2026</p>
                  <p className="text-xs text-[#86868B]">10:30 WIB</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1D1D1F] text-white rounded-3xl p-8 relative overflow-hidden">
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-xl font-bold mb-4">Catatan Guru BK</h3>
            <p className="text-white/70 text-sm leading-relaxed flex-1">
              "Tetap fokus pada pendekatan empatik dalam membimbing siswa. Pastikan setiap sesi tercatat dengan detail untuk tracking perkembangan yang maksimal."
            </p>
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Tim BK Pusat</p>
                  <p className="text-xs text-white/50">Admin Sistem</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-32 -mt-32 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}

// Remove local helper
