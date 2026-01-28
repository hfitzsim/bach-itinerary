import { useState } from 'react';
import {
	Button,
	Modal,
	SimpleGrid,
	Stack,
	Text,
	Title,
	Divider,
	Spoiler,
	Container,
} from '@mantine/core';
import { type JeopardyQuestion, jeopardyQuestions } from './JeopardyData.ts';

export function JeopardyBoard() {
	const [questions, setQuestions] = useState<JeopardyQuestion[]>(jeopardyQuestions);
	const [active, setActive] = useState<JeopardyQuestion | null>(null);

	const categories = Array.from(new Set(questions.map((q) => q.category)));
	const values = Array.from(new Set(questions.map((q) => q.value))).sort((a, b) => a - b);

	function openQuestion(question: JeopardyQuestion) {
		setActive(question);
	}

	function markUsed(id: string) {
		setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, used: true } : q)));
		setActive(null);
	}

	return (
		<Container h="100vh" w="100vw" bg="icy-blue">
			<Stack>
				<Title order={1} ta="center">
					Jeopardy 💍
				</Title>

				{/* Category headers */}
				<SimpleGrid cols={categories.length}>
					{categories.map((cat) => (
						<Text key={cat} ta="center">
							{cat}
						</Text>
					))}
				</SimpleGrid>

				{/* Game board */}
				{values.map((value) => (
					<SimpleGrid key={value} cols={categories.length}>
						{categories.map((category) => {
							const question = questions.find((q) => q.category === category && q.value === value);

							if (!question) return <div key={`${category}-${value}`} />;

							return (
								<Button
									key={question.id}
									h={80}
									disabled={question.used}
									onClick={() => openQuestion(question)}
								>
									${value}
								</Button>
							);
						})}
					</SimpleGrid>
				))}
			</Stack>

			{/* Question modal */}
			<Modal
				opened={!!active}
				onClose={() => setActive(null)}
				centered
				size="lg"
				title={active?.category}
			>
				{active && (
					<Stack>
						<Text size="lg">{active.question}</Text>

						<Divider />

						<Spoiler maxHeight={0} showLabel="Show answer" hideLabel="Hide answer">
							<Text fw={600}>{active.answer}</Text>
						</Spoiler>

						<Button mt="md" onClick={() => markUsed(active.id)}>
							Mark as used
						</Button>
					</Stack>
				)}
			</Modal>
		</Container>
	);
}
