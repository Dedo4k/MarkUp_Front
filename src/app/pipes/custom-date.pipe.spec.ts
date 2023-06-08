import { CustomDatePipe } from './custom-date.pipe';

describe('DatePipe', () => {
  it('create an instance', () => {
    const pipe = new CustomDatePipe();
    expect(pipe).toBeTruthy();
  });
});
