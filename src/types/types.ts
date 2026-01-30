import { type ReactNode } from 'react';

export type NavItem =
	| {
			id: string;
			label: string;
			icon: ReactNode;
			href: string;
	  }
	| {
			id: string;
			label: string;
			icon: ReactNode;
			onClick: () => void;
	  };

export type TimelineItem = {
	id: string;
	title: string;
	description?: string;
	links?: string[];
	start: Date;
	end?: Date; // optional for point-in-time events
};

export type DayGroup = {
	dateKey: string; // "2026-02-13"
	date: Date;
	items: TimelineItem[];
};
