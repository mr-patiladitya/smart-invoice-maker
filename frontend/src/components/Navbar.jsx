// src/components/Navbar.jsx
import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link, useNavigate } from 'react-router-dom';
import { ColorModeContext } from '../ThemeContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { toggleColorMode, mode } = useContext(ColorModeContext);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('userEmail');

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Clients', path: '/clients' },
    { label: 'Invoices', path: '/invoices' },
    { label: 'Create Invoice', path: '/create-invoice' }
  ];

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out:', err);
    }
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isLoggedIn && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleDrawer(true)}
              sx={{ display: { xs: 'block', md: 'none' }, mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Smart Invoice Maker
            </Link>
          </Typography>

          {isLoggedIn && (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  color="inherit"
                  component={Link}
                  to={link.path}
                >
                  {link.label}
                </Button>
              ))}
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ fontWeight: 'bold', ml: 2 }}
              >
                Log Out
              </Button>
            </Box>
          )}

          <IconButton color="inherit" onClick={toggleColorMode}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} onClick={toggleDrawer(false)}>
          <List>
            {isLoggedIn &&
              navLinks.map((link) => (
                <ListItem
                  button
                  key={link.path}
                  component={Link}
                  to={link.path}
                >
                  <ListItemText primary={link.label} />
                </ListItem>
              ))}
            {isLoggedIn && (
              <>
                <Divider />
                <ListItem button onClick={handleLogout}>
                  <ListItemText
                    primary="Log Out"
                    sx={{ color: 'error.main' }}
                  />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
