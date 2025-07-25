import { FC, useEffect, ReactNode, RefObject } from 'react';

export interface AdminMenuProps {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactNode;
}

export const AdminMenu: FC<AdminMenuProps> = ({ open, onClose, anchorRef, children }) => {
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target as Node) && !(e.target as HTMLElement).closest('[data-popover-menu]')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose, anchorRef]);

  if (!open || !anchorRef.current) return null;

  const anchorRect = anchorRef.current.getBoundingClientRect();
  return (
    <div
      data-popover-menu
      className="absolute left-0 w-full min-w-[var(--anchor-width)] z-50 bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col animate-fade-in"
      style={
        {
          top: anchorRef.current.offsetTop - 8,
          transform: 'translateY(-100%)',
          ...(anchorRect.width ? { '--anchor-width': `${anchorRect.width}px` } : {}),
        } as React.CSSProperties
      }>
      {Array.isArray(children)
        ? children.filter(Boolean).map((child, idx, arr) => (
            <div
              key={idx}
              className={[
                'px-3 py-3 bg-gray-100 active:bg-gray-200 text-base font-semibold text-gray-800 text-center transition-all border-b border-gray-200 flex items-center justify-center min-h-12',
                idx === arr.length - 1 ? 'rounded-b-xl border-b-0' : '',
                idx === 0 ? 'rounded-t-xl' : '',
              ].join(' ')}>
              {child}
            </div>
          ))
        : children}
    </div>
  );
};
