import axios from "../axiosInstance";
import MockAdapter from "axios-mock-adapter";
import { Note, NewNote } from "../../types/note";
import { Color } from "../../types/color";

const mock = new MockAdapter(axios, { delayResponse: 300 });

const LOCAL_STORAGE_KEY = "mock_notes";

let initialNotes: Note[] = [
	{ id: 1, title: "첫 메모", content: "내용 와랄ㄹ라와랄라 내용 와랄ㄹ라와랄라 내용 와랄ㄹ라와랄라", color: Color.SALMON, isFixed: false, isDeleted: false },
	{ id: 2, title: "두번째 메모", content: "내용 와랄ㄹ라와랄라내용 와랄ㄹ라와랄라", color: Color.ORANGE, isFixed: false, isDeleted: false },
	{ id: 3, title: "세번째 메모", content: "내용 와랄ㄹ라와랄라 내용 와랄ㄹ라와랄라 내용 와랄ㄹ라와랄라", color: Color.YELLOW, isFixed: false, isDeleted: false },
	{ id: 4, title: "네번째 메모", content: "내용 와랄ㄹ라와랄라 내용 와랄ㄹ라와랄라", color: Color.GREEN, isFixed: false, isDeleted: false },
];

const getNotesFromStorage = (): Note[] => {
	const data = localStorage.getItem(LOCAL_STORAGE_KEY);
	return data ? JSON.parse(data) : initialNotes;
};

const saveNotesToStorage = (currentNotes: Note[]) => {
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentNotes));
};

// 최초 로드 시 초기 데이터가 없다면 저장
if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
	saveNotesToStorage(initialNotes);
}

// 메모 조회 (GET)
mock.onGet("/notes").reply(200, () => {
	const notes = getNotesFromStorage();
	return [200, notes];
});

// 메모 추가 (POST)
mock.onPost("/notes").reply((config) => {
	let notes = getNotesFromStorage();
	const data: NewNote = JSON.parse(config.data);
	const newNote: Note = {
		id: Date.now(),
		...data,
		isFixed: data.isFixed || false,
		isKeep: data.isKeep || false,
		isDeleted: false,
		color: data.color || Color.TRANSPARENT
	};
	notes.push(newNote);
	saveNotesToStorage(notes);
	return [200, newNote];
});

// 메모 수정 (PATCH)
mock.onPatch(/\/notes\/\d+/).reply((config) => {
	let notes = getNotesFromStorage();
	const id = Number(config.url!.split("/").pop());
	const data = JSON.parse(config.data);

	let updatedNote: Note | undefined;
	let found = false;

	// 메모 찾아서 업데이트하고 새로운 배열 생성
	const newNotes: Note[] = notes.map((n) => {
		if (n.id === id) {
			updatedNote = { ...n, ...data };
			found = true;
			return updatedNote;
		}
		return n;
	}) as Note[];

	// 업데이트된 메모가 있다면 저장하고 응답
	if (found && updatedNote) {
		saveNotesToStorage(newNotes);
		return [200, updatedNote];
	}

	return [404];
});

// 메모 삭제 (DELETE)
mock.onDelete(/\/notes\/\d+/).reply((config) => {
	let notes = getNotesFromStorage();
	const id = Number(config.url!.split("/").pop());

	const newNotes: Note[] = notes.filter((n) => n.id !== id);

	saveNotesToStorage(newNotes);
	return [200];
});

// 이미지 추가
mock.onPost(/\/notes\/\d+\/upload-image/).reply((config) => {
	let notes = getNotesFromStorage();
	const id = Number(config.url!.split("/")[2]);

	const tempImageUrl = `https://picsum.photos/400/200?noteId=${id}&t=${Date.now()}`;

	let updatedNote: Note | undefined;
	let found = false;

	// 메모 찾아서 imageUrls 배열 업데이트
	const newNotes: Note[] = notes.map((n) => {
		if (n.id === id) {
			const currentImageUrls = n.imageUrls || []; // null/undefined일 경우 빈 배열로 처리

			updatedNote = {
				...n,
				imageUrls: [...currentImageUrls, tempImageUrl]
			};

			found = true;
			return updatedNote;
		}
		return n;
	}) as Note[];

	if (found && updatedNote) {
		saveNotesToStorage(newNotes);
		return [200, updatedNote];
	}

	return [404, { message: "Note not found for image upload." }];
});

export default mock;