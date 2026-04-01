import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { userApi, SavedJob } from '@/lib/api';

export function useSavedJobs() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: savedJobs = [], isLoading } = useQuery<SavedJob[]>({
    queryKey: ['savedJobs', user?.email],
    queryFn: () => userApi.getSavedJobs(user!.email),
    enabled: !!user?.email,
  });

  const savedJobIds = savedJobs.map((sj) => sj._id);

  const isJobSaved = useCallback(
    (jobId: string) => savedJobs.some((sj) => sj._id === jobId),
    [savedJobs]
  );

  const toggleSaveJob = useCallback(
    async (jobId: string) => {
      if (!user) return;
      const existing = savedJobs.find((sj) => sj._id === jobId);
      try {
        if (existing) {
          await userApi.unsaveJob(existing.savedJobId);
        } else {
          await userApi.saveJob(user.email, jobId);
        }
        queryClient.invalidateQueries({ queryKey: ['savedJobs', user.email] });
      } catch {
        // callers handle errors via toast
      }
    },
    [user, savedJobs, queryClient]
  );

  return {
    savedJobs,
    savedJobIds,
    savedCount: savedJobs.length,
    isJobSaved,
    toggleSaveJob,
    isLoading,
  };
}
