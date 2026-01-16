import '@mantine/core/styles.css';
import {
	MantineProvider,
	AppShell,
	Title,
	Container,
	Flex,
	Anchor,
	ThemeIcon,
	Group,
} from '@mantine/core';
import { useHeadroom, useMediaQuery } from '@mantine/hooks';
import { theme } from './theme.ts';
import { LivingTimelineByDay } from './Timeline.tsx';
import { type TimelineItem } from './types.ts';
import { IconHome2, IconReportMoney } from '@tabler/icons-react';

const timelineItems: TimelineItem[] = [
	{
		id: 'check_in',
		title: 'Check in',
		description:
			'Check in anytime after 4 pm. We will be decorating and getting settled in to the Airbnb.',
		links: ['https://maps.app.goo.gl/TKJe7DBX2pWaj56S7'],
		start: new Date('2026-02-12T20:30:00'),
		end: new Date('2026-02-12T22:00:00'),
	},
	{
		id: 'dinner1',
		title: 'Dinner',
		description: 'Options: Birra & Basta (8:30 PM) OR Honō Ramen (9PM)',
		links: [
			'https://maps.app.goo.gl/mHJ2S8JdZtpZcN8k8',
			'https://maps.app.goo.gl/uMog82nuZCyvF8kC7',
		],
		start: new Date('2026-02-12T20:30:00'),
	},
	{
		id: 'welcome',
		title: 'Morning Welcome',
		description: 'Start the day with some coffee or tea and fun surprises for all!',
		links: ['https://maps.app.goo.gl/TKJe7DBX2pWaj56S7'],
		start: new Date('2026-02-13T09:00:00'),
	},
	{
		id: 'exercise',
		title: 'Pilates Class',
		description: 'TBD',
		start: new Date('2026-02-13T09:30:00'),
		end: new Date('2026-02-13T10:30:00'),
	},
	{
		id: 'brunch',
		title: 'Brunch',
		description: 'Classic Québécois brunch at Restaurant La Bûche.',
		links: ['https://maps.app.goo.gl/5EPRnWc15SU3Pm2B6'],
		start: new Date('2026-02-13T12:00:00'),
	},
	{
		id: 'explore',
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
			'Enjoy a rejuvenating journey through varying temperatures. Bring a swimsuit, sandals, a reusable water bottle, and waterproof bag.',
		links: ['https://maps.app.goo.gl/YhWHS587rtTciA9i6'],
		start: new Date('2026-02-13T15:00:00'),
	},
	{
		id: 'night_in',
		title: 'Game Night, Pizza, and Olympic Skating',
		description: `Get ready for some fun and a cozy night in! There'll be games, pizza, and olympic skating.`,
		links: ['https://maps.app.goo.gl/TKJe7DBX2pWaj56S7'],
		start: new Date('2026-02-13T17:30:00'),
	},
	{
		id: 'croissants',
		title: 'Quick Breakfast',
		description: 'Coffee, croissants, and a quick bite to start the day at Pâtisserie Chouquette.',
		links: ['https://maps.app.goo.gl/vLAZY8paZDeWobte7'],
		start: new Date('2026-02-14T10:00:00'),
	},
	{
		id: 'carnaval_games',
		title: 'Carnaval Games & Activities',
		description: 'Location: Espace 400e.',
		links: ['https://maps.app.goo.gl/61rxFLSfSBYgwPxZ6'],
		start: new Date('2026-02-14T11:00:00'),
		end: new Date('2026-02-14T13:30:00'),
	},
	{
		id: 'lunch',
		title: 'Lunch',
		description: 'Casual lunch and drinks at Q de Sac.',
		links: ['https://maps.app.goo.gl/kgv3DyCGkjX66TeX9'],
		start: new Date('2026-02-14T14:00:00'),
	},
	{
		id: 'bonhomme',
		title: `Visit Bonhomme's iconic ice palace and explore the winter exhibits.`,
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
		title: 'Irish Pub Dinner & Bar Hopping',
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

function App() {
	const pinned = useHeadroom({ fixedAt: 120 });
	const isXs = useMediaQuery('(max-width: 600px)', true);

	return (
		<MantineProvider theme={theme}>
			<AppShell
				header={{ height: isXs ? 200 : 100, collapsed: !pinned, offset: false }}
				padding="md"
				bg={'isabelline'}
			>
				<AppShell.Header p="md" bg="isabelline">
					<Flex direction="column" justify="center" align="center" gap={5}>
						<Title order={1} style={{ textAlign: 'center' }}>
							Lauren's Enchanted Bachelorette Weekend in Québec City
						</Title>
						<Group gap={20}>
							<Flex direction="row" justify="center" align="center" gap={2}>
								<ThemeIcon color="air-superiority-blue" size={30} variant="transparent">
									<IconHome2 />
								</ThemeIcon>
								<Anchor href="https://maps.app.goo.gl/TKJe7DBX2pWaj56S7">Airbnb</Anchor>
							</Flex>
							<Flex direction="row" justify="center" align="center" gap={2}>
								<ThemeIcon color="air-superiority-blue" size={30} variant="transparent">
									<IconReportMoney />
								</ThemeIcon>
								<Anchor href="https://www.splitwise.com/join/JJac4HubVXA+1jidiw?v=e">
									Splitwise
								</Anchor>
							</Flex>
						</Group>
					</Flex>
				</AppShell.Header>

				<AppShell.Main pt="var(--app-shell-header-height)">
					<Container size="xs" p={30}>
						<LivingTimelineByDay items={timelineItems} />
					</Container>
				</AppShell.Main>
			</AppShell>
		</MantineProvider>
	);
}

export default App;
