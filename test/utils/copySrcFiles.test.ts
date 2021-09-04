import { join } from 'path';
import { readFileSync } from 'fs';
import copySrcFiles from '../../src/utils/copySrcFiles';

const DIR_NAME = 'plugin-multitabs';

test('copySrcFiles', () => {
    const cwd = join(__dirname, '../../src');
    const dist = join(__dirname, '../.umi-test');
    const config = {};
    copySrcFiles({ cwd, absTmpPath: dist, config });

    const tsx = readFileSync(join(dist, DIR_NAME, 'runtime.tsx'), 'utf-8');
    expect(tsx).toContain('import Provider from \'./Provider\'');
});