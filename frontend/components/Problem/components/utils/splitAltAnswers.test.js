import splitAltAnswers from './splitAltAnswers';

// #todo Testing setup doesn't work atm, - tested this manually.
describe('splitAltAnswers', () => {
  it('temp', () => {
    expect(splitAltAnswers(String.raw`wow\|right|hello`)).to.deep.equal(['wow|right', 'hello']);
  });

  it('temp', () => {
    expect(splitAltAnswers(String.raw`wow\|right`)).to.deep.equal(['wow|right']);
  });

  it('temp', () => {
    expect(splitAltAnswers(String.raw`simple`)).to.deep.equal(['simple']);
  });
});
