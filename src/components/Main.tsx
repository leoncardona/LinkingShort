import { useEffect, useState } from "react";
import LinkInput from "./LinkInput";
import Table from "./Table";
import type { Url } from "../xata";
import { useCookies } from "react-cookie";

const Main = () => {
  const [data, setData] = useState<Url[]>([]);
  const [cookies] = useCookies(["guestLinks"]);

  useEffect(() => {
    const fetchData = async () => {
      if (cookies.guestLinks) { // If the user has guest links
        const response = await fetch("http://localhost:4321/api/urls", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cookies.guestLinks),
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
          ? "flex h-full flex-col items-center gap-12 pt-48 transition-all duration-700"
          : "flex h-full flex-col items-center gap-8 pt-32 transition-all duration-700"
      }
    >
      <div className="flex flex-col items-center justify-center gap-8">
        <h1
          className={
            data.length === 0
              ? "font-jakarta text-8xl font-bold transition-all duration-700"
              : "font-jakarta text-7xl font-bold transition-all duration-700"
          }
        >
          Linking<span className="text-lsblue">Short</span>
        </h1>
        <p
          className={
            data.length === 0
              ? "h-auto opacity-90 transition-all duration-700 text-xl"
              : "h-0 opacity-0 transition-all duration-700"
          }
        >
          The ultimate <span className="font-semibold text-lsblue opacity-90">URL </span>
          shortening experience
        </p>
      </div>
      <LinkInput data={data} updateData={updateData} />
      {data.length !== 0 && <Table data={data} updateData={updateData} />}
    </main>
  );
};

export default Main;
