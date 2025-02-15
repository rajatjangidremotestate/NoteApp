import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const AxiosApi = axios.create({
  baseURL: "https://nowted-server.remotestate.com",
});

interface Folder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

interface Note {
  id: string;
  folderId: string;
  title: string;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  preview: string;
  folder: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
  };
}

interface NotesResponse {
  recentNotes: Note[];
}

interface FolderResponse {
  folders: Folder[];
}

// Fetch recent notes
export const useFetchRecentNotes = () => {
  return useQuery<NotesResponse>({
    queryKey: ["recent-notes"],
    queryFn: async () => {
      const { data } = await AxiosApi.get(`/notes/recent`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Fetch all folders
export const useFetchFolders = () => {
  return useQuery<FolderResponse>({
    queryKey: ["folders"],
    queryFn: async () => {
      const { data } = await AxiosApi.get(`/folders`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

//Newfolder creation payload
interface NewFolder {
  name: string;
}

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newFolder: NewFolder) => {
      const { data } = await AxiosApi.post(`/folders`, newFolder);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};

// updateFolder payload
interface UpdateFolderPayload {
  folderId: string;
  updatedData: { name: string };
}

export const useUpdateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ folderId, updatedData }: UpdateFolderPayload) => {
      const { data } = await AxiosApi.patch(
        `/folders/${folderId}`,
        updatedData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};

// Fetch notes by folder
interface FetchFolderNotesParams {
  folderId: string;
}

export const useFetchFolderNotes = ({ folderId }: FetchFolderNotesParams) => {
  // Determining the query params based on folderId
  const queryParams = {
    folderId:
      folderId !== "favoriteNotes" &&
      folderId !== "trashNotes" &&
      folderId !== "archivedNotes"
        ? folderId
        : undefined, // Pass folderId only if it's not a special case
    archived: folderId === "archivedNotes" ? true : false,
    favorite: folderId === "favoriteNotes" ? true : undefined,
    deleted: folderId === "trashNotes" ? true : false,
  };

  return useQuery({
    queryKey: ["folder-notes", folderId],
    queryFn: async () => {
      const { data } = await AxiosApi.get(`/notes`, {
        params: queryParams,
      });
      return data;
    },
    enabled: !!folderId, // Ensure the query only runs if folderId is available
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });
};

//Fetch Note By Id
export const useFetchNote = (noteId: string | null) => {
  return useQuery({
    queryKey: ["note", noteId],
    queryFn: async () => {
      if (!noteId) throw new Error("No noteId provided");
      const { data } = await AxiosApi.get(`/notes/${noteId}`);
      return data;
    },
    enabled: !!noteId, // Only run if noteId is truthy
  });
};

// Define the Note type
interface NoteData {
  folderId: string;
  title: string;
  content: string;
  isFavorite: boolean;
  isArchived: boolean;
}

// Hook to create a new note
export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newNote: NoteData) => {
      const { data } = await AxiosApi.post(`/notes`, newNote);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", "folder-notes"] }); // Refresh notes list
    },
  });
};

// Update note (favorite/archive/status)
export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ noteId, updatedData }) => {
      const { data } = await AxiosApi.patch(`/notes/${noteId}`, updatedData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["note", variables.noteId]);
      queryClient.invalidateQueries(["notes"]);
    },
  });
};

// // Fetch all notes
// export const useFetchNotes = () => {
//   return useQuery(
//     "notes",
//     async () => {
//       const { data } = await axios.get(`${API_BASE_URL}/notes`);
//       return data;
//     },
//     { staleTime: 5 * 60 * 1000 }
//   );
// };

// // Delete note
// export const useDeleteNote = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     async (noteId) => {
//       await axios.delete(`${API_BASE_URL}/notes/${noteId}`);
//     },
//     {
//       onSuccess: () => queryClient.invalidateQueries("notes"),
//     }
//   );
// };

// // Restore deleted note
// export const useRestoreNote = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     async (noteId) => {
//       await axios.post(`${API_BASE_URL}/notes/${noteId}/restore`);
//     },
//     {
//       onSuccess: () => queryClient.invalidateQueries("notes"),
//     }
//   );
// };
