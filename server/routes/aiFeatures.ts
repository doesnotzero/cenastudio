import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  scriptSuggestions,
  budgetAnalysis,
  generateProposalEndpoint,
  summarizeInteractionEndpoint,
  analyzeSentimentEndpoint,
  chatbotEndpoint,
} from '../controllers/aiController';

const router = Router();

// Todas rotas requerem autenticação
router.use(requireAuth);

// POST /api/ai-features/script-suggestions
router.post('/script-suggestions', scriptSuggestions);

// POST /api/ai-features/budget-analysis
router.post('/budget-analysis', budgetAnalysis);

// POST /api/ai-features/generate-proposal
router.post('/generate-proposal', generateProposalEndpoint);

// POST /api/ai-features/summarize-interaction
router.post('/summarize-interaction', summarizeInteractionEndpoint);

// POST /api/ai-features/analyze-sentiment
router.post('/analyze-sentiment', analyzeSentimentEndpoint);

// POST /api/ai-features/chatbot
router.post('/chatbot', chatbotEndpoint);

export default router;
