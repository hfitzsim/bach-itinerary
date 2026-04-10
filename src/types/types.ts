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

export type Team = {
	name: string;
	score: number;
};

export type BuzzEntry = {
	teamName: string;
	timestamp: number;
};

export type GameState = {
	teams: Team[];
	buzzQueue: BuzzEntry[]; // ordered by time — first buzzer is first
	activeQuestionValue: number | null;
	buzzerLocked: boolean; // true while host is judging an answer
};

export type ServerMessage =
	| { type: 'state'; state: GameState } // full state sync on connect + after every change
	| { type: 'buzz-received'; teamName: string; position: number }; // position in queue (1 = first)
