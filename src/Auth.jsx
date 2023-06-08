import React, { useContext, useState } from "react";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { signup, login, resetPassword, error } = useContext(AuthContext);
  const [resetEmail, setResetEmail] = useState("");

  const handleAuth = (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      // Basic validation to check if inputs are empty
      alert("Please fill in all fields");
    } else {
      if (isLogin) {
        login(email, password);
      } else {
        signup(email, password);
      }
    }
  };

  const handlePasswordReset = async () => {
    try {
      await resetPassword(resetEmail);
      alert("Check your inbox for further instructions");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">{isLogin ? "Login" : "Signup"}</button>
      </form>
      {error && <p>{error}</p>}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need to create an account?" : "Already have an account?"}
      </button>
      {isLogin && (
        <div>
          <input
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="Reset Password"
          />
          <button onClick={handlePasswordReset}>Reset Password</button>
        </div>
      )}
    </div>
  );
}

export default Auth;
