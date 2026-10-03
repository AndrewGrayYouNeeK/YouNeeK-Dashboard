import styles from './Sidebar.module.css';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'projects', label: 'Projects' },
  { id: 'settings', label: 'Settings' },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.logo}>Y</span>
        <span className={styles.brandName}>YouNeeK</span>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={activePage === item.id ? styles.active : ''}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className={styles.footer}>
        <span className={styles.version}>v0.1.0</span>
      </div>
    </aside>
  );
}
