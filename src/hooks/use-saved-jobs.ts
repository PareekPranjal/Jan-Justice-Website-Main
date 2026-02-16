import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleSaveJob as toggleAction, syncFromStorage } from '@/store/savedJobsSlice';

export function useSavedJobs() {
  const dispatch = useAppDispatch();
  const savedJobIds = useAppSelector((state) => state.savedJobs.ids);

  // Cross-tab sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'savedJobs') {
        dispatch(syncFromStorage());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [dispatch]);

  const isJobSaved = useCallback(
    (jobId: string) => savedJobIds.includes(jobId),
    [savedJobIds]
  );

  const toggleSaveJob = useCallback(
    (jobId: string) => dispatch(toggleAction(jobId)),
    [dispatch]
  );

  return {
    savedJobIds,
    savedCount: savedJobIds.length,
    isJobSaved,
    toggleSaveJob,
  };
}
