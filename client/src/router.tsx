import { createBrowserRouter } from "react-router-dom"
import LoginPage from "./pages/login-page"
import ProjectPage from "./pages/project-page";
import ProjectsPage from "./pages/projects-page";
import AuthProvider from "./components/auth-provider";
import RegisterPage from "./pages/register-page";
import TestingPage from "./pages/testing-page";
import AnalysisPage from "./pages/analysis-page";
import RecommendationsPage from "./pages/recommendations-page";
import EngineInfoPage from "./pages/engine-info-page";
import HomePage from "./pages/home-page";

const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage/>
    },
    {
      path: "/login",
      element: <LoginPage/>
    },
    {
      path: "/registration",
      element: <RegisterPage/>
    },
    {
      path: "/project/:projectId",
      element: <AuthProvider><ProjectPage/></AuthProvider>
    },
    {
      path: "/testing/:projectId",
      element: <AuthProvider><TestingPage/></AuthProvider>
    },
    {
      path: "/analysis/:projectId",
      element: <AuthProvider><AnalysisPage/></AuthProvider>
    },
    {
      path: "/recommendations/:projectId",
      element: <AuthProvider><RecommendationsPage/></AuthProvider>
    },
    {
      path: "/projects",
      element: <AuthProvider><ProjectsPage/></AuthProvider>
    },
    {
      path: "/engines",
      element: <EngineInfoPage/>
    }
]);

export default router;