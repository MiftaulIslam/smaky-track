export const CIGARETTES_PER_PACKET = 20;

export function packetsFromCigarettes(count: number): number {
  return count / CIGARETTES_PER_PACKET;
}
