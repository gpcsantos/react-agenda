import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { IUser, signInEndPoint } from "./backend";

const useStyle = makeStyles({
  error: {
    backgroundColor: "rgb(253, 236, 234)",
    borderRadius: "4px",
    padding: "16px",
    margin: "16px 0 ",
  },
});

interface ILoginScreenProps {
  onSignIn: (user: IUser) => void;
}

export default function LoginScreen(props: ILoginScreenProps) {
  const [email, setEmail] = useState("danilo@email.com");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");
  const classes = useStyle();

  function signIn(evt: React.FormEvent) {
    evt.preventDefault();
    signInEndPoint(email, password).then(props.onSignIn, (e) => {
      setError("E-mail não encontrado ou senha incorreta");
    });
  }

  return (
    <Container maxWidth="sm">
      <h2>Agenda React</h2>
      <p>
        Digite e-mail e senha para entrar no sistema. Para testar, use o e-mail{" "}
        <kbd>danilo@email.com</kbd> e senha <kbd>1234</kbd>
      </p>
      <form onSubmit={signIn}>
        <TextField
          type="email"
          margin="normal"
          label="E-mail"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
        />
        <TextField
          type="password"
          margin="normal"
          label="Senha"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
        />
        {error && <div className={classes.error}>{error}</div>}
        <Box textAlign="right" marginTop="1rem">
          <Button type="submit" color="primary" variant="contained">
            Entrar
          </Button>
        </Box>
      </form>
    </Container>
  );
}
