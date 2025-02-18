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
  pageNo: number;
}

export const useFetchFolderNotes = ({
  folderId,
  pageNo,
}: FetchFolderNotesParams) => {
  // Determining the query params based on folderId
  const queryClient = useQueryClient();
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
    page: pageNo,
  };

  // return useQuery({
  //   queryKey: ["folder-notes", folderId, pageNo],
  //   queryFn: async ({ queryKey }) => {
  //     const [, , currentPage] = queryKey;
  //     const { data } = await AxiosApi.get(`/notes`, {
  //       params: queryParams,
  //     });
  //     // return data;
  //     // If pageNo === 1, return data normally
  //     if (currentPage === 1) {
  //       return data.notes;
  //     }

  //     // If pageNo > 1, append new notes to previous notes
  //     // return (prevData) => ({
  //     //   ...data,
  //     //   notes: [...(prevData?.notes || []), ...data.notes],
  //     // });
  //     return (prevData) => [...(prevData || []), ...data.notes];
  //   },
  //   enabled: !!folderId, // Ensure the query only runs if folderId is available
  //   staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  // });

  //   return useQuery({
  //     queryKey: ["folder-notes", folderId, pageNo],
  //     queryFn: async ({ queryKey }) => {
  //       const [, , currentPage] = queryKey;
  //       const { data } = await AxiosApi.get(`/notes`, {
  //         params: queryParams,
  //       });

  //       // If pageNo === 1, return notes directly
  //       if (currentPage === 1) {
  //         return data.notes;
  //       }

  //       // If pageNo > 1, append new notes to previous notes
  //       return (prevData) => [...(prevData || []), ...data.notes];
  //     },
  //     enabled: !!folderId, // Ensure the query only runs if folderId is available
  //     staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  //   });
  // };

  return useQuery({
    queryKey: ["folder-notes", folderId, pageNo],
    queryFn: async () => {
      const { data } = await AxiosApi.get(`/notes`, {
        params: queryParams,
      });

      // Get previous notes from cache
      const previousData =
        queryClient.getQueryData(["folder-notes", folderId]) || [];

      // // If pageNo === 1, return only the current page notes
      // if (pageNo === 1) {
      //   return data.notes;
      // }

      // // If pageNo > 1, append new notes to previous notes
      // return [...previousData, ...data.notes];
      if (pageNo === 1) {
        return { notes: data.notes, totalNotes: data.total };
      }

      // If pageNo > 1, append new notes to previous notes
      return {
        notes: [...previousData, ...data.notes],
        totalNotes: data.total,
      };
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
      // console.log(data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", "folder-notes"] }); // Refresh notes list
    },
  });
};

// Update note for favorite/archive/status
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

//Delete Note by Id
export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId) => {
      await AxiosApi.delete(`/notes/${noteId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries(["note", variables.noteId]);
    },
  });
};

//Restore Note
export const useRestoreNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId) => {
      await AxiosApi.post(`/notes/${noteId}/restore`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries(["note", variables.noteId]);
    },
  });
};

// Define the Note type
interface updateNoteData {
  id: string | undefined;
  folderId: string | undefined;
  title: string;
  content: string;
}

// Hook for saving a note with debounce
export const useSaveNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, folderId, title, content }: updateNoteData) => {
      const { data } = await AxiosApi.patch(`/notes/${id}`, {
        folderId,
        title,
        content,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries(["note", variables.noteId]);
    },
  });
};
