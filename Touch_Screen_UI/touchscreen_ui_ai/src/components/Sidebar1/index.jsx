import { Img } from "./..";
import React, { useRef, useEffect } from "react";
import { MenuItem, Menu, Sidebar, sidebarClasses } from "react-pro-sidebar";
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import WaterIcon from '@mui/icons-material/Water';
import ScienceIcon from '@mui/icons-material/Science';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import SettingsIcon from '@mui/icons-material/Settings';
import WashIcon from '@mui/icons-material/Wash';

export default function Sidebar1({ ...props }) {
  const [collapsed, setCollapsed] = React.useState(false);

  //use this function to collapse/expand the sidebar
  //function collapseSidebar() {
  //    setCollapsed(!collapsed)
  //}
  const menuItemRef = useRef(null);

  useEffect(() => {
    if (menuItemRef.current) {
      menuItemRef.current.style.color = "#2d60ff";
    }
  }, []);
  return (
    <Sidebar
      {...props}
      width="250px !important"
      collapsedWidth="80px !important"
      collapsed={collapsed}
      rootStyles={{ [`.${sidebarClasses.container}`]: { gap: 16 } }}
      className={`${props.className} flex flex-col h-screen mt-1 gap-4 top-0 sm:gap-4 !sticky overflow-auto`}
    >
      <Img src="images/img_sidebar_logo.png" alt="Sidebarlogo" className="h-[46px] w-[196px] object-contain" />
      <Menu
        menuItemStyles={{
          button: {
            padding: "22px",
            color: "#b1b1b1",
            fontWeight: 500,
            fontSize: "16px",
            gap: "18px",
            [`&:hover, &.ps-active`]: { color: "#2d60ff" },
          },
        }}
        rootStyles={{ ["&>ul"]: { gap: "0.21px" } }}
        className="flex w-full flex-col self-stretch"
      >
        <Link to="/dashboardscreen">
        <MenuItem id='main-page-nav' icon={<HomeIcon className="h-[20px] w-[20px]" />}>Dashboard</MenuItem>
        </Link>
        <Link to="/primaryintakescreen">
        <MenuItem id='primary-intake-nav' icon={<WaterIcon className="h-[20px] w-[20px]" />}>
          Primary Intake
        </MenuItem>
        </Link>
        <Link to="/gritchamberscreen">
        <MenuItem id='grit-chamber-nav' icon={<CoronavirusIcon className="h-[20px] w-[20px]" />}>
          Grit Chamber
        </MenuItem>
        </Link>
        <Link to="/chlorinationchamberscreen">
        <MenuItem id='chlorination-chamber-nav' icon={<ScienceIcon className="h-[20px] w-[20px]" />}>
          <>
            Chlorination <br />
            Chamber
          </>
        </MenuItem>
        </Link>
        <Link to="/dechlorinationchamberscreen">
        <MenuItem id='dechlorination-chamber-nav'
          icon={<WashIcon className="h-[20px] w-[20px]" />}
        >
          <>
            Dechlorination
            <br />
            Chamber
          </>
        </MenuItem>
        </Link>
        <Link to="/qualitymonitoringscreen">
        <MenuItem id='quality-monitoring-nav' icon={<LocalDrinkIcon className="h-[20px] w-[20px]" />}>
          Quality Monitoring
        </MenuItem>
        </Link>
        <Link to="/settingscreen">
        <MenuItem id='setting-nav' icon={<SettingsIcon className="h-[20px] w-[20px]" />}>
          Setting
        </MenuItem>
        </Link>
      </Menu>
    </Sidebar>
  );
}
