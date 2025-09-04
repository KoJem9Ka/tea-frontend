import { useMediaQuery } from 'usehooks-ts';


export const isMdQuery = '(width >= 48rem /* 768px */)';
export const isMdMediaQuery = window.matchMedia(isMdQuery);

export function useIsMd() {
  const isMd = useMediaQuery(isMdQuery);
  return { isMd, isMaxMd: !isMd };
}
