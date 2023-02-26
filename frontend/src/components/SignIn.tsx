import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const SignIn = () => {
  return (
    <div className="SignIn">
      <div className="ButtonContainer">
        <TextField label="Company Name" variant="outlined" />
        <TextField label="Username" variant="outlined" />
        <TextField label="Password" variant="outlined" />
        <Button variant="contained" className="Button">
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default SignIn;
