import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import EmailInput from "../../components/Input/EmailInput";
import { validateEmail } from "../../utils/helper";

const Signup = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError(null);

    // Sign Up API call can be implemented here
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded-3xl bg-white px-7 py-10 drop-shadow-2xl">
          <form onSubmit={handleSignUp}>
            <h4 className="font-bold text-2xl mb-3 text-center">Sign Up</h4>

            <span className="block text-xs mb-3 text-gray-600">
              * Required Fields
            </span>

            <label for="full_name">Full Name*</label>
            <input
              name="full_name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded-2xl mb-4 outline-none"
            />
            <EmailInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="btn-primary">
              Sign Up
            </button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <p className="text-sm text-center mt-4">
              Already Have an Account?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
