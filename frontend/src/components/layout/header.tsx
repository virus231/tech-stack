'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useLogout } from '@/hooks/use-auth';
import { 
  PenTool, 
  User, 
  LogOut, 
  FileText, 
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentPage?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
}

export function Header({ 
  currentPage, 
  showBackButton = false, 
  backButtonText = 'Назад',
  backButtonHref = '/posts' 
}: HeaderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const logout = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    router.push('/posts');
  };

  const handleBackClick = () => {
    router.push(backButtonHref);
  };

  const navigationItems = [
    {
      label: 'Пости',
      href: '/posts',
      icon: FileText,
      active: currentPage === 'posts',
    },
    {
      label: 'Створити',
      href: '/posts/create',
      icon: PenTool,
      active: currentPage === 'create',
    },
    {
      label: 'Профіль',
      href: '/profile',
      icon: User,
      active: currentPage === 'profile',
    },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={handleLogoClick}
              className="text-xl font-semibold text-gray-900 hover:text-primary"
            >
              Міні-блог
            </Button>
            
            {currentPage && (
              <>
                <span className="text-gray-400 hidden sm:inline">|</span>
                <span className="text-gray-600 hidden sm:inline">{currentPage}</span>
              </>
            )}

            {showBackButton && (
              <Button 
                variant="ghost" 
                onClick={handleBackClick}
                className="text-gray-600 hover:text-gray-900 ml-2"
                size="sm"
              >
                ← {backButtonText}
              </Button>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => (
              <Button
                key={item.href}
                variant={item.active ? 'default' : 'ghost'}
                size="sm"
                onClick={() => router.push(item.href)}
                className="flex items-center space-x-2"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            ))}
            
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <span className="text-sm text-gray-600 max-w-32 truncate">
                {user?.name || user?.email}
              </span>
              <Button 
                variant="outline" 
                onClick={logout} 
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Вийти</span>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.href}
                  variant={item.active ? 'default' : 'ghost'}
                  className="w-full justify-start flex items-center space-x-2"
                  onClick={() => {
                    router.push(item.href);
                    setMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              ))}
              
              <div className="pt-4 border-t border-gray-200 mt-4">
                <div className="text-sm text-gray-600 mb-2 px-3">
                  {user?.name || user?.email}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Вийти</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}