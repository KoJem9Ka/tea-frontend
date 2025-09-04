import { getRouterContext, Outlet, useMatches } from '@tanstack/react-router';
import { cloneDeep } from 'lodash-es';
import type { Transition, Variants } from 'motion';
import { AnimatePresence, motion } from 'motion/react';
import { useContext } from 'react';


export function AnimatedOutletV0() {
  const matches = useMatches();
  const routeId = matches[matches.length - 1]!.routeId;

  const RouterContext = getRouterContext();
  const routerContext = cloneDeep(useContext(RouterContext));

  const direction = ({
    '/': -1,
    '/tea/$id': 1,
  } as Record<typeof routeId, -1 | 1>)[routeId] as number | undefined ?? 0;

  return (
    <main className='relative'>
      <AnimatePresence mode='popLayout' initial={false}>
        <motion.div
          custom={direction}
          initial='hidden'
          animate='visible'
          exit='hidden'
          variants={variants2}
          key={routeId}
          transition={layoutTransition}
        >
          <RouterContext.Provider value={routerContext}>
            <Outlet />
          </RouterContext.Provider>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

const layoutTransition: Transition = { type: 'spring', bounce: 0.3, duration: 1 };

const variants2: Variants = {
  visible: (direction: number) => direction ? ({
    x: 0,
    opacity: 1,
  }) : {},
  hidden: (direction: number) => direction ? ({
    x: 100 * direction,
    opacity: 0,
  }) : {},
};
