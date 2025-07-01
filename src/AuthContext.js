import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // ইউজার লিস্ট লোড
  const getUserList = () =>
    JSON.parse(localStorage.getItem("mess-user-list")) || [];

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("mess-user")) || null
  );

  useEffect(() => {
    localStorage.setItem("mess-user", JSON.stringify(user));
  }, [user]);

  // Sign Up
  const signup = ({ username, password, securityQuestion, securityAnswer }) => {
    const users = getUserList();
    if (users.some(u => u.username === username)) {
      return { success: false, msg: "এই ইউজারনেম ইতোমধ্যে আছে!" };
    }
    const newUser = { username, password, securityQuestion, securityAnswer };
    users.push(newUser);
    localStorage.setItem("mess-user-list", JSON.stringify(users));
    setUser({ username });
    return { success: true };
  };

  // Sign In
  const signin = ({ username, password }) => {
    const users = getUserList();
    const found = users.find(
      u => u.username === username && u.password === password
    );
    if (found) {
      setUser({ username });
      return true;
    }
    return false;
  };

  // Sign Out
  const signout = () => setUser(null);

  // Forgot password
  const forgot = ({ username, securityAnswer, newPassword }) => {
    const users = getUserList();
    const idx = users.findIndex(
      u =>
        u.username === username &&
        u.securityAnswer &&
        u.securityAnswer.toLowerCase() === securityAnswer.toLowerCase()
    );
    if (idx !== -1) {
      users[idx].password = newPassword;
      localStorage.setItem("mess-user-list", JSON.stringify(users));
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, signup, signin, signout, forgot }}>
      {children}
    </AuthContext.Provider>
  );
}
