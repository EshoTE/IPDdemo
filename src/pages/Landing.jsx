import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import stockVideo from '/13109981_1920_1080_25fps.mp4';
import stockPic from '/Group-of-around-20-students-in-Brussels-as-part-of-the-Westminster-Work.jpg';

/* ──────────────────────────────────────────────
   Navy & Dusty Rose palette constants
   ────────────────────────────────────────────── */
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
  incomeSoft: 'rgba(138,184,160,0.1)',
  incomeBorder: 'rgba(138,184,160,0.15)',
  expense: '#d08888',
  expenseSoft: 'rgba(208,136,136,0.08)',
  card: 'rgba(200,150,160,0.03)',
  cardBorder: 'rgba(200,150,160,0.08)',
};

/* ──────────────────────────────────────────────
   Demo data for animated product mockup
   ────────────────────────────────────────────── */
const DEMO_EXPENSES = [
  { category: 'Food', amount: 8.50, icon: '🍔', color: C.accent },
  { category: 'Transport', amount: 4.20, icon: '🚌', color: '#a0a8c8' },
  { category: 'Coffee', amount: 3.80, icon: '☕', color: '#b4a098' },
  { category: 'Books', amount: 14.99, icon: '📚', color: C.income },
  { category: 'Gym', amount: 9.99, icon: '💪', color: C.expense },
];

const DEMO_CHART = [
  { day: 'Mon', spent: 12, limit: 18 },
  { day: 'Tue', spent: 22, limit: 18 },
  { day: 'Wed', spent: 8, limit: 18 },
  { day: 'Thu', spent: 15, limit: 18 },
  { day: 'Fri', spent: 28, limit: 18 },
  { day: 'Sat', spent: 6, limit: 18 },
  { day: 'Sun', spent: 11, limit: 18 },
];
const maxSpent = Math.max(...DEMO_CHART.map(d => d.spent));

/* ──────────────────────────────────────────────
   Animated product demo
   ────────────────────────────────────────────── */
function ProductDemo() {
  const [activeExpense, setActiveExpense] = useState(-1);
  const [showAlert, setShowAlert] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const seq = [
      { delay: 1200, fn: () => { setPhase(1); setCursorPos({ x: 30, y: 35 }); } },
      { delay: 1800, fn: () => { setActiveExpense(0); setCursorPos({ x: 32, y: 40 }); } },
      { delay: 2600, fn: () => { setActiveExpense(1); setCursorPos({ x: 32, y: 48 }); } },
      { delay: 3400, fn: () => { setActiveExpense(2); setCursorPos({ x: 32, y: 56 }); } },
      { delay: 4200, fn: () => { setActiveExpense(3); setCursorPos({ x: 32, y: 64 }); } },
      { delay: 5000, fn: () => { setActiveExpense(4); setCursorPos({ x: 32, y: 72 }); } },
      { delay: 6000, fn: () => { setPhase(2); setCursorPos({ x: 70, y: 40 }); } },
      { delay: 7500, fn: () => { setPhase(3); setShowAlert(true); setCursorPos({ x: 70, y: 25 }); } },
      { delay: 10000, fn: () => { setPhase(0); setActiveExpense(-1); setShowAlert(false); setCursorPos({ x: 50, y: 50 }); } },
    ];
    const run = () => seq.map(({ delay, fn }) => setTimeout(fn, delay));
    let timers = run();
    const loop = setInterval(() => {
      setPhase(0); setActiveExpense(-1); setShowAlert(false); setCursorPos({ x: 50, y: 50 });
      timers = run();
    }, 11500);
    return () => { timers.forEach(clearTimeout); clearInterval(loop); };
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border"
      style={{ aspectRatio: '16/10', borderColor: C.cardBorder, background: C.bg, boxShadow: '0 0 80px rgba(200,150,160,0.06)' }}>
      {/* Cursor */}
      <div className="absolute w-5 h-5 z-30 pointer-events-none transition-all duration-700 ease-in-out"
        style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}>
        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M5 3l14 8.5L12 14l-3 8.5L5 3z" fill="white" stroke="black" strokeWidth="1" /></svg>
      </div>

      {/* Top bar */}
      <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: 'rgba(200,150,160,0.05)', background: 'rgba(200,150,160,0.015)' }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <div className="ml-3 text-[11px] font-mono" style={{ color: C.dim }}>termtrack.app/dashboard</div>
        <div className="ml-auto">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
            style={{ background: C.accentSoft, color: C.accent }}>B</div>
        </div>
      </div>

      {/* App layout */}
      <div className="flex" style={{ height: 'calc(100% - 40px)' }}>
        {/* Sidebar */}
        <div className="w-[140px] border-r p-3 flex flex-col gap-1" style={{ borderColor: 'rgba(200,150,160,0.05)', background: 'rgba(200,150,160,0.01)' }}>
          <div className="text-sm font-bold mb-3 px-2" style={{ color: C.text }}>TermTrack</div>
          {['Dashboard', 'Expenses', 'Budget', 'Settings'].map((item, i) => (
            <div key={item} className="text-xs px-2 py-1.5 rounded-md transition-colors"
              style={{
                background: (i === 1 && phase === 1) || (i === 0 && phase >= 2) ? C.accentSoft : 'transparent',
                color: (i === 1 && phase === 1) || (i === 0 && phase >= 2) ? C.accent : C.dim,
              }}>
              {item}
            </div>
          ))}
          <div className="mt-auto text-[10px] px-2" style={{ color: C.dim }}>
            Daily budget<br />
            <span className="text-sm font-bold" style={{ color: C.income }}>£18.00</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-5 overflow-hidden">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Expense list */}
            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium mb-1 uppercase tracking-wider" style={{ color: C.muted }}>Today's Expenses</div>
              {DEMO_EXPENSES.map((exp, i) => (
                <div key={exp.category} className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-500"
                  style={{
                    opacity: i <= activeExpense ? 1 : 0.15,
                    transform: i <= activeExpense ? 'translateX(0)' : 'translateX(-12px)',
                    borderColor: i <= activeExpense ? `${exp.color}33` : 'rgba(240,232,234,0.05)',
                    backgroundColor: i <= activeExpense ? `${exp.color}0a` : 'transparent',
                  }}>
                  <span className="text-sm">{exp.icon}</span>
                  <span className="text-xs flex-1" style={{ color: C.muted }}>{exp.category}</span>
                  <span className="text-xs font-mono font-medium" style={{ color: C.text }}>£{exp.amount.toFixed(2)}</span>
                </div>
              ))}
              {activeExpense >= 0 && (
                <div className="mt-2 pt-2 flex justify-between px-3" style={{ borderTop: '1px solid rgba(200,150,160,0.06)' }}>
                  <span className="text-xs" style={{ color: C.dim }}>Total</span>
                  <span className="text-sm font-mono font-bold" style={{ color: C.text }}>
                    £{DEMO_EXPENSES.slice(0, activeExpense + 1).reduce((s, e) => s + e.amount, 0).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Chart */}
            <div className="flex flex-col">
              <div className="text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: C.muted }}>Weekly Spending</div>
              <div className={`flex-1 flex items-end gap-[6px] px-1 transition-opacity duration-700 ${phase >= 2 ? 'opacity-100' : 'opacity-20'}`}>
                {DEMO_CHART.map((d, i) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full relative" style={{ height: 140 }}>
                      <div className="absolute w-full border-t border-dashed" style={{ bottom: `${(d.limit / maxSpent) * 100}%`, borderColor: 'rgba(200,150,160,0.2)' }} />
                      <div className="absolute bottom-0 w-full rounded-t-sm transition-all duration-700"
                        style={{
                          height: phase >= 2 ? `${(d.spent / maxSpent) * 100}%` : '0%',
                          transitionDelay: `${i * 80}ms`,
                          background: d.spent > d.limit
                            ? 'linear-gradient(180deg, #d08888 0%, #b06868 100%)'
                            : 'linear-gradient(180deg, #c896a0 0%, #a07080 100%)',
                          opacity: 0.7,
                        }} />
                    </div>
                    <span className="text-[9px]" style={{ color: C.dim }}>{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alert */}
          {showAlert && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 w-[70%] rounded-xl px-5 py-3 backdrop-blur-sm"
              style={{ background: 'rgba(208,136,136,0.1)', border: '1px solid rgba(208,136,136,0.25)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(208,136,136,0.2)', color: '#d08888' }}>!</div>
                <div>
                  <div className="text-xs font-medium" style={{ color: '#d08888' }}>Overspending Alert</div>
                  <div className="text-[10px]" style={{ color: 'rgba(208,136,136,0.5)' }}>You've exceeded your daily budget on 2 days this week</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Landing page
   ────────────────────────────────────────────── */
function Landing() {
  const refForm = useRef();
  const navigate = useNavigate();

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm('service_oil44jb', 'template_c52iupf', refForm.current, 'bnz4TxFhDK04hsoCZ')
      .then(
        () => { alert('Message successfully sent!'); window.location.reload(false); },
        () => { alert('Failed to send the message, please try again'); }
      );
  };

  return (
    <div className="relative">

      {/* ═══ HERO ═══ */}
      <div className="relative h-screen overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover -z-10">
          <source src={stockVideo} type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/60 -z-10" />

        <nav className="flex justify-end items-center gap-1 h-14 border-b border-white/10 px-8">
          <h1 className="mr-auto text-white text-3xl font-bold tracking-tight">TermTrack</h1>
          <div className="flex gap-6">
            <a href="#demo" className="text-white/60 hover:text-white transition-colors text-sm">How it works</a>
            <a href="#about" className="text-white/60 hover:text-white transition-colors text-sm">About</a>
            <a href="#contact" className="text-white/60 hover:text-white transition-colors text-sm">Contact</a>
          </div>
        </nav>

        <div className="flex flex-col justify-center h-[calc(100%-56px)] px-20">
          <p className="font-bold text-5xl text-white leading-tight max-w-lg">
            Where your finance truly matters
          </p>
          <p className="text-white/40 text-lg mt-4 max-w-md">
            Smart budgeting built for university students. Track spending, stay on budget, stress less.
          </p>
          <div className="flex gap-4 mt-8">
            <button onClick={() => navigate('/login')}
              className="px-8 py-3 font-semibold rounded-lg transition-colors hover:opacity-90"
              style={{ background: C.accent, color: C.bg }}>
              Get Started
            </button>
            <a href="#demo" className="px-8 py-3 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
              See how it works
            </a>
          </div>
        </div>
      </div>

      {/* ═══ PRODUCT DEMO ═══ */}
      <section id="demo" className="py-24 px-8" style={{ background: C.bgDeep }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-medium tracking-widest uppercase mb-3 text-center" style={{ color: C.accent }}>See it in action</p>
          <h2 className="text-center text-4xl font-bold mb-4" style={{ color: C.text }}>Your finances, at a glance</h2>
          <p className="text-center mb-16 max-w-lg mx-auto" style={{ color: C.dim }}>
            Log expenses, visualise your spending patterns, and get alerts before you overspend — all in one place.
          </p>
          <ProductDemo />
          <div className="flex justify-center gap-12 mt-12">
            {[
              { label: 'Track expenses', desc: 'Log and categorise every purchase' },
              { label: 'Visual breakdowns', desc: 'See where your money actually goes' },
              { label: 'Smart alerts', desc: 'Get warned before you overspend' },
            ].map((f) => (
              <div key={f.label} className="text-center max-w-[180px]">
                <p className="text-sm font-medium" style={{ color: 'rgba(240,232,234,0.7)' }}>{f.label}</p>
                <p className="text-xs mt-1" style={{ color: C.dim }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT + CONTACT ═══ */}
      <section id="about" className="py-24" style={{ background: C.bg, borderTop: `1px solid ${C.cardBorder}` }}>
        <div className="max-w-5xl mx-auto px-8">
          {/* About */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <p className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: C.accent }}>About TermTrack</p>
              <h2 className="text-3xl font-bold mb-6 leading-tight" style={{ color: C.text }}>
                Built by students,<br />for students
              </h2>
              <p className="text-base leading-relaxed" style={{ color: C.muted }}>
                TermTrack helps university students take control of their finances. Our platform
                calculates your daily spending allowance based on your student loan and term dates,
                tracks expenses by category, and sends alerts when you're at risk of overspending.
              </p>
              <p className="text-base leading-relaxed mt-4" style={{ color: C.muted }}>
                Say goodbye to financial stress and hello to smarter money management.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: C.cardBorder }}>
              <img src={stockPic} className="w-full h-[300px] object-cover" alt="Westminster students" />
            </div>
          </div>

          {/* Contact */}
          <div id="contact" className="pt-8">
            <div className="max-w-2xl mx-auto">
              <p className="text-sm font-medium tracking-widest uppercase mb-3 text-center" style={{ color: C.accent }}>Get in touch</p>
              <h2 className="text-center text-3xl font-bold mb-12" style={{ color: C.text }}>Contact the team</h2>
              <form ref={refForm} onSubmit={sendEmail} className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <input type="text" name="name" placeholder="Name" required
                    className="w-1/2 rounded-xl px-4 py-3 text-[#f0e8ea] placeholder-[rgba(240,232,234,0.2)] focus:outline-none transition-colors"
                    style={{ background: C.card, border: `1px solid ${C.cardBorder}` }} />
                  <input type="email" name="email" placeholder="Email" required
                    className="w-1/2 rounded-xl px-4 py-3 text-[#f0e8ea] placeholder-[rgba(240,232,234,0.2)] focus:outline-none transition-colors"
                    style={{ background: C.card, border: `1px solid ${C.cardBorder}` }} />
                </div>
                <input type="text" name="subject" placeholder="Subject" required
                  className="rounded-xl px-4 py-3 text-[#f0e8ea] placeholder-[rgba(240,232,234,0.2)] focus:outline-none transition-colors"
                  style={{ background: C.card, border: `1px solid ${C.cardBorder}` }} />
                <textarea name="message" placeholder="Message" required rows={5}
                  className="rounded-xl px-4 py-3 text-[#f0e8ea] placeholder-[rgba(240,232,234,0.2)] focus:outline-none transition-colors resize-none"
                  style={{ background: C.card, border: `1px solid ${C.cardBorder}` }} />
                <button type="submit"
                  className="w-full py-3 rounded-xl font-semibold tracking-wide transition-colors hover:opacity-90"
                  style={{ background: C.accent, color: C.bg }}>
                  SEND MESSAGE
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-6 px-8" style={{ background: C.bgDeep, borderTop: `1px solid ${C.cardBorder}` }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-sm" style={{ color: C.dim }}>© 2026 TermTrack</span>
          <span className="text-xs" style={{ color: C.dim }}>University of Westminster</span>
        </div>
      </footer>

    </div>
  );
}

export default Landing;