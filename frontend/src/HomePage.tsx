import Button from '@mui/material/Button';

import './HomePage.css';


const HomePage = () => {
  return (
    <div className='HomePage'>
      <div className='ButtonContainer'>
        <Button variant='contained' className='Button'>Sign In</Button>
        <Button variant='contained' className='Button'>Sign Up</Button>
      </div>
      <h1>
        Worker Coordinator
      </h1>
    </div>
  );
}

export default HomePage;
