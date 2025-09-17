"use client";

import { useAuth } from "@/contexts/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useLogout } from "@/hooks/use-auth";
import { useCreatePost } from "@/hooks/use-posts";
import { ArrowLeft, Save } from "lucide-react";

const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Заголовок повинен містити мінімум 3 символи")
    .max(200, "Заголовок занадто довгий"),
  description: z
    .string()
    .max(500, "Опис занадто довгий")
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .min(10, "Контент повинен містити мінімум 10 символів")
    .max(10000, "Контент занадто довгий"),
});

type CreatePostFormValues = z.infer<typeof createPostSchema>;

export default function CreatePostPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const logout = useLogout();
  const createPostMutation = useCreatePost();
  const [error, setError] = useState<string>("");

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = async (data: CreatePostFormValues) => {
    try {
      setError("");
      const postData = {
        title: data.title.trim(),
        content: data.content.trim(),
        description: data.description?.trim() || undefined,
      };
      await createPostMutation.mutateAsync(postData);
      // Navigation will be handled by the hook
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Помилка створення поста";
      setError(errorMessage);
    }
  };

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
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/posts")}
                className="text-xl font-semibold text-gray-900"
              >
                Міні-блог
              </Button>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Створити пост</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/profile")}
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
            onClick={() => router.push("/posts")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Повернутися до постів
          </Button>
        </div>

        {/* Tips */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-medium text-blue-900 mb-2">
              Поради для написання хорошого поста:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Використовуйте зрозумілий та привабливий заголовок</li>
              <li>• Додайте короткий опис, щоб читачі знали, чого очікувати</li>
              <li>• Структуруйте контент з абзацами для легкого читання</li>
              <li>• Перевірте правопис та граматику перед публікацією</li>
            </ul>
          </CardContent>
        </Card>

        {/* Create Post Form */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-2xl">Створити новий пост</CardTitle>
            <CardDescription>
              Поділіться своїми думками з іншими користувачами
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Заголовок поста *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Введіть заголовок поста..."
                          {...field}
                          disabled={createPostMutation.isPending}
                          className="text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Короткий опис (опціонально)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Короткий опис поста для попереднього перегляду..."
                          {...field}
                          disabled={createPostMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-gray-500">
                        Цей опис буде відображатися в списку постів
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Контент поста *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Напишіть ваш пост тут..."
                          className="min-h-[300px] resize-y"
                          {...field}
                          disabled={createPostMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-gray-500">
                        {field.value.length}/10000 символів
                      </p>
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                    {error}
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={createPostMutation.isPending}
                    className="sm:flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {createPostMutation.isPending
                      ? "Створення..."
                      : "Опублікувати пост"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/posts")}
                    disabled={createPostMutation.isPending}
                    className="sm:flex-1"
                  >
                    Скасувати
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
