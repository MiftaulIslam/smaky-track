/** Prices are stored as integers (minor units). 1 BDT = 100 poisha. */

export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

export function fromMinorUnits(minor: number): number {
  return minor / 100;
}

export function formatBDT(minor: number): string {
  const amount = fromMinorUnits(minor);
  return `৳${amount.toLocaleString("en-BD", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatBDTFromMajor(major: number): string {
  return `৳${major.toLocaleString("en-BD", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
