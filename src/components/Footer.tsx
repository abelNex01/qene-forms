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
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setNewsletterSubmitted(true);
    }
  };

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

                  {link.url && (
                      <div className="mt-6 pt-4 border-t border-white/5">
                          <a 
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-all font-mono"
                          >
                              <span className="border-b border-primary/30 group-hover:border-primary pb-0.5 uppercase tracking-wider">
                                  {link.urlLabel || "VISIT_RESOURCE"}
                              </span>
                              <Zap className="w-3 h-3 animate-pulse" />
                          </a>
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
        label: "Qene Studio", 
        desc: "Advanced visual editor for rapid form composition.",
        detailedDesc: "The Qene Studio is our professional-grade visual environment for form construction. It provides a distraction-free, high-performance workspace where you can drag and drop fields, configure validation rules, and build complex form structures with ease.",
        features: ["Drag & Drop", "Real-time Preview", "Field Configuration", "Validation Rules"],
        stats: { "Engine": "V4-Core", "Latency": "<16ms", "Field Types": "15+" },
        url: "/dashboard",
        urlLabel: "LAUNCH_STUDIO",
        codeSnippet: "qene-forms --studio"
      },
      { 
        label: "About Application", 
        desc: "The mission and technology behind the Qene ecosystem.",
        detailedDesc: "Qene Forms is a professional form building tool designed for developers who want to create forms visually and export clean, production-ready code. Our philosophy is rooted in 'Code as a First Class Citizen', ensuring every form generated is clean, accessible, and ready for production.",
        features: ["Visual Builder", "Multi-Framework Export", "Universal Framework Support", "Type-Safe Architecture"],
        stats: { "Version": "v2.4.0-STABLE", "Status": "ONLINE", "Core": "OPEN_SOURCE" },
        url: "https://qeneforms.com",
        urlLabel: "OFFICIAL_WEBSITE",
        codeSnippet: "qene --info"
      },
      { 
        label: "Universal Export", 
        desc: "Export to React, Vue, Svelte, Angular, and more.",
        detailedDesc: "Don't get locked in. Qene Forms' Universal Export engine transpiles your visual designs into clean, idiomatic code for any major framework. Use Tailwind, CSS Modules, or Styled Components - the choice is yours.",
        features: ["React/Next.js", "Vue/Nuxt", "Svelte/Kit", "Angular", "HTML/CSS"],
        stats: { "Frameworks": "8+", "Code Quality": "A+", "Lock-in": "0%" },
        codeSnippet: "import { exportForm } from 'qene-forms'"
      },
      { 
        label: "Component Library", 
        desc: "Pre-built, accessible form components.",
        detailedDesc: "Access a specialized library of form inputs, selects, date pickers, and file uploads. Fully accessible and styled, ready to drop into any application.",
        features: ["WAI-ARIA Compliant", "Dark Mode Ready", "Themable", "Responsive"],
        stats: { "Components": "15+", "Accessibility": "WCAG 2.1", "Updates": "Regular" },
        codeSnippet: "import { Button } from 'qene-forms/ui';"
      },
    ],
    resources: [
      { 
        label: "Documentation", 
        desc: "Comprehensive guides and API references.",
        detailedDesc: "Everything you need to master Qene Forms. From quick start guides to deep dives into the export system, our documentation is built for developers by developers.",
        features: ["Interactive Examples", "Video Tutorials", "API Reference", "Architecture Guide"],
        stats: { "Pages": "50+", "Examples": "100+", "Search": "Instant" },
        codeSnippet: "docs.search('custom components')"
      },
      { 
        label: "Templates", 
        desc: "Start faster with production-ready form templates.",
        detailedDesc: "Browse our collection of common form patterns. Registration flows, checkout pages, surveys, and multi-step wizards - all pre-configured and ready to customize.",
        features: ["Registration Forms", "Contact Forms", "Surveys", "Multi-Step Wizards"],
        stats: { "Categories": "8", "Free": "20+", "Premium": "Coming Soon" },
        codeSnippet: "npx create-qene-app --template=registration"
      },
      { 
        label: "Changelog", 
        desc: "Latest features, fixes, and improvements.",
        detailedDesc: "Stay up to date with the evolution of Qene Forms. We release regular updates with performance improvements, new field types, and feature enhancements based on community feedback.",
        features: ["Regular Updates", "LTS Versions", "Beta Access", "Roadmap"],
        stats: { "Version": "2.4.0", "Release": "Stable", "Frequency": "Monthly" },
        codeSnippet: "npm list qene-forms"
      },
      { 
        label: "Community", 
        desc: "Join developers building with Qene Forms.",
        detailedDesc: "Connect with other developers, share your creations, and get help from the community. Our Discord server and GitHub discussions are hubs for sharing form designs and best practices.",
        features: ["Discord Server", "GitHub Discussions", "Community Showcases", "Plugin Registry"],
        stats: { "Members": "Growing", "Online": "Active", "Topics": "Dev/Design" },
        codeSnippet: "open https://discord.gg/qene-forms"
      },
    ],
    legal: [
      { 
        label: "Privacy Policy", 
        desc: "How we handle your data.",
        detailedDesc: "We believe in data sovereignty. Your designs and code belong to you. Qene Forms runs entirely in your browser - no data is sent to external servers. Your forms stay on your machine.",
        features: ["GDPR Compliant", "Data Sovereignty", "No Tracking", "Transparent"],
        stats: { "Last Updated": "Jan 2026", "Compliance": "Global", "Data": "Local Only" },
        codeSnippet: "privacy.policy.read()"
      },
      { 
        label: "Terms of Service", 
        desc: "Usage agreements.",
        detailedDesc: "Clear, fair terms for using Qene Forms. We support open source and commercial usage with plans tailored to freelancers, startups, and enterprises.",
        features: ["Fair Usage", "Commercial Rights", "SLA", "Support Tiers"],
        stats: { "License": "MIT/Proprietary", "Jurisdiction": "US", "Version": "2.1" },
        codeSnippet: "terms.agree()"
      },
      { 
        label: "Security", 
        desc: "Platform security measures.",
        detailedDesc: "Your data never leaves your browser. Qene Forms processes everything locally, ensuring maximum privacy and security for your form designs and exported code.",
        features: ["Browser-Local Processing", "No Cloud Upload", "Secure Export", "Regular Updates"],
        stats: { "Processing": "Local", "Upload": "None", "Privacy": "Maximum" },
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
                <img src="/qenelogo.svg" alt="Qene Forms Logo" className="w-64 object-contain" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              <DecryptedText 
                text="The professional drag-and-drop form builder. Create beautiful, validated forms visually and export production-ready code for any framework." 
                animateOn="view" 
                speed={20} 
                maxIterations={6} 
              />
            </p>
            
            <div className="flex gap-2 pt-4">
               <div className="px-3 py-1 bg-background border border-border flex items-center gap-2 rounded-none">
                 <PenTool className="w-3 h-3 text-primary" />
                 <span className="text-[10px] font-mono text-muted-foreground uppercase">
                   <DecryptedText text="Visual Builder" animateOn="view" speed={40} maxIterations={8} />
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
                    <DecryptedText text={link.label} animateOn="view" speed={50} maxIterations={5} />
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
            {newsletterSubmitted ? (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-primary/10 border border-primary/20 p-4 rounded-none"
               >
                 <p className="text-primary text-xs font-mono font-bold uppercase tracking-wider mb-1">
                   Subscription Active
                 </p>
                 <p className="text-[10px] text-muted-foreground leading-relaxed">
                   We will update you about new features, templates and security patches as they deploy.
                 </p>
               </motion.div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-4">
                  <DecryptedText 
                    text="Join our developer network. Get the latest templates, tutorials, and updates delivered to your inbox." 
                    animateOn="view" 
                    speed={20} 
                    maxIterations={6} 
                  />
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <Input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER_EMAIL_ADDRESS" 
                    className="bg-background border-border font-mono text-xs rounded-none h-10 focus:ring-1 focus:ring-primary" 
                  />
                  <Button type="submit" className="h-10 rounded-none w-12 p-0 bg-primary hover:bg-primary/90">
                    <Mail className="w-4 h-4" />
                  </Button>
                </form>
              </>
            )}
            <div className="mt-6 flex gap-4">
                <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-8 h-8 flex items-center justify-center border border-border text-primary hover:border-primary transition-all bg-background/50 hover:bg-primary/5"
                >
                    <Github className="w-4 h-4 fill-primary" strokeWidth={0} />
                </a>
                <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-8 h-8 flex items-center justify-center border border-border text-primary hover:border-primary transition-all bg-background/50 hover:bg-primary/5"
                >
                    <Linkedin className="w-4 h-4 fill-primary" strokeWidth={0} />
                </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
             <div className="flex flex-col gap-1">
               <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                 © {new Date().getFullYear()} <DecryptedText text="Qene Forms. All Rights Reserved." animateOn="view" speed={50} />
               </p>
               <p className="text-[9px] font-mono text-primary/60 uppercase tracking-widest">
                 Developed by Pixelbet Studio
               </p>
             </div>
             <div className="flex gap-6">
                {footerLinksData.legal.map(link => (
                    <a 
                        key={link.label} 
                        href="#" 
                        onClick={(e) => handleLinkClick(e, link)}
                        className="text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors uppercase"
                    >
                        <DecryptedText text={link.label} animateOn="view" speed={50} />
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
