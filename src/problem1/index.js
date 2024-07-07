function sum_to_n_a(n) {
  return (n * (n + 1)) / 2;
}

function sum_to_n_b(n) {
  return Array.from({ length: n }, (_, index) => index + 1) // Create array from 1 to n
    .reduce((result, currentValue) => currentValue + result, 0);
}

function sum_to_n_c(n) {
  if (n === 0) return 0;
  return n + sum_to_n_c(n - 1);
}
