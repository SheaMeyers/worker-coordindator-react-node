import { useState } from "react"
import AddWorkerModal from "../AddWorkerModal";
import Button from "@mui/material/Button";
import LogoutButton from "./LogoutButton";
import "../../styles/HomePage.css";

const AdminHome = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleClose = () => setIsOpen(false)

  return (
    <>
      <LogoutButton />
      <Button onClick={(_) => setIsOpen(true)}>Add Worker</Button>
      <h1>Admin Homepage</h1>
      <AddWorkerModal
        isOpen={isOpen}
        handleClose={handleClose}
      /> 
    </>
  )
}

export default AdminHome
