/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { 
  Globe, 
  Gamepad2, 
  Settings, 
  Terminal, 
  Music, 
  Maximize2, 
  Minimize2, 
  X, 
  Search,
  Monitor,
  Shield,
  EyeOff,
  Clock,
  Battery,
  Wifi,
  MoreVertical,
  Minus,
  Sparkles,
  Rss,
  MessageCircle,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Compass,
  ArrowRight,
  RotateCcw,
  Volume2,
  Filter,
  Box,
  VolumeX,
  History,
  Info,
  LayoutGrid,
  Zap,
  Lock,
  ExternalLink,
  ChevronRight,
  Plus,
  Trash2,
  Bell,
  Trash
} from 'lucide-react';

// --- Constants & Types ---

type AppId = 'browser' | 'games' | 'settings' | 'music' | 'terminal' | 'wallpapers';

interface OpenWindow {
  id: AppId;
  isMinimized: boolean;
  zIndex: number;
  url?: string; // Optional URL for browser
  title?: string;
}

const TOP_SITES = [
  { name: 'YouTube', url: 'https://www.youtube.com', icon: '🔴', color: 'text-red-500' },
  { name: 'Discord', url: 'https://discord.com/app', icon: '👔', color: 'text-indigo-400' },
  { name: 'TikTok', url: 'https://www.tiktok.com', icon: '🎵', color: 'text-white' },
  { name: 'Roblox', url: 'https://www.roblox.com', icon: '🧱', color: 'text-gray-400' },
];

interface AppConfig {
  id: AppId;
  title: string;
  icon: React.ElementType;
  color: string;
}

const APPS: AppConfig[] = [
  { id: 'browser', title: 'Browser', icon: Compass, color: 'text-emerald-400' },
  { id: 'games', title: 'Games', icon: Gamepad2, color: 'text-blue-400' },
  { id: 'music', title: 'Music', icon: Music, color: 'text-pink-400' },
  { id: 'wallpapers', title: 'Wallpapers', icon: Monitor, color: 'text-orange-400' },
  { id: 'settings', title: 'Settings', icon: Settings, color: 'text-slate-400' },
];

const CLOAK_PRESETS = [
  { name: 'Default', title: 'KoopBin V2', icon: '/favicon.ico' },
  { name: 'Google', title: 'Google', icon: 'https://www.google.com/favicon.ico' },
  { name: 'Classes', title: 'Classes', icon: 'https://ssl.gstatic.com/classroom/favicon.png' },
  { name: 'Canvas', title: 'Dashboard', icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico' },
  { name: 'Clever', title: 'Clever | Portal', icon: 'https://clever.com/favicon.ico' },
];

const BOOT_STEPS = [
  { id: 'welcome', label: 'Welcome to KoopBin', progress: 15 },
  { id: 'auth', label: 'Checking your session...', progress: 38 },
  { id: 'assets', label: 'Fetching wallpapers & assets...', progress: 62 },
  { id: 'apps', label: 'Getting everything ready...', progress: 84 },
  { id: 'done', label: 'Almost there...', progress: 100 },
];

// --- Components ---

function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= BOOT_STEPS.length) {
        clearInterval(interval);
        setStep(BOOT_STEPS.length - 1);
        setProgress(100);
        setTimeout(() => {
          setIsFinishing(true);
          setTimeout(onComplete, 600);
        }, 500);
      } else {
        setStep(currentStep);
        setProgress(BOOT_STEPS[currentStep].progress);
      }
    }, 600);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] bg-[#070707] flex flex-col items-center justify-center font-sans"
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ background: 'radial-gradient(circle at 50% 50%, #2a2a2a, transparent 70%)' }} />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-16"
      >
        <div className="w-20 h-20 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-2xl">
          <Zap className="text-white w-10 h-10 fill-white" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white">
          koop<span className="text-gray-500 font-light">bin</span>
        </h1>
        <p className="text-[10px] text-gray-600 mt-2 tracking-[0.3em] uppercase">Accessibility made global</p>
      </motion.div>

      <div className="w-64 space-y-3">
        <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-white/40"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.p 
            key={step}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-[11px] text-gray-500 text-center"
          >
            {BOOT_STEPS[step].label}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

interface WindowProps {
  id: AppId;
  key?: any;
  title: string;
  icon: any;
  color: string;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  zIndex: number;
  initialX?: number;
  initialY?: number;
  children: React.ReactNode;
}

function Window({ 
  id, 
  title, 
  icon: Icon, 
  color,
  isActive, 
  onFocus, 
  onClose, 
  onMinimize, 
  zIndex,
  initialX = 40,
  initialY = 60,
  children 
}: WindowProps) {
  const controls = useDragControls();

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragListener={false}
      dragControls={controls}
      initial={{ scale: 0.95, opacity: 0, x: initialX, y: initialY + 20 }}
      animate={{ scale: 1, opacity: 1, x: initialX, y: initialY }}
      exit={{ scale: 0.95, opacity: 0, x: initialX, y: initialY + 20 }}
      onPointerDown={(e) => {
        if (!isActive) onFocus();
      }}
      style={{ zIndex }}
      id={`window-${id}`}
      className={`absolute w-[800px] h-[540px] max-w-[95vw] max-h-[80vh] flex flex-col rounded-2xl border overflow-hidden shadow-2xl glass pointer-events-auto ${isActive ? 'border-white/20' : 'border-white/10 opacity-90'}`}
    >
      <div 
        className="h-10 px-3 flex items-center justify-between border-b border-white/5 bg-white/5 select-none shrink-0"
        onPointerDown={(e) => controls.start(e)}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" onPointerDown={e => e.stopPropagation()}>
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-400 transition-colors border border-rose-600" />
            <button onClick={onMinimize} className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-400 transition-colors border border-amber-600" />
            <button className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-400 transition-colors border border-emerald-600" />
          </div>
          <div className="flex items-center gap-2 ml-1">
            <Icon className={`w-3.5 h-3.5 ${color}`} />
            <span className="text-[12px] font-semibold text-white/80 tracking-wide">{title}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 opacity-40">
          <Search size={14} className="text-white" />
          <MoreVertical size={14} className="text-white" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto relative bg-black/20 music-scroll">
        {children}
      </div>
    </motion.div>
  );
}

// --- App Modules ---

function BrowserApp({ initialUrl }: { initialUrl?: string }) {
  const [tabs, setTabs] = useState([{ id: '1', title: 'New Tab', url: initialUrl || '' }]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [input, setInput] = useState('');

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    if (initialUrl && activeTab.url === '') {
      updateTab(activeTabId, { url: initialUrl, title: 'Loading...' });
    }
  }, [initialUrl]);

  const updateTab = (id: string, updates: Partial<{ url: string, title: string }>) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleGo = (e?: React.FormEvent, targetUrl?: string) => {
    if (e) e.preventDefault();
    let target = targetUrl || input.trim();
    if (!target) return;
    
    if (target.includes('.') && !target.includes(' ')) {
      if (!/^https?:\/\//i.test(target)) target = 'https://' + target;
    } else {
      target = `https://duckduckgo.com/?q=${encodeURIComponent(target)}&kp=-1&kl=wt-wt`;
    }
    
    const finalUrl = (!target.includes('google.com') && !target.includes('duckduckgo.com') && target.startsWith('http')) 
      ? `/api/proxy?url=${encodeURIComponent(target)}` 
      : target;
      
    updateTab(activeTabId, { url: finalUrl, title: target.replace('https://', '').split('/')[0] });
    setInput('');
  };

  const addTab = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setTabs([...tabs, { id, title: 'New Tab', url: '' }]);
    setActiveTabId(id);
    setInput('');
  };

  const removeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) setActiveTabId(newTabs[newTabs.length - 1].id);
  };

  const QUICK_LINKS = [
    { name: 'Minecraft Classic', url: 'https://classic.minecraft.net' },
    { name: 'FreezeNova', url: 'https://freezenova.com' },
    { name: 'now.gg', url: 'https://now.gg' },
    { name: 'YouTube', url: 'https://www.youtube.com' },
    { name: 'GitHub', url: 'https://github.com' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0d0d0f] text-slate-300">
      {/* Tabs Bar */}
      <div className="h-9 bg-[#070707] flex items-center px-2 gap-1 overflow-x-auto music-scroll">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            onClick={() => { setActiveTabId(tab.id); setInput(tab.url || ''); }}
            className={`group h-[28px] min-w-[120px] max-w-[180px] flex items-center px-3 rounded-t-lg cursor-pointer transition-all ${activeTabId === tab.id ? 'bg-[#1a1a1c] text-white border-t border-x border-white/5' : 'hover:bg-white/5 text-gray-500'}`}
          >
            <span className="text-[11px] font-medium truncate flex-1">{tab.title}</span>
            <X 
              size={12} 
              className={`hover:text-white transition-opacity ${activeTabId === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} 
              onClick={(e) => removeTab(e, tab.id)}
            />
          </div>
        ))}
        <button onClick={addTab} className="p-1.5 hover:bg-white/5 rounded-full text-gray-500 hover:text-white">
          <Plus size={14} />
        </button>
      </div>

      {/* Nav Bar */}
      <div className="h-10 border-b border-white/5 bg-[#1a1a1c] flex items-center px-3 gap-3">
        <div className="flex gap-1">
          <button className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500"><SkipBack size={14} /></button>
          <button className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500"><SkipForward size={14} /></button>
          <button onClick={() => updateTab(activeTabId, { url: activeTab.url })} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500"><RotateCcw size={14} /></button>
        </div>
        <form onSubmit={handleGo} className="flex-1">
          <div className="flex items-center bg-[#070707]/60 border border-white/5 rounded-xl px-3 py-1 focus-within:border-white/20 transition-all">
            <Globe size={12} className="text-gray-600 mr-2" />
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-[12px] w-full placeholder:text-gray-600"
              placeholder="Search or enter URL..."
              onPointerDown={e => e.stopPropagation()}
            />
          </div>
        </form>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold">
           Stealth Node
        </div>
      </div>

      {/* Scripts/Quick Links Row */}
      <div className="h-9 border-b border-white/5 bg-[#1a1a1c] flex items-center px-3 justify-between">
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-black tracking-widest uppercase">
             / SCRIPTS
           </button>
           <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
              {QUICK_LINKS.map(link => (
                <button 
                  key={link.name} 
                  onClick={() => handleGo(undefined, link.url)}
                  className="text-[11px] font-bold text-gray-500 hover:text-white transition-colors whitespace-nowrap"
                >
                  {link.name}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Warning Bar */}
      <div className="h-8 bg-amber-500/5 border-b border-amber-500/10 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
           <Zap size={12} className="text-amber-500" />
           <p className="text-[10px] font-bold text-amber-500/80">
             Proxy is active <span className="text-amber-500/40 ml-1 font-medium italic">Enable in Settings → Browser to toggle node bypass.</span>
           </p>
        </div>
        <button className="px-3 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest">Active</button>
      </div>
      
      {/* Viewport */}
      <div className="flex-1 relative bg-white overflow-hidden">
        {(!activeTab.url || activeTab.url === '') ? (
          <div className="absolute inset-0 bg-[#0d0d0f] z-10 p-10 flex flex-col items-center justify-center overflow-y-auto music-scroll">
            <div className="flex flex-col items-center mb-12">
               <h2 className="text-[120px] font-black text-white tracking-tighter leading-none select-none drop-shadow-[0_20px_50px_rgba(255,255,255,0.1)]">KoopSurf</h2>
               <p className="text-[11px] text-gray-600 uppercase tracking-[0.4em] font-black font-mono">Search the Web — Powered by DuckDuckGo</p>
            </div>
            
            <form onSubmit={handleGo} className="w-full max-w-xl group">
              <div className="relative flex items-center">
                <Search className="absolute left-6 text-gray-500 group-focus-within:text-white transition-colors" size={20} />
                <input 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Search with DuckDuckGo or enter a URL"
                  className="w-full h-16 glass rounded-full border border-white/10 px-16 text-lg text-white font-medium focus:border-white/30 outline-none transition-all placeholder:text-gray-600 shadow-2xl"
                  onPointerDown={e => e.stopPropagation()}
                />
                <button 
                  type="submit"
                  className="absolute right-4 px-6 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-sm transition-all flex items-center justify-center border border-white/5"
                >
                  Go
                </button>
              </div>
            </form>

            <div className="mt-16 w-full max-w-2xl text-center">
               <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-6">Quick Links</h3>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TOP_SITES.map(site => (
                    <button 
                      key={site.name}
                      onClick={() => handleGo(undefined, site.url)}
                      className="p-4 glass rounded-2xl border border-white/5 hover:border-white/15 transition-all text-left flex items-center gap-3"
                    >
                      <span className="text-xl">{site.icon}</span>
                      <span className="text-[11px] font-bold text-white/60">{site.name}</span>
                    </button>
                  ))}
               </div>
            </div>
          </div>
        ) : null}
        
        <iframe 
          key={activeTab.id + activeTab.url}
          src={activeTab.url || undefined} 
          className="w-full h-full border-none" 
          title="Browser" 
          referrerPolicy="no-referrer"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        />
      </div>
    </div>
  );
}

function GamesApp() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  
  const categories = [
    { name: 'All 898', val: 'All' },
    { name: 'FPS 37', val: 'FPS' },
    { name: 'Nexora !', val: 'Nexora' },
    { name: 'Webports 391', val: 'Webports' },
    { name: 'FreezeNova !', val: 'FreezeNova' },
    { name: '3kh0 !', val: '3kh0' },
    { name: 'Selenite 266', val: 'Selenite' },
    { name: 'NettleWeb !', val: 'NettleWeb' },
    { name: 'Slept-MS !', val: 'Slept-MS' },
    { name: 'GFiles !', val: 'GFiles' },
    { name: 'UGS 354', val: 'UGS' },
  ];

  const games = [
    { id: 1, title: '1 Date Danger', color: 'bg-emerald-400' },
    { id: 2, title: '1 on 1 Soccer', thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80', color: 'bg-blue-400' },
    { id: 3, title: '10 Minutes Till Dawn', thumbnail: 'https://images.unsplash.com/photo-1614732414444-af96b3f5f37f?w=400&q=80', color: 'bg-red-400' },
    { id: 4, title: '1v1.lol', thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80', color: 'bg-indigo-400' },
    { id: 5, title: '2 3 4 Player Game', color: 'bg-emerald-400' },
    { id: 6, title: '2 Minute Football', color: 'bg-emerald-400' },
    { id: 7, title: '2048', thumbnail: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&q=80', color: 'bg-blue-400' },
    { id: 8, title: '2D Rocket League', thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80', color: 'bg-blue-400' },
    { id: 9, title: '2doom', color: 'bg-emerald-400' },
    { id: 10, title: '3dash', color: 'bg-emerald-400' },
    { id: 11, title: '8 Pool', thumbnail: 'https://images.unsplash.com/photo-1552710307-537199742ef8?w=400&q=80', color: 'bg-purple-400' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0d0d0f] text-slate-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white leading-none">Games</h2>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold">898 games · 898 shown</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-white/5 hover:border-white/10 text-[11px] font-bold text-gray-400 transition-all">
            <RotateCcw size={12} /> Refresh
          </button>
        </div>

        {/* Search */}
        <div className="relative group mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-white transition-colors" size={16} />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search games..."
            className="w-full h-12 bg-[#1a1a1c] border border-white/5 rounded-2xl px-12 text-sm text-white focus:border-white/20 outline-none transition-all"
            onPointerDown={e => e.stopPropagation()}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          <button className="p-2 glass rounded-lg text-gray-500 hover:text-white transition-all scale-95">
            <Filter size={14} />
          </button>
          {categories.map(cat => (
            <button 
              key={cat.name}
              onClick={() => setFilter(cat.val)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-bold whitespace-nowrap transition-all ${
                filter === cat.val 
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400' 
                : 'bg-[#1a1a1c] border-white/5 text-gray-400 hover:border-white/10'
              }`}
            >
              {cat.name.split(' !')[0]} 
              {cat.name.includes('!') && <span className="text-red-500">!</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto music-scroll px-6 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {games.map(game => (
            <button 
              key={game.id}
              className="group aspect-[4/3] glass rounded-3xl border border-white/5 hover:border-white/15 transition-all overflow-hidden flex flex-col items-stretch text-left"
            >
              <div className="relative flex-1 bg-[#1a1a1c]">
                {game.thumbnail ? (
                  <img src={game.thumbnail || undefined} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700">
                    <Box size={40} />
                  </div>
                )}
                <div className={`absolute top-2 left-2 w-2 h-2 rounded-full ${game.color} shadow-[0_0_8px_rgba(255,255,255,0.3)]`} />
              </div>
              <div className="h-10 px-4 flex items-center bg-black/40">
                <span className="text-[11px] font-bold text-gray-400 group-hover:text-white transition-colors truncate">{game.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsApp({ cloak, setCloak, setTheme, theme, performance, setPerformance, animations, setAnimations }: any) {
  const launchAboutBlank = () => {
    const win = window.open('about:blank', '_blank');
    if (win) {
      const iframe = win.document.createElement('iframe');
      iframe.src = window.location.href;
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100vw';
      iframe.style.height = '100vh';
      iframe.style.border = 'none';
      win.document.body.appendChild(iframe);
      win.document.body.style.margin = '0';
      win.document.body.style.padding = '0';
      win.document.title = 'Google Docs'; // Default stealth title
      window.location.replace('https://www.google.com'); // Leave the current tab
    } else {
      alert('Pop-up blocked! Please allow pop-ups to use Stealth Mode.');
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-2xl mx-auto">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Security & Stealth</h3>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-widest border border-emerald-500/20">Active</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
           <button 
             onClick={launchAboutBlank}
             className="p-4 glass rounded-2xl border border-white/5 hover:border-indigo-500/30 group transition-all flex items-center justify-between"
           >
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <ExternalLink size={18} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-white">Launch in about:blank</p>
                  <p className="text-[10px] text-gray-500">Opens the app in a hidden window and redirects this tab.</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-gray-600 group-hover:text-indigo-400 transition-colors" />
           </button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Tab Cloaking</h3>
        <div className="grid grid-cols-2 gap-2">
          {CLOAK_PRESETS.map(p => (
            <button key={p.name} onClick={() => setCloak(p)} className={`p-4 glass rounded-2xl border transition-all flex items-center gap-3 ${cloak.name === p.name ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-white/5 hover:border-white/15'}`}>
              <img src={p.icon || undefined} className="w-6 h-6 rounded" alt="" />
              <span className="text-[12px] font-medium text-white">{p.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Performance & UI</h3>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => setAnimations(!animations)}
            className={`p-4 glass rounded-2xl border transition-all flex items-center justify-between ${animations ? 'border-white/20 bg-white/5' : 'border-white/5 opacity-60'}`}
          >
            <div className="flex items-center gap-3">
              <Sparkles size={16} className={animations ? 'text-emerald-400' : 'text-gray-500'} />
              <span className="text-[12px] font-medium text-white">Animations</span>
            </div>
            <div className={`w-8 h-4 rounded-full transition-colors flex items-center p-0.5 ${animations ? 'bg-emerald-500' : 'bg-gray-600'}`}>
               <div className={`w-3 h-3 bg-white rounded-full transition-transform ${animations ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>
          
          <button 
            onClick={() => setPerformance(!performance)}
            className={`p-4 glass rounded-2xl border transition-all flex items-center justify-between ${performance ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <Zap size={16} className={performance ? 'text-amber-400' : 'text-gray-500'} />
              <span className="text-[12px] font-medium text-white">Performance Mode</span>
            </div>
            <div className={`w-8 h-4 rounded-full transition-colors flex items-center p-0.5 ${performance ? 'bg-amber-500' : 'bg-gray-600'}`}>
               <div className={`w-3 h-3 bg-white rounded-full transition-transform ${performance ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">System Themes</h3>
        <div className="grid grid-cols-3 gap-2">
          {['Midnight', 'Forest', 'Ocean'].map(t => (
            <button 
              key={t} 
              onClick={() => setTheme(t.toLowerCase())} 
              className={`p-4 glass rounded-2xl border transition-all text-[12px] font-medium text-white ${theme === t.toLowerCase() ? 'border-indigo-500/40 text-indigo-400 bg-indigo-500/5' : 'border-white/5 hover:border-white/15'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4 items-start">
        <Shield size={20} className="text-indigo-400 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-indigo-200">History Scrubbing Active</p>
          <p className="text-[11px] text-indigo-100/60 leading-relaxed">Local session history is automatically replaced with "about:blank" on boot to avoid device tracking.</p>
        </div>
      </div>
    </div>
  );
}

function WallpapersApp({ setWallpaper }: any) {
  const [wps, setWps] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/wallpapers')
      .then(res => res.json())
      .then(setWps);
  }, []);

  return (
    <div className="p-6 grid grid-cols-2 gap-4">
      <button 
        onClick={() => setWallpaper('')}
        className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 glass hover:border-white/30 transition-all flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-600/10"
      >
        <span className="relative text-[11px] font-bold text-white uppercase tracking-widest">Default</span>
      </button>
      {wps.map(wp => (
        <button 
          key={wp.id} 
          onClick={() => setWallpaper(wp.url)}
          className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all"
        >
          <img src={wp.url || undefined} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
        </button>
      ))}
    </div>
  );
}

function AppContent({ id, setCloak, setTheme, theme, setWallpaper, cloak, performance, setPerformance, animations, setAnimations, winUrl }: any) {
  switch (id) {
    case 'browser': return <BrowserApp initialUrl={winUrl} />;
    case 'games': return <GamesApp />;
    case 'wallpapers': return <WallpapersApp setWallpaper={setWallpaper} />;
    case 'settings': return (
      <SettingsApp 
        cloak={cloak} 
        setCloak={setCloak} 
        setTheme={setTheme} 
        theme={theme}
        performance={performance}
        setPerformance={setPerformance}
        animations={animations}
        setAnimations={setAnimations}
      />
    );
    default: return (
      <div className="flex flex-col items-center justify-center h-full p-10 opacity-30 text-center">
        <Monitor size={64} className="mb-4" />
        <p className="text-xl font-bold">App Stub</p>
        <p className="text-xs text-gray-500 mt-2">This feature is ready for integration.</p>
      </div>
    );
  }
}

// --- Main OS Component ---

export default function App() {
  const [booting, setBooting] = useState(false);
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [activeWindow, setActiveWindow] = useState<AppId | null>(null);
  const [zIndex, setZIndex] = useState(10);
  
  // Persistence States
  const [cloak, setCloak] = useState(() => {
    const saved = localStorage.getItem('kp_cloak');
    return saved ? JSON.parse(saved) : CLOAK_PRESETS[0];
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('kp_theme') || 'midnight');
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('kp_wallpaper') || '');
  const [performance, setPerformance] = useState(() => localStorage.getItem('kp_performance') === 'true');
  const [animations, setAnimations] = useState(() => localStorage.getItem('kp_animations') !== 'false');

  const [time, setTime] = useState(new Date());
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [isPanic, setIsPanic] = useState(false);
  const [showHistoryToast, setShowHistoryToast] = useState(false);

  useEffect(() => {
    // History Scrubbing
    window.history.replaceState({}, '', '/');
    setShowHistoryToast(true);
    const timer = setTimeout(() => setShowHistoryToast(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('kp_cloak', JSON.stringify(cloak));
    document.title = cloak.title;
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) link.href = cloak.icon;
  }, [cloak]);

  useEffect(() => {
    localStorage.setItem('kp_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('kp_wallpaper', wallpaper);
  }, [wallpaper]);

  useEffect(() => {
    localStorage.setItem('kp_performance', String(performance));
    document.documentElement.setAttribute('data-performance', String(performance));
  }, [performance]);

  useEffect(() => {
    localStorage.setItem('kp_animations', String(animations));
    document.documentElement.setAttribute('data-animations', String(animations));
  }, [animations]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'p') {
        setIsPanic(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = useCallback((id: AppId, url?: string) => {
    setOpenWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) return prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: zIndex + 1, url: url || w.url } : w);
      return [...prev, { id, isMinimized: false, zIndex: zIndex + 1, url }];
    });
    setZIndex(prev => prev + 1);
    setActiveWindow(id);
    setShowStartMenu(false);
  }, [zIndex]);

  const closeApp = useCallback((id: AppId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindow === id) setActiveWindow(null);
  }, [activeWindow]);

  const minimizeApp = useCallback((id: AppId) => {
    setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindow(null);
  }, []);

  const focusApp = useCallback((id: AppId) => {
    setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: zIndex + 1 } : w));
    setZIndex(prev => prev + 1);
    setActiveWindow(id);
  }, [zIndex]);

  if (booting) return <BootScreen onComplete={() => setBooting(false)} />;
  
  if (isPanic) {
    return (
      <div className="fixed inset-0 z-[10000] bg-white flex flex-col font-sans">
        <div className="h-14 border-b border-gray-200 flex items-center px-6 gap-8 text-[14px]">
          <div className="flex items-center gap-2 text-gray-600 font-medium">
             <img src="https://ssl.gstatic.com/classroom/favicon.png" className="w-6 h-6" alt="" />
             <span>Google Classroom</span>
          </div>
          <div className="flex items-center gap-6 text-gray-500 font-medium ml-4">
             <span className="text-emerald-700 border-b-2 border-emerald-700 pb-4 h-14 flex items-center mt-4">Stream</span>
             <span>Classwork</span>
             <span>People</span>
             <span>Grades</span>
          </div>
        </div>
        <div className="flex-1 p-8 bg-gray-50">
           <div className="max-w-4xl mx-auto space-y-6">
              <div className="h-48 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 flex items-end">
                 <h1 className="text-3xl font-bold text-white">Advanced Geometry - Period 4</h1>
              </div>
              <div className="flex gap-6">
                 <div className="w-48 space-y-4">
                    <div className="p-4 rounded-lg border border-gray-200 bg-white">
                       <p className="text-xs font-bold text-gray-700">Upcoming</p>
                       <p className="text-xs text-gray-500 mt-2">Woohoo, no work due soon!</p>
                       <button className="text-xs text-emerald-700 font-bold mt-4 hover:underline">View All</button>
                    </div>
                 </div>
                 <div className="flex-1 space-y-4">
                    <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200" />
                       <p className="text-sm text-gray-400">Announce something to your class</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#070707] font-sans text-slate-200">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 bg-layer">
        {wallpaper ? (
          <img src={wallpaper || undefined} className="w-full h-full object-cover transition-opacity duration-1000 opacity-60" alt="" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(100,116,241,0.15),transparent_50%)]" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <AnimatePresence>
        {showHistoryToast && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-2 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 glass rounded-full flex items-center gap-3 border border-indigo-500/30 shadow-2xl"
          >
            <Shield size={14} className="text-indigo-400" />
            <span className="text-[11px] font-bold text-white/90">Browsing protected. URL scrubbed from history.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Icons */}
      <div className="absolute inset-0 p-8 grid grid-flow-col grid-rows-[repeat(auto-fill,96px)] gap-4 w-min content-start z-1">
        {APPS.map(app => (
          <motion.button 
            key={app.id} 
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.03)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openApp(app.id)}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all w-20 h-20 group"
          >
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center shadow-lg border-white/10 group-hover:border-white/20">
              <app.icon className={`w-6 h-6 ${app.color}`} />
            </div>
            <span className="text-[10px] font-medium text-white/50 group-hover:text-white transition-colors">{app.title}</span>
          </motion.button>
        ))}
      </div>

      {/* Window Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <AnimatePresence>
          {openWindows.map(win => {
            const app = APPS.find(a => a.id === win.id);
            if (!app || win.isMinimized) return null;
            return (
              <Window 
                key={win.id}
                id={win.id}
                title={app.title}
                icon={app.icon}
                color={app.color}
                zIndex={win.zIndex}
                isActive={activeWindow === win.id}
                onFocus={() => focusApp(win.id)}
                onClose={() => closeApp(win.id)}
                onMinimize={() => minimizeApp(win.id)}
                initialX={40 + (openWindows.indexOf(win) * 30)}
                initialY={60 + (openWindows.indexOf(win) * 30)}
              >
                <AppContent 
                  id={win.id} 
                  cloak={cloak}
                  setCloak={setCloak} 
                  setTheme={setTheme} 
                  theme={theme} 
                  setWallpaper={setWallpaper}
                  performance={performance}
                  setPerformance={setPerformance}
                  animations={animations}
                  setAnimations={setAnimations}
                  winUrl={win.url}
                />
              </Window>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 inset-x-0 h-8 flex items-center px-4 justify-between glass border-b-white/5 z-[60] text-[11px] font-medium text-white/50">
        <div className="flex items-center gap-4">
          <span className="text-white">koopbin</span>
          <div className="flex items-center gap-3 opacity-60">
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Special</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-400/80">
            <Shield size={10} />
            <span className="tracking-widest uppercase text-[9px] font-bold">Secure</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1"><Wifi size={12} /></div>
             <div className="flex items-center gap-1"><Battery size={12} className="rotate-90" /></div>
             <div className="flex items-center gap-2">
                <Clock size={12} />
                <span className="tabular-nums">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Dock */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-[100] pointer-events-none">
        <nav className="pointer-events-auto flex items-end gap-1.5 p-1.5 px-3 glass rounded-2xl border-white/10 shadow-2xl">
          <button 
            onClick={() => setShowStartMenu(!showStartMenu)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${showStartMenu ? 'bg-white/15' : 'hover:bg-white/10'}`}
          >
            <Zap className="w-5 h-5 text-white" />
          </button>
          <div className="w-px h-6 bg-white/10 mx-1 mb-2" />
          {APPS.map(app => {
            const isOpen = openWindows.some(w => !w.isMinimized && w.id === app.id);
            const isOpenedAtAll = openWindows.some(w => w.id === app.id);
            return (
              <div key={app.id} className="relative group">
                <motion.button
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => openApp(app.id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeWindow === app.id ? 'bg-white/15 border border-white/20' : 'bg-white/5 border border-transparent'}`}
                >
                  <app.icon className={`w-5 h-5 ${app.color}`} />
                </motion.button>
                {isOpenedAtAll && (
                  <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isOpen ? 'bg-white' : 'bg-white/40'}`} />
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Start Menu Overlay */}
      <AnimatePresence>
        {showStartMenu && (
          <>
            <div className="fixed inset-0 z-[80]" onClick={() => setShowStartMenu(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[540px] max-w-[95vw] glass rounded-3xl border-white/15 p-6 shadow-2xl z-[90] overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-6 px-2">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">G</div>
                 <div>
                    <p className="text-sm font-bold text-white">Student Guest</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">KoopBin User</p>
                 </div>
                 <button className="ml-auto p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400">
                    <History size={16} />
                 </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {APPS.map(app => (
                  <button 
                    key={app.id} 
                    onClick={() => openApp(app.id)}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 transition-all text-center group"
                  >
                    <div className="w-10 h-10 glass rounded-xl flex items-center justify-center group-hover:scale-105 transition-all">
                       <app.icon className={`w-5 h-5 ${app.color}`} />
                    </div>
                    <span className="text-[11px] text-gray-400 group-hover:text-white transition-colors">{app.title}</span>
                  </button>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between px-2">
                 <div className="flex items-center gap-3">
                    <button className="text-[11px] text-gray-500 hover:text-white transition-colors">Privacy</button>
                    <button className="text-[11px] text-gray-500 hover:text-white transition-colors">Terms</button>
                 </div>
                 <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold">
                    Shutdown
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .music-scroll::-webkit-scrollbar { width: 4px; }
        .music-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        @keyframes kpSlideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
