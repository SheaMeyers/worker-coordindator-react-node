import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import HomePage from "../components/HomePage"

test("renders homepage", () => {
  render(<HomePage />, {wrapper: BrowserRouter})
  const titleElement = screen.getByText(/worker coordinator/i)
  const signUpButton = screen.getByRole("button", { name: "Sign Up" })
  const signInButton = screen.getByRole("button", { name: "Sign In" })
  expect(titleElement).toBeInTheDocument()
  expect(signUpButton).toBeInTheDocument()
  expect(signInButton).toBeInTheDocument()
})
