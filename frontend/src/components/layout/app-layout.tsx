'use client';

import { ReactNode } from 'react';
import { Header } from './header';

interface AppLayoutProps {
  children: ReactNode;
  currentPage?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full';
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

export function AppLayout({ 
  children, 
  currentPage,
  showBackButton,
  backButtonText,
  backButtonHref,
  maxWidth = '7xl',
  className = ''
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentPage={currentPage}
        showBackButton={showBackButton}
        backButtonText={backButtonText}
        backButtonHref={backButtonHref}
      />
      
      <main className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
        {children}
      </main>
    </div>
  );
}