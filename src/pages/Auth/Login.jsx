import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config';

function FloatingCard({ children, delay = 0, x = 0, y = 0, duration = 6 }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      animation: `floatCard ${duration}s ease-in-out ${delay}s infinite`,
    }}>
      {children}
    </div>
  );
}

function AnimatedShowcase() {
  const [visibleTx, setVisibleTx] = useState(0);
  const [balance, setBalance] = useState(0);

  const transactions = [
    { desc: 'Student Loan', amount: '+£4,000.00', color: '#8ab8a0', icon: '🎓' },
    { desc: 'Tesco Shop', amount: '-£47.82', color: '#d08888', icon: '🛒' },
    { desc: 'Part-time Shift', amount: '+£85.00', color: '#8ab8a0', icon: '💼' },
    { desc: 'Netflix', amount: '-£10.99', color: '#d08888', icon: '📺' },
    { desc: 'Gym', amount: '-£24.99', color: '#d08888', icon: '💪' },
  ];

  useEffect(() => {
    const txInterval = setInterval(() => {
      setVisibleTx(v => (v + 1) % (transactions.length + 1));
    }, 1800);
    return () => clearInterval(txInterval);
  }, []);

  useEffect(() => {
    const target = 1247.83;
    const step = target / 40;
    let current = 0;
    const counter = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(counter); }
      setBalance(current);
    }, 50);
    return () => clearInterval(counter);
  }, []);

  return (
    <div style={{ position: 'relative', width: 400, height: 500 }}>
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 340, borderRadius: 20,
        background: '#0c0e18', border: '1px solid rgba(200,150,160,0.12)',
        padding: 24, zIndex: 10,
        boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(200,150,160,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(240,232,234,0.3)', textTransform: 'uppercase', letterSpacing: 1.5 }}>Total Balance</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#f0e8ea', letterSpacing: -1, marginTop: 4 }}>
              £{balance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(200,150,160,0.1)', border: '1px solid rgba(200,150,160,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>📊</div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[
            { label: 'Income', value: '£4,085', color: '#8ab8a0', bg: 'rgba(138,184,160,0.08)' },
            { label: 'Expenses', value: '£752', color: '#d08888', bg: 'rgba(208,136,136,0.08)' },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, padding: '10px 12px', borderRadius: 10,
              background: s.bg, border: '1px solid rgba(200,150,160,0.06)',
            }}>
              <div style={{ fontSize: 10, color: 'rgba(240,232,234,0.3)', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, color: 'rgba(240,232,234,0.3)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Recent</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {transactions.map((tx, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 10px', borderRadius: 8,
              background: i < visibleTx ? 'rgba(200,150,160,0.04)' : 'transparent',
              opacity: i < visibleTx ? 1 : 0,
              transform: i < visibleTx ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.5s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>{tx.icon}</span>
                <span style={{ fontSize: 12, color: 'rgba(240,232,234,0.6)' }}>{tx.desc}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: tx.color, fontFamily: 'monospace' }}>{tx.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <FloatingCard x={-30} y={280} delay={0} duration={7}>
        <div style={{
          padding: '10px 16px', borderRadius: 12,
          background: 'rgba(138,184,160,0.1)', border: '1px solid rgba(138,184,160,0.2)',
          backdropFilter: 'blur(10px)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}>
          <div style={{ fontSize: 10, color: 'rgba(240,232,234,0.3)' }}>Daily Budget</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#8ab8a0' }}>£18.42</div>
        </div>
      </FloatingCard>

      <FloatingCard x={280} y={320} delay={2} duration={8}>
        <div style={{
          padding: '10px 16px', borderRadius: 12,
          background: 'rgba(200,150,160,0.1)', border: '1px solid rgba(200,150,160,0.2)',
          backdropFilter: 'blur(10px)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}>
          <div style={{ fontSize: 10, color: 'rgba(240,232,234,0.3)' }}>Days Left</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#c896a0' }}>34</div>
        </div>
      </FloatingCard>

      <FloatingCard x={20} y={420} delay={1} duration={9}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 14px', borderRadius: 10,
          background: 'rgba(208,136,136,0.08)', border: '1px solid rgba(208,136,136,0.15)',
          backdropFilter: 'blur(10px)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: 6,
            background: 'rgba(208,136,136,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, color: '#d08888', fontWeight: 700,
          }}>!</div>
          <span style={{ fontSize: 11, color: '#d08888' }}>Budget alert</span>
        </div>
      </FloatingCard>

      <FloatingCard x={240} y={440} delay={3} duration={6}>
        <div style={{
          padding: '8px 14px', borderRadius: 10,
          background: 'rgba(200,150,160,0.06)', border: '1px solid rgba(200,150,160,0.12)',
          backdropFilter: 'blur(10px)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}>
          <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 24 }}>
            {[40, 65, 30, 80, 55, 45, 70].map((h, i) => (
              <div key={i} style={{
                width: 4, borderRadius: 2, height: `${h}%`,
                background: h > 60 ? '#d08888' : '#8ab8a0', opacity: 0.6,
              }} />
            ))}
          </div>
        </div>
      </FloatingCard>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/authenticate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
          setError('Invalid email or password');
          return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', email);

      try {
        const userResponse = await fetch(`${API_URL}/api/v1/me`, {
          headers: { 'Authorization': `Bearer ${data.token}` }
        });
        if (userResponse.ok) {
          const currentUser = await userResponse.json();
          localStorage.setItem('name', currentUser.name);
          localStorage.setItem('userId', currentUser.id);
          localStorage.setItem('role', currentUser.role);
        }
      } catch (err) {
        console.error('LOGIN ERROR:', err);
        setError('Something went wrong. Please try again.');
        return;
      }

      window.location.href = '/IPDdemo/dashboard';
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const fadeIn = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(16px)',
    transition: `all 0.6s ease ${delay}ms`,
  });

  return (
    <div className="min-h-screen flex" style={{ background: C.bg }}>
      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.04; }
          50% { opacity: 0.08; }
        }
      `}</style>

      <div className="w-1/2 flex items-center justify-center p-12 relative">
        <div style={{
          position: 'absolute', top: '20%', left: '-10%', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,150,160,0.04) 0%, transparent 70%)',
          animation: 'glowPulse 6s ease-in-out infinite', pointerEvents: 'none',
        }} />

        <div className="w-full max-w-md relative z-10">
          <div style={fadeIn(0)} className="mb-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 mb-8 group"
              style={{ color: 'rgba(240,232,234,0.3)' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transition: 'transform 0.2s' }} className="group-hover:-translate-x-1">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm hover:text-[#f0e8ea] transition-colors">Back to home</span>
            </button>
          </div>

          <div style={fadeIn(100)} className="mb-8">
            <h1 className="text-lg font-bold mb-6" style={{ color: C.accent }}>TermTrack</h1>
            <h2 className="text-4xl font-bold mb-2" style={{ color: C.text }}>Welcome back</h2>
            <p style={{ color: C.muted }}>Enter your details to access your dashboard.</p>
          </div>

          <form onSubmit={handleLogin}>
            {error && (
              <div className="mb-6 p-3 rounded-xl"
                style={{
                  background: 'rgba(208,136,136,0.08)',
                  border: '1px solid rgba(208,136,136,0.15)',
                  opacity: mounted ? 1 : 0,
                  transition: 'all 0.3s ease',
                }}>
                <p className="text-sm" style={{ color: '#d08888' }}>{error}</p>
              </div>
            )}

            <div style={fadeIn(200)} className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: C.muted }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@termtrack.com"
                className="w-full px-4 py-3 rounded-xl focus:outline-none transition-colors"
                style={{
                  background: C.card,
                  border: `1px solid ${C.cardBorder}`,
                  color: C.text,
                }}
              />
            </div>

            <div style={fadeIn(300)} className="mb-8">
              <label className="block text-sm font-medium mb-2" style={{ color: C.muted }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl focus:outline-none transition-colors"
                style={{
                  background: C.card,
                  border: `1px solid ${C.cardBorder}`,
                  color: C.text,
                }}
              />
            </div>

            <div style={fadeIn(400)}>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-semibold text-lg transition-all duration-300 hover:opacity-90 hover:shadow-lg mb-6"
                style={{
                  background: C.accent,
                  color: C.bg,
                  boxShadow: '0 4px 20px rgba(200,150,160,0.15)',
                }}
              >
                Log In
              </button>
            </div>

            <p style={{ ...fadeIn(500), color: C.dim, textAlign: 'center' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="font-medium transition-colors"
                style={{ color: C.accent }}
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center p-12 relative overflow-hidden"
        style={{ background: C.bgDeep, borderLeft: `1px solid ${C.cardBorder}` }}>

        <div style={{
          position: 'absolute', top: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,150,160,0.05) 0%, transparent 70%)',
          animation: 'glowPulse 8s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', left: '-5%', width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(138,184,160,0.04) 0%, transparent 70%)',
          animation: 'glowPulse 10s ease-in-out 2s infinite', pointerEvents: 'none',
        }} />

        <div style={{
          position: 'absolute', inset: 0, opacity: 0.015,
          backgroundImage: `radial-gradient(circle, rgba(200,150,160,0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />

        <AnimatedShowcase />
      </div>
    </div>
  );
}

const C = {
  bg: '#0c0e18',
  bgDeep: '#080a12',
  text: '#f0e8ea',
  muted: 'rgba(240,232,234,0.4)',
  dim: 'rgba(240,232,234,0.2)',
  accent: '#c896a0',
  accentSoft: 'rgba(200,150,160,0.1)',
  accentBorder: 'rgba(200,150,160,0.18)',
  income: '#8ab8a0',
  expense: '#d08888',
  card: 'rgba(200,150,160,0.03)',
  cardBorder: 'rgba(200,150,160,0.08)',
};

export default Login;