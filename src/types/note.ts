export interface Note {
	id: number;
	title: string;
	content: string;
	color: string;
}

export type NewNote = Omit<Note, 'id'>;