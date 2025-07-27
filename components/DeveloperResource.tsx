import {
  ArrowRight,
  BookOpen,
  Code, // Added for floating icons
  Cpu, // Added for floating icons
  Database,
  Github,
  Lock, // Added for floating icons
  Network,
  Terminal,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const DeveloperResources = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null); // Ref for the section to track mouse

  // Mouse tracking for interactive background elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      return () => section.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  const resourceCards = [
    {
      title: "API Reference",
      description: "Complete endpoint documentation for seamless integration.",
      icon: Terminal,
    },
    {
      title: "Code Examples",
      description: "Ready-to-use integration samples for various languages.",
      icon: Code,
    },
    {
      title: "Community",
      description: "Join our developer community for support and discussions.",
      icon: Users,
    },
  ];

  const floatingIcons = [
    { Icon: Lock, delay: 0, color: "text-blue-400" },
    { Icon: Cpu, delay: 1000, color: "text-green-400" },
    { Icon: Database, delay: 2000, color: "text-purple-400" },
    { Icon: Network, delay: 3000, color: "text-orange-400" },
  ];

  return (
    <section
      ref={sectionRef} // Attach ref to the section
      className="relative overflow-hidden min-h-screen flex flex-col py-16"
    >
      {/* Dynamic Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
        }}
      />

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, color }, index) => (
        <div
          key={index}
          className={`absolute ${color} opacity-20`}
          style={{
            left: `${10 + index * 20}%`,
            top: `${20 + index * 15}%`,
            animation: `float-icon-${index} 6s infinite ease-in-out`,
            animationDelay: `${delay}ms`,
            transform: `scale(${1 + mousePos.x * 0.2})`,
          }}
        >
          <Icon size={40} />
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
        {/* Developer Resources Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
            Developer Resources
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Everything You Need to Get Started. Comprehensive guides, API
            references, and code examples. Built by developers, for developers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {resourceCards.map((card, index) => {
            const CardContent = (
              <>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mr-4 flex-shrink-0">
                    <card.icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors duration-300">
                    {card.title}
                  </h3>
                </div>
                <p className="text-white/90 text-base mb-4 flex-grow">
                  {card.description}
                </p>
              </>
            );

            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-[rgba(26,26,46,0.6)] to-[rgba(36,5,14,0.6)] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-2 shadow-2xl hover:shadow-indigo-500/30 flex flex-col justify-between cursor-default"
              >
                {CardContent}
              </div>
            );
          })}
        </div>

        {/* New Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16">
          {/* GitHub Button */}
          <a href="#github" target="_blank" rel="noopener noreferrer">
            <button className="group relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <span>View on GitHub</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
          </a>

          {/* Documentation Button */}
          <a href="/docs">
            <button className="group relative bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-primary-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Read the Docs</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-icon-0 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-icon-1 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-180deg);
          }
        }

        @keyframes float-icon-2 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(90deg);
          }
        }

        @keyframes float-icon-3 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-35px) rotate(-90deg);
          }
        }
      `}</style>
    </section>
  );
};

export default DeveloperResources;
