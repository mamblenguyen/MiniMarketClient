import useAuth from './useAuth';
import useUser from './useUser';

const useCurrentUser = () => {
  const auth = useAuth();      // dùng cho Google
  const user = useUser();      // dùng cho basic

  // Nếu người dùng đăng nhập bằng Google thì auth.user.displayName sẽ tồn tại
  if (auth.user?.displayName) {
    return {
      user: auth.user,
      isLoading: auth.isLoading,
    };
  }

  // Nếu không có auth nhưng có user từ JWT => đăng nhập basic
  if (user) {
    return {
      user,
      isLoading: false,
    };
  }

  // Nếu không có gì
  return {
    user: null,
    isLoading: auth.isLoading,
  };
};

export default useCurrentUser;
