import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { useLoginUserMutation } from "../../store/features/authApi";
import useAuthRedirect from "../../hooks/useAuthRedirect";

const Login = () => {
  const dispatch = useDispatch();

  const [loginUser, { isLoading, isSuccess, isError, error, data, reset }] =
    useLoginUserMutation();

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  useAuthRedirect();

  useEffect(() => {
    return reset();
  }, [reset]);

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast.success(data.message);
      reset();
    } else if (!isLoading && isError) {
      toast.error(error.data.message);
      reset();
    }
  }, [
    isLoading,
    isSuccess,
    isError,
    data?.message,
    error?.data?.message,
    dispatch,
    reset,
  ]);

  const inputHandler = (e) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      await loginUser(state).unwrap();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div>
      <div className="register">
        <div className="card">
          <div className="card-header">
            <h3>Register</h3>
          </div>

          <div className="card-body">
            <form onSubmit={login} autoComplete="off">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  autoComplete="off"
                  value={state.email}
                  onChange={inputHandler}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="form-control"
                  autoComplete="off"
                  value={state.password}
                  onChange={inputHandler}
                />
              </div>

              <div className="form-group">
                <input type="submit" value="Login" className="btn" />
              </div>

              <div className="form-group">
                <span>
                  <Link to="/messenger/register">Don't have any account?</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
