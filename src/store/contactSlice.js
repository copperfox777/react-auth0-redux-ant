import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../fakeServer/client'



// We use normalized data with redux-toolkit 
export const contactsAdapter = createEntityAdapter();
const initialState = contactsAdapter.getInitialState({
  status: 'idle', // loading status
  error: null 
});

export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async () => {
  const response = await client.get('https://jsonplaceholder.typicode.com/users')
  // console.log(response);
  return response
});


export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    contactAddOne(state,action){
      const {payload} = action;
      state.ids.unshift(payload.id);
      state.entities[payload.id]={...payload};
    }, 
    contactUpdate:contactsAdapter.upsertOne,
    contactRemoveOne: contactsAdapter.removeOne,
    contactSetAll:contactsAdapter.setAll
    
  },
  extraReducers: {
    [fetchContacts.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchContacts.fulfilled]: (state, action) => {
      state.status = 'idle'
      contactsAdapter.setAll(state, action.payload)
    },
    [fetchContacts.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    }
  },
});


//EXPORT ACTIONS
export const { contactAddOne, contactUpdate, contactRemoveOne,contactSetAll } = contactsSlice.actions

// EXPORT SELECTORS (memoized)
export const {
  selectById: selectContactById,
  selectIds: selectContactIds,
  selectEntities: selectContactEntities,
  selectAll: selectAllContacts,
  selectTotal: selectTotalContacts
} = contactsAdapter.getSelectors(state => state.contacts)

export default contactsSlice.reducer;
