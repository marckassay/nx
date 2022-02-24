export interface Schema {
  name: string;

  /**
   * Should always be parsed with a string value, defaults to `'nativescript'`. However,
   * if value is `'none'` value will be replaced with `undefined` after being parsed.
   */
  platform: string | undefined;
  framework?: string;
  routing?: boolean;
  skipFormat?: boolean;
  directory?: string;
  tags?: string;
  unitTestRunner?: 'jest' | 'none';
  /**
   * Group by app name (appname-platform) instead of the default (platform-appname)
   */
  groupByName?: boolean;
}