export type JeopardyQuestion = {
	id: string;
	category: string;
	value: number;
	question: string;
	image?: string;
	answer: string;
	used?: boolean;
	double?: boolean;
	final?: boolean;
};

export const jeopardyQuestions: JeopardyQuestion[] = [
	// The Leading Lady
	{
		id: 'lady-200',
		category: 'The Leading Lady',
		value: 200,
		question: `The name of Lauren's Skating group`,
		answer: 'What is Forté?',
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
		question: `The movie Lauren was in.`,
		answer: 'What is Spirited?',
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
		question: `Lauren stayed with this family while working at F1 in Florida one summer.`,
		answer: `What is her coworker's (Stephanie) fiancé's (Shane) family?`,
		double: true,
	},

	// The Secret Ingredient
	{
		id: 'ingredient-200',
		category: 'The Secret Ingredient',
		value: 200,
		question: `Lauren's go-to wine — named after an animal and a fan favorite at any gathering she's at.`,
		answer: 'What is Sheep Wine (aka The Little Sheep)?',
	},
	{
		id: 'ingredient-400',
		category: 'The Secret Ingredient',
		value: 400,
		question: `Lauren would never turn down this Japanese staple, as long as it doesn't look like worms.`,
		answer: 'What is Sushi?',
	},
	{
		id: 'ingredient-600',
		category: 'The Secret Ingredient',
		value: 600,
		question: `Lauren's favorite Japanese candy.`,
		answer: 'What is Pure Lemon Gummy Candy?',
	},
	{
		id: 'ingredient-800',
		category: 'The Secret Ingredient',
		value: 800,
		question: `Lauren is a firm believer that this food makes everything better.`,
		answer: 'What is cheese?',
	},
	{
		id: 'ingredient-1000',
		category: 'The Secret Ingredient',
		value: 1000,
		question: `Lauren refuses to eat this Japanese noodle dish, not because of the taste, but because of what it reminds her of.`,
		answer: 'What is Udon?',
	},

	// Where Were They?
	{
		id: 'where-200',
		category: 'Where Were They?',
		value: 200,
		question: 'The city that this photo was taken in.',
		image: 'src/assets/Philly.jpg',
		answer: 'Where is Philly?',
	},
	{
		id: 'where-400',
		category: 'Where Were They?',
		value: 400,
		question: 'The landmark that this photo was taken at.',
		image: 'src/assets/AntelopeCanyon.jpg',
		answer: 'Where is Antelope Canyon?',
	},
	{
		id: 'where-600',
		category: 'Where Were They?',
		value: 600,
		question: 'The landmark that this photo was taken at and the activity they were doing.',
		image: 'src/assets/FenwayPark.jpg',
		answer: 'Where is Fenway Park?',
	},
	{
		id: 'where-800',
		category: 'Where Were They?',
		value: 800,
		question: 'The name of the beach where this was taken.',
		image: 'src/assets/CarsonBeach.jpg',
		answer: 'Where is Carson Beach?',
	},
	{
		id: 'where-1000',
		category: 'Where Were They?',
		value: 1000,
		question: 'The country that this photo was taken in.',
		image: 'src/assets/Bosnia.JPG',
		answer: 'Where is Bosnia?',
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

	// Medical Mysteries
	{
		id: 'medical-200',
		category: 'Medical Mysteries',
		value: 200,
		question: `What trip did Lauren have to postpone last year because of an injury that required immediate surgery.`,
		answer: `What is Italy?`,
	},
	{
		id: 'medical-400',
		category: 'Medical Mysteries',
		value: 400,
		question: `In what country did Lauren get blood poisoning?`,
		answer: `What is Mexico?`,
	},
	{
		id: 'medical-600',
		category: 'Medical Mysteries',
		value: 600,
		question: `Lauren broke this part of her body when she was on Disney on Ice but the show must go on.`,
		answer: 'What is her shoulder?',
	},
	{
		id: 'medical-800',
		category: 'Medical Mysteries',
		value: 800,
		question: `The activity Lauren was doing when she broke her back was this.`,
		answer: 'What is horseback riding?',
	},
	{
		id: 'medical-1000',
		category: 'Medical Mysteries',
		value: 1000,
		question: `Lauren's favorite part of her body.`,
		answer: '[CONFIRM]',
	},

	// Back In The Day
	{
		id: 'childhood-200',
		category: 'Back In The Day',
		value: 200,
		question: `What was Lauren's favorite subject in school?`,
		answer: 'What is History or English?',
	},
	{
		id: 'childhood-400',
		category: 'Back In The Day',
		value: 400,
		question: `This is Lauren's childhood nickname.`,
		answer: 'Smedley',
	},
	{
		id: 'childhood-600',
		category: 'Back In The Day',
		value: 600,
		question: `She was obsessed with collecting these as a kid.`,
		answer: 'What are seashells?',
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
		question: `Growing up, Lauren and her mom had a special, invisible snack they would make together. This is what it was called.`,
		answer: 'What are arm sandwiches?',
	},

	// Love Birds
	{
		id: 'birds-200',
		category: 'Love Birds',
		value: 200,
		question: `This is where Lauren and Neal went on their first date.`,
		answer: `What is King's bowling Alley in Back Bay?`,
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
		question: `The name of the app that they met on and the name of the person who made the first move.`,
		answer: 'Hinge, Megan',
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
		answer: 'What is "my bebe"?',
	},

	// Final Jeopardy: Meant to Be
	{
		id: 'final-500',
		category: 'Meant to Be',
		value: 500,
		question: `In his own words, this is what Neal said when asked what he is most looking forward to about spending the rest of his life with Lauren."`,
		answer: '[CONFIRM: Ask Neal]',
		final: true,
	},
];
