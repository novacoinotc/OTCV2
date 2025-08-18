import React, { useEffect, useState } from 'react';
import MainDashboardV2 from './components/MainDashboardV2';
import { db } from './firebase/config';
import { collection, getDocs, onSnapshot, doc } from 'firebase/firestore';

export default function App() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Escucha en tiempo real la colección 'clients'
    const unsub = onSnapshot(collection(db, 'clients'), async (snapshot) => {
      const list = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data() || {};
        const client = { id: docSnap.id, ...data };

        // Normalizar fechas si vienen como strings/segundos
        const createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        const lastUpdated = data.lastUpdated ? new Date(data.lastUpdated) : createdAt;
        client.createdAt = createdAt;
        client.lastUpdated = lastUpdated;

        // Traer subcolección 'transactions' de cada cliente
        try {
          const txSnap = await getDocs(collection(doc(db, 'clients', client.id), 'transactions'));
          client.transactions = txSnap.docs.map(tx => ({ id: tx.id, ...tx.data() }));
        } catch (e) {
          client.transactions = [];
        }
        return client;
      }));

      // Ordenar por última actualización
      list.sort((a, b) => {
        const ta = (b.lastUpdated || b.createdAt).getTime();
        const tb = (a.lastUpdated || a.createdAt).getTime();
        return ta - tb;
      });

      setClients(list);
    });

    return () => unsub();
  }, []);

  return <MainDashboardV2 clients={clients} updateClients={setClients} />;
}
