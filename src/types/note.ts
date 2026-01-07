export interface Note {
	id: number;
	title: string;
	content: string;
	color: string;
	imageUrls?: string[] | null;
	isFixed?: boolean;
	isKeep?: boolean;
	isDeleted?: boolean;
}

export type NewNote = Omit<Note, 'id'>;