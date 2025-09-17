'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLogout } from '@/hooks/use-auth';
import { usePost } from '@/hooks/use-posts';
import { formatDistanceToNow, format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { ArrowLeft, Calendar, User } from 'lucide-react';

function PostPageContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const logout = useLogout();
  
  const postIdParam = searchParams.get('post_id');
  const postId = postIdParam ? parseInt(postIdParam, 10) : null;
  
  const { data: post, isLoading: postLoading, error: postError } = usePost(postId || 0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!postIdParam) {
      router.push('/posts');
    }
  }, [postIdParam, router]);

  if (isLoading || postLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (!postIdParam || !postId) {
    return null; // Will redirect
  }

  if (postError) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/posts')}
                  className="text-xl font-semibold text-gray-900"
                >
                  Міні-блог
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={logout} size="sm">
                  Вийти
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Пост не знайдено
              </h2>
              <p className="text-red-600 mb-4">
                {(postError as any)?.response?.status === 404 
                  ? 'Пост з таким ID не існує' 
                  : `Помилка завантаження: ${(postError as any)?.response?.data?.message || 'Невідома помилка'}`
                }
              </p>
              <Button onClick={() => router.push('/posts')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Повернутися до списку
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/posts')}
                className="text-xl font-semibold text-gray-900"
              >
                Міні-блог
              </Button>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Пост</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => router.push('/posts/create')}
                size="sm"
              >
                Створити пост
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/profile')}
                size="sm"
              >
                Профіль
              </Button>
              <span className="text-sm text-gray-600">
                {user?.name || user?.email}
              </span>
              <Button variant="outline" onClick={logout} size="sm">
                Вийти
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/posts')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Повернутися до списку постів
          </Button>
        </div>

        {/* Post Content */}
        <article className="bg-white rounded-lg shadow-sm border">
          {/* Post Header */}
          <header className="p-6 border-b">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            
            {post.description && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {post.description}
              </p>
            )}

            {/* Post Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span className="font-medium">
                    {post.author.name || post.author.email}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {format(new Date(post.createdAt), 'dd MMMM yyyy, HH:mm', { locale: uk })}
                  </span>
                </div>
              </div>
              <div className="text-gray-400">
                {formatDistanceToNow(new Date(post.createdAt), { 
                  addSuffix: true, 
                  locale: uk 
                })}
              </div>
            </div>
          </header>

          {/* Post Body */}
          <div className="p-6">
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">
                {post.content}
              </div>
            </div>
          </div>

          {/* Post Footer */}
          <footer className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {post.updatedAt !== post.createdAt && (
                  <span>
                    Оновлено {formatDistanceToNow(new Date(post.updatedAt), { 
                      addSuffix: true, 
                      locale: uk 
                    })}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/posts')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад до списку
                </Button>
                {user?.id === post.author.id && (
                  <Button 
                    variant="outline"
                    onClick={() => router.push(`/post?post_id=${post.id}&edit=true`)}
                  >
                    Редагувати
                  </Button>
                )}
              </div>
            </div>
          </footer>
        </article>

        {/* Related Actions */}
        <div className="mt-8 text-center">
          <div className="space-x-4">
            <Button onClick={() => router.push('/posts/create')}>
              Написати новий пост
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/posts')}
            >
              Переглянути інші пости
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PostPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <PostPageContent />
    </Suspense>
  );
}