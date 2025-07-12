"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Download,
  Filter,
  Calendar,
  Clock,
  FileText,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react"

interface DataRecord {
  id: string
  timestamp: Date
  co: number
  aqi: number
  temperature: number
  humidity: number
  location: string
  status: "normal" | "warning" | "danger" | "critical"
}

export function DataHistory() {
  const [dataRecords, setDataRecords] = useState<DataRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<DataRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  // Generate sample data
  useEffect(() => {
    const generateSampleData = () => {
      const sampleData: DataRecord[] = []
      const now = new Date()

      for (let i = 0; i < 50; i++) {
        const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000) // Every 30 minutes
        const aqi = Math.floor(Math.random() * 200) + 20
        const co = Math.random() * 30 + 5

        let status: DataRecord["status"] = "normal"
        if (aqi > 150 || co > 25) status = "critical"
        else if (aqi > 100 || co > 15) status = "danger"
        else if (aqi > 50 || co > 9) status = "warning"

        sampleData.push({
          id: `record-${i}`,
          timestamp,
          co: Number.parseFloat(co.toFixed(1)),
          aqi: Math.round(aqi),
          temperature: Number.parseFloat((Math.random() * 10 + 25).toFixed(1)),
          humidity: Number.parseFloat((Math.random() * 30 + 50).toFixed(1)),
          location: "Makassar, Indonesia",
          status,
        })
      }

      setDataRecords(sampleData)
      setFilteredRecords(sampleData)
    }

    generateSampleData()
  }, [])

  // Filter and search functionality
  useEffect(() => {
    let filtered = dataRecords

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((record) => record.status === statusFilter)
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter((record) => record.timestamp >= filterDate)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          filtered = filtered.filter((record) => record.timestamp >= filterDate)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter((record) => record.timestamp >= filterDate)
          break
      }
    }

    setFilteredRecords(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, dateFilter, dataRecords])

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord)
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage)

  const getStatusIcon = (status: DataRecord["status"]) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      case "danger":
        return <AlertCircle className="h-4 w-4 text-orange-400" />
      case "critical":
        return <XCircle className="h-4 w-4 text-red-400" />
    }
  }

  const getStatusColor = (status: DataRecord["status"]) => {
    switch (status) {
      case "normal":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "danger":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      case "critical":
        return "bg-red-500/20 text-red-300 border-red-500/30"
    }
  }

  const exportData = (format: "csv" | "json") => {
    setIsLoading(true)

    setTimeout(() => {
      if (format === "csv") {
        const headers = ["ID", "Timestamp", "AQI", "CO (ppm)", "Temperature (°C)", "Humidity (%)", "Location", "Status"]
        const csvContent = [
          headers.join(","),
          ...filteredRecords.map((record) =>
            [
              record.id,
              record.timestamp.toISOString(),
              record.aqi,
              record.co,
              record.temperature,
              record.humidity,
              `"${record.location}"`,
              record.status,
            ].join(","),
          ),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `air-quality-data-${new Date().toISOString().split("T")[0]}.csv`
        link.click()
      } else {
        const jsonContent = JSON.stringify(filteredRecords, null, 2)
        const blob = new Blob([jsonContent], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `air-quality-data-${new Date().toISOString().split("T")[0]}.json`
        link.click()
      }
      setIsLoading(false)
    }, 1000)
  }

  const refreshData = () => {
    setIsLoading(true)
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="backdrop-blur-md bg-white/10 border border-white/20 text-white max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Riwayat Data Polusi Udara</span>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Lihat dan analisis semua data monitoring polusi udara yang telah tercatat
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Cari data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 w-64"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="danger">Danger</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Filter */}
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                  <SelectItem value="all">Semua Waktu</SelectItem>
                  <SelectItem value="today">Hari Ini</SelectItem>
                  <SelectItem value="week">7 Hari</SelectItem>
                  <SelectItem value="month">30 Hari</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={refreshData}
                disabled={isLoading}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                onClick={() => exportData("csv")}
                disabled={isLoading}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button
                onClick={() => exportData("json")}
                disabled={isLoading}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                size="sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="text-2xl font-bold text-white">{filteredRecords.length}</div>
              <div className="text-xs text-white/70">Total Records</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="text-2xl font-bold text-green-400">
                {filteredRecords.filter((r) => r.status === "normal").length}
              </div>
              <div className="text-xs text-white/70">Normal</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="text-2xl font-bold text-yellow-400">
                {filteredRecords.filter((r) => r.status === "warning").length}
              </div>
              <div className="text-xs text-white/70">Warning</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="text-2xl font-bold text-red-400">
                {filteredRecords.filter((r) => r.status === "critical" || r.status === "danger").length}
              </div>
              <div className="text-xs text-white/70">Critical/Danger</div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white/90">ID</TableHead>
                    <TableHead className="text-white/90">Waktu</TableHead>
                    <TableHead className="text-white/90">AQI</TableHead>
                    <TableHead className="text-white/90">CO (ppm)</TableHead>
                    <TableHead className="text-white/90">Suhu (°C)</TableHead>
                    <TableHead className="text-white/90">Kelembapan (%)</TableHead>
                    <TableHead className="text-white/90">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRecords.map((record) => (
                    <TableRow key={record.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white/80 font-mono text-xs">{record.id.slice(-8)}</TableCell>
                      <TableCell className="text-white/80">
                        <div className="flex flex-col">
                          <span className="text-xs">{record.timestamp.toLocaleDateString("id-ID")}</span>
                          <span className="text-xs text-white/60">{record.timestamp.toLocaleTimeString("id-ID")}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-white/80 font-semibold">{record.aqi}</TableCell>
                      <TableCell className="text-white/80">{record.co}</TableCell>
                      <TableCell className="text-white/80">{record.temperature}</TableCell>
                      <TableCell className="text-white/80">{record.humidity}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(record.status)}`}
                        >
                          {getStatusIcon(record.status)}
                          <span className="capitalize">{record.status}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/70">
              Menampilkan {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredRecords.length)} dari{" "}
              {filteredRecords.length} data
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                size="sm"
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white disabled:opacity-50"
              >
                Previous
              </Button>
              <span className="flex items-center px-3 py-1 text-sm text-white/80">
                {currentPage} / {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                size="sm"
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
