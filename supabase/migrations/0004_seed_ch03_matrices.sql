-- ================================================================
-- MathAI Seed — Chapter 3: Matrices
-- 3 Topics | 6 Questions (4 Easy · 1 Medium · 1 Hard)
-- ================================================================

BEGIN;

-- ─── TOPICS ──────────────────────────────────────────────────────

INSERT INTO public.topics (chapter_id, name, description, order_index)
SELECT id, 'Types and Operations on Matrices',
  'Row, column, square, zero, identity matrices; addition and scalar multiplication', 1
FROM public.chapters WHERE name = 'Matrices';

INSERT INTO public.topics (chapter_id, name, description, order_index)
SELECT id, 'Transpose, Symmetric and Skew-Symmetric Matrices',
  'Properties of transpose; symmetric (A = Aᵀ) and skew-symmetric (A = −Aᵀ) matrices', 2
FROM public.chapters WHERE name = 'Matrices';

INSERT INTO public.topics (chapter_id, name, description, order_index)
SELECT id, 'Matrix Multiplication',
  'Product of matrices, conditions for multiplication, properties (non-commutativity)', 3
FROM public.chapters WHERE name = 'Matrices';

-- ─── QUESTIONS ───────────────────────────────────────────────────

-- Q1 · Easy · Types and Operations
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,
  $t1$Find 2A + B for Given Matrices A and B$t1$,
  $b1$Let:
$$A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}, \quad B = \begin{pmatrix} 5 & 0 \\ -1 & 2 \end{pmatrix}$$

Find $2A + B$.$b1$,
  $a1$## Solution

### Step 1: Compute 2A
$$2A = 2 \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} = \begin{pmatrix} 2 & 4 \\ 6 & 8 \end{pmatrix}$$

### Step 2: Add B to 2A
$$2A + B = \begin{pmatrix} 2 & 4 \\ 6 & 8 \end{pmatrix} + \begin{pmatrix} 5 & 0 \\ -1 & 2 \end{pmatrix} = \begin{pmatrix} 2+5 & 4+0 \\ 6-1 & 8+2 \end{pmatrix}$$

$$\boxed{2A + B = \begin{pmatrix} 7 & 4 \\ 5 & 10 \end{pmatrix}}$$

> **Rule:** Scalar multiplication multiplies every element; matrix addition adds corresponding elements.$a1$,
  'easy', 10,
  $h1$Multiply every element of A by 2, then add corresponding elements of B.$h1$
FROM public.topics t JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Matrices' AND t.name = 'Types and Operations on Matrices';

-- Q2 · Easy · Transpose, Symmetric and Skew-Symmetric
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,
  $t2$Find the Transpose of Matrix A and Verify Aᵀᵀ = A$t2$,
  $b2$Let:
$$A = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix}$$

1. Find $A^T$ (the transpose of $A$).
2. Find $(A^T)^T$ and verify it equals $A$.$b2$,
  $a2$## Solution

### Step 1: Find Aᵀ
The transpose is obtained by swapping rows and columns.
$A$ is $2 \times 3$, so $A^T$ is $3 \times 2$:
$$A^T = \begin{pmatrix} 1 & 4 \\ 2 & 5 \\ 3 & 6 \end{pmatrix}$$

### Step 2: Find (Aᵀ)ᵀ
Transposing $A^T$ (swapping its rows and columns) gives a $2 \times 3$ matrix:
$$(A^T)^T = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix} = A \checkmark$$

> **Property:** $(A^T)^T = A$ for any matrix $A$. The transpose operation applied twice returns the original matrix.$a2$,
  'easy', 10,
  $h2$The transpose of a matrix is formed by writing its rows as columns. The (i,j) entry of Aᵀ is the (j,i) entry of A.$h2$
FROM public.topics t JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Matrices' AND t.name = 'Transpose, Symmetric and Skew-Symmetric Matrices';

-- Q3 · Easy · Transpose, Symmetric and Skew-Symmetric
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,
  $t3$Show that A + Aᵀ is Always a Symmetric Matrix$t3$,
  $b3$Let $A$ be any square matrix. Prove that $A + A^T$ is always a **symmetric matrix**.$b3$,
  $a3$## Solution

### Definition
A matrix $S$ is **symmetric** if $S^T = S$.

### Proof
Let $S = A + A^T$. We need to show $S^T = S$.

$$S^T = (A + A^T)^T$$

Using the property $(P + Q)^T = P^T + Q^T$:
$$S^T = A^T + (A^T)^T = A^T + A = A + A^T = S$$

$$\therefore S^T = S$$

> **Conclusion:** $A + A^T$ is symmetric for any square matrix $A$. ✓

### Example
$$A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}, \quad A^T = \begin{pmatrix} 1 & 3 \\ 2 & 4 \end{pmatrix}$$
$$A + A^T = \begin{pmatrix} 2 & 5 \\ 5 & 8 \end{pmatrix} \quad \leftarrow \text{symmetric (equal to its own transpose)}$$$a3$,
  'easy', 10,
  $h3$A matrix is symmetric if S = Sᵀ. Take the transpose of (A + Aᵀ) and show it equals itself.$h3$
FROM public.topics t JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Matrices' AND t.name = 'Transpose, Symmetric and Skew-Symmetric Matrices';

-- Q4 · Easy · Matrix Multiplication
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,
  $t4$Find the Product AB for Given Matrices A and B$t4$,
  $b4$Let:
$$A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}, \quad B = \begin{pmatrix} 2 & 0 \\ 1 & 3 \end{pmatrix}$$

Compute the product $AB$.$b4$,
  $a4$## Solution

Both $A$ and $B$ are $2 \times 2$ matrices, so $AB$ is also $2 \times 2$.

The $(i, j)$ entry of $AB$ is the **dot product of row $i$ of $A$** with **column $j$ of $B$**.

$$AB = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} \begin{pmatrix} 2 & 0 \\ 1 & 3 \end{pmatrix}$$

**Entry (1,1):** $1 \cdot 2 + 2 \cdot 1 = 2 + 2 = 4$
**Entry (1,2):** $1 \cdot 0 + 2 \cdot 3 = 0 + 6 = 6$
**Entry (2,1):** $3 \cdot 2 + 4 \cdot 1 = 6 + 4 = 10$
**Entry (2,2):** $3 \cdot 0 + 4 \cdot 3 = 0 + 12 = 12$

$$\boxed{AB = \begin{pmatrix} 4 & 6 \\ 10 & 12 \end{pmatrix}}$$

> **Note:** Matrix multiplication is generally **not commutative**: $AB \neq BA$ in general.$a4$,
  'easy', 10,
  $h4$The (i, j) entry of AB = (row i of A) · (column j of B). Each entry is a sum of products.$h4$
FROM public.topics t JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Matrices' AND t.name = 'Matrix Multiplication';

-- Q5 · Medium · Matrix Multiplication
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,
  $t5$Find A², A³ and A¹⁰⁰ for A = [[0,1],[−1,0]]$t5$,
  $b5$Let $A = \begin{pmatrix} 0 & 1 \\ -1 & 0 \end{pmatrix}$.

1. Find $A^2$
2. Find $A^3$ and $A^4$
3. Hence find $A^{100}$.$b5$,
  $a5$## Solution

### Step 1: Compute A²
$$A^2 = A \cdot A = \begin{pmatrix} 0 & 1 \\ -1 & 0 \end{pmatrix}\begin{pmatrix} 0 & 1 \\ -1 & 0 \end{pmatrix}$$

Entries:
- $(1,1)$: $0 \cdot 0 + 1 \cdot (-1) = -1$
- $(1,2)$: $0 \cdot 1 + 1 \cdot 0 = 0$
- $(2,1)$: $(-1)(0) + 0(-1) = 0$
- $(2,2)$: $(-1)(1) + 0 \cdot 0 = -1$

$$A^2 = \begin{pmatrix} -1 & 0 \\ 0 & -1 \end{pmatrix} = -I$$

### Step 2: Compute A³ and A⁴
$$A^3 = A^2 \cdot A = (-I) \cdot A = -A = \begin{pmatrix} 0 & -1 \\ 1 & 0 \end{pmatrix}$$
$$A^4 = A^2 \cdot A^2 = (-I)(-I) = I$$

### Step 3: Find the Pattern
| Power | Matrix |
|---|---|
| $A^1$ | $A$ |
| $A^2$ | $-I$ |
| $A^3$ | $-A$ |
| $A^4$ | $I$ |
| $A^5$ | $A$ (repeats) |

**Period = 4.** Since $100 = 4 \times 25$:
$$A^{100} = (A^4)^{25} = I^{25} = I$$

$$\boxed{A^{100} = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}}$$

> This matrix $A$ represents a rotation by $90°$. Four rotations of $90°$ return to identity.$a5$,
  'medium', 15,
  $h5$Compute A², then look for a pattern. If A⁴ = I, then A^(4k) = I for any integer k.$h5$
FROM public.topics t JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Matrices' AND t.name = 'Matrix Multiplication';

-- Q6 · Hard · Types and Operations on Matrices
INSERT INTO public.questions (topic_id, title, body, correct_answer, difficulty, marks, hint)
SELECT t.id,
  $t6$Express Any Square Matrix as Sum of a Symmetric and a Skew-Symmetric Matrix$t6$,
  $b6$Prove that every square matrix $A$ can be expressed as the sum of a **symmetric** matrix and a **skew-symmetric** matrix.

Also express $A = \begin{pmatrix} 3 & 5 \\ 1 & -1 \end{pmatrix}$ in this form.$b6$,
  $a6$## Solution

### Theorem
For any square matrix $A$:
$$A = \underbrace{\frac{A + A^T}{2}}_{P \,=\, \text{symmetric}} + \underbrace{\frac{A - A^T}{2}}_{Q \,=\, \text{skew-symmetric}}$$

### Proof

**$P$ is symmetric:**
$$P^T = \left(\frac{A + A^T}{2}\right)^T = \frac{A^T + A}{2} = P \checkmark$$

**$Q$ is skew-symmetric:**
$$Q^T = \left(\frac{A - A^T}{2}\right)^T = \frac{A^T - A}{2} = -Q \checkmark$$

**Sum = A:**
$$P + Q = \frac{A + A^T}{2} + \frac{A - A^T}{2} = \frac{2A}{2} = A \checkmark$$

---

### Example: A = [[3,5],[1,−1]]
$$A^T = \begin{pmatrix} 3 & 1 \\ 5 & -1 \end{pmatrix}$$

$$P = \frac{A + A^T}{2} = \frac{1}{2}\begin{pmatrix} 6 & 6 \\ 6 & -2 \end{pmatrix} = \begin{pmatrix} 3 & 3 \\ 3 & -1 \end{pmatrix} \quad \leftarrow \text{symmetric}$$

$$Q = \frac{A - A^T}{2} = \frac{1}{2}\begin{pmatrix} 0 & 4 \\ -4 & 0 \end{pmatrix} = \begin{pmatrix} 0 & 2 \\ -2 & 0 \end{pmatrix} \quad \leftarrow \text{skew-symmetric}$$

$$\boxed{A = \begin{pmatrix} 3 & 3 \\ 3 & -1 \end{pmatrix} + \begin{pmatrix} 0 & 2 \\ -2 & 0 \end{pmatrix}}$$$a6$,
  'hard', 20,
  $h6$Use the decomposition: P = (A + Aᵀ)/2 and Q = (A − Aᵀ)/2. Show P is symmetric and Q is skew-symmetric.$h6$
FROM public.topics t JOIN public.chapters c ON t.chapter_id = c.id
WHERE c.name = 'Matrices' AND t.name = 'Types and Operations on Matrices';

COMMIT;
