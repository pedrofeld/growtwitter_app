import { RouterProvider } from "react-router-dom";
import { routes } from "./config/routes/routes";
import { AuthProvider } from "./config/context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  );
}

export default App;
