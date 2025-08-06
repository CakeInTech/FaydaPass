"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  motion,
  useViewportScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

// ==================== COLOR CONSTANTS ====================
// Easily customizable color palette - modify these for different themes
const THEME_COLORS = {
  sentry: {
    primary: "#6366f1", // Indigo-500
    secondary: "#a855f7", // Purple-500
    accent: "#ec4899", // Pink-500
    background: "#0f0f23", // Deep space blue
    midground: "#1e1b4b", // Indigo-900
    foreground: "#312e81", // Indigo-800
    star: "#ffffff", // Pure white for stars
    nebula: "rgba(99, 102, 241, 0.3)", // Translucent indigo
  },
  custom: {
    primary: "#6366f1",
    secondary: "#a855f7",
    accent: "#ec4899",
    background: "#0f0f23",
    midground: "#1e1b4b",
    foreground: "#312e81",
    star: "#ffffff",
    nebula: "rgba(99, 102, 241, 0.3)",
  },
};

// ==================== TYPES ====================
interface BackgroundWrapperProps {
  children: React.ReactNode;
  theme?: "sentry" | "custom";
  parallaxIntensity?: number;
  particles?: number;
  reduceMotion?: boolean;
  className?: string;
  showDebug?: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  angle: number;
  hue: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
}

// ==================== HOOKS ====================
const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
};

const useThrottledScroll = (
  callback: (scrollY: number) => void,
  delay: number = 16
) => {
  const lastRun = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      if (Date.now() - lastRun.current >= delay) {
        callback(window.scrollY);
        lastRun.current = Date.now();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [callback, delay]);
};

// ==================== HELPER FUNCTIONS ====================
const generateStars = (
  count: number,
  width: number,
  height: number
): Star[] => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.8 + 0.2,
    twinkleSpeed: Math.random() * 0.02 + 0.01,
  }));
};

const generateParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    opacity: Math.random() * 0.6 + 0.2,
    speed: Math.random() * 0.5 + 0.1,
    angle: Math.random() * Math.PI * 2,
    hue: Math.random() * 60 + 240, // Purple/blue range
  }));
};

// ==================== COMPONENT LAYERS ====================
const StarField: React.FC<{
  stars: Star[];
  parallaxOffset: number;
  reduceMotion: boolean;
  colors: typeof THEME_COLORS.sentry;
}> = ({ stars, parallaxOffset, reduceMotion, colors }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;

    const interval = setInterval(() => {
      setTime((t) => t + 0.016); // ~60fps
    }, 16);

    return () => clearInterval(interval);
  }, [reduceMotion]);

  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        transform: `translateY(${parallaxOffset * 0.1}px)`,
        willChange: "transform",
      }}
      aria-hidden="true"
    >
      <svg className="w-full h-full" style={{ minHeight: "120vh" }}>
        {stars.map((star, i) => (
          <circle
            key={i}
            cx={star.x}
            cy={star.y}
            r={star.size}
            fill={colors.star}
            opacity={
              reduceMotion
                ? star.opacity
                : star.opacity *
                  (0.5 + 0.5 * Math.sin(time * star.twinkleSpeed))
            }
            style={{ filter: "blur(0.5px)" }}
          />
        ))}
      </svg>
    </div>
  );
};

const NebulaGradient: React.FC<{
  parallaxOffset: number;
  reduceMotion: boolean;
  colors: typeof THEME_COLORS.sentry;
}> = ({ parallaxOffset, reduceMotion, colors }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;

    const interval = setInterval(() => {
      setTime((t) => t + 0.008);
    }, 32);

    return () => clearInterval(interval);
  }, [reduceMotion]);

  const gradientTransform = reduceMotion
    ? `translateY(${parallaxOffset * 0.3}px)`
    : `translateY(${parallaxOffset * 0.3}px) rotate(${time * 10}deg) scale(${
        1 + Math.sin(time) * 0.1
      })`;

  return (
    <motion.div
      className="absolute inset-0 w-full h-full opacity-40"
      style={{
        background: `
          radial-gradient(ellipse at 20% 30%, ${colors.nebula} 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
          radial-gradient(ellipse at 40% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 60%)
        `,
        transform: gradientTransform,
        willChange: "transform",
      }}
      aria-hidden="true"
    />
  );
};

const ParticleCanvas: React.FC<{
  particles: Particle[];
  parallaxOffset: number;
  reduceMotion: boolean;
  width: number;
  height: number;
  colors: typeof THEME_COLORS.sentry;
}> = ({ particles, parallaxOffset, reduceMotion, width, height, colors }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef(particles);

  useEffect(() => {
    particlesRef.current = particles;
  }, [particles]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    particlesRef.current.forEach((particle) => {
      if (!reduceMotion) {
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;
        particle.angle += 0.01;

        // Wrap around screen
        if (particle.x < 0) particle.x = 100;
        if (particle.x > 100) particle.x = 0;
        if (particle.y < 0) particle.y = 100;
        if (particle.y > 100) particle.y = 0;
      }

      const x = (particle.x / 100) * width;
      const y = (particle.y / 100) * height + parallaxOffset * 0.5;

      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`;
      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    if (!reduceMotion) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [width, height, parallaxOffset, reduceMotion]);

  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    />
  );
};

const OrbitingShapes: React.FC<{
  parallaxOffset: number;
  reduceMotion: boolean;
  colors: typeof THEME_COLORS.sentry;
}> = ({ parallaxOffset, reduceMotion, colors }) => {
  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{
        transform: `translateY(${parallaxOffset * 0.7}px)`,
        willChange: "transform",
      }}
      aria-hidden="true"
    >
      {/* Large orbital ring */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 border border-purple-500/10 rounded-full"
        animate={
          reduceMotion
            ? {}
            : {
                rotate: 360,
                scale: [1, 1.05, 1],
              }
        }
        transition={
          reduceMotion
            ? {}
            : {
                rotate: { duration: 120, repeat: Infinity, ease: "linear" },
                scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              }
        }
      />

      {/* Small floating orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          style={{
            top: `${20 + i * 30}%`,
            left: `${70 + i * 10}%`,
          }}
          animate={
            reduceMotion
              ? {}
              : {
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                }
          }
          transition={
            reduceMotion
              ? {}
              : {
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }
          }
        />
      ))}
    </div>
  );
};

const DebugOverlay: React.FC<{ parallaxOffset: number }> = ({
  parallaxOffset,
}) => (
  <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded font-mono text-xs z-50">
    <div>Parallax Offset: {Math.round(parallaxOffset)}px</div>
    <div>Layer 1 (Stars): {Math.round(parallaxOffset * 0.1)}px</div>
    <div>Layer 2 (Nebula): {Math.round(parallaxOffset * 0.3)}px</div>
    <div>Layer 3 (Particles): {Math.round(parallaxOffset * 0.5)}px</div>
    <div>Layer 4 (Shapes): {Math.round(parallaxOffset * 0.7)}px</div>
  </div>
);

// ==================== MAIN COMPONENT ====================
const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({
  children,
  theme = "sentry",
  parallaxIntensity = 0.2,
  particles: particleCount = 30,
  reduceMotion: overrideReduceMotion,
  className = "",
  showDebug = false,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldReduceMotion = overrideReduceMotion ?? prefersReducedMotion;

  const colors = THEME_COLORS[theme];

  // Responsive particle count - reduce on mobile
  const responsiveParticleCount = useMemo(() => {
    if (typeof window === "undefined") return particleCount;
    return window.innerWidth < 768
      ? Math.min(particleCount, 15)
      : particleCount;
  }, [particleCount]);

  // Generate static elements
  const stars = useMemo(
    () => generateStars(100, dimensions.width, dimensions.height),
    [dimensions]
  );
  const particles = useMemo(
    () => generateParticles(responsiveParticleCount),
    [responsiveParticleCount]
  );

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Throttled scroll handler
  useThrottledScroll(
    useCallback(
      (scrollY: number) => {
        setParallaxOffset(scrollY * parallaxIntensity);
      },
      [parallaxIntensity]
    )
  );

  return (
    <div
      ref={wrapperRef}
      className={`relative min-h-screen overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg,
          ${colors.background} 0%,
          ${colors.midground} 25%,
          ${colors.foreground} 50%,
          ${colors.midground} 75%,
          ${colors.background} 100%)`,
      }}
    >
      {/* Background Layers */}
      <AnimatePresence>
        <StarField
          stars={stars}
          parallaxOffset={parallaxOffset}
          reduceMotion={shouldReduceMotion}
          colors={colors}
        />

        <NebulaGradient
          parallaxOffset={parallaxOffset}
          reduceMotion={shouldReduceMotion}
          colors={colors}
        />

        <ParticleCanvas
          particles={particles}
          parallaxOffset={parallaxOffset}
          reduceMotion={shouldReduceMotion}
          width={dimensions.width}
          height={dimensions.height}
          colors={colors}
        />

        <OrbitingShapes
          parallaxOffset={parallaxOffset}
          reduceMotion={shouldReduceMotion}
          colors={colors}
        />
      </AnimatePresence>

      {/* Content overlay for readability */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20 pointer-events-none"
        aria-hidden="true"
      />

      {/* Debug overlay */}
      {showDebug && <DebugOverlay parallaxOffset={parallaxOffset} />}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundWrapper;
