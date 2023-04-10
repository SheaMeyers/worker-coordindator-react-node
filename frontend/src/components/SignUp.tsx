import { signUp } from "../api"
import GetAuthed from './base/GetAuthed'


const SignUp = () => <GetAuthed
  authFunction={signUp}
  buttonText='Sign Up'
/>

export default SignUp;
