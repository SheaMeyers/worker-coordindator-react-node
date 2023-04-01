import { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { signUp as apiSignUp } from "../api"
import { AuthedResponse } from "../interfaces"


const SignUp = () => {
  const [companyName, setCompanyName] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')

  const signUp = async () => {
    setFeedback('loading')
    const result: AuthedResponse = await apiSignUp(companyName, username, password)

    if(!result.success){
      setFeedback(result.error)
      return
    }

    setFeedback('success')
    console.log('isAdmin')
    console.log(result.isAdmin)
    console.log('token')
    console.log(result.token)
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
          Sign Up
        </Button>
    </div>
  );
}

export default SignUp;
