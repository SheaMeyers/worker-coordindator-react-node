import { signIn } from "../api"
import GetAuthed from './base/GetAuthed'


const SignIn = () => <GetAuthed
  authFunction={signIn}
  buttonText='Sign In'
/>

export default SignIn;
