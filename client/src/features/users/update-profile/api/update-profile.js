import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { PROFILE_QUERY_KEY } from '~/features/users/view-profile/api/view-profile';
import apiClient from '~/lib/api-client';

const updateProfile = async data => {
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

  const response = await apiClient.patch('/api/users/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data.data;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: data => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, data);
      toast.success('Profile updated successfully');
    },
    onError: error => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  });
};
