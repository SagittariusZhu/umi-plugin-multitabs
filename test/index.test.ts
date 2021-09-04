import { join } from 'path';
import { Service } from 'umi';
import { ApplyPluginsType } from '@umijs/core/lib/Service/enums';
import { cleanup } from '@testing-library/react';

const fixtures = join(__dirname, '../fixtures');

afterEach(() => {
    cleanup();
});

test('default', async () => {
    const cwd = fixtures;
    const service = new Service({
        cwd,
        plugins: [require.resolve('../')],
    });
    await service.run({
        name: 'g',
        args: {
            _: ['g', 'tmp'],
        },
    });
    const plugins = require(join(cwd, '.umi-test', 'core/plugin.ts')).plugin;
    expect(plugins.validKeys).toContain('multitabs');
});