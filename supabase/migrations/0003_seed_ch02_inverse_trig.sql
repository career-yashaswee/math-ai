-- ================================================================
-- MathAI Seed — Chapter 2: Inverse Trigonometric Functions
-- 3 Topics | 6 Questions (4 Easy · 1 Medium · 1 Hard)
-- ================================================================

BEGIN;

-- ─── TOPICS ──────────────────────────────────────────────────────

INSERT INTO public.topics (chapter_id, name, description, order_index)
SELECT id, 'Principal Values and Domain',
  'Domain, range, and principal value branches of all six inverse trig functions', 1
FROM public.chapters WHERE name = 'Inverse Trigonometric Functions';

INSERT INTO public.topics (chapter_id, name, description, order_index)
SELECT id, 'Properties of Inverse Trig Functions',
  'Key identities: complementary angles, negative angles, double and sum formulas', 2
FROM public.chapters WHERE name = 'Inverse Trigonometric Functions';

INSERT INTO public.topics (chapter_id, name, description, order_index)
SELECT id, 'Simplification and Equations',
  'Simplifying inverse trig expressions and solving equations involving them', 3
FROM public.chapters WHERE name = 'Inverse Trigonometric Functions';

-- ─── QUESTIONS ───────────────────────────────────────────────────

-- Q1 · Easy · Principal Values and Domain
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,
  $t1$Find the Principal Value of sin⁻¹(1/2)$t1$,
  $b1$Find the **principal value** of:
$$\sin^{-1}\!\left(\frac{1}{2}\right)$$
Recall that the principal value branch of $\sin^{-1}$ is $\left[-\dfrac{\pi}{2},\, \dfrac{\pi}{2}\right]$.$b1$,
  $a1$## Solution

We need to find $\theta$ such that:
$$\sin\theta = \frac{1}{2} \quad \text{and} \quad \theta \in \left[-\frac{\pi}{2},\, \frac{\pi}{2}\right]$$

From the unit circle, $\sin\!\left(\dfrac{\pi}{6}\right) = \dfrac{1}{2}$.

Since $\dfrac{\pi}{6} \in \left[-\dfrac{\pi}{2}, \dfrac{\pi}{2}\right]$, it is the principal value.

$$\boxed{\sin^{-1}\!\left(\frac{1}{2}\right) = \frac{\pi}{6}}$$

> **Key fact:** Always check that the answer lies within the principal value branch.$a1$,
  'easy', 10,
  $h1$What angle θ in [−π/2, π/2] satisfies sin θ = 1/2? Think of standard angle values: 30°, 45°, 60°.$h1$
FROM public.topics t JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Inverse Trigonometric Functions' AND t.name = 'Principal Values and Domain';

-- Q2 · Easy · Principal Values and Domain
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,
  $t2$Find the Principal Value of cos⁻¹(−1/2)$t2$,
  $b2$Find the **principal value** of:
$$\cos^{-1}\!\left(-\frac{1}{2}\right)$$
The principal value branch of $\cos^{-1}$ is $[0,\, \pi]$.$b2$,
  $a2$## Solution

We need $\theta$ such that:
$$\cos\theta = -\frac{1}{2} \quad \text{and} \quad \theta \in [0,\, \pi]$$

We know $\cos\!\left(\dfrac{\pi}{3}\right) = \dfrac{1}{2}$, and since $\cos$ is negative in the second quadrant:
$$\cos\!\left(\pi - \frac{\pi}{3}\right) = -\cos\!\left(\frac{\pi}{3}\right) = -\frac{1}{2}$$
$$\therefore \cos\!\left(\frac{2\pi}{3}\right) = -\frac{1}{2}$$

Since $\dfrac{2\pi}{3} \in [0,\, \pi]$:
$$\boxed{\cos^{-1}\!\left(-\frac{1}{2}\right) = \frac{2\pi}{3}}$$

> **Tip:** For $\cos^{-1}(-x) = \pi - \cos^{-1}(x)$.$a2$,
  'easy', 10,
  $h2$Use the identity: cos⁻¹(−x) = π − cos⁻¹(x). First find cos⁻¹(1/2), then apply the identity.$h2$
FROM public.topics t JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Inverse Trigonometric Functions' AND t.name = 'Principal Values and Domain';

-- Q3 · Easy · Principal Values and Domain
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,
  $t3$Find the Principal Value of tan⁻¹(√3)$t3$,
  $b3$Find the **principal value** of:
$$\tan^{-1}(\sqrt{3})$$
The principal value branch of $\tan^{-1}$ is $\left(-\dfrac{\pi}{2},\, \dfrac{\pi}{2}\right)$.$b3$,
  $a3$## Solution

We need $\theta$ such that:
$$\tan\theta = \sqrt{3} \quad \text{and} \quad \theta \in \left(-\frac{\pi}{2},\, \frac{\pi}{2}\right)$$

From standard values, $\tan\!\left(\dfrac{\pi}{3}\right) = \sqrt{3}$.

Since $\dfrac{\pi}{3} \in \left(-\dfrac{\pi}{2}, \dfrac{\pi}{2}\right)$:
$$\boxed{\tan^{-1}(\sqrt{3}) = \frac{\pi}{3}}$$

### Standard Inverse Trig Values (quick reference)
| Expression | Value |
|---|---|
| $\sin^{-1}(0)$ | $0$ |
| $\sin^{-1}\!\left(\frac{1}{2}\right)$ | $\frac{\pi}{6}$ |
| $\sin^{-1}\!\left(\frac{\sqrt{3}}{2}\right)$ | $\frac{\pi}{3}$ |
| $\cos^{-1}(-1)$ | $\pi$ |
| $\tan^{-1}(1)$ | $\frac{\pi}{4}$ |$a3$,
  'easy', 10,
  $h3$What angle in (−π/2, π/2) has tangent equal to √3? Recall tan(60°) = √3.$h3$
FROM public.topics t JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Inverse Trigonometric Functions' AND t.name = 'Principal Values and Domain';

-- Q4 · Easy · Properties of Inverse Trig Functions
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,
  $t4$Find the Value of sin(cos⁻¹(4/5))$t4$,
  $b4$Evaluate:
$$\sin\!\left(\cos^{-1}\!\left(\frac{4}{5}\right)\right)$$

*Hint: Let $\cos^{-1}(4/5) = \theta$ and use a right-angled triangle.*$b4$,
  $a4$## Solution

Let $\theta = \cos^{-1}\!\left(\dfrac{4}{5}\right)$, so $\cos\theta = \dfrac{4}{5}$ with $\theta \in [0, \pi]$.

### Using Pythagorean Identity
$$\sin^2\theta + \cos^2\theta = 1$$
$$\sin^2\theta = 1 - \cos^2\theta = 1 - \frac{16}{25} = \frac{9}{25}$$
$$\sin\theta = \frac{3}{5} \quad (\text{positive since } \theta \in [0,\pi])$$

Therefore:
$$\boxed{\sin\!\left(\cos^{-1}\!\left(\frac{4}{5}\right)\right) = \frac{3}{5}}$$

> Geometrically: in a right triangle with hypotenuse $5$ and adjacent $4$, the opposite side is $\sqrt{25-16} = 3$, giving $\sin\theta = 3/5$.$a4$,
  'easy', 10,
  $h4$Let θ = cos⁻¹(4/5), so cos θ = 4/5. Draw a right triangle: hypotenuse 5, adjacent 4. Find the opposite side.$h4$
FROM public.topics t JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Inverse Trigonometric Functions' AND t.name = 'Properties of Inverse Trig Functions';

-- Q5 · Medium · Properties of Inverse Trig Functions
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,
  $t5$Prove that tan⁻¹(1/2) + tan⁻¹(1/3) = π/4$t5$,
  $b5$Prove that:
$$\tan^{-1}\!\left(\frac{1}{2}\right) + \tan^{-1}\!\left(\frac{1}{3}\right) = \frac{\pi}{4}$$

Use the addition formula for inverse tangent.$b5$,
  $a5$## Solution

### Recall the Addition Formula
$$\tan^{-1}(a) + \tan^{-1}(b) = \tan^{-1}\!\left(\frac{a+b}{1-ab}\right) \quad \text{if } ab < 1$$

Here $a = \dfrac{1}{2}$ and $b = \dfrac{1}{3}$.

**Check:** $ab = \dfrac{1}{2} \cdot \dfrac{1}{3} = \dfrac{1}{6} < 1$ ✓ (formula applies directly)

### Applying the Formula
$$\tan^{-1}\!\left(\frac{1}{2}\right) + \tan^{-1}\!\left(\frac{1}{3}\right) = \tan^{-1}\!\left(\frac{\frac{1}{2} + \frac{1}{3}}{1 - \frac{1}{2} \cdot \frac{1}{3}}\right)$$

$$= \tan^{-1}\!\left(\frac{\frac{3+2}{6}}{1 - \frac{1}{6}}\right) = \tan^{-1}\!\left(\frac{\frac{5}{6}}{\frac{5}{6}}\right) = \tan^{-1}(1)$$

$$= \frac{\pi}{4}$$

$$\boxed{\tan^{-1}\!\left(\frac{1}{2}\right) + \tan^{-1}\!\left(\frac{1}{3}\right) = \frac{\pi}{4}}$$

> **Key condition:** The formula $\tan^{-1}a + \tan^{-1}b = \tan^{-1}\!\left(\frac{a+b}{1-ab}\right)$ is valid only when $ab < 1$.$a5$,
  'medium', 15,
  $h5$Use the identity: tan⁻¹(a) + tan⁻¹(b) = tan⁻¹((a+b)/(1−ab)), valid when ab < 1.$h5$
FROM public.topics t JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Inverse Trigonometric Functions' AND t.name = 'Properties of Inverse Trig Functions';

-- Q6 · Hard · Simplification and Equations
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,
  $t6$Find the Value of sin⁻¹(sin(2π/3))$t6$,
  $b6$Evaluate:
$$\sin^{-1}\!\left(\sin\!\left(\frac{2\pi}{3}\right)\right)$$

**Note:** Be careful — $\sin^{-1}(\sin x) = x$ only when $x \in \left[-\dfrac{\pi}{2}, \dfrac{\pi}{2}\right]$.$b6$,
  $a6$## Solution

Since $\dfrac{2\pi}{3} \notin \left[-\dfrac{\pi}{2},\, \dfrac{\pi}{2}\right]$, we **cannot** directly write $\sin^{-1}(\sin(2\pi/3)) = 2\pi/3$.

### Step 1: Simplify sin(2π/3)
$$\sin\!\left(\frac{2\pi}{3}\right) = \sin\!\left(\pi - \frac{\pi}{3}\right) = \sin\!\left(\frac{\pi}{3}\right) = \frac{\sqrt{3}}{2}$$

### Step 2: Find sin⁻¹(√3/2)
Now we need:
$$\sin^{-1}\!\left(\frac{\sqrt{3}}{2}\right) = \theta \quad \text{where} \quad \theta \in \left[-\frac{\pi}{2},\, \frac{\pi}{2}\right]$$

We know $\sin\!\left(\dfrac{\pi}{3}\right) = \dfrac{\sqrt{3}}{2}$, and $\dfrac{\pi}{3} \in \left[-\dfrac{\pi}{2}, \dfrac{\pi}{2}\right]$.

$$\boxed{\sin^{-1}\!\left(\sin\!\left(\frac{2\pi}{3}\right)\right) = \frac{\pi}{3}}$$

> **Key rule:** $\sin^{-1}(\sin x) = \pi - x$ when $x \in \left[\dfrac{\pi}{2}, \pi\right]$.
> Here: $\pi - \dfrac{2\pi}{3} = \dfrac{\pi}{3}$. ✓$a6$,
  'hard', 20,
  $h6$Note that 2π/3 is outside [−π/2, π/2]. First simplify sin(2π/3) using sin(π − x) = sin x, then apply sin⁻¹.$h6$
FROM public.topics t JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Inverse Trigonometric Functions' AND t.name = 'Simplification and Equations';

COMMIT;
