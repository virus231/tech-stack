'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { useLogout, useCurrentUser, useUpdateUser, useDeleteUser } from '@/hooks/use-auth';
import { ArrowLeft, User, Mail, Calendar, FileText, Save, Trash2, Eye, EyeOff } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { uk } from 'date-fns/locale';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Ім\'я повинно містити мінімум 2 символи').max(50, 'Ім\'я занадто довге').optional().or(z.literal('')),
  email: z.string().email('Введіть правильний email'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Введіть поточний пароль'),
  newPassword: z.string().min(6, 'Новий пароль повинен містити мінімум 6 символів'),
  confirmPassword: z.string().min(6, 'Підтвердження пароля обов\'язкове'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Паролі не співпадають',
  path: ['confirmPassword'],
});

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Введіть пароль для підтвердження'),
  confirmation: z.string().refine((val) => val === 'ВИДАЛИТИ', {
    message: 'Введіть "ВИДАЛИТИ" для підтвердження',
  }),
});

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

export default function ProfilePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const logout = useLogout();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'danger'>('profile');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    delete: false,
  });

  const profileForm = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const deleteForm = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: '',
      confirmation: '',
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (currentUser) {
      profileForm.reset({
        name: currentUser.name || '',
        email: currentUser.email,
      });
    }
  }, [currentUser, profileForm]);

  const onUpdateProfile = async (data: UpdateProfileFormValues) => {
    try {
      setError('');
      setSuccess('');
      
      const updateData: any = {
        email: data.email,
      };
      
      if (data.name && data.name.trim()) {
        updateData.name = data.name.trim();
      }

      await updateUserMutation.mutateAsync(updateData);
      setSuccess('Профіль успішно оновлено!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Помилка оновлення профілю';
      setError(errorMessage);
    }
  };

  const onChangePassword = async (data: ChangePasswordFormValues) => {
    try {
      setError('');
      setSuccess('');
      
      await updateUserMutation.mutateAsync({
        password: data.newPassword,
        currentPassword: data.currentPassword,
      });
      
      setSuccess('Пароль успішно змінено!');
      passwordForm.reset();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Помилка зміни пароля';
      setError(errorMessage);
    }
  };

  const onDeleteAccount = async (data: DeleteAccountFormValues) => {
    try {
      setError('');
      
      if (window.confirm('Ви впевнені, що хочете видалити свій аккаунт? Ця дія незворотна!')) {
        await deleteUserMutation.mutateAsync(data.password);
        // The hook will handle logout and navigation
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Помилка видалення аккаунту';
      setError(errorMessage);
    }
  };

  if (isLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return null; // Will redirect
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
              <span className="text-gray-600">Профіль</span>
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
                onClick={() => router.push('/posts')}
                size="sm"
              >
                Пости
              </Button>
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
            Повернутися до постів
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    {currentUser.name || 'Користувач'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{currentUser.email}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        Реєстрація {format(new Date(currentUser.createdAt), 'MMMM yyyy', { locale: uk })}
                      </span>
                    </div>
                    {currentUser._count && (
                      <div className="flex items-center justify-center">
                        <FileText className="w-4 h-4 mr-2" />
                        <span>{currentUser._count.posts} постів</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card className="mt-4">
              <CardContent className="pt-6">
                <nav className="space-y-2">
                  <Button
                    variant={activeTab === 'profile' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Профіль
                  </Button>
                  <Button
                    variant={activeTab === 'password' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('password')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Пароль
                  </Button>
                  <Button
                    variant={activeTab === 'danger' ? 'destructive' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('danger')}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Видалення
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                {success}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>Редагувати профіль</CardTitle>
                  <CardDescription>
                    Оновіть свою особисту інформацію
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ім'я</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ваше ім'я"
                                {...field}
                                disabled={updateUserMutation.isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                {...field}
                                disabled={updateUserMutation.isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={updateUserMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {updateUserMutation.isPending ? 'Збереження...' : 'Зберегти зміни'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <Card>
                <CardHeader>
                  <CardTitle>Зміна пароля</CardTitle>
                  <CardDescription>
                    Оновіть свій пароль для безпеки аккаунту
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Поточний пароль</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPasswords.current ? 'text' : 'password'}
                                  placeholder="••••••••"
                                  {...field}
                                  disabled={updateUserMutation.isPending}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                >
                                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Новий пароль</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPasswords.new ? 'text' : 'password'}
                                  placeholder="••••••••"
                                  {...field}
                                  disabled={updateUserMutation.isPending}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                >
                                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Підтвердження нового пароля</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPasswords.confirm ? 'text' : 'password'}
                                  placeholder="••••••••"
                                  {...field}
                                  disabled={updateUserMutation.isPending}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                >
                                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={updateUserMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {updateUserMutation.isPending ? 'Зміна пароля...' : 'Змінити пароль'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Небезпечна зона</CardTitle>
                  <CardDescription>
                    Видалення аккаунту є незворотним. Всі ваші пости та дані будуть втрачені назавжди.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...deleteForm}>
                    <form onSubmit={deleteForm.handleSubmit(onDeleteAccount)} className="space-y-4">
                      <FormField
                        control={deleteForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Підтвердження пароля</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPasswords.delete ? 'text' : 'password'}
                                  placeholder="••••••••"
                                  {...field}
                                  disabled={deleteUserMutation.isPending}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowPasswords(prev => ({ ...prev, delete: !prev.delete }))}
                                >
                                  {showPasswords.delete ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={deleteForm.control}
                        name="confirmation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Введіть "ВИДАЛИТИ" для підтвердження</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="ВИДАЛИТИ"
                                {...field}
                                disabled={deleteUserMutation.isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        variant="destructive"
                        disabled={deleteUserMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {deleteUserMutation.isPending ? 'Видалення...' : 'Видалити аккаунт назавжди'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}