import { useMediaQuery } from 'usehooks-ts';


export function useIsMd() {
  const isMd = useMediaQuery('(width >= 48rem /* 768px */)');
  return { isMd, isMaxMd: !isMd };
}
