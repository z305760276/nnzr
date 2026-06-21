import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import GlobalSearchPanel from './components/GlobalSearch';
import TopNav from './components/TopNav';
import AiAssistantDrawer from './components/AiAssistantDrawer';
import BusinessGraphSection from './sections/BusinessGraphSection';
import ScrollToTop from './components/ScrollToTop';
import { createContext, useContext } from 'react';

const SECTION_ROUTE_MAP: Record<string, string> = {
  'org-hierarchy': 'org',
  'workflow': 'workflow',
  'safety-check': 'safety',
  'kpi-dashboard': 'kpi',
  'gb-standards': 'standards',
  'local-standards': 'standards',
  'laws': 'standards',
  'safety-score': 'standards',
  'service-score': 'standards',
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
    const theme = saved === 'light' || saved === 'dark' ? saved : 'light';
    html.setAttribute('data-theme', theme);
    if (!saved) localStorage.setItem('app-theme', 'light');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      const updateMeta = () => {
        const theme = html.getAttribute('data-theme') || 'light';
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
        <AiAssistantDrawer />
      </SearchContext.Provider>
    </>
  );
}

function BusinessContent() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

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
      <main className="pt-14">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
          <BusinessGraphSection />
        </div>
      </main>
      <AiAssistantDrawer />
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)] overflow-x-hidden">
        <Routes>
          <Route path="/business-graph" element={<BusinessContent />} />
          <Route path="/" element={<SearchWrapper><HomePage /></SearchWrapper>} />
          <Route path="/detail/:moduleId" element={<SearchWrapper><DetailPage /></SearchWrapper>} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
