import { routePartykitRequest, Server } from 'partyserver';
import type { Connection, ConnectionContext, WSMessage } from 'partyserver';
import { type Team, type BuzzEntry, type GameState, type ServerMessage } from './types/types';
import type { DurableObjectNamespace } from '@cloudflare/workers-types';

type Env = {
	main: DurableObjectNamespace;
};

// ─── Message shapes (client → server) ────────────────────────────────────────

type BuzzMessage = {
	type: 'buzz';
	teamName: string;
};

type HostJudgeMessage = {
	type: 'accept' | 'reject';
	teamName: string; // the team being judged
	questionValue: number;
};

type SetQuestionMessage = {
	type: 'set-question';
	value: number; // dollar value of the open question
};

type CloseQuestionMessage = {
	type: 'close-question'; // host closes without awarding (no one got it)
};

type ResetMessage = {
	type: 'reset'; // full game reset (new game)
};

type RegisterTeamMessage = {
	type: 'register-team';
	teamName: string;
};

type ClientMessage =
	| BuzzMessage
	| HostJudgeMessage
	| SetQuestionMessage
	| CloseQuestionMessage
	| ResetMessage
	| RegisterTeamMessage;

// ─── Server ───────────────────────────────────────────────────────────────────

export class BridalJeopardyServer extends Server<Env> {
	state: GameState = {
		teams: [],
		buzzQueue: [],
		activeQuestionValue: null,
		buzzerLocked: false,
	};

	async onStart() {
		this.sql`CREATE TABLE IF NOT EXISTS state (key TEXT PRIMARY KEY, value TEXT)`;
		const rows = this.sql<{ value: string }>`SELECT value FROM state WHERE key = 'game'`;
		if (rows.length > 0) {
			this.state = JSON.parse(rows[0].value);
		}
	}

	saveState() {
		this
			.sql`INSERT OR REPLACE INTO state (key, value) VALUES ('game', ${JSON.stringify(this.state)})`;
	}

	// ── Helpers ──────────────────────────────────────────────────────────────

	broadcastMessage(msg: ServerMessage) {
		this.broadcast(JSON.stringify(msg));
	}

	sendState() {
		this.saveState();
		this.broadcastMessage({ type: 'state', state: this.state });
	}

	getTeam(name: string): Team | undefined {
		return this.state.teams.find((t) => t.name === name);
	}

	ensureTeam(name: string) {
		if (!this.getTeam(name)) {
			this.state.teams.push({ name, score: 0 });
		}
	}

	// ── Lifecycle ────────────────────────────────────────────────────────────

	onConnect(connection: Connection, _ctx: ConnectionContext) {
		console.debug('[Server] onConnect', { connectionId: connection.id, server: this.name });
		// Send full state to any newly connected client
		connection.send(JSON.stringify({ type: 'state', state: this.state }));
	}

	onMessage(_sender: Connection, message: WSMessage) {
		console.debug('[Server] onMessage', message);
		let msg: ClientMessage;
		try {
			msg = JSON.parse(message as string) as ClientMessage;
		} catch {
			return;
		}

		switch (msg.type) {
			// A team captain registers their team name when they load the buzzer
			case 'register-team': {
				this.ensureTeam(msg.teamName);
				this.sendState();
				break;
			}

			// A team captain hits the buzzer
			case 'buzz': {
				const alreadyQueued = this.state.buzzQueue.some((b) => b.teamName === msg.teamName);
				if (alreadyQueued) break; // ignore double-buzz from same team

				const entry: BuzzEntry = {
					teamName: msg.teamName,
					timestamp: Date.now(),
				};
				this.state.buzzQueue.push(entry);
				this.state.buzzerLocked = true;

				// Tell everyone the queue updated
				this.sendState();

				// Also send a targeted buzz-received so the buzzing device gets
				// its position in the queue immediately
				const position = this.state.buzzQueue.length;
				this.broadcastMessage({ type: 'buzz-received', teamName: msg.teamName, position });
				break;
			}

			// Host opens a question — unlocks buzzers for this value
			case 'set-question': {
				console.debug('[Server] set-question', { value: msg.value });
				this.state.activeQuestionValue = msg.value;
				this.state.buzzQueue = [];
				this.state.buzzerLocked = false;
				this.sendState();
				break;
			}

			// Host accepts the current answering team's answer → award points
			case 'accept': {
				const value = this.state.activeQuestionValue ?? msg.questionValue;
				this.ensureTeam(msg.teamName);
				const team = this.getTeam(msg.teamName)!;
				team.score += value;

				// Close the question
				this.state.activeQuestionValue = null;
				this.state.buzzQueue = [];
				this.state.buzzerLocked = false;
				this.sendState();
				break;
			}

			// Host rejects the current answering team → deduct, open for steal
			case 'reject': {
				const value = this.state.activeQuestionValue ?? msg.questionValue;
				this.ensureTeam(msg.teamName);
				const team = this.getTeam(msg.teamName)!;
				team.score = Math.max(0, team.score - value); // floor at 0

				// Remove this team from the front of the queue and unlock for steal
				this.state.buzzQueue = this.state.buzzQueue.filter((b) => b.teamName !== msg.teamName);
				this.state.buzzerLocked = this.state.buzzQueue.length > 0;
				this.sendState();
				break;
			}

			// Host closes the question without awarding anyone
			case 'close-question': {
				this.state.activeQuestionValue = null;
				this.state.buzzQueue = [];
				this.state.buzzerLocked = false;
				this.sendState();
				break;
			}

			// Full reset for a new game
			case 'reset': {
				this.state = {
					teams: this.state.teams.map((t) => ({ ...t, score: 0 })), // keep teams, zero scores
					buzzQueue: [],
					activeQuestionValue: null,
					buzzerLocked: false,
				};
				this.sendState();
				break;
			}
		}
	}
}

export default {
	async fetch(request: Request, env: any) {
		return (await routePartykitRequest(request, env)) || new Response('Not Found', { status: 404 });
	},
};
