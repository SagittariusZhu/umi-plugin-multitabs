# umi-plugin-multitabs

> umi-plugin-multitabs.

## Install

Using npm:

```bash
$ npm install --save-dev umi-plugin-multitabs
```

or using yarn:

```bash
$ yarn add umi-plugin-multitabs --dev
```

## Usage

Modify `config/config.js` or `.umirc.js`

```
export default defineConfig({
  plugins: [
    'umi-plugin-multitabs',
  ],
  multitabs: {},
});
```

This plugin is enabled by config.

Now you have multitabs support.

## Dependencies

You must use umi3 and @ant-design/pro-layout.