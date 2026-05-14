"use client"
import { useState } from "react"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#05070a] text-white p-10 relative overflow-hidden">
      {/* Luces de fondo */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-12">
          <p className="text-[10px] font-black text-blue-400 tracking-[0.4em] uppercase mb-2">Localizador Estudiantil</p>
          <h1 className="text-6xl font-black italic tracking-tighter">Explorar <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Red</span></h1>
        </div>

        <div className="relative group mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-violet-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative flex items-center bg-[#0a0f1a] rounded-3xl p-2 border border-white/10 overflow-hidden">
            <span className="ml-6 text-xl">🔍</span>
            <input 
              placeholder="Materia, carrera o nombre..." 
              className="w-full bg-transparent p-5 outline-none text-sm font-bold placeholder:text-gray-700"
            />
            <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-pink-600 hover:to-violet-600 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-blue-900/20">
              Escanear
            </button>
          </div>
        </div>

        <div className="border-2 border-dashed border-white/5 rounded-[3rem] py-32 flex flex-col items-center opacity-50">
          <div className="w-12 h-12 border-2 border-white/10 border-t-pink-500 rounded-full animate-spin mb-6" />
          <p className="text-gray-600 font-black tracking-[0.3em] text-[10px] uppercase">Rastreo de afinidad algorítmica...</p>
        </div>
      </div>
    </div>
  )
}