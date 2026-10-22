import { useCallback, useEffect, useState } from "react";

// Runs `loader` (which must be stable, e.g. from useCallback) and re-runs it whenever it changes.
// Status is derived from which loader/attempt the stored result belongs to, so the effect never
// sets state synchronously.
//
// Returns { status: "loading" | "ready" | "error", data, error, reload, refresh, setData }
//   reload  - run again and show the loading state
//   refresh - run again in the background, keeping current data on screen
export function useAsync(loader) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ loader: null, attempt: -1, data: undefined, error: null });

  useEffect(() => {
    let active = true;
    loader().then(
      (data) => active && setResult({ loader, attempt, data, error: null }),
      (error) => active && setResult({ loader, attempt, data: undefined, error })
    );
    return () => {
      active = false;
    };
  }, [loader, attempt]);

  const settled = result.loader === loader && result.attempt === attempt;
  const status = !settled ? "loading" : result.error ? "error" : "ready";

  const reload = useCallback(() => setAttempt((a) => a + 1), []);

  const refresh = useCallback(async () => {
    try {
      const data = await loader();
      setResult((r) => ({ ...r, data, error: null }));
    } catch {
      // Keep showing the previous data; the action that triggered the refresh reports its own error.
    }
  }, [loader]);

  const setData = useCallback(
    (updater) => setResult((r) => ({ ...r, data: typeof updater === "function" ? updater(r.data) : updater })),
    []
  );

  return { status, data: result.data, error: result.error, reload, refresh, setData };
}
