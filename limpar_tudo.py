#!/usr/bin/env python3
import os
import shutil
from pathlib import Path

print("🧹 LIMPEZA TOTAL - CENASTUDIO")
print("=" * 50)

# Arquivos a MANTER
KEEP_FILES = {
    'README.md',
    'CHANGELOG.md',
    'LICENSE',
    'CONTRIBUTING.md',
    'ARCHITECTURE.md',
    'API_GUIDE.md',
    'DEPLOYMENT.md',
    'SECURITY.md',
    'SETUP_NOVA_CONTA.md',
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'tsconfig.node.json',
    'vite.config.ts',
    'vitest.config.ts',
    'playwright.config.ts',
    'vercel.json',
    'components.json',
    'opencode.json',
    '.gitignore',
    '.npmrc',
    '.prettierrc',
    '.prettierignore',
}

# Contar arquivos removidos
removed_count = 0

# Remover documentação antiga
for file in Path('.').glob('*.md'):
    if file.name not in KEEP_FILES:
        file.unlink()
        print(f"❌ {file.name}")
        removed_count += 1

for file in Path('.').glob('*.txt'):
    if file.name not in KEEP_FILES:
        file.unlink()
        print(f"❌ {file.name}")
        removed_count += 1

for file in Path('.').glob('*.sh'):
    if file.name not in KEEP_FILES:
        file.unlink()
        print(f"❌ {file.name}")
        removed_count += 1

# Remover credenciais antigas
env_files = ['.env', '.env.local', '.env.production.local', '.env.vercel', '.env.vercel.production.template']
for env_file in env_files:
    if Path(env_file).exists():
        Path(env_file).unlink()
        print(f"🔥 {env_file}")
        removed_count += 1

# Remover pastas de deploy
folders_to_remove = ['.vercel', 'dist', 'build', 'coverage', 'test-results', 'playwright-report']
for folder in folders_to_remove:
    if Path(folder).exists():
        shutil.rmtree(folder)
        print(f"🔥 {folder}/")
        removed_count += 1

# Criar .env limpo
if Path('.env.example').exists():
    shutil.copy('.env.example', '.env')
    print("✅ .env limpo criado")

print()
print("✨ LIMPEZA CONCLU

ÍDA!")
print(f"📊 Arquivos removidos: {removed_count}")
print()
print("📋 PRÓXIMOS PASSOS:")
print("1. cd .. && mv frameai-director-correto cenastudio")
print("2. Seguir SETUP_NOVA_CONTA.md")
print()
