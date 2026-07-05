#!/usr/bin/env node

/**
 * Provider Integration Verification Script
 * 
 * Verifies that PlanProvider and PlanTokenProvider are correctly integrated
 * into the application root.
 * 
 * Checks:
 * 1. File existence
 * 2. Import statements
 * 3. Provider nesting order
 * 4. Context exports
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

console.log('🔍 Provider Integration Verification\n');

// Colors
const green = (text) => `\x1b[32m${text}\x1b[0m`;
const red = (text) => `\x1b[31m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;
const blue = (text) => `\x1b[34m${text}\x1b[0m`;

let passed = 0;
let failed = 0;

function checkFile(filePath, checks) {
  console.log(`\n${blue('📄')} Checking: ${filePath}\n`);
  
  try {
    const content = readFileSync(resolve(rootDir, filePath), 'utf-8');
    
    for (const check of checks) {
      const { name, pattern, required = true } = check;
      const found = pattern instanceof RegExp 
        ? pattern.test(content) 
        : content.includes(pattern);
      
      if (found) {
        console.log(`  ${green('✓')} ${name}`);
        passed++;
      } else {
        if (required) {
          console.log(`  ${red('✗')} ${name}`);
          failed++;
        } else {
          console.log(`  ${yellow('⚠')} ${name} (optional)`);
        }
      }
    }
  } catch (error) {
    console.log(`  ${red('✗')} File not found or unreadable`);
    failed++;
  }
}

// Check App.tsx
checkFile('client/src/App.tsx', [
  {
    name: 'Imports PlanProvider',
    pattern: /import.*PlanProvider.*from.*@\/components\/PlanProvider/
  },
  {
    name: 'Imports PlanTokenProvider',
    pattern: /import.*PlanTokenProvider.*from.*@\/components\/PlanTokenProvider/
  },
  {
    name: 'Imports AuthProvider',
    pattern: /import.*AuthProvider.*from.*@\/contexts\/AuthContext/
  },
  {
    name: 'PlanProvider wraps app',
    pattern: /<PlanProvider>/
  },
  {
    name: 'PlanTokenProvider wraps app',
    pattern: /<PlanTokenProvider>/
  },
  {
    name: 'Correct nesting: AuthProvider > PlanProvider',
    pattern: /<AuthProvider>[\s\S]*<PlanProvider>/
  },
  {
    name: 'Correct nesting: PlanProvider > PlanTokenProvider',
    pattern: /<PlanProvider>[\s\S]*<PlanTokenProvider>/
  },
  {
    name: 'Router is wrapped by providers',
    pattern: /<PlanTokenProvider>[\s\S]*<Router/
  }
]);

// Check PlanProvider.tsx
checkFile('client/src/components/PlanProvider.tsx', [
  {
    name: 'Exports PlanProvider component',
    pattern: /export function PlanProvider/
  },
  {
    name: 'Imports PlanContext',
    pattern: /import.*PlanContext.*from.*@\/contexts\/PlanContext/
  },
  {
    name: 'Imports useAuth',
    pattern: /import.*useAuth.*from.*@\/contexts\/AuthContext/
  },
  {
    name: 'Uses resolvePlanMode',
    pattern: /resolvePlanMode/
  },
  {
    name: 'Provides PlanContext',
    pattern: /<PlanContext\.Provider/
  },
  {
    name: 'Has plan metadata map',
    pattern: /PLAN_METADATA_MAP/
  }
]);

// Check PlanTokenProvider.tsx
checkFile('client/src/components/PlanTokenProvider.tsx', [
  {
    name: 'Exports PlanTokenProvider component',
    pattern: /export function PlanTokenProvider/
  },
  {
    name: 'Imports usePlanContext',
    pattern: /import.*usePlanContext.*from.*@\/contexts\/PlanContext/
  },
  {
    name: 'Sets data-plan attribute',
    pattern: /document\.documentElement\.setAttribute\(['"]data-plan['"]/
  },
  {
    name: 'Dynamically imports CSS tokens',
    pattern: /import\(['"]@\/design-system\/plan-tokens/
  },
  {
    name: 'Uses useEffect for injection',
    pattern: /useEffect/
  }
]);

// Check PlanContext.tsx
checkFile('client/src/contexts/PlanContext.tsx', [
  {
    name: 'Exports PlanContext',
    pattern: /export const PlanContext/
  },
  {
    name: 'Exports usePlanContext hook',
    pattern: /export function usePlanContext/
  },
  {
    name: 'Has PlanContextValue interface',
    pattern: /interface PlanContextValue/
  },
  {
    name: 'Throws error if used outside provider',
    pattern: /throw new Error[\s\S]*usePlanContext must be used within/
  }
]);

// Check integration test
checkFile('client/src/components/__tests__/PlanProvider.integration.test.tsx', [
  {
    name: 'Integration test exists',
    pattern: /describe.*PlanProvider.*PlanTokenProvider.*Integration/
  },
  {
    name: 'Tests provider rendering',
    pattern: /it.*should render without errors/
  },
  {
    name: 'Tests plan context provision',
    pattern: /should provide plan context/
  },
  {
    name: 'Tests data-plan attribute',
    pattern: /should inject data-plan attribute/
  },
  {
    name: 'Tests provider nesting',
    pattern: /should work with correct provider order/
  }
]);

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n${blue('📊')} Verification Summary:\n`);
console.log(`  ${green('✓')} Passed: ${passed}`);
console.log(`  ${red('✗')} Failed: ${failed}`);
console.log(`  ${yellow('→')} Total: ${passed + failed}\n`);

if (failed === 0) {
  console.log(green('✅ All checks passed! Provider integration is correct.\n'));
  process.exit(0);
} else {
  console.log(red(`❌ ${failed} check(s) failed. Please review the integration.\n`));
  process.exit(1);
}
