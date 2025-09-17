'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogout } from '@/hooks/use-auth';
import { usePosts } from '@/hooks/use-posts';
import { formatDistanceToNow } from 'date-fns';
import { uk } from 'date-fns/locale';

export default function PostsPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const logout = useLogout();
  const { data: postsData, isLoading: postsLoading, error: postsError } = usePosts();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || postsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const posts = postsData?.posts || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/')}
                className="text-xl font-semibold text-gray-900"
              >
                Міні-блог
              </Button>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Всі пости</span>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Всі пости</h1>
            <p className="text-gray-600 mt-2">
              {postsData?.total ? `Знайдено ${postsData.total} ${postsData.total === 1 ? 'пост' : 'постів'}` : 'Завантаження...'}
            </p>
          </div>
          <Button onClick={() => router.push('/posts/create')}>
            Написати пост
          </Button>
        </div>

        {postsError && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">
                Помилка завантаження постів: {(postsError as any)?.response?.data?.message || 'Невідома помилка'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Posts Grid */}
        {posts.length === 0 && !postsError ? (
          <Card className="text-center py-16">
            <CardContent>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Постів поки що немає
              </h3>
              <p className="text-gray-500 mb-6">
                Станьте першим, хто поділиться своїми думками!
              </p>
              <Button onClick={() => router.push('/posts/create')}>
                Створити перший пост
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card 
                key={post.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/posts/${post.id}`)}
              >
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-lg">
                    {post.title}
                  </CardTitle>
                  {post.description && (
                    <CardDescription className="line-clamp-3">
                      {post.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500 line-clamp-3">
                    {post.content.substring(0, 150)}
                    {post.content.length > 150 && '...'}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-4">
                  <div className="text-sm text-gray-500">
                    <p className="font-medium">
                      {post.author.name || post.author.email}
                    </p>
                    <p>
                      {formatDistanceToNow(new Date(post.createdAt), { 
                        addSuffix: true, 
                        locale: uk 
                      })}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/posts/${post.id}`);
                    }}
                  >
                    Читати →
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}