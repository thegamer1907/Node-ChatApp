var isreals = (str) => {
  str = str.trim();
  return typeof str === 'string' && str.length > 0;
};

module.exports = {isreals};
