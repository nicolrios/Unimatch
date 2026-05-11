"use client"

import { useUser } from "@clerk/nextjs"
import { LandingNavbar } from "../../components/landing/navbar"

export default function DashboardPage() {
  const { user } = useUser(); // Traemos tus datos reales

  return (
    <main className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      
      <div className="pt-24 px-8 max-w-7xl mx-auto">
        <header className="mb-8">
          {/* AQUÍ ESTABA EL ERROR: Cambiamos "Hola, Juan" por tu nombre real */}
          <h1 className="text-4xl font-bold mb-2">
            Hola, {user?.firstName || "Estudiante"}!
          </h1>
          <p className="text-muted-foreground">
            Encuentra compañeros de estudio y mejora tu aprendizaje hoy.
          </p>
        </header>

        {/* El resto de tus componentes de estadísticas y búsqueda... */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {/* Aquí van tus tarjetas de Matches activos, Conversaciones, etc. */}
        </div>
      </div>
    </main>
  )
}