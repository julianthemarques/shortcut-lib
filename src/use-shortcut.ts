type IUseShortcuts = (
  keys: string | string[],
  onKey: (key: string, event: KeyboardEvent) => any
) => (event: KeyboardEvent) => void;

export const useShortCut: IUseShortcuts = (keys, onKey) => {
  return (event) => {
    if (
      (typeof keys === "string" && keys === event.key) ||
      (keys.includes(event.key) && typeof keys !== "string")
    )
      onKey(event.key, event);
  };
};