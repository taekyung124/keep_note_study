// src/api/mock/notes.mock.ts
import axios from "../axiosInstance";
import MockAdapter from "axios-mock-adapter";
import { Note, NewNote } from "../../types/note"; // 💡 타입 임포트

const mock = new MockAdapter(axios, { delayResponse: 300 });

// 💡 초기 메모 데이터에도 타입 지정
let notes: Note[] = [
	{ id: 1, title: "첫 메모", content: "내용 와랄ㄹ라와랄라 내용 와랄ㄹ라와랄라 내용 와랄ㄹ라와랄라", color: "#fff" },
	{ id: 2, title: "두번째 메모", content: "내용 와랄ㄹ라와랄라내용 와랄ㄹ라와랄라", color: "#ccc" },
	{ id: 3, title: "세번째 메모", content: "내용 와랄ㄹ라와랄라 내용 와랄ㄹ라와랄라 내용 와랄ㄹ라와랄라", color: "#fff" },
	{ id: 4, title: "네번째 메모", content: "내용 와랄ㄹ라와랄라 내용 와랄ㄹ라와랄라", color: "#ccc" },
];

// GET /notes: 전체 메모 조회
mock.onGet("/notes").reply(200, notes);

// POST /notes: 새 메모 추가
mock.onPost("/notes").reply((config) => {
	const data: NewNote = JSON.parse(config.data);
	const newNote: Note = { id: Date.now(), ...data };
	notes.push(newNote);
	return [200, newNote];
});

// PATCH /notes/:id: 메모 수정
mock.onPatch(/\/notes\/\d+/).reply((config) => {
	const id = Number(config.url!.split("/").pop());
	const data = JSON.parse(config.data);
	notes = notes.map((n) => (n.id === id ? { ...n, ...data } : n));
	// 💡 수정된 메모만 반환하도록 변경
	const updatedNote = notes.find((n) => n.id === id);
	return updatedNote ? [200, updatedNote] : [404];
});

// DELETE /notes/:id: 메모 삭제
mock.onDelete(/\/notes\/\d+/).reply((config) => {
	const id = Number(config.url!.split("/").pop());
	notes = notes.filter((n) => n.id !== id);

	// 💡 메모가 있든 없든, 요청 자체는 성공했다고 간주하고 200을 반환합니다.
	return [200];
});
export default mock;