import { act, renderHook } from "@testing-library/react";
import { useGlobalShortcut, useShortCut } from "./use-shortcut";

describe("useShortCut", () => {
    it("calls onKey when the correct key is pressed", () => {
        const mockFn = jest.fn();
        const { result } = renderHook(() =>
            useShortCut("a", mockFn)
        );

        const handler = result.current;
        const event = new KeyboardEvent("keydown", { key: "a" });
        handler(event);

        expect(mockFn).toHaveBeenCalledWith("a", event);
    });

    it("does not call onKey when the key is incorrect", () => {
        const mockFn = jest.fn();
        const { result } = renderHook(() =>
            useShortCut("a", mockFn)
        );

        const handler = result.current;
        handler(new KeyboardEvent("keydown", { key: "b" }));

        expect(mockFn).not.toHaveBeenCalled();
    });

    it("applies debounce correctly", () => {
        jest.useFakeTimers();
        const mockFn = jest.fn();
        const { result } = renderHook(() =>
            useShortCut("a", mockFn, { debounce: 200 })
        );

        const handler = result.current;
        const event = new KeyboardEvent("keydown", { key: "a" });

        act(() => {
            handler(event);
            handler(event);
        });

        expect(mockFn).not.toHaveBeenCalled();

        act(() => {
            jest.advanceTimersByTime(200);
            jest.runOnlyPendingTimers();
        });

        jest.useRealTimers();
    });

    it("calls preventDefault when configured", () => {
        const mockFn = jest.fn();
        const preventDefault = jest.fn();

        const { result } = renderHook(() =>
            useShortCut("a", mockFn, { preventDefault: true })
        );

        const handler = result.current;
        const event = new KeyboardEvent("keydown", { key: "a" });
        Object.defineProperty(event, "preventDefault", { value: preventDefault });

        handler(event);
        expect(preventDefault).toHaveBeenCalled();
    });

    it("ignores events outside of includeSelector", () => {
        const mockFn = jest.fn();
        const { result } = renderHook(() =>
            useShortCut("a", mockFn, { includeSelector: ["allowed"] })
        );

        const handler = result.current;

        const target = document.createElement("div");
        target.className = "not-allowed";

        const event = new KeyboardEvent("keydown", { key: "a" });
        Object.defineProperty(event, "target", { value: target });

        handler(event);

        expect(mockFn).not.toHaveBeenCalled();
    });

    it("ignores events inside of excludeSelector", () => {
        const mockFn = jest.fn();
        const { result } = renderHook(() =>
            useShortCut("a", mockFn, { excludeSelector: ["blocked"] })
        );

        const handler = result.current;
        const target = document.createElement("div");
        target.className = "blocked";

        const event = new KeyboardEvent("keydown", { key: "a" });
        Object.defineProperty(event, "target", { value: target });

        handler(event);
        expect(mockFn).not.toHaveBeenCalled();
    });
});

describe("useGlobalShortcut", () => {
    it("adds and removes the global listener", () => {
        const mockFn = jest.fn();
        const addEventListenerSpy = jest.spyOn(document, "addEventListener");
        const removeEventListenerSpy = jest.spyOn(document, "removeEventListener");

        const { unmount } = renderHook(() =>
            useGlobalShortcut("a", mockFn)
        );

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            "keydown",
            expect.any(Function)
        );

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            "keydown",
            expect.any(Function)
        );
    });

    it("executes the global callback when the correct key is pressed", () => {
        const mockFn = jest.fn();

        renderHook(() =>
            useGlobalShortcut("x", mockFn)
        );

        const event = new KeyboardEvent("keydown", { key: "x" });
        document.dispatchEvent(event);

        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith("x", event);
    });
});
