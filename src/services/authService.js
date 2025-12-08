import client, { storeToken, clearToken } from './client';

const normalizeUser = (data) => {
  if (!data) return null;
  return {
    id: data.id || data.user_id || data._id,
    email: data.email,
    firstName: data.first_name || data.firstName,
    lastName: data.last_name || data.lastName,
    tier: data.tier,
  };
};

export const loginUser = async (email, password) => {
  const response = await client.post('/auth/login', { email, password });
  const payload = response.data || {};
  const token =
    payload?.data?.session?.sessionToken ||
    payload?.data?.session?.session_token ||
    payload?.sessionToken ||
    payload?.session_token ||
    payload?.token;

  if (token) {
    storeToken(token);
  }

  return {
    success: payload.success !== false,
    token,
    user: normalizeUser(payload?.data?.user || payload.user),
    raw: payload,
  };
};

export const logoutUser = () => {
  clearToken();
};
