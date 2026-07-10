# Neocalculus Authoring Constitution

Status: Working contract for the full rewrite
First pilot: Chapter 1

## 1. The Reader

Neocalculus is written for an advanced high-school student or an independent first-time
calculus learner.

The mainline may assume:

1. algebraic manipulation;
2. the idea of a function and its graph;
3. basic coordinate geometry;
4. introductory trigonometry when the text reaches trigonometric functions.

It may not assume prior calculus, real analysis, formal logic, category theory, topology,
or differential geometry.

## 2. The Promise

The book teaches calculus through a first-order infinitesimal lens. Its central computational
move is coefficient extraction:

\[
f(x+d)=f(x)+f'(x)d.
\]

The learner should leave able to compute and apply mainstream calculus while understanding
why local linearity is the organizing idea.

The book is not a polemic against limit-based calculus. Classical methods appear when they
clarify finite approximation, convergence, infinite domains, or compatibility with later
courses.

## 3. Mathematical Contract

### 3.1 The smooth line and first-order displacements

The SDG setting contains a smooth line object \(\mathcal R\) and the infinitesimal
neighborhood

\[
D=\{d\in\mathcal R:d^2=0\}.
\]

In learner-facing prose, \(d\) is called a **first-order displacement** or **first-order
probe**. It is not described as an ordinary real number that is merely very small.

The text must not:

1. single out a chosen \(d\) and assert that \(d\ne0\);
2. assign an ordinary positive or negative sign to a nilpotent displacement;
3. describe \(d\) as measurable physical dust, an atom of length, or the final result of
   repeated numerical zooming;
4. divide by \(d\), \(dx\), \(dt\), or a product of nilpotent displacements.

It is safe to say that the infinitesimal neighborhood is nontrivial in the SDG model, while
the constructive logic does not let us isolate a particular infinitesimal as distinguishably
nonzero.

### 3.2 Local linearity

The operative principle is the Kock-Lawvere axiom: a map \(D\to\mathcal R\) has a unique
affine form \(a+bd\). For a smooth function near \(x\), this becomes

\[
f(x+d)=f(x)+f'(x)d.
\]

The uniqueness of the coefficient, not division by \(d\), licenses coefficient extraction.
If \(ad=bd\) for every \(d\in D\), uniqueness gives \(a=b\). When this fact is named,
the text may call it microcancellation.

### 3.3 Infinitesimal equality and finite approximation

The book must distinguish:

1. exact first-order equality on \(D\); and
2. approximation for an ordinary finite increment \(\Delta x\).

Thus

\[
f(x+d)=f(x)+f'(x)d
\]

is exact in the stated infinitesimal setting, while

\[
f(x+\Delta x)\approx f(x)+f'(x)\Delta x
\]

is a finite approximation whose error requires separate analysis.

### 3.4 Global conclusions

Local first-order behavior does not by itself establish every global result. Claims about
monotonicity, extrema, constancy, existence, uniqueness, or convergence must state the
additional hypotheses or principles they use.

Nilpotent displacements are not used as ordinary positive and negative test steps in sign
arguments.

### 3.5 Integration

Integration is not presented as a literal finite interval made by adding \(1/d\) nilpotent
pieces. The formal development assumes an integration/antiderivative principle in addition
to first-order differentiation.

Infinitesimal strips remain valuable geometry: they explain the first-order change of an
already defined area or accumulation function. They do not, by themselves, construct a
finite integral.

### 3.6 Higher-order infinitesimals and Taylor theory

Exact polynomial expansion on \(D_n\) and convergence of a classical Taylor series on
ordinary real inputs are separate statements.

The rewrite must not suggest that \(D_n\to\mathbb R\) as \(n\to\infty\), or that smoothness
alone implies analyticity. Classical convergence and remainder estimates receive their own
arguments.

### 3.7 Differential notation

Equations such as \(dy=f'(x)dx\) express the action of the derivative on a first-order
displacement. They are not justified by treating \(dy/dx\) as division by a nilpotent.

Separation of variables must be explained through pullback, substitution, or verified
differential identities—not through division by \(dx\) or \(dt\).

### 3.8 The two meanings of d-squared

Scalar nilpotence \(d^2=0\) and the exterior-calculus identity \(d\circ d=0\) are distinct
mathematical statements that share notation. The final chapter may explore their thematic
relationship but must not call them the same axiom.

## 4. Teaching Rhythm

Every mainline section follows this order:

1. **Question** — one concrete puzzle or observable phenomenon.
2. **Experience** — a figure, demo, numerical example, or physical situation.
3. **Idea** — the smallest new conceptual move needed to explain it.
4. **Notation** — introduced only after the idea has a job.
5. **Derivation** — one uninterrupted calculation with every transition motivated.
6. **Meaning** — a sentence interpreting the result geometrically, physically, or in units.
7. **Practice** — one short transfer question before the next idea.

A section may omit an item when it is genuinely unnecessary, but it may not reverse the
sequence merely to sound formal.

## 5. Mainline and Depth

Each chapter has:

1. one opening question;
2. three to five core sections;
3. one anchor interactive;
4. no more than three canonical worked examples;
5. six core exercises and at most three optional explorations;
6. one brief summary that answers the opening question;
7. at most one optional foundation window.

Mainline target: roughly 1,800-2,600 prose words per chapter, excluding exercises and
optional depth.

Optional material may deepen an idea already understood. It may not contain prerequisites
needed later in the mainline.

## 6. Voice

The narrator is calm, curious, direct, and honest.

Prefer:

1. concrete verbs;
2. short transitions that explain why the next step is needed;
3. examples before taxonomies;
4. “first-order” over vague claims about being “infinitely small”;
5. explicit limits of a claim over promotional certainty.

Avoid:

1. repeated claims that an idea is beautiful, stunning, revolutionary, or profound;
2. portraying standard calculus as confused, hand-waving, or needlessly difficult;
3. “exact” without naming the domain in which equality is exact;
4. historical claims that assign modern SDG concepts to earlier mathematicians;
5. naming advanced machinery before the learner has experienced its payoff.

One neutral comparison with a standard-calculus formulation is allowed per chapter when it
helps the learner transfer to other courses.

## 7. Interactives and Figures

Every visual answers one written question. The text immediately before it tells the learner
what to vary or notice. The text immediately after it states what the experiment showed.

Controls not needed for the current question should be hidden behind an advanced choice or
removed from that placement.

A demo may motivate, reveal, or test an idea. It should not silently introduce several new
concepts at once.

## 8. Claim Register

Every major theorem or framework-sensitive statement is reviewed with four fields:

1. learner-facing claim;
2. assumptions used;
3. classical compatibility or boundary;
4. primary mathematical source.

Mandatory review gates occur after Chapters 1, 5, 8, and 10.

Primary starting references:

1. Anders Kock, _Synthetic Differential Geometry_, 2nd ed.
2. John L. Bell, _A Primer of Infinitesimal Analysis_, 2nd ed.

## 9. Definition of Done

A chapter is complete only when:

1. a calculus-new learner can state its opening question and final answer;
2. every symbol is introduced before use;
3. no required prerequisite lives in an optional drawer or later chapter;
4. no proof or comparison is repeated;
5. all demos have a single learning objective and a written takeaway;
6. framework-sensitive claims pass the mathematical contract;
7. exercises test material already taught rather than introduce new theory;
8. the rendered chapter remains coherent when read without opening optional material.
