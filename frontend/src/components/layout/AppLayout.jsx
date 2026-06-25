import './AppLayout.css';

export default function AppLayout({ children, navbar, className = '' }) {
  return (
    <div className={`app-layout ${className}`}>
      {navbar}
      <main className="app-main">
        {children}
      </main>
    </div>
  );
}
