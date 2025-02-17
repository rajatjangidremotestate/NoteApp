import { recentNoteIcon } from "./ImportsAll";
import { NavLink } from "react-router-dom";
import { useFetchRecentNotes } from "../../api/apiAxios.tsx";

import { useParams } from "react-router-dom";

export default function RecentNotes({ title, setTitle }) {
  const { data, isLoading, isError } = useFetchRecentNotes();
  const { noteId } = useParams();

  const recentNotes = data?.recentNotes || [];
  // console.log(recentNotes);

  //Testing Loading and all
  if (isLoading) return <p>Loading recent notes...</p>;
  if (isError) return <p>Failed to load recent notes.</p>;
  return (
    <div className="flex flex-col gap-1 h-3/15">
      {/* Recents Heading  */}
      <div>
        <p className="text-white px-5 font-custom opacity-60">Recents</p>
      </div>

      {/* All Recent Notes */}
      <ul className="flex flex-col">
        {recentNotes.length > 0 &&
          recentNotes.slice(0, 3).map((note) => (
            <li key={note.id}>
              <NavLink
                to={`/folder/${note.folderId}/note/${note.id}`}
                onClick={() => setTitle(note.title)}
                className="flex gap-2 px-4 py-1 hover:bg-gray-800"
              >
                <img src={recentNoteIcon} alt="" className="h-4" />
                <p
                  className={`text-white font-custom text-sm ${
                    noteId != undefined && note.id === noteId
                      ? "opacity-full"
                      : "opacity-60"
                  }`}
                >
                  {note.id === noteId ? title : note.title}
                </p>
              </NavLink>
            </li>
          ))}
      </ul>
    </div>
  );
}
