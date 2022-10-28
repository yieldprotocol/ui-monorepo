/**
 * Copy string to clipboard
 * @param string string to copy
 */
export const copyToClipboard = (string: string) => {
  const el = document.createElement('textarea');
  el.value = string;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

/**
 * Broswer Caching Functions (used)
 * */
export const getBrowserCachedValue = (index: string) =>
  typeof window !== 'undefined' && localStorage.getItem(index) !== null && JSON.parse(localStorage.getItem(index)!);

export const setBrowserCachedValue = (index: string, valueToStore: any) =>
  typeof window !== 'undefined' && localStorage.setItem(index, JSON.stringify(valueToStore));

export const clearCachedItems = (keys: string[]) => {
  if (keys.length > 0) {
    keys.forEach((k: string) => {
      window.localStorage.removeItem(k);
    });
  } else window.localStorage.clear();
};

