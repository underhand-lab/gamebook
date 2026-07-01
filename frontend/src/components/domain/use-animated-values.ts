"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type AnimatedValueTarget = {
  id: string;
  value: number;
};

type AnimatedValueOptions = {
  animateOnMount?: boolean;
  initialValue?: number;
};

function toRecord(targets: AnimatedValueTarget[]) {
  return Object.fromEntries(targets.map((target) => [target.id, target.value]));
}

function toInitialRecord(targets: AnimatedValueTarget[], initialValue: number) {
  return Object.fromEntries(targets.map((target) => [target.id, initialValue]));
}

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

export function useAnimatedValues(
  targets: AnimatedValueTarget[],
  durationMs = 500,
  { animateOnMount = false, initialValue = 0 }: AnimatedValueOptions = {},
) {
  const targetKey = useMemo(
    () => targets.map((target) => `${target.id}:${target.value}`).join("|"),
    [targets],
  );
  const targetsRef = useRef(targets);
  const [values, setValues] = useState(() =>
    animateOnMount ? toInitialRecord(targets, initialValue) : toRecord(targets),
  );
  const valuesRef = useRef(values);

  targetsRef.current = targets;

  useEffect(() => {
    const snapshot = targetsRef.current;
    const targetValues = toRecord(snapshot);
    const startValues = Object.fromEntries(
      snapshot.map((target) => [
        target.id,
        valuesRef.current[target.id] ?? target.value,
      ]),
    );
    const hasChange = snapshot.some(
      (target) =>
        Math.abs((valuesRef.current[target.id] ?? target.value) - target.value) >
        0.001,
    );

    if (!hasChange) {
      valuesRef.current = targetValues;
      return;
    }

    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (
      durationMs <= 0 ||
      reduceMotion ||
      typeof requestAnimationFrame !== "function"
    ) {
      valuesRef.current = targetValues;
      setValues(targetValues);
      return;
    }

    let frameId = 0;
    const startedAt = performance.now();

    const tick = (timestamp: number) => {
      const progress = Math.min((timestamp - startedAt) / durationMs, 1);
      const eased = easeOutCubic(progress);
      const nextValues = Object.fromEntries(
        snapshot.map((target) => {
          const from = startValues[target.id] ?? target.value;
          const next = from + (target.value - from) * eased;

          return [target.id, next];
        }),
      );

      valuesRef.current = nextValues;
      setValues(nextValues);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [durationMs, targetKey]);

  return values;
}
