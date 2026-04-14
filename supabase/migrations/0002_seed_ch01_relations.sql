-- ================================================================
-- MathAI Seed — Chapter 1: Relations and Functions
-- 3 Topics | 6 Questions (4 Easy · 1 Medium · 1 Hard)
-- ================================================================

BEGIN;

-- ─── TOPICS ──────────────────────────────────────────────────────

INSERT INTO public.topics (chapter_id, name, description, order_index)
SELECT id,
  'Types of Relations',
  'Reflexive, symmetric, transitive and equivalence relations with examples',
  1
FROM public.chapters WHERE name = 'Relations and Functions';

INSERT INTO public.topics (chapter_id, name, description, order_index)
SELECT id,
  'Types of Functions',
  'One-one (injective), onto (surjective), bijective functions and their properties',
  2
FROM public.chapters WHERE name = 'Relations and Functions';

INSERT INTO public.topics (chapter_id, name, description, order_index)
SELECT id,
  'Composition of Functions',
  'Composition of two functions, identity function, and invertible functions',
  3
FROM public.chapters WHERE name = 'Relations and Functions';

-- ─── QUESTIONS ───────────────────────────────────────────────────

-- Q1 · Easy · Types of Relations
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,

  $t1$Check Properties of R = {(a, b) : a ≤ b} on ℤ$t1$,

  $b1$Let $R$ be a relation on $\mathbb{Z}$ defined by:
$$R = \{(a,\, b) : a \leq b\}$$

Determine whether $R$ is each of the following:
1. **Reflexive**
2. **Symmetric**
3. **Transitive**$b1$,

  $a1$## Solution

### 1. Reflexive
For any $a \in \mathbb{Z}$, we know $a \leq a$, so $(a, a) \in R$.
$$\therefore R \text{ is \textbf{reflexive}. } ✓$$

### 2. Symmetric
Take $a = 2,\; b = 3$. Then $2 \leq 3$, so $(2, 3) \in R$.
But $3 \not\leq 2$, so $(3, 2) \notin R$.
$$\therefore R \text{ is \textbf{not symmetric}. } ✗$$

### 3. Transitive
Suppose $(a, b) \in R$ and $(b, c) \in R$, i.e., $a \leq b$ and $b \leq c$.
By the transitivity of $\leq$:
$$a \leq b \leq c \implies a \leq c \implies (a,\, c) \in R$$
$$\therefore R \text{ is \textbf{transitive}. } ✓$$

> **Conclusion:** $R$ is reflexive and transitive but **not symmetric**.
> Since it fails symmetry, $R$ is **not** an equivalence relation — it is a **partial order** relation.$a1$,

  'easy', 10,

  $h1$For symmetry, try to find a counterexample: can you find $a \leq b$ but $b \not\leq a$?$h1$

FROM public.topics t
JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Relations and Functions' AND t.name = 'Types of Relations';

-- ──────────────────────────────────────────────────────────────────

-- Q2 · Easy · Types of Relations
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,

  $t2$Determine if R = {(1,1),(2,2),(3,3),(1,2),(2,1)} is an Equivalence Relation$t2$,

  $b2$Let $A = \{1, 2, 3\}$ and let the relation $R$ on $A$ be:
$$R = \{(1,1),\;(2,2),\;(3,3),\;(1,2),\;(2,1)\}$$

Check whether $R$ is an **equivalence relation**.$b2$,

  $a2$## Solution

A relation is an **equivalence relation** iff it is reflexive, symmetric, and transitive.

### 1. Reflexive
$(1,1),\;(2,2),\;(3,3) \in R$ — every element is related to itself. ✓

### 2. Symmetric
| Pair in $R$ | Reverse pair | In $R$? |
|---|---|---|
| $(1,2)$ | $(2,1)$ | ✓ |
| $(2,1)$ | $(1,2)$ | ✓ |
| $(1,1),(2,2),(3,3)$ | self | ✓ |

All pairs have their reverse. $R$ is **symmetric**. ✓

### 3. Transitive
Check every composition $(a,b) \in R$ and $(b,c) \in R \Rightarrow (a,c) \in R$:

- $(1,2) \in R,\; (2,1) \in R \Rightarrow (1,1) \in R$ ✓
- $(2,1) \in R,\; (1,2) \in R \Rightarrow (2,2) \in R$ ✓
- $(1,2) \in R,\; (2,2) \in R \Rightarrow (1,2) \in R$ ✓

All cases satisfied. $R$ is **transitive**. ✓

> **Conclusion:** $R$ is reflexive, symmetric, and transitive.
> $\therefore R$ is an **equivalence relation** on $A$.$a2$,

  'easy', 10,

  $h2$Remember: An equivalence relation must be ALL three: reflexive, symmetric, AND transitive. Check each separately.$h2$

FROM public.topics t
JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Relations and Functions' AND t.name = 'Types of Relations';

-- ──────────────────────────────────────────────────────────────────

-- Q3 · Easy · Types of Functions
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,

  $t3$Prove that f(x) = 3x is a Bijective Function from ℝ to ℝ$t3$,

  $b3$Let $f: \mathbb{R} \to \mathbb{R}$ be defined by $f(x) = 3x$.

Prove that $f$ is **bijective** (one-one and onto).$b3$,

  $a3$## Solution

### Step 1: One-One (Injective)
Assume $f(x_1) = f(x_2)$ for $x_1, x_2 \in \mathbb{R}$:
$$3x_1 = 3x_2 \implies x_1 = x_2$$
So $f$ is **one-one (injective)**. ✓

### Step 2: Onto (Surjective)
Let $y \in \mathbb{R}$ be any element of the codomain.
We want $x$ such that $f(x) = y$:
$$3x = y \implies x = \frac{y}{3} \in \mathbb{R}$$
For every $y \in \mathbb{R}$, there exists $x = \dfrac{y}{3} \in \mathbb{R}$ with $f(x) = y$.
So $f$ is **onto (surjective)**. ✓

> **Conclusion:** Since $f$ is both one-one and onto, $f$ is **bijective**.

**Note:** The inverse function is $f^{-1}(x) = \dfrac{x}{3}$.$a3$,

  'easy', 10,

  $h3$For injective: assume f(x₁) = f(x₂) and derive x₁ = x₂. For surjective: given any y, solve 3x = y for x.$h3$

FROM public.topics t
JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Relations and Functions' AND t.name = 'Types of Functions';

-- ──────────────────────────────────────────────────────────────────

-- Q4 · Easy · Types of Functions
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,

  $t4$Find f(f(2)) if f(x) = x² + 1$t4$,

  $b4$Let $f: \mathbb{R} \to \mathbb{R}$ be defined by $f(x) = x^2 + 1$.

Find $f(f(2))$, i.e., find the value of $f$ applied twice starting at $x = 2$.$b4$,

  $a4$## Solution

### Step 1: Find f(2)
$$f(2) = (2)^2 + 1 = 4 + 1 = 5$$

### Step 2: Find f(f(2)) = f(5)
$$f(5) = (5)^2 + 1 = 25 + 1 = 26$$

> **Answer:** $f(f(2)) = \boxed{26}$$a4$,

  'easy', 10,

  $h4$First compute f(2) by substituting x = 2. Then substitute that result back into f.$h4$

FROM public.topics t
JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Relations and Functions' AND t.name = 'Types of Functions';

-- ──────────────────────────────────────────────────────────────────

-- Q5 · Medium · Composition of Functions
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,

  $t5$Find (f∘g)(x) and (g∘f)(x) for f(x) = x² and g(x) = x + 1, and check if they are equal$t5$,

  $b5$Let $f: \mathbb{R} \to \mathbb{R}$ be defined by $f(x) = x^2$ and $g: \mathbb{R} \to \mathbb{R}$ by $g(x) = x + 1$.

1. Find $(f \circ g)(x)$
2. Find $(g \circ f)(x)$
3. Determine whether $f \circ g = g \circ f$.$b5$,

  $a5$## Solution

> **Recall:** $(f \circ g)(x) = f(g(x))$ — apply $g$ first, then $f$.

### 1. Finding (f ∘ g)(x)
$$(f \circ g)(x) = f(g(x)) = f(x + 1) = (x + 1)^2 = x^2 + 2x + 1$$

### 2. Finding (g ∘ f)(x)
$$(g \circ f)(x) = g(f(x)) = g(x^2) = x^2 + 1$$

### 3. Are they equal?
$$(f \circ g)(x) = x^2 + 2x + 1$$
$$(g \circ f)(x) = x^2 + 1$$

Since $x^2 + 2x + 1 \neq x^2 + 1$ in general (they differ by $2x$):
$$(f \circ g)(x) \neq (g \circ f)(x)$$

> **Conclusion:** In general, $f \circ g \neq g \circ f$.
> Composition of functions is **not commutative**.$a5$,

  'medium', 15,

  $h5$Recall: (f∘g)(x) means first apply g, then apply f to the result. The order matters!$h5$

FROM public.topics t
JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Relations and Functions' AND t.name = 'Composition of Functions';

-- ──────────────────────────────────────────────────────────────────

-- Q6 · Hard · Types of Relations
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,

  $t6$Prove that R = {(a, b) : 3 divides (a − b)} is an Equivalence Relation on ℤ$t6$,

  $b6$Let $R$ be a relation on $\mathbb{Z}$ defined by:
$$R = \{(a,\, b) : 3 \mid (a - b)\}$$
where $3 \mid x$ denotes "$3$ divides $x$".

Prove that $R$ is an **equivalence relation** on $\mathbb{Z}$, and describe its **equivalence classes**.$b6$,

  $a6$## Solution

We prove $R$ is **reflexive**, **symmetric**, and **transitive**.

---

### 1. Reflexive
For any $a \in \mathbb{Z}$:
$$a - a = 0 = 3 \times 0$$
Since $3 \mid 0$, we have $(a, a) \in R$ for all $a \in \mathbb{Z}$.
$$\therefore R \text{ is reflexive.} \checkmark$$

---

### 2. Symmetric
Let $(a, b) \in R$, so $3 \mid (a - b)$.
Write $a - b = 3k$ for some $k \in \mathbb{Z}$.
Then:
$$b - a = -(a - b) = -3k = 3(-k)$$
Since $-k \in \mathbb{Z}$, we have $3 \mid (b - a)$, so $(b, a) \in R$.
$$\therefore R \text{ is symmetric.} \checkmark$$

---

### 3. Transitive
Let $(a, b) \in R$ and $(b, c) \in R$.
So $a - b = 3k$ and $b - c = 3m$ for some $k, m \in \mathbb{Z}$.
Adding:
$$a - c = (a - b) + (b - c) = 3k + 3m = 3(k + m)$$
Since $k + m \in \mathbb{Z}$, we have $3 \mid (a - c)$, so $(a, c) \in R$.
$$\therefore R \text{ is transitive.} \checkmark$$

---

> **Conclusion:** $R$ is reflexive, symmetric, and transitive — hence $R$ is an **equivalence relation** on $\mathbb{Z}$.

### Equivalence Classes
$$[0] = \{\ldots,\;{-6},\;{-3},\;0,\;3,\;6,\;\ldots\} \quad \text{(multiples of 3)}$$
$$[1] = \{\ldots,\;{-5},\;{-2},\;1,\;4,\;7,\;\ldots\}$$
$$[2] = \{\ldots,\;{-4},\;{-1},\;2,\;5,\;8,\;\ldots\}$$

These three classes **partition** $\mathbb{Z}$, confirming the equivalence relation.$a6$,

  'hard', 20,

  $h6$Write a - b = 3k. For symmetry, show b - a = 3(-k). For transitivity, add (a - b) + (b - c) to get (a - c).$h6$

FROM public.topics t
JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Relations and Functions' AND t.name = 'Types of Relations';

-- ──────────────────────────────────────────────────────────────────

COMMIT;
