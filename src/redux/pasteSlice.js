import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

// Helper function to get headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// ====================== Async Thunks ======================

// Fetch all notes
export const fetchPastes = createAsyncThunk('paste/fetchPastes', async (_, thunkAPI) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/notes/fetchAllNotes`, {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (data.success) {
      return data.notes;
    } else {
      return thunkAPI.rejectWithValue(data.message || 'Failed to fetch notes');
    }
  } catch (err) {
    return thunkAPI.rejectWithValue('Network error');
  }
});

// Delete a note
export const deletePaste = createAsyncThunk('paste/deletePaste', async (pasteId, thunkAPI) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/notes/deleteNote/${pasteId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (data.success) {
      toast.success('Note deleted successfully');
      return pasteId;
    } else {
      toast.error(data.message || 'Failed to delete note');
      return thunkAPI.rejectWithValue(data.message || 'Failed to delete note');
    }
  } catch (err) {
    toast.error('Network error');
    return thunkAPI.rejectWithValue('Network error');
  }
});

// Create a note
export const createPaste = createAsyncThunk('paste/createPaste', async (noteData, thunkAPI) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/notes/createNote`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(noteData),
    });
    const data = await res.json();
    if (data.success) {
      thunkAPI.dispatch(fetchPastes());
      return data.note;
    } else {
      return thunkAPI.rejectWithValue(data.message || 'Failed to create note');
    }
  } catch (err) {
    return thunkAPI.rejectWithValue('Network error');
  }
});

// Update a note
export const updatePaste = createAsyncThunk('paste/updatePaste', async ({ id, noteData }, thunkAPI) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/notes/updateNote/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(noteData),
    });
    const data = await res.json();
    if (data.success) {
      thunkAPI.dispatch(fetchPastes());
      return data.note;
    } else {
      return thunkAPI.rejectWithValue(data.message || 'Failed to update note');
    }
  } catch (err) {
    return thunkAPI.rejectWithValue('Network error');
  }
});

// Fetch a note by ID
export const fetchPasteById = createAsyncThunk('paste/fetchPasteById', async (id, thunkAPI) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/notes/fetchNoteById/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (data.success) {
      return data.note;
    } else {
      return thunkAPI.rejectWithValue(data.message || 'Failed to fetch note');
    }
  } catch (err) {
    return thunkAPI.rejectWithValue('Network error');
  }
});

// ====================== Paste Slice ======================

const pasteInitialState = {
  pastes: [],
  loading: false,
  error: null,
};

const pasteSlice = createSlice({
  name: 'paste',
  initialState: pasteInitialState,
  reducers: {
    addToPastes: (state, action) => {
      const paste = action.payload;
      const index = state.pastes.findIndex((item) => item._id === paste._id);
      if (index >= 0) {
        state.pastes[index] = paste;
        toast.success('Note updated successfully');
      } else {
        state.pastes.push(paste);
        toast('Note created successfully');
      }
    },
    updateToPaste: (state, action) => {
      const paste = action.payload;
      const index = state.pastes.findIndex((item) => item._id === paste._id);
      if (index >= 0) {
        state.pastes[index] = paste;
        toast.success('Note updated successfully');
      }
    },
    resetAllPastes: (state) => {
      state.pastes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPastes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPastes.fulfilled, (state, action) => {
        state.loading = false;
        state.pastes = action.payload;
      })
      .addCase(fetchPastes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePaste.fulfilled, (state, action) => {
        state.pastes = state.pastes.filter((item) => item._id !== action.payload);
      });
  },
});

// ====================== Auth Slice ======================

const authInitialState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

// ====================== Exports ======================

// Paste slice
export const { addToPastes, updateToPaste, resetAllPastes } = pasteSlice.actions;
export default pasteSlice.reducer;

// Auth slice
export const { setUser, clearUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
