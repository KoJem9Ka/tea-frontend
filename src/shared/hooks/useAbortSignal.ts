import { useCallback, useEffect, useState } from 'react';


export function useAbortController(): [AbortSignal, VoidFunction] {
  const [abortController, setAbortController] = useState<AbortController>(() => new AbortController());

  useEffect(() => {
    if (abortController.signal.aborted) setAbortController(new AbortController());

    return () => {
      if (abortController.signal.aborted) return;
      abortController.abort();
    };
  }, [abortController]);

  const abort = useCallback(() => {
    if (abortController.signal.aborted) return;
    abortController.abort();
  }, [abortController]);

  return [abortController.signal, abort];
}
