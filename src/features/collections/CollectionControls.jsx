import React from 'react';
import { animationPresets } from '../../data/presets';
import { Button } from '../../components/UIElements';
import { useTranslation } from '../../i18n/useTranslation';

const CollectionControls = ({
  globalPreset,
  setGlobalPreset,
  staggerDelay,
  setStaggerDelay,
  onPlay,
  onReset,
}) => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 900,
              color: '#111827',
              textTransform: 'uppercase',
              marginBottom: 16,
              letterSpacing: '0.03em',
              lineHeight: 1.1,
            }}
          >
            {t('collections.globalAnimation')}
            <span
              style={{
                display: 'block',
                fontSize: 11,
                color: '#6B7280',
                textTransform: 'none',
                marginTop: 5,
                letterSpacing: 0,
                fontWeight: 700,
              }}
            >
              {t('collections.wholeSection')}
            </span>
          </div>

          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 800,
              color: '#374151',
              marginBottom: 8,
            }}
          >
            {t('controls.labels.primaryEffect')}
          </label>
          <select
            value={globalPreset}
            onChange={(event) => setGlobalPreset(event.target.value)}
            style={{
              width: '100%',
              padding: '11px 12px',
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              fontSize: 14,
              color: '#111827',
              background: '#FFFFFF',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
            }}
          >
            <option value="none">{t('options.none')}</option>
            {animationPresets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {t(preset.nameKey, { defaultValue: preset.name })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
              gap: 12,
            }}
          >
            <label
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: '#374151',
              }}
            >
              {t('collections.staggerDelay')}
            </label>
            <span
              style={{
                fontSize: 12,
                color: '#111827',
                fontWeight: 900,
                background: '#D6F854',
                padding: '4px 7px',
                borderRadius: 8,
                lineHeight: 1,
              }}
            >
              {staggerDelay}ms
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={staggerDelay}
            onChange={(event) => setStaggerDelay(Number(event.target.value))}
            style={{
              width: '100%',
              cursor: 'pointer',
              accentColor: '#111827',
            }}
          />
          <p
            style={{
              fontSize: 12,
              color: '#9CA3AF',
              margin: '9px 0 0',
              lineHeight: 1.45,
            }}
          >
            {t('collections.staggerHelp')}
          </p>
        </div>
      </div>

      <div
        style={{
          padding: '20px 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexWrap: 'nowrap',
          gap: '12px',
          background: 'var(--surface)',
          flex: '0 0 auto',
          boxShadow: '0 -12px 24px rgba(15, 23, 42, 0.08)',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
        }}
      >
        <Button
          onClick={onPlay}
          style={{ width: 'auto', flex: '1 1 0', minWidth: 0 }}
        >
          {t('common.play')}
        </Button>
        <Button
          variant="secondary"
          onClick={onReset}
          style={{ width: 'auto', flex: '1 1 0', minWidth: 0 }}
        >
          {t('common.reset')}
        </Button>
      </div>
    </div>
  );
};

export default CollectionControls;
