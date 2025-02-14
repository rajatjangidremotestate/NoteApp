import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = "/api";

// Define a type for the API response

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
      const { data } = await axios.get(`${API_BASE_URL}/notes/recent`);
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
      const { data } = await axios.get(`${API_BASE_URL}/folders`);
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
      const { data } = await axios.post(`${API_BASE_URL}/folders`, newFolder);
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
      const { data } = await axios.patch(
        `${API_BASE_URL}/folders/${folderId}`,
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
  return useQuery({
    queryKey: ["folder-notes", folderId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/notes`, {
        params: {
          folderId,
          archived: false,
          favorite: false,
          deleted: false,
        },
      });
      return data;
    },
    enabled: !!folderId, // check for folderId is provided or not
    staleTime: 5 * 60 * 1000,
  });
};

//Fetch Note By Id
export const useFetchNote = (noteId: string | null) => {
  return useQuery({
    queryKey: ["note", noteId],
    queryFn: async () => {
      if (!noteId) throw new Error("No noteId provided");
      const { data } = await axios.get(`${API_BASE_URL}/notes/${noteId}`);
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
      const { data } = await axios.post(`${API_BASE_URL}/notes`, newNote);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", "folder-notes"] }); // Refresh notes list
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

// // Update note (favorite/archive/status)
// export const useUpdateNote = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     async ({ noteId, updatedData }) => {
//       const { data } = await axios.patch(
//         `${API_BASE_URL}/notes/${noteId}`,
//         updatedData
//       );
//       return data;
//     },
//     {
//       onSuccess: () => queryClient.invalidateQueries("notes"),
//     }
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
