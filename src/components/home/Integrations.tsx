import { motion } from "framer-motion";
import { 
    Layers, 
    Box, 
    Cpu, 
    Database, 
    Globe, 
    Layout, 
    Server, 
    Zap 
} from "lucide-react";
import DecryptedText from "@/components/ui/DecryptedText";

// Tech Logos
import reactLogo from "@/assets/tech/react-svgrepo-com.svg";
import nextjsLogo from "@/assets/tech/next-js-svgrepo-com.svg";
import vueLogo from "@/assets/tech/vue-vuejs-javascript-js-framework-svgrepo-com.svg";
import svelteLogo from "@/assets/tech/svelte-svgrepo-com.svg";
import angularLogo from "@/assets/tech/angular-svgrepo-com.svg";
import tailwindLogo from "@/assets/tech/tailwind-svgrepo-com.svg";
import zodLogo from "@/assets/tech/json-svgrepo-com.svg";
import typescriptLogo from "@/assets/tech/typescript-icon-svgrepo-com.svg";

const integrations = [
    {
        name: "React",
        logo: reactLogo,
        desc: "Native component export with hooks.",
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/20"
    },
    {
        name: "Next.js",
        logo: nextjsLogo,
        desc: "Server Component compatibility.",
        color: "text-white",
        bg: "bg-white/10",
        border: "border-white/20",
        invert: true
    },
    {
        name: "Vue",
        logo: vueLogo,
        desc: "Composition API support.",
        color: "text-green-400",
        bg: "bg-green-400/10",
        border: "border-green-400/20"
    },
    {
        name: "Svelte",
        logo: svelteLogo,
        desc: "Clean, compiled output.",
        color: "text-orange-400",
        bg: "bg-orange-400/10",
        border: "border-orange-400/20"
    },
    {
        name: "Angular",
        logo: angularLogo,
        desc: "Full module generation.",
        color: "text-red-400",
        bg: "bg-red-400/10",
        border: "border-red-400/20"
    },
    {
        name: "Tailwind",
        logo: tailwindLogo,
        desc: "Utility-first styling.",
        color: "text-cyan-400",
        bg: "bg-cyan-400/10",
        border: "border-cyan-400/20"
    },
    {
        name: "Zod",
        logo: zodLogo,
        desc: "Schema validation included.",
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        border: "border-purple-400/20"
    },
    {
        name: "TypeScript",
        logo: typescriptLogo,
        desc: "Strict type safety.",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    }
];

export function Integrations() {
    return (
        <section id="integrations" className="py-24 bg-background border-t border-border relative overflow-hidden">
            {/* Background Text Texture */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
                <div className="absolute top-1/4 -left-20 text-[20vw] font-bold font-mono text-foreground leading-none rotate-90 origin-top-left">
                    CONNECT
                </div>
            </div>

            <div className="container-studio relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left: Text Content */}
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary rounded-sm">
                                <Cpu className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-primary-foreground bg-primary px-2 uppercase tracking-tighter transform -skew-x-6">
                                <DecryptedText text="Ecosystem" animateOn="view" speed={40} />
                            </h2>
                        </div>
                        
                        <h3 className="text-display-sm text-foreground mb-6 leading-none">
                            <span className="block text-muted-foreground text-3xl mb-2">WORKS WITH</span>
                             <DecryptedText text="YOUR STACK" animateOn="view" speed={60} />
                        </h3>
                        
                        <p className="text-body text-muted-foreground mb-8 max-w-md">
                            <DecryptedText 
                                text="Qene Form Builder isn't just a walled garden. It's a bridge to your existing infrastructure. We support every major modern framework and tooling standard out of the box." 
                                animateOn="view" 
                                speed={20}
                                maxIterations={10}
                            />
                        </p>

                        <div className="p-6 bg-muted/20 border border-border rounded-sm backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-4 text-sm font-mono text-primary">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                LIVE_VERSION_CHECK
                            </div>
                            <div className="space-y-2 font-mono text-xs text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>react</span>
                                    <span className="text-foreground">v19.0.0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>vue</span>
                                    <span className="text-foreground">v3.4.0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>svelte</span>
                                    <span className="text-foreground">v5.0.0</span>
                                </div>
                                <div className="flex justify-between border-t border-border pt-2 mt-2">
                                    <span>qene-core</span>
                                    <span className="text-primary">v2.4.0</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                        {integrations.map((item, index) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                className="group cursor-default"
                            >
                                <div className={`w-10 h-10 flex items-center justify-center rounded-sm mb-4 group-hover:scale-110 transition-transform`}>
                                    <img 
                                        src={item.logo} 
                                        alt={item.name} 
                                        className={`w-8 h-8 grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100 ${item.invert ? "invert brightness-200" : ""}`} 
                                    />
                                </div>
                                <h4 className={`text-lg font-bold mb-1 ${item.color} font-mono`}>
                                    <DecryptedText text={item.name} animateOn="view" speed={50} />
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                    <DecryptedText text={item.desc} animateOn="view" speed={30} maxIterations={5} />
                                </p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
