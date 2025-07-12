"use client"

import { useEffect, useState } from "react"
import { Thermometer, Droplets, Activity, AlertTriangle, CheckCircle, TrendingUp, MapPin } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { InteractiveBarChart } from "@/components/interactive-bar-chart"
import { DataHistory } from "@/components/data-history"
import { AirQualityGuide } from "@/components/air-quality-guide"
import { Navbar } from "@/components/navbar"

interface SensorData {
  temperature: number
  humidity: number
  mq135: number
  mq7: number
  timestamp: string
}

interface ChartData {
  time: string
  co: number
  aqi: number
  temperature: number
  humidity: number
}

const FloatingParticles = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [allParticles, setAllParticles] = useState<any[]>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const floatingParticles = Array.from({ length: 25 }, (_, i) => ({
      id: `float-${i}`,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * 10,
      type: "float",
    }))
    const glowParticles = Array.from({ length: 12 }, (_, i) => ({
      id: `glow-${i}`,
      size: Math.random() * 4 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 3,
      type: "glow",
    }))
    const orbitParticles = Array.from({ length: 6 }, (_, i) => ({
      id: `orbit-${i}`,
      size: Math.random() * 2 + 1,
      x: 20 + i * 12,
      y: 20 + i * 10,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 2,
      type: "orbit",
    }))
    setAllParticles([...floatingParticles, ...glowParticles, ...orbitParticles])
  }, [])

  return (
    <>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {allParticles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full ${
              particle.type === "float"
                ? "bg-white/15 animate-float-particle"
                : particle.type === "glow"
                  ? "bg-gradient-to-r from-sky-300/20 to-blue-300/20 animate-pulse-glow"
                  : "bg-white/25 animate-float-horizontal"
            }`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              filter: particle.type === "glow" ? "blur(1.5px)" : "blur(0.5px)",
              boxShadow: particle.type === "glow" ? "0 0 15px rgba(135,206,235,0.3)" : "none",
            }}
          />
        ))}
      </div>
      {/* Interactive Mouse Follower Particles */}
      <div
        className="fixed pointer-events-none z-0 transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 50,
          top: mousePosition.y - 50,
        }}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={`mouse-${i}`}
            className="absolute w-1.5 h-1.5 bg-sky-200/30 rounded-full animate-pulse"
            style={{
              left: `${i * 8}px`,
              top: `${i * 8}px`,
              animationDelay: `${i * 0.1}s`,
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>
    </>
  )
}

export default function AirPollutionMonitor() {
  const [currentData, setCurrentData] = useState<SensorData>({
    temperature: 0,
    humidity: 0,
    mq135: 0,
    mq7: 0,
    timestamp: "",
  })

  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  useEffect(() => {
    setLastUpdate(new Date().toLocaleTimeString("id-ID"))
  }, [])

  const [notifications, setNotifications] = useState<
    Array<{
      id: string
      type: "info" | "warning" | "danger" | "critical"
      title: string
      message: string
      timestamp: Date
      read: boolean
    }>
  >([
    {
      id: "1",
      type: "warning",
      title: "Kualitas Udara Menurun",
      message: "AQI mencapai 85, disarankan mengurangi aktivitas luar ruangan",
      timestamp: new Date(),
      read: false,
    },
  ])
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [showDataHistory, setShowDataHistory] = useState(false)
  const [showGuide, setShowGuide] = useState(false)

  const [sulselAirQuality, setSulselAirQuality] = useState([
    { city: "Makassar", aqi: 85, status: "Sedang", co: 12.5, co2: 480, temp: 28.5 },
    { city: "Parepare", aqi: 72, status: "Sedang", co: 9.8, co2: 420, temp: 27.2 },
    { city: "Palopo", aqi: 58, status: "Baik", co: 7.2, co2: 380, temp: 26.8 },
    { city: "Watampone", aqi: 65, status: "Sedang", co: 8.5, co2: 410, temp: 27.5 },
    { city: "Bulukumba", aqi: 62, status: "Sedang", co: 8.1, co2: 395, temp: 26.9 },
  ])

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      return permission
    }
    return "denied"
  }

  const playNotificationSound = (type: "warning" | "danger" | "critical") => {
    if (!soundEnabled) return

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    const frequencies = {
      warning: 800,
      danger: 1000,
      critical: 1200,
    }

    oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime)
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1)
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const showNotification = (title: string, message: string, type: "info" | "warning" | "danger" | "critical") => {
    const notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [notification, ...prev.slice(0, 9)])

    if (notificationPermission === "granted" && notificationsEnabled) {
      const browserNotification = new Notification(title, {
        body: message,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "air-quality",
        requireInteraction: type === "critical",
      })

      browserNotification.onclick = () => {
        window.focus()
        browserNotification.close()
      }

      if (type !== "critical") {
        setTimeout(() => browserNotification.close(), 5000)
      }
    }

    if (type !== "info") {
      playNotificationSound(type as "warning" | "danger" | "critical")
    }
  }

  const checkAirQualityAlerts = (data: SensorData) => {
    const { mq135, mq7 } = data

    if (mq135 > 300) {
      showNotification(
        "🚨 BAHAYA EKSTREM!",
        `AQI mencapai ${Math.round(mq135)}! Segera cari tempat berlindung dan gunakan masker N95.`,
        "critical",
      )
    } else if (mq135 > 200) {
      showNotification(
        "⚠️ Sangat Tidak Sehat",
        `AQI: ${Math.round(mq135)}. Hindari semua aktivitas luar ruangan.`,
        "danger",
      )
    } else if (mq135 > 150) {
      showNotification(
        "⚠️ Tidak Sehat",
        `AQI: ${Math.round(mq135)}. Batasi aktivitas luar ruangan dan gunakan masker.`,
        "danger",
      )
    } else if (mq135 > 100) {
      showNotification(
        "⚠️ Tidak Sehat untuk Kelompok Sensitif",
        `AQI: ${Math.round(mq135)}. Kelompok sensitif sebaiknya mengurangi aktivitas luar ruangan.`,
        "warning",
      )
    }

    if (mq7 > 50) {
      showNotification(
        "🚨 BAHAYA CO TINGGI!",
        `Karbon Monoksida: ${mq7.toFixed(1)} ppm. Segera tinggalkan area dan cari udara segar!`,
        "critical",
      )
    } else if (mq7 > 35) {
      showNotification(
        "⚠️ Kadar CO Berbahaya",
        `CO: ${mq7.toFixed(1)} ppm. Pastikan ventilasi baik dan pertimbangkan meninggalkan area.`,
        "danger",
      )
    } else if (mq7 > 15) {
      showNotification(
        "⚠️ Kadar CO Tinggi",
        `CO: ${mq7.toFixed(1)} ppm. Periksa ventilasi ruangan dan sumber CO.`,
        "warning",
      )
    }
  }

  const fetchCurrentData = async () => {
    try {
      const response = await fetch("/api/sensor-data")
      if (response.ok) {
        const result = await response.json()
        if (result.data) {
          setCurrentData(result.data)
          setIsConnected(true)
          setLastUpdate(new Date().toLocaleTimeString("id-ID"))
        }
      } else {
        console.error("Failed to fetch current data")
        setIsConnected(false)
      }
    } catch (error) {
      console.error("Error fetching current data:", error)
      setIsConnected(false)
    }
  }

  const fetchHistoryData = async () => {
    try {
      const response = await fetch("/api/sensor-history")
      if (response.ok) {
        const result = await response.json()
        if (result.data) {
          setChartData(result.data)
        }
      }
    } catch (error) {
      console.error("Error fetching history data:", error)
    }
  }

  useEffect(() => {
    requestNotificationPermission()
  }, [])

  useEffect(() => {
    checkAirQualityAlerts(currentData)
  }, [currentData])

  useEffect(() => {
    fetchCurrentData()
    fetchHistoryData()

    const currentDataInterval = setInterval(fetchCurrentData, 5000)
    const historyDataInterval = setInterval(fetchHistoryData, 10000)

    return () => {
      clearInterval(currentDataInterval)
      clearInterval(historyDataInterval)
    }
  }, [])

  useEffect(() => {
    setLastUpdate(new Date().toLocaleTimeString("id-ID"))
  }, [])

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { status: "Baik", color: "bg-emerald-500", textColor: "text-emerald-700" }
    if (aqi <= 100) return { status: "Sedang", color: "bg-amber-500", textColor: "text-amber-700" }
    if (aqi <= 150)
      return { status: "Tidak Sehat untuk Kelompok Sensitif", color: "bg-orange-500", textColor: "text-orange-700" }
    if (aqi <= 200) return { status: "Tidak Sehat", color: "bg-red-500", textColor: "text-red-700" }
    if (aqi <= 300) return { status: "Sangat Tidak Sehat", color: "bg-purple-500", textColor: "text-purple-700" }
    return { status: "Berbahaya", color: "bg-red-800", textColor: "text-red-900" }
  }

  const getCOStatus = (co: number) => {
    if (co <= 9) return { status: "Normal", color: "bg-emerald-500" }
    if (co <= 35) return { status: "Waspada", color: "bg-amber-500" }
    return { status: "Berbahaya", color: "bg-red-500" }
  }

  const getCO2Status = (co2: number) => {
    if (co2 <= 400) return { status: "Normal", color: "bg-emerald-500", textColor: "text-emerald-700" }
    if (co2 <= 1000) return { status: "Sedang", color: "bg-amber-500", textColor: "text-amber-700" }
    if (co2 <= 2000) return { status: "Tinggi", color: "bg-orange-500", textColor: "text-orange-700" }
    return { status: "Berbahaya", color: "bg-red-500", textColor: "text-red-700" }
  }

  const aqiStatus = getAQIStatus(currentData.mq135)
  const coStatus = getCOStatus(currentData.mq7)
  const co2Value = currentData.mq135
  const co2Status = getCO2Status(co2Value)

  const handleClearNotifications = () => {
    setNotifications([])
  }

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleOpenDataHistory = () => {
    setShowDataHistory(true)
  }

  const handleOpenGuide = () => {
    setShowGuide(true)
  }

  const weeklyChartData = [
    { day: "Senin", mq135: 120, mq7: 80 },
    { day: "Selasa", mq135: 110, mq7: 75 },
    { day: "Rabu", mq135: 130, mq7: 90 },
    { day: "Kamis", mq135: 125, mq7: 85 },
    { day: "Jumat", mq135: 115, mq7: 70 },
    { day: "Sabtu", mq135: 140, mq7: 95 },
    { day: "Minggu", mq135: 135, mq7: 88 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-600 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-blue-600/20 to-cyan-600/20"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-sky-200/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-200/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-200/10 rounded-full blur-3xl"></div>

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Navbar */}
      <Navbar
        currentData={currentData}
        isConnected={isConnected}
        lastUpdate={lastUpdate}
        notifications={notifications}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        notificationsEnabled={notificationsEnabled}
        setNotificationsEnabled={setNotificationsEnabled}
        onOpenDataHistory={handleOpenDataHistory}
        onOpenGuide={handleOpenGuide}
        onClearNotifications={handleClearNotifications}
        onMarkNotificationRead={handleMarkNotificationRead}
      />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Alert */}
        {currentData.mq135 > 100 && (
          <div className="neon-glass p-6 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-200 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-100">Peringatan Kualitas Udara</h3>
                <p className="text-orange-200/90 text-sm mt-1">
                  Kualitas udara saat ini {aqiStatus.status.toLowerCase()}. Disarankan untuk mengurangi aktivitas di
                  luar ruangan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* CO Card */}
          <div className="neon-glass p-6">
            <div className="relative z-10">
              <div className="flex items-center mb-3">
                <Activity className="h-5 w-5 text-white/80 mr-2" />
                <h3 className="text-sm font-medium text-white/90">Karbon Monoksida (CO)</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-3">
                {currentData.mq7.toFixed(1)} <span className="text-lg font-normal text-white/70">ppm</span>
              </div>
              <div
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm border border-white/30 ${coStatus.color.replace("bg-", "bg-").replace("-500", "-500/80")}`}
              >
                {coStatus.status}
              </div>
            </div>
          </div>

          {/* CO2 Card */}
          <div className="neon-glass p-6">
            <div className="relative z-10">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-5 w-5 text-white/80 mr-2" />
                <h3 className="text-sm font-medium text-white/90">Karbon Dioksida (CO2)</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-3">
                {co2Value.toFixed(0)} <span className="text-lg font-normal text-white/70">ppm</span>
              </div>
              <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium text-white/90 bg-white/20 backdrop-blur-sm border border-white/30">
                {co2Status.status}
              </div>
            </div>
          </div>

          {/* Temperature Card */}
          <div className="neon-glass p-6">
            <div className="relative z-10">
              <div className="flex items-center mb-3">
                <Thermometer className="h-5 w-5 text-white/80 mr-2" />
                <h3 className="text-sm font-medium text-white/90">Suhu Udara</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-3">
                {currentData.temperature.toFixed(1)} <span className="text-lg font-normal text-white/70">°C</span>
              </div>
              <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium text-white/90 bg-white/20 backdrop-blur-sm border border-white/30">
                {currentData.temperature > 30 ? "Panas" : currentData.temperature > 25 ? "Hangat" : "Normal"}
              </div>
            </div>
          </div>

          {/* Humidity Card */}
          <div className="neon-glass p-6">
            <div className="relative z-10">
              <div className="flex items-center mb-3">
                <Droplets className="h-5 w-5 text-white/80 mr-2" />
                <h3 className="text-sm font-medium text-white/90">Kelembapan</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-3">
                {currentData.humidity.toFixed(1)} <span className="text-lg font-normal text-white/70">%</span>
              </div>
              <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium text-white/90 bg-white/20 backdrop-blur-sm border border-white/30">
                {currentData.humidity > 70 ? "Lembap" : currentData.humidity > 40 ? "Normal" : "Kering"}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8 space-y-6">
          {/* Grafik MQ135 (CO2) */}
          <div className="neon-glass p-6 mb-8">
            <div className="p-6 border-b border-white/20">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Grafik CO2 (MQ135)
              </h3>
              <p className="text-white/70 text-sm mt-1">Riwayat 20 data terakhir sensor MQ135 (CO2)</p>
            </div>
            <div className="p-6">
              <div className="h-[250px] w-full overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                    <XAxis dataKey="time" stroke="#ffffff" fontSize={12} tick={{ fill: "#ffffff", fontSize: 12 }} />
                    <YAxis stroke="#ffffff" fontSize={12} tick={{ fill: "#ffffff", fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", color: "white", borderRadius: 8, border: "1px solid #fff2" }} />
                    <Legend wrapperStyle={{ color: "white" }} />
                      <Line
                        type="monotone"
                      dataKey="mq135"
                      stroke="#2563eb"
                      strokeWidth={4}
                      dot={{ fill: "#facc15", r: 6, stroke: "#2563eb", strokeWidth: 2 }}
                      activeDot={{ r: 8, fill: "#facc15", stroke: "#2563eb", strokeWidth: 3 }}
                      name="CO2 (MQ135) ppm"
                      />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Grafik MQ7 (CO) */}
          <div className="neon-glass p-6 mb-8">
            <div className="p-6 border-b border-white/20">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Grafik CO (MQ7)
              </h3>
              <p className="text-white/70 text-sm mt-1">Riwayat 20 data terakhir sensor MQ7 (CO)</p>
            </div>
            <div className="p-6">
              <div className="h-[250px] w-full overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                    <XAxis dataKey="time" stroke="#ffffff" fontSize={12} tick={{ fill: "#ffffff", fontSize: 12 }} />
                    <YAxis stroke="#ffffff" fontSize={12} tick={{ fill: "#ffffff", fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", color: "white", borderRadius: 8, border: "1px solid #fff2" }} />
                    <Legend wrapperStyle={{ color: "white" }} />
                    <Line type="monotone" dataKey="mq7" stroke="#f97316" strokeWidth={3} dot={{ fill: "#f97316", r: 4 }} name="CO (MQ7) ppm" />
                  </LineChart>
                  </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Grafik Mingguan Gabungan CO2 & CO */}
          <div className="neon-glass p-6 mb-8">
            <div className="p-6 border-b border-white/20">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Grafik Mingguan Gabungan CO2 & CO
              </h3>
              <p className="text-white/70 text-sm mt-1">Rata-rata per hari (Senin-Minggu)</p>
            </div>
            <div className="p-6">
              <div className="h-[250px] w-full overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyChartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                    <XAxis dataKey="day" stroke="#ffffff" fontSize={12} tick={{ fill: "#ffffff", fontSize: 12 }} />
                    <YAxis stroke="#ffffff" fontSize={12} tick={{ fill: "#ffffff", fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", color: "white", borderRadius: 8, border: "1px solid #fff2" }} />
                    <Legend wrapperStyle={{ color: "white" }} />
                    <Line type="monotone" dataKey="mq135" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: "#0ea5e9", r: 4 }} name="CO2 (MQ135) ppm" />
                    <Line type="monotone" dataKey="mq7" stroke="#f97316" strokeWidth={3} dot={{ fill: "#f97316", r: 4 }} name="CO (MQ7) ppm" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sulawesi Selatan Air Quality Section - moved here */}
          <div className="neon-glass p-6">
            <div className="p-6 border-b border-white/20">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Kualitas Udara Sulawesi Selatan
              </h3>
              <p className="text-white/70 text-sm mt-1">Data AQI dari berbagai kota di Sulawesi Selatan</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {sulselAirQuality.map((city, index) => (
                  <div
                    key={index}
                    className="neon-glass p-4 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="text-center">
                      <h4 className="font-semibold text-white mb-2">{city.city}</h4>
                      <div className="text-2xl font-bold text-white mb-2">{city.aqi}</div>
                      <div
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium text-white/90 mb-2 ${
                          city.aqi <= 50
                            ? "bg-emerald-500/60"
                            : city.aqi <= 100
                              ? "bg-amber-500/60"
                              : "bg-orange-500/60"
                        }`}
                      >
                        {city.status}
                      </div>
                      <div className="text-xs text-white/70 space-y-1">
                        <div>CO: {city.co} ppm</div>
                        <div>CO2: {city.co2} ppm</div>
                        <div>Suhu: {city.temp}°C</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="neon-glass p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-5 w-5 mr-2 text-emerald-300" />
              <h3 className="text-lg font-semibold text-white">Panduan Kualitas Udara</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 neon-dot rounded-full shadow-lg"></div>
                <span className="text-white/90 text-sm">
                  <strong>0-50:</strong> Baik - Aman untuk semua aktivitas
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 neon-dot rounded-full shadow-lg"></div>
                <span className="text-white/90 text-sm">
                  <strong>51-100:</strong> Sedang - Dapat diterima untuk kebanyakan orang
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 neon-dot rounded-full shadow-lg"></div>
                <span className="text-white/90 text-sm">
                  <strong>101-150:</strong> Tidak sehat untuk kelompok sensitif
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 neon-dot rounded-full shadow-lg"></div>
                <span className="text-white/90 text-sm">
                  <strong>151+:</strong> Tidak sehat - Hindari aktivitas luar ruangan
                </span>
              </div>
            </div>
          </div>

          <div className="neon-glass p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-300" />
              <h3 className="text-lg font-semibold text-white">Rekomendasi</h3>
            </div>
            <div className="space-y-2 text-sm text-white/90">
              {currentData.mq135 <= 50 && (
                <p className="flex items-start space-x-2">
                  <span className="text-emerald-300 mt-0.5">✓</span>
                  <span>Kualitas udara baik, aman untuk semua aktivitas luar ruangan.</span>
                </p>
              )}
              {currentData.mq135 > 50 && currentData.mq135 <= 100 && (
                <p className="flex items-start space-x-2">
                  <span className="text-amber-300 mt-0.5">⚠</span>
                  <span>
                    Kualitas udara sedang, kelompok sensitif sebaiknya membatasi aktivitas luar ruangan yang lama.
                  </span>
                </p>
              )}
              {currentData.mq135 > 100 && (
                <p className="flex items-start space-x-2">
                  <span className="text-red-300 mt-0.5">⚠</span>
                  <span>
                    Kualitas udara tidak sehat, disarankan menggunakan masker dan mengurangi aktivitas luar ruangan.
                  </span>
                </p>
              )}
              {currentData.mq7 > 9 && (
                <p className="flex items-start space-x-2">
                  <span className="text-red-300 mt-0.5">⚠</span>
                  <span>Kadar CO tinggi, pastikan ventilasi ruangan baik.</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showDataHistory && <DataHistory />}
      {showGuide && <AirQualityGuide />}

      {/* Footer */}
      <footer className="relative z-10 neon-glass border-t border-white/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="mb-4">
                <span className="text-lg font-bold text-white">Monitor Udara</span>
              </div>
              <p className="text-white/80 text-sm">
                Sistem monitoring polusi udara real-time untuk membantu Anda memantau kualitas udara di sekitar.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Fitur</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>• Monitoring real-time</li>
                <li>• Grafik trend data</li>
                <li>• Peringatan kualitas udara</li>
                <li>• Data regional Sulawesi Selatan</li>
                <li>• Histori data</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Kontak</h3>
              <p className="text-sm text-white/80">
                Untuk informasi lebih lanjut atau dukungan teknis, hubungi tim pengembang.
              </p>
            </div>
          </div>
          <div className="border-t border-white/20 pt-6 mt-6">
            <p className="text-center text-sm text-white/70">
              © 2024 Monitor Udara. Andi Ahmad Fadhil Azhary. Prodi Pendidikan Vokasional Mekatronika
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
