// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = "/api";

interface RecentNotesResponse {
  recentNotes: Note[]; // Assuming API returns an object with a `recentNotes` array
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

// Fetch recent notes
export const useFetchRecentNotes = () => {
  return useQuery<RecentNotesResponse>({
    queryKey: ["recent-notes"], // queryKey should be inside an object
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/notes/recent`);
      return data;
    },
    staleTime: 5 * 60 * 1000, // Optional: Cache time in milliseconds
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

// // Fetch notes by folder
// export const useFetchFolderNotes = (folderId) => {
//   return useQuery(
//     ["folder", folderId],
//     async () => {
//       const { data } = await axios.get(`${API_BASE_URL}/notes`, {
//         params: { folderId },
//       });
//       return data;
//     },
//     { enabled: !!folderId, staleTime: 5 * 60 * 1000 }
//   );
// };

// // Fetch single note
// export const useFetchNote = (noteId) => {
//   return useQuery(
//     ["note", noteId],
//     async () => {
//       const { data } = await axios.get(`${API_BASE_URL}/notes/${noteId}`);
//       return data;
//     },
//     { enabled: !!noteId }
//   );
// };

// // Create new note
// export const useCreateNote = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     async (newNote) => {
//       const { data } = await axios.post(`${API_BASE_URL}/notes`, newNote);
//       return data;
//     },
//     {
//       onSuccess: () => queryClient.invalidateQueries("notes"),
//     }
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

// // Fetch all folders
// export const useFetchFolders = () => {
//   return useQuery(
//     "folders",
//     async () => {
//       const { data } = await axios.get(`${API_BASE_URL}/folders`);
//       return data;
//     },
//     { staleTime: 5 * 60 * 1000 }
//   );
// };

// // Fetch single folder
// export const useFetchFolder = (folderId) => {
//   return useQuery(
//     ["folder", folderId],
//     async () => {
//       const { data } = await axios.get(`${API_BASE_URL}/folders/${folderId}`);
//       return data;
//     },
//     { enabled: !!folderId }
//   );
// };

// // Create new folder
// export const useCreateFolder = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     async (newFolder) => {
//       const { data } = await axios.post(`${API_BASE_URL}/folders`, newFolder);
//       return data;
//     },
//     {
//       onSuccess: () => queryClient.invalidateQueries("folders"),
//     }
//   );
// };

// // Update folder name
// export const useUpdateFolder = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     async ({ folderId, updatedData }) => {
//       const { data } = await axios.patch(
//         `${API_BASE_URL}/folders/${folderId}`,
//         updatedData
//       );
//       return data;
//     },
//     {
//       onSuccess: () => queryClient.invalidateQueries("folders"),
//     }
//   );
// };

// // Delete folder
// export const useDeleteFolder = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     async (folderId) => {
//       await axios.delete(`${API_BASE_URL}/folders/${folderId}`);
//     },
//     {
//       onSuccess: () => queryClient.invalidateQueries("folders"),
//     }
//   );
// };
