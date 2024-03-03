import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AutoRedirect({ name = "Sign In", navigateTo = "/sign-in" }) {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate(`${navigateTo}`);
    }, 3000);
  }, [navigate, navigateTo]);

  return `and redirecting to ${name} page`;
}

export default AutoRedirect;
