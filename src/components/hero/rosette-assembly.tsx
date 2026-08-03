"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

export function RosetteAssembly() {
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [0.2, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [0.85, 1]);

  if (reduced) {
    return (
      <div className="flex justify-center py-12" aria-hidden>
        <svg width="80" height="80" viewBox="0 0 80 80" className="text-gold/50">
          <polygon points="40,4 48,32 76,40 48,48 40,76 32,48 4,40 32,32" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  return (
    <motion.div style={{ opacity, scale }} className="flex justify-center py-12" aria-hidden>
      <svg width="80" height="80" viewBox="0 0 80 80" className="text-gold">
        {[0, 45, 90, 135].map((rot, i) => (
          <motion.line
            key={rot}
            x1="40"
            y1="40"
            x2="40"
            y2="8"
            stroke="currentColor"
            strokeWidth="1"
            transform={`rotate(${rot} 40 40)`}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          />
        ))}
        <motion.polygon
          points="40,4 48,32 76,40 48,48 40,76 32,48 4,40 32,32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        />
      </svg>
    </motion.div>
  );
}
