import Link from 'next/link';
import clsx from 'clsx';

const baseStyles = {
  solid:
    'inline-flex justify-center rounded-md py-1 px-4 text-base font-semibold tracking-tight shadow-sm focus:outline-none',
  outline:
    'inline-flex justify-center rounded-md border py-[calc(theme(spacing.1)-1px)] px-[calc(theme(spacing.4)-1px)] text-base font-semibold tracking-tight focus:outline-none',
};

const variantStyles = {
  solid: {
    slate:
      'bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 active:bg-slate-700 active:text-white/80 disabled:opacity-30 disabled:hover:bg-slate-900',
    cyan: 'bg-cyan-600 text-white hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 active:bg-cyan-700 active:text-white/80 disabled:opacity-30 disabled:hover:bg-cyan-600',
    white:
      'bg-white text-cyan-600 hover:text-cyan-700 focus-visible:text-cyan-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:bg-cyan-50 active:text-cyan-900/80 disabled:opacity-40 disabled:hover:text-cyan-600',
  },
  outline: {
    slate:
      'border-slate-200 text-slate-900 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 active:border-slate-200 active:bg-slate-50 active:text-slate-900/70 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-transparent',
    cyan: 'border-cyan-300 text-cyan-600 hover:border-cyan-400 hover:bg-cyan-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 active:text-cyan-600/70 disabled:opacity-40 disabled:hover:border-cyan-300 disabled:hover:bg-transparent',
  },
};

type ButtonProps = (
  | {
      variant?: 'solid';
      color?: keyof typeof variantStyles.solid;
    }
  | {
      variant: 'outline';
      color?: keyof typeof variantStyles.outline;
    }
) &
  (
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'color'>
    | (Omit<React.ComponentPropsWithoutRef<'button'>, 'color'> & {
        href?: undefined;
      })
  );

export function Button({ className, ...props }: ButtonProps) {
  props.variant ??= 'solid';
  props.color ??= 'slate';

  className = clsx(
    baseStyles[props.variant],
    props.variant === 'outline'
      ? variantStyles.outline[props.color]
      : props.variant === 'solid'
      ? variantStyles.solid[props.color]
      : undefined,
    className
  );

  return typeof props.href === 'undefined' ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  );
}
