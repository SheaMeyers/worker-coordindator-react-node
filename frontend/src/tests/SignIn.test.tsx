import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import SignIn from "../components/SignIn"

test("renders sign up", () => {
  render(<SignIn />, {wrapper: BrowserRouter})
  const companyNameTextBox = screen.getByRole("textbox", { name: "Company Name" })
  const usernameTextBox = screen.getByRole("textbox", { name: "Username" })
  const signUpButton = screen.getByRole("button", { name: "Sign In" })
  expect(companyNameTextBox).toBeInTheDocument()
  expect(usernameTextBox).toBeInTheDocument()
  expect(signUpButton).toBeInTheDocument()
})
