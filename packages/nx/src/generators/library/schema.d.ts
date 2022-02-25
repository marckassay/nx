import { Linter } from '@nrwl/workspace/src/utils/lint';

export interface Schema {
  name: string;
  /**
   * Should always be parsed with a string value, defaults to `'nativescript'`. However,
   * if value is `'none'` value will be replaced with `undefined` after being parsed.
   */
  platform: string | undefined;
  directory?: string;
  skipTsConfig: boolean;
  skipFormat: boolean;
  tags?: string;
  simpleModuleName: boolean;
  unitTestRunner: 'jest' | 'none';
  linter: Linter;
  testEnvironment: 'jsdom' | 'node';
  importPath?: string;
  js: boolean;
  babelJest?: boolean;
  pascalCaseFiles: boolean;
}
