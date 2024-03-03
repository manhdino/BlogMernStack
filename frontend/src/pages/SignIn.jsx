import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  // const [message, setMessage] = useState(null);
  // const [status, setStatus] = useState(null);
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);

  // const hanldeMessage = (status, message) => {
  //   setMessage(message);
  //   setStatus(status);
  // };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!formData.email || !formData.password) {
    //   return dispatch(signInFailure("Please fill all the fields"));
    // }

    try {
      // setLoading(true);
      // hanldeMessage(null, null);
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        // setLoading(false);
        // return hanldeMessage("failure", data.message);
      }
      // setLoading(false);
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      // hanldeMessage("failure", error.message);
      // setLoading(false);
    }
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
            You can sign in with your email and password or with Google.
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
            {/* Email */}
            <div className="flex flex-col gap-1">
              <Label value="Your email" className="lg:text-base md:text-sm" />
              <TextInput
                type="text"
                placeholder="name@company.com"
                id="email"
                autoComplete="email"
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
                placeholder="**********"
                id="password"
                autoComplete="password"
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
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>

          <div className="flex gap-1 lg:text-base md:text-sm mt-2">
            <span>Don&apos;t have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
        {/* end right */}
      </div>
    </div>
  );
}
