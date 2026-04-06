# useClickedWithin

A React hook that tracks whether a click event occurred within a given element or its descendants.

## Usage

### Basic usage

```tsx
import { useClickedWithin } from "react-clicked-within";

function Component() {
  const { ref, isClickedWithin } = useClickedWithin<HTMLDivElement>();

  const style = {
    color: "yellow",
    background: isClickedWithin ? "teal" : "grey",
  };

  return (
    <div ref={ref} style={style}>
      <div>Content</div>
      <span>{isClickedWithin ? "Clicked Inside" : "Clicked outside"}</span>
    </div>
  );
}
```

### With an external ref

```tsx
import { useRef } from "react";
import { useClickedWithin } from "react-clicked-within";

function Component() {
  const ref = useRef<HTMLDivElement>(null);
  const { isClickedWithin } = useClickedWithin(ref);

  const style = {
    color: "yellow",
    background: isClickedWithin ? "teal" : "grey",
  };

  return (
    <div ref={ref} style={style}>
      {isClickedWithin ? "Clicked inside" : "Clicked outside"}
    </div>
  );
}
```
