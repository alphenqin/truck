import { FC, memo } from 'react';
import { Image } from 'antd';
import NotFondImage from '@/assets/image/404.png';

const NotFond: FC = () => {
  return (
    <div className='app-shell h-full flex items-center justify-center'>
      <div className='app-card-flat flex items-center gap-10 p-8'>
        <Image src={NotFondImage} preview={false}></Image>
        <div className='text-5xl font-semibold flex flex-col app-muted'>
        <span>OOPS!</span>
        <span>Page Not Font!</span>
        </div>
      </div>
    </div>
  );
};

export default memo(NotFond);
