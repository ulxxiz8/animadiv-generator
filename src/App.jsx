import './index.css';
import GeneratorPage from './features/generator/GeneratorPage';

function App() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>AnimaDiv</h1>
      </header>

      {/* Рендеримо нашу нову сторінку */}
      <GeneratorPage />
    </div>
  );
}

export default App;
