import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import LogoutButton from "./LogoutButton";
import AddWorkerModal from "../AddWorkerModal";
import { UsersWithMessages } from "../../interfaces";
import { getUsersWithMessages } from "../../api";
import "../../styles/HomePage.css";


const AdminHome = () => {
  const [usersWithMessages, setUsersWithMessages] = useState<UsersWithMessages>(
    []
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUsersWithMessages();
      setUsersWithMessages(response);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className='ButtonContainer'>
        <Button onClick={(_) => setIsOpen(true)}>Add Worker</Button>
        <LogoutButton />
      </div>
      <h1>Admin Homepage</h1>
      {usersWithMessages.map((userWithMessages) => (
        <Accordion>
          <AccordionSummary>
            <Typography>{userWithMessages.username}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {userWithMessages.Message.map((message) => (
              <Card>
                <CardContent>{message.content}</CardContent>
              </Card>
            ))}
            {userWithMessages.Message.length === 0 &&
              <span>(No Messages)</span>}
          </AccordionDetails>
        </Accordion>
      ))}
      <AddWorkerModal isOpen={isOpen} handleClose={handleClose} />
    </>
  );
};

export default AdminHome;
