#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const zodIndexPath = join(__dirname, '../src/generated/zod/index.ts');

try {
  let content = readFileSync(zodIndexPath, 'utf-8');

  // Remove the unused Prisma import line if it exists
  const prismaImportRegex =
    /^import type \{ Prisma \} from '@prisma\/client';\s*\n/gm;

  if (prismaImportRegex.test(content)) {
    content = content.replace(prismaImportRegex, '');
    writeFileSync(zodIndexPath, content, 'utf-8');
    console.log('✅ Removed unused Prisma import from generated zod file');
  } else {
    console.log(
      'ℹ️  No unused Prisma import found (already fixed or not present)'
    );
  }
} catch (error) {
  console.error('❌ Error fixing generated zod file:', error);
  process.exit(1);
}
