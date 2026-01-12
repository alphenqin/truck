import { createSlice } from '@reduxjs/toolkit';

interface IUIStore {
  isFold: boolean;
  langMode: 'enUS' | 'zhCN';
  defaultSelectedKeys: string[];
  defaultOpenKeys: string[];
}

const useUIStoreSlice = createSlice({
  name: 'UIStore',
  initialState: {
    isFold: false,
    langMode: 'zhCN',
    defaultSelectedKeys: [],
    defaultOpenKeys: [],
  } as IUIStore,
  reducers: {
    changeFold(state, action) {
      state.isFold = action.payload;
    },

    changeLang(state, action: { payload: 'enUS' | 'zhCN'; type: string }) {
      state.langMode = action.payload;
    },

    changeDefaultOpenKeys(state, action: { payload: string[]; type: string }) {
      state.defaultOpenKeys = action.payload;
    },

    changeDefaultSelectedKeys(state, action: { payload: string[]; type: string }) {
      state.defaultSelectedKeys = action.payload;
    },
  },
});

export const { changeFold, changeLang, changeDefaultOpenKeys, changeDefaultSelectedKeys } =
  useUIStoreSlice.actions;
export default useUIStoreSlice.reducer;
