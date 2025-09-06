import api from './axios';

export const questionService = {
  getQuestions: async (searchQuery = '') => {
    const { data } = await api.get(
      searchQuery
        ? `/questions?search=${encodeURIComponent(searchQuery)}`
        : '/questions'
    );
    return data;
  },

  searchQuestions: async (searchQuery) => {
    const { data } = await api.get(
      `/questions?search=${encodeURIComponent(searchQuery)}`
    );
    return data;
  },

  getQuestionById: async (questionId) => {
    const { data } = await api.get(`/questions/${questionId}`);
    return data;
  },

  createQuestion: async (questionData) => {
    const { data } = await api.post('/questions', questionData);
    return data;
  },

  updateQuestion: async (questionId, questionData) => {
    const { data } = await api.put(`/questions/${questionId}`, questionData);
    return data;
  },

  deleteQuestion: async (questionId) => {
    const { data } = await api.delete(`/questions/${questionId}`);
    return data;
  },

  voteQuestion: async (questionId, voteType) => {
    const { data } = await api.put(`/questions/${questionId}/vote`, {
      voteType,
    });
    return data;
  },

  getAnswersForQuestion: async (questionId) => {
    const { data } = await api.get(`/questions/${questionId}/answers`);
    return data;
  },

  createAnswer: async (questionId, answerData) => {
    const { data } = await api.post(
      `/questions/${questionId}/answers`,
      answerData
    );
    return data;
  },
};
