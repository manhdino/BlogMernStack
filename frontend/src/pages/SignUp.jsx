import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  //const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.username && formData.email && formData.password) {
      setLoading(false);
      return setErrorMessage("Successfully submitted");
    } else {
      setLoading(false);
      return setErrorMessage("Please fill out all fields.");
    }

    // navigate("/sign-in");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  return (
    <div className="min-h-screen mt-10 lg:mt-28 sm:mt-10">
      {/* container */}
      <div className="flex p-3 lg:max-w-4xl mx-auto md:max-w-3xl flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link
            to="/"
            className="font-bold dark:text-white text-2xl lg:text-4xl md:text-3xl sm:text-3xl"
          >
            <span className="px-2 py-1  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Dinomanh&apos;s
            </span>
            Blog
          </Link>

          <p className="text-base lg:text-base mt-5 ml-1 md:text-sm">
            You can sign up with your email and password or with Google.
          </p>
        </div>
        {/* end left */}

        {/* right */}
        <div className="flex-1">
          {errorMessage && (
            <Alert className="mb-5" color="failure">
              {errorMessage}
            </Alert>
          )}

          {/* Form submit */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="flex flex-col gap-1">
              <Label
                value="Your username"
                className="lg:text-base md:text-sm"
              />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <Label value="Your email" className="lg:text-base md:text-sm" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <Label
                value="Your password"
                className="lg:text-base md:text-sm"
              />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>

            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="flex gap-1 lg:text-base md:text-sm mt-2">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
        {/* end right */}
      </div>
    </div>
  );
}
