import { isStateAllowedForType } from './semanticMapping';

export const PREVIEW_STATES = [
  { id: 'static', label: 'Static' },
  { id: 'load', label: 'Load' },
  { id: 'hover', label: 'Hover' },
  { id: 'click', label: 'Click' },
];

export const getPreviewStatesForType = (type) => {
  if (!type) return PREVIEW_STATES;

  return PREVIEW_STATES.filter(
    (state) => state.id === 'static' || isStateAllowedForType(state.id, type)
  );
};

export const hasConfiguredAnimation = (params, state) => {
  const presetId = params?.animations?.[state]?.presetId;
  return Boolean(presetId && presetId !== 'none');
};

export const getPreferredPreviewState = (params) => {
  const states = getPreviewStatesForType(params?.type);
  const availableIds = new Set(states.map((state) => state.id));
  const preferred = ['load', 'hover', 'click'].find(
    (state) => availableIds.has(state) && hasConfiguredAnimation(params, state)
  );

  return (
    preferred || (availableIds.has('load') ? 'load' : states[0]?.id || 'static')
  );
};
