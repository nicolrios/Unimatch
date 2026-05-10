"use client"

import { motion } from "framer-motion"
import { Globe, Clock, Brain, Users, Shield, Zap } from "lucide-react"

const benefits = [
  {
    icon: Globe,
    title: "Red Global",
    description: "Conecta con estudiantes de mas de 50 paises. Aprende de diferentes perspectivas y culturas academicas.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Clock,
    title: "Horarios Flexibles",
    description: "Encuentra companeros en cualquier zona horaria. Siempre hay alguien disponible para estudiar contigo.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Brain,
    title: "Matching Inteligente",
    description: "Nuestro algoritmo analiza tus temas, nivel y preferencias para encontrar matches perfectos.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Users,
    title: "Grupos de Estudio",
    description: "Crea o unete a grupos de estudio por tema. Colabora con multiples estudiantes simultaneamente.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Shield,
    title: "Seguro y Verificado",
    description: "Todos los usuarios son verificados con su email universitario. Ambiente seguro y profesional.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "100% Gratis",
    description: "Todas las funciones basicas son gratuitas. Conecta, chatea y estudia sin limites.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
]

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Por que elegir UniMatch
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Disenado para estudiantes que quieren mas que solo una universidad local
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${benefit.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
