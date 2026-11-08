// Uso: npm run admin:hash -- "mi clave secreta"
import { createHash } from 'node:crypto';

const clave = process.argv.slice(2).join(' ');
if (!clave) {
  console.error('Uso: npm run admin:hash -- "mi clave secreta"');
  process.exit(1);
}
const hash = createHash('sha256').update(clave, 'utf8').digest('hex');
console.log(`\nVITE_ADMIN_HASH=${hash}\n`);
console.log('Pégalo en .env.local (local) y en Netlify > Site configuration > Environment variables.');
