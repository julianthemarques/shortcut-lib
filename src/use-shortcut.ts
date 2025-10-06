import { useEffect } from "react";

export type IShortcutOptions = {
  debounce?: number;
  includeClasses?: string[];
  excludeClasses?: string[];
  preventDefault?: boolean;
};

type IUseShortCut = (
  keys: string | string[],
  onKey: (key: string, event: KeyboardEvent) => any,
  options?: IShortcutOptions,
  global?: boolean
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
  if (!target) return false;

  if (target instanceof Element) {
    const classList = target.classList;

    if (
      include &&
      include.length > 0 &&
      !include.some((cls) => classList.contains(cls))
    )
      return false;
    if (
      exclude &&
      exclude.length > 0 &&
      exclude.some((cls) => classList.contains(cls))
    )
      return false;
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
    includeClasses,
    excludeClasses,
    preventDefault = false,
  } = options || {};

  if (arraysAreEqual(includeClasses, excludeClasses)) return () => {};

  const handler = debounce > 0 ? debounceHandler(onKey, debounce) : onKey;

  return (event: KeyboardEvent) => {
    if (!shouldHandle(event.target, includeClasses, excludeClasses)) return;

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