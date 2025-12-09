export interface Note {
	id: number;
	title: string;
	content: string;
	color: string;
	imageUrl?: string | null;
}

export type NewNote = Omit<Note, 'id'>;