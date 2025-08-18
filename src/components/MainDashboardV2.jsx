
import React, { useState } from 'react';
import TransactionsView from './TransactionsView';
import GeneralBalanceView from './GeneralBalanceView';
import ClientsDatabase from './ClientsDatabase';

export default function MainDashboardV2({ clients = [], updateClients }) {
  const [tab, setTab] = useState('resumen');

  const Tab = ({ id, children }) => (
    <button
      onClick={() => setTab(id)}
      className={`px-4 py-2 rounded-xl border transition
        ${tab === id ? 'bg-[#162035] border-white/20 text-white' : 'bg-[#0c1220] border-white/10 text-slate-300 hover:text-white'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-50">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0c1220]/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Novacoin OTC — <span className="text-[#1de9b6]">Dashboard v2</span>
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Tab id="resumen">Resumen</Tab>
          <Tab id="clientes">Clientes</Tab>
          <Tab id="movimientos">Movimientos</Tab>
        </div>

        <section className="rounded-2xl border border-white/10 bg-[#0e1628]/70 shadow-lg p-4">
          {tab === 'resumen' && <GeneralBalanceView clients={clients} />}
          {tab === 'clientes' && <ClientsDatabase clients={clients} updateClients={updateClients} />}
          {tab === 'movimientos' && <TransactionsView clients={clients} />}
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-8 text-xs text-slate-400">Hecho para ti • v2.1</footer>
    </div>
  );
}
