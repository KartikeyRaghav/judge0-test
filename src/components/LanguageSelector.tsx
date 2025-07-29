import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Language {
  id: number;
  name: string;
}

interface LanguageSelectorProps {
  selectedLanguage: number;
  onLanguageChange: (languageId: number) => void;
}

export const languages: Language[] = [
  { id: 71, name: 'Python 3' },
  { id: 63, name: 'JavaScript (Node.js)' },
  { id: 62, name: 'Java' },
  { id: 54, name: 'C++' },
  { id: 50, name: 'C' },
  { id: 51, name: 'C#' },
  { id: 78, name: 'Kotlin' },
  { id: 72, name: 'Ruby' },
  { id: 73, name: 'Rust' },
  { id: 74, name: 'TypeScript' },
  { id: 68, name: 'PHP' },
  { id: 60, name: 'Go' },
  { id: 70, name: 'Swift' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  const selectedLang = languages.find(lang => lang.id === selectedLanguage);

  return (
    <div className="relative">
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(parseInt(e.target.value))}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
      >
        {languages.map((language) => (
          <option key={language.id} value={language.id}>
            {language.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
    </div>
  );
};