import { type TimelineItem } from '../types/types.ts';

const timelineItems: TimelineItem[] = [
	{
		id: 'check_in',
		title: 'Check in',
		description:
			'Check in anytime after 4 pm. We will be decorating and getting settled in to the Airbnb.',
		links: ['https://maps.app.goo.gl/TKJe7DBX2pWaj56S7'],
		start: new Date('2026-02-12T16:00:00'),
	},
	{
		id: 'first_dinner',
		title: 'Dinner',
		description: 'Cozy first night dinner at Honō Ramen (9PM)',
		links: ['https://maps.app.goo.gl/uMog82nuZCyvF8kC7'],
		start: new Date('2026-02-12T21:00:00'),
		end: new Date('2026-02-12T22:30:00'),
	},
	{
		id: 'welcome',
		title: 'Morning Welcome',
		description: 'Start the day with some coffee or tea and fun surprises for all!',
		links: ['https://maps.app.goo.gl/TKJe7DBX2pWaj56S7'],
		start: new Date('2026-02-13T09:30:00'),
	},
	{
		id: 'poze_pilates',
		title: `Galentine's Pilates`,
		description: `Private pilates class combining traditional and modern Pilates movements for a fully-body, low-impact workout.`,
		links: ['https://maps.app.goo.gl/iFygjU11LSGDaoty6'],
		start: new Date('2026-02-13T10:30:00'),
		end: new Date('2026-02-13T11:30:00'),
	},
	{
		id: 'brunch',
		title: 'Brunch',
		description: 'Classic Québécois brunch at Restaurant La Bûche.',
		links: ['https://maps.app.goo.gl/5EPRnWc15SU3Pm2B6'],
		start: new Date('2026-02-13T12:00:00'),
	},
	{
		id: 'shopping',
		title: 'Rue de Petit Champlain',
		description: `Meet artists and artisans and explore the local shops along Rue du Petit-Champlain, voted Canada's prettiest pedestrian street. It's also one of the oldest shopping streets in North America.`,
		links: ['https://maps.app.goo.gl/1xVvyZh5KVr2EgmW8'],
		start: new Date('2026-02-13T13:30:00'),
		end: new Date('2026-02-13T14:30:00'),
	},
	{
		id: 'spa',
		title: 'Nordic Spa Thermal Experience',
		description:
			'Enjoy a rejuvenating journey through varying temperatures at Strøm Spa. Bring a swimsuit, sandals, a reusable water bottle, and waterproof bag.',
		links: ['https://maps.app.goo.gl/YhWHS587rtTciA9i6'],
		start: new Date('2026-02-13T15:00:00'),
	},
	{
		id: 'second_dinner',
		title: 'Game Night, Pizza, and Olympic Skating',
		description: `Get ready for some fun and a cozy night in! There'll be games, pizza, and olympic skating.`,
		links: ['https://maps.app.goo.gl/TKJe7DBX2pWaj56S7'],
		start: new Date('2026-02-13T18:00:00'),
	},
	{
		id: 'croissants',
		title: 'Breakfast',
		description: 'Coffee, pastries, and a quick bite to start the day at Pâtisserie Chouquette.',
		links: ['https://maps.app.goo.gl/vLAZY8paZDeWobte7'],
		start: new Date('2026-02-14T10:00:00'),
	},
	{
		id: 'ice_sculptures',
		title: 'Explore the Carnaval Activities',
		description:
			'From Francophonie Park to the Ice Sculptures, take in the sights and sounds of the Carnival.',
		links: ['https://maps.app.goo.gl/bzQrosUBGjutZLHP9'],
		start: new Date('2026-02-14T11:00:00'),
		end: new Date('2026-02-14T13:30:00'),
	},
	{
		id: 'lunch',
		title: 'Lunch',
		description: 'Casual lunch with charming Canadian fare at Q de Sac.',
		links: ['https://maps.app.goo.gl/kgv3DyCGkjX66TeX9'],
		start: new Date('2026-02-14T14:00:00'),
	},
	{
		id: 'bonhomme',
		title: 'Bonhomme Ice Palace',
		description: `Visit Bonhomme's iconic ice palace and explore the winter exhibits.`,
		links: ['https://maps.app.goo.gl/DPqJ9a4LeQGCv476A'],
		start: new Date('2026-02-14T15:00:00'),
	},
	{
		id: 'parade',
		title: 'Grand Allée Night Parade',
		description:
			'The iconic Carnaval night parade along Grand Allée—lights, music, and costumes. Arrive by 6 PM for a 7 PM start.',
		links: ['https://maps.app.goo.gl/w95CyaYeK9ozTR6R7'],
		start: new Date('2026-02-14T18:00:00'),
	},
	{
		id: 'irish_bar',
		title: `Valentine's Irish Pub Dinner & Bar Hopping`,
		description: `Dinner, drinks, and pub hopping at some of Québec City's best Irish pubs. Locations: DORSAY Pub Britannique, Pub St-Patrick, Pub St-Alexandre.`,
		links: ['https://maps.app.goo.gl/XkRibVJSh6VYS6XB6'],
		start: new Date('2026-02-14T20:30:00'),
	},
	{
		id: 'goodbye',
		title: 'Goodbye & Checkout',
		start: new Date('2026-02-15T11:00:00'),
	},
];

export default timelineItems;
