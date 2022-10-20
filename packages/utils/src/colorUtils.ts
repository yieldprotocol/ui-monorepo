/**
 * Color utilities
 * */
export const modColor = (color: any, amount: any) => {
  let c;
  let cT;
  if (color.length === 9 || color.length === 8) {
    c = color.substring(0, color.length - 2);
    cT = color.slice(-2);
  } else {
    c = color;
    cT = 'FF';
  }
  // eslint-disable-next-line prefer-template
  return `#${c
    .replace(/^#/, '')
    .replace(/../g, (col: any) =>
      `0${Math.min(255, Math.max(0, parseInt(col, 16) + amount)).toString(16)}`.substr(-2)
    )}${cT}`;
};

export const contrastColor = (hex: any) => {
  const hex_ = hex.slice(1);
  if (hex_.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  const r = parseInt(hex_.slice(0, 2), 16);
  const g = parseInt(hex_.slice(2, 4), 16);
  const b = parseInt(hex_.slice(4, 6), 16);

  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? 'brand' : 'brand-light';
};

export const invertColor = (hex: any) => {
  function padZero(str: string) {
    const zeros = new Array(2).join('0');
    return (zeros + str).slice(-2);
  }
  const hex_ = hex.slice(1);
  if (hex_.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  const r = (255 - parseInt(hex_.slice(0, 2), 16)).toString(16);
  const g = (255 - parseInt(hex_.slice(2, 4), 16)).toString(16);
  const b = (255 - parseInt(hex_.slice(4, 6), 16)).toString(16);
  // pad each with zeros and return
  return `#${padZero(r)}${padZero(g)}${padZero(b)}`;
};

export const buildGradient = (colorFrom: string, colorTo: string) => `linear-gradient(to bottom right,
        ${modColor(colorFrom || '#add8e6', -50)}, 
        ${modColor(colorFrom || '#add8e6', 0)},
        ${modColor(colorFrom || '#add8e6', 0)},
        ${modColor(colorTo, 50)},
        ${modColor(colorTo, 50)}, 
        ${modColor(colorTo, 50)},
        ${modColor(colorTo, 25)}, 
        ${modColor(colorTo, 0)}, 
        ${modColor(colorTo, 0)})
  `;
