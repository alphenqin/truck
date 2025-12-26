import { createSlice } from '@reduxjs/toolkit';
import { constants } from '@/constant';
import { cache } from '@/utils';
import { MenuTheme } from 'antd';

interface IUIStore {
  isFold: boolean;
  langMode: 'enUS' | 'zhCN';
  themeMode: MenuTheme | undefined;
  defaultSelectedKeys: string[];
  defaultOpenKeys: string[];
}

const useUIStoreSlice = createSlice({
  name: 'UIStore',
  initialState: {
    isFold: false,
    langMode: 'zhCN',
    themeMode: 'light',
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

    changeThemeMode(state, action: { payload: 'dark' | 'light' | undefined; type: string }) {
      state.themeMode = action.payload;
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      cache.set(constants.localStorage.lang, action.payload);
    },

    changeDefaultOpenKeys(state, action: { payload: string[]; type: string }) {
      state.defaultOpenKeys = action.payload;
    },

    changeDefaultSelectedKeys(state, action: { payload: string[]; type: string }) {
      state.defaultSelectedKeys = action.payload;
    },
  },
});

export const {
  changeFold,
  changeLang,
  changeThemeMode,
  changeDefaultOpenKeys,
  changeDefaultSelectedKeys,
} = useUIStoreSlice.actions;
export default useUIStoreSlice.reducer;
