import '@mantine/core/styles.css';
import { AppShell, Title, Container, Flex, Group, Text, Affix } from '@mantine/core';
import { useHeadroom, useDisclosure } from '@mantine/hooks';
import { LivingTimelineByDay } from './Timeline.tsx';
import { PackingList } from './PackingList.tsx';
import { IconHome2, IconReportMoney, IconListCheck, IconBrandSpotify } from '@tabler/icons-react';
import { useRef, useEffect, useMemo } from 'react';
import { useNow } from '../hooks/useNow.tsx';
import timelineItems from './Events.ts';
import { PasswordGate } from '../PasswordGate.tsx';
import { type NavItem } from '../types/types.ts';
import { StickyBottomNav } from '../nav/StickyBottomNav.tsx';
import { DesktopHeaderLinks } from '../nav/DesktopheaderLinks.tsx';

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

	const navItems: NavItem[] = [
		{
			id: 'packing',
			label: 'Pack',
			icon: <IconListCheck />,
			onClick: open,
		},
		{
			id: 'airbnb',
			label: 'Stay',
			icon: <IconHome2 />,
			href: 'https://maps.app.goo.gl/TKJe7DBX2pWaj56S7',
		},
		{
			id: 'splitwise',
			label: 'Splitwise',
			icon: <IconReportMoney />,
			href: 'https://www.splitwise.com/join/JJac4HubVXA+1jidiw?v=e',
		},
		{
			id: 'playlist',
			label: 'Playlist',
			icon: <IconBrandSpotify />,
			href: 'https://open.spotify.com/playlist/4GhjdzrfuT4PIWKr2ltJJ9?si=782d32f6d36b4724&pt=1ef01e9773a9749236388505f8f62865',
		},
	];

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
					<Group visibleFrom="sm">
						<DesktopHeaderLinks navItems={navItems} />
					</Group>
				</Flex>
			</AppShell.Header>

			<AppShell.Main pt="var(--app-shell-header-height)" pb={{ base: 72, sm: 0 }}>
				<PasswordGate>
					<Container size="xs" p={30}>
						<LivingTimelineByDay
							currentRef={currentRef}
							activeIndex={activeIndex}
							items={timelineItems}
						/>
					</Container>
				</PasswordGate>
				<Affix hiddenFrom="sm" position={{ bottom: 0, left: 0, right: 0 }}>
					<StickyBottomNav navItems={navItems} />
				</Affix>
			</AppShell.Main>

			{opened && <PackingList opened={opened} onClose={close} />}
		</AppShell>
	);
};
