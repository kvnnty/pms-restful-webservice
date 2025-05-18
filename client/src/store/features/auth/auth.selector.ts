import { useSelector } from "react-redux";
import { type RootState } from "../..";
export const useAuth = () => {
  const accessToken = useSelector((state: RootState) => state.auth.token);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn) && !!accessToken;
  const currentUser = useSelector((state: RootState) => state.auth.user);

  return { isLoggedIn, currentUser, accessToken };
};
