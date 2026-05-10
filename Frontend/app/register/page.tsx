"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff, 
  User, Building, BookOpen, Globe 
} from "lucide-react"

// Importamos los componentes con rutas relativas para evitar errores de @ alias
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

const languages = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
]

const careers = [
  "Ingeniería en Sistemas",
  "Ingeniería Civil",
  "Medicina",
  "Derecho",
  "Administración",
  "Psicología",
  "Arquitectura",
  "Física",
  "Matemáticas",
  "Economía",
  "Otra",
]

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    university: "",
    career: "",
    language: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      setStep(2)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.token) localStorage.setItem("token", data.token)
        router.push("/dashboard")
      } else {
        alert(data.message || "Error al registrarse")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error de conexión con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Decorative Side */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-900">
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <h2 className="text-4xl font-bold mb-6">Únete a la comunidad</h2>
          <p className="text-lg opacity-80">Conecta con estudiantes de todo el mundo.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Crear cuenta</h1>
            <p className="text-muted-foreground">Paso {step} de 2</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label>Nombre completo</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email universitario</Label>
                  <Input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contraseña</Label>
                  <Input 
                    type="password" 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    required 
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Universidad</Label>
                  <Input 
                    value={formData.university} 
                    onChange={(e) => setFormData({...formData, university: e.target.value})} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Carrera</Label>
                  <Select onValueChange={(v) => setFormData({...formData, career: v})}>
                    <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                    <SelectContent>
                      {careers.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {step === 1 ? "Continuar" : "Finalizar Registro"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}