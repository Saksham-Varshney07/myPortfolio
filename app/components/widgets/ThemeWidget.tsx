"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useDragControls } from "framer-motion"
import { Shuffle, Sun, Moon, Undo2, Volume2, VolumeX } from "lucide-react"

const LS_KEY = "portfolio-custom-theme"

type ThemeState = {
  type: "default" | "light" | "custom" | "dark" | "predefined";
  vars?: Record<string, string>;
  label?: string;
  audio?: string;
  audioStartTime?: number;
}

function applyThemeVars(vars: Record<string, string> | null) {
  const root = document.documentElement;
  root.removeAttribute('style');
  
  if (vars) {
    Object.entries(vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
  }
}

function generateRandomDarkTheme() {
  const hue = Math.floor(Math.random() * 360);
  const hue2 = (hue + 40 + Math.floor(Math.random() * 40)) % 360;
  const hue3 = (hue + 80 + Math.floor(Math.random() * 40)) % 360;
  
  return {
    "--bg-base": `hsla(${hue}, 40%, 6%, 1)`,
    "--bg-dot": `hsla(${hue}, 80%, 60%, 0.05)`,
    "--titlebar-bg": `hsla(${hue}, 50%, 8%, 1)`,
    "--window-bg": `hsla(${hue}, 50%, 10%, 1)`,
    "--terminal-bg": `hsla(${hue}, 50%, 6%, 1)`,
    "--menubar-bg": `hsla(${hue}, 40%, 6%, 1)`,
    "--window-border-focused": `hsla(${hue}, 80%, 60%, 0.3)`,
    "--window-border-unfocused": `hsla(${hue}, 80%, 60%, 0.1)`,
    "--widget-bg": `hsla(${hue}, 50%, 8%, 1)`,
    "--widget-border": `hsla(${hue}, 80%, 60%, 0.12)`,
    "--drag-handle-bg": `hsla(${hue}, 80%, 60%, 0.04)`,
    "--item-separator": `hsla(${hue}, 80%, 60%, 0.07)`,
    "--dock-bg": `hsla(${hue}, 50%, 6%, 1)`,
    "--tooltip-bg": `hsla(${hue}, 50%, 8%, 0.98)`,
    "--accent": `hsla(${hue}, 80%, 60%, 0.9)`,
    "--accent-subtle": `hsla(${hue}, 80%, 60%, 0.18)`,
    "--heatmap-empty": `hsla(${hue}, 80%, 60%, 0.07)`,
    "--separator": `hsla(${hue}, 80%, 60%, 0.08)`,
    "--text-secondary": `hsla(${hue}, 40%, 80%, 0.5)`,
    "--text-muted": `hsla(${hue}, 40%, 70%, 0.3)`,
    "--text-faint": `hsla(${hue}, 40%, 60%, 0.2)`,
    "--indicator-color": "#4ade80",
    "--wallpaper-bg": `radial-gradient(circle at ${Math.floor(Math.random()*100)}% ${Math.floor(Math.random()*100)}%, hsla(${hue}, 80%, 30%, 1) 0%, hsla(${hue2}, 60%, 15%, 1) 45%, hsla(${hue3}, 50%, 5%, 1) 100%)`,
    "--wallpaper-opacity": "1"
  };
}

const lightThemeVars = {
  "--background": "#f4f4f4",
  "--foreground": "#000000",
  "--text-primary": "rgba(0,0,0,0.95)",
  "--text-secondary": "rgba(0,0,0,0.75)",
  "--text-muted": "rgba(0,0,0,0.60)",
  "--text-faint": "rgba(0,0,0,0.50)",
  "--bg-base": "#f4f4f4",
  "--bg-dot": "rgba(0,0,0,0.05)",
  "--titlebar-bg": "#f1f1f1",
  "--window-bg": "#eeeeee",
  "--terminal-bg": "#f2f2f2",
  "--menubar-bg": "#f4f4f4",
  "--window-border-focused": "rgba(0,0,0,0.12)",
  "--window-border-unfocused": "rgba(0,0,0,0.06)",
  "--widget-bg": "#eeeeee",
  "--widget-border": "rgba(0,0,0,0.08)",
  "--drag-handle-bg": "rgba(0,0,0,0.03)",
  "--item-separator": "rgba(0,0,0,0.05)",
  "--dock-bg": "rgba(237,237,237,0.92)",
  "--tooltip-bg": "#e5e5e5",
  "--accent": "rgba(0,0,0,0.65)",
  "--accent-subtle": "rgba(0,0,0,0.12)",
  "--heatmap-empty": "rgba(0,0,0,0.06)",
  "--separator": "rgba(0,0,0,0.07)",
  "--indicator-color": "#166534",
  "--wallpaper-opacity": "0"
};

const darkThemeVars = {
  "--background": "#0b0b0b",
  "--foreground": "#f0f0f0",
  "--text-primary": "rgba(255,255,255,0.85)",
  "--text-secondary": "rgba(255,255,255,0.58)",
  "--text-muted": "rgba(255,255,255,0.42)",
  "--text-faint": "rgba(255,255,255,0.38)",
  "--bg-base": "#0b0b0b",
  "--bg-dot": "rgba(255,255,255,0.05)",
  "--titlebar-bg": "#0e0e0e",
  "--window-bg": "#111111",
  "--terminal-bg": "#0d0d0d",
  "--menubar-bg": "#0b0b0b",
  "--window-border-focused": "rgba(255,255,255,0.12)",
  "--window-border-unfocused": "rgba(255,255,255,0.06)",
  "--widget-bg": "#111111",
  "--widget-border": "rgba(255,255,255,0.08)",
  "--drag-handle-bg": "rgba(255,255,255,0.03)",
  "--item-separator": "rgba(255,255,255,0.05)",
  "--dock-bg": "rgba(18,18,18,0.92)",
  "--tooltip-bg": "#1a1a1a",
  "--accent": "rgba(255,255,255,0.65)",
  "--accent-subtle": "rgba(255,255,255,0.12)",
  "--heatmap-empty": "rgba(255,255,255,0.06)",
  "--separator": "rgba(255,255,255,0.07)",
  "--indicator-color": "#4ade80",
  "--wallpaper-bg": "transparent",
  "--wallpaper-opacity": "0"
};

export default function ThemeWidget() {
  const [history, setHistory] = useState<ThemeState[]>([{ type: "default" }]);
  const dragControls = useDragControls();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(0.5);

  const currentTheme = history[history.length - 1];

  useEffect(() => {
    if (audioRef.current) {
      if (currentTheme.audio) {
        audioRef.current.src = currentTheme.audio;
        audioRef.current.volume = volume;
        if (currentTheme.audioStartTime) {
          audioRef.current.currentTime = currentTheme.audioStartTime;
        }
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [currentTheme.audio]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  const toggleMute = () => {
    const newVol = volume > 0 ? 0 : 0.5;
    setVolume(newVol);
    if (audioRef.current) audioRef.current.volume = newVol;
  };

  useEffect(() => {
    applyThemeVars(null);
    localStorage.removeItem(LS_KEY);
  }, []);

  const applyWithTransition = (action: () => void) => {
    if (!document.startViewTransition) {
      action();
      return;
    }
    document.startViewTransition(() => {
      action();
    });
  };

  const setTheme = (theme: ThemeState) => {
    if (theme.type === "predefined") {
      applyWithTransition(() => {
        setHistory(prev => [...prev, theme]);
        applyThemeVars(theme.vars || null);
      });
      return;
    }
    
    applyWithTransition(() => {
      setHistory(prev => [...prev, theme]);
      if (theme.type === "light") applyThemeVars(lightThemeVars);
      else if (theme.type === "dark") applyThemeVars(darkThemeVars);
      else if (theme.type === "custom") applyThemeVars(theme.vars || null);
      else applyThemeVars(null);
    });
  };

  const undo = () => {
    if (history.length > 1) {
      applyWithTransition(() => {
        const newHistory = history.slice(0, -1);
        setHistory(newHistory);
        const prevTheme = newHistory[newHistory.length - 1];
        if (prevTheme.type === "light") applyThemeVars(lightThemeVars);
        else if (prevTheme.type === "dark") applyThemeVars(darkThemeVars);
        else if (prevTheme.type === "custom") applyThemeVars(prevTheme.vars || null);
        else if (prevTheme.type === "predefined") applyThemeVars(prevTheme.vars || null);
        else applyThemeVars(null);
      });
    }
  };

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      style={{ position: "relative", zIndex: 5, width: 340 }}
    >
      {/* Drag handle */}
      <div
        className="flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          height: 22,
          background: "var(--drag-handle-bg)",
          borderRadius: "8px 8px 0 0",
          border: "1px solid var(--widget-border)",
          borderBottom: "none",
        }}
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div style={{ width: 28, height: 3, borderRadius: 2, background: "var(--text-faint)" }} />
      </div>

      {/* Widget body */}
      <div
        className="flex flex-col justify-between"
        style={{
          background: "var(--widget-bg)",
          border: "1px solid var(--widget-border)",
          borderRadius: "0 0 8px 8px",
          padding: "16px",
          height: "auto"
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
            Themes
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--text-secondary)" }}>
            {currentTheme.type === 'custom' ? 'Generated' : currentTheme.type === 'light' ? 'Light' : currentTheme.type === 'dark' ? 'Dark' : currentTheme.type === 'predefined' ? currentTheme.label : 'Default'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={() => setTheme({ type: "custom", vars: generateRandomDarkTheme() })}
            className="flex items-center justify-center gap-2 py-2.5 rounded-md transition-all active:scale-95 font-mono text-[10px] uppercase tracking-widest cursor-pointer"
            style={{ background: "transparent", color: "var(--text-muted)", border: "1px solid var(--window-border-unfocused)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--window-border-focused)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <Shuffle size={13} className="transition-colors" /> 
            <span className="transition-colors">Generate</span>
          </button>

          <button
            onClick={undo}
            disabled={history.length <= 1}
            className="flex items-center justify-center gap-2 py-2.5 rounded-md transition-all font-mono text-[10px] uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer disabled:pointer-events-none"
            style={{ background: "transparent", color: "var(--text-muted)", border: "1px solid var(--window-border-unfocused)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--window-border-focused)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <Undo2 size={13} className="transition-colors" /> 
            <span className="transition-colors">Jump Back</span>
          </button>

          <button
            onClick={() => setTheme({ type: "dark" })}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-md transition-colors font-mono text-[10px] uppercase tracking-widest cursor-pointer"
            style={{ background: "transparent", color: "var(--text-muted)", border: "1px solid var(--window-border-unfocused)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--window-border-focused)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <Moon size={12} className="transition-colors" /> 
            <span className="transition-colors">Dark Mode</span>
          </button>

          <button
            onClick={() => setTheme({ type: "light" })}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-md transition-colors font-mono text-[10px] uppercase tracking-widest cursor-pointer"
            style={{ background: "transparent", color: "var(--text-muted)", border: "1px solid var(--window-border-unfocused)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--window-border-focused)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <Sun size={12} className="transition-colors" /> 
            <span className="transition-colors">Light Mode</span>
          </button>
        </div>
        {/* Predefined Themes */}
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--separator)" }}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
              Environments
            </span>
            {currentTheme.audio && (
              <div className="flex items-center gap-1.5">
                <button onClick={toggleMute} className="cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                  {volume > 0 ? <Volume2 size={12} /> : <VolumeX size={12} />}
                </button>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={volume} onChange={handleVolumeChange}
                  className="w-16 h-1 rounded-full appearance-none bg-black/20"
                  style={{ background: "var(--window-border-unfocused)" }}
                />
              </div>
            )}
          </div>
          
          <div className="flex gap-3 mt-1">
            <button
              onClick={() => setTheme({
                type: "predefined",
                label: "Barcelona",
                audio: "/bgm/barcelona.mp3",
                audioStartTime: 10,
                vars: {
                  ...darkThemeVars,
                  "--wallpaper-bg": "url('/bg/fc-barcelona.jpeg') center/cover no-repeat",
                  "--wallpaper-opacity": "1",
                  "--wallpaper-blur": "7px",
                  "--wallpaper-brightness": "0.8",
                  "--wallpaper-saturate": "1.1"
                }
              })}
              className="group relative overflow-visible w-10 h-10 rounded-md transition-all cursor-pointer flex items-center justify-center font-mono text-[9px]"
              style={{
                background: currentTheme.label === "Barcelona" ? "var(--accent-subtle)" : "var(--item-separator)",
                color: currentTheme.label === "Barcelona" ? "var(--accent)" : "var(--text-secondary)",
                border: currentTheme.label === "Barcelona" ? "1px solid var(--accent-subtle)" : "1px solid var(--window-border-unfocused)",
                padding: "4px"
              }}
            >
              <img src="/bg/barcelona.af4e5453.png" alt="FCB" className="w-full h-full object-contain drop-shadow-md" />
              <span className="custom-tooltip-bottom absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-mono rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Visca el Barça
              </span>
            </button>
            <button
              onClick={() => setTheme({
                type: "predefined",
                label: "Spider-Man",
                audio: "/bgm/spiderverse.mp3",
                audioStartTime: 3,
                vars: {
                  ...darkThemeVars,
                  "--wallpaper-bg": "url('/bg/spidey.jpg') center/cover no-repeat",
                  "--wallpaper-opacity": "1",
                  "--wallpaper-blur": "6px",
                  "--wallpaper-brightness": "0.7",
                  "--wallpaper-saturate": "1.2"
                }
              })}
              className="group relative overflow-visible w-10 h-10 rounded-md transition-all cursor-pointer flex items-center justify-center font-mono text-[9px]"
              style={{
                background: currentTheme.label === "Spider-Man" ? "var(--accent-subtle)" : "var(--item-separator)",
                color: currentTheme.label === "Spider-Man" ? "var(--accent)" : "var(--text-secondary)",
                border: currentTheme.label === "Spider-Man" ? "1px solid var(--accent-subtle)" : "1px solid var(--window-border-unfocused)",
                padding: "4px"
              }}
            >
              <img 
                src="/bg/spideylogo.png" 
                alt="Spider-Man" 
                className="w-full h-full object-contain drop-shadow-md transition-all" 
                style={{ filter: currentTheme.type === 'light' ? 'invert(1)' : 'none' }} 
              />
              <span className="custom-tooltip-bottom absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-mono rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Spider-Tingle
              </span>
            </button>
          </div>
        </div>

        <audio ref={audioRef} loop style={{ display: 'none' }} />
      </div>
    </motion.div>
  )
}
