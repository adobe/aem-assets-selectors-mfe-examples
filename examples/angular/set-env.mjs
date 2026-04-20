import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('.', import.meta.url).pathname;
const envPath = join(ROOT, '.env');

if (!existsSync(envPath)) {
  console.error('\n  ERROR: .env file not found.');
  console.error('  Copy .env.example to .env and add your IMS Client ID:\n');
  console.error('    cp .env.example .env\n');
  process.exit(1);
}

const env = {};
for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const [key, ...rest] = trimmed.split('=');
  env[key.trim()] = rest.join('=').trim();
}

const imsClientId = env.ASSET_SELECTOR_IMS_CLIENT_ID;
const imsOrgRaw = (env.ASSET_SELECTOR_IMS_ORG || '').trim();
const imsOrg =
  imsOrgRaw && imsOrgRaw !== '<YOUR_IMS_ORG>' ? imsOrgRaw : null;

if (!imsClientId || imsClientId === '<YOUR_IMS_CLIENT_ID>') {
  console.error('\n  ERROR: ASSET_SELECTOR_IMS_CLIENT_ID is not set in .env\n');
  process.exit(1);
}

const envDir = join(ROOT, 'src', 'environments');
const imsOrgTs = imsOrg === null ? 'null' : JSON.stringify(imsOrg);
const clientTs = JSON.stringify(imsClientId);

const devContent = `export const environment = {
  production: false,
  imsClientId: ${clientTs},
  imsOrg: ${imsOrgTs},
};
`;

const prodContent = `export const environment = {
  production: true,
  imsClientId: ${clientTs},
  imsOrg: ${imsOrgTs},
};
`;

writeFileSync(join(envDir, 'environment.ts'), devContent);
writeFileSync(join(envDir, 'environment.prod.ts'), prodContent);
console.log(
  '  Wrote src/environments/environment.ts and environment.prod.ts from .env (gitignored)'
);
