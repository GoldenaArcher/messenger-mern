import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useRegisterUserMutation } from "../store/features/authApi";
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerUser, { isLoading, isSuccess, isError, error, data, reset }] =
    useRegisterUserMutation();

  const { authenticated } = useSelector((state) => state.auth);

  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });

  useEffect(() => {
    return () => {
      return reset();
    };
  }, [reset]);

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast.success(data.message);
      reset();
    } else if (!isLoading && isError) {
      error.data.errors.forEach((err) => toast.error(err));
      reset();
    }
  }, [
    isLoading,
    isSuccess,
    isError,
    data?.message,
    error?.data?.errors,
    dispatch,
    reset,
  ]);

  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  }, [authenticated]);

  const [loadImage, setLoadImage] = useState("");

  const inputHandler = (e) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fileHandler = (e) => {
    if (e.target.files.length !== 0) {
      setState((prev) => ({
        ...prev,
        [e.target.name]: e.target.files[0],
      }));

      const reader = new FileReader();
      reader.onload = () => {
        setLoadImage(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const registerHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(state).forEach(([key, val]) => {
      formData.append(key, val);
    });

    try {
      await registerUser(formData).unwrap();
    } catch (err) {
      console.error("Registration failed:", err);
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
            <form onSubmit={registerHandler} autoComplete="off">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="form-control"
                  placeholder="Username"
                  autoComplete="off"
                  onChange={inputHandler}
                  value={state.username}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  autoComplete="off"
                  onChange={inputHandler}
                  value={state.email}
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
                  onChange={inputHandler}
                  value={state.password}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="form-control"
                  autoComplete="off"
                  onChange={inputHandler}
                  value={state.confirmPassword}
                />
              </div>
              <div className="form-group">
                <div className="file-image">
                  <div className="image">
                    {loadImage && <img src={loadImage} alt="profile-img" />}
                  </div>
                  <div className="file">
                    <label htmlFor="image">Select Image</label>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      className="form-control"
                      onChange={fileHandler}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <input type="submit" value="Register" className="btn" />
              </div>

              <div className="form-group">
                <span>
                  <Link to="/messenger/login">Login Your Account</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
