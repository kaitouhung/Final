import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { path } from 'src/constants/path';
import { unauthorize } from 'src/pages/Auth/auth.slice';

export default function Header() {
  const profile = useSelector((state) => state.auth.profile);

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(unauthorize());
    navigate(path.login);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          // onClick={() => {
          //   navigate(path.home);
          // }}
          // sx={{ cursor: 'pointer' }}
        >
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={path.home}
            sx={{
              mr: 2,
              display: { xs: 'none' },
              textDecoration: 'none',
              color: 'white',
              curson: 'pointer',
            }}
          >
            F-TEAM
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={path.home}
            sx={{
              flexGrow: 1,
              display: { xs: 'flex' },
              textDecoration: 'none',
              color: 'white',
              curson: 'pointer',
            }}
          >
            F-TEAM
          </Typography>
          {!profile?._id && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <MenuItem component={Link} to={path.register}>
                <Typography textAlign="center">Register</Typography>
              </MenuItem>
              <MenuItem component={Link} to={path.login}>
                <Typography textAlign="center">Login </Typography>
              </MenuItem>
            </Box>
          )}

          {profile?._id && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src={profile.avatar} />
                  <Typography
                    variant="h6"
                    component="h6"
                    sx={{ color: 'white', ml: 2 }}
                  >
                    {profile.fullName}
                  </Typography>
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem component={Link} to={path.users}>
                  <Typography textAlign="center">Upload Avatar </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
