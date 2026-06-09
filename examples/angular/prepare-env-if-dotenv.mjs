import { existsSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const envDir = join(root, 'src', 'environments');
const devPath = join(envDir, 'environment.ts');
const prodPath = join(envDir, 'environment.prod.ts');

/** Empty stubs so TypeScript / ng serve work before .env exists (files are gitignored). */
function ensureStubEnvironmentsIfMissing() {
  const devStub = `export const environment = {
  production: false,
  // In order to obtain an imsClientId you will need to raise a support ticket with Adobe.
  // Client Id's created via Adobe Developer Console will not work for Content Advisor.
  imsClientId: '',
  imsOrg: null as string | null,
};
`;
  const prodStub = `export const environment = {
  production: true,
  // In order to obtain an imsClientId you will need to raise a support ticket with Adobe.
  // Client Id's created via Adobe Developer Console will not work for Content Advisor.
  imsClientId: '',
  imsOrg: null as string | null,
};
`;
  if (!existsSync(devPath)) {
    writeFileSync(devPath, devStub);
  }
  if (!existsSync(prodPath)) {
    writeFileSync(prodPath, prodStub);
  }
}

ensureStubEnvironmentsIfMissing();

if (existsSync(join(root, '.env'))) {
  const result = spawnSync(process.execPath, [join(root, 'set-env.mjs')], {
    cwd: root,
    stdio: 'inherit',
  });
  if (result.status !== 0 && result.status !== null) {
    process.exit(result.status);
  }
}
