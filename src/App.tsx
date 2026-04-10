import { Routes, Route } from 'react-router-dom';
import { Itinerary } from './itinerary/Itinerary';
import { Jeopardy } from './jeopardy/Jeopardy';
import { ThisOrThatPage } from './thisOrThat/ThisOrThat';
import { Buzzer } from './jeopardy/Buzzer';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Itinerary />} />
			<Route path="/jeopardy" element={<Jeopardy />} />
			<Route path="/buzzer" element={<Buzzer />} />
			<Route path="/this-or-that" element={<ThisOrThatPage />} />
		</Routes>
	);
}

export default App;
