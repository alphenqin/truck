import { FC, memo, ReactNode } from 'react';
import classNames from 'classnames';

interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

const Card: FC<CardProps> = ({ children, className, noPadding = false }) => {
  return (
    <div
      className={classNames(
        'app-card flex-1 max-h-[520px] min-h-[130px] overflow-auto no-scrollbar hover-lift',
        !noPadding && 'p-5',
        className
      )}
    >
      {children}
    </div>
  );
};

export default memo(Card);
