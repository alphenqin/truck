import { LightSvg } from '@/components/Icon/light.tsx';
import { DarkSvg } from '@/components/Icon/dark.tsx';
import { Switch, Tooltip } from 'antd';
import { useTheme } from '@/hooks/useTheme.ts';
import { memo } from 'react';

const ThemeBar = () => {
  const { toggleTheme, themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  
  return (
    <Tooltip title={isDark ? '切换到浅色模式' : '切换到深色模式'}>
      <Switch 
        checkedChildren={<DarkSvg />} 
        unCheckedChildren={<LightSvg />} 
        onChange={toggleTheme} 
        checked={isDark}
        className='tran-fast'
      />
    </Tooltip>
  );
};

export default memo(ThemeBar);
