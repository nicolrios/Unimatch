"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Users, MessageSquare, BookOpen, TrendingUp, Activity,
  Search, Filter, MoreHorizontal, Ban, Check, Eye,
  ChevronDown, Globe, Clock, Shield, AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const stats = [
  { icon: Users, label: "Usuarios totales", value: "10,234", change: "+12%", up: true },
  { icon: Activity, label: "Usuarios activos", value: "3,456", change: "+8%", up: true },
  { icon: MessageSquare, label: "Mensajes hoy", value: "45,678", change: "+23%", up: true },
  { icon: BookOpen, label: "Sesiones activas", value: "892", change: "-3%", up: false },
]

const users = [
  { id: 1, name: "Maria Garcia", email: "maria@mit.edu", university: "MIT", status: "active", joined: "2024-01-15", matches: 45, messages: 234 },
  { id: 2, name: "John Smith", email: "john@stanford.edu", university: "Stanford", status: "active", joined: "2024-02-20", matches: 38, messages: 189 },
  { id: 3, name: "Ana Lopez", email: "ana@cambridge.ac.uk", university: "Cambridge", status: "active", joined: "2024-01-08", matches: 52, messages: 312 },
  { id: 4, name: "Carlos Ruiz", email: "carlos@unam.mx", university: "UNAM", status: "suspended", joined: "2024-03-01", matches: 12, messages: 45 },
  { id: 5, name: "Emma Schmidt", email: "emma@tum.de", university: "TU Munich", status: "active", joined: "2024-02-15", matches: 28, messages: 156 },
  { id: 6, name: "Yuki Tanaka", email: "yuki@u-tokyo.ac.jp", university: "U. Tokyo", status: "pending", joined: "2024-03-10", matches: 0, messages: 0 },
]

const recentActivity = [
  { id: 1, user: "Maria Garcia", action: "Nuevo match con John Smith", time: "Hace 5 min", type: "match" },
  { id: 2, user: "Sistema", action: "Usuario Carlos Ruiz suspendido por reporte", time: "Hace 15 min", type: "warning" },
  { id: 3, user: "Ana Lopez", action: "Creo nuevo grupo de estudio: Fisica Avanzada", time: "Hace 30 min", type: "group" },
  { id: 4, user: "Emma Schmidt", action: "Completo verificacion de universidad", time: "Hace 1 hora", type: "verify" },
  { id: 5, user: "John Smith", action: "Reporto contenido inapropiado", time: "Hace 2 horas", type: "report" },
]

const onlineUsers = [
  { name: "Maria Garcia", country: "USA", topic: "Bases de Datos" },
  { name: "John Smith", country: "USA", topic: "Machine Learning" },
  { name: "Ana Lopez", country: "UK", topic: "Fisica" },
  { name: "Emma Schmidt", country: "Germany", topic: "UML" },
  { name: "Pierre Dubois", country: "France", topic: "Estadistica" },
  { name: "Sofia Martinez", country: "Argentina", topic: "Python" },
]

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Panel de Administracion
          </h1>
          <p className="text-muted-foreground">
            Gestiona usuarios, monitorea actividad y controla la plataforma
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary border-0">
          <Shield className="w-4 h-4 mr-1" />
          Admin
        </Badge>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card border-border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <span className={`text-sm font-medium ${stat.up ? "text-green-500" : "text-red-500"}`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-lg">Gestion de Usuarios</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar usuarios..."
                      className="pl-9 w-48 bg-secondary border-border"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32 bg-secondary border-border">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Activos</SelectItem>
                      <SelectItem value="suspended">Suspendidos</SelectItem>
                      <SelectItem value="pending">Pendientes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead>Usuario</TableHead>
                      <TableHead className="hidden md:table-cell">Universidad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="hidden sm:table-cell">Matches</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-border">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-primary text-sm font-semibold">
                                {user.name.split(" ").map(n => n[0]).join("")}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {user.university}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              user.status === "active"
                                ? "bg-green-500/10 text-green-500 border-0"
                                : user.status === "suspended"
                                ? "bg-red-500/10 text-red-500 border-0"
                                : "bg-yellow-500/10 text-yellow-500 border-0"
                            }`}
                          >
                            {user.status === "active" ? "Activo" : 
                             user.status === "suspended" ? "Suspendido" : "Pendiente"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {user.matches}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Ver perfil
                              </DropdownMenuItem>
                              {user.status === "pending" && (
                                <DropdownMenuItem className="text-green-500">
                                  <Check className="w-4 h-4 mr-2" />
                                  Aprobar
                                </DropdownMenuItem>
                              )}
                              {user.status === "active" ? (
                                <DropdownMenuItem className="text-destructive">
                                  <Ban className="w-4 h-4 mr-2" />
                                  Suspender
                                </DropdownMenuItem>
                              ) : user.status === "suspended" && (
                                <DropdownMenuItem className="text-green-500">
                                  <Check className="w-4 h-4 mr-2" />
                                  Reactivar
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Online Users */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Usuarios en linea ({onlineUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {onlineUsers.slice(0, 5).map((user, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary text-xs font-semibold">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.topic}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Globe className="w-3 h-3" />
                    {user.country}
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-primary">
                Ver todos
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Actividad reciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 py-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === "warning" ? "bg-red-500/10" :
                    activity.type === "verify" ? "bg-green-500/10" :
                    activity.type === "report" ? "bg-yellow-500/10" :
                    "bg-primary/10"
                  }`}>
                    {activity.type === "warning" ? (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    ) : activity.type === "verify" ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : activity.type === "report" ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <Activity className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{activity.user}</span>
                      <span className="text-xs text-muted-foreground">-</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
