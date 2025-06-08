import { type Ref, useEffect, useRef } from 'react';
import { rippleClickEffect } from '@/shared/lib/independent/ripple-click-effect.ts';


export function useRipple<Element extends HTMLElement>(
  args?: Omit<Parameters<typeof rippleClickEffect>[0], 'element'> & {
    ref?: Ref<Element>;
  },
) {
  const elementRef = useRef<Element>(null);

  useEffect(() => {
    const element = (args?.ref && 'current' in args.ref ? args.ref.current : null) || elementRef.current;

    if (!element) return;
    return rippleClickEffect({ ...args, element });
  }, [args]);

  return args?.ref || elementRef;
}
