import More from "./More.tsx";
import Folders from "./Folders.tsx";
import RecentNotes from "./RecentNotes.tsx";
import TitleAndSearchBar from "./TitleAndSearchBar.tsx";
export default function LeftSideBar({
  title,
  setTitle,
}: {
  title: string;
  setTitle: (title: string) => void;
}) {
  return (
    <div className="bg-custom_01 h-full w-1/5 py-5 flex flex-col gap-2 border-r-2 border-black overflow-hidden">
      {/* logo and search icon dev */}
      <TitleAndSearchBar setTitle={setTitle} />
      {/* recents notes div */}
      <RecentNotes title={title} />
      {/* All Folders Div */}
      <Folders />
      {/* More 1. Favorites 2. Trash 3. Archived Notes  */}
      <More />
    </div>
  );
}