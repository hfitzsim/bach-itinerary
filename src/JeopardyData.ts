export type JeopardyQuestion = {
	id: string;
	category: string;
	value: number;
	question: string;
	answer: string;
	used?: boolean;
};

export const jeopardyQuestions: JeopardyQuestion[] = [
	// 💕 Love Story Lore
	{
		id: 'love-200',
		category: '💕 Love Story Lore',
		value: 200,
		question: 'Where did they first meet?',
		answer: 'Kings Bowling Alley in Back Bay',
	},
	{
		id: 'love-400',
		category: '💕 Love Story Lore',
		value: 400,
		question: 'Who made the first move?',
		answer:
			'Megan! Lauren was driving back from NH, swiping for her, matched with Neal, and Megan sent the first message',
	},
	{
		id: 'love-600',
		category: '💕 Love Story Lore',
		value: 600,
		question: 'What was their first fight about?',
		answer: 'Lauren’s laundry pile in Neal’s apartment',
	},
	{
		id: 'love-800',
		category: '💕 Love Story Lore',
		value: 800,
		question: 'What trip solidified the “oh wow, this is serious” moment?',
		answer:
			'Acadia, specifically the Salmon Festival, Northeast point of the continental US, locals-only vibes, hours of driving, tiniest Main Street',
	},
	{
		id: 'love-1000',
		category: '💕 Love Story Lore',
		value: 1000,
		question: 'Who said “I love you” first?',
		answer: 'Neal',
	},

	// 💍 Who Said It?
	{
		id: 'said-200',
		category: '💍 Who Said It?',
		value: 200,
		question: '“I’m not hungry” but then eats half your fries?',
		answer: 'Lauren',
	},
	{
		id: 'said-400',
		category: '💍 Who Said It?',
		value: 400,
		question: '“We should probably leave by 9.”',
		answer: 'Neal',
	},
	{
		id: 'said-600',
		category: '💍 Who Said It?',
		value: 600,
		question: '“Do we really need another throw pillow?”',
		answer: 'Neal',
	},
	{
		id: 'said-800',
		category: '💍 Who Said It?',
		value: 800,
		question: '“I’ll do it tomorrow.” (said at least 3 tomorrows ago)',
		answer: 'Lauren',
	},
	{
		id: 'said-1000',
		category: '💍 Who Said It?',
		value: 1000,
		question: '“This is my comfort show.”',
		answer: 'Lauren',
	},

	// 🧠 Groomology 101
	{
		id: 'groom-200',
		category: '🧠 Groomology 101',
		value: 200,
		question: 'What is his most irrational pet peeve?',
		answer: 'Cleaning',
	},
	{
		id: 'groom-400',
		category: '🧠 Groomology 101',
		value: 400,
		question: 'What food will he never get tired of?',
		answer: 'Chinese buffet',
	},
	{
		id: 'groom-600',
		category: '🧠 Groomology 101',
		value: 600,
		question: 'What’s the first thing he does when he wakes up on a weekend?',
		answer: 'Chug water',
	},
	{
		id: 'groom-800',
		category: '🧠 Groomology 101',
		value: 800,
		question: 'What hobby does he swear he’ll “get back into”?',
		answer: 'Basketball',
	},
	{
		id: 'groom-1000',
		category: '🧠 Groomology 101',
		value: 1000,
		question: 'What would he absolutely bring to a deserted island (non-essential item)?',
		answer: 'Lauren’s dad',
	},

	// 👀 Unpopular Opinions
	{
		id: 'opinion-200',
		category: '👀 Unpopular Opinions',
		value: 200,
		question: 'Who runs hotter? (always warm vs always cold)',
		answer: 'Neal',
	},
	{
		id: 'opinion-400',
		category: '👀 Unpopular Opinions',
		value: 400,
		question: 'Who takes longer to get ready?',
		answer: 'Lauren',
	},
	{
		id: 'opinion-600',
		category: '👀 Unpopular Opinions',
		value: 600,
		question: 'Who is more likely to Google something they already know?',
		answer: 'Neal',
	},
	{
		id: 'opinion-800',
		category: '👀 Unpopular Opinions',
		value: 800,
		question: 'Who is more competitive?',
		answer: 'Both',
	},
	{
		id: 'opinion-1000',
		category: '👀 Unpopular Opinions',
		value: 1000,
		question: 'Who secretly enjoys being right a little too much?',
		answer: 'Neal',
	},
];
