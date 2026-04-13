import { useState, useRef, useEffect, useCallback } from 'react';
import { MantineProvider, TextInput, Stack, Text, Box, Center, createTheme } from '@mantine/core';
import PartySocket from 'partysocket';
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

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = createTheme({
	fontFamily: "'Cormorant Garamond', serif",
	primaryColor: 'sage',
	colors: {
		sage: [
			SAGE[50],
			SAGE[100],
			SAGE[200],
			SAGE[300],
			SAGE[400],
			SAGE[500],
			SAGE[600],
			SAGE[700],
			SAGE[800],
			SAGE[900],
		],
	},
});

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

// ─── Buzzer Button ────────────────────────────────────────────────────────────
function BuzzerButton({
	onPress,
	disabled,
	cooldownMs = 3000,
}: {
	onPress: () => void;
	disabled: boolean;
	cooldownMs?: number;
}) {
	const [pressed, setPressed] = useState(false);
	const [cooldown, setCooldown] = useState(false);
	const [progress, setProgress] = useState(100);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	// Reset cooldown when buzzer re-opens (e.g. steal opportunity)
	useEffect(() => {
		if (!disabled) {
			setCooldown(false);
			setProgress(100);
			if (intervalRef.current) clearInterval(intervalRef.current);
		}
	}, [disabled]);

	const handlePress = () => {
		if (disabled || cooldown) return;
		setPressed(true);
		setCooldown(true);
		setProgress(100);
		onPress();
		setTimeout(() => setPressed(false), 150);
		const start = Date.now();
		intervalRef.current = setInterval(() => {
			const elapsed = Date.now() - start;
			const remaining = Math.max(0, 100 - (elapsed / cooldownMs) * 100);
			setProgress(remaining);
			if (elapsed >= cooldownMs) {
				clearInterval(intervalRef.current!);
				setCooldown(false);
				setProgress(100);
			}
		}, 30);
	};

	useEffect(
		() => () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		},
		[]
	);

	const isActive = !disabled && !cooldown;

	return (
		<Box style={{ position: 'relative', display: 'inline-block' }}>
			<Box
				style={{
					position: 'absolute',
					inset: -14,
					borderRadius: '50%',
					border: `1.5px dashed ${SAGE[200]}`,
					pointerEvents: 'none',
				}}
			/>
			<Box
				style={{
					width: 'clamp(210px, 52vw, 300px)',
					height: 'clamp(210px, 52vw, 300px)',
					borderRadius: '50%',
					background: isActive
						? `radial-gradient(circle at 55% 30%, ${SAGE[400]}, ${SAGE[700]})`
						: `radial-gradient(circle at 55% 30%, ${SAGE[200]}, ${SAGE[300]})`,
					boxShadow: isActive
						? pressed
							? `0 4px 0 ${SAGE[800]}, 0 4px 24px rgba(85,127,81,0.25), inset 0 -6px 16px rgba(0,0,0,0.18)`
							: `0 11px 0 ${SAGE[700]}, 0 14px 36px rgba(85,127,81,0.3), inset 0 -6px 16px rgba(0,0,0,0.18)`
						: `0 8px 0 ${SAGE[300]}, 0 10px 24px rgba(0,0,0,0.08), inset 0 -4px 10px rgba(0,0,0,0.1)`,
					transform: pressed ? 'translateY(7px)' : 'translateY(0)',
					transition: 'transform 0.08s ease, box-shadow 0.08s ease, background 0.4s ease',
					cursor: isActive ? 'pointer' : 'not-allowed',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					userSelect: 'none',
					WebkitTapHighlightColor: 'transparent',
					position: 'relative',
					overflow: 'hidden',
				}}
				onClick={handlePress}
				onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
				role="button"
				tabIndex={isActive ? 0 : -1}
				aria-label="Buzz in"
				onKeyDown={(e) => {
					if (e.key === ' ' || e.key === 'Enter') handlePress();
				}}
			>
				<Box
					style={{
						position: 'absolute',
						top: '7%',
						left: '16%',
						width: '38%',
						height: '32%',
						borderRadius: '50%',
						background: 'radial-gradient(ellipse, rgba(255,255,255,0.28) 0%, transparent 70%)',
						pointerEvents: 'none',
					}}
				/>
				{cooldown && (
					<svg
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							transform: 'rotate(-90deg)',
						}}
						viewBox="0 0 100 100"
					>
						<circle
							cx="50"
							cy="50"
							r="47"
							fill="none"
							stroke="rgba(255,255,255,0.35)"
							strokeWidth="4"
							strokeDasharray={`${(progress / 100) * 295.3} 295.3`}
							strokeLinecap="round"
						/>
					</svg>
				)}
				<Stack align="center" gap={2}>
					{isActive && (
						<Text
							style={{
								fontSize: 'clamp(13px, 3vw, 16px)',
								color: 'rgba(255,255,255,0.7)',
								fontFamily: "'Cormorant Garamond', serif",
								fontStyle: 'italic',
							}}
						>
							press to
						</Text>
					)}
					<Text
						style={{
							fontFamily: "'Cormorant Garamond', serif",
							fontWeight: 700,
							fontStyle: 'italic',
							fontSize: 'clamp(28px, 9vw, 44px)',
							letterSpacing: '0.04em',
							color: isActive ? '#fff' : SAGE[500],
							textShadow: isActive ? '0 2px 10px rgba(0,0,0,0.2)' : 'none',
							lineHeight: 1,
							textAlign: 'center',
						}}
					>
						{disabled && !cooldown ? 'Locked' : cooldown ? 'wait…' : 'Buzz!'}
					</Text>
				</Stack>
			</Box>
		</Box>
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function Buzzer({ cooldownMs = 3000 }: { cooldownMs?: number }) {
	const [teamName, setTeamName] = useState('');
	const [registered, setRegistered] = useState(false);
	const [gameState, setGameState] = useState<GameState | null>(null);
	const [flash, setFlash] = useState(false);
	const [connected, setConnected] = useState(false);
	const socketRef = useRef<PartySocket | null>(null);

	// Derived state
	const myTeam = gameState?.teams.find((t) => t.name === teamName);
	const myScore = myTeam?.score ?? 0;
	const isFirstInQueue = gameState?.buzzQueue[0]?.teamName === teamName;
	const isQueued = gameState?.buzzQueue.some((b) => b.teamName === teamName) ?? false;
	const myQueuePosition = gameState?.buzzQueue.findIndex((b) => b.teamName === teamName);
	const questionOpen = !!gameState?.activeQuestionValue;
	const buzzerOpen = registered && questionOpen && !gameState!.buzzerLocked && !isQueued;

	const serverUrl = import.meta.env.VITE_PARTYSERVER_URL;
	const namespace = import.meta.env.VITE_PARTY_NAMESPACE;
	const room = import.meta.env.VITE_PARTY_ROOM;

	const partyHost = serverUrl;

	const connect = useCallback(
		(name: string) => {
			console.debug('[Buzzer] connect start', { partyHost, namespace, room, name });
			const socket = new PartySocket({ host: partyHost, party: namespace, room });
			socketRef.current = socket;

			socket.addEventListener('open', () => {
				console.debug('[Buzzer] socket open');
				setConnected(true);
				socket.send(JSON.stringify({ type: 'register-team', teamName: name }));
			});
			socket.addEventListener('close', (evt) => {
				console.debug('[Buzzer] socket close', evt);
				setConnected(false);
			});
			socket.addEventListener('error', (evt) => {
				console.debug('[Buzzer] socket error', evt);
			});
			socket.addEventListener('message', (evt) => {
				console.debug('[Buzzer] socket message', evt.data);
				try {
					const msg: ServerMessage = JSON.parse(evt.data);
					if (msg.type === 'state') {
						console.debug('[Buzzer] state update', msg.state);
						const wasQueued = gameState?.buzzQueue.some((b) => b.teamName === name);
						const nowFirstInQueue = msg.state.buzzQueue[0]?.teamName === name;
						if (!wasQueued && nowFirstInQueue) {
							setFlash(true);
							setTimeout(() => setFlash(false), 700);
						}
						setGameState(msg.state);
					}
				} catch (error) {
					console.error('[Buzzer] failed to parse message', evt.data, error);
				}
			});
		},
		[partyHost, namespace, room]
	);

	useEffect(
		() => () => {
			socketRef.current?.close();
		},
		[]
	);

	const handleRegister = () => {
		const name = teamName.trim();
		if (!name) return;
		setRegistered(true);
		connect(name);
	};

	const handleBuzz = () => {
		console.debug('[Buzzer] send buzz', { teamName });
		socketRef.current?.send(JSON.stringify({ type: 'buzz', teamName }));
	};

	return (
		<Box
			style={{
				minHeight: '100dvh',
				background: '#fff',
				backgroundImage: `
        radial-gradient(ellipse at 10% 10%, ${SAGE[50]} 0%, transparent 55%),
        radial-gradient(ellipse at 90% 90%, ${SAGE[50]} 0%, transparent 55%)
      `,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				padding: 'clamp(20px, 5vw, 48px)',
				fontFamily: "'Cormorant Garamond', serif",
				position: 'relative',
				overflow: 'hidden',
			}}
		>
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

			{/* Screen flash on first buzz */}
			<Box
				style={{
					position: 'fixed',
					inset: 0,
					background: `rgba(114,160,110,0.15)`,
					opacity: flash ? 1 : 0,
					transition: flash ? 'opacity 0s' : 'opacity 0.6s ease',
					pointerEvents: 'none',
					zIndex: 10,
				}}
			/>

			<Stack align="center" gap="xl" style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
				{/* Header */}
				<Box style={{ textAlign: 'center' }}>
					<Text
						style={{
							fontSize: 12,
							letterSpacing: '0.3em',
							color: SAGE[400],
							textTransform: 'uppercase',
							marginBottom: 6,
						}}
					>
						✦ Bridal Shower ✦
					</Text>
					<Text
						style={{
							fontFamily: "'Cormorant Garamond', serif",
							fontWeight: 700,
							fontStyle: 'italic',
							fontSize: 'clamp(42px, 11vw, 64px)',
							color: SAGE[700],
							lineHeight: 1,
						}}
					>
						Buzzer
					</Text>
					<Box
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 8,
							marginTop: 8,
						}}
					>
						<Box style={{ height: 1, width: 40, background: SAGE[200] }} />
						<Text style={{ color: SAGE[300], fontSize: 14 }}>❧</Text>
						<Box style={{ height: 1, width: 40, background: SAGE[200] }} />
					</Box>
					{registered && (
						<Text
							style={{
								fontSize: 11,
								letterSpacing: '0.15em',
								marginTop: 6,
								color: connected ? SAGE[400] : SAGE[300],
							}}
						>
							{connected ? '● connected' : '○ connecting…'}
						</Text>
					)}
				</Box>

				{/* Pre-registration: name entry */}
				{!registered ? (
					<Stack align="center" gap="md" style={{ width: '100%' }}>
						<TextInput
							placeholder="Enter your team name…"
							value={teamName}
							onChange={(e) => setTeamName(e.currentTarget.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleRegister();
							}}
							size="md"
							styles={{
								input: {
									background: '#fff',
									border: `1.5px solid ${SAGE[200]}`,
									borderRadius: 40,
									color: SAGE[800],
									fontFamily: "'Cormorant Garamond', serif",
									fontStyle: 'italic',
									fontSize: 20,
									fontWeight: 500,
									textAlign: 'center',
									height: 52,
									'::placeholder': { color: SAGE[300] },
									':focus': {
										borderColor: SAGE[400],
										boxShadow: `0 0 0 3px rgba(114,160,110,0.15)`,
									},
								},
							}}
						/>
						<Box
							onClick={handleRegister}
							style={{
								background: teamName.trim() ? SAGE[500] : SAGE[200],
								borderRadius: 40,
								padding: '12px 40px',
								fontFamily: "'Cormorant Garamond', serif",
								fontStyle: 'italic',
								fontWeight: 700,
								fontSize: 20,
								color: '#fff',
								cursor: teamName.trim() ? 'pointer' : 'default',
								boxShadow: teamName.trim() ? `0 4px 0 ${SAGE[700]}` : 'none',
								transition: 'all 0.2s ease',
								userSelect: 'none',
							}}
						>
							Join Game
						</Box>
					</Stack>
				) : (
					<Stack align="center" gap="lg" style={{ width: '100%' }}>
						{/* Score */}
						<Box style={{ textAlign: 'center' }}>
							<Text
								style={{
									fontFamily: "'Cormorant Garamond', serif",
									fontStyle: 'italic',
									fontSize: 15,
									color: SAGE[400],
									letterSpacing: '0.15em',
								}}
							>
								{teamName}
							</Text>
							<Text
								style={{
									fontFamily: "'Cormorant Garamond', serif",
									fontWeight: 700,
									fontSize: 38,
									color: SAGE[700],
									lineHeight: 1,
								}}
							>
								${myScore.toLocaleString()}
							</Text>
						</Box>

						{/* Status banner */}
						{isQueued && (
							<Box
								style={{
									background: isFirstInQueue ? SAGE[50] : '#fafafa',
									border: `1.5px solid ${isFirstInQueue ? SAGE[300] : SAGE[100]}`,
									borderRadius: 12,
									padding: '10px 20px',
									textAlign: 'center',
									width: '100%',
								}}
							>
								<Text
									style={{
										fontFamily: "'Cormorant Garamond', serif",
										fontStyle: 'italic',
										fontSize: 18,
										color: isFirstInQueue ? SAGE[600] : SAGE[400],
									}}
								>
									{isFirstInQueue
										? '🌿 You buzzed first! Answer now.'
										: `You're #${(myQueuePosition ?? 0) + 1} in the queue — waiting to steal`}
								</Text>
							</Box>
						)}

						{!questionOpen && !isQueued && (
							<Text
								style={{
									fontFamily: "'Cormorant Garamond', serif",
									fontStyle: 'italic',
									fontSize: 16,
									color: SAGE[300],
									textAlign: 'center',
								}}
							>
								Waiting for a question to open…
							</Text>
						)}

						{questionOpen && !isQueued && gameState?.buzzerLocked && (
							<Text
								style={{
									fontFamily: "'Cormorant Garamond', serif",
									fontStyle: 'italic',
									fontSize: 16,
									color: SAGE[300],
									textAlign: 'center',
								}}
							>
								Another team is answering…
							</Text>
						)}

						{/* The Buzzer */}
						<Center>
							<BuzzerButton onPress={handleBuzz} disabled={!buzzerOpen} cooldownMs={cooldownMs} />
						</Center>
					</Stack>
				)}
			</Stack>
		</Box>
	);
}

// ─── App wrapper ──────────────────────────────────────────────────────────────
export default function App() {
	return (
		<>
			<link
				href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap"
				rel="stylesheet"
			/>
			<MantineProvider theme={theme}>
				<Buzzer cooldownMs={3000} />
			</MantineProvider>
		</>
	);
}
