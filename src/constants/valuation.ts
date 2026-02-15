export const PROJECTION_YEARS = 5;

export const DISCOUNT_RATES = [0.05, 0.08, 0.1, 0.12, 0.15] as const;

export const EPS_CAGR_INPUT = {
  min: -10,
  max: 40,
  step: 0.5,
} as const;

export const PE_INPUT = {
  min: 5,
  max: 60,
  step: 0.5,
  defaultValue: 15,
} as const;

export const BVPS_CAGR_INPUT = {
  min: -10,
  max: 40,
  step: 0.5,
} as const;

export const ROE_INPUT = {
  min: 0,
  max: 60,
  step: 0.5,
} as const;
