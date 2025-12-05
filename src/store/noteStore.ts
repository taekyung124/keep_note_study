import { create, StateCreator } from "zustand";
import { persist, StateStorage } from "zustand/middleware";
import axios from "../api/axiosInstance";
import { Note, NewNote } from "../types/note";

interface NoteState {
	notes: Note[];
	fetchNotes: () => Promise<void>;
	addNote: (data: NewNote) => Promise<void>;
	deleteNote: (id: number) => Promise<void>;
}

const noteStoreCreator: StateCreator<NoteState> = (set, get) => ({
	notes: [],

	fetchNotes: async () => {
		if (get().notes.length === 0) {
			try {
				const res = await axios.get<Note[]>("/notes");
				set({ notes: res.data });
			} catch (error) {
				console.error("API에서 메모 로드 실패:", error);
			}
		}
	},

	addNote: async (data: NewNote) => {
		const res = await axios.post<Note>("/notes", data);
		set((state) => ({ notes: [...state.notes, res.data] }));
	},

	deleteNote: async (id) => {
		await axios.delete(`/notes/${id}`);
		set((state) => ({
			notes: state.notes.filter(note => note.id !== id)
		}));
	},
});

export const useNoteStore = create<NoteState>()(
	persist(
		noteStoreCreator,
		{
			name: "note-storage",
			partialize: (state) => ({ notes: state.notes }),
		}
	)
);