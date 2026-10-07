"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, useDragControls } from "framer-motion"
import { Shuffle, Sun, Moon, Undo2, Volume2, VolumeX } from "lucide-react"
import { Button } from "pixel-retroui"

const LS_KEY = "portfolio-custom-theme"

type ThemeState = {
  type: "default" | "light" | "custom" | "dark" | "predefined";
  vars?: Record<string, string>;
  label?: string;
  audio?: string;
  audioStartTime?: number;
  video?: string;
}

function applyThemeVars(vars: Record<string, string> | null, themeType?: string, hasVideo?: boolean) {
  const root = document.documentElement;
  root.removeAttribute('style');

  if (vars) {
    Object.entries(vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
  }

  const effectiveType = themeType || (vars && vars["--background"] === "#e8e3e7" ? "light" : "dark");
  root.setAttribute('data-theme', effectiveType);

  if (hasVideo) {
    root.setAttribute('data-theme-video', 'true');
  } else {
    root.removeAttribute('data-theme-video');
  }
}

function generateRandomDarkTheme() {
  const hue = Math.floor(Math.random() * 360);
  const accentColor = `hsl(${hue}, 85%, 65%)`;

  return {
    "--font-app": "'Minecraft', monospace, sans-serif",
    "--background": `hsl(${hue}, 30%, 5%)`,
    "--foreground": "#ffffff",
    "--text-primary": "#ffffff",
    "--text-secondary": `hsla(${hue}, 30%, 85%, 0.8)`,
    "--text-muted": `hsla(${hue}, 30%, 75%, 0.6)`,
    "--text-faint": `hsla(${hue}, 30%, 65%, 0.38)`,
    "--bg-base": `hsl(${hue}, 30%, 5%)`,
    "--bg-dot": `hsla(${hue}, 80%, 60%, 0.1)`,
    "--titlebar-bg": `hsl(${hue}, 35%, 8%)`,
    "--window-bg": `hsl(${hue}, 30%, 5%)`,
    "--terminal-bg": `hsl(${hue}, 30%, 5%)`,
    "--menubar-bg": `hsl(${hue}, 35%, 8%)`,
    "--window-border-focused": accentColor,
    "--window-border-unfocused": `hsla(${hue}, 50%, 40%, 0.5)`,
    "--widget-bg": `hsl(${hue}, 30%, 5%)`,
    "--widget-border": accentColor,
    "--drag-handle-bg": `hsl(${hue}, 35%, 9%)`,
    "--item-separator": `hsla(${hue}, 60%, 50%, 0.14)`,
    "--dock-bg": `hsl(${hue}, 30%, 5%)`,
    "--tooltip-bg": `hsl(${hue}, 40%, 10%)`,
    "--accent": accentColor,
    "--accent-subtle": `hsla(${hue}, 80%, 60%, 0.2)`,
    "--heatmap-empty": `hsla(${hue}, 60%, 50%, 0.08)`,
    "--separator": `hsla(${hue}, 60%, 50%, 0.15)`,
    "--indicator-color": "#4ade80",
    "--wallpaper-bg": "transparent",
    "--wallpaper-opacity": "0",
    "--window-radius": "0px",
    "--window-shadow-focused": `4px 4px 0px ${accentColor}`,
    "--window-shadow-unfocused": `2px 2px 0px hsla(${hue}, 50%, 40%, 0.5)`,
    "--window-border-style": `2px solid ${accentColor}`,
    "--widget-handle-radius": "0px",
    "--widget-body-radius": "0px",
    "--widget-border-style": `2px solid ${accentColor}`,
    "--widget-shadow": `3px 3px 0px ${accentColor}`,
    "--dock-radius": "0px",
    "--dock-border-style": `2px solid ${accentColor}`,
    "--dock-shadow": `4px 4px 0px ${accentColor}`,
    "--dock-button-radius": "0px",
    "--dock-button-border": `1px solid hsla(${hue}, 60%, 50%, 0.25)`,
    "--btn-shadow": `2px 2px 0px ${accentColor}`,
    "--menubar-border-bottom": `2px solid ${accentColor}`,
    "--card-border-svg": "var(--retroui-border-svg-dark)",
    "--bg-card": `hsl(${hue}, 30%, 5%)`,
    "--text-card": "#ffffff",
    "--border-card": accentColor,
    "--shadow-card": accentColor,
  };
}

const retroThemeVars: Record<string, string> = {
  "--font-app": "'Minecraft', monospace, sans-serif",
  "--background": "#e8e3e7",
  "--foreground": "#000000",
  "--text-primary": "#000000",
  "--text-secondary": "rgba(0, 0, 0, 0.72)",
  "--text-muted": "rgba(0, 0, 0, 0.52)",
  "--text-faint": "rgba(0, 0, 0, 0.35)",
  "--bg-base": "#e8e3e7",
  "--bg-dot": "rgba(0, 0, 0, 0.08)",
  "--titlebar-bg": "#f3edf0",
  "--window-bg": "#ffffff",
  "--terminal-bg": "#ffffff",
  "--menubar-bg": "#f5edf2",
  "--window-border-focused": "#000000",
  "--window-border-unfocused": "rgba(0, 0, 0, 0.5)",
  "--widget-bg": "#ffffff",
  "--widget-border": "#000000",
  "--drag-handle-bg": "#f5edf2",
  "--item-separator": "rgba(0, 0, 0, 0.08)",
  "--dock-bg": "#ffffff",
  "--tooltip-bg": "#fefcd0",
  "--accent": "#c381b5",
  "--accent-subtle": "rgba(195, 129, 181, 0.2)",
  "--heatmap-empty": "rgba(0, 0, 0, 0.07)",
  "--separator": "rgba(0, 0, 0, 0.12)",
  "--indicator-color": "#16a34a",
  "--wallpaper-bg": "transparent",
  "--wallpaper-opacity": "0",
  "--window-radius": "0px",
  "--window-shadow-focused": "4px 4px 0px #000000",
  "--window-shadow-unfocused": "2px 2px 0px rgba(0, 0, 0, 0.4)",
  "--window-border-style": "2px solid #000000",
  "--widget-handle-radius": "0px",
  "--widget-body-radius": "0px",
  "--widget-border-style": "2px solid #000000",
  "--widget-shadow": "3px 3px 0px #000000",
  "--dock-radius": "0px",
  "--dock-border-style": "2px solid #000000",
  "--dock-shadow": "4px 4px 0px #000000",
  "--dock-button-radius": "0px",
  "--dock-button-border": "1px solid rgba(0, 0, 0, 0.2)",
  "--btn-shadow": "2px 2px 0px #000000",
  "--menubar-border-bottom": "2px solid #000000",
  "--primary-bg": "#c381b5",
  "--primary-text": "#fefcd0",
  "--secondary-bg": "#fefcd0",
  "--secondary-text": "#000000",
  "--bg-card": "#ffffff",
  "--text-card": "#000000",
  "--border-card": "#000000",
  "--shadow-card": "#000000",
  "--card-border-svg": "var(--retroui-border-svg-light)",
};



const darkThemeVars: Record<string, string> = {
  "--font-app": "'Minecraft', monospace, sans-serif",
  "--background": "#000000",
  "--foreground": "#ffffff",
  "--text-primary": "#ffffff",
  "--text-secondary": "rgba(255, 255, 255, 0.82)",
  "--text-muted": "rgba(255, 255, 255, 0.6)",
  "--text-faint": "rgba(255, 255, 255, 0.38)",
  "--bg-base": "#000000",
  "--bg-dot": "rgba(255, 255, 255, 0.08)",
  "--titlebar-bg": "#0a0a0a",
  "--window-bg": "#000000",
  "--terminal-bg": "#000000",
  "--menubar-bg": "#0a0a0a",
  "--window-border-focused": "#ffffff",
  "--window-border-unfocused": "rgba(255, 255, 255, 0.5)",
  "--widget-bg": "#000000",
  "--widget-border": "#ffffff",
  "--drag-handle-bg": "#0a0a0a",
  "--item-separator": "rgba(255, 255, 255, 0.12)",
  "--dock-bg": "#000000",
  "--tooltip-bg": "#111111",
  "--accent": "#ffffff",
  "--accent-subtle": "rgba(255, 255, 255, 0.16)",
  "--heatmap-empty": "rgba(255, 255, 255, 0.08)",
  "--separator": "rgba(255, 255, 255, 0.15)",
  "--indicator-color": "#4ade80",
  "--wallpaper-bg": "transparent",
  "--wallpaper-opacity": "0",
  "--window-radius": "0px",
  "--window-shadow-focused": "4px 4px 0px #ffffff",
  "--window-shadow-unfocused": "2px 2px 0px rgba(255, 255, 255, 0.5)",
  "--window-border-style": "2px solid #ffffff",
  "--widget-handle-radius": "0px",
  "--widget-body-radius": "0px",
  "--widget-border-style": "2px solid #ffffff",
  "--widget-shadow": "3px 3px 0px #ffffff",
  "--dock-radius": "0px",
  "--dock-border-style": "2px solid #ffffff",
  "--dock-shadow": "4px 4px 0px #ffffff",
  "--dock-button-radius": "0px",
  "--dock-button-border": "1px solid rgba(255, 255, 255, 0.2)",
  "--btn-shadow": "2px 2px 0px #ffffff",
  "--menubar-border-bottom": "2px solid #ffffff",
  "--card-border-svg": "var(--retroui-border-svg-dark)",
  "--bg-card": "#000000",
  "--text-card": "#ffffff",
  "--border-card": "#ffffff",
  "--shadow-card": "#ffffff",
};

// ─── UI Sizing Config ──────────────────────────────────────────────────────────
// Easily adjust font sizes and padding for the Theme buttons here:
export const THEME_BUTTON_CONFIG = {
  fontSize: 11,     // Font size in pixels (increased for better legibility)
  paddingY: 6,      // Vertical padding in pixels (reduced slightly to keep button height the same)
  paddingX: 8,      // Horizontal padding in pixels
  iconSize: 12,     // Icon size in pixels (Shuffle, Moon, Undo)
  gap: 20,          // Spacing between the buttons in pixels
};

export default function ThemeWidget() {
  const [history, setHistory] = useState<ThemeState[]>([{ type: "dark" }]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    applyThemeVars(darkThemeVars, "dark", false);
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
        applyThemeVars(theme.vars || null, "predefined", !!theme.video);
      });
      return;
    }

    applyWithTransition(() => {
      setHistory(prev => [...prev, theme]);
      if (theme.type === "light") applyThemeVars(theme.vars || retroThemeVars, "light", false);
      else if (theme.type === "dark") applyThemeVars(darkThemeVars, "dark", false);
      else if (theme.type === "custom") applyThemeVars(theme.vars || null, "custom", false);
      else applyThemeVars(darkThemeVars, "dark", false);
    });
  };

  const undo = () => {
    if (history.length > 1) {
      applyWithTransition(() => {
        const newHistory = history.slice(0, -1);
        setHistory(newHistory);
        const prevTheme = newHistory[newHistory.length - 1];
        if (prevTheme.type === "light") applyThemeVars(prevTheme.vars || retroThemeVars, "light", false);
        else if (prevTheme.type === "dark") applyThemeVars(darkThemeVars, "dark", false);
        else if (prevTheme.type === "custom") applyThemeVars(prevTheme.vars || null, "custom", false);
        else if (prevTheme.type === "predefined") applyThemeVars(prevTheme.vars || null, "predefined", !!prevTheme.video);
        else applyThemeVars(darkThemeVars, "dark", false);
      });
    }
  };

  return (
    <>
      {typeof document !== "undefined" && currentTheme.video && createPortal(
        <video
          autoPlay
          loop
          muted
          playsInline
          src={currentTheme.video}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            zIndex: -1,
            filter: "blur(6px) brightness(0.6)",
            pointerEvents: "none"
          }}
        />,
        document.body
      )}
      <motion.div
        drag
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        style={{ position: "relative", zIndex: 5, width: 340 }}
      >
        <div className="retroui-card overflow-hidden">
          {/* Drag handle */}
          <div
            className="flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{
              height: 22,
              background: "var(--drag-handle-bg)",
              borderBottom: "1px solid var(--separator)"
            }}
            onPointerDown={(e) => dragControls.start(e)}
          >
            <div style={{ width: 28, height: 3, borderRadius: 2, background: "var(--text-faint)" }} />
          </div>

          {/* Widget body */}
          <div
            className="flex flex-col justify-between"
            style={{
              padding: "16px",
              height: "auto"
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
                Themes
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--text-primary)" }}>
                {currentTheme.type === 'custom' ? 'Generated' : currentTheme.type === 'dark' ? 'Dark' : currentTheme.type === 'light' ? 'Light' : currentTheme.type === 'predefined' ? currentTheme.label : 'Dark'}
              </span>
            </div>

            {/* Theme Action Buttons */}
            <div
              className="grid grid-cols-2 mt-2"
              style={{ gap: `${THEME_BUTTON_CONFIG.gap}px` }}
            >
              <Button
                bg={currentTheme.type === "dark" || currentTheme.type === "custom" || currentTheme.type === "predefined" ? "black" : "white"}
                textColor={currentTheme.type === "dark" || currentTheme.type === "custom" || currentTheme.type === "predefined" ? "white" : "black"}
                borderColor={currentTheme.type === "dark" || currentTheme.type === "custom" || currentTheme.type === "predefined" ? "white" : "black"}
                shadow={currentTheme.type === "dark" || currentTheme.type === "custom" || currentTheme.type === "predefined" ? "white" : "black"}
                onClick={() => setTheme({ type: "custom", vars: generateRandomDarkTheme() })}
                className="!m-0 w-full flex items-center justify-center gap-1.5 font-minecraft uppercase tracking-wider cursor-pointer"
                style={{
                  fontSize: `${THEME_BUTTON_CONFIG.fontSize}px`,
                  padding: `${THEME_BUTTON_CONFIG.paddingY}px ${THEME_BUTTON_CONFIG.paddingX}px`,
                }}
              >
                <Shuffle size={THEME_BUTTON_CONFIG.iconSize} className="transition-colors flex-none" />
                <span>Generate</span>
              </Button>

              <Button
                bg={currentTheme.type === "dark" || currentTheme.type === "custom" || currentTheme.type === "predefined" ? "black" : "white"}
                textColor={currentTheme.type === "dark" || currentTheme.type === "custom" || currentTheme.type === "predefined" ? "white" : "black"}
                borderColor={currentTheme.type === "dark" || currentTheme.type === "custom" || currentTheme.type === "predefined" ? "white" : "black"}
                shadow={currentTheme.type === "dark" || currentTheme.type === "custom" || currentTheme.type === "predefined" ? "white" : "black"}
                onClick={undo}
                disabled={history.length <= 1}
                className="!m-0 w-full flex items-center justify-center gap-1.5 font-minecraft uppercase tracking-wider cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  fontSize: `${THEME_BUTTON_CONFIG.fontSize}px`,
                  padding: `${THEME_BUTTON_CONFIG.paddingY}px ${THEME_BUTTON_CONFIG.paddingX}px`,
                }}
              >
                <Undo2 size={THEME_BUTTON_CONFIG.iconSize} className="transition-colors flex-none" />
                <span>Jump Back</span>
              </Button>
            </div>

            <div style={{ marginTop: `${THEME_BUTTON_CONFIG.gap}px` }}>
              <Button
                bg={currentTheme.type === "dark" || currentTheme.type === "custom" || currentTheme.type === "predefined" ? "black" : "white"}
                textColor={currentTheme.type === "dark" || currentTheme.type === "custom" || currentTheme.type === "predefined" ? "white" : "black"}
                borderColor={currentTheme.type === "dark" || currentTheme.type === "custom" || currentTheme.type === "predefined" ? "white" : "black"}
                shadow={currentTheme.type === "dark" || currentTheme.type === "custom" || currentTheme.type === "predefined" ? "white" : "black"}
                onClick={() => {
                  if (currentTheme.type === "dark") {
                    setTheme({ type: "light", vars: retroThemeVars })
                  } else {
                    setTheme({ type: "dark", vars: darkThemeVars })
                  }
                }}
                className="!m-0 w-full flex items-center justify-center gap-1.5 font-minecraft uppercase tracking-wider cursor-pointer"
                style={{
                  fontSize: `${THEME_BUTTON_CONFIG.fontSize}px`,
                  padding: `${THEME_BUTTON_CONFIG.paddingY}px ${THEME_BUTTON_CONFIG.paddingX}px`,
                }}
              >
                {currentTheme.type === "dark" ? <Sun size={THEME_BUTTON_CONFIG.iconSize} className="flex-none" /> : <Moon size={THEME_BUTTON_CONFIG.iconSize} className="flex-none" />}
                <span>{currentTheme.type === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </Button>
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/bg/barcelona.af4e5453.png" alt="FCB" className="w-full h-full object-contain drop-shadow-md" />
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-[9px] font-minecraft rounded bg-black text-white border border-white/40 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/bg/spideylogo.png"
                    alt="Spider-Man"
                    className="w-full h-full object-contain drop-shadow-md transition-all"
                    style={{ filter: (currentTheme.type === 'default' || currentTheme.type === 'light') ? 'invert(1)' : 'none' }}
                  />
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-[9px] font-minecraft rounded bg-black text-white border border-white/40 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    Spider-Tingle
                  </span>
                </button>
                <button
                  onClick={() => setTheme({
                    type: "predefined",
                    label: "Tokyo",
                    audio: "/bgm/tokyo.mp3",
                    audioStartTime: 0,
                    video: "/bg/Tunnel Drift live wallpaper.mp4",
                    vars: {
                      ...darkThemeVars,
                      "--bg-base": "rgba(0,0,0,0.2)",
                      "--wallpaper-bg": "transparent",
                      "--wallpaper-opacity": "1"
                    }
                  })}
                  className="group relative overflow-visible w-10 h-10 rounded-md transition-all cursor-pointer flex items-center justify-center font-mono text-[9px]"
                  style={{
                    background: currentTheme.label === "Tokyo" ? "var(--accent-subtle)" : "var(--item-separator)",
                    color: currentTheme.label === "Tokyo" ? "var(--accent)" : "var(--text-secondary)",
                    border: currentTheme.label === "Tokyo" ? "1px solid var(--accent-subtle)" : "1px solid var(--window-border-unfocused)",
                    padding: "4px"
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/bg/tokyodriftlogo.png" alt="Tokyo Drift" className="w-[140%] h-[140%] max-w-none object-contain drop-shadow-md" />
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-[9px] font-minecraft rounded bg-black text-white border border-white/40 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    Tokyo Drift
                  </span>
                </button>
              </div>
            </div>

            <audio ref={audioRef} loop style={{ display: 'none' }} />
          </div>
        </div>
      </motion.div>
    </>
  )
}
