import { Strategies } from './jwt.strategy';

describe('Strategies', () => {
  it('should be defined', () => {
    expect(new Strategies()).toBeDefined();
  });
});
