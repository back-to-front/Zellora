import api from './axios';

export const answerService = {
  getAnswerById: async (answerId) => {
    const { data } = await api.get(`/answers/${answerId}`);
    return data;
  },

  updateAnswer: async (answerId, answerData) => {
    const { data } = await api.put(`/answers/${answerId}`, answerData);
    return data;
  },

  deleteAnswer: async (answerId) => {
    const { data } = await api.delete(`/answers/${answerId}`);
    return data;
  },

  acceptAnswer: async (answerId) => {
    const { data } = await api.put(`/answers/${answerId}/accept`);
    return data;
  },

  voteAnswer: async (answerId, voteType) => {
    const { data } = await api.put(`/answers/${answerId}/vote`, { voteType });
    return data;
  },
};
