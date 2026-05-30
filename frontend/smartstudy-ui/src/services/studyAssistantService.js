import { authAxios } from "./authService";

export const askAllPdfs = async (question) => {
  const res = await authAxios.post(
    "/upload/ask-all",
    { question }
  );

  return res.data;
};

export const continueChat = async (
  conversationId,
  question
) => {

  const res =
    await authAxios.post(
      "/upload/chat",
      {
        conversationId,
        question
      }
    );

  return res.data;
};

export const getConversations =
  async () => {

    const res =
      await authAxios.get(
        "/upload/conversations"
      );

    return res.data;
  };

export const getConversation =
  async (id) => {

    const res =
      await authAxios.get(
        `/upload/conversation/${id}`
      );

    return res.data;
  };

export const deleteConversation =
  async (id) => {

    const res =
      await authAxios.delete(
        `/upload/conversation/${id}`
      );

    return res.data;
  };