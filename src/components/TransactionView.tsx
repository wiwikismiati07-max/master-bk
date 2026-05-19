import React, { useState, useEffect } from 'react';
import { Calendar, Tag, User, Hash, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, Student } from '../types';

export default function TransactionView() {
  const [sessions, setSessions] = useState<Transaction[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    student_nis: '',
    unique_bk_number: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
  });

  useEffect(() => {
    fetchSessions();
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(Array.isArray(data) ? data : []))
      .catch(() => setStudents([]));
  }, []);

  const fetchSessions = () => {
    setLoading(true);
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => {
        setSessions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(() => {
      setIsFormOpen(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        student_nis: '',
        unique_bk_number: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      });
      fetchSessions();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Log Transaksi BK</h2>
          <p className="text-sm text-[#86868B]">Riwayat bimbingan dan konseling siswa asuh</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-[#1D1D1F] text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Sesi Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center py-20 text-[#86868B]">Memuat transaksi...</p>
        ) : sessions.length === 0 ? (
          <p className="col-span-full text-center py-20 text-[#86868B]">Belum ada riwayat transaksi.</p>
        ) : sessions.map((session) => (
          <motion.div 
            key={session.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl border border-[#E5E5E7] space-y-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-1 bg-[#1D1D1F] text-white rounded-md tracking-widest uppercase">
                {session.unique_bk_number}
              </span>
              <span className="text-xs text-[#86868B]">{session.date}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#86868B]" />
                <span className="font-bold">{session.students?.name || 'Siswa Unknown'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#86868B]">
                <Hash className="w-4 h-4" />
                <span>NIS: {session.student_nis}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#86868B]">
                <Tag className="w-4 h-4" />
                <span>Gender: {session.students?.gender || '-'}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl p-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">Catat Sesi Bimbingan</h3>
                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-[#F5F5F7] rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#86868B] uppercase">Pilih Siswa</label>
                  <select 
                    required 
                    className="w-full bg-[#F5F5F7] border-none rounded-xl px-4 py-3"
                    value={formData.student_nis}
                    onChange={(e) => setFormData({...formData, student_nis: e.target.value})}
                  >
                    <option value="">-- Pilih Siswa --</option>
                    {students.map(s => (
                      <option key={s.nis} value={s.nis}>{s.name} ({s.nis})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#86868B] uppercase">Tanggal</label>
                    <input 
                      type="date" 
                      required 
                      className="w-full bg-[#F5F5F7] border-none rounded-xl px-4 py-3"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#86868B] uppercase">No Unik BK</label>
                    <input 
                      readOnly 
                      className="w-full bg-[#E5E5E7] border-none rounded-xl px-4 py-3 text-[#86868B] cursor-not-allowed"
                      value={formData.unique_bk_number}
                    />
                  </div>
                </div>

                <button className="w-full bg-[#1D1D1F] text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all">
                  Simpan Transaksi
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
