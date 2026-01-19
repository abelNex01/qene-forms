import { motion } from "framer-motion";
import { Terminal, Copy, Check } from "lucide-react";
import { useState } from "react";
import DecryptedText from "@/components/ui/DecryptedText";

export function Installation() {
  const [copied, setCopied] = useState("");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  const commands = [
    {
      id: "install",
      label: "Install Package",
      cmd: "npm install qene-forms"
    },
    {
      id: "usage",
      label: "Import Component",
      cmd: "import { FormBuilder } from 'qene-forms'"
    }
  ];

  return (
    <section id="installation" className="py-24 bg-background border-t border-border">
      <div className="container-studio">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1">
             <div className="bg-[#0c0c0c] border border-white/10 rounded-sm overflow-hidden shadow-2xl relative">
                {/* Terminal Header */}
                <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-between">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                   </div>
                   <div className="text-[10px] font-mono text-muted-foreground">zsh — 80x24</div>
                </div>

                {/* Terminal Content */}
                <div className="p-6 font-mono text-sm space-y-6">
                   {commands.map((item) => (
                     <div key={item.id} className="group">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-gray-500 text-xs"># {item.label}</span>
                           <button 
                             onClick={() => copyToClipboard(item.cmd, item.id)}
                             className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-white"
                           >
                              {copied === item.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                           </button>
                        </div>
                        <div className="bg-black/50 p-3 border border-white/5 rounded text-gray-300">
                           <span className="text-pink-500 select-none">$ </span>
                           {item.cmd}
                        </div>
                     </div>
                   ))}
                   
                   <div className="animate-pulse flex items-center gap-2 text-green-500">
                      <span>➤</span>
                      <span className="w-2 h-4 bg-green-500 block" />
                   </div>
                </div>
             </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary rounded-sm">
                    <Terminal className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-primary-foreground bg-primary px-2 uppercase tracking-tighter transform -skew-x-6">
                    <DecryptedText text="Start Building" animateOn="view" speed={40} />
                </h2>
            </div>
            <p className="text-body text-muted-foreground mb-8">
                <DecryptedText text="Install the Qene Forms library to easily integrate powerful form building capabilities directly into your React applications." animateOn="view" speed={20} maxIterations={10} />
            </p>
            <div className="flex flex-col gap-4 border-l-2 border-primary/20 pl-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span className="text-sm font-mono text-muted-foreground"><DecryptedText text="MIT License (Core)" animateOn="view" speed={40} /></span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span className="text-sm font-mono text-muted-foreground"><DecryptedText text="Latest: v1.0.0" animateOn="view" speed={40} /></span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span className="text-sm font-mono text-muted-foreground"><DecryptedText text="React & Next.js Compatible" animateOn="view" speed={40} /></span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
