import providerContent from '../../src/utils/getProviderContent';

test('getProviderContent', () => {
    expect(providerContent).toContain('import childrenRender from "./layout/childrenRender"');
});