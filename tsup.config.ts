// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,            // gera .d.ts (declarations)
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'], // deixar React como peer
  splitting: false,     // normalmente false para bibliotecas
});