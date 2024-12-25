const latexToUnicode: { [key: string]: string } = {
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  delta: 'δ',
  epsilon: 'ε',
  zeta: 'ζ',
  eta: 'η',
  theta: 'θ',
  iota: 'ι',
  kappa: 'κ',
  lambda: 'λ',
  mu: 'μ',
  nu: 'ν',
  xi: 'ξ',
  pi: 'π',
  rho: 'ρ',
  sigma: 'σ',
  tau: 'τ',
  upsilon: 'υ',
  phi: 'φ',
  chi: 'χ',
  psi: 'ψ',
  omega: 'ω',
};

export function convertLatexMath(text: string): string {
  // Handle inline math mode ($...$)
  text = text.replace(/\$([^$]+)\$/g, (_, math) => {
    // Replace known symbols
    return math.replace(
      /\\([a-zA-Z]+)/g,
      (match: string, command: string): string => {
        return latexToUnicode[command.toLowerCase()] || match;
      },
    );
  });

  return text;
}
