import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, LoginRequest, RegisterRequest, UpdateUserRequest } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export function useLogin() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user, data.token);
      router.push('/');
    },
    onError: (error: any) => {
      console.error('Login error:', error.response?.data || error.message);
    },
  });
}

export function useRegister() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      login(data.user, data.token);
      router.push('/');
    },
    onError: (error: any) => {
      console.error('Registration error:', error.response?.data || error.message);
    },
  });
}

export function useLogout() {
  const { logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    router.push('/auth/login');
  };
}

export function useCurrentUser() {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ['current-user'],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    initialData: user || undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { login, token } = useAuth();

  return useMutation({
    mutationFn: authApi.updateUser,
    onSuccess: (data) => {
      // Update user in auth context
      if (token) {
        login(data.user, token);
      }
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
    onError: (error: any) => {
      console.error('Update user error:', error.response?.data || error.message);
    },
  });
}

export function useDeleteUser() {
  const { logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.deleteUser,
    onSuccess: () => {
      logout();
      queryClient.clear();
      router.push('/auth/login');
    },
    onError: (error: any) => {
      console.error('Delete user error:', error.response?.data || error.message);
    },
  });
}