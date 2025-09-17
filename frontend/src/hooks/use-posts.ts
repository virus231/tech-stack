import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi, CreatePostRequest, Post } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: postsApi.getAllPosts,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function usePost(id: number) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => postsApi.getPostById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: postsApi.createPost,
    onSuccess: (newPost) => {
      // Update posts list cache
      queryClient.setQueryData(['posts'], (oldData: any) => {
        if (!oldData) return { posts: [newPost], total: 1 };
        return {
          posts: [newPost, ...oldData.posts],
          total: oldData.total + 1
        };
      });

      // Invalidate posts query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      // Navigate to the new post
      router.push(`/posts/${newPost.id}`);
    },
    onError: (error: any) => {
      console.error('Create post error:', error.response?.data || error.message);
    },
  });
}