import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import GlobalSearchPanel from './components/GlobalSearch';
import TopNav from './components/TopNav';
import { createContext, useContext } from 'react';

const SECTION_ROUTE_MAP: Record<string, string> = {
  'org-hierarchy': 'org',
  'workflow': 'workflow',
  'safety-check': 'safety',
  'kpi-dashboard': 'kpi',
  'gb-standards': 'standards',
  'local-standards': 'standards',
  'laws': 'standards',
  'safety-score': 'scores',
  'service-score': 'scores',
};

// 搜索上下文：让子页面也能访问搜索状态
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
  handleSelect: (section: string) => void;
}
const SearchContext = createContext<SearchContextType | null>(null);
export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchContext.Provider');
  return ctx;
}

function SearchWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const saved = localStorage.getItem('app-theme');
    if (saved === 'light' || saved === 'dark') {
      html.setAttribute('data-theme', saved);
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      const updateMeta = () => {
        const theme = html.getAttribute('data-theme') || 'dark';
        meta.setAttribute('content', theme === 'dark' ? '#050A14' : '#F1F5F9');
      };
      updateMeta();
      const observer = new MutationObserver(updateMeta);
      observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
      return () => observer.disconnect();
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  const handleSelect = (section: string) => {
    setShowSearchResults(false);
    setSearchQuery('');
    const route = SECTION_ROUTE_MAP[section] || section;
    navigate(`/detail/${route}`);
  };

  return (
    <>
      <TopNav
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
      />

      {showSearchResults && (
        <GlobalSearchPanel 
          query={searchQuery} 
          onClose={() => { setShowSearchResults(false); setSearchQuery(''); }} 
          onSelect={handleSelect} 
        />
      )}

      <SearchContext.Provider value={{ searchQuery, setSearchQuery, showSearchResults, setShowSearchResults, handleSelect }}>
        <main className="pt-14">
          {children}
        </main>
      </SearchContext.Provider>
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)] overflow-x-hidden">
        <SearchWrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/detail/:moduleId" element={<DetailPage />} />
          </Routes>
        </SearchWrapper>
      </div>
    </HashRouter>
  );
}

export default App;
