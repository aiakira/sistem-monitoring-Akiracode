"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Download,
  Filter,
  Trash2,
  Eye,
  Calendar,
  Clock,
  FileText,
  BarChart3,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Database,
} from "lucide-react"

interface DataRecord {
  id: string
  timestamp: Date
  co: number
  aqi: number
  temperature: number
  humidity: number
  pm25?: number
  no2?: number
  location: string
  status: "normal" | "warning" | "danger" | "critical"
  source: "sensor" | "manual" | "api"
}

interface DataLoggerProps {
  onNewData?: (data: Omit<DataRecord, "id" | "timestamp">) => void
}

export function DataLogger({ onNewData }: DataLoggerProps) {
  const [dataRecords, setDataRecords] = useState<DataRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<DataRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(10)
  const [selectedRecord, setSelectedRecord] = useState<DataRecord | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const generateSampleData = () => {
      const sampleData: DataRecord[] = []
      const now = new Date()

      for (let i = 0; i < 50; i++) {
        const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000)
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
          pm25: Math.floor(Math.random() * 50) + 10,
          no2: Math.floor(Math.random() * 40) + 15,
          location: "Jakarta, Indonesia",
          status,
          source: i % 3 === 0 ? "manual" : i % 3 === 1 ? "api" : "sensor",
        })
      }

      setDataRecords(sampleData)
      setFilteredRecords(sampleData)
    }

    generateSampleData()
  }, [])

  useEffect(() => {
    let filtered = dataRecords

    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.source.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((record) => record.status === statusFilter)
    }

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
        const headers = [
          "ID",
          "Timestamp",
          "AQI",
          "CO (ppm)",
          "Temperature (°C)",
          "Humidity (%)",
          "PM2.5",
          "NO2",
          "Location",
          "Status",
          "Source",
        ]
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
              record.pm25 || "",
              record.no2 || "",
              `"${record.location}"`,
              record.status,
              record.source,
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

  const deleteRecord = (id: string) => {
    setDataRecords((prev) => prev.filter((record) => record.id !== id))
  }

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="neon-glass p-6 mb-8">
      {/* Header judul dan deskripsi */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Database className="h-7 w-7 text-white" />
          <h2 className="text-2xl font-bold text-white">Pencatatan Data Polusi Udara</h2>
        </div>
        <p className="text-white/70 text-base">
          Kelola dan analisis semua data monitoring polusi udara yang telah tercatat
        </p>
      </div>
      <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
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
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 px-4 py-2 rounded"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => exportData("csv")}
            disabled={isLoading}
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 px-4 py-2 rounded"
          >
            <Download className="h-4 w-4 mr-2" />
            CSV
          </button>
          <button
            onClick={() => exportData("json")}
            disabled={isLoading}
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 px-4 py-2 rounded"
          >
            <FileText className="h-4 w-4 mr-2" />
            JSON
          </button>
        </div>
      </div>
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
              <TableHead className="text-white/90">Sumber</TableHead>
              <TableHead className="text-white/90">Aksi</TableHead>
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
                <TableCell className="text-white/80">
                  <span className="capitalize text-xs bg-white/10 px-2 py-1 rounded">{record.source}</span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 border-white/20"
                    >
                      <Eye className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="h-8 w-8 p-0 bg-red-500/20 hover:bg-red-500/30 border-red-500/30"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-white/70">
          Menampilkan {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredRecords.length)} dari{" "}
          {filteredRecords.length} data
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-white/10 hover:bg-white/20 border-white/20 text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="flex items-center px-3 py-1 text-sm text-white/80">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-white/10 hover:bg-white/20 border-white/20 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}