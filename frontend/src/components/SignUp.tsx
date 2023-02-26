import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const SignUp = () => {
  return (
    <div className='SignUp'>
      <div className='ButtonContainer'>
        <TextField label="Company Name" variant="outlined" />
        <TextField label="Username" variant="outlined" />
        <TextField label="Password" variant="outlined" />
        <TextField label="Repeat Password" variant="outlined" />
        <Button variant='contained' className='Button'>Sign Up</Button>
      </div>
    </div>
  );
}

export default SignUp;
