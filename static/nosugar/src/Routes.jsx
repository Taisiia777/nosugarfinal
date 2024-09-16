import React from "react";
import { useRoutes } from "react-router-dom";
import Home from "pages/Home";
import RequireAuth from "pages/RequireAuth/RequireAuth";
import NotFound from "pages/NotFound";
import IPhone1415Pro9 from "pages/IPhone1415Pro9";
import IPhone1415Pro8 from "pages/IPhone1415Pro8";
import IPhone1415Pro1 from "pages/IPhone1415Pro1";
import IPhone1415Pro7 from "pages/IPhone1415Pro7";
import IPhone1415Pro2 from "pages/IPhone1415Pro2";
import IPhone1415Pro3 from "pages/IPhone1415Pro3";
import IPhone1415Pro4 from "pages/IPhone1415Pro4";
import IPhone1415Pro11 from "pages/IPhone1415Pro11";
import IPhone1415Pro12 from "pages/IPhone1415Pro12";
import IPhone1415Pro13 from "pages/IPhone1415Pro13";
import IPhone1415Pro10 from "pages/IPhone1415Pro10";
import LoyaltyCardPage from "pages/LoyaltyCardPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/auth", element: <RequireAuth /> },
    { path: "/", element: <Home /> },
    { path: "*", element: <NotFound /> },
    { path: "iphone1415pro9", element: <IPhone1415Pro9 /> },
    { path: "iphone1415pro8", element: <IPhone1415Pro8 /> },
    { path: "iphone1415pro1", element: <IPhone1415Pro1 /> },
    { path: "iphone1415pro7", element: <IPhone1415Pro7 /> },
    { path: "iphone1415pro2", element: <IPhone1415Pro2 /> },
    { path: "iphone1415pro3", element: <IPhone1415Pro3 /> },
    { path: "iphone1415pro4", element: <IPhone1415Pro4 /> },
    { path: "iphone1415pro11", element: <IPhone1415Pro11 /> },
    { path: "iphone1415pro12", element: <IPhone1415Pro12 /> },
    { path: "iphone1415pro13", element: <IPhone1415Pro13 /> },
    { path: "iphone1415pro10", element: <IPhone1415Pro10 /> },
    { path: "loyaltyCardPage", element: <LoyaltyCardPage /> },

  ]);

  return element;
};

export default ProjectRoutes;
