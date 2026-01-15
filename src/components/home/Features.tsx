import { motion } from "framer-motion";
import { Shield, Zap, Box, Layers, Code, Globe } from "lucide-react";
import DecryptedText from "@/components/ui/DecryptedText";

const features = [
  {
    icon: Zap,
    title: "Universal Export",
    description: "Write once, export anywhere. Generate production-ready code for React, Vue, Svelte, Angular, and plain HTML."
  },
  {
    icon: Code,
    title: "AI Assistant",
    description: "Your intelligent coding partner. Generate complex layouts and refactor components with simple text prompts."
  },
  {
    icon: Box,
    title: "Visual Studio",
    description: "A powerful drag-and-drop IDE that feels like a graphics tool but produces clean, semantic code."
  },
  {
    icon: Shield,
    title: "Private by Design",
    description: "Zero data leakage. Our AI runs 100% locally in your browser using TensorFlow.js, ensuring your prompts and code stay on your device."
  },
  {
    icon: Globe,
    title: "Smart Validation",
    description: "Auto-generated Zod schemas and accessible error handling baked into every form. Robust validation without the boilerplate."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background border-t border-border relative overflow-hidden">
      <div className="container-studio relative z-10">
        <div className="mb-20 text-center max-w-3xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary rounded-sm">
                  <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-primary-foreground bg-primary px-2 uppercase tracking-tighter transform -skew-x-6">
                <DecryptedText text="Platform Power" animateOn="view" speed={40} />
              </h2>
          </div>
          <p className="text-body-lg text-muted-foreground leading-relaxed">
            Qene Forms combines the speed of AI generation with the precision of manual control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-background p-8 hover:bg-muted/5 transition-colors group"
            >
              <div className="mb-6 w-12 h-12 flex items-center justify-center bg-primary/10 text-primary rounded-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground font-mono uppercase">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
