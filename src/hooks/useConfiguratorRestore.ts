import { useEffect, useState } from "react";
import { useConfiguratorStore } from "@/src/lib/configurator/store";

// The saved answers are restored after mount so the server and first client render match.
// Returns true once the restore has finished (also when there was nothing to restore).
export function useConfiguratorRestore(): boolean {
  const [isRestored, setIsRestored] = useState(false);
  useEffect(() => {
    Promise.resolve(useConfiguratorStore.persist.rehydrate()).finally(() => setIsRestored(true));
  }, []);
  return isRestored;
}
