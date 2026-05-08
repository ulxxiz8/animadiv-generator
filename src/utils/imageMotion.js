// ==========================================
// IMAGE MOTION GENERATOR
// ==========================================
export const generateImageCSS = (presetId, config, uniqueId) => {
  const {
    duration = 500,
    delay = 0,
    easing = 'ease',
    blurAmount = 10,
    // Нові специфічні параметри
    zoomIntensity = 50,
    tiltAngle = 15,
    parallaxDirection = 'diagonal',
    floatingAmount = 10,
  } = config;

  let keyframes = '';
  let animationStr = 'none';
  const animName = `ad_img_${presetId}_${uniqueId}`;

  switch (presetId) {
    case 'zoomReveal': {
      // zoomIntensity: 50 -> 1.5x scale
      const startScale = 1 + zoomIntensity / 100;
      keyframes = `
        @keyframes ${animName} { 
          0% { opacity: 0; transform: scale(${startScale}); } 
          100% { opacity: 1; transform: scale(1); } 
        }
      `;
      animationStr = `${animName} ${duration}ms ${easing} ${delay}ms both`;
      break;
    }
    case 'kenBurns': {
      // Ken Burns — це дуже повільний зум із легким зсувом
      const endScale = 1 + zoomIntensity / 200; // max ~1.25x
      keyframes = `
        @keyframes ${animName} { 
          0% { transform: scale(1) translate(0, 0); } 
          100% { transform: scale(${endScale}) translate(-2%, -2%); } 
        }
      `;
      // duration * 10 для ефекту кінематографічної повільності
      animationStr = `${animName} ${duration * 10}ms linear ${delay}ms both`;
      break;
    }
    case 'floatingImage': {
      // Infinite translateY
      keyframes = `
        @keyframes ${animName} { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-${floatingAmount}px); } 
        }
      `;
      animationStr = `${animName} ${duration * 2}ms ease-in-out ${delay}ms infinite`;
      break;
    }
    case 'hoverBrightness': {
      keyframes = `
        @keyframes ${animName} { 
          0% { filter: brightness(1); } 
          100% { filter: brightness(1.3); } 
        }
      `;
      animationStr = `${animName} ${duration}ms ${easing} ${delay}ms forwards`;
      break;
    }
    case 'hoverBlur': {
      keyframes = `
        @keyframes ${animName} { 
          0% { filter: blur(0px); } 
          100% { filter: blur(${blurAmount}px); } 
        }
      `;
      animationStr = `${animName} ${duration}ms ${easing} ${delay}ms forwards`;
      break;
    }
    case 'tiltHover': {
      // Імітація 3D-нахилу через CSS-перспективу
      keyframes = `
        @keyframes ${animName} { 
          0% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); } 
          100% { transform: perspective(1000px) rotateX(${tiltAngle}deg) rotateY(-${tiltAngle}deg); } 
        }
      `;
      animationStr = `${animName} ${duration}ms ${easing} ${delay}ms forwards`;
      break;
    }
    case 'parallaxHover': {
      // ✅ ВИПРАВЛЕНО: використовуємо hoverDepth
      const depth = config.hoverDepth || 20;
      let translateDef = `translate(${depth}px, -${depth}px)`;
      if (parallaxDirection === 'left')
        translateDef = `translate(-${depth}px, 0)`;
      if (parallaxDirection === 'right')
        translateDef = `translate(${depth}px, 0)`;

      keyframes = `
        @keyframes ${animName} { 
          0% { transform: scale(1) translate(0, 0); } 
          100% { transform: scale(1.05) ${translateDef}; } 
        }
      `;
      animationStr = `${animName} ${duration}ms ${easing} ${delay}ms forwards`;
      break;
    }
    default:
      break;
  }

  return { keyframes, animationStr };
};
