import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (promise: Promise<{ data: T | null; error: string | null }>) => {
    setState({ data: null, loading: true, error: null });
    const result = await promise;
    setState({ data: result.data, loading: false, error: result.error });
    return result;
  }, []);

  return { ...state, execute };
}
