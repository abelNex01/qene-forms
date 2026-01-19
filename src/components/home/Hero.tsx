import { motion } from "framer-motion";
import { PenTool, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/MagneticButton";
import DecryptedText from "@/components/ui/DecryptedText";
import emailUiImage from "@/assets/emailui.png";
import { TerminalModal } from "@/components/ui/TerminalModal";
import { useState } from "react";

import { useLocation } from "wouter";

// Tech Logos
import reactLogo from "@/assets/tech/react-svgrepo-com.svg";
import vueLogo from "@/assets/tech/vue-vuejs-javascript-js-framework-svgrepo-com.svg";
import svelteLogo from "@/assets/tech/svelte-svgrepo-com.svg";
import angularLogo from "@/assets/tech/angular-svgrepo-com.svg";
import tailwindLogo from "@/assets/tech/tailwind-svgrepo-com.svg";
import typescriptLogo from "@/assets/tech/typescript-icon-svgrepo-com.svg";
import javascriptLogo from "@/assets/tech/javascript-svgrepo-com.svg";
import phpLogo from "@/assets/tech/php2-svgrepo-com.svg";
import nextjsLogo from "@/assets/tech/next-js-svgrepo-com.svg";
import zodLogo from "@/assets/tech/json-svgrepo-com.svg";

export function Hero() {
  const [_, setLocation] = useLocation();
  const [activeData, setActiveData] = useState({ title: "", content: <></> });
  const [terminalOpen, setTerminalOpen] = useState(false);

  const handleDocsClick = () => {
    setActiveData({
      title: "Qene Forms Documentation",
      content: (
        <div className="space-y-8 font-mono text-sm leading-relaxed max-w-3xl">
          {/* Header Section */}
          <div className="border-b border-border/40 pb-6">
            <h1 className="text-3xl font-bold text-primary mb-3 tracking-tight">Qene Forms</h1>
            <p className="text-muted-foreground text-base">
              The Professional Form Builder. Drag, Drop, Export.
            </p>
          </div>

          {/* 1. Dashboard & Usage */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary">01.</span> Dashboard & Usage
            </h2>
            <div className="bg-muted/10 border border-white/5 p-4 rounded-md text-gray-300 text-xs md:text-sm leading-relaxed">
              <p className="mb-3">
                <strong className="text-white">Start Building Immediately:</strong> Visit the{" "}
                <span className="text-primary cursor-pointer hover:underline" onClick={() => setLocation("/dashboard")}>
                  Studio Dashboard
                </span>{" "}
                to access the full suite of tools. No installation required for the web interface.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-white">Drag & Drop Builder:</strong> Build your form by dragging input fields (Text, Email, Checkbox, Select) from the left sidebar onto the canvas.
                </li>
                <li>
                  <strong className="text-white">Field Configuration:</strong> Select any field to customize its label, placeholder, validation rules, and conditional logic in the right sidebar.
                </li>
                <li>
                  <strong className="text-white">Real-time Preview:</strong> See exactly how your form will look as you build it with instant visual feedback.
                </li>
              </ul>
            </div>
          </section>

          {/* 2. Installation */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary">02.</span> Installation (Package)
            </h2>
            <div className="bg-black/40 border border-white/10 p-4 rounded-md font-mono text-xs md:text-sm overflow-x-auto">
              <p className="text-gray-500 mb-2"># Install via NPM</p>
              <p className="mb-4">
                <span className="text-yellow-500">npm</span> install qene-forms
              </p>

              <p className="text-gray-500 mb-2"># Import in your project</p>
              <p>
                <span className="text-purple-400">import</span> {"{ FormBuilder }"}{" "}
                <span className="text-purple-400">from</span> 'qene-forms';
              </p>
            </div>
          </section>

          {/* 3. Core Workflow */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary">03.</span> The Building Process
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-muted/10 p-4 rounded border border-white/5">
                <h3 className="text-white font-bold mb-2">1. Add Fields</h3>
                <p className="text-muted-foreground text-xs">
                  Click or drag field types from the sidebar to add them to your form canvas.
                </p>
              </div>
              <div className="bg-muted/10 p-4 rounded border border-white/5">
                <h3 className="text-white font-bold mb-2">2. Configure</h3>
                <p className="text-muted-foreground text-xs">
                  Customize each field's properties - labels, placeholders, validation rules, and conditional visibility.
                </p>
              </div>
              <div className="bg-muted/10 p-4 rounded border border-white/5">
                <h3 className="text-white font-bold mb-2">3. Export</h3>
                <p className="text-muted-foreground text-xs">
                  Generate production-ready code for React, Vue, Svelte, Angular, or HTML. 100% type-safe.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Features Detail */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary">04.</span> Key Features
            </h2>
            <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong>Intuitive Interface:</strong> Clean, developer-focused UI with drag-and-drop simplicity.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong>Multi-Framework:</strong> Native support for React (Hook Form), Vue 3, Svelte, Angular, and raw HTML.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong>Tailwind CSS 4:</strong> Components are styled with the latest Atomic CSS engine.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong>Zod Validation:</strong> Automatic schema generation for robust form handling.
                </span>
              </li>
            </ul>
          </section>

          {/* 5. Architecture */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary">05.</span> Technical Architecture
            </h2>
            <div className="prose prose-invert prose-sm text-muted-foreground">
              <p>
                Qene Forms uses a modular component architecture built with React 19 and TypeScript. The <strong>CodeGenerator</strong> transpiles your form definition into idiomatic code for your chosen framework with proper validation and accessibility built in.
              </p>
            </div>
          </section>

          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-muted-foreground">
              Looking for the API Reference?{" "}
              <a href="#" className="text-primary hover:underline">
                Check out the GitHub Repository
              </a>
              .
            </p>
          </div>
        </div>
      ),
    });
    setTerminalOpen(true);
  };

  return (
    <section id="hero" className="min-h-[85vh] flex flex-col justify-center relative overflow-hidden grid-pattern pt-20 md:pt-14">
      <div className="container-studio relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Content */}
          <div className="max-w-2xl relative">
             {/* Technical Overline */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-3 mb-8"
            >
                <div className="h-[1px] w-8 md:w-12 bg-primary" />
                <span className="text-mono text-xs md:text-sm text-primary">
                  <DecryptedText text="QENE FORMS" animateOn="view" speed={40} maxIterations={15} />
                </span>
            </motion.div>
            
            <div className="flex flex-col gap-6 relative">


                {/* Main Headline */}
                <div>
                     <h1 className="text-display-sm md:text-display text-foreground mb-2 leading-none">
                       <DecryptedText text="BUILD." animateOn="view" speed={60} maxIterations={12} />
                     </h1>
                     <h1 className="text-display-sm md:text-display text-primary-foreground bg-primary inline-block px-2 mb-2 leading-none transform -skew-x-6">
                       <DecryptedText text="CUSTOMIZE." animateOn="view" speed={60} maxIterations={12} />
                     </h1>
                     <h1 className="text-display-sm md:text-display text-transparent bg-clip-text bg-gradient-to-r from-muted-foreground to-foreground leading-none">
                       <DecryptedText text="EXPORT." animateOn="view" speed={60} maxIterations={12} />
                     </h1>
                </div>

               
            </div>

             <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-body md:text-body-lg text-muted-foreground max-w-xl border-l-2 border-primary/30 pl-6 mt-12 mb-12"
            >
              <DecryptedText 
                text="The professional drag-and-drop form builder. Create complex, validated, and type-safe forms with an intuitive visual interface and export to any framework." 
                animateOn="view" 
                speed={30} 
                maxIterations={8} 
              />
            </motion.p>

            {/* Tech Stack Badges */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="flex flex-wrap gap-3 mb-8"
            >
                {[
                    { name: "React", logo: reactLogo },
                    { name: "Vue", logo: vueLogo },
                    { name: "Svelte", logo: svelteLogo },
                    { name: "Angular", logo: angularLogo },
                    { name: "Next.js", logo: nextjsLogo, invert: true },
                    { name: "Tailwind", logo: tailwindLogo },
                    { name: "TypeScript", logo: typescriptLogo },
                    { name: "JavaScript", logo: javascriptLogo },
                    { name: "PHP", logo: phpLogo },
                    { name: "Zod", logo: zodLogo },
                ].map((tech) => (
                    <div key={tech.name} className="flex items-center justify-center transition-all duration-300 group">
                        <img 
                            src={tech.logo} 
                            alt={tech.name} 
                            className={`w-6 h-6 md:w-6 md:h-6 grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100 group-hover:scale-110 ${tech.invert ? "invert brightness-200" : ""}`} 
                        />
                    </div>
                ))}
            </motion.div>
            
             {/* CTA Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
                <MagneticButton
                onClick={() => setLocation("/dashboard")}
                className="gap-3 h-14 bg-primary text-background hover:bg-primary/90  px-8 w-full sm:w-auto justify-center"
                size="lg"
                >
                <PenTool className="w-5 h-5" />
                <span className="font-bold tracking-wider">
                  <DecryptedText text="LAUNCH STUDIO" animateOn="hover" speed={40} maxIterations={10} />
                </span>
                </MagneticButton>
                
                <Button 
                    variant="outline" 
                    onClick={handleDocsClick}
                    className="h-14 px-8 border-border hover:border-foreground/50 bg-transparent gap-3 text-muted-foreground hover:text-foreground transition-all duration-300 w-full sm:w-auto"
                >
                    <Terminal className="w-5 h-5" />
                    <span>
                      <DecryptedText text="READ THE DOCS" animateOn="hover" speed={40} maxIterations={10} />
                    </span>
                </Button>
            </motion.div>
          </div>

          {/* Right Column: Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              y: [0, -10, 0] // Gentle floating effect
            }}
            transition={{ 
              opacity: { duration: 1, delay: 0.5 },
              x: { duration: 1, delay: 0.5 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" } // Continuous loop
            }}
            className="relative hidden lg:block max-w-[92%] mx-auto"
          >
             <div className="relative z-10">
                 <img 
                    src={emailUiImage} 
                    alt="Qene Forms Interface" 
                    className="w-full rotate-6 h-auto rounded-lg shadow-[0_0_50px_hsl(var(--primary)/0.25)] select-none pointer-events-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                 />
             </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -15, 0] 
                }}
                transition={{ 
                  opacity: { duration: 0.8, delay: 1.0 },
                  scale: { duration: 0.8, delay: 1.0 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 } 
                }}
                className="absolute top-[42%] left-[5%] bg-muted/30 border border-border p-3 backdrop-blur-sm rotate-[-4deg] z-20"
              >
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1 gap-6">
                  <DecryptedText text="DRAG_DROP" animateOn="view" speed={50} maxIterations={8} />
                  <span className="text-success"><DecryptedText text="ACTIVE" animateOn="view" speed={50} maxIterations={8} /></span>
                </div>
                <div className="font-mono text-xs text-primary"><DecryptedText text="BUILDING_FORM..." animateOn="view" speed={50} maxIterations={8} /></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -12, 0]
                }}
                transition={{ 
                  opacity: { duration: 0.8, delay: 1.3 },
                  scale: { duration: 0.8, delay: 1.3 },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 } 
                }}
                className="absolute bottom-[19%] right-[18%] bg-muted/30 border border-border p-4 backdrop-blur-sm rotate-[3deg] z-20"
              >
                <div className="flex justify-between text-xs font-mono text-muted-foreground mb-2 gap-8">
                  <DecryptedText text="PROJECT" animateOn="view" speed={50} maxIterations={8} />
                  <span className="text-primary"><DecryptedText text="SYNCED" animateOn="view" speed={50} maxIterations={8} /></span>
                </div>
                <div className="font-mono text-xs text-foreground/80"><DecryptedText text="Qene_Forms.tsx" animateOn="view" speed={50} maxIterations={8} /></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -18, 0]
                }}
                transition={{ 
                  opacity: { duration: 0.8, delay: 1.6 },
                  scale: { duration: 0.8, delay: 1.6 },
                  y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 } 
                }}
                className="absolute top-[18%] right-[2%] bg-muted/30 border border-border p-4 backdrop-blur-sm w-fit max-w-[280px] rotate-[-2deg] z-20"
              >
                 <div className="flex justify-between text-xs font-mono text-muted-foreground mb-2 gap-8">
                     <DecryptedText text="FRAMEWORK" animateOn="view" speed={50} maxIterations={8} />
                     <span className="text-success"><DecryptedText text="REACT_19" animateOn="view" speed={50} maxIterations={8} /></span>
                 </div>
                 <div className="font-mono text-xs text-primary truncate">
                     <DecryptedText text="EXPORT_READY" animateOn="view" speed={50} maxIterations={8} />
                 </div>
              </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2 }}
        className="absolute bottom-12 right-6 md:right-12 flex flex-col items-end gap-2 hidden sm:flex"
      >
        <span className="text-mono text-xs text-muted-foreground rotate-90 origin-right translate-x-2">
          <DecryptedText text="SCROLL" animateOn="view" speed={50} maxIterations={8} />
        </span>
        <div className="h-16 w-[1px] bg-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-primary animate-fall" />
        </div>
      </motion.div>
      <TerminalModal 
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        title={activeData.title}
        content={activeData.content}
      />
    </section>
  );
}
