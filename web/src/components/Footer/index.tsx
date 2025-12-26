import { FC, memo } from 'react';

const Footer: FC = () => {
  return (
    <footer className='flex flex-col w-full items-center justify-center py-4 text-xs text-[var(--app-muted)] bg-[var(--app-surface)] border-t border-[var(--app-border)] gap-1'>
      <span>&copy; {new Date().getFullYear()} Design Xi-Yuer</span>
      <a 
        href='https://beian.miit.gov.cn/#/Integrated/index' 
        target='_blank' 
        rel='noreferrer'
        className='hover:text-[var(--app-accent)] tran-fast'
      >
        蜀ICP备2022015920号-2
      </a>
    </footer>
  );
};

export default memo(Footer);
