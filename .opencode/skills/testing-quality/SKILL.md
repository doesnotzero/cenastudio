---
name: testing-quality
description: "Use when the user requests test implementation, Vitest configuration, unit tests, component tests, API integration tests, or quality assurance improvements. Front-loaded keywords: test, teste, vitest, jest, coverage, cobertura, unitario, integracao, component, mock, spec, quality, qualidade."
---

# Skill: testing-quality

Use this skill when implementing or improving tests on the FRAME.AI Director.

## Test Setup
- Vitest (já instalado) — npm run test ou npx vitest
- Coverage com @vitest/coverage-v8
- Criar vitest.config.ts na raiz se não existir

## Unit Tests
- Onde: funções puras, utilitários, schemas Zod, validações
- Padrão: *.test.ts co-localizado com o arquivo testado
- Estrutura: describe → it → expect (máx 3 níveis)
- Nomeclatura: it('deve retornar X quando Y') em português

## Component Tests
- @testing-library/react + @testing-library/jest-dom
- Testar comportamento visível, não implementação interna
- Mock context providers com renderWithProviders wrapper

## API Integration Tests
- supertest para rotas Express com SQLite em memória (:memory:)
- Auth helper para criar cookie JWT
- Caminhos críticos: auth, CRUD projetos, geração IA, admin

## Coverage Goals
- Mínimo 70% geral
- Alvo: 80%+ utilitários/schemas, 60%+ controllers, 50%+ componentes
- Caminhos críticos (auth, IA, admin) com 90%+

## Mocking
- db mock: vi.mock('../models/db.js')
- AI APIs: vi.mock('../services/aiService.js')
- Dates: vi.useFakeTimers()

## Best Practices
- AAA Pattern: Arrange → Act → Assert
- Um conceito por test (it)
- Testes isolados — sem estado compartilhado
- afterEach para cleanup
- Nenhuma lógica condicional nos testes
