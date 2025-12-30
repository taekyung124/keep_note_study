import { create, StateCreator } from "zustand";
import { persist, StateStorage } from "zustand/middleware";
import axios from "../api/axiosInstance";
import { Note, NewNote } from "../types/note";

interface NoteState {
	notes: Note[];
	loading: boolean;
	error: string | null;
	fetchNotes: () => Promise<void>;
	addNote: (data: NewNote) => Promise<void>;
	deleteNote: (id: number) => Promise<void>;
	updateNote: (id: number, updateData: Partial<Note>) => void;
	_hasHydrated: boolean;
}

const noteStoreCreator: StateCreator<NoteState> = (set, get) => ({
	notes: [],
	loading: false,
	error: null,
	_hasHydrated: false,

	fetchNotes: async () => {
		set({ loading: false, error: null });
		console.log("메모 로드 완료 (Persist 미들웨어 사용)");
	},

	addNote: async (data: NewNote) => {
		try {
			const res = await axios.post<Note>("/notes", data);
			set((state) => ({ notes: [...state.notes, res.data] }));
		} catch (err) {
			console.error('메모 추가 실패', err);
		}
	},

	deleteNote: async (id) => {
		try {
			await axios.delete(`/notes/${id}`);
			set((state) => ({
				notes: state.notes.filter(note => note.id !== id)
			}));
		} catch (err) {
			console.error('메모 삭제 실패', err);
			throw err;
		}
	},

	updateNote: async (id, updateData) => {
		try {
			const res = await axios.patch<Note>(`/notes/${id}`, updateData);

			set((state) => ({
				notes: state.notes.map((note) =>
					note.id === id ? res.data : note
				),
			}));
		} catch (err) {
			console.error('메모 업데이트 실패', err);
		}
	},
});

export const useNoteStore = create<NoteState>()(
	persist(
		noteStoreCreator,
		{
			name: "note-storage",
			partialize: (state) => ({ notes: state.notes }),
			onRehydrateStorage: () => (state) => {
				if (state) {
					state._hasHydrated = true;

					console.log("Hydration complete. _hasHydrated set to true.");
				}
			},
		}
	)
);