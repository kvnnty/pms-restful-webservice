import { Toaster } from "react-hot-toast";
import PageRoutes from "./routes";
import ReduxProvider from "./providers/ReduxProvider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
function Root() {
  return (
    <>
      <ReduxProvider>
        <QueryClientProvider client={queryClient}>
          <PageRoutes />
          <Toaster />
        </QueryClientProvider>
      </ReduxProvider>
    </>
  );
}

export default Root;
