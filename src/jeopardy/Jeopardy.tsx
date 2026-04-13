import { useState, useEffect, useRef } from 'react';
import { Modal, SimpleGrid, Title, Stack, Text, Group, Container, Image, Box } from '@mantine/core';
import PartySocket from 'partysocket';
import { type JeopardyQuestion, jeopardyQuestions } from './JeopardyData-shower.ts';
import { ScoreBoard } from './JeopardyScoreBoard.tsx';
import type { GameState, ServerMessage } from '../types/types';

// ─── Palette ──────────────────────────────────────────────────────────────────
const SAGE = {
	50: '#f4f7f4',
	100: '#e4ece3',
	200: '#c6d9c4',
	300: '#9dbf9a',
	400: '#72a06e',
	500: '#557f51',
	600: '#426540',
	700: '#365234',
	800: '#2c4229',
	900: '#1e2e1c',
};

// ─── Decorative sprig ─────────────────────────────────────────────────────────
function Sprig({ style }: { style?: React.CSSProperties }) {
	return (
		<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
			<path d="M30 75 Q30 40 30 5" stroke={SAGE[300]} strokeWidth="1.5" strokeLinecap="round" />
			<ellipse
				cx="18"
				cy="30"
				rx="10"
				ry="5"
				transform="rotate(-30 18 30)"
				fill={SAGE[200]}
				opacity="0.8"
			/>
			<ellipse
				cx="42"
				cy="22"
				rx="10"
				ry="5"
				transform="rotate(30 42 22)"
				fill={SAGE[200]}
				opacity="0.8"
			/>
			<ellipse
				cx="16"
				cy="48"
				rx="9"
				ry="4.5"
				transform="rotate(-25 16 48)"
				fill={SAGE[300]}
				opacity="0.7"
			/>
			<ellipse
				cx="44"
				cy="40"
				rx="9"
				ry="4.5"
				transform="rotate(25 44 40)"
				fill={SAGE[300]}
				opacity="0.7"
			/>
			<ellipse
				cx="22"
				cy="64"
				rx="8"
				ry="4"
				transform="rotate(-20 22 64)"
				fill={SAGE[200]}
				opacity="0.6"
			/>
			<ellipse
				cx="38"
				cy="58"
				rx="8"
				ry="4"
				transform="rotate(20 38 58)"
				fill={SAGE[200]}
				opacity="0.6"
			/>
		</svg>
	);
}

function OrnamentDivider() {
	return (
		<Box
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 10,
				margin: '4px 0 16px',
			}}
		>
			<Box style={{ height: 1, flex: 1, background: SAGE[200] }} />
			<Text style={{ color: SAGE[300], fontSize: 16, lineHeight: 1 }}>❧</Text>
			<Box style={{ height: 1, flex: 1, background: SAGE[200] }} />
		</Box>
	);
}

// ─── Buzz Toast ───────────────────────────────────────────────────────────────
// Shows in the bottom-right corner when a team buzzes in.
// Host can Accept ✓ or Reject ✗ right from the toast.
function BuzzToast({
	buzzingTeam,
	questionValue,
	onAccept,
	onReject,
	onClose,
}: {
	buzzingTeam: string;
	questionValue: number;
	onAccept: () => void;
	onReject: () => void;
	onClose: () => void;
}) {
	return (
		<Box
			style={{
				position: 'fixed',
				bottom: 24,
				right: 24,
				zIndex: 1000,
				background: '#fff',
				border: `1.5px solid ${SAGE[300]}`,
				borderRadius: 16,
				boxShadow: `0 8px 32px rgba(85,127,81,0.18)`,
				padding: '16px 20px',
				minWidth: 280,
				maxWidth: 340,
				fontFamily: "'Cormorant Garamond', serif",
				animation: 'slideIn 0.25s ease',
			}}
		>
			<style>{`
				@keyframes slideIn {
					from { opacity: 0; transform: translateY(16px); }
					to   { opacity: 1; transform: translateY(0); }
				}
			`}</style>

			<Box
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					marginBottom: 12,
				}}
			>
				<Box>
					<Text
						style={{
							fontSize: 11,
							letterSpacing: '0.2em',
							color: SAGE[400],
							textTransform: 'uppercase',
							marginBottom: 2,
						}}
					>
						🌿 Buzzed In
					</Text>
					<Text
						style={{
							fontWeight: 700,
							fontStyle: 'italic',
							fontSize: 22,
							color: SAGE[700],
							lineHeight: 1,
						}}
					>
						{buzzingTeam}
					</Text>
				</Box>
				<Box
					onClick={onClose}
					style={{ cursor: 'pointer', color: SAGE[300], fontSize: 18, lineHeight: 1, padding: 4 }}
				>
					✕
				</Box>
			</Box>

			<Group gap={8}>
				{/* Accept — award points */}
				<Box
					onClick={onAccept}
					style={{
						flex: 1,
						textAlign: 'center',
						background: SAGE[500],
						borderRadius: 10,
						padding: '10px 0',
						cursor: 'pointer',
						fontFamily: "'Cormorant Garamond', serif",
						fontWeight: 700,
						fontStyle: 'italic',
						fontSize: 18,
						color: '#fff',
						boxShadow: `0 3px 0 ${SAGE[700]}`,
						transition: 'all 0.08s ease',
						userSelect: 'none',
					}}
				>
					✓ Correct +${questionValue}
				</Box>

				{/* Reject — deduct points */}
				<Box
					onClick={onReject}
					style={{
						flex: 1,
						textAlign: 'center',
						background: '#fff',
						borderRadius: 10,
						border: `1.5px solid ${SAGE[200]}`,
						padding: '10px 0',
						cursor: 'pointer',
						fontFamily: "'Cormorant Garamond', serif",
						fontWeight: 700,
						fontStyle: 'italic',
						fontSize: 18,
						color: SAGE[500],
						transition: 'all 0.08s ease',
						userSelect: 'none',
					}}
				>
					✗ Wrong −${questionValue}
				</Box>
			</Group>
		</Box>
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function Jeopardy() {
	const [questions, setQuestions] = useState<JeopardyQuestion[]>(jeopardyQuestions);
	const [active, setActive] = useState<JeopardyQuestion | null>(null);
	const [revealed, setRevealed] = useState(false);
	const [gameState, setGameState] = useState<GameState | null>(null);
	const socketRef = useRef<PartySocket | null>(null);

	const serverUrl = import.meta.env.VITE_PARTYSERVER_URL;
	const namespace = import.meta.env.VITE_PARTY_NAMESPACE;
	const room = import.meta.env.VITE_PARTY_ROOM;

	const partyHost = serverUrl;

	// Derived
	const buzzingTeam = gameState?.buzzQueue[0]?.teamName ?? null;
	const showToast = !!buzzingTeam && !!active;

	// ── PartyKit connection ──────────────────────────────────────────────────
	useEffect(() => {
		const socket = new PartySocket({ host: partyHost, party: namespace, room });
		socketRef.current = socket;

		socket.addEventListener('open', () => {
			console.debug('[Jeopardy] socket open', { partyHost, namespace, room });
		});
		socket.addEventListener('close', (evt) => {
			console.debug('[Jeopardy] socket close', evt);
		});
		socket.addEventListener('error', (evt) => {
			console.debug('[Jeopardy] socket error', evt);
		});
		socket.addEventListener('message', (evt) => {
			console.debug('[Jeopardy] socket message', evt.data);
			try {
				const msg: ServerMessage = JSON.parse(evt.data);
				if (msg.type === 'state') {
					console.debug('[Jeopardy] state update', msg.state);
					setGameState(msg.state);
				}
			} catch (error) {
				console.error('[Jeopardy] failed to parse message', evt.data, error);
			}
		});

		return () => {
			socket.close();
		};
	}, []);

	// ── Helpers ──────────────────────────────────────────────────────────────
	function send(msg: object) {
		console.debug('[Jeopardy] send', msg);
		socketRef.current?.send(JSON.stringify(msg));
	}

	function openQuestion(question: JeopardyQuestion) {
		setActive(question);
		setRevealed(false);
		// Tell the server this question is open so buzzers unlock
		send({ type: 'set-question', value: question.value });
	}

	function markUsed(id: string) {
		setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, used: true } : q)));
	}

	function handleAccept() {
		if (!buzzingTeam || !active) return;
		send({ type: 'accept', teamName: buzzingTeam, questionValue: active.value });
		markUsed(active.id);
		setActive(null);
	}

	function handleReject() {
		if (!buzzingTeam || !active) return;
		send({ type: 'reject', teamName: buzzingTeam, questionValue: active.value });
		// Don't close the modal — keep it open for stealing
	}

	function handleCloseQuestion() {
		send({ type: 'close-question' });
		setActive(null);
	}

	function handleReveal() {
		if (!active) return;
		setRevealed(true);
		// Keep the question active so the host can still award points after revealing.
		markUsed(active.id);
	}

	const categories = Array.from(new Set(questions.map((q) => q.category)));
	const values = Array.from(new Set(questions.map((q) => q.value))).sort((a, b) => a - b);

	// ── Render ───────────────────────────────────────────────────────────────
	return (
		<>
			<link
				href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap"
				rel="stylesheet"
			/>

			<Container
				fluid
				mih="100vh"
				style={{
					background: '#fff',
					backgroundImage: `
					radial-gradient(ellipse at 10% 10%, ${SAGE[50]} 0%, transparent 55%),
					radial-gradient(ellipse at 90% 90%, ${SAGE[50]} 0%, transparent 55%)
				`,
					fontFamily: "'Cormorant Garamond', serif",
					position: 'relative',
					overflow: 'hidden',
				}}
				pt={30}
			>
				{/* Corner sprigs */}
				<Sprig
					style={{
						position: 'absolute',
						top: -8,
						left: -4,
						width: 80,
						opacity: 0.6,
						transform: 'rotate(-15deg)',
					}}
				/>
				<Sprig
					style={{
						position: 'absolute',
						top: -8,
						right: -4,
						width: 80,
						opacity: 0.6,
						transform: 'rotate(15deg) scaleX(-1)',
					}}
				/>
				<Sprig
					style={{
						position: 'absolute',
						bottom: -8,
						left: -4,
						width: 70,
						opacity: 0.4,
						transform: 'rotate(165deg) scaleX(-1)',
					}}
				/>
				<Sprig
					style={{
						position: 'absolute',
						bottom: -8,
						right: -4,
						width: 70,
						opacity: 0.4,
						transform: 'rotate(-165deg)',
					}}
				/>

				<Container fluid h="100%" w="100%" p={10} style={{ position: 'relative' }}>
					{/* Page header */}
					<Box style={{ textAlign: 'center', marginBottom: 8 }}>
						<Text
							style={{
								fontSize: 12,
								letterSpacing: '0.28em',
								color: SAGE[400],
								textTransform: 'uppercase',
								marginBottom: 4,
							}}
						>
							✦ Bridal Shower ✦
						</Text>
						<Title
							order={1}
							style={{
								fontFamily: "'Cormorant Garamond', serif",
								fontWeight: 700,
								fontStyle: 'italic',
								fontSize: 'clamp(36px, 6vw, 58px)',
								color: SAGE[700],
								lineHeight: 1,
							}}
						>
							Jeopardy
						</Title>
						<OrnamentDivider />
					</Box>

					{/* Category headers */}
					<SimpleGrid cols={categories.length} spacing={0} mb={4}>
						{categories.map((cat) => (
							<Box
								key={cat}
								style={{
									textAlign: 'center',
									padding: '8px 4px',
									borderBottom: `2px solid ${SAGE[200]}`,
								}}
							>
								<Text
									style={{
										fontFamily: "'Cormorant Garamond', serif",
										fontWeight: 700,
										fontStyle: 'italic',
										fontSize: 'clamp(12px, 1.8vw, 18px)',
										color: SAGE[700],
										letterSpacing: '0.03em',
										textTransform: 'uppercase',
									}}
								>
									{cat}
								</Text>
							</Box>
						))}
					</SimpleGrid>

					{/* Value rows */}
					{values.map((value) => (
						<SimpleGrid key={value} cols={categories.length} spacing={6} p={6}>
							{categories.map((category) => {
								const question = questions.find(
									(q) => q.category === category && q.value === value && !q.used && !q.final
								);
								if (!question) {
									return (
										<Box
											key={`${category}-${value}`}
											style={{
												height: 72,
												borderRadius: 12,
												background: SAGE[50],
												border: `1px dashed ${SAGE[100]}`,
											}}
										/>
									);
								}
								return (
									<Box
										key={question.id}
										onClick={() => openQuestion(question)}
										style={{
											height: 72,
											borderRadius: 12,
											background: '#fff',
											border: `1.5px solid ${SAGE[200]}`,
											boxShadow: `0 2px 8px rgba(85,127,81,0.1)`,
											cursor: 'pointer',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontFamily: "'Cormorant Garamond', serif",
											fontWeight: 700,
											fontStyle: 'italic',
											fontSize: 'clamp(18px, 2.5vw, 26px)',
											color: SAGE[600],
											letterSpacing: '0.02em',
											transition: 'all 0.18s ease',
											userSelect: 'none',
										}}
										onMouseEnter={(e) => {
											(e.currentTarget as HTMLElement).style.background = SAGE[50];
											(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
											(e.currentTarget as HTMLElement).style.boxShadow =
												`0 4px 16px rgba(85,127,81,0.18)`;
										}}
										onMouseLeave={(e) => {
											(e.currentTarget as HTMLElement).style.background = '#fff';
											(e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
											(e.currentTarget as HTMLElement).style.boxShadow =
												`0 2px 8px rgba(85,127,81,0.1)`;
										}}
									>
										${value}
									</Box>
								);
							})}
						</SimpleGrid>
					))}

					{/* Scoreboard */}
					<Group align="flex-start" justify="center" mt={24} w="100%">
						<ScoreBoard teams={gameState?.teams ?? []} />
					</Group>
				</Container>

				{/* ── Buzz Toast ── */}
				{showToast && (
					<BuzzToast
						buzzingTeam={buzzingTeam!}
						questionValue={active!.value}
						onAccept={handleAccept}
						onReject={handleReject}
						onClose={handleCloseQuestion}
					/>
				)}

				{/* ── Question Modal ── */}
				<Modal
					opened={!!active}
					onClose={handleCloseQuestion}
					size="xl"
					centered
					title={
						active ? (
							<Box style={{ width: '100%', textAlign: 'center' }}>
								<Text
									style={{
										fontFamily: "'Cormorant Garamond', serif",
										fontSize: 13,
										letterSpacing: '0.25em',
										color: SAGE[400],
										textTransform: 'uppercase',
										marginBottom: 2,
									}}
								>
									✦ {active.category} ✦
								</Text>
								<Text
									style={{
										fontFamily: "'Cormorant Garamond', serif",
										fontWeight: 700,
										fontStyle: 'italic',
										fontSize: 32,
										color: SAGE[700],
										lineHeight: 1,
									}}
								>
									${active.value}
								</Text>
							</Box>
						) : null
					}
					styles={{
						content: {
							backgroundColor: '#fff',
							backgroundImage: `radial-gradient(ellipse at 50% 0%, ${SAGE[50]} 0%, transparent 70%)`,
							border: `1.5px solid ${SAGE[200]}`,
							borderRadius: 20,
							fontFamily: "'Cormorant Garamond', serif",
						},
						header: {
							backgroundColor: 'transparent',
							borderBottom: `1px solid ${SAGE[100]}`,
							paddingBottom: 12,
						},
						close: { color: SAGE[400] },
						title: { width: '100%' },
					}}
				>
					{active && (
						<Stack align="center" gap="lg" pt={8} pb={16}>
							{active.image && (
								<Box
									style={{
										borderRadius: 14,
										overflow: 'hidden',
										border: `1.5px solid ${SAGE[200]}`,
										boxShadow: `0 4px 20px rgba(85,127,81,0.12)`,
									}}
								>
									<Image src={active.image} alt={active.question} maw={380} mx="auto" />
								</Box>
							)}

							<Box style={{ display: 'flex', alignItems: 'center', gap: 10, width: '80%' }}>
								<Box style={{ height: 1, flex: 1, background: SAGE[200] }} />
								<Text style={{ color: SAGE[300], fontSize: 14 }}>❧</Text>
								<Box style={{ height: 1, flex: 1, background: SAGE[200] }} />
							</Box>

							<Text
								style={{
									fontFamily: "'Cormorant Garamond', serif",
									fontWeight: 600,
									fontStyle: 'italic',
									fontSize: 'clamp(22px, 3.5vw, 30px)',
									color: SAGE[800],
									textAlign: 'center',
									lineHeight: 1.35,
									maxWidth: 480,
								}}
							>
								{active.question}
							</Text>

							{/* Who's currently answering */}
							{buzzingTeam && !revealed && (
								<Box
									style={{
										background: SAGE[50],
										border: `1.5px solid ${SAGE[200]}`,
										borderRadius: 12,
										padding: '10px 20px',
										textAlign: 'center',
									}}
								>
									<Text
										style={{
											fontFamily: "'Cormorant Garamond', serif",
											fontStyle: 'italic',
											fontSize: 18,
											color: SAGE[600],
										}}
									>
										🌿 {buzzingTeam} is answering…
									</Text>
								</Box>
							)}

							{/* Revealed answer */}
							{revealed && (
								<Box
									style={{
										background: SAGE[50],
										border: `1.5px solid ${SAGE[200]}`,
										borderRadius: 12,
										padding: '14px 24px',
										textAlign: 'center',
										maxWidth: 440,
									}}
								>
									<Text
										style={{
											fontSize: 11,
											letterSpacing: '0.22em',
											color: SAGE[400],
											textTransform: 'uppercase',
											marginBottom: 4,
										}}
									>
										Answer
									</Text>
									<Text
										style={{
											fontFamily: "'Cormorant Garamond', serif",
											fontWeight: 700,
											fontStyle: 'italic',
											fontSize: 'clamp(20px, 3vw, 26px)',
											color: SAGE[700],
										}}
									>
										{active.answer}
									</Text>
								</Box>
							)}

							{/* Host controls */}
							{!revealed && (
								<Group justify="center" gap="md">
									<Box
										onClick={handleReveal}
										style={{
											background: SAGE[500],
											borderRadius: 40,
											padding: '10px 32px',
											fontFamily: "'Cormorant Garamond', serif",
											fontStyle: 'italic',
											fontWeight: 700,
											fontSize: 20,
											color: '#fff',
											cursor: 'pointer',
											boxShadow: `0 4px 0 ${SAGE[700]}`,
											userSelect: 'none',
											transition: 'all 0.08s ease',
										}}
									>
										Reveal Answer
									</Box>
									<Box
										onClick={handleCloseQuestion}
										style={{
											background: 'transparent',
											border: `1.5px solid ${SAGE[200]}`,
											borderRadius: 40,
											padding: '10px 24px',
											fontFamily: "'Cormorant Garamond', serif",
											fontStyle: 'italic',
											fontWeight: 600,
											fontSize: 18,
											color: SAGE[400],
											cursor: 'pointer',
											userSelect: 'none',
										}}
									>
										Skip
									</Box>
								</Group>
							)}

							{revealed && (
								<Box
									onClick={handleCloseQuestion}
									style={{
										background: 'transparent',
										border: `1.5px solid ${SAGE[200]}`,
										borderRadius: 40,
										padding: '8px 32px',
										fontFamily: "'Cormorant Garamond', serif",
										fontStyle: 'italic',
										fontWeight: 600,
										fontSize: 18,
										color: SAGE[500],
										cursor: 'pointer',
										userSelect: 'none',
									}}
								>
									Close
								</Box>
							)}
						</Stack>
					)}
				</Modal>
			</Container>
		</>
	);
}
