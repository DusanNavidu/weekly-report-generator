import api from "./api";

export const askAIAssistantAPI = async (question: string) => {
  const response = await api.post('/chat', { question });
  return response.data.data.answer;
};