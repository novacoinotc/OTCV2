import React, { useState } from 'react';
import TransactionsView from './TransactionsView';
import GeneralBalanceView from './GeneralBalanceView';
import ClientsDatabase from './ClientsDatabase';

export default function MainDashboardV2({ clients = [], updateClients }) {
  const [tab, setTab] = useState('resumen');

  const TabButton = ({id, children}) => (
    <button
      onClick={() => setTab(id)}
      className={`px-4 py-2 rounded-xl border transition
        ${tab === id ? 'bg-[#162035] border-white/20 text-white' : 'bg-[#0c1220] border-white/10 text-slate-300 hover:text-white'}
      `}>
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-50">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0c1220]/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Novacoin OTC — <span className="text-[#1de9b6]">Dashboard v2</span>
          </h1>
          <div className="text-xs px-2 py-1 rounded-full bg-[#112233]">Vercel • Firebase Live</div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <TabButton id="resumen">Resumen</TabButton>
          <TabButton id="clientes">Clientes</TabButton>
          <TabButton id="movimientos">Movimientos</TabButton>
        </div>

        <section className="rounded-2xl border border-white/10 bg-[#0e1628]/70 shadow-lg p-4">
          {tab === 'resumen' && (
            <div>
              <h2 className="text-base mb-3 text-slate-200">Resumen general</h2>
              <GeneralBalanceView clients={clients} />
            </div>
          )}
          {tab === 'clientes' && (
            <div>
              <h2 className="text-base mb-3 text-slate-200">Clientes</h2>
              <ClientsDatabase clients={clients} updateClients={updateClients} />
            </div>
          )}
          {tab === 'movimientos' && (
            <div>
              <h2 className="text-base mb-3 text-slate-200">Movimientos generales</h2>
              <TransactionsView clients={clients} />
            </div>
          )}
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-8 text-xs text-slate-400">Hecho para ti • v2.0</footer>
    </div>
  );
}