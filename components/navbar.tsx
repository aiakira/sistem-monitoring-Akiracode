"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { DataLogger } from "@/components/data-logger"
import {
  Bell,
  Settings,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  History,
  BookOpen,
  Trash2,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react"

interface SensorData {
  temperature: number
  humidity: number
  mq135: number
  mq7: number
  timestamp: string
}

interface Notification {
  id: string
  type: "info" | "warning" | "danger" | "critical"
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface NavbarProps {
  currentData: SensorData
  isConnected: boolean
  lastUpdate: string
  notifications: Notification[]
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  notificationsEnabled: boolean
  setNotificationsEnabled: (enabled: boolean) => void
  onOpenDataHistory: () => void
  onOpenGuide: () => void
  onClearNotifications: () => void
  onMarkNotificationRead: (id: string) => void
}

export function Navbar({
  currentData,
  isConnected,
  lastUpdate,
  notifications,
  soundEnabled,
  setSoundEnabled,
  notificationsEnabled,
  setNotificationsEnabled,
  onOpenDataHistory,
  onOpenGuide,
  onClearNotifications,
  onMarkNotificationRead,
}: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "danger":
        return <AlertTriangle className="h-4 w-4 text-orange-400" />
      case "critical":
        return <XCircle className="h-4 w-4 text-red-400" />
    }
  }

  const formatNotificationTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}h yang lalu`
    if (hours > 0) return `${hours}j yang lalu`
    if (minutes > 0) return `${minutes}m yang lalu`
    return "Baru saja"
  }

  return (
    <nav className="relative z-20 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg neon-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* Logo AM dihapus */}
              <div>
                <h1 className="text-xl font-bold text-white">Monitor Udara</h1>
                <p className="text-xs text-white/70">Real-time Air Quality Monitoring</p>
              </div>
            </div>
          </div>

          {/* Status and Controls */}
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            {/* Dihapus: Status Koneksi */}

            {/* Last Update */}
            {/* Dihapus: Update Terakhir */}

            {/* Data Logger dipindahkan ke menu Setting */}

            {/* Notifications */}
            <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 text-white border-0">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 max-h-96 overflow-y-auto bg-white/10 backdrop-blur-md border-white/20 text-white"
              >
                <div className="p-3 border-b border-white/20">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Notifikasi</h3>
                    {notifications.length > 0 && (
                      <Button
                        onClick={onClearNotifications}
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs text-white/70 hover:text-white"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Hapus Semua
                      </Button>
                    )}
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-white/70 text-sm">Tidak ada notifikasi</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-white/10 hover:bg-white/5 cursor-pointer ${
                          !notification.read ? "bg-white/5" : ""
                        }`}
                        onClick={() => onMarkNotificationRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-white truncate">{notification.title}</p>
                              {!notification.read && <div className="w-2 h-2 bg-blue-400 rounded-full"></div>}
                            </div>
                            <p className="text-xs text-white/70 mt-1">{notification.message}</p>
                            <p className="text-xs text-white/50 mt-1">
                              {formatNotificationTime(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white/10 backdrop-blur-md border-white/20 text-white">
                <div className="p-3 border-b border-white/20">
                  <h3 className="font-semibold">Pengaturan</h3>
                </div>

                {/* Sound Settings */}
                <div className="p-3 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      <span className="text-sm">Suara Notifikasi</span>
                    </div>
                    <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="p-3 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <span className="text-sm">Notifikasi Browser</span>
                    </div>
                    <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                  </div>
                </div>

                <DropdownMenuSeparator className="bg-white/20" />

                {/* Data Logger dipindahkan ke sini */}
                <div className="p-3 border-b border-white/10">
                  <DataLogger />
                </div>

                {/* Menu Items */}
                {/* Hapus Riwayat Data */}
                {/*
                <DropdownMenuItem
                  onClick={onOpenDataHistory}
                  className="flex items-center space-x-2 text-white hover:bg-white/10 focus:bg-white/10"
                >
                  <History className="h-4 w-4" />
                  <span>Riwayat Data</span>
                </DropdownMenuItem>
                */}

                <DropdownMenuItem
                  onClick={onOpenGuide}
                  className="flex items-center space-x-2 text-white hover:bg-white/10 focus:bg-white/10"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Panduan Kualitas Udara</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
