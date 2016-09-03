import { problemContentFromParamsToDb } from './problemContentFromParamsToDb';

describe('problemContentFromParamsToDb', () => {

  it('one answer is possible', () => {
    expect(
      problemContentFromParamsToDb("<h1>heading<answer>hi</answer></h1>")
    ).to.equal(
      '{"answers":[{"answer":"hi"}],"text":["<h1>heading",null,"</h1>"]}'
    );
  });

  it('empty answer is possible', () => {
    expect(
      problemContentFromParamsToDb("<h1>heading<answer></answer></h1>")
    ).to.equal(
      '{"answers":[{"answer":""}],"text":["<h1>heading",null,"</h1>"]}'
    );
  });

  it('answer as the last thing is possible', () => {
    expect(
      problemContentFromParamsToDb("<h1>heading</h1><answer>hi</answer>")
    ).to.equal(
      '{"answers":[{"answer":"hi"}],"text":["<h1>heading</h1>",null]}'
    );
  });

  it('answer as the first thing is possible', () => {
    expect(
      problemContentFromParamsToDb("<answer>hi</answer><h1>heading</h1>")
    ).to.equal(
      '{"answers":[{"answer":"hi"}],"text":["",null,"<h1>heading</h1>"]}'
    );
  });

});