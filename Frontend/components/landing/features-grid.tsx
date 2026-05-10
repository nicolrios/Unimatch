"use client"

import { motion } from "framer-motion"
import { Search, MessageSquare, UserCircle, BarChart3, Bell, Calendar } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Buscador Inteligente",
    description: "Busca por tema, no por carrera. Escribe UML, Java, Calculo y encuentra expertos al instante.",
    span: "lg:col-span-2",
  },
  {
    icon: MessageSquare,
    title: "Chat en Tiempo Real",
    description: "Mensajeria instantanea con soporte para archivos, codigo y formulas matematicas.",
    span: "lg:col-span-1",
  },
  {
    icon: UserCircle,
    title: "Perfiles Completos",
    description: "Muestra tus habilidades, temas favoritos, horarios y nivel academico.",
    span: "lg:col-span-1",
  },
  {
    icon: BarChart3,
    title: "Estadisticas de Match",
    description: "Ve tu porcentaje de compatibilidad con cada estudiante basado en temas, horarios e idiomas.",
    span: "lg:col-span-1",
  },
  {
    icon: Bell,
    title: "Notificaciones Smart",
    description: "Recibe alertas cuando hay nuevos matches o mensajes importantes.",
    span: "lg:col-span-1",
  },
  {
    icon: Calendar,
    title: "Calendario Integrado",
    description: "Programa sesiones de estudio y sincroniza con tu calendario favorito.",
    span: "lg:col-span-2",
  },
]

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Funciones poderosas
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas para estudiar mejor, en una sola plataforma
          </p>
        </motion.div>

        {/* Features Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group ${feature.span}`}
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
