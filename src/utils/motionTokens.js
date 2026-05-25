export const MOTION_TOKENS = {
  custom: {
    name: 'Custom',
    nameKey: 'data.motionTokens.custom',
  },
  snappy: {
    name: 'Snappy',
    nameKey: 'data.motionTokens.snappy',
    duration: 200,
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    intensity: 120,
    blurAmount: 0,
    stagger: 30,
  },
  smooth: {
    name: 'Smooth',
    nameKey: 'data.motionTokens.smooth',
    duration: 600,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    intensity: 100,
    blurAmount: 5,
    stagger: 100,
  },
  cinematic: {
    name: 'Cinematic',
    nameKey: 'data.motionTokens.cinematic',
    duration: 1200,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    intensity: 150,
    blurAmount: 15,
    stagger: 200,
  },
  playful: {
    name: 'Playful',
    nameKey: 'data.motionTokens.playful',
    duration: 500,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    intensity: 80,
    blurAmount: 0,
    stagger: 60,
  },
  subtle: {
    name: 'Subtle',
    nameKey: 'data.motionTokens.subtle',
    duration: 400,
    easing: 'ease-out',
    intensity: 30,
    blurAmount: 2,
    stagger: 40,
  },
};

export const applyMotionToken = (currentConfig, tokenId) => {
  if (!tokenId || tokenId === 'custom' || !MOTION_TOKENS[tokenId]) {
    return { ...currentConfig, motionToken: 'custom' };
  }

  const tokenParams = MOTION_TOKENS[tokenId];

  return {
    ...currentConfig,
    motionToken: tokenId,
    duration: tokenParams.duration,
    easing: tokenParams.easing,
    intensity: tokenParams.intensity,
    blurAmount: tokenParams.blurAmount,
    stagger: tokenParams.stagger,
  };
};
