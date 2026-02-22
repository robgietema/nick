import { describe, it } from 'vitest';
import { Type } from '../../models/type/type';

describe('Type', () => {
  it('should cache schema', async () => {
    const type = await Type.fetchById('Page');
    await (type as any).cacheSchema();
  });
});
