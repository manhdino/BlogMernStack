import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AutoRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/sign-in");
    }, 3000);
  }, []);

  return " and redirecting to Sign In page";
}

export default AutoRedirect;
