import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import AuthProvider from "./contexts/AuthProvider";
import OrderProvider from "./contexts/OrderProvider";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import ContactScreen from "./screens/ContactScreen";
import ErrorScreen from "./screens/ErrorScreen";
import HomeScreen from "./screens/HomeScreen";
import OrderScreen from "./screens/OrderScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import ProductsScreen from "./screens/ProductsScreen";
import ServicesDetailScreen from "./screens/ServicesDetailScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import UserInfo from "./screens/userInfo";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OrderProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/contact" element={<ContactScreen />} />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignUpScreen />
                </PublicRoute>
              }
            />
            <Route
              path="/signin"
              element={
                <PublicRoute>
                  <SignInScreen />
                </PublicRoute>
              }
            />
            <Route
              path="/services/:slug"
              element={
                <PublicRoute>
                  <ServicesDetailScreen />
                </PublicRoute>
              }
            />
            <Route path="/products" element={<ProductsScreen />} />
            <Route
              path="/products/:slug"
              element={
                <PrivateRoute>
                  <ProductDetailScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <OrderScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/UserInfo"
              element={
                <PrivateRoute>
                  <UserInfo />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<ErrorScreen />} />
          </Routes>
          <Footer />
        </OrderProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
