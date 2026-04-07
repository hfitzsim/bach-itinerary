import { useState } from 'react';
import { Button, Modal, SimpleGrid, Stack, Text, Group, Spoiler, Container } from '@mantine/core';
import { type JeopardyQuestion, jeopardyQuestions } from './JeopardyData-shower.ts';
import { ScoreBoard } from './JeopardyScoreBoard.tsx';
import { JeopardyPlayRound } from './JeopardyPlayRound.tsx';

export function Jeopardy() {
	const [questions, _setQuestions] = useState<JeopardyQuestion[]>(jeopardyQuestions);
	const [active, setActive] = useState<JeopardyQuestion | null>(null);

	const categories = Array.from(new Set(questions.map((q) => q.category)));
	const values = Array.from(new Set(questions.map((q) => q.value))).sort((a, b) => a - b);

	function openQuestion(question: JeopardyQuestion) {
		setActive(question);
	}

	// function markUsed(id: string) {
	// 	setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, used: true } : q)));
	// 	setActive(null);
	// }

	return (
		<Container fluid mih="100vh" bg="sage" pt={30}>
			{/* Game board */}
			<Container bg="sage" fluid h="100%" w="100%" p={10}>
				{/* Category headers */}
				<SimpleGrid cols={categories.length} spacing={0}>
					{categories.map((cat) => (
						<Text key={cat} ta="center" c="white" fw="bold">
							{cat}
						</Text>
					))}
				</SimpleGrid>
				{values.map((value) => (
					<SimpleGrid key={value} cols={categories.length} p={10}>
						{categories.map((category) => {
							const question = questions.find((q) => q.category === category && q.value === value);

							if (!question) return <div key={`${category}-${value}`} />;

							return (
								<Button
									key={question.id}
									bg={question.used ? 'sage' : 'white'}
									variant={question.used ? 'filled' : 'light'}
									color="sage"
									h={80}
									radius={0}
									disabled={question.used}
									onClick={() => openQuestion(question)}
								>
									${value}
								</Button>
							);
						})}
					</SimpleGrid>
				))}
				<Group align="flex-start" justify="space-between">
					<JeopardyPlayRound />
					<ScoreBoard />
				</Group>
			</Container>

			{/* Question modal */}
			<Modal
				opened={!!active}
				withCloseButton={false}
				onClose={() => setActive(null)}
				centered
				size="lg"
				bg="sage"
			>
				{active && (
					<Stack style={{ textAlign: 'center' }}>
						<Text size="xl" fw={900} ta="center">
							{active.question}
						</Text>

						<Spoiler
							maxHeight={0}
							showLabel="Reveal answer"
							hideLabel="Hide answer"
							style={{ color: 'sage' }}
						>
							<Text fw={600}>{active.answer}</Text>
						</Spoiler>

						{/* <Button mt="md" onClick={() => markUsed(active.id)} bg="sage">
							Reveal Answer
						</Button> */}
					</Stack>
				)}
			</Modal>
		</Container>
	);
}
