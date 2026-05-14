"use client"

export default function MessagesPage() {
  return (
    <div className="h-screen bg-[#05070a] flex text-white overflow-hidden">
      <div className="w-80 border-r border-white/5 p-8 flex flex-col">
        <h2 className="text-2xl font-black italic mb-10 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Canales</h2>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-white/5 border border-white/5 hover:border-pink-500/30 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500" />
              <div>
                <p className="font-bold text-sm">Nodo Conexión {i}</p>
                <p className="text-[9px] text-gray-500 uppercase font-black">Online</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-10 relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="flex-1 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center opacity-40">
           <p className="text-[10px] font-black tracking-[0.3em] uppercase">Seleccione un enlace para iniciar transmisión</p>
        </div>
        <div className="mt-10 flex gap-4">
          <input className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-violet-500 transition-all text-sm font-bold" placeholder="Escribir mensaje..." />
          <button className="bg-gradient-to-r from-pink-600 to-violet-600 px-10 rounded-2xl font-black text-xs uppercase tracking-widest">Enviar</button>
        </div>
      </div>
    </div>
  )
}