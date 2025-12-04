import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import apiClient from '~/lib/api-client';
import { QUERY_KEYS } from '~/lib/query-keys';

const updateUser = async ({ id, data }) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (key === 'avatar' && value instanceof File) {
        formData.append('avatar', value);
      } else if (key !== 'avatar') {
        formData.append(key, value);
      }
    }
  });

  const response = await apiClient.patch(`/api/users/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data.data;
};

export const useUpdateUser = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.setQueryData(QUERY_KEYS.USER(variables.id), data);
      toast.success('User updated successfully');
      onSuccess?.(data);
    },
    onError: error => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  });
};
