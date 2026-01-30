import { Paper, Group, ActionIcon } from '@mantine/core';
import { type NavItem } from '../types/types';

export const StickyBottomNav = ({ navItems }: { navItems: NavItem[] }) => {
	return (
		<Paper
			shadow="md"
			radius={0}
			px="md"
			py="xs"
			withBorder
			style={{
				borderTopLeftRadius: 16,
				borderTopRightRadius: 16,
			}}
		>
			<Group justify="space-around">
				{navItems.map((item) =>
					'href' in item ? (
						<ActionIcon
							key={item.label}
							component="a"
							href={item.href}
							target="_blank"
							rel="noopener noreferrer"
							variant="subtle"
							size="lg"
						>
							{item.icon}
						</ActionIcon>
					) : (
						<ActionIcon key={item.label} onClick={item.onClick} variant="subtle" size="lg">
							{item.icon}
						</ActionIcon>
					)
				)}
			</Group>
		</Paper>
	);
};
