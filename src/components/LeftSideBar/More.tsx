import { NavLink, useParams } from "react-router-dom";
import { favoritesIcon, trashIcon, archivedIcon } from "./ImportsAll";

export default function More() {
  const { folderId } = useParams();
  return (
    <div className="flex flex-col gap-1 h-3/15">
      {/* More Heading  */}
      <div className="flex justify-between px-4">
        <p className="font-custom text-white opacity-60">More</p>
      </div>
      <div>
        <ul>
          {/* Favorites */}
          <li>
            <NavLink
              to={`/folder/favoriteNotes`}
              className="flex px-4 py-1 gap-2 items-center hover:bg-gray-800"
            >
              <img src={favoritesIcon} alt="" className="h-4" />
              <p
                className={`flex font-custom text-white text-sm  ${
                  folderId === "favoriteNotes" ? "opacity-100" : "opacity-60"
                }`}
              >
                Favorites
              </p>
            </NavLink>
          </li>

          {/* Trash */}
          <li>
            <NavLink
              to={`/folder/trashNotes`}
              className="flex px-4 py-1 gap-2 items-center hover:bg-gray-800"
            >
              <img src={trashIcon} alt="" className="h-4" />
              <p className="flex font-custom text-white opacity-60 text-sm">
                Trash
              </p>
            </NavLink>
          </li>

          {/* Archived Notes */}
          <li>
            <NavLink
              to={`/folder/archivedNotes`}
              className="flex px-4 py-1 gap-2 items-center hover:bg-gray-800"
            >
              <img src={archivedIcon} alt="" className="h-4" />
              <p className="flex font-custom text-white opacity-60 text-sm">
                Archived Notes
              </p>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
