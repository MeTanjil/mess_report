import React, { useState } from "react";
import { useFirebaseAuth } from "../FirebaseAuthContext";

export default function SignInSignUp() {
  const { signup, signin, forgot } = useFirebaseAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

  // এখানে email যুক্ত করা হয়েছে
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  // সব ইনপুট রিসেটের ফাংশন
  const resetAll = () => {
    setEmail("");
    setPassword("");
    setSecurityQuestion("");
    setSecurityAnswer("");
    setNewPassword("");
    setMsg("");
  };

  // সাবমিট হ্যান্ডল
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isForgot) {
      if (!email || !securityAnswer || !newPassword) {
        setMsg("সব ঘর পূরণ করুন!");
        return;
      }
      const res = await forgot({ email, securityAnswer, newPassword });
      if (res?.success) {
        setMsg("পাসওয়ার্ড পরিবর্তন হয়েছে! এখন লগইন করুন।");
        setIsForgot(false);
        setPassword(""); setNewPassword(""); setSecurityAnswer("");
      } else {
        setMsg(res?.msg || "তথ্য মেলেনি!");
      }
      return;
    }
    if (isSignup) {
      if (!email || !password || !securityQuestion || !securityAnswer) {
        setMsg("সব ঘর পূরণ করুন!");
        return;
      }
      const res = await signup({ email, password, securityQuestion, securityAnswer });
      if (res?.success) {
        setMsg("রেজিস্ট্রেশন সফল! এখন লগইন করুন।");
        setIsSignup(false);
        setPassword(""); setSecurityAnswer(""); setSecurityQuestion("");
      } else {
        setMsg(res?.msg || "Signup failed!");
      }
    } else {
      if (!email || !password) {
        setMsg("সব ঘর পূরণ করুন!");
        return;
      }
      const ok = await signin({ email, password });
      if (ok?.success) {
        setMsg("");
      } else {
        setMsg(ok?.msg || "ভুল তথ্য!");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <form className="border rounded-4 p-4 shadow bg-white" style={{ minWidth: 340 }} onSubmit={handleSubmit}>
        <h4 className="mb-3 text-success fw-bold">
          {isForgot ? "Forgot Password" : isSignup ? "Sign Up" : "Sign In"}
        </h4>
        <input
          className="form-control mb-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {isForgot ? (
          <>
            <input
              className="form-control mb-2"
              placeholder="Security Answer"
              value={securityAnswer}
              onChange={e => setSecurityAnswer(e.target.value)}
            />
            <input
              className="form-control mb-3"
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </>
        ) : (
          <>
            <input
              className="form-control mb-2"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {isSignup && (
              <>
                <input
                  className="form-control mb-2"
                  placeholder="Security Question"
                  value={securityQuestion}
                  onChange={e => setSecurityQuestion(e.target.value)}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Security Answer"
                  value={securityAnswer}
                  onChange={e => setSecurityAnswer(e.target.value)}
                />
              </>
            )}
          </>
        )}
        {msg && <div className="text-danger mb-2">{msg}</div>}
        <button className="btn btn-success w-100 mb-2" type="submit">
          {isForgot ? "Reset Password" : isSignup ? "Sign Up" : "Sign In"}
        </button>
        {!isForgot && (
          <button
            type="button"
            className="btn btn-link w-100"
            onClick={() => {
              resetAll();
              setIsSignup((s) => !s);
              setIsForgot(false);
            }}>
            {isSignup ? "Already have an account? Log In" : "নতুন একাউন্ট? Sign Up"}
          </button>
        )}
        <button
          type="button"
          className="btn btn-link w-100"
          onClick={() => {
            resetAll();
            setIsForgot((f) => !f);
            setIsSignup(false);
          }}>
          {isForgot ? "Back to Log In" : "পাসওয়ার্ড ভুলে গেছেন?"}
        </button>
      </form>
    </div>
  );
}
