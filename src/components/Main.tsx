import { useEffect, useState } from "react";
import LinkInput from "./LinkInput";
import Table from "./Table";
import type { Url } from "../xata";
import { useCookies } from "react-cookie";
import AlertMessage from "./AlertMessage";

const Main = () => {
  const [data, setData] = useState<Url[]>([]);
  const [cookies] = useCookies(["guestLinks", "token"]);

  useEffect(() => {
    const fetchData = async () => {
      if (cookies.guestLinks) {
        // If the user has guest links
        const response = await fetch("http://localhost:4321/api/urls", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cookies.guestLinks),
        });
        const data = await response.json();
        setData(data);
      } else if (cookies.token) {
        // If the user is logged in
        // Get user id from the token
        const sessionResponse = await fetch("/api/session", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const sessionData = await sessionResponse.json();

        // Get the user's list of URLs
        const urlsResponse = await fetch("http://localhost:4321/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: sessionData.userId }),
        });
        const urls = await urlsResponse.json() ?? [];

        // Get links information by their ids
        const response = await fetch("http://localhost:4321/api/urls", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(urls),
        });
        const data = await response.json();
        setData(data);
      }
    };

    fetchData();
  }, []);

  const updateData = (newData: Url[]) => {
    setData(newData);
  };

  return (
    <main
      className={
        data.length === 0
          ? "flex h-full animate-fade-in flex-col items-center gap-12 pt-40 pb-12"
          : "flex h-full animate-fade-in flex-col items-center gap-8 pt-24 pb-12"
      }
    >
      <div className="flex flex-col items-center justify-center gap-8">
        <h1
          className={
            data.length === 0
              ? "font-jakarta text-8xl font-bold"
              : "font-jakarta text-7xl font-bold"
          }
        >
          Linking<span className="text-lsblue">Short</span>
        </h1>
        <p
          className={
            data.length === 0 ? "h-auto text-xl opacity-90" : "h-0 opacity-0"
          }
        >
          The ultimate{" "}
          <span className="font-semibold text-lsblue opacity-90">URL </span>
          shortening experience
        </p>
      </div>
      <section className="flex flex-col">
        {!(data.length === 5 && cookies.guestLinks) && (
          <LinkInput data={data} updateData={updateData} />
        )}
        {data.length === 5 && cookies.guestLinks && (
          <AlertMessage
            message={{
              title: "Guest link limit reached ⚠️",
              description: "Please sign up to create more links.",
              type: "warning",
            }}
          />
        )}
      </section>
      {data.length !== 0 && <Table data={data} updateData={updateData} />}
    </main>
  );
};

export default Main;
