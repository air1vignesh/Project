import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import CelebrationPage from './components/CelebrationPage';

function App() {
  const [showCelebration, setShowCelebration] = useState(false);

  return (
    <>
      {!showCelebration ? (
        <WelcomePage onCelebrate={() => setShowCelebration(true)} />
      ) : (
        <CelebrationPage />
      )}
    </>
  );
}

export default App;
