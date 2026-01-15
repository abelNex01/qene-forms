import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  animation?: 'words' | 'characters' | 'lines';
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: (custom: { staggerDelay: number }) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.staggerDelay,
    },
  }),
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as any,
    },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
};

export function AnimatedText({
  text,
  className,
  as: Component = 'p',
  animation = 'words',
  delay = 0,
  staggerDelay = 0.03,
  once = true,
}: AnimatedTextProps) {
  const MotionComponent = motion[Component] as typeof motion.p;

  if (animation === 'words') {
    const words = text.split(' ');

    return (
      <MotionComponent
        className={cn('flex flex-wrap', className)}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once }}
        custom={{ staggerDelay }}
        style={{ transitionDelay: `${delay}s` }}
      >
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            className="mr-[0.25em] inline-block"
            variants={wordVariants}
          >
            {word}
          </motion.span>
        ))}
      </MotionComponent>
    );
  }

  if (animation === 'characters') {
    const characters = text.split('');

    return (
      <MotionComponent
        className={className}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once }}
        custom={{ staggerDelay: staggerDelay / 2 }}
        style={{ transitionDelay: `${delay}s` }}
      >
        {characters.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            className="inline-block"
            variants={charVariants}
            style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </MotionComponent>
    );
  }

  // Lines animation
  const lines = text.split('\n');

  return (
    <MotionComponent
      className={cn('flex flex-col', className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      custom={{ staggerDelay: staggerDelay * 3 }}
      style={{ transitionDelay: `${delay}s` }}
    >
      {lines.map((line, index) => (
        <motion.span
          key={`${line}-${index}`}
          className="block overflow-hidden"
          variants={wordVariants}
        >
          <motion.span className="block" variants={wordVariants}>
            {line}
          </motion.span>
        </motion.span>
      ))}
    </MotionComponent>
  );
}

// Animated heading with split text reveal
interface AnimatedHeadingProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  delay?: number;
}

export function AnimatedHeading({
  children,
  className,
  as: Component = 'h2',
  delay = 0,
}: AnimatedHeadingProps) {
  const MotionComponent = motion[Component] as typeof motion.h2;
  const words = children.split(' ');

  return (
    <MotionComponent
      className={cn('overflow-hidden', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '100%' },
              visible: {
                y: 0,
                transition: {
                  delay: delay + index * 0.1,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionComponent>
  );
}

export default AnimatedText;
