import { motion } from "framer-motion";
import { 
  PenTool, 
  Github, 
  Twitter, 
  Linkedin, 
  ArrowUp,
  Shield,
  Activity,
  Terminal,
  Cpu,
  Mail,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DecryptedText from "@/components/ui/DecryptedText";
import { TerminalModal } from "@/components/ui/TerminalModal";
import { useState } from "react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [terminalOpen, setTerminalOpen] = useState(false);
  const [activeData, setActiveData] = useState({ title: "", content: <></> });

  const handleLinkClick = (e: React.MouseEvent, link: any) => {
      e.preventDefault();
      setActiveData({
          title: link.label,
          content: (
              <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                          <h3 className="text-xl font-bold text-primary mb-1">MODULE: {link.label.toUpperCase()}</h3>
                          <p className="text-xs font-mono text-muted-foreground">ID: {link.label.toLowerCase().replace(/\s+/g, '-')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${link.status === 'Active' || !link.status ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                          <span className="text-xs font-mono text-green-400">ONLINE</span>
                      </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-4 rounded-sm">
                      <p className="text-gray-300 leading-relaxed text-sm">{link.detailedDesc || link.desc}</p>
                  </div>
                  
                  {link.features && (
                      <div className="space-y-2">
                          <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Capabilities</h4>
                          <div className="grid grid-cols-2 gap-2">
                              {link.features.map((feature: string, i: number) => (
                                  <div key={i} className="flex items-center gap-2 text-xs text-gray-400 bg-black/20 p-2 border border-white/5">
                                      <div className="w-1 h-1 bg-primary rounded-full" />
                                      {feature}
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {link.stats && (
                       <div className="grid grid-cols-2 gap-4">
                          {Object.entries(link.stats).map(([key, value]) => (
                              <div key={key} className="p-3 border border-white/10 bg-white/5">
                                  <span className="block text-[10px] text-muted-foreground uppercase mb-1">{key}</span>
                                  <span className="text-blue-400 font-mono text-xs">{value as string}</span>
                              </div>
                          ))}
                       </div>
                  )}

                  {link.codeSnippet && (
                      <div className="mt-4">
                          <div className="flex items-center justify-between bg-black/80 border border-white/10 border-b-0 px-3 py-1">
                              <span className="text-[10px] text-gray-500 font-mono">terminal</span>
                              <div className="flex gap-1.5">
                                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
                              </div>
                          </div>
                          <div className="p-4 bg-black/90 border border-white/10 font-mono text-xs text-gray-400 overflow-x-auto">
                              <p className="text-green-500">$ {link.codeSnippet}</p>
                              <p className="text-gray-600 mt-1 opacity-50">// Executing command...</p>
                          </div>
                      </div>
                  )}
              </div>
          )
      });
      setTerminalOpen(true);
  };

  const footerLinksData = {
    platform: [
      { 
        label: "Visual Studio", 
        desc: "Advanced drag-and-drop builder for rapid UI composition.",
        detailedDesc: "The core of AI Form Builder is our Visual Studio. It provides a pixel-perfect design environment where you can drag, drop, and configure components with real-time feedback. It's not just a builder; it's a full-featured IDE for visual development.",
        features: ["Drag & Drop", "Real-time Preview", "Component Isolation", "Props Editor"],
        stats: { "Engine": "React 19", "Latency": "<16ms", "Components": "50+" },
        codeSnippet: "ai-builder studio --open"
      },
      { 
        label: "AI Assistant", 
        desc: "Intelligent code generation and layout suggestions.",
        detailedDesc: "Leverage state-of-the-art AI to generate complex layouts, refactor components, and optimize your code structure. Our AI assistant understands your design intent and suggests improvements in real-time.",
        features: ["Context-Aware Suggestions", "Auto-Refactoring", "Layout Generation", "Style Optimization"],
        stats: { "Model": "GPT-4o", "Response": "<1s", "Accuracy": "98%" },
        codeSnippet: "ai.generate('dashboard layout with sidebar')"
      },
      { 
        label: "Universal Export", 
        desc: "Export to React, Vue, Svelte, Angular, and more.",
        detailedDesc: "Don't get locked in. AI Form Builder's Universal Export engine transpiles your visual designs into clean, idiomatic code for any major framework. Use Tailwind, CSS Modules, or Styled Components - the choice is yours.",
        features: ["React/Next.js", "Vue/Nuxt", "Svelte/Kit", "Angular", "HTML/CSS"],
        stats: { "Frameworks": "8+", "Code Quality": "A+", "Lock-in": "0%" },
        codeSnippet: "ai-builder export --target=vue --style=tailwind"
      },
      { 
        label: "Component Library", 
        desc: "Pre-built, accessible components powered by shadcn/ui.",
        detailedDesc: "Access a vast library of pre-built components, fully accessible and customizable. Based on the popular shadcn/ui library, these components ensure your application looks professional and functions perfectly out of the box.",
        features: ["WAI-ARIA Compliant", "Dark Mode Ready", "Themable", "Responsive"],
        stats: { "Components": "100+", "Accessibility": "WCAG 2.1", "Updates": "Weekly" },
        codeSnippet: "import { Button } from '@ai-builder/ui';"
      },
    ],
    resources: [
      { 
        label: "Documentation", 
        desc: "Comprehensive guides and API references.",
        detailedDesc: "Everything you need to master AI Form Builder. From quick start guides to deep dives into the plugin architecture, our documentation is built for developers by developers.",
        features: ["Interactive Examples", "Video Tutorials", "API Reference", "Architecture Guide"],
        stats: { "Pages": "400+", "Examples": "1M+", "Search": "Instant" },
        codeSnippet: "docs.search('custom components')"
      },
      { 
        label: "Templates", 
        desc: "Start faster with production-ready templates.",
        detailedDesc: "Browse our marketplace of professionally designed templates. Dashboards, landing pages, authentication flows, and e-commerce layouts - all ready to customize and deploy.",
        features: ["Dashboard Kits", "SaaS Starters", "Marketing Pages", "App UI"],
        stats: { "Categories": "12", "Free": "50+", "Premium": "100+" },
        codeSnippet: "ai-builder init --template=saas-dashboard"
      },
      { 
        label: "Changelog", 
        desc: "Latest features, fixes, and improvements.",
        detailedDesc: "Stay up to date with the rapid evolution of AI Form Builder. We release weekly updates with performance improvements, new components, and feature enhancements based on community feedback.",
        features: ["Weekly Updates", "LTS Versions", "Beta Access", "Roadmap"],
        stats: { "Version": "2.4.0", "Release": "Stable", "Frequency": "Weekly" },
        codeSnippet: "npm list @ai-builder/core"
      },
      { 
        label: "Community", 
        desc: "Join thousands of developers building with AI Form Builder.",
        detailedDesc: "Connect with other developers, share your creations, and get help from the community. Our Discord server and GitHub discussions are vibrant hubs of innovation.",
        features: ["Discord Server", "GitHub Discussions", "Community Showcases", "Plugin Registry"],
        stats: { "Members": "15k+", "Online": "1.2k", "Topics": "Dev/Design" },
        codeSnippet: "open https://discord.gg/ai-builder"
      },
    ],
    legal: [
      { 
        label: "Privacy Policy", 
        desc: "How we handle your data.",
        detailedDesc: "We believe in data sovereignty. Your designs and code belong to you. We only collect essential telemetry to improve the product, and you can opt-out at any time.",
        features: ["GDPR Compliant", "Data Sovereignty", "No Tracking", "Transparent"],
        stats: { "Last Updated": "Jan 2026", "Compliance": "Global", "Data": "Encrypted" },
        codeSnippet: "privacy.policy.read()"
      },
      { 
        label: "Terms of Service", 
        desc: "Usage agreements.",
        detailedDesc: "Clear, fair terms for using AI Form Builder. We support open source and commercial usage with plans tailored to freelancers, startups, and enterprises.",
        features: ["Fair Usage", "Commercial Rights", "SLA", "Support Tiers"],
        stats: { "License": "MIT/Proprietary", "Jurisdiction": "US", "Version": "2.1" },
        codeSnippet: "terms.agree()"
      },
      { 
        label: "Security", 
        desc: "Platform security measures.",
        detailedDesc: "Enterprise-grade security is baked in. From SOC2 compliance to regular penetration testing, we ensure your development environment is secure and reliable.",
        features: ["SOC2 Type II", "SAML/SSO", "Audit Logs", "2FA Support"],
        stats: { "Uptime": "99.99%", "Audits": "Quarterly", "Bounty": "Active" },
        codeSnippet: "security.status()"
      },
    ]
  };

  return (
    <footer className="relative z-50 border-t border-border bg-background overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{
             backgroundImage: 'linear-gradient(90deg, currentColor 1px, transparent 1px), linear-gradient(180deg, currentColor 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }} 
      />

      <div className="container-studio relative z-10 pt-16 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground neo-border">
                <PenTool className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight font-mono">
                <DecryptedText text="AI_FORM_BUILDER" animateOn="view" speed={50} maxIterations={10} />
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              <DecryptedText 
                text="The advanced AI-powered UI editor for generating production-ready code across any framework. Build faster, validate instantly, export anywhere." 
                animateOn="view" 
                speed={20} 
                maxIterations={6} 
              />
            </p>
            
            <div className="flex gap-2 pt-4">
               <div className="px-3 py-1 bg-background border border-border flex items-center gap-2 rounded-none">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    <DecryptedText text="AI Powered" animateOn="view" speed={40} maxIterations={8} />
                  </span>
               </div>
               <div className="px-3 py-1 bg-background border border-border flex items-center gap-2 rounded-none">
                  <Shield className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    <DecryptedText text="Type Safe" animateOn="view" speed={40} maxIterations={8} />
                  </span>
               </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-xs font-bold text-primary uppercase tracking-wider mb-6 flex items-center gap-2">
              <Terminal className="w-3 h-3" /> 
              <DecryptedText text="Platform" animateOn="view" speed={50} maxIterations={8} />
            </h4>
            <ul className="space-y-3">
              {footerLinksData.platform.map((link) => (
                <li key={link.label}>
                  <a 
                    href="#" 
                    onClick={(e) => handleLinkClick(e, link)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-xs font-bold text-primary uppercase tracking-wider mb-6 flex items-center gap-2">
               <Cpu className="w-3 h-3" /> 
               <DecryptedText text="Resources" animateOn="view" speed={50} maxIterations={8} />
            </h4>
            <ul className="space-y-3">
              {footerLinksData.resources.map((link) => (
                <li key={link.label}>
                  <a 
                    href="#" 
                    onClick={(e) => handleLinkClick(e, link)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-mono text-xs font-bold text-primary uppercase tracking-wider mb-6 flex items-center gap-2">
              <Activity className="w-3 h-3" /> 
              <DecryptedText text="Newsletter" animateOn="view" speed={50} maxIterations={8} />
            </h4>
            <p className="text-xs text-muted-foreground mb-4">
              <DecryptedText 
                text="Join our developer network. Get the latest templates, AI prompts, and tutorials delivered to your inbox." 
                animateOn="view" 
                speed={20} 
                maxIterations={6} 
              />
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="ENTER_EMAIL_ADDRESS" 
                className="bg-background border-border font-mono text-xs rounded-none h-10 focus:ring-1 focus:ring-primary" 
              />
              <Button className="h-10 rounded-none w-12 p-0 bg-primary hover:bg-primary/90">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-6 flex gap-4">
                <a href="#" className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all bg-background/50 hover:bg-primary/5">
                    <Github className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all bg-background/50 hover:bg-primary/5">
                    <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all bg-background/50 hover:bg-primary/5">
                    <Linkedin className="w-4 h-4" />
                </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
             <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
               © {new Date().getFullYear()} AI Form Builder. All Rights Reserved.
             </p>
             <div className="flex gap-6">
                {footerLinksData.legal.map(link => (
                    <a 
                        key={link.label} 
                        href="#" 
                        onClick={(e) => handleLinkClick(e, link)}
                        className="text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors uppercase"
                    >
                        {link.label}
                    </a>
                ))}
             </div>
          </div>


          <Button 
            onClick={scrollToTop}
            variant="outline" 
            size="icon"
            className="border-border hover:border-primary hover:text-primary bg-background rounded-none w-10 h-10 transition-all hover:-translate-y-1"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <TerminalModal 
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        title={activeData.title}
        content={activeData.content}
      />
    </footer>
  );
}
