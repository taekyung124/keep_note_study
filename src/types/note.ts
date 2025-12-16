export interface Note {
	id: number;
	title: string;
	content: string;
	color: string;
	imageUrls?: string[] | null;
}

export type NewNote = Omit<Note, 'id'>;