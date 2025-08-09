import AuthStore from "@/store/AuthStore";
import logo from "./logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ onSignInClick, isSignedOut = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = AuthStore((state) => state.isAuthenticated);
  const logout = AuthStore((state) => state.logout);

  return (
    <div className="w-full px-6 py-4">
      <nav className="flex justify-between items-center bg-transparent text-gray-100">
        {/* Logo + Title */}
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="logo for cyclewise"
            className="h-12 w-12 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <h1 className="text-xl font-bold">Cyclewise</h1>
        </div>

        {/* Nav Links */}
        <ul className="flex gap-6 text-l font-semibold">
          {isAuthenticated && !isSignedOut ? (
            <>
              <li>
                <Link to="/dashboard" className="hover:text-pink-300 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/chatroom" className="hover:text-red-700 transition">
                  Chatroom
                </Link>
              </li>
              <li>
                <Link to="/feed" className="hover:text-pink-300 transition">
                  Feed
                </Link>
              </li>
              <li>
                <Link to="/mood" className="hover:text-pink-300 transition">
                  Mood
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-pink-300 transition">
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    localStorage.removeItem("token");
                    navigate("/");
                  }}
                  className="hover:underline"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/feed"
                  className={`text-md transition-colors duration-200 ${
                    location.pathname === "/feed"
                      ? "text-rose-700 font-semibold"
                      : "hover:text-pink-300"
                  }`}
                >
                  Feed
                </Link>
              </li>
              <li>
                <button
                  onClick={onSignInClick}
                  className="hover:underline hover:text-white transition cursor-pointer"
                >
                  Sign In
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;

