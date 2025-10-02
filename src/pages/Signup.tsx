
import { Navigate } from "react-router-dom";
import Register from "./Register";

// This is a redirect component to ensure old URLs still work
export default function Signup() {
  return <Navigate to="/register" replace />;
}
