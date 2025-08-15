import React, { useEffect, useState } from 'react';
import MainDashboardV2 from './components/MainDashboardV2';
import { db } from './firebase/config';
import { collection, getDocs, onSnapshot, doc } from 'firebase/firestore';

export default function App() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'clients'), async (snapshot) => {
      const list = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data() || {};
        const client = {
          id: docSnap.id,
          ...data,
        };
        // normalize dates
        const createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        const lastUpdated = data.lastUpdated ? new Date(data.lastUpdated) : createdAt;
        client.createdAt = createdAt;
        client.lastUpdated = lastUpdated;

        // fetch transactions
        try {
          const txSnap = await getDocs(collection(doc(db, 'clients', client.id), 'transactions'));
          client.transactions = txSnap.docs.map(tx => ({ id: tx.id, ...tx.data() }));
        } catch (e) {
          client.transactions = [];
        }
        return client;
      }));
      // sort newest first
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
