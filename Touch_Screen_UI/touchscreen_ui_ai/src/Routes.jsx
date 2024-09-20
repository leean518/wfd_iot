import React from "react";
import { useRoutes } from "react-router-dom";
import Home from "pages/Home";
import NotFound from "pages/NotFound";
import DashboardScreen from "pages/DashboardScreen";
import PrimaryIntakeScreen from "pages/PrimaryIntakeScreen";
import GritChamberScreen from "pages/GritChamberScreen";
import ChlorinationChamberScreen from "pages/ChlorinationChamberScreen";
import DechlorinationChamberScreen from "pages/DechlorinationScreen";
import QualityMonitoringScreen from "pages/QualityMonitoringScreen";
const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <Home /> },
    { path: "*", element: <NotFound /> },
    {
      path: "dashboardscreen",
      element: <DashboardScreen />,
    },
    {
      path: "primaryintakescreen",
      element: <PrimaryIntakeScreen />,
    },
    {
      path: "gritchamberscreen",
      element: <GritChamberScreen />,
    },
    {
      path: "chlorinationchamberscreen",
      element: <ChlorinationChamberScreen />,
    },
    {
      path: "dechlorinationchamberscreen",
      element: <DechlorinationChamberScreen />,
    },
    {
      path: "qualitymonitoringscreen",
      element: <QualityMonitoringScreen />,
    },
  ]);

  return element;
};

export default ProjectRoutes;
