#!/usr/bin/env node

/**
 * Quick test runner for ChecklistItem component
 * This verifies the component and tests are properly structured
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runTests() {
  console.log('🧪 Running ChecklistItem tests...\n');

  try {
    const { stdout, stderr } = await execAsync(
      'npx vitest run client/src/components/dashboard/ChecklistItem.test.tsx --reporter=verbose',
      {
        maxBuffer: 1024 * 1024 * 10,
        timeout: 60000
      }
    );

    console.log(stdout);
    if (stderr) {
      console.error('Errors:', stderr);
    }

    console.log('\n✅ Tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test execution failed:');
    console.error(error.stdout || error.message);
    console.error(error.stderr || '');
    process.exit(1);
  }
}

runTests();
