import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "./services/supabase";
import { setUser, setLoading } from "./redux/slices/authSlice";

// importing all pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Market from "./pages/Market";
import Portfolio from "./pages/Portfolio";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-primary animate-pulse">
        Loading Application...
      </div>
    );

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("App mounted, setting up auth listener");
    dispatch(setLoading(true));

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    async function handleSession(session) {
      console.log("Auth state changed:", session?.user?.email || "No user");

      if (session?.user) {
        try {
          const { data: profile, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error && error.code !== "PGRST116") {
            console.error("Error fetching profile:", error);
          }

          dispatch(
            setUser({
              uid: session.user.id,
              email: session.user.email,
              displayName:
                profile?.username || session.user.user_metadata?.full_name,
              photoURL: profile?.avatar_url || "",
              mobile: profile?.mobile || "",
              ...profile,
            })
          );
        } catch (error) {
          console.error("Unexpected error fetching profile:", error);
          dispatch(
            setUser({
              uid: session.user.id,
              email: session.user.email,
            })
          );
        }
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    }

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <div className="antialiased text-text font-sans min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/market" element={<Market />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </div>
  );
}

export default App;
