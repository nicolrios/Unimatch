"use client"

import Link from "next/link"
import { GraduationCap, Mail, Lock, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LandingNavbar } from "../../components/landing/navbar"
import { Footer } from "../../components/landing/footer"

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />
      
      <div className="pt-32 pb-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl border border-border shadow-xl">
          
          {/* Encabezado del Formulario */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-2">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Crea tu cuenta</h2>
            <p className="text-muted-foreground text-sm">
              Unite a la comunidad de estudiantes de UniMatch
            </p>
          </div>

          <form className="space-y-6">
            {/* Campo Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Nombre completo</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Juan Pérez"
                  className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            {/* Campo Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Correo institucional</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input 
                  type="email" 
                  placeholder="tu@universidad.edu"
                  className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-lg text-md font-semibold gap-2">
              Registrarse <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tenés cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Iniciá sesión acá
              </Link>
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}
