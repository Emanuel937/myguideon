import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link, Paper,  IconButton, InputAdornment, } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import HOSTNAME_WEB from "../constants/hostname";
import { Visibility, VisibilityOff } from "@mui/icons-material";


const LoginContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundImage: "url('https://cdn.pixabay.com/photo/2019/08/11/15/48/road-trip-4399206_1280.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: theme.spacing(2),
}));

const LoginForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  textAlign: "center",
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  marginTop: theme.spacing(1),
}));

const Login: React.FC = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [isFirstTime, setIsFirstTime]  = useState(false);
  const[confirmPassword ,setConfirmPassword] = useState("");
  const [errorPassword, setErrorPassword]    =  useState(false);

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    try {
      const response = await fetch(`${HOSTNAME_WEB}/profil/send-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi de la requête.");
      setStep(2);
    } catch (error) {
      setErrorMessage("Une erreur est survenue.");
    }
  };

  const handleVerifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch(`${HOSTNAME_WEB}/profil/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, code: resetCode }),
      });

      if (!response.ok) throw new Error("Code invalide ou expiré.");
      setStep(3);
    } catch (error) {
      setErrorMessage("Une erreur est survenue.");
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
   if(confirmPassword == newPassword){
    try {
      const response = await fetch(`${HOSTNAME_WEB}/profil/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, newPassword }),
      });

      if (!response.ok) throw new Error("Erreur lors de la réinitialisation.");
      setShowForgotPassword(false);
    } catch (error) {
      setErrorMessage("Une erreur est survenue.");
    }
  }else{
    setErrorPassword(true);
  }
  };

  // Fonction de connexion
const handleLogin = async (event: React.FormEvent): Promise<void> => {
  event.preventDefault();
  setErrorMessage(""); // Réinitialiser le message d'erreur

  const requestData = { email, password };

  try {
    // Envoyer une requête POST au serveur
    const response = await fetch(`${HOSTNAME_WEB}/profil/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    // Vérifier si la réponse est correcte
    if (!response.ok) {
      const errorData = await response.json(); // Lire les données d'erreur renvoyées par le serveur
      setErrorMessage(errorData.message || "Erreur : mot de passe ou utilisateur invalide");
      return;
    }

    // Lire les données de la réponse
    const responseData = await response.json();


    if (responseData && responseData.message) {
      if(responseData.isfirstTime == 'yes'){
        setIsFirstTime(true);
        setStep(1);
        setShowForgotPassword(true);
      }else{
        localStorage.setItem("userId", responseData.message);
        localStorage.setItem('token',   responseData.token);
        navigate("/admin"); 
      }
    } else {
      setErrorMessage("Réponse du serveur invalide.");
    }
  } catch (error) {
    console.error("Erreur lors de la tentative de connexion :", error);
    setErrorMessage("Une erreur est survenue. Veuillez réessayer plus tard.");
  }
};

  
  
  return (
    <LoginContainer>
      <LoginForm elevation={3}>
        <Typography variant="h6" gutterBottom>
          {showForgotPassword ? " 👋 Réinitialiser le mot de passe" : " 👋 Connexion"}
        </Typography>
        {isFirstTime && (
            <Typography fontSize={14}> Salut, bienvenue ! C'est votre première connexion, réinitialisons votre mot de passe. </Typography>)     
        }
        {!showForgotPassword ? (
          <form>
            <TextField label="Adresse e-mail" fullWidth margin="normal" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextField label="Mot de passe" fullWidth margin="normal" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} onClick={handleLogin}>
              Se connecter
            </Button>
            <Box mt={2}>
              <Typography variant="body2">
                <Link href="#" onClick={() => setShowForgotPassword(true)} underline="hover">
                  Mot de passe oublié ?
                </Link>
              </Typography>
            </Box>
          </form>
        ) : step === 1 ? (
          <form onSubmit={handleForgotPassword}>
            <TextField label="Adresse e-mail" fullWidth margin="normal" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
           {/** hide mot de passe */}
            
            
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
              Envoyer le code
            </Button>
          </form>
        ) : step === 2 ? (
          <form onSubmit={handleVerifyCode}>
            <TextField label="Code de validation" fullWidth margin="normal" value={resetCode} onChange={(e) => setResetCode(e.target.value)} required />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
              Vérifier le code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <TextField label="Nouveau Mot de passe" 
                        fullWidth margin="normal" 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
            required />

            <TextField
                type={showPassword ? "text" : "password"}
                label="Confirmer Nouveau Mot de passe"
                variant="outlined"
                fullWidth
                onChange={(e)=> setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            { errorPassword  && <p style={{color:'red'}}> le mot de passe ne sont pas identiques </p> }
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
              Réinitialiser le mot de passe
            </Button>
          </form>
        )}
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
