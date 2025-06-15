import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import StudentPage from './pages/StudentPage';
import StudentProfile from './pages/StudentProfile';
import Home from './pages/Home';

const App =()=>{
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studentpage" element={<StudentPage />} />
        <Route path="/students/:id" element={<StudentProfile />} />
      </Routes>
    </Router>
  );
}
export default App;