// useUser.js
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id,
          displayName: decoded.name,
          email: decoded.email,
          role: decoded.role,
          slug: decoded.slug,
          picture: decoded.picture,
        });
      } catch (error) {
        console.warn("Invalid JWT token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  return user;
};

export default useUser;
