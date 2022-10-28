/**
 * TRUNCATE a string value to a certain number of 'decimal' points 
 * @param input <string | undefined>
 * @param decimals <number>
 * @returns 
 */
 export const truncateValue = (input: string | undefined, decimals: number) => {
    const re = new RegExp(`(\\d+\\.\\d{${decimals}})(\\d)`);
    if (input !== undefined && parseInt(input) ) {
      const input_ = input![0] === '.' ? '0'.concat(input!) : input;
      const inpu = input_?.match(re); // inpu = truncated 'input'... get it?
      if (inpu) {
        return inpu[1];
      }
      return input?.valueOf();
    }
    return '0.0';
  };
  
  
  /* handle Address/hash shortening */
  export const abbreviateHash = (addr: string, buffer: number = 4) =>
    `${addr?.substring(0, buffer)}...${addr?.substring(addr.length - buffer)}`;
  
  /**
   * Number formatting if reqd.
   * */
  export const nFormatter = (num: number, digits: number) => {
    const si = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'k' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
  };
  
  
  export const numberWithCommas = (x: number) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  export const formatValue = (x: string | number, decimals: number) =>
    numberWithCommas(Number(truncateValue(x?.toString(), decimals)));