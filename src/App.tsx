import React, { useState } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  badge: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, badge }) => (
  <div style={styles.card}>
    <span style={styles.badge}>{badge}</span>
    <h3 style={styles.cardTitle}>{title}</h3>
    <p style={styles.cardDescription}>{description}</p>
  </div>
);

export default function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <div style={styles.statusIndicator}>
          <span style={styles.dot} /> Live on Netlify
        </div>
        <h1 style={styles.title}>Application Ready</h1>
        <p style={styles.subtitle}>
          Your Vite + React + TypeScript pipeline is working properly.
        </p>
      </header>

      <section style={styles.interactiveSection}>
        <button 
          style={styles.button}
          onClick={() => setCount((prev) => prev + 1)}
          aria-label="Increment counter"
        >
          Clicked {count} {count === 1 ? 'time' : 'times'}
        </button>
        <button 
          style={styles.resetButton}
          onClick={() => setCount(0)}
          disabled={count === 0}
        >
          Reset
        </button>
      </section>

      <section style={styles.grid}>
        <FeatureCard 
          badge="Vite"
          title="Fast Builds"
          description="Pre-configured with zero extra package requirements to guarantee a clean Netlify deployment."
        />
        <FeatureCard 
          badge="TypeScript"
          title="Type Safe"
          description="Strict types enabled to prevent runtime and build-time compilation errors."
        />
        <FeatureCard 
          badge="CI/CD"
          title="GitHub to Netlify"
          description="Ready for continuous deployment as soon as you push your code changes."
        />
      </section>
    </main>
  );
}

// Inline styles ensure zero external CSS library dependencies (e.g. Tailwind) are required to build
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
  },
  header: {
    textAlign: 'center',
    maxWidth: '600px',
    marginBottom: '2.5rem',
  },
  statusIndicator: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    padding: '0.35rem 0.85rem',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    color: '#38bdf8',
    marginBottom: '1rem',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    margin: '0 0 1rem 0',
    letterSpacing: '-0.025em',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#94a3b8',
    margin: 0,
    lineHeight: 1.6,
  },
  interactiveSection: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '3rem',
  },
  button: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  resetButton: {
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: '1px solid #334155',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    maxWidth: '900px',
    width: '100%',
  },
  card: {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    padding: '1.5rem',
    borderRadius: '0.75rem',
  },
  badge: {
    display: 'inline-block',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    fontWeight: 700,
    color: '#38bdf8',
    marginBottom: '0.5rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    margin: '0 0 0.5rem 0',
  },
  cardDescription: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    lineHeight: 1.5,
    margin: 0,
  },
};
