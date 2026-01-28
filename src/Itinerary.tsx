import '@mantine/core/styles.css';
import {
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
import { LivingTimelineByDay } from './Timeline.tsx';
import PackingList from './PackingList.tsx';
import { IconHome2, IconReportMoney, IconListCheck } from '@tabler/icons-react';
import { useRef, useEffect, useMemo } from 'react';
import { useNow } from './useNow.tsx';
import timelineItems from './Events.ts';

export const Itinerary = () => {
	const pinned = useHeadroom({ fixedAt: 120 });
	const now = useNow();

	const [opened, { open, close }] = useDisclosure(false);

	const currentRef = useRef<HTMLDivElement>(null);

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
		<AppShell header={{ height: 150, collapsed: !pinned, offset: false }} padding="md" bg={'white'}>
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
	);
};
