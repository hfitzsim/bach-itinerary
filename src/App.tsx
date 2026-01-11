import '@mantine/core/styles.css';
import { MantineProvider, AppShell, Title } from '@mantine/core';
import { useHeadroom } from '@mantine/hooks';
import { theme } from './theme.ts';
import { LivingTimelineByDay } from './Timeline.tsx';
import { type TimelineItem } from './types.ts';

const timelineItems: TimelineItem[] = [
	{
		id: 'first_dinner',
		title: 'Dinner',
		start: new Date('2026-01-10T20:30:00'),
		end: new Date('2026-01-10T22:00:00'),
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
		start: new Date('2026-02-13T11:00:00'),
		end: new Date('2026-02-13T13:00:00'),
	},
	{
		id: 'explore',
		title: 'Explore Québec City & Shopping',
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
		description: 'Ordering pizza in, face masks, cozy socks, watching olympic skating',
		start: new Date('2026-02-13T19:00:00'),
	},
	{
		id: 'croissants',
		title: 'Quick Breakfast',
		start: new Date('2026-02-14T10:00:00'),
	},
	{
		id: 'bonhomme',
		title: "Visit Bonhomme's Palace",
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
		title: 'Carnaval Night Parade',
		start: new Date('2026-02-14T19:00:00'),
	},
	{
		id: 'irish_bar',
		title: 'Irish Pub & Bar Hopping',
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

	return (
		<MantineProvider theme={theme}>
			<AppShell
				header={{ height: 60, collapsed: !pinned, offset: false }}
				padding="md"
				bg={'isabelline'}
			>
				<AppShell.Header p="md" bg="isabelline">
					<Title order={1}>Lauren's Enchanted Bachelorette Weekend in Québec City</Title>
				</AppShell.Header>

				<AppShell.Main pt="var(--app-shell-header-height)">
					<LivingTimelineByDay items={timelineItems} />
				</AppShell.Main>
			</AppShell>
		</MantineProvider>
	);
}

export default App;
