export type JeopardyQuestion = {
	id: string;
	category: string;
	value: number;
	question: string;
	answer: string;
	used?: boolean;
};

export const jeopardyQuestions: JeopardyQuestion[] = [
	// The Leading Lady
	{
		id: 'lady-200',
		category: 'The Leading Lady',
		value: 200,
		question: `This is Lauren's formal job title.`,
		answer: 'What is Manager, Events & Sponsorships?',
	},
	{
		id: 'lady-400',
		category: 'The Leading Lady',
		value: 400,
		question: `Lauren is a self-described fan of this corner of the internet, known for obsessing over fantasy romance novels.`,
		answer: 'What is BookTok?',
	},
	{
		id: 'lady-600',
		category: 'The Leading Lady',
		value: 600,
		question: `Lauren's job means she's no stranger to this — she loves watching heated rivalries play out live.`,
		answer: 'What is sports/live events? [CONFIRM: get more specific if possible]',
	},
	{
		id: 'lady-800',
		category: 'The Leading Lady',
		value: 800,
		question: `This is the neighborhood Lauren moved to when she first moved back to Boston for BU--hint: she had roommates.`,
		answer: 'What is Coolidge Corner?',
	},
	{
		id: 'lady-1000',
		category: 'The Leading Lady',
		value: 1000,
		question: `[CONFIRM: Add the most niche or insider fact about Lauren — something only her closest people would know]`,
		answer: '[CONFIRM]',
	},

	// The Secret Ingredient
	{
		id: 'ingredient-200',
		category: 'The Secret Ingredient',
		value: 200,
		question: `Lauren's go-to wine — named after an animal and a fan favorite at any gathering she's at.`,
		answer: "What is Sheep Wine (aka The Wolftrap or [CONFIRM: full name of 'sheep wine'])?",
	},
	{
		id: 'ingredient-400',
		category: 'The Secret Ingredient',
		value: 400,
		question: `This is the one food Lauren could eat every single day for a week without getting sick of it.`,
		answer: 'What is sushi? [CONFIRM: verify with Lauren — could also be cheese or Italian]',
	},
	{
		id: 'ingredient-600',
		category: 'The Secret Ingredient',
		value: 600,
		question: `Lauren's favorite Japanese candy.`,
		answer: 'Pure Lemon flavor',
	},
	{
		id: 'ingredient-800',
		category: 'The Secret Ingredient',
		value: 800,
		question: `Lauren is a firm believer that this food group makes everything better.`,
		answer: 'What is cheese?',
	},
	{
		id: 'ingredient-1000',
		category: 'The Secret Ingredient',
		value: 1000,
		question: `When Lauren is celebrating, she's reaching for one of these three things. Name any one of them for full points — all three for bonus bragging rights.`,
		answer: 'What is beer, wine, or a cocktail?',
	},

	// Where Were They?
	{
		id: 'where-200',
		category: 'Where Were They?',
		value: 200,
		question: '[CONFIRM: Photo 1 — add question once photos are selected]',
		answer: '[CONFIRM]',
	},
	{
		id: 'where-400',
		category: 'Where Were They?',
		value: 400,
		question: '[CONFIRM: Photo 2 — add question once photos are selected]',
		answer: '[CONFIRM]',
	},
	{
		id: 'where-600',
		category: 'Where Were They?',
		value: 600,
		question: '[CONFIRM: Photo 3 — add question once photos are selected]',
		answer: '[CONFIRM]',
	},
	{
		id: 'where-800',
		category: 'Where Were They?',
		value: 800,
		question: '[CONFIRM: Photo 4 — add question once photos are selected]',
		answer: '[CONFIRM]',
	},
	{
		id: 'where-1000',
		category: 'Where Were They?',
		value: 1000,
		question: '[CONFIRM: Photo 5 — add question once photos are selected]',
		answer: '[CONFIRM]',
	},

	// The Wedding Countdown
	{
		id: 'countdown-200',
		category: 'The Wedding Countdown',
		value: 200,
		question: `Lauren and Neal's wedding venue sits on its own private island in this country.`,
		answer: 'What is Ireland?',
	},
	{
		id: 'countdown-400',
		category: 'The Wedding Countdown',
		value: 400,
		question: `Waterford Castle has been home to this noble Irish family for over eight centuries before it became a hotel.`,
		answer: 'Who are the Fitzgeralds?',
	},
	{
		id: 'countdown-600',
		category: 'The Wedding Countdown',
		value: 600,
		question: `Guests arriving at Waterford Castle can only reach the island this way — no bridge required.`,
		answer: 'What is a private ferry?',
	},
	{
		id: 'countdown-800',
		category: 'The Wedding Countdown',
		value: 800,
		question: `[CONFIRM: Add a personal wedding detail — colors, something borrowed, a fun wedding plan Lauren has mentioned]`,
		answer: '[CONFIRM]',
	},
	{
		id: 'countdown-1000',
		category: 'The Wedding Countdown',
		value: 1000,
		question: `[CONFIRM: Honeymoon destination — once you find out where they're going!]`,
		answer: '[CONFIRM]',
	},

	// Back In The Day
	{
		id: 'childhood-200',
		category: 'Back In The Day',
		value: 200,
		question: `What was Lauren's favorite subject in school?`,
		answer: '[CONFIRM]',
	},
	{
		id: 'childhood-400',
		category: 'Back In The Day',
		value: 400,
		question: `Her family nickname growing up.`,
		answer: '[CONFIRM]',
	},
	{
		id: 'childhood-600',
		category: 'Back In The Day',
		value: 600,
		question: `She was obsessed with collecting these as a kid — her room was full of them.`,
		answer: '[CONFIRM]',
	},
	{
		id: 'childhood-800',
		category: 'Back In The Day',
		value: 800,
		question: `This is what Lauren wanted to be when she grew up.`,
		answer: '[CONFIRM]',
	},
	{
		id: 'childhood-1000',
		category: 'Back In The Day',
		value: 1000,
		question: `Lauren and her mom had a signature snack they made together that most people had never heard of — until a certain boat weekend revealed the truth. This is what they were called.`,
		answer: 'What are arm sandwiches?',
	},

	// Love Birds
	{
		id: 'birds-200',
		category: 'Love Birds',
		value: 200,
		question: `This is where Lauren and Neal went on their first date.`,
		answer: '[CONFIRM]',
	},
	{
		id: 'birds-400',
		category: 'Love Birds',
		value: 400,
		question: `When asked how he knew she was the one, Neal said it was the moment she did THIS.`,
		answer: '[CONFIRM: Ask Neal]',
	},
	{
		id: 'birds-600',
		category: 'Love Birds',
		value: 600,
		question: `They had been together this long when Neal proposed.`,
		answer: '[CONFIRM: ~4-5 years — verify with them]',
	},
	{
		id: 'birds-800',
		category: 'Love Birds',
		value: 800,
		question: `Neal's answer when asked what his favorite thing about Lauren is — straight from the source.`,
		answer: '[CONFIRM: Ask Neal]',
	},
	{
		id: 'birds-1000',
		category: 'Love Birds',
		value: 1000,
		question: `This is the word Lauren used to describe Neal when we asked her without warning — she had no time to think!`,
		answer: '[CONFIRM: Ask Lauren casually]',
	},
];
