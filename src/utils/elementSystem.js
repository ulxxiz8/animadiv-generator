// ==========================================
// 1. СЛОВНИК ЕЛЕМЕНТІВ (Single Source of Truth)
// ==========================================
export const ELEMENT_DEFINITIONS = {
  block: {
    tag: 'div',
    defaultStyles: {
      width: 200,
      height: 200,
      backgroundColor: '#F9FAFB',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      opacity: 1,
      padding: 16,
    },
    content: null,
    specificSettings: {
      alignX: 'center',
      alignY: 'center',
      gap: 16,
      overflow: 'visible',
    },
  },
  button: {
    tag: 'button',
    defaultStyles: {
      width: 140,
      height: 48,
      backgroundColor: '#111827',
      color: '#ffffff',
      borderRadius: 12,
      borderWidth: 0,
      borderColor: '#111827',
      opacity: 1,
      padding: '0 16px',
    },
    content: 'Submit',
    specificSettings: {
      text: 'Submit',
      type: 'button',
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 600,
      hoverBackground: '#374151',
      hoverColor: '#ffffff',
      hoverShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
      activeScale: 0.95,
    },
  },
  input: {
    tag: 'input',
    defaultStyles: {
      width: 240,
      height: 48,
      backgroundColor: '#ffffff',
      color: '#111827',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#D1D5DB',
      opacity: 1,
      padding: '0 16px',
    },
    content: null,
    specificSettings: {
      inputType: 'text',
      placeholder: 'Enter text...',
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 400,
      focusBorderColor: '#4F46E5',
      focusShadow: '0 0 0 3px rgba(79, 70, 229, 0.2)',
      disabled: false,
    },
  },
  textarea: {
    tag: 'textarea',
    defaultStyles: {
      width: 240,
      height: 100,
      backgroundColor: '#ffffff',
      color: '#111827',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#D1D5DB',
      opacity: 1,
      padding: '12px 16px',
    },
    content: null,
    specificSettings: {
      placeholder: 'Type your message...',
      rows: 4,
      resize: 'both',
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 400,
      focusBorderColor: '#4F46E5',
      focusShadow: '0 0 0 3px rgba(79, 70, 229, 0.2)',
      disabled: false,
    },
  },
  checkbox: {
    tag: 'input',
    defaultStyles: {
      width: 24,
      height: 24,
      backgroundColor: '#111827',
      color: '#111827',
      borderRadius: 6,
      borderWidth: 0,
      borderColor: '#111827',
      opacity: 1,
    },
    content: null,
    specificSettings: {
      checked: true,
      checkStyle: 'tick',
      checkColor: '#ffffff',
      size: 24,
      label: 'Remember me',
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 500,
    },
  },
  radio: {
    tag: 'input',
    defaultStyles: {
      width: 24,
      height: 24,
      backgroundColor: '#111827',
      color: '#111827',
      borderRadius: 50,
      borderWidth: 0,
      borderColor: '#111827',
      opacity: 1,
    },
    content: null,
    specificSettings: {
      checked: false,
      radioStyle: 'dot',
      color: '#4F46E5',
      name: 'radioGroup',
      label: 'Option 1',
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 500,
    },
  },
  text: {
    tag: 'p',
    defaultStyles: {
      width: 'auto',
      height: 'auto',
      backgroundColor: 'transparent',
      color: '#111827',
      borderWidth: 0,
      borderColor: 'transparent',
      opacity: 1,
      padding: 0,
    },
    content: 'Typography',
    specificSettings: {
      content: 'Typography',
      tag: 'p',
      fontFamily: 'Inter',
      fontSize: 24,
      fontWeight: 800,
      textAlign: 'center',
      lineHeight: 1.5,
      letterSpacing: 0,
      truncate: false,
      maxLines: 1,
    },
  },
  image: {
    tag: 'img',
    defaultStyles: {
      width: 240,
      height: 160,
      backgroundColor: '#E5E7EB',
      borderRadius: 12,
      borderWidth: 0,
      borderColor: '#D1D5DB',
      opacity: 1,
    },
    content: null,
    specificSettings: {
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      alt: 'Abstract placeholder',
      objectFit: 'cover',
      hoverScale: 1.05,
    },
  },
  link: {
    tag: 'a',
    defaultStyles: {
      width: 'auto',
      height: 'auto',
      backgroundColor: 'transparent',
      color: '#4F46E5',
      borderWidth: 0,
      borderColor: 'transparent',
      opacity: 1,
      padding: 0,
    },
    content: 'Click here',
    specificSettings: {
      text: 'Click here',
      href: '#',
      underline: 'hover',
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 500,
      hoverColor: '#3730A3',
    },
  },
};

// ==========================================
// 2. АРХІТЕКТУРА MOTION SYSTEM (Isolated Extension)
// ==========================================
export const DEFAULT_ANIMATION_CONFIG = {
  effectPreset: 'none',
  duration: 300, // ms
  delay: 0, // ms
  easing: 'ease', // linear, ease-in, cubic-bezier, etc.
  iterationCount: 1, // number or 'infinite'
  direction: 'normal', // normal, reverse, alternate, alternate-reverse
  intensity: 100, // % (глобальний модифікатор сили ефекту)
  transformOrigin: 'center', // center, top left, bottom right, etc.
  fillMode: 'both', // none, forwards, backwards, both
  motionAxis: 'all', // x, y, z, all (обмеження осей для slide/scale)
  blurAmount: 0, // px
  scaleRange: [1, 1], // [startScale, endScale]
  rotationAngle: 0, // degrees
  stagger: 0, // ms (для children reveal)
  zoomIntensity: 50, // Для zoomReveal та kenBurns
  tiltAngle: 15, // Для tiltHover
  hoverDepth: 20, // Для parallax
  parallaxDirection: 'diagonal',
  floatingAmount: 10, // Для floatingImage в px
  glowColor: 'rgba(79, 70, 229, 0.4)', // Дефолтний фіолетовий
  rippleColor: 'rgba(255, 255, 255, 0.4)', // Напівпрозорий білий
  errorColor: 'rgba(239, 68, 68, 0.8)',
  effects: [],
  usePhysics: false, // Опціональний перемикач
  stiffness: 100, // Жорсткість пружини (швидкість/енергія)
  damping: 10, // Загасання (як швидко зупиняється)
  mass: 1,
  motionToken: 'custom',
  reduceMotion: false,
};

// ==========================================
// 3. ФУНКЦІЯ СТВОРЕННЯ ЕЛЕМЕНТА (Factory)
// ==========================================
/**
 * Створює новий об'єкт елемента з базовими налаштуваннями та новою структурою анімацій.
 * @param {string} type - Тип елемента (button, input, card тощо)
 * @returns {Object} Повний конфіг елемента
 */
export const createElement = (type) => {
  const definition = ELEMENT_DEFINITIONS[type];

  if (!definition) {
    console.error(`Тип елемента "${type}" не знайдено в словнику.`);
    return null;
  }

  return {
    id: `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: type,
    tag: definition.tag,
    styles: { ...definition.defaultStyles },
    content: definition.content,
    specificSettings: { ...definition.specificSettings },

    // НОВА СТРУКТУРА ДАНИХ (Isolated extension)
    // Глибоке копіювання, щоб уникнути мутацій базового об'єкта
    animations: {
      load: { ...DEFAULT_ANIMATION_CONFIG },
      hover: { ...DEFAULT_ANIMATION_CONFIG },
      click: { ...DEFAULT_ANIMATION_CONFIG },
    },
  };
};

// ==========================================
// 4. ФУНКЦІЇ ОНОВЛЕННЯ (State Updaters)
// ==========================================

export const updateElementStyle = (elementState, styleKey, value) => {
  return {
    ...elementState,
    styles: {
      ...elementState.styles,
      [styleKey]: value,
    },
  };
};

export const updateSpecificSetting = (elementState, settingKey, value) => {
  let newContent = elementState.content;
  if (settingKey === 'text' || settingKey === 'content') {
    newContent = value;
  }

  return {
    ...elementState,
    content: newContent,
    specificSettings: {
      ...elementState.specificSettings,
      [settingKey]: value,
    },
  };
};

export const updateElementBatch = (
  elementState,
  newStyles = {},
  newSpecificSettings = {}
) => {
  return {
    ...elementState,
    styles: { ...elementState.styles, ...newStyles },
    specificSettings: {
      ...elementState.specificSettings,
      ...newSpecificSettings,
    },
  };
};

/**
 * Новий утилітарний метод для оновлення параметрів анімації
 */
export const updateAnimationParam = (
  elementState,
  triggerState,
  paramKey,
  value
) => {
  return {
    ...elementState,
    animations: {
      ...elementState.animations,
      [triggerState]: {
        ...elementState.animations[triggerState],
        [paramKey]: value,
      },
    },
  };
};
