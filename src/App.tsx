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
	Modal,
	Text,
	Button,
} from '@mantine/core';
import { useHeadroom, useDisclosure } from '@mantine/hooks';
import { theme } from './theme.ts';
import { LivingTimelineByDay } from './Timeline.tsx';
import PackingList from './PackingList.tsx';
import { type TimelineItem } from './types.ts';
import { IconHome2, IconReportMoney, IconListCheck } from '@tabler/icons-react';
import { useRef, useEffect, useMemo } from 'react';
import { useNow } from './useNow.tsx';

const timelineItems: TimelineItem[] = [
	{
		id: 'check_in',
		title: 'Check in',
		description:
			'Check in anytime after 4 pm. We will be decorating and getting settled in to the Airbnb.',
		links: ['https://maps.app.goo.gl/TKJe7DBX2pWaj56S7'],
		start: new Date('2026-01-26T00:00:00'),
		end: new Date('2026-01-26T01:00:00'),
	},
	{
		id: 'dinner1',
		title: 'Dinner',
		description: 'Options: Birra & Basta (8:30 PM) OR Honō Ramen (9PM)',
		links: [
			'https://maps.app.goo.gl/mHJ2S8JdZtpZcN8k8',
			'https://maps.app.goo.gl/uMog82nuZCyvF8kC7',
		],
		start: new Date(),
	},
	{
		id: 'welcome',
		title: 'Morning Welcome',
		description: 'Start the day with some coffee or tea and fun surprises for all!',
		links: ['https://maps.app.goo.gl/TKJe7DBX2pWaj56S7'],
		start: new Date('2026-02-13T09:30:00'),
	},
	{
		id: 'exercise',
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
			'Enjoy a rejuvenating journey through varying temperatures at Strøm Spa. Bring a swimsuit, sandals, a reusable water bottle, and waterproof bag.',
		links: ['https://maps.app.goo.gl/YhWHS587rtTciA9i6'],
		start: new Date('2026-02-13T15:00:00'),
	},
	{
		id: 'night_in',
		title: 'Game Night, Pizza, and Olympic Skating',
		description: `Get ready for some fun and a cozy night in! There'll be games, pizza, and olympic skating.`,
		links: ['https://maps.app.goo.gl/TKJe7DBX2pWaj56S7'],
		start: new Date('2026-02-13T18:00:00'),
	},
	{
		id: 'croissants',
		title: 'Quick Breakfast',
		description: 'Coffee, croissants, and a quick bite to start the day at Pâtisserie Chouquette.',
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
		description: 'Casual lunch at Q de Sac.',
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
		description: `Dinner and (optional) drinks, and pub hopping at some of Québec City's best Irish pubs. Locations: DORSAY Pub Britannique, Pub St-Patrick, Pub St-Alexandre.`,
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
	const now = useNow();

	const [opened, { open, close }] = useDisclosure(false);

	const currentRef = useRef<HTMLDivElement>(null);

	const currentIndex = timelineItems.findIndex((event: TimelineItem) => {
		const TimelineItemDate = new Date(event.start);

		// 1. Check if it is exactly today (ignores time)
		const isToday =
			TimelineItemDate.getDate() === now.getDate() &&
			TimelineItemDate.getMonth() === now.getMonth() &&
			TimelineItemDate.getFullYear() === now.getFullYear();

		// 2. Or check if it's the first TimelineItem in the future
		const isFuture = TimelineItemDate > now;

		return isToday || isFuture;
	});

	const activeIndex = useMemo(() => {
		const index = timelineItems.findIndex((event) => {
			// If the event has an end time and we are past it, it's not the "current" one
			if (event.end && now > event.end) return false;

			// If we haven't reached the start time yet, this is the "next" upcoming event
			if (event.start > now) return true;

			// If we are between start and end (or no end exists), this is the "current" event
			const isToday =
				event.start.getDate() === now.getDate() &&
				event.start.getMonth() === now.getMonth() &&
				event.start.getFullYear() === now.getFullYear();

			return isToday;
		});

		return index === -1 ? timelineItems.length - 1 : index;
	}, [now, timelineItems]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (currentRef.current) {
				currentRef.current.scrollIntoView({
					behavior: 'smooth',
					block: 'center', // 'center' is safer with sticky headers
				});
			}
		}, 150); // 150ms is usually enough for Mantine transitions

		return () => clearTimeout(timer);
	}, [activeIndex]); // Trigger specifically when the active index changes

	return (
		<MantineProvider theme={theme}>
			<AppShell
				header={{ height: 150, collapsed: !pinned, offset: false }}
				padding="md"
				bg={'white'}
			>
				<AppShell.Header p="md" bg="white">
					<Flex direction="column" justify="center" align="center" gap={5}>
						<Title order={1} style={{ textAlign: 'center' }}>
							Lauren's Enchanted Bachelorette <br />
							<Text style={{ fontWeight: '600', fontSize: '0.7em' }}>in Québec City</Text>
						</Title>
						<Group gap={20}>
							<Flex direction="row" justify="center" align="center" gap={2}>
								<ThemeIcon color="icy-blue" size={30} variant="transparent">
									<IconListCheck />
								</ThemeIcon>
								<Button variant="transparent" onClick={open} color="icy-blue" m={0} p={0}>
									<Text fw="light">Packing List</Text>
								</Button>
							</Flex>
							<Flex direction="row" justify="center" align="center" gap={2}>
								<ThemeIcon color="icy-blue" size={30} variant="transparent">
									<IconHome2 />
								</ThemeIcon>
								<Anchor href="https://maps.app.goo.gl/TKJe7DBX2pWaj56S7">Airbnb</Anchor>
							</Flex>
							<Flex direction="row" justify="center" align="center" gap={2}>
								<ThemeIcon color="icy-blue" size={30} variant="transparent">
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
						<LivingTimelineByDay
							currentRef={currentRef}
							activeIndex={activeIndex}
							items={timelineItems}
						/>
					</Container>
				</AppShell.Main>

				<Modal opened={opened} onClose={close} title="Packing List (draft)" size="xl" centered>
					<PackingList />
				</Modal>
			</AppShell>
		</MantineProvider>
	);
}

export default App;
