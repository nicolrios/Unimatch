"use client"

import { motion } from "framer-motion"
import { UserPlus, Search, MessageCircle, Sparkles } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Crea tu perfil",
    description: "Registrate con tu universidad, carrera e idiomas. Define tus temas de interes y horarios disponibles.",
  },
  {
    icon: Search,
    title: "Busca temas",
    description: "Escribe el tema que quieres estudiar: UML, Algebra, Java, Fisica... Nuestro algoritmo encuentra matches perfectos.",
  },
  {
    icon: MessageCircle,
    title: "Conecta y estudia",
    description: "Chatea con estudiantes compatibles, programa sesiones de estudio y aprende juntos en tiempo real.",
  },
  {
    icon: Sparkles,
    title: "Crece juntos",
    description: "Construye una red global de companeros de estudio. Mejora tus notas y haz amigos internacionales.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
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
            Como funciona
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cuatro simples pasos para comenzar a estudiar con companeros de todo el mundo
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border via-primary/30 to-border z-0" />
              )}
              
              <div className="relative glass rounded-2xl p-6 h-full hover:border-primary/50 transition-all duration-300 group-hover:glow-primary">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
