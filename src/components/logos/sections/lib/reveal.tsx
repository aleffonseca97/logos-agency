"use client";

import { m, useReducedMotion } from "framer-motion";

import { fadeUp, stagger, viewport } from "./motion";

type RevealGroupProps = {
  children: React.ReactNode;
  className?: string;
};

export function RevealGroup({ children, className }: RevealGroupProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </m.div>
  );
}

type RevealItemProps = {
  children: React.ReactNode;
  className?: string;
};

export function RevealItem({ children, className }: RevealItemProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div variants={fadeUp} className={className}>
      {children}
    </m.div>
  );
}

type RevealProps = RevealItemProps;

/** Elemento único com animação de entrada. */
export function Reveal({ children, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </m.div>
  );
}
