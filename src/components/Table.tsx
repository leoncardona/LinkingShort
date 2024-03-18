import type { Url } from "../xata";
import { useCookies } from "react-cookie";

const baseUrl = "https://linking-short.vercel.app/";

const Table = ({ data, updateData }: any) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "guestLinks",
    "token",
  ]);

  const deleteUrl = async (id: string) => {
    // Cuando el usuario es un invitado
    let guestLinks: string[] = [];
    if (cookies.guestLinks) {
      guestLinks = cookies.guestLinks.filter((cookie: string) => cookie !== id);
      guestLinks.length !== 0
        ? setCookie("guestLinks", guestLinks, { path: "/" })
        : removeCookie("guestLinks", { path: "/" });
    } else if (cookies.token) {
      // Cuando el usuario está conectado
      // Obtener el id de usuario del token
      const sessionResponse = await fetch("/api/session", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const sessionData = await sessionResponse.json();

      // Eliminar la URL de la lista del usuario
      await fetch("/api/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: sessionData.userId, urlId: id }),
      });
    }

    // Actualizar los datos en la tabla
    const newData = data.filter((url: Url) => url.id !== id);
    updateData(newData);

    // Eliminar la URL de la base de datos
    await fetch(`/api/urls/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md sm:overflow-hidden mx-4">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">
              Short URL
            </th>
            <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">
              Original URL
            </th>
            <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">
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
                <td className="px-3 py-2 font-medium text-gray-900 dark:text-white sm:px-6 sm:py-4">
                  <a href={baseUrl + url.shorten} className="break-all">
                    {baseUrl + url.shorten}
                  </a>
                </td>
                <td className="break-all px-3 py-2 sm:px-6 sm:py-4">
                  {url.full}
                </td>
                <td className="px-3 py-2 text-right sm:px-6 sm:py-4">
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
