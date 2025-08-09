import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthStore from "@/store/AuthStore";
import Layout from "./components/Layout";
import Feed from "./pages/Feed";
import Dashboard from "./pages/Dashboard";
import Chatroom from "./pages/Chatroom";
import Profile from "./pages/Profile";
import Mood from "./pages/Mood";
import AuroraHero from "@/components/ui/AuroraHero";

function App() {
  const isAuthenticated = AuthStore((s) => s.isAuthenticated);
  const initialization = AuthStore((s) => s.initialization);
  const hasInitialized = AuthStore((s) => s.hasInitialized);

  useEffect(() => {
    initialization();
  }, []);

  if (!hasInitialized) return null;

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/feed" />
          ) : (
            <AuroraHero />
          )
        }
      />

      <Route element={<Layout />}>
        <Route path="/feed" element={<Feed />} />
        {isAuthenticated && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chatroom" element={<Chatroom />} />
            <Route path="/mood" element={<Mood />} />
            <Route path="/profile" element={<Profile />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;







