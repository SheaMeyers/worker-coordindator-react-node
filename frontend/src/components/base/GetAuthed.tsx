import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import { AuthedResponse } from "../../interfaces"
import '../../styles/GetAuthed.css'


type GetAuthedProps = {
    authFunction: (arg0: string, arg1: string, arg2: string) => Promise<AuthedResponse>
    buttonText: string
}


const GetAuthed = (props: GetAuthedProps) => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')

  const signUp = async () => {
    setFeedback('loading...')
    const result: AuthedResponse = await props.authFunction(companyName, username, password)

    if(!result.success){
      setFeedback(result.error)
      return
    }

    navigate('/')
  }
  
  return (
    <Card>
      <CardContent>
        <div className='GetAuthed'>
          <TextField 
            required
            label="Company Name" 
            variant="outlined"
            onChange={event => setCompanyName(event.target.value)}
            value={companyName}
          />
          <TextField 
            required
            label="Username" 
            variant="outlined" 
            onChange={event => setUsername(event.target.value)}
            value={username}
          />
          <TextField 
            required 
            label="Password" 
            variant="outlined" 
            type='password'
            onChange={event => setPassword(event.target.value)}
            value={password}
          />
          {feedback && <p>{feedback}</p>}
          <Button 
            variant="contained" 
            className="Button"
            onClick={async () => await signUp()}
          >
            {props.buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default GetAuthed;
