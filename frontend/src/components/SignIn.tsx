import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { signIn as apiSignIn } from "../api"
import { AuthedResponse } from "../interfaces";

const SignIn = () => {
  const [companyName, setCompanyName] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const signIn = async () => {
    const result: AuthedResponse = await apiSignIn(companyName, username, password)

    console.log(result)
  }

  return (
    <div className="SignIn">
        <TextField 
          label="Company Name" 
          variant="outlined" 
          onChange={event => setCompanyName(event.target.value)}
          value={companyName}
        />
        <TextField 
          label="Username" 
          variant="outlined" 
          onChange={event => setUsername(event.target.value)}
          value={username}
        />
        <TextField 
          label="Password" 
          variant="outlined" 
          onChange={event => setPassword(event.target.value)}
          value={password}
        />
        <Button 
          variant="contained" 
          className="Button"
          onClick={async () => await signIn()}
        >
          Sign In
        </Button>
    </div>
  );
};

export default SignIn;
