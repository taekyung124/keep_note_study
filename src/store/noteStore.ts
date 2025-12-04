// src/store/noteStore.ts
import { create, StateCreator } from "zustand";
import { persist, StateStorage } from "zustand/middleware"; // 💡 persist, StateStorage 임포트
import axios from "../api/axiosInstance";
import { Note, NewNote } from "../types/note";

// 1. NoteState 인터페이스 (변경 없음)
interface NoteState {
	notes: Note[];
	fetchNotes: () => Promise<void>;
	addNote: (data: NewNote) => Promise<void>;
	deleteNote: (id: number) => Promise<void>;
}

// 2. NoteStateCreator 정의 (persist 미들웨어에 전달할 함수)
// 이 함수는 'set' 뿐만 아니라 'get' 함수도 사용할 수 있도록 StateCreator<NoteState>로 타입 지정
const noteStoreCreator: StateCreator<NoteState> = (set, get) => ({
	notes: [],

	// fetchNotes 액션 수정:
	// 로컬 스토리지에 데이터가 없는 경우에만 API에서 가져오도록 수정
	fetchNotes: async () => {
		// notes 상태가 이미 로컬 스토리지에서 로드된 경우 (persist가 처리)
		// 그리고 notes 배열이 비어있는 경우에만 (초기 로드 시) API에서 가져옵니다.
		// **중요**: 실제 사용 환경에서는 API와 LocalStorage 동기화 전략에 따라 이 로직이 달라질 수 있습니다.
		// 여기서는 LocalStorage가 비어있을 때만 API를 호출하도록 간단히 구현합니다.
		if (get().notes.length === 0) {
			try {
				const res = await axios.get<Note[]>("/notes");
				// API에서 가져온 데이터로 상태 업데이트
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

// 3. create 함수에 persist 미들웨어 적용
export const useNoteStore = create<NoteState>()(
	// persist 함수를 create 함수처럼 사용하고, 인자로 noteStoreCreator와 설정을 전달합니다.
	persist(
		noteStoreCreator,
		{
			name: "note-storage", // 💡 localStorage에 저장될 키 이름 (필수)
			// version: 1, // 필요에 따라 스토어 버전 관리 가능
			// storage: createJSONStorage(() => localStorage), // 기본값: localStorage

			// 💡 주의: 비동기 로직이 있는 'fetchNotes', 'addNote', 'deleteNote'는
			// Zustand의 기본 persist 대상이 아닙니다. (State만 저장 대상)
			// 다만, 우리는 notes 상태만 저장하면 되므로 별도의 설정 없이 notes가 저장됩니다.
			// 만약 특정 필드만 저장하고 싶다면, `partialize` 옵션을 사용할 수 있습니다.

			// notes 필드만 localStorage에 저장합니다. (선택 사항이지만 명시적으로 권장)
			partialize: (state) => ({ notes: state.notes }),

			// API 호출 부분과 LocalStorage 저장 부분을 분리하는 것이 이상적입니다.
			// 현재의 설계(API 호출 후 set)에서는 notes 상태만 저장하는 것이 최선입니다.
		}
	)
);