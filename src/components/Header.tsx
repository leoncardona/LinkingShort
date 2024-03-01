import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Header = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true); // Estado para controlar el esqueleto

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      fetch("/api/session", {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setIsLoggedIn(data.userId ? true : false);
          setUserName(data.username || "");
          setLoading(false); // Cambiar el estado de carga a false una vez completada
        });
    } else {
      setIsLoggedIn(false);
      setLoading(false); // También cambiar a false si no hay token
    }
  }, [cookies.token]);

  const handleLogout = () => {
    removeCookie("token", { path: "/" });
  };

  return (
    <header className="flex items-center justify-between bg-transparent px-64 py-4 backdrop-blur-3xl">
      <h1 className="font-jakarta text-2xl font-bold transition-all duration-700">
        Linking<span className="text-lsblue">Short</span>
      </h1>
      {loading ? (
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
          <nav className="flex items-center gap-8">
            <Skeleton width={100} height={20} />
            <Skeleton width={50} height={20} />
          </nav>
        </SkeletonTheme>
      ) : isLoggedIn ? (
        <nav className="flex items-center gap-8">
          <span className="font-semibold">{userName}</span>
          <button onClick={handleLogout}>
            {/* Aquí va tu SVG de logout */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="color icon icon-tabler icon-tabler-logout opacity-80 hover:scale-105 hover:opacity-100 hover:stroke-red-500"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#ffffff"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
              <path d="M9 12h12l-3 -3" />
              <path d="M18 15l3 -3" />
            </svg>
          </button>
        </nav>
      ) : (
        <nav className="flex items-center gap-4">
          <a
            href="/signup"
            id="submitLinkButton"
            className="rounded-full bg-lsdarkblue px-6 py-2 font-medium text-white transition-all duration-200 hover:scale-105"
          >
            Signup
          </a>
          <a
            href="/login"
            id="submitLinkButton"
            className="rounded-full border border-lsdarkblue px-6 py-2 font-medium text-white transition-all duration-200 hover:scale-105"
          >
            Login
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
