import type { CSSProperties, ReactNode } from 'react';

export function Card({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`rounded-3xl bg-card p-5 shadow-[0_4px_20px_rgba(46,51,40,0.06)] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export const sageGradient: CSSProperties = {
  backgroundImage: 'linear-gradient(135deg, #5E7053, #7C9070)',
};
