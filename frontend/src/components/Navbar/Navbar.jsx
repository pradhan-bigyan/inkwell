import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({ userInfo }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const showAuthElements = () => {
    const authRoutes = ["/notes", "/search-notes"];
    const token = localStorage.getItem("token");

    return (
      token && authRoutes.some((route) => location.pathname.startsWith(route))
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2
        className="italic text-xl font-medium text-black py-2 cursor-pointer hover:text-blue-600 transition"
        onClick={() => navigate("/")}
      >
        Inkwell
      </h2>

      {showAuthElements() && (
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
      )}

      {/* Show ProfileInfo only on auth routes */}
      {showAuthElements() && userInfo ? (
        <ProfileInfo userInfo={userInfo} onLogout={handleLogout} />
      ) : (
        // Show nothing on auth pages, login button elsewhere
        !["/login", "/signup", "/"].includes(location.pathname) && (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        )
      )}
    </div>
  );
};

export default Navbar;
