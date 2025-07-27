"use client";

import { Terminal, Lock, Globe } from "lucide-react";

export default function ServicesSection() {
  return (
    <section className="py-40 relative overflow-hidden bg-transparent text-white">
      {/* Glowing Floating Blurs */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-indigo-400/20 blur-3xl rounded-full animate-float-slow" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 blur-2xl rounded-full animate-float-slower" />
      </div>

      {/* Floating Glass Card */}
      <div className="relative z-20 max-w-6xl mx-auto px-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_20px_80px_rgba(99,102,241,0.25)] rounded-3xl p-12 md:p-20 transition-all duration-500 hover:shadow-[0_30px_100px_rgba(99,102,241,0.35)]">
          <div className="mb-16 text-center">
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Add secure, verified identity checks to your platform in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Code Card */}
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-[0_20px_80px_rgba(99,102,241,0.15)] relative">
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
                <div className="text-sm bg-white/10 px-3 py-1 rounded-full text-white/70">
                  JavaScript SDK
                </div>
              </div>

              <pre className="text-green-400 text-sm leading-relaxed font-mono whitespace-pre-wrap">
{`const faydapass = new FaydaPass({
  apiKey: 'fp_live_...'
});

const user = await faydapass.verify({
  redirectUrl: '/success'
});

console.log(user.verified); // true`}
              </pre>
            </div>

            {/* Feature List */}
            <div className="space-y-10">
              {[
                {
                  icon: <Terminal className="w-6 h-6 text-indigo-400" />,
                  title: "Easy Integration",
                  desc: "Integrate using just 3 lines of code with flexible APIs.",
                },
                {
                  icon: <Lock className="w-6 h-6 text-indigo-400" />,
                  title: "Secure by Default",
                  desc: "OAuth 2.0 compliant with end-to-end encryption.",
                },
                {
                  icon: <Globe className="w-6 h-6 text-indigo-400" />,
                  title: "Backed by Government",
                  desc: "Powered by Fayda and Ethiopia’s national ID infrastructure.",
                },
              ].map(({ icon, title, desc }, idx) => (
                <div key={idx} className="flex items-start space-x-5 group">
                  <div className="w-12 h-12 flex-shrink-0 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition duration-300">
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
                    <p className="text-white/70 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
