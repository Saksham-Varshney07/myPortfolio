let clickAudio: HTMLAudioElement | null = null;

export const playClickSound = () => {
  if (typeof window === "undefined") return;
  
  if (!clickAudio) {
    clickAudio = new Audio("/Click.mp3");
    clickAudio.volume = 0.4;
  }
  
  clickAudio.currentTime = 2.0;
  clickAudio.play().catch(() => {
    // Ignore autoplay restrictions
  });
};
