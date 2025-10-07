import { useEffect } from "react";

export type IShortcutOptions = {
  debounce?: number;
  includeSelector?: string[];
  excludeSelector?: string[];
  preventDefault?: boolean;
};

type IUseShortCut = (
  keys: string | string[],
  onKey: (key: string, event: KeyboardEvent) => any,
  options?: IShortcutOptions
) => (event: KeyboardEvent) => void;

const debounceHandler = (
  onKey: (key: string, event: KeyboardEvent) => any,
  delay: number
) => {
  let timer: number | null = null;

  return (key: string, event: KeyboardEvent) => {
    if (timer !== null) clearTimeout(timer);
    timer = window.setTimeout(() => onKey(key, event), delay);
  };
};

const shouldHandle = (
  target: EventTarget | null,
  include?: string[],
  exclude?: string[]
) => {
  if (!target) return true;

  if (target instanceof Element) {
    if (include && !include.some((cls) => target.closest(`.${cls}`)))
      return false;
    if (exclude && exclude.some((cls) => target.closest(`.${cls}`)))
      return false;
    return true;
  }

  return true;
};

const arraysAreEqual = (a?: string[], b?: string[]) => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  return (
    a.every((item) => b.includes(item)) && b.every((item) => a.includes(item))
  );
};

export const useShortCut: IUseShortCut = (keys, onKey, options) => {
  const {
    debounce = 0,
    includeSelector,
    excludeSelector,
    preventDefault = false,
  } = options || {};

  if (
    includeSelector &&
    excludeSelector &&
    arraysAreEqual(includeSelector, excludeSelector)
  )
    return () => {};

  const handler = debounce > 0 ? debounceHandler(onKey, debounce) : onKey;

  return (event: KeyboardEvent) => {
    if (!shouldHandle(event.target, includeSelector, excludeSelector)) return;

    const keyMatched =
      (typeof keys === "string" && keys === event.key) ||
      (Array.isArray(keys) && keys.includes(event.key));

    if (keyMatched) {
      if (preventDefault) event.preventDefault();
      handler(event.key, event);
    }
  };
};

export const useGlobalShortcut = (
  keys: string | string[],
  onKey: (key: string, event: KeyboardEvent) => void,
  options?: IShortcutOptions
) => {
  const handler = useShortCut(keys, onKey, options);

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => handler(ev);

    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [handler]);
};
