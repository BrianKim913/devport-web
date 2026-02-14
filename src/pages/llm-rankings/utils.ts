import { useEffect, useState } from 'react';
import type { BenchmarkCategoryGroup } from '../../types';

export const toNumber = (value?: number | string | null) => {
  if (value === null || value === undefined) return null;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const formatScore = (score?: number | string | null, digits: number = 1) => {
  const numericScore = toNumber(score);
  if (numericScore === null) return '-';
  return numericScore.toFixed(digits);
};

export const makeBenchmarkGroupId = (group: BenchmarkCategoryGroup) => `benchmark-${group.toLowerCase()}`;

export const useCountUp = (target: number | null, durationMs: number = 1800) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === null) return;
    const from = 0;
    setValue(0);
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(from + (target - from) * eased);
      setValue(next);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, durationMs]);

  if (target === null) return null;
  return value;
};
