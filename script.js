function printGPattern(size) {
  for (let i = 0; i < size; i++) {
    let line = "";

    if (i === 0) {
      line = " *****";
    } else if (i > 0 && i < size / 2) {
      line = "*";
    } else if (i === Math.floor(size / 2)) {
      line = "*  ***";
    } else if (i > Math.floor(size / 2) && i < size - 1) {
      line = "*    *";
    } else if (i === size - 1) {
      line = " *****";
    }

    console.log(line);
  }
}

printGPattern(7);
