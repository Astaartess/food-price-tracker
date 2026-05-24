import { calculateAverage } from './calculate-average';

describe('calculateAverage', () => {
  it('should return null for an empty array', () => {
    expect(calculateAverage([])).toBeNull();
  });

  it('should return the same value for a single-item array', () => {
    expect(calculateAverage([125])).toBe(125);
  });

  it('should return the rounded average for multiple values', () => {
    expect(calculateAverage([100, 101, 102])).toBe(101);
    expect(calculateAverage([100, 101])).toBe(101);
  });
});
