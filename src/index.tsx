import { type RefObject, useEffect, useRef, useState } from "react";

type UseClickedWithin<T extends HTMLElement> = {
  isClickedWithin: boolean;
  ref: RefObject<T | null>;
};

/**
 * React hook that tracks whether a click event occurred within a given element or its descendants.
 * Works with Shadow DOM, conditional rendering, and touch events.
 */
export function useClickedWithin<T extends HTMLElement>(
  externalRef?: RefObject<T | null>,
): UseClickedWithin<T> {
  const [isClickedWithin, setIsClickedWithin] = useState(false);

  const __ref = useRef<T>(null);
  const ref = externalRef ?? __ref;

  useEffect(() => {
    function handleClick(event: PointerEvent) {
      const isInside = event.composedPath().includes(ref.current as T);
      // const isInside = ref.current?.contains(event.target as Node) ?? false;
      setIsClickedWithin(isInside);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [ref]);

  return { isClickedWithin, ref };
}
