'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/use-auth';

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const logout = useLogout();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (!isLoading && isAuthenticated) {
      router.push('/posts');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Міні-блог</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Привіт, {user?.name || user?.email}!
              </span>
              <Button variant="outline" onClick={logout}>
                Вийти
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ласкаво просимо до міні-блогу!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Тут буде список постів та навігація
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.push('/posts')}>
              Переглянути пости
            </Button>
            <Button variant="outline" onClick={() => router.push('/posts/create')}>
              Створити пост
            </Button>
            <Button variant="outline" onClick={() => router.push('/profile')}>
              Мій профіль
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
