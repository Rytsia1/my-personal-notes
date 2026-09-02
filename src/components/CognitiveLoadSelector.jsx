import React from 'react';

function CognitiveLoadSelector({ value = 1, onChange, readOnly = false }) {
  const levels = [1, 2, 3, 4, 5];
  
  const getLevelLabel = (level) => {
    switch (level) {
      case 1: return 'Sangat Ringan';
      case 2: return 'Ringan';
      case 3: return 'Menengah';
      case 4: return 'Berat';
      case 5: return 'Sangat Berat / Krusial';
      default: return 'Ringan';
    }
  };

  const currentLabel = getLevelLabel(value);
  const isInteractive = !readOnly && onChange;

  return (
    <div className={`cognitive-load ${readOnly ? 'cognitive-load--readonly' : ''}`}>
      <div className="cognitive-load__header">
        <span className="cognitive-load__title">Beban Kognitif</span>
        <span className="cognitive-load__label">{currentLabel}</span>
      </div>
      <div className="cognitive-load__bars" role="radiogroup" aria-label="Tingkat Beban Kognitif">
        {levels.map((level) => {
          const isActive = level <= value;
          let colorClass = '';
          
          if (isActive) {
            if (value <= 2) colorClass = 'cognitive-load__bar--safe';
            else if (value === 3) colorClass = 'cognitive-load__bar--warn';
            else colorClass = 'cognitive-load__bar--danger';
          }
          
          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={value === level}
              aria-label={`Level ${level}: ${getLevelLabel(level)}`}
              className={`cognitive-load__bar ${isActive ? 'cognitive-load__bar--active' : ''} ${colorClass}`}
              onClick={() => isInteractive && onChange(level)}
              disabled={readOnly}
              data-testid={`cognitive-load-bar-${level}`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(CognitiveLoadSelector);
