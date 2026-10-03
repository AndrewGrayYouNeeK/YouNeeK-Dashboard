import styles from './Dashboard.module.css';

interface DashboardProps {
  activePage: string;
}

const pageTitles: Record<string, string> = {
  overview: 'Overview',
  analytics: 'Analytics',
  projects: 'Projects',
  settings: 'Settings',
);

export default function Dashboard({ activePage }: DashboardProps) {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>{pageTitles[activePage] ?? 'Dashboard'}</h1>
        <p className={styles.subtitle}>Welcome back to YouNeeK</p>
      </header>

      {activePage === 'overview' && (
        <div className={styles.grid}>
          <StatCard title="Total Users" value="1,284" change="+12%" positive />
          <StatCard title="Active Sessions" value="342" change="+5%" positive />
          <StatCard title="Revenue" value="$4,820" change="-2%" positive={false} />
          <StatCard title="Uptime" value="99.9%" change="+0.1%" positive />
          <div className={styles.wide}>
            <ActivityChart />
          </div>
          <div className={styles.wide}>
            <RecentActivity />
          </div>
        </div>
      )}

      {activePage === 'analytics' && <Placeholder title="Analytics" description="Charts and metrics will live here." />}
      {activePage === 'projects' && <Placeholder title="Projects" description="Your projects list will live here." />}
      {activePage === 'settings' && <Placeholder title="Settings" description="Account and app settings will live here." />}
    </div>
  );
}

function StatCard({ title, value, change, positive }: { title: string; value: string; change: string; positive: boolean }) {
  return (
    <div className={styles.card}>
      <span className={styles.cardTitle}>{title}</span>
      <span className={styles.cardValue}>{value}</span>
      <span className={positive ? styles.positive : styles.negative}>{change}</span>
    </div>
  );
}

function ActivityChart() {
  const bars = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88];
  return (
    <div className={styles.card}>
      <span className={styles.cardTitle}>Activity (last 12 hours)</span>
      <div className={styles.chart}>
        {bars.map((h, i) => (
          <div key={i} className={styles.bar} style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

function RecentActivity() {
  const items = [
    { text: 'New user signed up', time: '2 min ago' },
    { text: 'Project "YouNeeK Time" updated', time: '1 hr ago' },
    { text: 'Backup completed', time: '3 hr ago' },
    { text: 'New comment on Pro Radar', time: '5 hr ago' },
  ];
  return (
    <div className={styles.card}>
      <span className={styles.cardTitle}>Recent Activity</span>
      <ul className={styles.activityList}>
        {items.map((item, i) => (
          <li key={i} className={styles.activityItem}>
            <span>{item.text}</span>
            <span className={styles.activityTime}>{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Placeholder({ title, description }: { title: string; description: string }) {
  return (
    <div className={styles.placeholder}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
