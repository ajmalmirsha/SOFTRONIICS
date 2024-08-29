import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./Routes/Routes";
import { Suspense } from "react";
import ContextProvider from "./Context/ContextProvider";

function App() {
  return (
    <>
      <Suspense fallback="loading">
        <ContextProvider>
          <RouterProvider router={router} />
        </ContextProvider>
      </Suspense>
    </>
  );
}

export default App;
