"use client";

import React from "react";

type Direction = "up" | "left" | "right" | "zoom";

export default function Reveal({
  children,
  direction = "up",
  delayMs = 0,
  className = "",
  as: Tag = "div",
  once = true,
}: {
  children: React.ReactNode;
  direction?: Direction;
  delayMs?: number;
  className?: string;
  as?: React.ElementType;
  once?: boolean;
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`reveal reveal-${direction} ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
