import { type RefObject, useEffect, useRef, useState } from "react";

type elementClickedWithin<T extends HTMLElement> = {
  isClickedWithin: boolean;
  ref: RefObject<T | null>;
};

/**
 * React hook that tracks whether a click event is within a given element or its descendants.
 */
export function useClickedWithin<T extends HTMLElement>(
  externalRef?: RefObject<T | null>,
): elementClickedWithin<T> {
  const [isFocusedWithin, setIsFocusedWithin] = useState(false);

  const __internalRef = useRef<T>(null);
  const ref = externalRef ?? __internalRef;

  useEffect(() => {
    function handleFocusOut(event: PointerEvent) {
      const isInside = ref.current?.contains(event.target as Node);
      setIsFocusedWithin(isInside ?? false);
    }

    document.addEventListener("click", handleFocusOut);

    return () => {
      document.removeEventListener("click", handleFocusOut);
    };
  }, [ref]);

  return { isClickedWithin: isFocusedWithin, ref: ref };
}

export default useClickedWithin;
