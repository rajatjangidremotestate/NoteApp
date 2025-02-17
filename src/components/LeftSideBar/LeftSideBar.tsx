import More from "./More.tsx";
import Folders from "./Folders.tsx";
import RecentNotes from "./RecentNotes.tsx";
import TitleAndSearchBar from "./TitleAndSearchBar.tsx";
export default function LeftSideBar({
  title,
  setTitle,
}: {
  title: string;
  setTitle: (pre: string) => string;
}) {
  // function toggleDarkMode() {
  //   document.documentElement.classList.toggle("dark");
  // }

  return (
    <div className="bg-custom_01 h-full w-1/5 py-5 flex flex-col gap-2 border-r-2 border-black">
      {/* logo and search icon dev */}
      <TitleAndSearchBar setTitle={setTitle} />
      {/* recents notes div */}
      <RecentNotes title={title} setTitle={setTitle} />
      {/* All Folders Div */}
      <Folders />
      {/* More 1. Favorites 2. Trash 3. Archived Notes  */}
      <More />
    </div>
  );
}
