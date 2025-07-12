"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  Heart,
  Shield,
  Lightbulb,
  AlertTriangle,
  Leaf,
  Home,
  Car,
  Factory,
  VenetianMaskIcon as Mask,
  Activity,
  Users,
  Baby,
  User,
  UserCheck,
} from "lucide-react"

export function AirQualityGuide() {
  const [activeTab, setActiveTab] = useState("health")

  const aqiLevels = [
    {
      range: "0-50",
      level: "Baik",
      color: "bg-green-500",
      textColor: "text-green-700",
      description: "Kualitas udara memuaskan dan polusi udara menimbulkan sedikit atau tanpa risiko",
      healthImpact: "Tidak ada dampak kesehatan",
      action: "Aktivitas normal di luar ruangan",
    },
    {
      range: "51-100",
      level: "Sedang",
      color: "bg-yellow-500",
      textColor: "text-yellow-700",
      description: "Kualitas udara dapat diterima untuk sebagian besar orang",
      healthImpact: "Sedikit dampak pada kelompok sensitif",
      action: "Kelompok sensitif dapat mengurangi aktivitas luar ruangan yang lama",
    },
    {
      range: "101-150",
      level: "Tidak Sehat untuk Kelompok Sensitif",
      color: "bg-orange-500",
      textColor: "text-orange-700",
      description: "Anggota kelompok sensitif mungkin mengalami masalah kesehatan",
      healthImpact: "Iritasi ringan pada mata, hidung, tenggorokan",
      action: "Kelompok sensitif harus membatasi aktivitas luar ruangan",
    },
    {
      range: "151-200",
      level: "Tidak Sehat",
      color: "bg-red-500",
      textColor: "text-red-700",
      description: "Setiap orang mungkin mulai mengalami masalah kesehatan",
      healthImpact: "Kesulitan bernapas, iritasi mata dan tenggorokan",
      action: "Semua orang harus mengurangi aktivitas luar ruangan",
    },
    {
      range: "201-300",
      level: "Sangat Tidak Sehat",
      color: "bg-purple-500",
      textColor: "text-purple-700",
      description: "Peringatan kesehatan kondisi darurat",
      healthImpact: "Masalah pernapasan serius, penyakit jantung",
      action: "Hindari semua aktivitas luar ruangan",
    },
    {
      range: "301+",
      level: "Berbahaya",
      color: "bg-red-800",
      textColor: "text-red-900",
      description: "Darurat kesehatan - seluruh populasi berisiko",
      healthImpact: "Efek kesehatan serius pada semua orang",
      action: "Tetap di dalam ruangan, gunakan pembersih udara",
    },
  ]

  const pollutants = [
    {
      name: "PM2.5",
      fullName: "Particulate Matter 2.5",
      description: "Partikel halus dengan diameter kurang dari 2.5 mikrometer",
      sources: ["Kendaraan bermotor", "Pembakaran biomassa", "Industri", "Debu jalan"],
      healthEffects: ["Penyakit jantung", "Stroke", "Kanker paru-paru", "Asma"],
      standard: "15 μg/m³ (24 jam)",
    },
    {
      name: "PM10",
      fullName: "Particulate Matter 10",
      description: "Partikel dengan diameter kurang dari 10 mikrometer",
      sources: ["Debu jalan", "Konstruksi", "Pertanian", "Kebakaran hutan"],
      healthEffects: ["Iritasi mata", "Batuk", "Bersin", "Asma"],
      standard: "50 μg/m³ (24 jam)",
    },
    {
      name: "CO",
      fullName: "Carbon Monoxide",
      description: "Gas tidak berwarna dan tidak berbau yang beracun",
      sources: ["Kendaraan bermotor", "Pembakaran tidak sempurna", "Generator"],
      healthEffects: ["Keracunan CO", "Sakit kepala", "Mual", "Kematian"],
      standard: "10 mg/m³ (8 jam)",
    },
    {
      name: "NO2",
      fullName: "Nitrogen Dioxide",
      description: "Gas berwarna coklat kemerahan dengan bau menyengat",
      sources: ["Kendaraan bermotor", "Pembangkit listrik", "Industri"],
      healthEffects: ["Iritasi pernapasan", "Asma", "Bronkitis"],
      standard: "200 μg/m³ (1 jam)",
    },
    {
      name: "SO2",
      fullName: "Sulfur Dioxide",
      description: "Gas tidak berwarna dengan bau tajam",
      sources: ["Pembangkit listrik", "Industri", "Gunung berapi"],
      healthEffects: ["Iritasi mata", "Batuk", "Sesak napas"],
      standard: "350 μg/m³ (1 jam)",
    },
    {
      name: "O3",
      fullName: "Ozone",
      description: "Gas yang terbentuk dari reaksi kimia di atmosfer",
      sources: ["Reaksi NOx dan VOC", "Sinar matahari", "Kendaraan"],
      healthEffects: ["Iritasi pernapasan", "Asma", "Penurunan fungsi paru"],
      standard: "235 μg/m³ (1 jam)",
    },
  ]

  const reductionTips = [
    {
      category: "Transportasi",
      icon: Car,
      tips: [
        "Gunakan transportasi umum, sepeda, atau jalan kaki",
        "Carpooling atau ride-sharing",
        "Perawatan kendaraan secara rutin",
        "Hindari berkendara saat jam sibuk",
        "Pertimbangkan kendaraan listrik atau hybrid",
      ],
    },
    {
      category: "Rumah Tangga",
      icon: Home,
      tips: [
        "Gunakan peralatan hemat energi",
        "Kurangi penggunaan AC berlebihan",
        "Hindari membakar sampah",
        "Gunakan produk ramah lingkungan",
        "Tanam pohon di sekitar rumah",
      ],
    },
    {
      category: "Industri",
      icon: Factory,
      tips: [
        "Implementasi teknologi bersih",
        "Monitoring emisi secara rutin",
        "Penggunaan energi terbarukan",
        "Pengelolaan limbah yang baik",
        "Sertifikasi lingkungan",
      ],
    },
    {
      category: "Komunitas",
      icon: Users,
      tips: [
        "Kampanye kesadaran lingkungan",
        "Program penanaman pohon",
        "Car-free day",
        "Daur ulang sampah",
        "Monitoring kualitas udara bersama",
      ],
    },
  ]

  const protectionActions = [
    {
      level: "Baik (0-50)",
      color: "bg-green-500/20 border-green-500/30",
      actions: [
        "Nikmati aktivitas luar ruangan normal",
        "Waktu yang baik untuk olahraga outdoor",
        "Buka jendela untuk ventilasi alami",
        "Tidak perlu masker khusus",
      ],
    },
    {
      level: "Sedang (51-100)",
      color: "bg-yellow-500/20 border-yellow-500/30",
      actions: [
        "Aktivitas normal untuk kebanyakan orang",
        "Kelompok sensitif perlu waspada",
        "Kurangi aktivitas outdoor yang intens",
        "Pertimbangkan masker jika sensitif",
      ],
    },
    {
      level: "Tidak Sehat untuk Kelompok Sensitif (101-150)",
      color: "bg-orange-500/20 border-orange-500/30",
      actions: [
        "Kelompok sensitif hindari aktivitas outdoor",
        "Gunakan masker N95 jika keluar",
        "Tutup jendela, gunakan AC dengan filter",
        "Konsultasi dokter jika ada gejala",
      ],
    },
    {
      level: "Tidak Sehat (151-200)",
      color: "bg-red-500/20 border-red-500/30",
      actions: [
        "Semua orang kurangi aktivitas outdoor",
        "Gunakan masker N95 atau P100",
        "Gunakan pembersih udara dalam ruangan",
        "Hindari olahraga outdoor",
      ],
    },
    {
      level: "Sangat Tidak Sehat (201-300)",
      color: "bg-purple-500/20 border-purple-500/30",
      actions: [
        "Tetap di dalam ruangan",
        "Gunakan pembersih udara HEPA",
        "Masker N95 wajib jika keluar",
        "Segera ke dokter jika ada gejala",
      ],
    },
    {
      level: "Berbahaya (301+)",
      color: "bg-red-800/20 border-red-800/30",
      actions: [
        "DARURAT - tetap di dalam ruangan",
        "Seal semua celah udara",
        "Gunakan multiple pembersih udara",
        "Segera cari bantuan medis jika sesak napas",
      ],
    },
  ]

  const vulnerableGroups = [
    {
      group: "Anak-anak",
      icon: Baby,
      risks: [
        "Sistem pernapasan masih berkembang",
        "Lebih aktif di luar ruangan",
        "Bernapas lebih cepat dari orang dewasa",
        "Risiko asma dan alergi lebih tinggi",
      ],
      protection: [
        "Batasi aktivitas outdoor saat polusi tinggi",
        "Gunakan masker khusus anak",
        "Pastikan ruangan memiliki ventilasi baik",
        "Konsultasi rutin dengan dokter anak",
      ],
    },
    {
      group: "Lansia",
      icon: User,
      risks: [
        "Sistem imun yang melemah",
        "Penyakit kronis yang sudah ada",
        "Fungsi paru-paru menurun",
        "Risiko penyakit jantung",
      ],
      protection: [
        "Hindari aktivitas outdoor saat AQI > 100",
        "Gunakan masker berkualitas tinggi",
        "Monitor kesehatan secara rutin",
        "Konsumsi makanan bergizi",
      ],
    },
    {
      group: "Penderita Asma",
      icon: Activity,
      risks: [
        "Serangan asma lebih sering",
        "Gejala pernapasan memburuk",
        "Sensitivitas tinggi terhadap polutan",
        "Risiko komplikasi serius",
      ],
      protection: [
        "Selalu bawa inhaler",
        "Monitor AQI setiap hari",
        "Gunakan masker N95",
        "Konsultasi dokter untuk rencana aksi",
      ],
    },
    {
      group: "Ibu Hamil",
      icon: UserCheck,
      risks: [
        "Risiko kelahiran prematur",
        "Berat badan lahir rendah",
        "Komplikasi kehamilan",
        "Dampak pada perkembangan janin",
      ],
      protection: [
        "Hindari area dengan polusi tinggi",
        "Gunakan pembersih udara di rumah",
        "Konsumsi suplemen antioksidan",
        "Kontrol prenatal rutin",
      ],
    },
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300">
          <BookOpen className="h-4 w-4 mr-2" />
          Panduan Kualitas Udara
        </Button>
      </DialogTrigger>
      <DialogContent className="backdrop-blur-md bg-white/10 border border-white/20 text-white max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Panduan Lengkap Kualitas Udara</span>
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Informasi komprehensif tentang kualitas udara, dampak kesehatan, dan cara perlindungan
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="health" className="text-white data-[state=active]:bg-white/20">
              <Heart className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Dampak Kesehatan</span>
              <span className="sm:hidden">Kesehatan</span>
            </TabsTrigger>
            <TabsTrigger value="standards" className="text-white data-[state=active]:bg-white/20">
              <Shield className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Standar Indonesia</span>
              <span className="sm:hidden">Standar</span>
            </TabsTrigger>
            <TabsTrigger value="tips" className="text-white data-[state=active]:bg-white/20">
              <Lightbulb className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Tips Mengurangi</span>
              <span className="sm:hidden">Tips</span>
            </TabsTrigger>
            <TabsTrigger value="actions" className="text-white data-[state=active]:bg-white/20">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Tindakan Darurat</span>
              <span className="sm:hidden">Darurat</span>
            </TabsTrigger>
          </TabsList>

          <div className="max-h-[60vh] overflow-y-auto mt-4">
            <TabsContent value="health" className="space-y-4">
              <div className="space-y-4">
                <Card className="bg-white/5 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-red-400" />
                      Tingkat Kualitas Udara dan Dampak Kesehatan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {aqiLevels.map((level, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${level.color}`}></div>
                            <span className="font-semibold text-white">
                              {level.range} - {level.level}
                            </span>
                          </div>
                        </div>
                        <p className="text-white/80 text-sm mb-2">{level.description}</p>
                        <div className="grid md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-red-300 font-medium">Dampak: </span>
                            <span className="text-white/70">{level.healthImpact}</span>
                          </div>
                          <div>
                            <span className="text-green-300 font-medium">Tindakan: </span>
                            <span className="text-white/70">{level.action}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-400" />
                      Kelompok Rentan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {vulnerableGroups.map((group, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center mb-3">
                          <group.icon className="h-5 w-5 mr-2 text-yellow-400" />
                          <h4 className="font-semibold text-white">{group.group}</h4>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-red-300 font-medium mb-2">Risiko:</h5>
                            <ul className="space-y-1">
                              {group.risks.map((risk, i) => (
                                <li key={i} className="text-white/70 text-sm flex items-start">
                                  <span className="text-red-400 mr-2">•</span>
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-green-300 font-medium mb-2">Perlindungan:</h5>
                            <ul className="space-y-1">
                              {group.protection.map((protection, i) => (
                                <li key={i} className="text-white/70 text-sm flex items-start">
                                  <span className="text-green-400 mr-2">•</span>
                                  {protection}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="standards" className="space-y-4">
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-400" />
                    Standar Kualitas Udara Indonesia (PP No. 22 Tahun 2021)
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Baku mutu udara ambien nasional berdasarkan peraturan pemerintah terbaru
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pollutants.map((pollutant, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-white">{pollutant.name}</h4>
                          <p className="text-white/60 text-sm">{pollutant.fullName}</p>
                        </div>
                        <div className="text-right">
                          <div className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                            <span className="text-blue-300 font-medium text-sm">{pollutant.standard}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm mb-3">{pollutant.description}</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-orange-300 font-medium mb-2">Sumber Utama:</h5>
                          <ul className="space-y-1">
                            {pollutant.sources.map((source, i) => (
                              <li key={i} className="text-white/70 text-sm flex items-center">
                                <Factory className="h-3 w-3 mr-2 text-orange-400" />
                                {source}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-red-300 font-medium mb-2">Dampak Kesehatan:</h5>
                          <ul className="space-y-1">
                            {pollutant.healthEffects.map((effect, i) => (
                              <li key={i} className="text-white/70 text-sm flex items-center">
                                <Heart className="h-3 w-3 mr-2 text-red-400" />
                                {effect}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="space-y-4">
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Leaf className="h-5 w-5 mr-2 text-green-400" />
                    Tips Mengurangi Polusi Udara
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Langkah-langkah praktis yang dapat dilakukan untuk mengurangi polusi udara
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reductionTips.map((category, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center mb-3">
                        <category.icon className="h-5 w-5 mr-2 text-green-400" />
                        <h4 className="font-semibold text-white">{category.category}</h4>
                      </div>
                      <ul className="space-y-2">
                        {category.tips.map((tip, i) => (
                          <li key={i} className="text-white/80 text-sm flex items-start">
                            <span className="text-green-400 mr-2 mt-1">✓</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Home className="h-5 w-5 mr-2 text-blue-400" />
                    Tips Menjaga Kualitas Udara dalam Ruangan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="text-blue-300 font-medium">Ventilasi dan Filtrasi:</h5>
                      <ul className="space-y-1 text-sm text-white/80">
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>Gunakan pembersih udara HEPA
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>Bersihkan filter AC secara rutin
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>Pastikan ventilasi yang baik
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>Hindari merokok dalam ruangan
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-green-300 font-medium">Tanaman Pembersih Udara:</h5>
                      <ul className="space-y-1 text-sm text-white/80">
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">•</span>Lidah mertua (Sansevieria)
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">•</span>Sirih gading (Pothos)
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">•</span>Palem kuning (Areca Palm)
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">•</span>Laba-laba (Spider Plant)
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Mask className="h-5 w-5 mr-2 text-red-400" />
                    Tindakan Berdasarkan Tingkat Kualitas Udara
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Panduan tindakan yang harus diambil sesuai dengan tingkat AQI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {protectionActions.map((action, index) => (
                    <div key={index} className={`rounded-lg p-4 border ${action.color}`}>
                      <h4 className="font-semibold text-white mb-3">{action.level}</h4>
                      <ul className="space-y-2">
                        {action.actions.map((actionItem, i) => (
                          <li key={i} className="text-white/80 text-sm flex items-start">
                            <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-yellow-400 flex-shrink-0" />
                            {actionItem}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-400" />
                    Jenis Masker dan Efektivitas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-white font-medium">Masker Kain</h5>
                        <span className="bg-red-500/20 px-2 py-1 rounded text-red-300 text-xs">Efektivitas Rendah</span>
                      </div>
                      <p className="text-white/70 text-sm">Hanya untuk perlindungan dasar, tidak efektif untuk PM2.5</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-white font-medium">Masker Bedah</h5>
                        <span className="bg-yellow-500/20 px-2 py-1 rounded text-yellow-300 text-xs">
                          Efektivitas Sedang
                        </span>
                      </div>
                      <p className="text-white/70 text-sm">Perlindungan terbatas untuk partikel halus</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-white font-medium">Masker N95/KN95</h5>
                        <span className="bg-green-500/20 px-2 py-1 rounded text-green-300 text-xs">
                          Efektivitas Tinggi
                        </span>
                      </div>
                      <p className="text-white/70 text-sm">
                        Menyaring 95% partikel berukuran 0.3 mikron, ideal untuk polusi udara
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-white font-medium">Masker P100</h5>
                        <span className="bg-blue-500/20 px-2 py-1 rounded text-blue-300 text-xs">
                          Efektivitas Sangat Tinggi
                        </span>
                      </div>
                      <p className="text-white/70 text-sm">Menyaring 99.97% partikel, untuk kondisi polusi ekstrem</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-500/10 border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-red-300 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Kapan Harus Mencari Bantuan Medis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-white/80 text-sm">
                    <p className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      Sesak napas yang tidak biasa atau memburuk
                    </p>
                    <p className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      Nyeri dada atau jantung berdebar
                    </p>
                    <p className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      Batuk terus-menerus dengan dahak berdarah
                    </p>
                    <p className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      Pusing atau mual yang parah
                    </p>
                    <p className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      Gejala memburuk meski sudah menggunakan perlindungan
                    </p>
                  </div>
                  <div className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                    <p className="text-red-200 text-sm font-medium">
                      🚨 Darurat: Hubungi 119 atau segera ke UGD jika mengalami kesulitan bernapas berat
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
