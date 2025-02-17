import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div>
      <div className="register">
        <div className="card">
          <div className="card-header">
            <h3>Register</h3>
          </div>

          <div className="card-body">
            <form action="" autoComplete="off">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  autoComplete="off"
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
