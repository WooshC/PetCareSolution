// pages/Home/components/Hero.jsx
import React from 'react';
import { ArrowRight, Play, Star, ShieldCheck, Heart, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center bg-[#F8FAFC] py-32 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-100/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-brand-100/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      {/* Floating UI Decorative Elements */}
      <div className="absolute top-[20%] right-[15%] animate-bounce delay-300 hidden lg:block">
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-[2rem] shadow-deep flex items-center space-x-3 border border-white">
          <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Verificado</p>
            <p className="text-xs font-black text-slate-800 tracking-tight">Cuidadores Expertos</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[15%] left-[10%] animate-bounce delay-1000 hidden lg:block">
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-[2rem] shadow-deep flex items-center space-x-3 border border-white">
          <div className="w-10 h-10 bg-brand-500 rounded-2xl flex items-center justify-center text-white">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Calificación</p>
            <p className="text-xs font-black text-slate-800 tracking-tight">4.9/5 Promedio</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center space-x-2 bg-slate-900/5 px-4 py-2 rounded-full border border-slate-900/5 mb-8 animate-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Nueva Plataforma PetCare 2.0</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-slate-800 tracking-tighter leading-[0.9] mb-8 animate-in slide-in-from-bottom-8 duration-700 delay-100">
          Cuidado Experto <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-600">para tu Familiar</span> <br />
          más Peludo.
        </h1>

        <p className="text-lg md:text-xl font-medium text-slate-500 max-w-2xl mx-auto mb-12 animate-in slide-in-from-bottom-10 duration-700 delay-200">
          Transformamos la forma de cuidar mascotas. Conecta con profesionales validados y mantén la tranquilidad total mientras estás fuera.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in slide-in-from-bottom-12 duration-700 delay-300">
          <Link to="/register">
            <button className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-300 hover:scale-110 active:scale-95 flex items-center group">
              Empezar ahora
              <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </Link>

          <button className="flex items-center space-x-4 group px-10 py-5">
            <div className="w-14 h-14 rounded-[1.5rem] bg-white shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-brand-200 transition-all border border-slate-50">
              <Play className="w-5 h-5 text-brand-500 fill-current" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">¿Cómo funciona?</p>
              <p className="text-sm font-black text-slate-800 group-hover:text-brand-600 transition-colors tracking-tight">Ver Demo del Sistema</p>
            </div>
          </button>
        </div>

        {/* Brand Trust */}
        <div className="mt-24 pt-12 border-t border-slate-200/50 flex flex-wrap justify-center items-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 animate-in fade-in delay-500">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-slate-900" />
            <span className="font-black tracking-tighter text-xl">TRUSTED</span>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-slate-900" />
            <span className="font-black tracking-tighter text-xl">SAFECARE</span>
          </div>
          <div className="flex items-center space-x-2">
            <PawPrint className="w-6 h-6 text-slate-900" />
            <span className="font-black tracking-tighter text-xl">PETPROS</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
