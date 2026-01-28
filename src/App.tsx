import { Routes, Route } from 'react-router-dom';
import { Itinerary } from './Itinerary';
import { Jeopardy } from './Jeopardy';
import { ThisOrThatPage } from './ThisOrThat';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Itinerary />} />
			<Route path="/jeopardy" element={<Jeopardy />} />
			<Route path="/this-or-that" element={<ThisOrThatPage />} />
		</Routes>
	);
}

export default App;
