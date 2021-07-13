String.prototype.capitalize = function () {
  return this ? this[0].toUpperCase() + this.slice(1) : '';
};
