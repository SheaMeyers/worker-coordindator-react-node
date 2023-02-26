import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import '../styles/HomePage.css';


const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className='HomePage'>
      <div className='ButtonContainer'>
        <Button variant='contained' className='Button' onClick={_ => navigate('/sign-in')}>Sign In</Button>
        <Button variant='contained' className='Button' onClick={_ => navigate('/sign-up')}>Sign Up</Button>
      </div>
      <h1>
        Worker Coordinator
      </h1>
    </div>
  );
}

export default HomePage;
