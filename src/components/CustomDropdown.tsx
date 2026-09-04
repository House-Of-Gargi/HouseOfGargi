'use client';

import { useState, useRef, useEffect, useId } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

export interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
  triggerStyle?: React.CSSProperties;
  menuStyle?: React.CSSProperties;
  showEmptyOption?: boolean;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  disabled = false,
  error,
  className = '',
  fullWidth = false,
  style,
  triggerStyle,
  menuStyle,
  showEmptyOption = false,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(prev => !prev);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = options.findIndex(opt => opt.value === value);
        const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        onChange(options[nextIndex].value);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = options.findIndex(opt => opt.value === value);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        onChange(options[prevIndex].value);
      }
    }
  };

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;
  const isPlaceholder = !selectedOption;

  return (
    <div
      className={`custom-dropdown-container ${fullWidth ? 'custom-dropdown--full' : ''} ${className}`}
      ref={containerRef}
      style={style}
    >
      {label && (
        <label className="custom-dropdown__label">
          {label}
        </label>
      )}

      <div className={`custom-dropdown ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''}`}>
        <button
          type="button"
          className={`custom-dropdown__trigger ${isOpen ? 'is-active' : ''} ${error ? 'has-error' : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          disabled={disabled}
          style={triggerStyle}
        >
          <span className={`custom-dropdown__selected ${isPlaceholder ? 'is-placeholder' : ''}`}>
            {selectedOption?.icon && (
              <span className="custom-dropdown__icon">{selectedOption.icon}</span>
            )}
            <span className="custom-dropdown__text">{displayLabel}</span>
          </span>

          <span className={`custom-dropdown__arrow ${isOpen ? 'is-flipped' : ''}`}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div
            id={listboxId}
            className="custom-dropdown__menu"
            role="listbox"
            tabIndex={-1}
            style={menuStyle}
          >
            {showEmptyOption && (
              <div
                role="option"
                aria-selected={value === ''}
                className={`custom-dropdown__item ${value === '' ? 'is-selected' : ''}`}
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
              >
                <div className="custom-dropdown__item-content">
                  <span className="custom-dropdown__item-label">{placeholder}</span>
                </div>
                {value === '' && (
                  <span className="custom-dropdown__checkmark" aria-hidden="true">
                    ✓
                  </span>
                )}
              </div>
            )}

            {options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`custom-dropdown__item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                >
                  <div className="custom-dropdown__item-content">
                    {opt.icon && (
                      <span className="custom-dropdown__item-icon">{opt.icon}</span>
                    )}
                    <span className="custom-dropdown__item-label">{opt.label}</span>
                    {opt.sublabel && (
                      <span className="custom-dropdown__item-sublabel">{opt.sublabel}</span>
                    )}
                  </div>
                  {isSelected && (
                    <span className="custom-dropdown__checkmark" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <span className="custom-dropdown__error-message">
          {error}
        </span>
      )}
    </div>
  );
}
