const { act, renderHook } = require("@testing-library/react");
const { createRef } = require("react");
const { useClickedWithin } = require("../dist/index.cjs");

describe("useClickedWithin", () => {
  function fireClick(target) {
    act(() => {
      target.dispatchEvent(
        new MouseEvent("click", { bubbles: true, composed: true }),
      );
    });
  }

  // ---- Basic behaviour ----

  it("should initialise as false", () => {
    const { result } = renderHook(() => useClickedWithin());
    expect(result.current.isClickedWithin).toBe(false);
  });

  it("should be true when clicking inside the element", () => {
    const { result } = renderHook(() => useClickedWithin());

    const div = document.createElement("div");
    document.body.appendChild(div);
    result.current.ref.current = div;

    fireClick(div);
    expect(result.current.isClickedWithin).toBe(true);

    document.body.removeChild(div);
  });

  it("should be true when clicking a descendant", () => {
    const { result } = renderHook(() => useClickedWithin());

    const parent = document.createElement("div");
    const child = document.createElement("button");
    parent.appendChild(child);
    document.body.appendChild(parent);
    result.current.ref.current = parent;

    fireClick(child);
    expect(result.current.isClickedWithin).toBe(true);

    document.body.removeChild(parent);
  });

  it("should be false when clicking outside the element", () => {
    const { result } = renderHook(() => useClickedWithin());

    const div = document.createElement("div");
    const outside = document.createElement("div");
    document.body.appendChild(div);
    document.body.appendChild(outside);
    result.current.ref.current = div;

    fireClick(outside);
    expect(result.current.isClickedWithin).toBe(false);

    document.body.removeChild(div);
    document.body.removeChild(outside);
  });

  // ---- External ref ----

  it("should work with an external ref", () => {
    const externalRef = createRef();
    const { result } = renderHook(() => useClickedWithin(externalRef));

    const div = document.createElement("div");
    document.body.appendChild(div);
    externalRef.current = div;

    fireClick(div);
    expect(result.current.isClickedWithin).toBe(true);
    expect(result.current.ref).toBe(externalRef);

    document.body.removeChild(div);
  });

  it("should return the external ref, not an internal one", () => {
    const externalRef = createRef();
    const { result } = renderHook(() => useClickedWithin(externalRef));
    expect(result.current.ref).toBe(externalRef);
  });

  // ---- Edge cases ----

  it("should be false when ref is not yet mounted", () => {
    const { result } = renderHook(() => useClickedWithin());

    const outside = document.createElement("div");
    document.body.appendChild(outside);

    fireClick(outside);
    expect(result.current.isClickedWithin).toBe(false);

    document.body.removeChild(outside);
  });

  it("should handle target removed from DOM before click fires", () => {
    const { result } = renderHook(() => useClickedWithin());

    const parent = document.createElement("div");
    const child = document.createElement("button");
    parent.appendChild(child);
    document.body.appendChild(parent);
    result.current.ref = parent;

    // Remove child before click event fires
    parent.removeChild(child);
    fireClick(child);

    // composedPath() should still resolve correctly
    expect(result.current.isClickedWithin).toBe(false);

    document.body.removeChild(parent);
  });

  it("should update from true back to false when clicking outside after inside", () => {
    const { result } = renderHook(() => useClickedWithin());

    const div = document.createElement("div");
    const outside = document.createElement("div");
    document.body.appendChild(div);
    document.body.appendChild(outside);
    result.current.ref.current = div;

    fireClick(div);
    expect(result.current.isClickedWithin).toBe(true);

    fireClick(outside);
    expect(result.current.isClickedWithin).toBe(false);

    document.body.removeChild(div);
    document.body.removeChild(outside);
  });

  // ---- Cleanup ----

  it("should remove the event listener on unmount", () => {
    const removeSpy = jest.spyOn(document, "removeEventListener");
    const { unmount } = renderHook(() => useClickedWithin());

    unmount();
    expect(removeSpy).toHaveBeenCalledWith("click", expect.any(Function));
    removeSpy.mockRestore();
  });
});
