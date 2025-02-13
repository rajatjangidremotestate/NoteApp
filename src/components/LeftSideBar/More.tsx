import { favoritesIcon, trashIcon, archivedIcon } from "./ImportsAll";

export default function More() {
  return (
    <div className="flex flex-col gap-1">
      {/* More Heading  */}
      <div className="flex justify-between px-4">
        <p className="font-custom text-white opacity-60">More</p>
      </div>
      <div>
        <ul>
          {/* Favorites */}
          <li>
            <a href="" className="flex px-4 py-1 gap-2 items-center">
              <img src={favoritesIcon} alt="" className="h-4" />
              <p className="flex font-custom text-white opacity-60 text-sm">
                Favorites
              </p>
            </a>
          </li>

          {/* Trash */}
          <li>
            <a href="" className="flex px-4 py-1 gap-2 items-center">
              <img src={trashIcon} alt="" className="h-4" />
              <p className="flex font-custom text-white opacity-60 text-sm">
                Trash
              </p>
            </a>
          </li>

          {/* Archived Notes */}
          <li>
            <a href="" className="flex px-4 py-1 gap-2 items-center">
              <img src={archivedIcon} alt="" className="h-4" />
              <p className="flex font-custom text-white opacity-60 text-sm">
                Archived Notes
              </p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
