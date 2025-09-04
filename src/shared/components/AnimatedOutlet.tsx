import { getRouterContext, Outlet, useMatches } from '@tanstack/react-router';
import { cloneDeep } from 'lodash-es';
import { motion, type Transition, useIsPresent, type Variants } from 'motion/react';
import { type ComponentProps, useContext, useRef } from 'react';
import type { FileRoutesById } from '@/routeTree.gen.ts';
import { isMdMediaQuery } from '@/shared/hooks/useResponsive.ts';


type Direction = 'left' | 'right' | 'up' | 'down' | 'none';

type AnimatedOutlet2Props = ComponentProps<typeof motion.div> & {
  routeId: keyof FileRoutesById,
  routeIdPrev?: keyof FileRoutesById,
};

/**
 * @source https://github.com/TanStack/router/discussions/823
 */
export function AnimatedOutlet({ routeId, routeIdPrev, ref, ...props }: AnimatedOutlet2Props) {
  const isPresent = useIsPresent();
  const matches = useMatches();
  const routeIdNext = matches[matches.length - 1]!.routeId;
  const prevMatchesRef = useRef(matches);
  const RouterContext = getRouterContext();
  let renderedContext = useContext(RouterContext);

  if (isPresent) {
    prevMatchesRef.current = cloneDeep(matches);
  } else {
    renderedContext = cloneDeep(renderedContext);
    renderedContext.__store.state.matches = [
      ...matches.map((m, i) => ({
        ...(prevMatchesRef.current[i] || m),
        id: m.id,
      })),
      ...prevMatchesRef.current.slice(matches.length),
    ];
  }

  const routesAtEnd = [
    '/admin/tea/create',
    '/admin/categories',
    '/admin/tags',
    '/admin/units',
  ] satisfies (keyof FileRoutesById)[];
  const isCurrentAtEnd = routesAtEnd.includes(routeId);

  const routesOrder = [
    '__root__',
    '/',
    '/tea/$id',
    '/admin/tea/$id',
    ...routesAtEnd,
  ] satisfies (keyof FileRoutesById)[];
  let idxPrev = routeIdPrev ? routesOrder.indexOf(routeIdPrev) : -1;
  if (idxPrev === -1) idxPrev = NaN;
  const idxCurrent = routesOrder.indexOf(routeId);
  const idxNext = routesOrder.indexOf(routeIdNext);

  const direction: Direction = (isCurrentAtEnd ? isPresent : idxCurrent < idxNext) ? 'left'
    : isCurrentAtEnd || idxCurrent > idxNext ? 'right'
      : idxPrev < idxCurrent ? 'left'
        : idxPrev > idxCurrent ? 'right'
          : 'none';

  // if (!isPresent)
  //   console.log(`
  // ${routeIdPrev} -> ${routeId} -> ${routeIdNext}
  // ${idxPrev} -> ${idxCurrent} -> ${idxNext}
  // isCurrentAtEnd = ${isCurrentAtEnd}
  // isCurrentAtEnd && isPresent = ${isCurrentAtEnd && isPresent}
  // direction=${direction}
  // `.trim());

  return (
    <motion.div ref={ref} custom={direction} {...PROPS} {...props}>
      <RouterContext.Provider value={renderedContext}>
        <Outlet />
      </RouterContext.Provider>
    </motion.div>
  );
}

const OFFSET_MAP = { none: 0, left: 1, right: -1, up: 1, down: -1 } as const satisfies Record<Direction, -1 | 0 | 1>;
const AXIS_MAP = { none: 'X', left: 'X', right: 'X', up: 'Y', down: 'Y' } as const satisfies Record<Direction, 'X' | 'Y'>;

const TRANSITION_ON = {
  type: 'spring',
  get bounce() {
    return isMdMediaQuery.matches ? 0 : 0.2;
  },
  duration: 0.6,
} as const satisfies Transition;

export const ROUTE_TRANSITION_VARIANTS: Variants = {
  initial: (direction: Direction = 'left') => direction === 'none' ? {} : {
    transform: `translate${AXIS_MAP[direction]}(${OFFSET_MAP[direction] * (isMdMediaQuery.matches ? 5 : 100)}%)`,
    opacity: 0,
  },
  animate: (direction: Direction = 'left') => direction === 'none' ? {} : {
    transform: `translate${AXIS_MAP[direction]}(0%)`,
    opacity: 1,
  },
  exit: (direction: Direction = 'left') => direction === 'none' ? {} : {
    transform: `translate${AXIS_MAP[direction]}(${OFFSET_MAP[direction] * -(isMdMediaQuery.matches ? 5 : 100)}%)`,
    opacity: 0,
    position: 'absolute',
    width: '100%',
    pointerEvents: 'none',
  },
};

export const PROPS = {
  variants: ROUTE_TRANSITION_VARIANTS,
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  transition: TRANSITION_ON,
  onAnimationStart() {
    document.documentElement.classList.add('overflow-hidden');
  },
  onAnimationComplete() {
    setTimeout(() => {
      document.documentElement.classList.remove('overflow-hidden');
    });
  },
} as const satisfies ComponentProps<typeof motion.div>;
