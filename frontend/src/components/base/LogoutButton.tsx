import Button from "@mui/material/Button";
import { logOut } from "../../api";

const LogoutButton = () => (
  <Button
    onClick={(_) => logOut()}
  >
    Logout
  </Button>
);

export default LogoutButton;
