import type { Url } from "../xata";
import { useCookies } from "react-cookie";
import { useState } from "react"; // Importa el useState hook

const baseUrl = "http://localhost:4321/";

const Table = ({ data, updateData }: any) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "guestLinks",
    "token",
  ]);

  const deleteUrl = async (id: string) => {
    // When the user is a guest
    let guestLinks: string[] = [];
    if (cookies.guestLinks) {
      guestLinks = cookies.guestLinks.filter((cookie: string) => cookie !== id);
      guestLinks.length !== 0
        ? setCookie("guestLinks", guestLinks, { path: "/" })
        : removeCookie("guestLinks", { path: "/" });
    } else if (cookies.token) {
      // When the user is logged in
      // Get user id from the token
      const sessionResponse = await fetch("/api/session", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const sessionData = await sessionResponse.json();

      // Remove the URL from the user's list
      await fetch("http://localhost:4321/api/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: sessionData.userId, urlId: id }),
      });
    }

    // Update the data in the table
    const newData = data.filter((url: Url) => url.id !== id);
    updateData(newData);

    // Remove the URL from the database
    await fetch(`http://localhost:4321/api/urls/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Short URL
            </th>
            <th scope="col" className="px-6 py-3">
              Original URL
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((url: Url) => {
            return (
              <tr
                key={url.id}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="relative whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white" // added relative positioning here
                >
                  <a href={baseUrl + url.shorten}>{baseUrl + url.shorten}</a>
                </th>
                <td className="px-6 py-4"> {url.full} </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => deleteUrl(url.id)}
                    className="font-medium text-red-500"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
