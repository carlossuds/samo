import { act } from "react-dom/test-utils";
import { useHome } from "../hooks"; // Replace with the actual file path
import { renderHook } from "@testing-library/react";
import { Actions } from "../enums";

describe("useHome Hook Tests", () => {
  it("should handle basic FILL and EMPTY actions", () => {
    const { result } = renderHook(() => useHome());

    act(() => {
      result.current.onFieldChange({ bucket: "X", volume: 30 });
    });

    act(() => {
      result.current.onFieldChange({ bucket: "Y", volume: 210 });
    });

    act(() => {
      result.current.onFieldChange({ bucket: "Z", volume: 150 });
    });

    act(() => {
      result.current.onSubmit();
    });

    expect(result.current.bucketsVolume).toEqual({ X: 30, Y: 210, Z: 150 });
    expect(result.current.steps).toEqual([
      { action: Actions.FILL, targetBucket: "Y" },
      { action: Actions.TRANSFER, targetBucket: "X" },
      { action: Actions.EMPTY, targetBucket: "X" },
      { action: Actions.TRANSFER, targetBucket: "X" },
    ]);
    expect(result.current.stepsTableData.at(-1)?.Y).toEqual(150);
    expect(result.current.stepsTableData.at(-1)?.X).toEqual(30);
  });

  it("should handle TRANSFER action", () => {
    const { result } = renderHook(() => useHome());

    act(() => {
      result.current.onFieldChange({ bucket: "X", volume: 30 });
    });

    act(() => {
      result.current.onFieldChange({ bucket: "Y", volume: 210 });
    });

    act(() => {
      result.current.onFieldChange({ bucket: "Z", volume: 60 });
    });

    act(() => {
      result.current.onSubmit();
    });

    expect(result.current.bucketsVolume).toEqual({ X: 30, Y: 210, Z: 60 });
    expect(result.current.steps).toEqual([
      { action: Actions.FILL, targetBucket: "X" },
      { action: Actions.TRANSFER, targetBucket: "Y" },
      { action: Actions.FILL, targetBucket: "X" },
      { action: Actions.TRANSFER, targetBucket: "Y" },
    ]);
    expect(result.current.stepsTableData.at(-1)?.Y).toEqual(60);
    expect(result.current.stepsTableData.at(-1)?.X).toEqual(0);
  });

  it("should handle special cases", () => {
    const { result } = renderHook(() => useHome());

    act(() => {
      result.current.onFieldChange({ bucket: "X", volume: 70 });
    });

    act(() => {
      result.current.onFieldChange({ bucket: "Y", volume: 90 });
    });

    act(() => {
      result.current.onFieldChange({ bucket: "Z", volume: 20 });
    });

    act(() => {
      result.current.onSubmit();
    });

    expect(result.current.steps).toEqual([
      { action: Actions.FILL, targetBucket: "Y" },
      { action: Actions.TRANSFER, targetBucket: "X" },
    ]);
    expect(result.current.stepsTableData.at(-1)?.X).toEqual(70);
    expect(result.current.stepsTableData.at(-1)?.Y).toEqual(20);
  });

  it("should handle error cases", () => {
    const { result } = renderHook(() => useHome());

    act(() => {
      result.current.onFieldChange({ bucket: "X", volume: 40 });
    });

    act(() => {
      result.current.onFieldChange({ bucket: "Y", volume: 30 });
    });

    act(() => {
      result.current.onFieldChange({ bucket: "Z", volume: 50 });
    });

    act(() => {
      result.current.onSubmit();
    });

    expect(result.current.hasError).toBe(true);
  });
});
