import { Timeline, Text, ThemeIcon, Box, Stack, Group, Divider, Anchor, Flex } from '@mantine/core';
import { IconHeartFilled, IconHeart } from '@tabler/icons-react';
import { useNow } from '../hooks/useNow.tsx';
import { type TimelineItem, type DayGroup } from '../types/types.ts';
import { IconMapPinFilled } from '@tabler/icons-react';

interface TimelineProps {
	currentRef: React.RefObject<HTMLDivElement | null>;
	activeIndex: number;
	items: TimelineItem[];
}

export const LivingTimelineByDay = ({ currentRef, activeIndex, items }: TimelineProps) => {
	const now = useNow(60_000);
	const days = groupByDay(items);

	function getLocalDateKey(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function groupByDay(items: TimelineItem[]): DayGroup[] {
		const map = new Map<string, DayGroup>();

		// Sort all events chronologically first
		const sortedItems = [...items].sort((a, b) => a.start.getTime() - b.start.getTime());

		for (const item of sortedItems) {
			const dateKey = getLocalDateKey(item.start);

			if (!map.has(dateKey)) {
				const dayDate = new Date(item.start);
				dayDate.setHours(0, 0, 0, 0); // normalize to local midnight

				map.set(dateKey, {
					dateKey,
					date: dayDate,
					items: [],
				});
			}

			map.get(dateKey)!.items.push(item);
		}

		// Return days in chronological order
		return Array.from(map.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
	}

	function getTimelineStatus(item: TimelineItem, now: Date): 'past' | 'current' | 'future' {
		const startTime = item.start.getTime();
		const endTime = item.end ? item.end.getTime() : null;
		const currentTime = now.getTime();

		// 1. Future: It hasn't started yet
		if (currentTime < startTime) {
			return 'future';
		}

		// 2. Past: It has a set end time and we are past it
		if (endTime && currentTime > endTime) {
			return 'past';
		}

		// 3. Current: We are after the start, and either there's no end OR we haven't reached it yet
		return 'current';
	}

	const isPast = (date: Date) => {
		const d = new Date(date).setHours(0, 0, 0, 0);
		const n = new Date(now).setHours(0, 0, 0, 0);
		return d < n;
	};

	return (
		<Stack gap="xl">
			{days.map((day) => (
				<Box key={day.dateKey}>
					{/* Day header */}
					<Group mb="sm">
						<Text fw={600} c={isPast(day.date) ? '#c9c9c9' : 'black'}>
							{day.date.toLocaleDateString(undefined, {
								weekday: 'long',
								month: 'long',
								day: 'numeric',
							})}
						</Text>
					</Group>

					<Divider mb="md" />

					{/* Timeline for the day */}
					<Timeline bulletSize={24} lineWidth={2}>
						{day.items.map((item, index) => {
							const status = getTimelineStatus(item, now);

							return (
								<Timeline.Item
									key={item.id}
									ref={item.id === items[activeIndex]?.id ? currentRef : null}
									title={item.title}
									bullet={
										<ThemeIcon variant="white" radius="xl">
											{status === 'past' && <IconHeartFilled size={14} color="#c9c9c9" />}
											{status === 'current' && <IconHeartFilled size={14} color="red" />}
											{status === 'future' && <IconHeart size={14} color="pink" stroke={3} />}
										</ThemeIcon>
									}
									styles={{ itemTitle: { color: status === 'past' ? '#c9c9c9' : 'black' } }}
								>
									<Text size="sm" c={status === 'past' ? '#c9c9c9' : 'grey'}>
										{item.description}
									</Text>

									{item.links && (
										<Group>
											{item.links.map((link) => (
												<Flex direction="row" justify="center" align="center" gap={2}>
													<ThemeIcon
														color={status === 'past' ? '#c9c9c9' : 'icy-blue'}
														size={30}
														variant="transparent"
													>
														<IconMapPinFilled />
													</ThemeIcon>
													<Anchor
														size="sm"
														key={link}
														href={link}
														c={status === 'past' ? '#c9c9c9' : 'icy-blue'}
													>
														Directions
													</Anchor>
												</Flex>
											))}
										</Group>
									)}

									<Text size="xs" c={status === 'current' ? 'icy-blue' : '#c9c9c9'}>
										{item.start.toLocaleTimeString([], {
											hour: 'numeric',
											minute: '2-digit',
										})}
										{item.end &&
											` – ${item.end.toLocaleTimeString([], {
												hour: 'numeric',
												minute: '2-digit',
											})}`}
									</Text>
								</Timeline.Item>
							);
						})}
					</Timeline>
				</Box>
			))}
		</Stack>
	);
};
