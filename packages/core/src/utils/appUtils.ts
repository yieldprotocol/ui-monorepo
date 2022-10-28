
export const getBrowserCachedValue = (index: string) =>
  typeof window !== 'undefined' && localStorage.getItem(index) !== null && JSON.parse(localStorage.getItem(index)!);

export const setBrowserCachedValue = (index: string, valueToStore: any) =>
  typeof window !== 'undefined' && localStorage.setItem(index, JSON.stringify(valueToStore));
