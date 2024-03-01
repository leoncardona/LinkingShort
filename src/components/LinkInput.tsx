import { useRef, useState } from "react";
import type { Url } from "../xata";
import { useCookies } from "react-cookie";

const LinkInput = ({ data, updateData }: any) => {
  const [linkValue, setLinkValue] = useState<string>("");
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
  const [cookies, setCookie] = useCookies(["guestLinks"]);

  const urlInputRef = useRef<HTMLInputElement>(null);

  const createLink = async (url: string) => {
    const addedUrl: Url = await fetch("http://localhost:4321/api/urls/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: url,
    }).then((res) => res.json());
    setLinkValue("");
    updateData([...data, addedUrl]);

    // Update cookie information
    const guestLinks = cookies.guestLinks
      ? [...cookies.guestLinks, addedUrl.id]
      : [addedUrl.id]; // Add the new link to the cookie if the user has guest links
    setCookie("guestLinks", guestLinks, { path: "/" });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setLinkValue(inputValue);

    const urlPattern = new RegExp(
      "https?:\\/\\/(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z]{2,})+(\\/\\S*)?$",
    );

    setIsValidUrl(urlPattern.test(inputValue));
  };

  return (
    <div className="button flex items-center justify-between rounded-full border-4 border-[#353C4A] bg-[#181E29] p-2">
      <div className="flex items-center gap-4">
        <img className="ml-4" src="link.svg" alt="link icon" />
        <input
          ref={urlInputRef}
          value={linkValue}
          onChange={handleInputChange}
          className={`border-none bg-transparent p-2 focus:ring-0 ${isValidUrl ? "" : "border-red-500"}`}
          type="text"
          name="link"
          id="link"
          placeholder="Enter the link here"
        />
      </div>

      <button
        disabled={!linkValue || !isValidUrl || data.length >= 5}
        onClick={() => createLink(linkValue)}
        id="submitLinkButton"
        className="rounded-full bg-lsdarkblue px-4 py-2 text-white hover:bg-lsblue disabled:cursor-not-allowed disabled:opacity-50"
      >
        Shorten
      </button>
    </div>
  );
};

export default LinkInput;
