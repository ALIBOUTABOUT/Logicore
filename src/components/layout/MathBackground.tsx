// Subtle architectural Swiss grid & faint monograph annotations
const MATH_SNIPPETS = [
  '∫₀^∞ e⁻ˣ dx = 1',
  'eⁱᵖ + 1 = 0',
  'O(n log n)',
  '∑ n² = n(n+1)(2n+1)/6',
  '01001100 01000011',
  'det(A) = ad − bc',
  'lim_{x→0} sin(x)/x = 1',
  '{ x ∈ ℝ | x > 0 }',
  'φ = (1 + √5) / 2',
];

export function MathBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Crisp architectural graph grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(10, 36, 99, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10, 36, 99, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Faint marginalia formulas */}
      {MATH_SNIPPETS.map((snippet, i) => (
        <div
          key={i}
          className="math-bg-text hidden md:block"
          style={{
            top:  `${8 + ((i * 10.5) % 84)}%`,
            left: `${4 + ((i * 17.3) % 80)}%`,
          }}
        >
          {snippet}
        </div>
      ))}
    </div>
  );
}
