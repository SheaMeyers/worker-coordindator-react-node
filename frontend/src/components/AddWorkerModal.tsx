import { useState } from "react"
import Button from "@mui/material/Button"
import Checkbox from '@mui/material/Checkbox'
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from "@mui/material/TextField"
import { addUser } from "../api"
import "../styles/AddWorkerModal.css";


interface AddWorkerModalProps {
    isOpen: boolean
    handleClose: () => void
}

const AddWorkerModal = (props: AddWorkerModalProps) => {
    const { isOpen, handleClose } = props

    const [username, setUsername] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    return (
        <Dialog open={isOpen} onClose={() => handleClose()}>
			<DialogTitle>Add User</DialogTitle>
			<DialogContent>
				<TextField
					required={true}
					margin="dense"
					id="username"
					label="Username"
					type="text"
					variant="outlined"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<TextField
					required={true}
					margin="dense"
					id="password"
					label="Password"
					type="password"
					variant="outlined"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
                <FormControlLabel 
                    control={
                        <Checkbox
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        />
                    } 
                    label="Is Admin" 
                />
				{loading && <p>Adding worker...</p>}
			</DialogContent>
			<DialogActions>
				<Button
					disabled={loading || !username || !password}
					onClick={async () => {
						setLoading(true)
                        await addUser(username, password, isAdmin)
                        setLoading(false)
						window.location.reload()
					}}
				>
					Add User
				</Button>
				<Button onClick={() => props.handleClose()}>Cancel</Button>
			</DialogActions>
		</Dialog>
    )
}

export default AddWorkerModal
