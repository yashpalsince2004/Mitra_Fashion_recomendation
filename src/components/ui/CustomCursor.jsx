import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Scissors, MousePointer2 } from "lucide-react";
import { cn } from "../../utils/cn";

export function CustomCursor() {
  const location = useLocation();
  const cursorRef = useRef(null);
  const scissorsRef = useRef(null);
  const pointerRef = useRef(null);
  const dotRef = useRef(null);
  const trailRefs = [useRef(null), useRef(null), useRef(null)];
  
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Audio Context Synthesizer for "Snip" Feedback (Premium & Dependency-Free)
  const playSnipSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // High frequency double tick representing dual shear blades
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.03);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch(e) {}
  };

  // High-performance state trackers
  const mouse = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const trails = useRef([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ]);
  
  const state = useRef({
    isHoveringBtn: false,
    isHoveringImg: false,
    isText: false,
    isClicking: false,
    magneticCenter: null,
  });

  useEffect(() => {
    const checkMobile = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isTouch || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let rafId;
    const cursor = cursorRef.current;
    
    const render = () => {
      const s = state.current;
      const isGallery = location.pathname === '/gallery';
      
      let targetX = mouse.current.x;
      let targetY = mouse.current.y;

      if (s.isHoveringBtn && s.magneticCenter) {
        const dx = s.magneticCenter.x - mouse.current.x;
        const dy = s.magneticCenter.y - mouse.current.y;
        targetX = mouse.current.x + dx * 0.25; 
        targetY = mouse.current.y + dy * 0.25;
      }

      cursorPos.current.x += (targetX - cursorPos.current.x) * 0.3;
      cursorPos.current.y += (targetY - cursorPos.current.y) * 0.3;

      if (cursor) {
        // Base scissor behavior defaults active in Gallery
        const usingScissors = s.isHoveringImg || (isGallery && !s.isHoveringBtn && !s.isText);
        
        const scale = s.isClicking ? 0.8 : (s.isHoveringBtn || s.isHoveringImg ? 1.2 : 1);
        const rotate = s.isClicking && usingScissors ? -15 : (s.isHoveringImg ? 10 : 0);
        
        cursor.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`;
        
        // Context Opacities
        scissorsRef.current.style.opacity = usingScissors ? "1" : "0";
        pointerRef.current.style.opacity = (!usingScissors && s.isHoveringBtn) ? "1" : "0";
        dotRef.current.style.opacity = (!usingScissors && !s.isHoveringBtn) ? "1" : "0";
        
        // Hide core when texting
        cursor.style.opacity = (isVisible && !s.isText) ? "1" : "0";
      }

      let prevX = cursorPos.current.x;
      let prevY = cursorPos.current.y;

      trailRefs.forEach((tRef, idx) => {
        if (tRef.current) {
          const t = trails.current[idx];
          t.x += (prevX - t.x) * 0.35;
          t.y += (prevY - t.y) * 0.35;
          tRef.current.style.transform = `translate(${t.x}px, ${t.y}px) translate(-50%, -50%)`;
          tRef.current.style.opacity = (s.isText || isVisible === false) ? "0" : (1 - (idx * 0.25)).toString();
          prevX = t.x;
          prevY = t.y;
        }
      });

      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      const btn = target.closest('a, button, [role="button"], .cursor-pointer');
      const img = target.closest('img');
      const text = target.closest('input, textarea, p, h1, h2, h3, h4, h5, h6, span');

      const s = state.current;
      s.isHoveringBtn = !!btn;
      s.isHoveringImg = !!img;
      s.isText = !!text && !btn;

      if (btn) {
        const rect = btn.getBoundingClientRect();
        s.magneticCenter = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      } else {
        s.magneticCenter = null;
      }
    };

    const onMouseDown = () => { 
      state.current.isClicking = true; 
      // Play snip audio dynamically over any selection mechanics across the app, especially Quiz cards and Gallery!
      if (location.pathname === '/gallery' || location.pathname === '/quiz' || state.current.isHoveringImg || state.current.isHoveringBtn) {
        playSnipSound();
      }
    };
    
    const onMouseUp = () => { state.current.isClicking = false; };
    const onMouseLeave = () => { setIsVisible(false); };
    const onMouseEnter = () => { setIsVisible(true); };

    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      * { cursor: none !important; }
      input, textarea, [contenteditable="true"] { cursor: text !important; }
    `;
    document.head.appendChild(styleEl);

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mousedown", onMouseDown, { passive: true });
    document.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      document.head.removeChild(styleEl);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isMobile, isVisible, location.pathname]);

  if (isMobile) return null;

  return (
    <>
      {trailRefs.map((ref, i) => (
        <div
          key={i}
          ref={ref}
          className="fixed top-0 left-0 pointer-events-none z-[9998] w-2 h-2 rounded-full bg-accent/30 will-change-transform"
          style={{ transform: "translate(-50%, -50%)" }}
        />
      ))}

      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform transition-opacity duration-200"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full border ghost-border bg-accent/5 backdrop-blur-[2px] shadow-lg">
          <div ref={scissorsRef} className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 text-main">
            <Scissors className="w-[14px] h-[14px]" />
          </div>
          <div ref={pointerRef} className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 text-main">
            <MousePointer2 className="w-[14px] h-[14px]" />
          </div>
          <div ref={dotRef} className="absolute inset-0 flex items-center justify-center transition-opacity duration-200">
            <div className="w-1.5 h-1.5 rounded-full bg-main shadow-sm" />
          </div>
        </div>
      </div>
    </>
  );
}
