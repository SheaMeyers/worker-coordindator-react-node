import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { AuthedResponse } from "../../interfaces"


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
    setFeedback('loading')
    const result: AuthedResponse = await props.authFunction(companyName, username, password)

    if(!result.success){
      setFeedback(result.error)
      return
    }

    setFeedback('success')
    console.log('isAdmin')
    console.log(result.isAdmin)
    localStorage.setItem('isAdmin', result.isAdmin.toString())
    console.log('token')
    console.log(result.token)
    localStorage.setItem('token', result.token)
    navigate('/')
  }
  
  return (
    <div className="SignUp">
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
        {feedback && <p>{feedback}</p>}
        <Button 
          variant="contained" 
          className="Button"
          onClick={async () => await signUp()}
        >
          {props.buttonText}
        </Button>
    </div>
  );
}

export default GetAuthed;
