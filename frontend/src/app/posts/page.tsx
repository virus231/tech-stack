'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/app-layout';
import { PostsListSkeleton } from '@/components/ui/loading-skeletons';
import { usePosts } from '@/hooks/use-posts';
import { formatDistanceToNow } from 'date-fns';
import { uk } from 'date-fns/locale';

export default function PostsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { data: postsData, isLoading: postsLoading, error: postsError } = usePosts();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
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

  if (postsLoading) {
    return (
      <AppLayout currentPage="Всі пости">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Всі пости</h1>
            <p className="text-gray-600 mt-2">Завантаження...</p>
          </div>
          <Button onClick={() => router.push('/posts/create')}>
            Написати пост
          </Button>
        </div>
        <PostsListSkeleton />
      </AppLayout>
    );
  }

  const posts = postsData?.posts || [];

  return (
    <AppLayout currentPage="Всі пости">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Всі пости</h1>
          <p className="text-gray-600 mt-2">
            {postsData?.total ? `Знайдено ${postsData.total} ${postsData.total === 1 ? 'пост' : 'постів'}` : 'Завантаження...'}
          </p>
        </div>
        <Button onClick={() => router.push('/posts/create')} className="w-full sm:w-auto">
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
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card 
              key={post.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]"
              onClick={() => router.push(`/post?post_id=${post.id}`)}
            >
              <CardHeader className="pb-4">
                <CardTitle className="line-clamp-2 text-lg leading-tight">
                  {post.title}
                </CardTitle>
                {post.description && (
                  <CardDescription className="line-clamp-2 text-sm">
                    {post.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                  {post.content.substring(0, 120)}
                  {post.content.length > 120 && '...'}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  <p className="font-medium text-gray-700 truncate max-w-24">
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
                    router.push(`/post?post_id=${post.id}`);
                  }}
                  className="text-xs hover:text-primary"
                >
                  Читати →
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}