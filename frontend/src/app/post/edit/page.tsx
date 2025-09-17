'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLogout } from '@/hooks/use-auth';
import { usePost } from '@/hooks/use-posts';
import { api } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

function EditPostContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const logout = useLogout();
  
  const postIdParam = searchParams.get('post_id');
  const postId = postIdParam ? parseInt(postIdParam, 10) : null;
  
  const { data: post, isLoading: postLoading, error: postError } = usePost(postId || 0);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (post) {
      // Перевірка, чи користувач є автором поста
      if (user?.id !== post.author.id) {
        toast.error('Ви можете редагувати тільки свої пости');
        router.push(`/post?post_id=${post.id}`);
        return;
      }
      
      setFormData({
        title: post.title,
        description: post.description || '',
        content: post.content
      });
    }
  }, [post, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId) return;

    setIsSubmitting(true);
    try {
      await api.put(`/posts/${postId}`, formData);
      toast.success('Пост успішно оновлено!');
      router.push(`/post?post_id=${postId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Помилка при оновленні поста');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || postLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !postIdParam || !postId) {
    return null; // Will redirect
  }

  if (postError) {
    return (
      <div className="min-h-screen bg-gray-50">
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
              <span className="text-gray-600">Редагування поста</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => router.push('/posts/create')}
                size="sm"
                variant="outline"
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
            onClick={() => router.push(`/post?post_id=${post.id}`)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Повернутися до поста
          </Button>
        </div>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Редагувати пост</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Заголовок *</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Введіть заголовок поста..."
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Короткий опис</Label>
                <Input
                  id="description"
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Введіть короткий опис поста (необов'язково)..."
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Зміст *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Введіть зміст поста..."
                  required
                  rows={12}
                  className="w-full resize-vertical"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                  className="flex-1"
                >
                  {isSubmitting ? 'Оновлення...' : 'Оновити пост'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push(`/post?post_id=${post.id}`)}
                  className="flex-1"
                >
                  Скасувати
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function EditPostPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <EditPostContent />
    </Suspense>
  );
}