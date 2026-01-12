import { Timeline, Text, ThemeIcon, Box, Stack, Group, Divider, Anchor } from '@mantine/core';
import { IconCheck, IconClock, IconCircle } from '@tabler/icons-react';
import { useNow } from './useNow.tsx';
import { type TimelineItem, type DayGroup } from './types.ts';

export function LivingTimelineByDay({ items }: { items: TimelineItem[] }) {
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
		if (item.end && now > item.end) return 'past';
		if (now >= item.start && (!item.end || now <= item.end)) return 'current';
		if (now < item.start) return 'future';
		return 'future';
	}

	return (
		<Stack gap="xl">
			{days.map((day) => (
				<Box key={day.dateKey}>
					{/* Day header */}
					<Group mb="sm">
						<Text fw={600}>
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
						{day.items.map((item) => {
							const status = getTimelineStatus(item, now);

							return (
								<Timeline.Item
									key={item.id}
									title={item.title}
									bullet={
										<ThemeIcon
											color={status === 'past' ? 'green' : status === 'current' ? 'blue' : 'gray'}
											variant={status === 'future' ? 'light' : 'filled'}
											radius="xl"
										>
											{status === 'past' && <IconCheck size={14} />}
											{status === 'current' && <IconClock size={14} />}
											{status === 'future' && <IconCircle size={10} />}
										</ThemeIcon>
									}
								>
									<Text size="sm" c="grey">
										{item.description}
									</Text>

									{item.link && (
										<Anchor size="sm" href={item.link} target="_blank">
											Directions
										</Anchor>
									)}

									<Text size="xs" c={status === 'current' ? 'blue' : 'dimmed'}>
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
}
