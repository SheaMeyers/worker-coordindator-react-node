import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import SignUp from "../components/SignUp"

test("renders sign up", () => {
  render(<SignUp />, {wrapper: BrowserRouter})
  const companyNameTextBox = screen.getByRole("textbox", { name: "Company Name" })
  const usernameTextBox = screen.getByRole("textbox", { name: "Username" })
  const signUpButton = screen.getByRole("button", { name: "Sign Up" })
  expect(companyNameTextBox).toBeInTheDocument()
  expect(usernameTextBox).toBeInTheDocument()
  expect(signUpButton).toBeInTheDocument()
})
