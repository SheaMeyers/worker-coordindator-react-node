import Button from "@mui/material/Button";
import { logOut } from "../../api";

const LogoutButton = () => (
  <Button
    onClick={(_) => {
      logOut();
      localStorage.removeItem("token");
      window.location.reload();
    }}
  >
    Logout
  </Button>
);

export default LogoutButton;
