import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, UserPlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student } from '../types';

export default function MasterView() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Student>({
    nis: '',
    name: '',
    class_name: '',
    gender: 'L',
    bk_teacher: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    setLoading(true);
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        setStudents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(() => {
      setIsFormOpen(false);
      setFormData({ nis: '', name: '', class_name: '', gender: 'L', bk_teacher: '' });
      fetchStudents();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-[#E5E5E7] w-full max-w-md">
          <Search className="w-5 h-5 text-[#86868B]" />
          <input 
            type="text" 
            placeholder="Cari siswa, NIS, atau kelas..." 
            className="flex-1 bg-transparent border-none focus:outline-none text-sm"
          />
        </div>
        <button 
          onClick={() => setActiveView('master')} // Fixed to switch view if needed
          className="bg-[#1D1D1F] text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 hover:shadow-lg transition-all shrink-0"
          onClickCapture={(e) => {
            e.stopPropagation();
            setIsFormOpen(true);
          }}
        >
          <UserPlus className="w-5 h-5" />
          Tambah Siswa
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#E5E5E7] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F5F7] border-b border-[#E5E5E7]">
                <th className="px-6 py-4 text-xs font-semibold text-[#86868B] uppercase tracking-wider">NIS</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Nama Lengkap</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Kelas</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#86868B] uppercase tracking-wider">L/P</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Guru BK</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E7]">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-[#86868B]">Memuat data...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-[#86868B]">Belum ada data siswa.</td></tr>
              ) : students.map((student) => (
                <tr key={student.id} className="hover:bg-[#F5F5F7]/50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs">{student.nis}</td>
                  <td className="px-6 py-4 font-semibold">{student.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-[#F5F5F7] rounded-full text-xs font-medium">{student.class_name}</span>
                  </td>
                  <td className="px-6 py-4">{student.gender}</td>
                  <td className="px-6 py-4 text-sm text-[#86868B]">{student.bk_teacher}</td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-[#E5E5E7] transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[32px] shadow-2xl p-8 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#F5F5F7] to-transparent" />
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">Input Data Siswa</h3>
                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-[#F5F5F7] rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#86868B] uppercase">No NIS</label>
                    <input 
                      required 
                      className="w-full bg-[#F5F5F7] border-none rounded-xl px-4 py-3 focus:ring-2 ring-black/5"
                      value={formData.nis}
                      onChange={(e) => setFormData({...formData, nis: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#86868B] uppercase">Jenis Kelamin</label>
                    <select 
                      className="w-full bg-[#F5F5F7] border-none rounded-xl px-4 py-3 focus:ring-2 ring-black/5"
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value as 'L' | 'P'})}
                    >
                      <option value="L">Laki-laki (L)</option>
                      <option value="P">Perempuan (P)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#86868B] uppercase">Nama Lengkap</label>
                  <input 
                    required 
                    className="w-full bg-[#F5F5F7] border-none rounded-xl px-4 py-3 focus:ring-2 ring-black/5"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#86868B] uppercase">Kelas</label>
                    <input 
                      required 
                      className="w-full bg-[#F5F5F7] border-none rounded-xl px-4 py-3 focus:ring-2 ring-black/5"
                      value={formData.class_name}
                      onChange={(e) => setFormData({...formData, class_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#86868B] uppercase">Guru BK</label>
                    <input 
                      required 
                      className="w-full bg-[#F5F5F7] border-none rounded-xl px-4 py-3 focus:ring-2 ring-black/5"
                      value={formData.bk_teacher}
                      onChange={(e) => setFormData({...formData, bk_teacher: e.target.value})}
                    />
                  </div>
                </div>

                <button className="w-full bg-[#1D1D1F] text-white py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-black/20 transition-all active:scale-[0.98]">
                  Simpan Data
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
