import React, { useState, useEffect } from "react";
import { Alert } from "flowbite-react";

export default function AlertMessage({
  message = "",
  status = "failure",
  timing = 2000,
}) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (message !== "") {
      setIsVisible(true);
      const timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, timing);

      return () => clearTimeout(timeoutId);
    }
  }, [message, status, timing]);

  return <>{isVisible && <Alert color={status}>{message}</Alert>}</>;
}
