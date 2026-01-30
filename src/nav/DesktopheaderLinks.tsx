import { Group, Anchor, Text } from '@mantine/core';
import { type NavItem } from '../types/types';

export function DesktopHeaderLinks({ navItems }: { navItems: NavItem[] }) {
	return (
		<Group gap="lg">
			{navItems.map((item: NavItem) =>
				'href' in item ? (
					<Anchor
						key={item.label}
						href={item.href}
						target="_blank"
						rel="noopener noreferrer"
						underline="hover"
					>
						<Group gap={6}>
							{item.icon}
							<Text size="sm">{item.label}</Text>
						</Group>
					</Anchor>
				) : (
					<Anchor key={item.label} component="button" onClick={item.onClick} underline="hover">
						<Group gap={6}>
							{item.icon}
							<Text size="sm">{item.label}</Text>
						</Group>
					</Anchor>
				)
			)}
		</Group>
	);
}
