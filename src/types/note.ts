export interface Note {
	id: number;
	title: string;
	content: string;
	color: string;
	imageUrls?: string[] | null;
	isFixed?: boolean;
}

export type NewNote = Omit<Note, 'id'>;