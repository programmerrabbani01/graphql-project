import { createBrowserRouter } from "react-router-dom";
import publicRouter from "./publicRouter.jsx";
import privateRouter from "./privateRouter.jsx";
// create browser router

const router = createBrowserRouter([...publicRouter, ...privateRouter]);

// export router

export default router;
