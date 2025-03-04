import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useAuthRedirect = (redirectTo = "/") => {
  const navigate = useNavigate();

  const { authenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (authenticated) {
      navigate(redirectTo);
    }
  }, [authenticated, navigate, redirectTo]);
};

export default useAuthRedirect;
