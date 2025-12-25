import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({
  userInfo,
  onSearchNote,
  searchQuery = "",
  onClearSearch,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const navigate = useNavigate();
  const location = useLocation();

  // Sync with parent's searchQuery
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const showAuthElements = () => {
    const authRoutes = ["/notes", "/"];
    const token = localStorage.getItem("token");

    return (
      token &&
      authRoutes.some(
        (route) =>
          location.pathname === route ||
          location.pathname.startsWith(route + "/")
      )
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (localSearchQuery.trim()) {
      onSearchNote(localSearchQuery.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setLocalSearchQuery("");
    if (onClearSearch) {
      onClearSearch();
    }
  };

  return (
    <div className="bg-[#252525] flex items-center justify-between px-6 py-3 drop-shadow">
      <h2
        className="italic text-xl font-medium text-[#ffda03] py-2 cursor-pointer hover:text-[#ffe135] transition"
        onClick={() => navigate("/notes")}
      >
        Inkwell
      </h2>

      {showAuthElements() && (
        <SearchBar
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          handleSearch={handleSearch}
          onClearSearch={handleClear}
          onKeyDown={handleKeyDown}
        />
      )}

      {showAuthElements() && userInfo ? (
        <ProfileInfo userInfo={userInfo} onLogout={handleLogout} />
      ) : (
        !["/login", "/signup", "/"].includes(location.pathname) && (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-secondary transition"
          >
            Login
          </button>
        )
      )}
    </div>
  );
};

export default Navbar;
