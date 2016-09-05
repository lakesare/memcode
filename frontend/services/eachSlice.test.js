import { eachSlice } from './eachSlice';

describe('eachSlice', () => {
  it('leaves last array with less amount of members sliced', () => {
    expect(
    	eachSlice([1, 2, 3], 2)
    ).to.deep.equal(
    	[[1, 2], [3]]
    );
  });
})