  import { Navigate } from 'react-router-dom';
  import GridLoader from "react-spinners/GridLoader";
  import useAuth from "../hooks/useAuth"; // lấy user từ token
  import { css } from '@emotion/react';

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const PrivateRoute = ({ children }) => {
      const { user, isLoading  } = useAuth();
    // console.log(user);

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <GridLoader color="#1d4ed8" css={override} size={25} />
        </div>
      );
    }

    return user?.displayName ? children : <Navigate to="/signin" replace />;
  };

  export default PrivateRoute;
