

/**
 * Get the name of a function that calls this Fn. :)
 * @returns name of the function that called it
 */
export const getOrigin = () => {
  console.log(getOrigin.caller);
  // return getOrigin.caller
};

/**
 * Convert array to chunks of arrays with size n
 * @param a any array
 * @param size chunk size
 * @returns array of any[]
 */
 export const chunkArray = (a: any[], size: number) =>
 Array.from(new Array(Math.ceil(a.length / size)), (_, i) => a.slice(i * size, i * size + size));

