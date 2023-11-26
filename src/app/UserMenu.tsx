import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import { useContext, useState } from "react";
import { signOutEndPoint } from "./backend";
import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { authContext } from "./authContext";

const useStyle = makeStyles({
  userDetails: {
    padding: "16px",
    borderBottom: "1px solid rgb(224, 224, 224)",
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      marginBottom: "8px",
      justifyContent: "center",
    },
  },
});

export function UserMenu() {
  const { user, onSignOut } = useContext(authContext);

  const classes = useStyle();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function signOut() {
    signOutEndPoint();
    onSignOut();
  }

  return (
    <div>
      <IconButton
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Avatar>
          <Icon>person</Icon>
        </Avatar>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Box className={classes.userDetails}>
          <Avatar>
            <Icon>person</Icon>
          </Avatar>
          <div>{user.name}</div>
          <small>{user.email}</small>
        </Box>
        <MenuItem
          onClick={signOut}
          style={{ display: "flex", justifyContent: "center" }}
        >
          Sair
        </MenuItem>
      </Menu>
    </div>
  );
}
