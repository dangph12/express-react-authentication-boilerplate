import { useQuery } from '@tanstack/react-query';

import apiClient from '~/lib/api-client';
import { QUERY_KEYS } from '~/lib/query-keys';

const fetchUsers = async params => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.name) searchParams.set('name', `/${params.name}/i`);
  if (params.gender?.length) {
    params.gender.forEach(g => searchParams.append('gender', g));
  }
  if (params.role?.length) {
    params.role.forEach(r => searchParams.append('role', r));
  }

  const response = await apiClient.get(`/api/users?${searchParams.toString()}`);
  return response.data.data;
};

export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, params],
    queryFn: () => fetchUsers(params)
  });
};
