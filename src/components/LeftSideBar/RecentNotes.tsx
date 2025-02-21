import { recentNoteIcon, useFetchRecentNotes } from "./index.tsx";
import { NavLink, useParams } from "react-router-dom";
import { Note } from "../../api/apiHooks.tsx";
import { useCallback } from "react";

export default function RecentNotes({ title }: { title: string }) {
  const { data, isLoading, isError } = useFetchRecentNotes();
  const { noteId } = useParams();

  const recentNotes: Note[] = data?.recentNotes || [];

  const optimizedTitle = useCallback(
    (note: Note) => {
      if (note.id === noteId) {
        // Assuming `title` is a separate state or prop
        return title?.length > 20 ? title.slice(0, 20) : title;
      } else {
        return note?.title
          ? note.title.length > 20
            ? note.title.slice(0, 20).concat("...")
            : note.title
          : "";
      }
    },
    [noteId, title]
  );

  if (isError) return <p>Failed to load recent notes.</p>;
  return (
    <div className="flex flex-col gap-1 h-3/15">
      {/* Recents Heading  */}
      <div>
        <p className="text-white px-5 font-custom opacity-60">Recent</p>
      </div>
      {isLoading && (
        <ul className="flex flex-col gap-1">
          {[...Array(3)].map((_, index) => (
            <li key={index}>
              <div className="flex gap-2 px-4 py-1 hover:bg-gray-800 bg-custom_02 rounded-sm">
                <img src={recentNoteIcon} alt="" className="h-4" />
                <p className={`text-white font-custom text-sm`}></p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* All Recent Notes */}
      {!isLoading && (
        <ul className="flex flex-col">
          {recentNotes.length > 0 &&
            recentNotes.slice(0, 3).map((note) => (
              <li key={note.id}>
                <NavLink
                  to={`/folder/${note.folderId}/note/${note.id}`}
                  // onClick={() => setTitle(note.title)}
                  className="flex gap-2 px-4 py-1 hover:bg-gray-800 w-full h-fit"
                >
                  <img src={recentNoteIcon} alt="" className="h-4" />
                  <p
                    className={`text-white font-custom text-sm ${
                      noteId != undefined && note.id === noteId
                        ? "opacity-full"
                        : "opacity-60"
                    }`}
                  >
                    {optimizedTitle(note)}
                  </p>
                </NavLink>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
