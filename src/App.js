import React, { useState, useEffect } from 'react';

import LayoutHeader        from './components/LayoutHeader';
import TabNavigation       from './components/TabNavigation';
import GeneralBalanceView  from './components/GeneralBalanceView';
import ClientsDatabase     from './components/ClientsDatabase';
import TransactionsView    from './components/TransactionsView';
import OperationTab        from './components/OperationTab';
import           from './components/';   // ← BITSO

import { db } from './firebase/config';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { uploadClientsToFirebase } from './firebase/firebaseUploader';

const App = () => {
  const [user, setUser] = useState({uid: 'v2-mode'});
  const [activeTab, setActiveTab] = useState(1);
  const [clients, setClients] = useState([]);
  const [syncMessage, setSyncMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, 'clients'), async snapshot => {
      const updated = await Promise.all(
        snapshot.docs.map(async docSnap => {
          const c = docSnap.data();
          c.id = docSnap.id;
          c.createdAt   = c.createdAt   ? new Date(c.createdAt)   : new Date();
          c.lastUpdated = c.lastUpdated ? new Date(c.lastUpdated) : c.createdAt;

          const txSnap = await getDocs(collection(doc(db, 'clients', c.id), 'transactions'));
          c.transactions = txSnap.docs.map(tx => {
            const d = tx.data();
            d.id = tx.id;
            return d;
          });
          return c;
        })
      );
      updated.sort((a, b) => {
        const ta = (b.lastUpdated || b.createdAt).getTime();
        const tb = (a.lastUpdated || a.createdAt).getTime();
        return ta - tb;
      });
      setClients(updated);
    });
    return (<MainDashboardV2 clients={clients} updateClients={setClients} />);
};

export default App;