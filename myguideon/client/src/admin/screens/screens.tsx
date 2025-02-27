import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link, Container } from '@mui/material';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Ajouter la logique de connexion ici
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const handleForgotPassword = () => {
    // Ajouter la logique pour mot de passe oublié ici
    console.log('Mot de passe oublié pour:', email);
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          Connexion
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2, width: '100%' }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
          >
            Se connecter
          </Button>
        </Box>
        <Link
          component="button"
          variant="body2"
          onClick={handleForgotPassword}
          sx={{ mt: 2 }}
        >
          Mot de passe oublié ?
        </Link>
      </Box>
    </Container>
  );
}

export default LoginPage;
