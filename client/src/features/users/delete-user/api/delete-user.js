import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import apiClient from '~/lib/api-client';
import { QUERY_KEYS } from '~/lib/query-keys';

const deleteUser = async id => {
  const response = await apiClient.delete(`/api/users/${id}`);
  return response.data;
};

export const useDeleteUser = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      toast.success('User deleted successfully');
      onSuccess?.();
    },
    onError: error => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  });
};
