import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot, User, Mail, PhoneCall, CheckCircle, ChevronDown, ArrowRight,
  Calendar, Clock, Laptop, Loader2, Lock, Star, Zap, Shield, Globe,
  BookOpen, Award, Code2, Cpu, BrainCircuit, Rocket, Sparkles,
  CreditCard, Menu, X, Play, Trophy, Users, MessageSquare, Heart,
  GraduationCap, Target, ChevronRight, Quote, Check, Wifi, Layers,
  type LucideIcon,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL ?? '';


// ─── Types ─────────────────────────────────────────────────────────────────
interface FormData  { name: string; email: string; phone: string }
interface FormErrors { name?: string; email?: string; phone?: string }
interface TimeLeft  { days: number; hours: number; minutes: number; seconds: number }

// ─── Utils ──────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-(]{10,15}$/;
const sanitize = (v: string) =>
  v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
   .replace(/"/g,'&quot;').replace(/'/g,'&#x27;').replace(/\//g,'&#x2F;');

// ─── Hooks ──────────────────────────────────────────────────────────────────
function useCountdown(target: Date): TimeLeft {
  const calc = useCallback(() => {
    const d = Math.max(0, target.getTime() - Date.now());
    return {
      days:    Math.floor(d / 86400000),
      hours:   Math.floor((d % 86400000) / 3600000),
      minutes: Math.floor((d % 3600000) / 60000),
      seconds: Math.floor((d % 60000) / 1000),
    };
  }, [target]);
  const [left, setLeft] = useState<TimeLeft>(calc);
  useEffect(() => {
    const iv = setInterval(() => setLeft(calc()), 1000);
    return () => clearInterval(iv);
  }, [calc]);
  return left;
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── CountUp ────────────────────────────────────────────────────────────────
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done.current) return;
      done.current = true;
      let n = 0;
      const step = to / 60;
      const iv = setInterval(() => {
        n = Math.min(n + step, to);
        setVal(Math.floor(n));
        if (n >= to) clearInterval(iv);
      }, 16);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Confetti ───────────────────────────────────────────────────────────────
function launchConfetti() {
  const colors = ['#7c3aed','#a78bfa','#60a5fa','#34d399','#fbbf24','#f472b6'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-particle';
    Object.assign(el.style, {
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * -50}px`,
      background: colors[Math.floor(Math.random() * colors.length)],
      width:  `${6 + Math.random() * 8}px`,
      height: `${6 + Math.random() * 8}px`,
      animationDuration: `${1.5 + Math.random() * 1.5}s`,
      animationDelay:    `${Math.random() * 0.5}s`,
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}

// ─── Data ────────────────────────────────────────────────────────────────────
const START_DATE  = new Date('2026-07-15T09:00:00');
const SEATS_TOTAL = 20;
const SEATS_TAKEN = 14;

const DETAILS = [
  { icon: <User   className="h-6 w-6" />, label: 'Age Group',  value: '8 – 14 Years',   cls: 'bg-violet-50  border-violet-200  text-violet-600'  },
  { icon: <Clock  className="h-6 w-6" />, label: 'Duration',   value: '4 Weeks',         cls: 'bg-blue-50    border-blue-200    text-blue-600'    },
  { icon: <Laptop className="h-6 w-6" />, label: 'Mode',       value: 'Online (Live)',   cls: 'bg-sky-50     border-sky-200     text-sky-600'     },
  { icon: <CreditCard className="h-6 w-6" />, label: 'Fee',    value: '₹2,999',          cls: 'bg-emerald-50 border-emerald-200 text-emerald-600' },
  { icon: <Calendar className="h-6 w-6" />, label: 'Start Date', value: '15 July 2026', cls: 'bg-orange-50  border-orange-200  text-orange-600'  },
];

const OUTCOMES = [
  { icon: <Code2        className="h-5 w-5" />, week: 'Week 1', title: 'Python & Block Coding Fundamentals',  desc: 'Write real code from scratch using Python and block editors. Master variables, loops, and functions.', cls: 'bg-violet-100  text-violet-600'  },
  { icon: <BrainCircuit className="h-5 w-5" />, week: 'Week 2', title: 'Artificial Intelligence Concepts',    desc: 'Machine learning basics, neural networks, and real-world AI applications kids use every day.',        cls: 'bg-blue-100    text-blue-600'    },
  { icon: <Cpu          className="h-5 w-5" />, week: 'Week 3', title: 'Build & Program a Virtual Robot',     desc: 'Design and control a simulated robot using real robotics programming logic and sensors.',             cls: 'bg-sky-100     text-sky-600'     },
  { icon: <Rocket       className="h-5 w-5" />, week: 'Week 4', title: 'AI Capstone Project',                 desc: 'Apply everything to build and present an original AI-powered project — just like a real startup!',   cls: 'bg-orange-100  text-orange-600'  },
  { icon: <Target       className="h-5 w-5" />,               title: 'Problem-Solving & Critical Thinking',  desc: 'Debugging skills, logical reasoning, and systematic problem-solving used by professional engineers.',   cls: 'bg-emerald-100 text-emerald-600' },
  { icon: <Trophy       className="h-5 w-5" />,               title: 'Certificate & Portfolio',               desc: 'Graduate with an official Kidrove certificate and a personal project portfolio.',                    cls: 'bg-pink-100    text-pink-600'    },
];

const FAQS = [
  { q: 'Do students need prior coding experience?',    a: 'Absolutely not! This workshop starts from zero — logical thinking and block coding before Python. Every child is welcome.' },
  { q: 'What equipment or software is required?',     a: 'Just a laptop with Chrome and a stable internet connection. All tools are 100% browser-based — nothing to install.' },
  { q: 'Will students receive a certificate?',        a: 'Yes! Every student who completes the 4-week program receives an official Kidrove Certificate of Completion.' },
  { q: 'What if a student misses a live session?',    a: 'All sessions are recorded and shared within 24 hours on the student dashboard. No one falls behind.' },
  { q: 'Is there a refund policy?',                   a: 'Full refund within 7 days. After the first live session, 50% refund within 14 days.' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma',   role: 'Parent of Arjun, 11',   av: 'PS', text: 'My son finished the workshop and immediately started building his own AI game. The instructors are incredibly patient.' },
  { name: 'Rohan Mehta',    role: 'Parent of Ananya, 13',  av: 'RM', text: 'Absolutely worth every rupee. Ananya went from zero coding to presenting her AI project at the school science fair!' },
  { name: 'Dr. Kavya Nair', role: 'Parent of Dev, 9',      av: 'KN', text: 'Dev\'s logical thinking and creativity have grown immensely. The curriculum is brilliantly designed. Truly special.' },
];

const STATS = [
  { icon: <Users  className="h-6 w-6 text-violet-500" />, val: 2400, suffix: '+',   label: 'Students Trained' },
  { icon: <Star   className="h-6 w-6 text-amber-500"  />, val: 4.9,  suffix: '/5',  label: 'Average Rating'   },
  { icon: <Trophy className="h-6 w-6 text-orange-500" />, val: 98,   suffix: '%',   label: 'Completion Rate'  },
  { icon: <Award  className="h-6 w-6 text-emerald-500"/>, val: 3,    suffix: 'yrs', label: 'Running Strong'   },
];

// ─── Input Field ─────────────────────────────────────────────────────────────
function Field({ id, label, type, name, icon, placeholder, value, error, onChange, disabled }: {
  id: string; label: string; type: string; name: string;
  icon: React.ReactNode; placeholder: string; value: string;
  error?: string; onChange: React.ChangeEventHandler<HTMLInputElement>; disabled: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1.5">{label} *</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">{icon}</span>
        <input
          id={id} type={type} name={name} value={value}
          onChange={onChange} disabled={disabled} placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition bg-gray-50 focus:bg-white ${error ? 'border-red-400 error' : 'border-gray-200 focus:border-violet-400'}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X className="h-3 w-3" />{error}</p>}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function WorkshopLandingPage() {
  const [form, setForm]               = useState<FormData>({ name: '', email: '', phone: '' });
  const [errors, setErrors]           = useState<FormErrors>({});
  const [submitting, setSubmitting]   = useState(false);
  const [status, setStatus]           = useState<'idle'|'success'|'error'>('idle');
  const [errMsg, setErrMsg]           = useState('');
  const [openFaq, setOpenFaq]         = useState<number|null>(null);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [server, setServer]           = useState<'loading'|'online'|'offline'>('loading');
  const [scrolled, setScrolled]       = useState(false);
  const [showCta, setShowCta]         = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const time    = useCountdown(START_DATE);

  // scroll tracking
  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 10); setShowCta(window.scrollY > 600); };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // server health
  useEffect(() => {
    let alive = true;
    const ping = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/health`);
        if (alive) setServer(r.ok ? 'online' : 'offline');
      } catch { if (alive) setServer('offline'); }
    };
    ping();
    const iv = setInterval(ping, 15000);
    return () => { alive = false; clearInterval(iv); };
  }, []);

  // lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors(p => ({ ...p, [name]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim())                    e.name  = 'Full name is required.';
    if (!form.email.trim())                   e.email = 'Email address is required.';
    else if (!EMAIL_RE.test(form.email))      e.email = 'Please enter a valid email.';
    if (!form.phone.trim())                   e.phone = 'Phone number is required.';
    else if (!PHONE_RE.test(form.phone))      e.phone = 'Enter a valid 10–15 digit number.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle'); setErrMsg('');
    if (!validate()) return;
    setSubmitting(true);
    const payload = {
      name:  sanitize(form.name.trim()),
      email: sanitize(form.email.trim()),
      phone: sanitize(form.phone.trim()),
    };
    try {
      const res    = await fetch(`${API_BASE}/api/enquiry`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '' });
        launchConfetti();
      } else {
        setStatus('error');
        if (result.errors) setErrors(result.errors);
        else setErrMsg(result.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrMsg('Unable to reach the server. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setMenuOpen(false);
  };

  const seatsLeft = SEATS_TOTAL - SEATS_TAKEN;
  const seatsPct  = (SEATS_TAKEN / SEATS_TOTAL) * 100;

  // reveal refs
  const heroRef         = useReveal();
  const heroRightRef    = useReveal();
  const statsRef        = useReveal();
  const detailsRef      = useReveal();
  const outcomesRef     = useReveal();
  const faqRef          = useReveal();

  const navLinks = [['#details','Details'],['#outcomes','Curriculum'],['#testimonials','Reviews'],['#faq','FAQ']];

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased">

      {/* ── Banner ── */}
      <div className="bg-gradient-to-r from-violet-700 via-violet-600 to-purple-600 text-white text-center py-2.5 px-4 text-sm font-medium">
        🚀 <strong>Early Bird Open</strong> — Only <strong className="text-yellow-300">{seatsLeft} seats</strong> left for July 2026!{' '}
        <button onClick={scrollToForm} className="underline font-bold hover:no-underline hover:text-yellow-300 transition-colors ml-2">
          Grab Your Seat →
        </button>
      </div>

      {/* ── Header ── */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-violet-100/50' : 'bg-white border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="bg-gradient-to-br from-violet-600 to-purple-700 p-2 rounded-xl">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-gray-900 tracking-tight">Kidrove</span>
              <span className="hidden sm:block text-[10px] text-violet-500 font-semibold tracking-widest uppercase -mt-0.5">Workshops & Camps</span>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-gray-500">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} className="animated-underline hover:text-violet-600 transition-colors py-1">{label}</a>
            ))}
            <button id="nav-enroll-btn" onClick={scrollToForm}
              className="shimmer-btn text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-glow-sm hover:scale-105 active:scale-95">
              Enroll Now — ₹2,999
            </button>
          </nav>

          {/* Mobile toggle */}
          <button id="mobile-menu-btn" className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-violet-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden fixed inset-0 top-[57px] bg-white z-40 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col p-6 gap-1 h-full">
            {([
              { href: '#details',      label: 'Workshop Details', Icon: Target      },
              { href: '#outcomes',     label: 'Curriculum',       Icon: BookOpen    },
              { href: '#testimonials', label: 'Parent Reviews',   Icon: Heart       },
              { href: '#faq',         label: 'FAQ',              Icon: MessageSquare },
            ] as { href: string; label: string; Icon: LucideIcon }[]).map(({ href, label, Icon }) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-600 font-semibold hover:bg-violet-50 hover:text-violet-700 transition-colors">
                <Icon className="h-5 w-5 text-violet-400" />{label}
              </a>
            ))}
            <div className="mt-auto pt-6 border-t border-gray-100">
              <button onClick={scrollToForm} className="w-full shimmer-btn text-white py-4 rounded-2xl font-bold text-lg">
                Enroll Now — ₹2,999
              </button>
              <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1.5">
                <Lock className="h-3 w-3" /> Only {seatsLeft} seats remaining
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden hero-mesh min-h-[90vh] flex items-center">
        <div className="orb w-96 h-96 bg-violet-300 top-10 -left-20 animate-float" />
        <div className="orb w-72 h-72 bg-blue-300 bottom-20 right-10 animate-float-delay" />
        <div className="orb w-56 h-56 bg-purple-200 top-1/2 left-1/2 animate-float-slow" />

        <div className="relative max-w-7xl mx-auto px-5 py-20 lg:py-28 w-full grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div ref={heroRef} className="reveal space-y-7">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-violet-200 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm badge-pulse">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Summer Program · July 2026
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            </div>

            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight">
              AI & Robotics<br />
              <span className="gradient-text">Summer Workshop</span>
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
              A <strong className="text-gray-700">4-week live online</strong> program for young innovators aged <strong className="text-gray-700">8–14</strong>.
              Explore AI, build robots, create real projects — <em>no experience needed.</em>
            </p>

            {/* Countdown */}
            <div className="bg-white/90 backdrop-blur border border-violet-100 rounded-2xl p-5 shadow-card">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-violet-400" /> Workshop Starts In
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[{v:time.days,l:'Days'},{v:time.hours,l:'Hours'},{v:time.minutes,l:'Mins'},{v:time.seconds,l:'Secs'}].map(({v,l}) => (
                  <div key={l} className="text-center bg-gradient-to-b from-violet-50 to-white border border-violet-100 rounded-xl py-3">
                    <div className="countdown-num text-3xl font-black text-violet-700 leading-none">{String(v).padStart(2,'0')}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seats */}
            <div className="bg-white/80 backdrop-blur border border-orange-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-orange-500" /> Seats Taken
                </span>
                <span className="text-sm font-bold text-orange-600">{SEATS_TAKEN}/{SEATS_TOTAL}</span>
              </div>
              <div className="h-2.5 bg-orange-100 rounded-full overflow-hidden">
                <div className="h-full seat-fill rounded-full" style={{ width: `${seatsPct}%`, '--target-width': `${seatsPct}%` } as React.CSSProperties} />
              </div>
              <p className="text-xs text-orange-600 font-semibold mt-1.5">⚡ Only {seatsLeft} seats remaining!</p>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button id="hero-enroll-btn" onClick={scrollToForm}
                className="shimmer-btn text-white px-8 py-4 rounded-2xl font-bold text-base shadow-glow-violet hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group">
                Enroll Now — ₹2,999
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#outcomes" className="flex items-center gap-2 bg-white/80 backdrop-blur border border-gray-200 hover:border-violet-300 text-gray-600 hover:text-violet-600 px-7 py-4 rounded-2xl font-bold text-base transition-all group">
                <Play className="h-4 w-4 group-hover:text-violet-500" /> View Curriculum
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-semibold text-gray-400">
              {[
                [<Shield className="h-3.5 w-3.5 text-emerald-500" />, 'Safe & Certified'],
                [<Globe  className="h-3.5 w-3.5 text-blue-500"    />, '100% Online'],
                [<Award  className="h-3.5 w-3.5 text-orange-500"  />, 'Certificate Included'],
                [<Wifi   className="h-3.5 w-3.5 text-violet-500"  />, 'Session Recordings'],
              ].map(([icon, text]) => (
                <span key={text as string} className="flex items-center gap-1.5">{icon} {text}</span>
              ))}
            </div>
          </div>

          {/* Right — Glassy card */}
          <div ref={heroRightRef} className="reveal reveal-right delay-200 space-y-4">
            <div className="rounded-3xl overflow-hidden border border-violet-100/60 shadow-card bg-gradient-to-br from-violet-50 to-purple-50">
              <img src="/hero-illustration.png" alt="Child learning AI and Robotics" className="w-full h-56 object-cover object-top" />
            </div>
            <div className="glass rounded-3xl shadow-card-hover p-7 space-y-5 border border-white/60">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-gray-900 text-lg">Workshop at a Glance</h3>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Filling Fast
                </span>
              </div>

              <div className="space-y-1">
                {[
                  { label: 'Start Date', val: '15 July 2026',        color: 'text-orange-600',           icon: <Calendar    className="h-4 w-4" /> },
                  { label: 'Duration',   val: '4 Weeks · Live Online', color: 'text-blue-600',            icon: <Clock       className="h-4 w-4" /> },
                  { label: 'Age Group',  val: '8 – 14 Years',         color: 'text-violet-600',           icon: <User        className="h-4 w-4" /> },
                  { label: 'Batch Size', val: 'Max 20 Students',      color: 'text-sky-600',              icon: <Users       className="h-4 w-4" /> },
                  { label: 'Fee',        val: '₹2,999 (Early Bird)',   color: 'text-emerald-600 font-extrabold', icon: <CreditCard  className="h-4 w-4" /> },
                ].map(({ label, val, color, icon }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <span className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <span className="text-gray-300">{icon}</span>{label}
                    </span>
                    <span className={`text-sm font-bold ${color}`}>{val}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 py-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                <span className="text-sm text-gray-600 font-semibold">4.9/5</span>
                <span className="text-xs text-gray-400">from 120+ parent reviews</span>
              </div>

              <div className="bg-violet-50 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-2">✨ What's Included</p>
                {['20 live interactive sessions','Recorded session access','Personal project portfolio','Official completion certificate','Mentor Q&A support'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-violet-500 flex-shrink-0" />{item}
                  </div>
                ))}
              </div>

              <button onClick={scrollToForm}
                className="w-full shimmer-btn text-white py-4 rounded-2xl font-extrabold text-base shadow-glow-violet hover:scale-[1.02] active:scale-98 transition-all">
                Reserve My Seat Now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-gradient-to-r from-violet-900 via-violet-800 to-purple-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div ref={statsRef} className="reveal relative max-w-7xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ icon, val, suffix, label }) => (
            <div key={label} className="text-center space-y-1">
              <div className="flex justify-center mb-2">{icon}</div>
              <div className="text-4xl font-black">
                {suffix === '/5' ? <span>{val}{suffix}</span> : <CountUp to={val as number} suffix={suffix} />}
              </div>
              <div className="text-violet-300 text-sm font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Workshop Details ── */}
      <section id="details" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div ref={detailsRef} className="reveal text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-600 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              <Layers className="h-4 w-4" /> Workshop Overview
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-3">Everything You Need to Know</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">All important details about our AI & Robotics Summer Workshop at a glance.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {DETAILS.map(({ icon, label, value, cls }, i) => (
              <div key={label} className={`reveal card-hover flex flex-col items-center text-center border p-7 rounded-2xl gap-4 shadow-card hover:shadow-card-hover ${cls.split(' ')[0]} ${cls.split(' ')[1]}`} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className={`p-3.5 rounded-2xl border ${cls.split(' ')[0]} ${cls.split(' ')[1]}`}>
                  <div className={cls.split(' ')[2]}>{icon}</div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-base font-extrabold text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Outcomes + Form ── */}
      <section id="outcomes" className="py-24 bg-gray-50/80 section-mesh border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-12 gap-14">

          {/* Curriculum */}
          <div ref={outcomesRef} className="reveal lg:col-span-7 space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                <GraduationCap className="h-4 w-4" /> 4-Week Curriculum
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-3">What Will Your Child Learn?</h2>
              <p className="text-gray-500 text-lg">Our structured curriculum builds skills progressively — from basics to building real AI projects.</p>
            </div>

            <div className="space-y-4">
              {OUTCOMES.map(({ icon, week, title, desc, cls }, i) => (
                <div key={i} className="reveal card-hover group flex gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-violet-200 hover:shadow-card-hover shadow-card" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="flex-shrink-0">
                    <div className={`w-11 h-11 ${cls} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>{icon}</div>
                  </div>
                  <div>
                    {week && <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-1.5 ${cls}`}>{week}</span>}
                    <h3 className="font-extrabold text-gray-800 mb-1 group-hover:text-violet-700 transition-colors">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div ref={faqRef} id="faq" className="pt-4">
              <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-600 px-4 py-1.5 rounded-full text-sm font-bold mb-5">
                <MessageSquare className="h-4 w-4" /> Got Questions?
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-7">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {FAQS.map((faq, i) => (
                  <div key={i} className={`border rounded-2xl overflow-hidden transition-all cursor-pointer shadow-sm ${openFaq === i ? 'border-violet-300 shadow-glow-sm' : 'border-gray-200 hover:border-violet-200'}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <div className={`flex items-center justify-between px-6 py-4 transition-colors ${openFaq === i ? 'bg-violet-50' : 'bg-white hover:bg-violet-50/40'}`}>
                      <p className="font-semibold text-gray-800 pr-4 text-sm leading-relaxed">{faq.q}</p>
                      <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${openFaq === i ? 'bg-violet-600 text-white rotate-180' : 'bg-gray-100 text-gray-400'}`}>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                    <div className={`faq-content ${openFaq === i ? 'open' : ''}`}>
                      <div className="px-6 py-4 bg-white border-t border-violet-100 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Form */}
          <div className="lg:col-span-5" ref={formRef}>
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-card-hover overflow-hidden">

                {/* Form header */}
                <div className="relative bg-gradient-to-br from-violet-700 via-violet-600 to-purple-700 px-7 py-7 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-x-10 -translate-y-10" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-x-5 translate-y-10" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="h-5 w-5 text-violet-200" />
                      <h3 className="text-xl font-extrabold">Register for the Workshop</h3>
                    </div>
                    <p className="text-violet-200 text-sm">Fill in your details — we'll confirm your seat within 24 hours.</p>
                    <div className="flex items-center gap-2 mt-5 bg-white/15 rounded-xl px-4 py-3 backdrop-blur">
                      <Zap className="h-4 w-4 text-yellow-300 flex-shrink-0" />
                      <span className="text-sm font-bold"><span className="text-yellow-300">₹2,999 only</span> · {seatsLeft} seats left</span>
                    </div>
                  </div>
                </div>

                <div className="px-7 py-6">
                  {/* Server status pill */}
                  <div className="mb-5">
                    {server === 'online' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Registration system live
                      </span>
                    ) : server === 'loading' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full font-semibold">
                        <Loader2 className="h-3 w-3 animate-spin" /> Connecting...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Demo mode
                      </span>
                    )}
                  </div>

                  {status === 'success' ? (
                    <div className="text-center py-8 space-y-4 animate-scale-in">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto animate-confetti">
                        <CheckCircle className="h-10 w-10 text-emerald-600" />
                      </div>
                      <h4 className="text-2xl font-black text-gray-900">You're Registered! 🎉</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Our team will contact you within <strong>24 hours</strong> to confirm your seat and share login details.
                      </p>
                      <div className="bg-violet-50 rounded-2xl p-4 text-sm text-violet-700 font-medium space-y-1 text-left">
                        {['Seat confirmed for July 2026','Confirmation email on the way','WhatsApp group invite soon'].map(item => (
                          <div key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-violet-500" />{item}</div>
                        ))}
                      </div>
                      <button onClick={() => setStatus('idle')}
                        className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl font-semibold transition text-sm border border-gray-200">
                        Register Another Student
                      </button>
                    </div>
                  ) : (
                    <form id="registration-form" onSubmit={handleSubmit} noValidate className="space-y-4">
                      <Field id="name-input"  label="Full Name"     type="text"  name="name"  icon={<User      className="h-4 w-4" />} placeholder="e.g. Rahul Sharma"    value={form.name}  error={errors.name}  onChange={handleChange} disabled={submitting} />
                      <Field id="email-input" label="Email Address" type="email" name="email" icon={<Mail      className="h-4 w-4" />} placeholder="you@example.com"       value={form.email} error={errors.email} onChange={handleChange} disabled={submitting} />
                      <Field id="phone-input" label="Phone Number"  type="tel"   name="phone" icon={<PhoneCall className="h-4 w-4" />} placeholder="+91 98765 43210"      value={form.phone} error={errors.phone} onChange={handleChange} disabled={submitting} />

                      {errMsg && (
                        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
                          <X className="h-4 w-4 flex-shrink-0 mt-0.5" />{errMsg}
                        </div>
                      )}

                      <button id="submit-form-btn" type="submit" disabled={submitting}
                        className="w-full shimmer-btn disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-extrabold text-base transition-all mt-1 flex items-center justify-center gap-2 shadow-glow-violet hover:scale-[1.02] active:scale-98">
                        {submitting
                          ? <><Loader2 className="h-5 w-5 animate-spin" /> Submitting...</>
                          : <>Secure My Seat — ₹2,999 <ArrowRight className="h-4 w-4" /></>
                        }
                      </button>

                      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5 mt-1">
                        <Lock className="h-3 w-3" /> 100% secure · Never shared · Refund available
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
        <div className="orb w-96 h-96 bg-violet-100 -top-20 -right-20" />
        <div className="orb w-72 h-72 bg-blue-100 bottom-10 -left-20" />
        <div className="relative max-w-7xl mx-auto px-5">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              <Star className="h-4 w-4" /> Parent Reviews
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-3">What Parents Are Saying</h2>
            <p className="text-gray-500 text-lg">Real reviews from 120+ parents who enrolled their children.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, av, text }, i) => (
              <div key={i} className="reveal card-hover testimonial-card rounded-2xl p-7 shadow-card hover:shadow-card-hover" style={{ transitionDelay: `${i * 0.1}s` }}>
                <Quote className="h-8 w-8 text-violet-200 mb-4" />
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{av}</div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{name}</p>
                    <p className="text-xs text-gray-400">{role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rating summary */}
          <div className="mt-12 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="text-center">
              <div className="text-6xl font-black gradient-text">4.9</div>
              <div className="flex justify-center gap-0.5 mt-1">{[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}</div>
              <p className="text-gray-500 text-sm mt-1">out of 5</p>
            </div>
            <div className="flex-1 space-y-2 w-full max-w-md">
              {[['Curriculum Quality',98],['Instructor Engagement',97],['Value for Money',95],['Technical Support',93]].map(([label, pct]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-36 flex-shrink-0">{label}</span>
                  <div className="flex-1 h-2 bg-violet-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-bold text-violet-600 w-8 text-right">{pct}%</span>
                </div>
              ))}
            </div>
            <div className="text-center md:text-right">
              <p className="text-4xl font-black text-gray-900">120+</p>
              <p className="text-gray-500 text-sm">verified reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-24 bg-gradient-to-br from-violet-900 via-violet-800 to-purple-900 overflow-hidden text-white text-center">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(167,139,250,0.5) 0%, transparent 70%)' }} />
        <div className="relative max-w-3xl mx-auto px-5 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 text-violet-200 px-4 py-2 rounded-full text-sm font-bold">
            <Rocket className="h-4 w-4" /> Limited Seats Available
          </div>
          <h2 className="text-5xl font-black">Start Your Child's <span className="gradient-text-warm">AI Journey</span> Today</h2>
          <p className="text-violet-200 text-lg">Join 2,400+ students who've already discovered the future of technology with Kidrove.</p>
          <button onClick={scrollToForm}
            className="bg-white text-violet-700 hover:bg-violet-50 px-10 py-4 rounded-2xl font-extrabold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto">
            Enroll Now — ₹2,999 <ArrowRight className="h-5 w-5" />
          </button>
          <p className="text-violet-300 text-sm">✓ Full refund within 7 days  ·  ✓ Certificate included  ·  ✓ Batch starts 15 July 2026</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-violet-600 to-purple-700 p-2 rounded-xl">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-white text-xl tracking-tight">Kidrove</span>
                <span className="block text-[10px] text-violet-400 font-semibold uppercase tracking-widest">Workshops & Camps</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm font-medium">
              {['Privacy Policy','Terms of Service','Contact Us','Refund Policy'].map(link => (
                <a key={link} href="#" className="hover:text-white transition-colors animated-underline">{link}</a>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 text-sm">
            <p>© 2026 Kidrove Workshops. All rights reserved.</p>
            <p className="flex items-center gap-1.5">Made with <Heart className="h-3.5 w-3.5 text-violet-500 fill-violet-500" /> for young innovators across India</p>
          </div>
        </div>
      </footer>

      {/* ── Mobile sticky CTA ── */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 sticky-cta bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-3 flex items-center gap-3 transition-all duration-500 ${showCta ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-medium truncate">AI & Robotics Workshop</p>
          <p className="font-extrabold text-gray-900 text-sm">₹2,999 · Starts 15 July 2026</p>
        </div>
        <button onClick={scrollToForm} className="shimmer-btn text-white px-6 py-3 rounded-xl font-bold text-sm flex-shrink-0 flex items-center gap-1.5">
          Enroll Now <ChevronRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
