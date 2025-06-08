import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/features/auth/auth.service';


export function useAuthMutation() {
  return useMutation({ mutationFn: AuthService.auth });
}
