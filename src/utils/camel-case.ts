export default function (input: string): string {
  return input
    .split(/[\s-]/)
    .map((word, offset) =>
      offset === 0
        ? word.toLowerCase()
        : word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join('');
}
