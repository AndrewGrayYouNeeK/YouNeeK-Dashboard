import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import styles from './App.module.css';

export default function App() {
  const [activePage, setActivePage] = useState('overview');

  return (
    <div className={styles.app}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className={styles.main}>
        <Dashboard activePage={activePage} />
      </main>
    </div>
  );
}
