import { Routes, Route } from 'react-router-dom';
import { Itinerary } from './Itinerary';
import { Jeopardy } from './Jeopardy';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Itinerary />} />
			<Route path="/jeopardy" element={<Jeopardy />} />
		</Routes>
	);
}

export default App;
