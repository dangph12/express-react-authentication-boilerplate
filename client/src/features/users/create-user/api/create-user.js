import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import apiClient from '~/lib/api-client';
import { QUERY_KEYS } from '~/lib/query-keys';

const createUser = async data => {
  const response = await apiClient.post('/api/users', data);
  return response.data;
};

export const useCreateUser = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      toast.success(response.message || 'User created successfully');
      onSuccess?.(response.data);
    },
    onError: error => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  });
};
