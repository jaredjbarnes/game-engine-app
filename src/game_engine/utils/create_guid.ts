function S4() {
  return Math.floor(Math.random() * 0x10000 /* 65536 */).toString(16);
}

export function createGuid() {
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}
