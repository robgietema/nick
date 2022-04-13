import { Type } from '../../models';

describe('Type', () => {
  it('should cache schema', async () => {
    const type = await Type.fetchById('Page');
    await type.cacheSchema();
  });
});
