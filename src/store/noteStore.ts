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
	deleteNote: (id: number) => Promise<void>; // 휴지통에서 영구삭제
	deleteNoteAll: () => Promise<void>;
	updateNote: (id: number, updateData: Partial<Note>) => Promise<void>;
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

	// [영구 삭제]
	deleteNote: async (id) => {
		try {
			await axios.delete(`/notes/${id}`);
			set((state) => ({
				notes: state.notes.filter(note => note.id !== id)
			}));
		} catch (err) {
			console.error('메모 영구 삭제 실패', err);
			throw err;
		}
	},

	// [영구 삭제] 전체삭제
	deleteNoteAll: async () => {
		const { notes } = get();
		const deletedIds = notes.filter(n => n.isDeleted).map(n => n.id);

		if (deletedIds.length === 0) return;

		try {
			await Promise.all(deletedIds.map(id => axios.delete(`/notes/${id}`)));

			set((state) => ({
				notes: state.notes.filter(note => !deletedIds.includes(note.id))
			}));
		} catch (err) {
			console.error('휴지통 비우기 실패', err);
			throw err;
		}
	},

	// [업데이트] 휴지통으로 보내기(isDeleted: true) 또는 복구(isDeleted: false) 시 사용
	updateNote: async (id, updateData) => {
		try {
			const res = await axios.patch<Note>(`/notes/${id}`, updateData);

			set((state) => ({
				notes: state.notes.map((note) =>
					note.id === id ? { ...note, ...res.data } : note
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