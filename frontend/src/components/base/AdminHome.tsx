import { useEffect, useState } from "react";
import AddWorkerModal from "../AddWorkerModal";
import Button from "@mui/material/Button";
import LogoutButton from "./LogoutButton";
import "../../styles/HomePage.css";
import { UsersWithMessages } from "../../interfaces";
import { getUsersWithMessages } from "../../api";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

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
      <LogoutButton />
      <Button onClick={(_) => setIsOpen(true)}>Add Worker</Button>
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
          </AccordionDetails>
        </Accordion>
      ))}
      <AddWorkerModal isOpen={isOpen} handleClose={handleClose} />
    </>
  );
};

export default AdminHome;
