import axios from "../axiosInstance";
import MockAdapter from "axios-mock-adapter";
import { Note, NewNote } from "../../types/note";
import { Color } from "../../types/color";

const mock = new MockAdapter(axios, { delayResponse: 300 });

let notes: Note[] = [
	{ id: 1, title: "첫 메모", content: "내용 와랄ㄹ라와랄라 내용 와랄ㄹ라와랄라 내용 와랄ㄹ라와랄라", color: Color.SALMON },
	{ id: 2, title: "두번째 메모", content: "내용 와랄ㄹ라와랄라내용 와랄ㄹ라와랄라", color: Color.ORANGE },
	{ id: 3, title: "세번째 메모", content: "내용 와랄ㄹ라와랄라 내용 와랄ㄹ라와랄라 내용 와랄ㄹ라와랄라", color: Color.YELLOW },
	{ id: 4, title: "네번째 메모", content: "내용 와랄ㄹ라와랄라 내용 와랄ㄹ라와랄라", color: Color.GREEN },
];

mock.onGet("/notes").reply(200, notes);

mock.onPost("/notes").reply((config) => {
	const data: NewNote = JSON.parse(config.data);
	const newNote: Note = { id: Date.now(), ...data };
	notes.push(newNote);
	return [200, newNote];
});

// 메모 수정
mock.onPatch(/\/notes\/\d+/).reply((config) => {
	const id = Number(config.url!.split("/").pop());
	const data = JSON.parse(config.data);
	notes = notes.map((n) => (n.id === id ? { ...n, ...data } : n));
	// 수정된 메모 반환
	const updatedNote = notes.find((n) => n.id === id);
	return updatedNote ? [200, updatedNote] : [404];
});

// 메모 삭제
mock.onDelete(/\/notes\/\d+/).reply((config) => {
	const id = Number(config.url!.split("/").pop());
	notes = notes.filter((n) => n.id !== id);
	// 삭제 처리
	return [200];
});
export default mock;