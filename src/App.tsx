import '@mantine/core/styles.css';
import { MantineProvider, AppShell, Title, Container, Flex } from '@mantine/core';
import { useHeadroom, useMediaQuery } from '@mantine/hooks';
import { theme } from './theme.ts';
import { LivingTimelineByDay } from './Timeline.tsx';
import { type TimelineItem } from './types.ts';

const timelineItems: TimelineItem[] = [
	{
		id: 'first_dinner',
		title: 'Dinner',
		start: new Date('2026-02-12T20:30:00'),
		end: new Date('2026-02-12T22:00:00'),
	},
	{
		id: 'welcome',
		title: 'Decorate & Welcome',
		start: new Date('2026-02-13T09:00:00'),
		end: new Date('2026-02-13T10:00:00'),
	},
	{
		id: 'brunch',
		title: 'Brunch',
		description: 'Location: Restaurant La Buche',
		start: new Date('2026-02-13T11:00:00'),
		end: new Date('2026-02-13T13:00:00'),
	},
	{
		id: 'explore',
		title: 'Explore Québec City & Shopping',
		description:
			'Stop at historical sites and shops. Anyone forget anything? Now is a good time to pick it up, or take this opportunity to get ready for the Spa experience',
		start: new Date('2026-02-13T13:00:00'),
		end: new Date('2026-02-13T14:30:00'),
	},
	{
		id: 'nordic_spa',
		title: 'Nordic Spa Thermal Experience',
		start: new Date('2026-02-13T15:00:00'),
	},
	{
		id: 'game_night',
		title: 'Games!',
		start: new Date('2026-02-13T17:30:00'),
	},
	{
		id: 'order_in',
		title: 'Pizza & Olympic Skating',
		description: 'Ordering in, getting cozy, and watching olympic skating',
		start: new Date('2026-02-13T19:00:00'),
	},
	{
		id: 'croissants',
		title: 'Quick Breakfast',
		description: 'Location: Patisserie Chouquette',
		start: new Date('2026-02-14T10:00:00'),
	},
	{
		id: 'bonhomme',
		title: "Visit Bonhomme's Palace (Le Palais Bonhmome)",
		start: new Date('2026-02-14T11:00:00'),
	},
	{
		id: 'lunch',
		title: 'Lunch',
		start: new Date('2026-02-14T14:00:00'),
	},
	{
		id: 'carnaval_games',
		title: 'Carnaval Games & Activities',
		start: new Date('2026-02-14T15:00:00'),
	},
	{
		id: 'carnaval_parade',
		title: 'Grand Allée Night Parade',
		description: 'Location: Grand Allée. Arrive by 6, parade starts at 7 near ',
		start: new Date('2026-02-14T18:00:00'),
	},
	{
		id: 'irish_bar',
		title: 'Irish Pub Dinner & Bar Hopping',
		description: 'Location: DORSAY Pub Britannique, Pub St-Patrick, Pub St-Alexandre',
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
				header={{ height: isXs ? 150 : 100, collapsed: !pinned, offset: false }}
				padding="md"
				bg={'isabelline'}
			>
				<AppShell.Header p="md" bg="isabelline">
					<Flex justify="center" align="center">
						<Title order={1} style={{ textAlign: 'center' }}>
							Lauren's Enchanted Bachelorette Weekend in Québec City
						</Title>
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
