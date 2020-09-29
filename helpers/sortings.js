function sortings() {
  function lexicographical(array) {
    return array.sort(compare);
  }

  function lexicographicalSubArray(array, subArrayName) {
    array.forEach(el => {
      el = el[subArrayName].sort(compare);
    });
    return array;
  }

  function compare(a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    let comparison = 0;
    if (nameA > nameB) {
      comparison = 1;
    } else if (nameA < nameB) {
      comparison = -1;
    }
    return comparison;
  }
  return {
    lexicographical,
    lexicographicalSubArray
  };
}

module.exports = sortings;
