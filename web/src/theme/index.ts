import { theme, ThemeConfig } from 'antd';
import { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import IStandaloneThemeData = editor.IStandaloneThemeData;

export const useTheme: () => [ThemeConfig] = () => {
  const isDark = false;
  const algorithm = theme.defaultAlgorithm;
  
  // 统一的主色调
  const primaryColor = isDark ? '#3b82f6' : '#2563eb';
  const primaryColorLight = isDark ? '#60a5fa' : '#3b82f6';
  
  return [
    {
      algorithm,
      token: {
        borderRadius: 12,
        colorPrimary: primaryColor,
        colorLink: primaryColor,
        colorTextBase: isDark ? '#f1f5f9' : '#0f172a',
        colorTextSecondary: isDark ? '#cbd5e1' : '#475569',
        colorBgLayout: isDark ? '#080c14' : '#f0f4f8',
        colorBgContainer: isDark ? '#0f1629' : '#ffffff',
        colorBgElevated: isDark ? '#141d32' : '#ffffff',
        colorBorder: isDark ? '#1e293b' : '#e1e7ef',
        colorBorderSecondary: isDark ? '#334155' : '#cbd5e1',
        controlHeight: 40,
        controlHeightLG: 44,
        controlHeightSM: 32,
        fontSize: 14,
        fontSizeHeading1: 28,
        fontSizeHeading2: 24,
        fontSizeHeading3: 20,
        fontSizeHeading4: 16,
        lineHeight: 1.6,
        motion: true,
        motionDurationFast: '0.15s',
        motionDurationMid: '0.25s',
        motionDurationSlow: '0.4s',
      },
      components: {
        Button: {
          borderRadius: 10,
          paddingInline: 18,
          paddingInlineLG: 24,
          fontWeight: 500,
          primaryShadow: isDark 
            ? '0 2px 8px rgba(59, 130, 246, 0.3)' 
            : '0 2px 8px rgba(37, 99, 235, 0.25)',
        },
        Input: {
          borderRadius: 10,
          colorBgContainer: isDark ? '#0b1220' : '#ffffff',
          colorBorder: isDark ? '#1e293b' : '#e1e7ef',
          colorTextPlaceholder: isDark ? '#64748b' : '#94a3b8',
          hoverBorderColor: primaryColorLight,
          activeBorderColor: primaryColor,
          activeShadow: `0 0 0 2px ${isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.1)'}`,
        },
        Select: {
          borderRadius: 10,
          colorBgContainer: isDark ? '#0b1220' : '#ffffff',
          colorBorder: isDark ? '#1e293b' : '#e1e7ef',
          colorTextPlaceholder: isDark ? '#64748b' : '#94a3b8',
          optionSelectedBg: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.08)',
        },
        Table: {
          headerBg: isDark ? '#0b1220' : '#f8fafc',
          headerColor: isDark ? '#e2e8f0' : '#0f172a',
          borderColor: isDark ? '#1e293b' : '#e1e7ef',
          rowHoverBg: isDark ? 'rgba(59, 130, 246, 0.06)' : 'rgba(37, 99, 235, 0.04)',
          headerSortActiveBg: isDark ? '#111c2d' : '#f1f5f9',
          bodySortBg: isDark ? 'rgba(59, 130, 246, 0.03)' : 'rgba(37, 99, 235, 0.02)',
        },
        Menu: {
          itemBg: 'transparent',
          itemColor: isDark ? '#94a3b8' : '#64748b',
          itemHoverColor: isDark ? '#f1f5f9' : '#0f172a',
          itemHoverBg: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(37, 99, 235, 0.06)',
          itemSelectedBg: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(37, 99, 235, 0.08)',
          itemSelectedColor: primaryColor,
          subMenuItemBg: 'transparent',
          popupBg: isDark ? '#0f1629' : '#ffffff',
          activeBarBorderWidth: 0,
          itemBorderRadius: 10,
          iconSize: 17,
          collapsedIconSize: 20,
        },
        Card: {
          headerBg: isDark ? '#0f1629' : '#ffffff',
          borderRadiusLG: 14,
          boxShadow: isDark 
            ? '0 4px 20px rgba(0, 0, 0, 0.4)' 
            : '0 4px 16px rgba(15, 23, 42, 0.06)',
        },
        Modal: {
          contentBg: isDark ? '#0f1629' : '#ffffff',
          headerBg: isDark ? '#0f1629' : '#ffffff',
          borderRadiusLG: 16,
          boxShadow: isDark
            ? '0 24px 80px rgba(0, 0, 0, 0.5)'
            : '0 24px 64px rgba(15, 23, 42, 0.12)',
        },
        Drawer: {
          colorBgElevated: isDark ? '#0f1629' : '#ffffff',
        },
        Spin: {
          colorBgContainer: isDark ? '#080c14' : '#ffffff',
          colorBgMask: isDark ? 'rgba(8, 12, 20, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        },
        Breadcrumb: {
          itemColor: isDark ? '#94a3b8' : '#64748b',
          lastItemColor: isDark ? '#f1f5f9' : '#0f172a',
          linkColor: isDark ? '#94a3b8' : '#64748b',
          linkHoverColor: primaryColor,
          separatorColor: isDark ? '#475569' : '#cbd5e1',
        },
        Tag: {
          borderRadiusSM: 6,
        },
        Popover: {
          borderRadiusLG: 12,
          boxShadowSecondary: isDark
            ? '0 12px 40px rgba(0, 0, 0, 0.5)'
            : '0 12px 32px rgba(15, 23, 42, 0.1)',
        },
        Tooltip: {
          borderRadius: 8,
        },
        Badge: {
          dotSize: 8,
        },
        Switch: {
          handleBg: '#ffffff',
          handleShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
        },
        Form: {
          labelColor: isDark ? '#cbd5e1' : '#475569',
          labelFontSize: 14,
        },
        Tabs: {
          itemColor: isDark ? '#94a3b8' : '#64748b',
          itemSelectedColor: primaryColor,
          itemHoverColor: isDark ? '#f1f5f9' : '#0f172a',
          inkBarColor: primaryColor,
        },
      },
    },
  ];
};

export function defineMonacoTheme(monaco: Monaco) {
  monaco.editor.defineTheme('naruto', monacoLightTheme);
}

export const monacoLightTheme: IStandaloneThemeData = {
  base: 'vs', // 以哪个默认主题为基础："vs" | "vs-dark" | "hc-black" | "hc-light"
  inherit: true,
  rules: [
    // 高亮规则，即给代码里不同token类型的代码设置不同的显示样式
    { token: 'identifier', foreground: '#d06733' },
    { token: 'number', foreground: '#6bbeeb' },
    { token: 'keyword', foreground: '#05a4d5' },
  ],
  colors: {
    'scrollbarSlider.background': '#edcaa6', // 滚动条背景
    'editor.foreground': '#0d0b09', // 基础字体颜色
    'editor.background': '#ffffff', // 背景颜色
    'editorCursor.foreground': '#d4b886', // 焦点颜色
    'editor.lineHighlightBackground': '#00000000', // 焦点所在的一行的背景颜色
    'editorLineNumber.foreground': '#008800', // 行号字体颜色
  },
};
