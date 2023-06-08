import { CustomDurationPipe } from './custom-duration.pipe';

describe('CustomDurationPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomDurationPipe();
    expect(pipe).toBeTruthy();
  });
});
