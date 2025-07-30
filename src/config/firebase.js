import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCHgE-kuPMKNppwjdnigYgArKigSMy9W_Q",
  authDomain: "mini-market-a2cb8.firebaseapp.com",
  projectId: "mini-market-a2cb8",
  storageBucket: "mini-market-a2cb8.appspot.com",
  messagingSenderId: "240910693011",
  appId: "1:240910693011:web:0a1f6d89287fcf42e85366",
  measurementId: "G-ZZ7XK3GBWK",
};

// ✅ Khởi tạo app
const app = initializeApp(firebaseConfig);

// ✅ Khởi tạo Firestore
const db = getFirestore(app);

// ✅ (Tuỳ chọn) Khởi tạo auth nếu bạn cần
const auth = getAuth(app);

// ✅ Export default cho initializeAuthentication
const initializeAuthentication = () => app;
export default initializeAuthentication;

// ✅ Export thêm db và auth nếu cần
export { db, auth };
