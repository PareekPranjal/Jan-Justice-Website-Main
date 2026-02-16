import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const STORAGE_KEY = 'savedJobs';

function loadFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface SavedJobsState {
  ids: string[];
}

const initialState: SavedJobsState = {
  ids: loadFromStorage(),
};

const savedJobsSlice = createSlice({
  name: 'savedJobs',
  initialState,
  reducers: {
    toggleSaveJob(state, action: PayloadAction<string>) {
      const jobId = action.payload;
      const index = state.ids.indexOf(jobId);
      if (index >= 0) {
        state.ids.splice(index, 1);
      } else {
        state.ids.push(jobId);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
    },
    syncFromStorage(state) {
      state.ids = loadFromStorage();
    },
  },
});

export const { toggleSaveJob, syncFromStorage } = savedJobsSlice.actions;
export default savedJobsSlice.reducer;
