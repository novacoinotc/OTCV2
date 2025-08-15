import React from 'react';
import TransactionsView from './TransactionsView';
import GeneralBalanceView from './GeneralBalanceView';
import ClientsDatabase from './ClientsDatabase';

const Container = ({children}) => (
  <div className="min-h-screen bg-[#0a0f1a] text-slate-50">
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0c1220]/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
          Novacoin OTC — <span className="text-[#1de9b6]">Dashboard v2</span>
        </h1>
        <div className="text-xs px-2 py-1 rounded-full bg-[#112233]">Vercel • Firebase Live</div>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">{children}</main>
    <footer className="mx-auto max-w-7xl px-4 pb-8 text-xs text-slate-400">Hecho para ti • v2.0</footer>
  </div>
);

const Card = ({title, action, children}) => (
  <section className="rounded-2xl border border-white/10 bg-[#0e1628]/70 shadow-lg">
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
      <h2 className="text-sm md:text-base font-medium">{title}</h2>
      {action}
    </div>
    <div className="p-4">{children}</div>
  </section>
);

export default function MainDashboardV2({clients = [], updateClients}){
  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Resumen general">
          <GeneralBalanceView clients={clients} />
        </Card>
        <Card title="Clientes">
          <ClientsDatabase clients={clients} updateClients={updateClients} />
        </Card>
        <Card title="Movimientos">
          <div className="space-y-3">
            <p className="text-sm text-slate-400">Filtra, exporta y controla tus operaciones.</p>
            <TransactionsView clients={clients} />
          </div>
        </Card>
      </div>
    </Container>
  );
}