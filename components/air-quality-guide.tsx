"use client"

import { CheckCircle, AlertTriangle } from "lucide-react"

export function AirQualityGuide() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      {/* Panduan Kualitas Udara (kanan) */}
      <div className="bg-[#1a2940] rounded-2xl p-8 shadow-lg flex flex-col justify-center">
        <div className="flex items-center mb-4">
          <CheckCircle className="h-7 w-7 text-green-400 mr-2" />
          <h2 className="text-2xl font-bold text-white">Panduan Kualitas Udara</h2>
        </div>
        <div className="space-y-2 text-white/90 text-lg">
          <div><b>0-50:</b> Baik - Aman untuk semua aktivitas</div>
          <div><b>51-100:</b> Sedang - Dapat diterima untuk kebanyakan orang</div>
          <div><b>101-150:</b> Tidak sehat untuk kelompok sensitif</div>
          <div><b>151+:</b> Tidak sehat - Hindari aktivitas luar ruangan</div>
        </div>
      </div>
      {/* Rekomendasi */}
      <div className="bg-[#1a2940] rounded-2xl p-8 shadow-lg flex flex-col justify-center">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-7 w-7 text-yellow-400 mr-2" />
          <h2 className="text-2xl font-bold text-white">Rekomendasi</h2>
        </div>
        <div className="space-y-4 text-white/90 text-lg">
          <div className="flex items-start"><span className="mr-2 text-red-300">⚠️</span> Kualitas udara tidak sehat, disarankan menggunakan masker dan mengurangi aktivitas luar ruangan.</div>
          <div className="flex items-start"><span className="mr-2 text-red-300">⚠️</span> Kadar CO tinggi, pastikan ventilasi ruangan baik.</div>
        </div>
      </div>
    </div>
  )
}
