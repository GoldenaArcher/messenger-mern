import { jwtDecode } from "jwt-decode";

export const decodeJwtToken = (token) => {
  const decodedToken = jwtDecode(token);
  const exp = new Date(decodedToken.exp * 1000);
  if (new Date() < exp) {
    return null;
  }

  return decodedToken;
};
