export function rippleClickEffect(args: {
  element: HTMLElement,
  blendMode?: boolean,
  stopPropagation?: boolean,
  initialOpacity?: number,
}): VoidFunction {
  const {
    element,
    initialOpacity = 0.35,
  } = args;

  const onClick = (event: MouseEvent) => {
    if (args.stopPropagation) event.stopPropagation();

    const elementRect = element.getBoundingClientRect();
    const rippleSize = Math.max(elementRect.width, elementRect.height);
    const rippleHalfSize = rippleSize / 2;
    const rippleX = event.clientX - elementRect.left - rippleHalfSize;
    const rippleY = event.clientY - elementRect.top - rippleHalfSize;
    const duration = Math.min(Math.max(rippleSize / 100, 0.2), rippleSize > 100 ? 0.75 : 0.5) * 1000;

    const ripple = document.createElement('span');
    ripple.animate([
      { transform: 'scale(0)', opacity: initialOpacity },
      { transform: 'scale(2)', opacity: 0 },
    ], { duration: duration, fill: 'forwards' });
    Object.assign(ripple.style, {
      position: 'absolute',
      borderRadius: '9999px',
      transformOrigin: 'center',
      pointerEvents: 'none',
      overflow: 'hidden',
      inset: '0',
      zIndex: '0',
      backgroundColor: 'currentColor',
      ...(args.blendMode ? {
        backgroundColor: 'white',
        mixBlendMode: 'screen',
      } : {}),
      width: `${rippleSize}px`,
      height: `${rippleSize}px`,
      left: `${rippleX}px`,
      top: `${rippleY}px`,
      animationDuration: `${duration}ms`,
    } satisfies Partial<CSSStyleDeclaration>);
    element.appendChild(ripple);

    setTimeout(() => element.removeChild(ripple), duration);
  };

  const abortController = new AbortController();
  element.addEventListener('click', onClick, abortController);
  return () => abortController.abort();
}
