import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import initializeAuthentication from "../config/firebase";
import { jwtDecode } from "jwt-decode";
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

initializeAuthentication();

const useFirebase = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Lắng nghe Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      if (loggedUser) {
        setUser(loggedUser);
        setIsLoading(false);
      } else {
        // Nếu không có user Firebase, thử lấy token từ localStorage
        const token = localStorage.getItem("accessToken");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            setUser({
              id: decoded.id,
              displayName: decoded.name,
              email: decoded.email,
              role: decoded.role,
              picture: decoded.avatar || decoded.picture,
            });
          } catch (error) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const { email, displayName, photoURL } = result.user;

      const googleUser = {
        email: email,
        fullname: displayName,
        avatar: photoURL,
      };
      const response = await fetch(`${baseUrl}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(googleUser),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký Google thất bại");
      }

      const jwtToken = data.data.token; // Token JWT server trả về
      localStorage.setItem("accessToken", jwtToken);
      const decoded = jwtDecode(jwtToken);
      console.log(decoded);

      setUser({
        id: decoded.id,
        displayName: decoded.name,
        email: decoded.email,
        role: decoded.role,
        picture: decoded.avatar,
      });
      swal({
        title: "Xin chúc mừng",
        text: "Bạn đã đăng nhập thành công",
        icon: "success",
        buttons: {
          confirm: "OK",
        },
      }).then((willDelete) => {
        if (willDelete) {
          window.location.href = "/";
        }
      });
    } catch (err) {
      console.error(err);
      swal("Oops!", err.message || "Đã xảy ra lỗi", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const signOutUser = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser({});
      swal("Đăng xuất", "Bạn đã đăng xuất thành công", "success");
      navigate("/signin");
    } catch (err) {
      swal("Oops!", err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    signInWithGoogle,
    signOutUser,
  };
};

export default useFirebase;
