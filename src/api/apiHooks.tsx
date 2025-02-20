import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const AxiosApi = axios.create({
  baseURL: "https://nowted-server.remotestate.com",
});

export interface Folder {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface Note {
  id?: string;
  folderId?: string;
  title?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  preview: string;
  folder?: Folder;
}

interface NotesResponse {
  recentNotes: Note[];
}

interface FolderResponse {
  folders: Folder[];
}

//Newfolder creation payload
interface NewFolder {
  name: string;
}

// updateFolder payload
interface UpdateFolderPayload {
  folderId: string;
  updatedData: { name: string };
}

interface UpdateFolderSuccessResponse {
  message: string; // "Folder updated successfully"
}
interface UpdateFolderErrorResponse {
  message: string;
}

// Fetch notes by folder
interface FetchFolderNotesParams {
  folderId: string;
  pageNo: number;
}

// Define the Note type
interface updateNoteData {
  id: string | undefined;
  folderId?: string | undefined;
  title?: string;
  content?: string;
  search?: string;
}
interface SearchNotesResponse {
  notes: Note[];
}


// Define the Note type
export interface NoteData {
  folderId?: string;
  title?: string;
  content?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  Page?: number; //For making new Note at Top test
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


//For Creating FOlders
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


//For Updating FOlder Name
export const useUpdateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateFolderSuccessResponse,
    UpdateFolderErrorResponse,
    UpdateFolderPayload
  >({
    mutationFn: async ({ folderId, updatedData }) => {
      if (!folderId || folderId.trim() === "") {
        throw new Error("folderId is required and cannot be an empty string");
      }
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


//Folder Notes for MOre Section
export const useFetchFolderNotes = ({
  folderId,
  pageNo,
}: FetchFolderNotesParams) => {
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

  return useQuery({
    queryKey: ["folder-notes", folderId, pageNo],
    queryFn: async () => {
      const { data } = await AxiosApi.get(`/notes`, {
        params: queryParams,
      });
      return { notes: data.notes, totalNotes: data.total, PageNo: pageNo };
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



// Hook to create a new note
export const useCreateNote = () => {
  return useMutation({
    mutationFn: async (newNote: NoteData) => {
      const { data } = await AxiosApi.post(`/notes`, newNote);
      return data;
    },
  });
};

// Update note for favorite/archive status
export const useUpdateNote = (folderId: string, pageNo: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      noteId,
      updatedData,
    }: {
      noteId: string;
      updatedData: NoteData;
    }) => {
      const { data } = await AxiosApi.patch(`/notes/${noteId}`, updatedData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["note", variables.noteId] });
      queryClient.invalidateQueries({
        queryKey: ["folder-notes", folderId, pageNo],
      });
    },
  });
};

//Delete Note by Id
export const useDeleteNote = (folderId: string, pageNo: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string) => {
      await AxiosApi.delete(`/notes/${noteId}`);
    },
    onSuccess: (_, noteId) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", noteId] });
      queryClient.invalidateQueries({
        queryKey: ["folder-notes", folderId, pageNo],
      });
    },
  });
};

//Restore Note
export const useRestoreNote = (folderId: string, pageNo: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string) => {
      await AxiosApi.post(`/notes/${noteId}/restore`);
    },
    onSuccess: (_, noteId) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", noteId] });
      queryClient.invalidateQueries({
        queryKey: ["folder-notes", folderId, pageNo],
      });
    },
  });
};



// saving a note with using debounce
export const useSaveNote = (folderId: string, pageNo: number) => {
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
    onSuccess: (_, noteId) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", noteId] });
      queryClient.invalidateQueries({
        queryKey: ["folder-notes", folderId, pageNo],
      });
    },
  });
};



// notes according to search Text
export const useSearchNotes = () => {
  return useMutation<SearchNotesResponse, Error, string>({
    mutationFn: async (search) => {
      const { data } = await AxiosApi.get<SearchNotesResponse>(`/notes`, {
        params: { search },
      });
      return data;
    },
  });
};
