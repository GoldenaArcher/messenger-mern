import { jwtDecode } from "jwt-decode";

export const decodeJwtToken = (token) => {
  const decodedToken = jwtDecode(token);
  const exp = new Date(decodedToken.exp * 1000);
  if (new Date() > exp) {
    return null;
  }

  return decodedToken;
};

export const rehydrateJwtToken = () => {
  try {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) return;

    const decoded = decodeJwtToken(authToken);

    if (decoded) {
      return {
        authenticated: true,
        token: authToken,
        userInfo: decoded,
      };
    }
  } catch (e) {
    console.error(e);
  }
};
