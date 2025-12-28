import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { supabase } from "../services/supabase";
import { setUser, setError } from "../redux/slices/authSlice";
import Button from "../components/Button";
import Input from "../components/Input";
import { motion } from "framer-motion";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");
    console.log("1. Starting signup...");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!agreeToTerms) {
      setLocalError("You must agree to the terms and policies.");
      setLoading(false);
      return;
    }

    try {
      console.log("2. Checking username availability...");
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("username")
        .eq("username", username)
        .single();

      if (existingUser) {
        setLocalError("Username already taken.");
        setLoading(false);
        return;
      }

      console.log("3. Creating Supabase auth user with metadata...");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            mobile: mobile,
            agreed_to_terms: true,
          },
        },
      });

      if (authError) throw authError;

      const user = authData.user;
      if (!user) throw new Error("No user created");

      const fullUserData = {
        uid: user.id,
        email: email,
        displayName: username,
        photoURL: "",
        mobile: mobile,
        agreed_to_terms: true,
      };
      dispatch(setUser(fullUserData));

      console.log("5. Success! Waiting to navigate...");

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Signup Error:", error);
      setLocalError(error.message);
      dispatch(setError(error.message));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background animate-pulse-slow pointer-events-none"></div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="z-50 flex flex-col items-center justify-center text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-2xl font-bold text-primary animate-pulse">
            Creating Account...
          </h2>
          <p className="text-text-muted mt-2">Setting up your dashboard</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-primary/50 p-8 rounded-2xl w-full max-w-md shadow-[0_0_30px_rgba(255,95,31,0.3)] relative z-10"
        >
          <h2 className="text-3xl font-bold text-primary mb-2 text-center">
            Join Vortix
          </h2>
          <p className="text-text-muted text-center mb-8">
            Create your account to start tracking.
          </p>

          <form onSubmit={handleSignup} className="space-y-6">
            <Input
              label="Username"
              type="text"
              placeholder="crypto_king"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Mobile Number"
              type="tel"
              placeholder="+91 98765 43210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 text-primary bg-surface border-gray-600 rounded focus:ring-primary focus:ring-2"
              />
              <label
                htmlFor="terms"
                className="text-sm text-text-muted cursor-pointer select-none"
              >
                I agree to the{" "}
                <span className="text-primary hover:underline">Terms</span> and{" "}
                <span className="text-primary hover:underline">
                  Privacy Policy
                </span>
              </label>
            </div>

            {localError && (
              <p className="text-red-500 text-sm text-center">{localError}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link to="/" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Signup;
