export const AI_CONFIG = {
  // Coze 知识库
  cozeApiKey: import.meta.env.VITE_COZE_API_KEY ?? '',
  cozeDatasetId: import.meta.env.VITE_COZE_DATASET_ID ?? '',
  cozeBaseUrl: import.meta.env.VITE_COZE_BASE_URL ?? 'https://api.coze.cn',

  // DeepSeek LLM
  deepseekApiKey: import.meta.env.VITE_DEEPSEEK_API_KEY ?? '',
  deepseekBaseUrl: import.meta.env.VITE_DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com/v1',
  llmModel: import.meta.env.VITE_LLM_MODEL ?? 'deepseek-chat',
}
