import React from 'react';
import { Download, FileSpreadsheet, FileText, Info } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ReportView() {
  const exportToExcel = async () => {
    try {
      const [studentsRes, transRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/transactions')
      ]);

      const studentsDataRaw = await studentsRes.json();
      const transactionsDataRaw = await transRes.json();

      const students = Array.isArray(studentsDataRaw) ? studentsDataRaw : [];
      const transactions = Array.isArray(transactionsDataRaw) ? transactionsDataRaw : [];

      const wb = XLSX.utils.book_new();
      
      const studentsSheet = XLSX.utils.json_to_sheet(students);
      XLSX.utils.book_append_sheet(wb, studentsSheet, "Data Siswa");
      
      const transData = transactions.map((t: any) => ({
        Tanggal: t.date,
        NIS: t.student_nis,
        Nama: t.students?.name,
        Gender: t.students?.gender,
        BK_Number: t.unique_bk_number
      }));
      const transSheet = XLSX.utils.json_to_sheet(transData);
      XLSX.utils.book_append_sheet(wb, transSheet, "Laporan Transaksi");

      XLSX.writeFile(wb, `Laporan_BK_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#1D1D1F] text-white p-12 rounded-[40px] relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Export Data & Laporan</h2>
          <p className="text-white/60 text-lg leading-relaxed mb-8">
            Unduh seluruh data bimbingan konseling ke dalam format Excel untuk keperluan dokumentasi fisik atau laporan resmi sekolah.
          </p>
          <button 
            onClick={exportToExcel}
            className="bg-white text-[#1D1D1F] px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-[#F5F5F7] transition-all transform active:scale-95"
          >
            <Download className="w-6 h-6" />
            Download Excel (.xlsx)
          </button>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <FileSpreadsheet className="w-64 h-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-[#E5E5E7] flex items-start gap-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-2">Ringkasan Eksekutif</h4>
            <p className="text-[#86868B] text-sm mb-4">Laporan performa bimbingan bulanan dalam format ringkas.</p>
            <button className="text-[#0066CC] font-semibold text-sm hover:underline">Pratinjau PDF</button>
          </div>
        </div>

        <div className="bg-[#F5F5F7] p-8 rounded-3xl border border-[#E5E5E7] flex items-start gap-6">
          <div className="w-16 h-16 bg-[#E5E5E7] text-[#86868B] rounded-2xl flex items-center justify-center shrink-0">
            <Info className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-2">Instruksi Pelaporan</h4>
            <p className="text-[#86868B] text-sm">Pastikan seluruh data siswa asuh telah diperbarui sebelum mengunduh laporan untuk akurasi data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
