import { useQuery } from '@tanstack/react-query';

import apiClient from '~/lib/api-client';

export const PROFILE_QUERY_KEY = ['profile'];

const fetchProfile = async () => {
  const response = await apiClient.get('/api/users/me');
  return response.data.data;
};

export const useProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchProfile
  });
};
