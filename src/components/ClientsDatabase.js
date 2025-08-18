import React, { useState } from 'react';
import ClientTransactionModal from './ClientTransactionModal';
import ClientHistoryModal from './ClientHistoryModal';

import {
  deleteClientFromFirebase,
  deleteTransactionFromFirebase,
  updateTransactionInFirebase
} from '../firebase/firebaseUploader';

const ClientsDatabase = ({ clients, updateClients }) => {
  const [newClient, setNewClient] = useState({ name: '', balance: 0 });
  const [selectedClient, setSelectedClient] = useState(null);
  const [historyClient, setHistoryClient] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleAddClient = () => {
    if (newClient.name && newClient.balance !== undefined) {
      const clientToAdd = {
        ...newClient,
        id: crypto.randomUUID(),
        transactions: [],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString() // AUTPW
      };
      updateClients([clientToAdd, ...clients]);
      setNewClient({ name: '', balance: 0 });
    }
  };

  const handleTransaction = (clientId, transaction) => {
    const updatedClients = clients.map(client => {
      if (client.id === clientId) {
        const newTransaction = {
          ...transaction,
          timestamp: new Date().toISOString(),
          id: crypto.randomUUID()
        };
        return {
          ...client,
          balance: client.balance + newTransaction.amount,
          transactions: [...client.transactions, newTransaction],
          lastUpdated: new Date().toISOString() // AUTPW
        };
      }
      return client;
    });

    updateClients(updatedClients);
  };

  const handleUpdateTransaction = (clientId, updatedTransaction) => {
    const updatedClients = clients.map(client => {
      if (client.id === clientId) {
        const original = client.transactions.find(t => t.id === updatedTransaction.id);
        const balanceDiff = updatedTransaction.amount - original.amount;

        const newTransactions = client.transactions.map(t =>
          t.id === updatedTransaction.id ? updatedTransaction : t
        );

        const updatedClient = {
          ...client,
          balance: client.balance + balanceDiff,
          transactions: newTransactions,
          lastUpdated: new Date().toISOString() // AUTPW
        };

        updateTransactionInFirebase(clientId, updatedTransaction);
        return updatedClient;
      }
      return client;
    });

    updateClients(updatedClients);
  };

  const handleDeleteTransaction = (clientId, transactionToDelete) => {
    const updatedClients = clients.map(client => {
      if (client.id === clientId) {
        const newTransactions = client.transactions.filter(t => t.id !== transactionToDelete.id);
        return {
          ...client,
          balance: client.balance - transactionToDelete.amount,
          transactions: newTransactions,
          lastUpdated: new Date().toISOString() // AUTPW
        };
      }
      return client;
    });

    updateClients(updatedClients);
    deleteTransactionFromFirebase(clientId, transactionToDelete.id);
  };

  const handleDeleteClient = (clientId) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este elemento?");
    if (!confirmDelete) return;
    const updatedClients = clients.filter(client => client.id !== clientId);
    updateClients(updatedClients);
    deleteClientFromFirebase(clientId);
  };

  // Ordenar por fecha de última actualización o creación
  const sortedClients = [...clients].sort((a, b) => {
    const aTime = new Date(a.lastUpdated || a.createdAt).getTime();
    const bTime = new Date(b.lastUpdated || b.createdAt).getTime();
    return bTime - aTime;
  });

  return (
    <div className="mt-4 px-2">
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mb-4">
        <input
          type="text"
          placeholder="Nombre del Cliente"
          value={newClient.name}
          onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
          className="w-full px-4 py-2 rounded-xl border border-white/10 bg-[#0c1220] text-slate-200 placeholder:text-slate-500"
        />
        <input
          type="number"
          placeholder="Saldo Inicial"
          value={newClient.balance}
          onChange={(e) => setNewClient({ ...newClient, balance: Number(e.target.value) })}
          className="w-full px-4 py-2 rounded-xl border border-white/10 bg-[#0c1220] text-slate-200 placeholder:text-slate-500"
        />
        <button
          onClick={handleAddClient}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Añadir Cliente
        </button>
      </div>

      {sortedClients.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No hay clientes registrados</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-lg border border-white/10">
          <table className="min-w-full text-sm text-left text-slate-200 bg-[#0e1628]">
            <thead className="bg-black/20 text-slate-300">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Saldo</th>
                <th className="p-3">Fecha de Registro</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedClients.map(client => (
                <tr key={client.id} className="border-t border-white/10 hover:bg-white/5 transition">
                  <td className="p-3 font-medium">{client.name}</td>
                  <td className={`p-3 ${client.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${client.balance.toLocaleString()}
                  </td>
                  <td className="p-3 text-slate-400">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </td>
                  
<td className="p-3 relative">
  <button onClick={() => setOpenMenuId(openMenuId === client.id ? null : client.id)} className="px-3 py-1.5 rounded-lg bg-[#0c1220] border border-white/10 text-slate-200 hover:text-white">Acciones ▾</button>
  {openMenuId === client.id && (
    <div className="absolute right-3 mt-2 w-44 rounded-xl border border-white/10 bg-[#0e1628] shadow-lg overflow-hidden z-10">
      <button onClick={() => { setSelectedClient(client); setOpenMenuId(null); }} className="w-full text-left px-3 py-2 text-slate-200 hover:bg-white/5">Movimientos</button>
      <button onClick={() => { setHistoryClient(client); setOpenMenuId(null); }} className="w-full text-left px-3 py-2 text-slate-200 hover:bg-white/5">Historial</button>
      <button onClick={() => { setOpenMenuId(null); if (window.confirm('¿Eliminar este cliente y sus movimientos?')) handleDeleteClient(client.id); }} className="w-full text-left px-3 py-2 text-rose-400 hover:bg-white/5">Eliminar</button>
    </div>
  )}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedClient && (
        <ClientTransactionModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onTransaction={handleTransaction}
        />
      )}

      {historyClient && (
        <ClientHistoryModal
          client={historyClient}
          onClose={() => setHistoryClient(null)}
          onUpdateTransaction={handleUpdateTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      )}
    </div>
  );
};

export default ClientsDatabase;