import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import NotificationListener from "./components/NotificationListener";

function App() {
  return (
    <BrowserRouter>
      <NotificationListener />
      <AppRoutes />
      <Toaster position="top-right" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;