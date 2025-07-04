import { useCallback, useEffect, useState } from 'react';


export function useAbortController(): [AbortSignal, VoidFunction] {
  const [abortController, setAbortController] = useState<AbortController>(() => new AbortController());

  const abort = useCallback(() => {
    if (!abortController.signal.aborted) abortController.abort();
  }, [abortController]);

  useEffect(() => {
    const onAbort = () => setAbortController(new AbortController());
    abortController.signal.addEventListener('abort', onAbort);

    return () => {
      abort();
      abortController.signal.removeEventListener('abort', onAbort);
    };
  }, [abortController, abort]);

  return [abortController.signal, abort];
}
