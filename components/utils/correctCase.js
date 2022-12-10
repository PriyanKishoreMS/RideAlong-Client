export const correctCase = str => {
  if (!str) return '';
  str = str.split(' ');
  if (str.length === 1) str = str[0].toLowerCase();
  else str = str[0].toLowerCase() + ' ' + str[1].toLowerCase();
  str = (str.match(/[a-zA-Z0-9]+/g) || [])
    .map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
    .join(' ');
  return str;
};
