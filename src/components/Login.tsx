import { useState } from "react";
import type { IAlertMessage } from "../interfaces/IAlertMessage";
import AlertMessage from "./AlertMessage";
import { useCookies } from "react-cookie";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [alertMessage, setAlertMessage] = useState<IAlertMessage | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(["token", "guestLinks"]);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        // Remove guestLinks cookie
        removeCookie("guestLinks", { path: "/" });

        // Store the token in a cookie
        setCookie("token", token);

        // User logged in successfully
        setAlertMessage({
          title: "Logged in successfully 🎉",
          description: "Redirecting...",
          type: "success",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else if (response.status === 400) {
        setAlertMessage({
          title: "Incorrect password ⚠️",
          description: "Please try again",
          type: "warning",
        });
      } else {
        setAlertMessage({
          title: "Email not found ⚠️",
          description: "Please try again",
          type: "warning",
        });
      }
    } catch (error) {
      setAlertMessage({
        title: "An unexpected error occurred",
        description: "Please try again later",
        type: "danger",
      });
    }
  };

  const handleChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <section>
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <a
          href="#"
          className="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <h1 className="font-jakarta text-4xl font-bold transition-all duration-700">
            Linking<span className="text-lsblue">Short</span>
          </h1>
        </a>
        <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <div className="flex items-center">
              <a href="/" className="me-3 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  className="icon icon-tabler icon-tabler-arrow-back-up"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="m9 14-4-4 4-4" />
                  <path d="M5 10h11a4 4 0 1 1 0 8h-1" />
                </svg>
              </a>
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                Login
              </h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-lsblue focus:ring-lsblue dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-lsblue focus:ring-lsblue dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="dark:focus:ring-lsblue-800 w-full rounded-lg bg-lsblue px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-lsdarkblue focus:outline-none focus:ring-4"
              >
                Log in
              </button>
              <p className="text-center text-sm font-light text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="dark:text-lsblue-500 font-medium text-lsblue hover:underline"
                >
                  Sign up here
                </a>
              </p>
            </form>
            {alertMessage && <AlertMessage message={alertMessage} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
