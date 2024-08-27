import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./Routes/Routes";
import { Suspense } from "react";

function App() {
  return (
    <>
      <Suspense fallback="loading">
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

export default App;
