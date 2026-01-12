export type TimelineItem = {
	id: string;
	title: string;
	description?: string;
	link?: string;
	start: Date;
	end?: Date; // optional for point-in-time events
};

export type DayGroup = {
	dateKey: string; // "2026-02-13"
	date: Date;
	items: TimelineItem[];
};
