import React from "react";
import { Outlet, Link } from "react-router-dom";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
  Avatar
} from "@progress/kendo-react-layout";
import { Badge, BadgeContainer } from "@progress/kendo-react-indicators";
const kendokaAvatar =
  "https://www.telerik.com/kendo-react-ui-develop/images/kendoka-react.png";

export const Layout = () => {
  return (
    <>
      <AppBar>
        <AppBarSpacer
          style={{
            width: 4
          }}
        />

        <AppBarSection>
          <h1 className="title">KendoReact Demo</h1>
        </AppBarSection>

        <AppBarSpacer
          style={{
            width: 32
          }}
        />

        <AppBarSection>
          <Link to="/">Home</Link>
        </AppBarSection>
        <AppBarSpacer />

        <AppBarSection>
          <Link to="/rp-grid">RP Grid</Link>
        </AppBarSection>
        <AppBarSpacer />

        <AppBarSection>
          <Link to="/list-view">List View</Link>
        </AppBarSection>
        <AppBarSpacer />

        <AppBarSection className="actions">
          <button className="k-button k-button-clear">
            <BadgeContainer>
              <span className="k-icon k-i-bell" />
              <Badge
                shape="dot"
                themeColor="info"
                size="small"
                position="inside"
              />
            </BadgeContainer>
          </button>
        </AppBarSection>

        <AppBarSection>
          <span className="k-appbar-separator" />
        </AppBarSection>

        <AppBarSection>
          <Avatar shape="circle" type="image">
            <img src={kendokaAvatar} />
          </Avatar>
        </AppBarSection>
      </AppBar>
      <div className="outlet">
        <Outlet />
      </div>
    </>
  );
};
