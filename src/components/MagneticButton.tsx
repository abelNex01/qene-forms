import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export function MagneticButton({
  children,
  className,
  magneticStrength = 0.3,
  variant = 'default',
  size = 'default',
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    setPosition({
      x: distanceX * magneticStrength,
      y: distanceY * magneticStrength,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variantStyles = {
    default: 'bg-foreground text-background hover:bg-foreground/90',
    outline: 'border border-border bg-transparent hover:bg-foreground/5',
    ghost: 'bg-transparent hover:bg-foreground/5',
  };

  const sizeStyles = {
    default: 'h-12 px-6 text-sm',
    sm: 'h-10 px-4 text-sm',
    lg: 'h-14 px-8 text-base',
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 font-medium transition-colors focus-ring tracking-wide neo-border-interactive',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default MagneticButton;
