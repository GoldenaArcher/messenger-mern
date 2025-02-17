import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRegisterUserMutation } from "../store/features/authApi";

const Register = () => {
  const [
    registerUser,
    // { isLoading, isSuccess, isError, error }
  ] = useRegisterUserMutation();

  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });

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
      alert("Registration successful!");
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
