import { useState } from 'react';
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import LogoutButton from './LogoutButton';
import { addMessage } from '../../api';
import '../../styles/HomePage.css';



const WorkerHome = () => {
    const [content, setContent] = useState<string>("")
    
    return (
      <>
        <LogoutButton />
        <h1>Worker Homepage</h1>
        <Card>
        <CardContent>
            <TextField 
              required
              label="Message" 
              variant="outlined"
              onChange={event => setContent(event.target.value)}
              value={content}
            />
            <Button 
              variant="contained" 
              className="Button"
              onClick={async () => {
                await addMessage(content)
                setContent("")
              }}
            >
              Submit
            </Button>
        </CardContent>
      </Card>
      </>
    )
}
  
export default WorkerHome;
