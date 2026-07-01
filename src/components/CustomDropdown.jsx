import React, { useState, useRef, useEffect } from 'react';

export default function CustomDropdown({ options, value, onChange, placeholder, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`custom-dropdown ${className}`} ref={containerRef}>
      <div 
        className={`custom-dropdown__trigger ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayLabel}</span>
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          style={{ transition: 'transform 300ms', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>
      {isOpen && (
        <div className="custom-dropdown__menu">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`custom-dropdown__item ${opt.value === value ? 'is-selected' : ''}`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
