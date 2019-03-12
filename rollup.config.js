import fs from 'fs';
import typescript from 'rollup-plugin-typescript2';

// cleanup
['index.js', 'utils.d.ts'].forEach(it => {
  try {
    fs.unlinkSync(it);
  } catch (err) {
    // noop
  }
});

export default {
  input: 'src/index.ts',
  output: {
    file: 'index.js',
    format: 'cjs',
    exports: 'named',
  },
  plugins: [typescript()],
};
