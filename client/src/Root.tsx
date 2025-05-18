import { Toaster } from "react-hot-toast";
import PageRoutes from "./routes";
import ReduxProvider from "./providers/ReduxProvider";

function Root() {
  return (
    <>
      <ReduxProvider>
        <PageRoutes />
        <Toaster />
      </ReduxProvider>
    </>
  );
}

export default Root;
