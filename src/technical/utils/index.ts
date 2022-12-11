export const isNumeric = (num: any) => {
  return (
    (typeof num === 'number' ||
      (typeof num === 'string' && num.trim() !== '')) &&
    !isNaN(num as number)
  );
};
