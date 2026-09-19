'use client';

import { useQuery } from '@tanstack/react-query';
import { profileApi } from '@/lib/api/profile';
import { ProfileData } from '@/types/profile';

export const useProfile = () => {
  return useQuery<ProfileData>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await profileApi.getProfile();
      if (!response || !response.data) {
        throw new Error('Failed to fetch user profile');
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  });
};
