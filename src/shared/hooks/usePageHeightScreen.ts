import { useEffect } from 'react';
import { ElementId } from '@/shared/lib/element-id';


export function usePageHeightScreen() {
  useEffect(() => {
    const root = document.getElementById(ElementId.App);
    if (!root) return;

    const originalClassNames = root.className;
    root.className = `${originalClassNames} h-screen overflow-hidden`;

    return () => void (root.className = originalClassNames);
  }, []);
}
