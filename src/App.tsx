import { Routes, Route } from 'react-router-dom';
import { Itinerary } from './Itinerary';
import { JeopardyBoard } from './JeopardyBoard';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Itinerary />} />
			<Route path="/jeopardy" element={<JeopardyBoard />} />
		</Routes>
	);
}

export default App;
