
import { readJson, readProjectConfiguration, readWorkspaceConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { applicationGenerator } from './application';
import { angularVersion, nsAngularVersion, rxjsVersion, zonejsVersion } from '../../utils/versions';

describe('app', () => {
  let appTree: Tree;

  beforeEach(() => {
      appTree = createTreeWithEmptyWorkspace(2);
  });

  it('should update workspace.json', async () => {
    await applicationGenerator(appTree, { name: 'myApp' });
    const config = readProjectConfiguration(appTree, 'nativescript-my-app');

    expect(config.root).toEqual('apps/nativescript-my-app/');
  });

  it('should generate files', async () => {
    await applicationGenerator(appTree, { name: 'myApp', framework: 'vanilla' });
    const appPath = 'apps/nativescript-my-app';
    expect(appTree.exists(`${appPath}/src/app-root.xml`)).toBeTruthy();
    expect(appTree.exists(`${appPath}/src/main-page.ts`)).toBeTruthy();
    checkFiles(appTree, appPath);
  });

  it('nested in directory: should generate files', async () => {
    await applicationGenerator(appTree, { name: 'myApp', directory: 'mobile', framework: 'vanilla' });
    const appPath = 'apps/mobile/nativescript-my-app';
    expect(appTree.exists(`${appPath}/src/app-root.xml`)).toBeTruthy();
    expect(appTree.exists(`${appPath}/src/main-page.ts`)).toBeTruthy();

    checkFiles(appTree, appPath, '../../../');
  });

  it('Angular with Routing: should generate files', async () => {
    await applicationGenerator(appTree, { name: 'myApp', framework: 'angular', routing: true });
    const appPath = 'apps/nativescript-my-app';
    checkAngularFiles(appTree, appPath);

    expect(appTree.exists(`${appPath}/src/app.routing.ts`)).toBeTruthy();
    expect(appTree.exists(`${appPath}/src/features/home/home.module.ts`)).toBeTruthy();

    // should also save framework as default in plugin settings
    const packageJson = readJson(appTree, `package.json`);
    expect(packageJson['nativescript-nx'].framework).toEqual('angular');

    checkFiles(appTree, appPath);
  });

  it('Angular without Routing: should generate files', async () => {
    await applicationGenerator(appTree, { name: 'myApp', framework: 'angular', routing: false });
    const appPath = 'apps/nativescript-my-app';
    checkAngularFiles(appTree, appPath);

    expect(appTree.exists(`${appPath}/src/app.routing.ts`)).toBeFalsy();
    expect(appTree.exists(`${appPath}/src/features/home/home.module.ts`)).toBeFalsy();

    checkFiles(appTree, appPath);
  });

  it('Angular nested in directory: should generate files', async () => {
    await applicationGenerator(appTree, { name: 'myApp', framework: 'angular', directory: 'mobile', routing: true });
    const appPath = 'apps/mobile/nativescript-my-app';
    checkAngularFiles(appTree, appPath);

    expect(appTree.exists(`${appPath}/src/app.routing.ts`)).toBeTruthy();
    expect(appTree.exists(`${appPath}/src/features/home/home.module.ts`)).toBeTruthy();

    checkFiles(appTree, appPath, '../../../');
  });

  it('should add angular dependencies when framework is angular', async () => {
    await applicationGenerator(appTree, { name: 'myApp', framework: 'angular' });
    const packageJson = readJson(appTree, `package.json`);

    expect(packageJson['dependencies']['@angular/animations']).toEqual(angularVersion);
    expect(packageJson['dependencies']['@angular/common']).toEqual(angularVersion);
    expect(packageJson['dependencies']['@angular/compiler']).toEqual(angularVersion);
    expect(packageJson['dependencies']['@angular/core']).toEqual(angularVersion);
    expect(packageJson['dependencies']['@angular/forms']).toEqual(angularVersion);
    expect(packageJson['dependencies']['@angular/platform-browser']).toEqual(angularVersion);
    expect(packageJson['dependencies']['@angular/platform-browser-dynamic']).toEqual(angularVersion);
    expect(packageJson['dependencies']['@angular/router']).toEqual(angularVersion);
    expect(packageJson['dependencies']['rxjs']).toEqual(rxjsVersion);
    expect(packageJson['dependencies']['zone.js']).toEqual(zonejsVersion);
    expect(packageJson['dependencies']['@nativescript/angular']).toEqual(nsAngularVersion);
  });

  it('should not add angular dependencies when framework is not angular', async () => {
    await applicationGenerator(appTree, { name: 'myApp', framework: '' });
    const packageJson = readJson(appTree, `package.json`);

    expect(packageJson['dependencies']['@angular/animations']).toBeFalsy();
    expect(packageJson['dependencies']['@angular/common']).toBeFalsy();
    expect(packageJson['dependencies']['@angular/compiler']).toBeFalsy();
    expect(packageJson['dependencies']['@angular/core']).toBeFalsy();
    expect(packageJson['dependencies']['@angular/forms']).toBeFalsy();
    expect(packageJson['dependencies']['@angular/platform-browser']).toBeFalsy();
    expect(packageJson['dependencies']['@angular/platform-browser-dynamic']).toBeFalsy();
    expect(packageJson['dependencies']['@angular/router']).toBeFalsy();
    expect(packageJson['dependencies']['rxjs']).toBeFalsy();
    expect(packageJson['dependencies']['zone.js']).toBeFalsy();
    expect(packageJson['dependencies']['@nativescript/angular']).toBeFalsy();
  });
});

const checkFiles = (tree: Tree, appPath: string, relativeToRootPath = '../../') => {
  // console.log('appPath', tree.listChanges().map(c => c.path))
  expect(tree.exists(`${appPath}/App_Resources/Android/app.gradle`)).toBeTruthy();
  expect(tree.exists(`${appPath}/App_Resources/iOS/Info.plist`)).toBeTruthy();

  const tsconfig = readJson(tree, `${appPath}/tsconfig.json`);
  expect(tsconfig.extends).toEqual(`${relativeToRootPath}tsconfig.base.json`);

  expect(tree.exists(`${appPath}/.eslintrc.json`)).toBeTruthy();
};

const checkAngularFiles = (tree: Tree, appPath: string) => {
  expect(tree.exists(`${appPath}/src/app.component.ts`)).toBeTruthy();
  expect(tree.exists(`${appPath}/src/app.module.ts`)).toBeTruthy();
  expect(tree.exists(`${appPath}/src/environments/environment.ts`)).toBeTruthy();
  expect(tree.exists(`${appPath}/src/features/shared/shared.module.ts`)).toBeTruthy();
};
