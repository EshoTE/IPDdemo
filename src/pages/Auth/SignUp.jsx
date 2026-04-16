import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const C = {
  bg: '#0c0e18',
  bgDeep: '#080a12',
  text: '#f0e8ea',
  muted: 'rgba(240,232,234,0.4)',
  dim: 'rgba(240,232,234,0.2)',
  accent: '#c896a0',
  income: '#8ab8a0',
  expense: '#d08888',
  card: 'rgba(200,150,160,0.03)',
  cardBorder: 'rgba(200,150,160,0.08)',
};

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
    { desc: 'Student Loan', amount: '+£4,000.00', color: C.income, icon: '🎓' },
    { desc: 'Tesco Shop', amount: '-£47.82', color: C.expense, icon: '🛒' },
    { desc: 'Part-time Shift', amount: '+£85.00', color: C.income, icon: '💼' },
    { desc: 'Netflix', amount: '-£10.99', color: C.expense, icon: '📺' },
    { desc: 'Gym', amount: '-£24.99', color: C.expense, icon: '💪' },
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
        background: C.bg, border: '1px solid rgba(200,150,160,0.12)',
        padding: 24, zIndex: 10,
        boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(200,150,160,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(240,232,234,0.3)', textTransform: 'uppercase', letterSpacing: 1.5 }}>Total Balance</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: C.text, letterSpacing: -1, marginTop: 4 }}>
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
            { label: 'Income', value: '£4,085', color: C.income, bg: 'rgba(138,184,160,0.08)' },
            { label: 'Expenses', value: '£752', color: C.expense, bg: 'rgba(208,136,136,0.08)' },
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
          <div style={{ fontSize: 18, fontWeight: 700, color: C.income }}>£18.42</div>
        </div>
      </FloatingCard>

      <FloatingCard x={280} y={320} delay={2} duration={8}>
        <div style={{
          padding: '10px 16px', borderRadius: 12,
          background: 'rgba(200,150,160,0.1)', border: '1px solid rgba(200,150,160,0.2)',
          backdropFilter: 'blur(10px)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}>
          <div style={{ fontSize: 10, color: 'rgba(240,232,234,0.3)' }}>Days Left</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.accent }}>34</div>
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
            fontSize: 10, color: C.expense, fontWeight: 700,
          }}>!</div>
          <span style={{ fontSize: 11, color: C.expense }}>Budget alert</span>
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
                background: h > 60 ? C.expense : C.income, opacity: 0.6,
              }} />
            ))}
          </div>
        </div>
      </FloatingCard>
    </div>
  );
}

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('name', name);
    navigate('/dashboard');
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:-translate-x-1 transition-transform">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm hover:text-[#f0e8ea] transition-colors">Back to home</span>
            </button>
          </div>

          <div style={fadeIn(100)} className="mb-8">
            <h1 className="text-lg font-bold mb-6" style={{ color: C.accent }}>TermTrack</h1>
            <h2 className="text-4xl font-bold mb-2" style={{ color: C.text }}>Create an account</h2>
            <p style={{ color: C.muted }}>Join us today and take control of your finances.</p>
          </div>

          <div style={fadeIn(150)} className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(200,150,160,0.08)', border: '1px solid rgba(200,150,160,0.15)' }}>
                <span className="text-4xl">👤</span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ background: 'rgba(200,150,160,0.15)', border: '1px solid rgba(200,150,160,0.25)', color: C.text }}>
                <span className="text-sm">📷</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSignUp}>
            <div style={fadeIn(200)} className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: C.muted }}>Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Alex"
                  className="w-full px-4 py-3 rounded-xl focus:outline-none transition-colors"
                  style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.text }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: C.muted }}>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@termtrack.com"
                  className="w-full px-4 py-3 rounded-xl focus:outline-none transition-colors"
                  style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.text }} />
              </div>
            </div>

            <div style={fadeIn(300)} className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: C.muted }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl focus:outline-none transition-colors"
                style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.text }} />
              <p className="text-xs mt-1" style={{ color: C.expense }}>Please enter the password</p>
            </div>

            <div style={fadeIn(400)}>
              <button type="submit"
                className="w-full py-3.5 rounded-xl font-semibold text-lg transition-all duration-300 hover:opacity-90 hover:shadow-lg mb-6"
                style={{ background: C.accent, color: C.bg, boxShadow: '0 4px 20px rgba(200,150,160,0.15)' }}>
                Sign Up
              </button>
            </div>

            <p style={{ ...fadeIn(500), color: C.dim, textAlign: 'center' }}>
              Already have an account?{' '}
              <button type="button" onClick={() => navigate('/login')}
                className="font-medium transition-colors" style={{ color: C.accent }}>
                Login
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
          backgroundImage: 'radial-gradient(circle, rgba(200,150,160,0.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        <AnimatedShowcase />
      </div>
    </div>
  );
}

export default SignUp;