import pancileIcon from "../assets/icons/pancile_01.svg";
import searchIcon from "../assets/icons/search_02.svg";

export default function LeftSideBar() {
  return (
    <div className="bg-custom_01 h-full w-1/5 p-7 flex flex-col gap-7">
      {/* logo and search icon dev */}
      <div className="flex flex-row justify-between h-10">
        {/* Title and pancile icon  */}
        <div className="flex gap-1.5">
          <p className="text-white custom-title">Nowted</p>
          <img src={pancileIcon} alt="" className="h-4" />
        </div>

        {/* Search Icon  */}
        <div>
          <img src={searchIcon} alt="" />
        </div>
      </div>

      {/* search bar full Div */}
      <div></div>

      {/* recents notes div */}
      <div></div>

      {/* All Folders Div */}
      <div></div>

      {/* More 1. Favorites 2. Trash 3. Archived Notes  */}
      <div></div>
    </div>
  );
}
