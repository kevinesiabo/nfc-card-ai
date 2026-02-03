import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false }) => {
  return (
    <div
      className={cn(
        'glass-effect rounded-2xl p-6 shadow-lg',
        hover && 'card-hover',
        className
      )}
    >
      {children}
    </div>
  );
};

