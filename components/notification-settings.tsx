"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings, Bell, Volume2, Clock, AlertTriangle } from "lucide-react"

interface NotificationSettingsProps {
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  notificationsEnabled: boolean
  setNotificationsEnabled: (enabled: boolean) => void
}

export function NotificationSettings({
  soundEnabled,
  setSoundEnabled,
  notificationsEnabled,
  setNotificationsEnabled,
}: NotificationSettingsProps) {
  const [aqiThresholds, setAqiThresholds] = useState({
    warning: 100,
    danger: 150,
    critical: 200,
  })

  const [coThresholds, setCoThresholds] = useState({
    warning: 15,
    danger: 35,
    critical: 50,
  })

  const [notificationFrequency, setNotificationFrequency] = useState(5) // minutes
  const [quietHours, setQuietHours] = useState({
    enabled: false,
    start: "22:00",
    end: "07:00",
  })

  const testNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("🧪 Test Notifikasi", {
        body: "Sistem notifikasi AirWatch berfungsi dengan baik!",
        icon: "/favicon.ico",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
        >
          <Settings className="h-4 w-4 mr-2" />
          Pengaturan
        </Button>
      </DialogTrigger>
      <DialogContent className="backdrop-blur-md bg-white/10 border border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Pengaturan Notifikasi</span>
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Atur preferensi notifikasi untuk monitoring polusi udara
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/90">Pengaturan Dasar</h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-white/70" />
                <span className="text-sm">Aktifkan Notifikasi</span>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>

            {/* Dihapus: Semua pengaturan suara notifikasi dan notifikasi browser */}
          </div>

          {/* AQI Thresholds */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/90">Ambang Batas AQI</h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-yellow-300">Peringatan</span>
                  <span className="text-xs text-white/70">{aqiThresholds.warning}</span>
                </div>
                <Slider
                  value={[aqiThresholds.warning]}
                  onValueChange={(value) => setAqiThresholds((prev) => ({ ...prev, warning: value[0] }))}
                  max={200}
                  min={50}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-orange-300">Bahaya</span>
                  <span className="text-xs text-white/70">{aqiThresholds.danger}</span>
                </div>
                <Slider
                  value={[aqiThresholds.danger]}
                  onValueChange={(value) => setAqiThresholds((prev) => ({ ...prev, danger: value[0] }))}
                  max={250}
                  min={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-red-300">Kritis</span>
                  <span className="text-xs text-white/70">{aqiThresholds.critical}</span>
                </div>
                <Slider
                  value={[aqiThresholds.critical]}
                  onValueChange={(value) => setAqiThresholds((prev) => ({ ...prev, critical: value[0] }))}
                  max={300}
                  min={150}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* CO Thresholds */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/90">Ambang Batas CO (ppm)</h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-yellow-300">Peringatan</span>
                  <span className="text-xs text-white/70">{coThresholds.warning}</span>
                </div>
                <Slider
                  value={[coThresholds.warning]}
                  onValueChange={(value) => setCoThresholds((prev) => ({ ...prev, warning: value[0] }))}
                  max={30}
                  min={5}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-orange-300">Bahaya</span>
                  <span className="text-xs text-white/70">{coThresholds.danger}</span>
                </div>
                <Slider
                  value={[coThresholds.danger]}
                  onValueChange={(value) => setCoThresholds((prev) => ({ ...prev, danger: value[0] }))}
                  max={50}
                  min={20}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-red-300">Kritis</span>
                  <span className="text-xs text-white/70">{coThresholds.critical}</span>
                </div>
                <Slider
                  value={[coThresholds.critical]}
                  onValueChange={(value) => setCoThresholds((prev) => ({ ...prev, critical: value[0] }))}
                  max={100}
                  min={40}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/90">Pengaturan Lanjutan</h3>

            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-white/70" />
                  <span className="text-xs">Frekuensi Notifikasi (menit)</span>
                </div>
                <span className="text-xs text-white/70">{notificationFrequency}</span>
              </div>
              <Slider
                value={[notificationFrequency]}
                onValueChange={(value) => setNotificationFrequency(value[0])}
                max={60}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-white/70" />
                <span className="text-sm">Mode Senyap (22:00-07:00)</span>
              </div>
              <Switch
                checked={quietHours.enabled}
                onCheckedChange={(enabled) => setQuietHours((prev) => ({ ...prev, enabled }))}
              />
            </div>
          </div>

          {/* Test Button */}
          <div className="pt-4 border-t border-white/20">
            <Button
              onClick={testNotification}
              className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
            >
              🧪 Test Notifikasi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
