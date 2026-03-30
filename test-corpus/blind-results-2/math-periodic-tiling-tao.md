---
title: "A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE"
---

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

Abstract. The periodic tiling conjecture asserts that any finite subset of a

d

lattice Z that tiles that lattice by translations, in fact tiles periodically. In this work we disprove this conjecture for sufficiently large d , which also implies a

d

disproof of the corresponding conjecture for Euclidean spaces R . In fact, we also obtain a counterexample in a group of the form Z × G for some finite abelian 2-group G . Our methods rely on encoding a “Sudoku puzzle” whose rows and other non-horizontal lines are constrained to lie in a certain class of “2-adically structured functions”, in terms of certain functional equations that can be encoded in turn as a single tiling equation, and then demonstrating that solutions to this Sudoku puzzle exist, but are all non-periodic.

[1.](https://arxiv.org/abs/2305.14028) [introduction](https://arxiv.org/abs/2305.14028)

In 1960, Hao Wang [W60, W75] studied the problem of tiling the plane by translated copies of finitely many squares a color attached to each side of each of [them, also known as](https://doi.org/10.1007/s00454-022-00426-4) [Wang squares](https://doi.org/10.1007/s00454-022-00426-4) , where one square lies next to another only if [the colors of common edges match. This is a variant of Hilbert’s famous](https://arxiv.org/abs/2305.17743) Entscheidungsproblem . Wang conjectured that if a set of such squares admits a tiling of the plane, then it also admits a periodic tiling. Wang’s conjecture was disproved [by Berger [B66, B64], who constructed an](https://arxiv.org/abs/2309.09504) aperiodic set of 20 , 426 Wang squares, i.e., the set of squares admits tilings but none of these tilings is periodic. Over the years, many more constructions of aperiodic translational tilings (including several not based on Wang squares) were established, with smaller tile-sets (see, e.g., [GT21, Table 1]). In this paper we construct an aperiodic translational tiling with a single tile in Z × G , for a certain finite abelian group G . As a consequence, we disprove the celebrated “periodic tiling conjecture”. Our methods are based on encoding a “Sudoku puzzle” rather than a Wang tiling problem.

1.1. The periodic tiling conjecture. Let G = ( G, +) be a discrete abelian group. If A, F are subsets of G , we write A ⊕ F [=](https://doi.org/10.1007/s10801-023-01233-7) [G](https://doi.org/10.1007/s10801-023-01233-7) [if the translates](https://doi.org/10.1007/s10801-023-01233-7) [a](https://doi.org/10.1007/s10801-023-01233-7) [+](https://doi.org/10.1007/s10801-023-01233-7) [F](https://doi.org/10.1007/s10801-023-01233-7) [:=](https://doi.org/10.1007/s10801-023-01233-7)

arXiv:2211.15847v3 [math.CO] 8 Sep 2024 { a + f : f ∈ F } of F by elements a of A form a partition of G . If this occurs, we say that F tiles G (by translations) , and that A is a tiling set of G by F . The tiling set A is said to be periodic if it is the finite union of cosets of a finite index subgroup of G . We will refer to A ⊕ F = G as a tiling equation , and think of F, G as being given and A ⊂ G as being an unknown. We say that the tiling equation A ⊕ F = G is aperiodic if there exist solutions A ⊂ G to the tiling equation A ⊕ F = G , but none of these solutions are periodic.

Remark 1.1. We caution that in the aperiodic order literature the term “periodic” instead refers to sets that are unions of cosets of some non-trivial cyclic subgroup of G ; in our notation, we would refer to such sets as being one-periodic .

Mathematics Subject Classification. 05B45, 52C22, 52C23, 52C25. Key words and phrases. tiling, periodicity.

For instance, if G = Z and A was an arbitrary subset of Z , then A × Z would be one-periodic, but not necessarily periodic in the sense adopted in this paper. The notion of an aperiodic tiling is similarly modified in the aperiodic order literature, and the notion of aperiodicity used here is sometimes referred to as “weak aperiodicity”. For tilings in dimensions d ⩽ 2 the two notions of aperiodicity coincide [GS87, Theorem 3.7.1].

A well-known conjecture in the area is the periodic tiling conjecture:

Conjecture 1.2 (Discrete periodic tiling conjecture) . [S74, GS87, LW96] Let F be a finite non-empty subset of a finitely generated discrete abelian group G . Then the tiling equation A ⊕ F = G is not aperiodic.

In other words, the conjecture asserts that if F tiles G by translations, then F periodically tiles G by translations. We also consider the following continuous analogue of this conjecture. If Σ is

d

[a bounded measurable subset of a Euclidean space](https://arxiv.org/abs/1608.07167) R of positive measure, and

d d d

Λ is a subset of R , we write Λ ⊕ Σ = a . e . R if the translates λ + Σ, λ ∈ R ,

d

partition R [up to null sets; note from the Steinhaus lemma that this forces Λ to](https://doi.org/10.1093/imrn/rnad048)

d

be discrete. If this occurs, we say that Σ (measurably) tiles R by translations ,

[d](https://arxiv.org/abs/2305.14028)

and that Λ is a [tiling set of](https://arxiv.org/abs/2305.14028) [R](https://arxiv.org/abs/2305.14028) [by](https://arxiv.org/abs/2305.14028) Λ. The tiling set Λ is said to be periodic if it is

d

the finite union of cosets of a lattice (a discrete cocompact subgroup) of R . As

d

before, we view Λ ⊕ Σ = a . e . R as a tiling equation with d and Σ given, and Λ as

d

[the unknown. We say that this tiling equation Λ](https://arxiv.org/abs/2303.10798) ⊕ Σ = a . e . R is aperiodic if there

[d](https://arxiv.org/abs/2303.10798) d

[exist solutions Λ](https://doi.org/10.1007/s00454-022-00426-4) [⊂](https://doi.org/10.1007/s00454-022-00426-4) [R](https://doi.org/10.1007/s00454-022-00426-4) [to the tiling equation Λ](https://doi.org/10.1007/s00454-022-00426-4) ⊕ Σ = a . e . R , but none of these solutions are periodic.

Conjecture 1.3 (Continuous periodic tiling conjecture) . [GS87, LW96] Let Σ be

d

### [a bounded measurable subset of](https://arxiv.org/abs/2309.09504) [R](https://arxiv.org/abs/2309.09504) of positive measure. Then the tiling equation

d

Λ ⊕ Σ = a . e . R is not aperiodic.

A standard argument shows that Conjecture 1.3 implies Conjecture 1.2. This

d

implication arises from “encoding” a discrete subset F of Z as a bounded measur-

d d d

able subset F ⊕ R d in R , where R d is a “generic” fundamental domain of R / Z ; we provide the details in Section 2. Conjectures 1.2 and 1.3 have been extensively studied over the years. The following partial results towards these conjectures are known:

- Conjecture 1.2 is trivial when G is a finite abelian group, since in this case all subsets of G are periodic.
- Conjectures 1.2 and 1.3 were established for G = Z and G = R respectively [N77, LM91, LW96]. The argument in [N77] also extends to the case G = Z × G for any finite abelian group G [GT21, Section 2].
- When G = Z , Conjecture 1.2 was established by Bhattacharya [B20] using ergodic theory methods. In [GT20] we gave an alternative proof of this result, and furthermore showed that every tiling in Z by a single tile is weakly periodic (a disjoint union of finitely many one-periodic sets).
- When G = R , Conjecture 1.3 is known to hold for any tile that is a topological disk [BN91, G-BN91, Ken92, Ken93].
- Conjecture 1.3 is known to be true for convex tiles in all dimensions [V54, M80].
- For d > 2, Conjecture 1.2 is known to hold when the cardinality | F | of F is prime or equal to 4 [S98], but remained open in general.

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

- In [MSS22], it was recently shown that the discrete periodic tiling conjecture

d

in Z also implies the discrete periodic tiling conjecture in every quotient

d

group Z / Λ. • The analogues of the above conjectures are known to fail when one has two or more translational tiles instead of just one; see [GT21] (particularly Table 1) for a summary of results in this direction. In particular, in [GT21, Theorems 1.8, 1.9] it was shown that the analogue of Conjecture 1.2 for two

d

tiles fails for Z × G for some finite group G , and also for Z for some d .

### 1.2. Results. In this work we construct counterexamples to Conjectures 1.2 and 1.3. Our first main result is

Theorem 1.4 (Counterexample to Conjecture 1.2, I) . There exist a finite abelian group G and a finite non-empty subset F of Z × G such that the tiling equation A ⊕ F = Z × G is aperiodic. In other words, the discrete periodic tiling conjecture fails for [Z](https://arxiv.org/abs/1608.07167) [×](https://arxiv.org/abs/1608.07167) [G](https://arxiv.org/abs/1608.07167) [.](https://arxiv.org/abs/1608.07167)

Remark 1.5. Our construction will in fact make G a (non-elementary) 2-group, [that is to say a finite group whose order is a power of two.](https://doi.org/10.1093/imrn/rnad048)

d

[The abelian finitely generated group](https://arxiv.org/abs/2305.14028) [Z](https://arxiv.org/abs/2305.14028) [×](https://arxiv.org/abs/2305.14028) G can be viewed as a quotient Z / Λ

d

of a lattice Z for sufficiently large d , so by Theorem 1.4 and the recent implication in [MSS22, Corollary 1.2] we derive

Corollary 1.6 [(Counterexample to Conjecture 1.2, II)](https://arxiv.org/abs/2303.10798) . For sufficiently large d ,

[d](https://doi.org/10.1007/s00454-022-00426-4)

[there exists a finite non-empty subset](https://doi.org/10.1007/s00454-022-00426-4) [F](https://doi.org/10.1007/s00454-022-00426-4) [of](https://doi.org/10.1007/s00454-022-00426-4) [Z](https://doi.org/10.1007/s00454-022-00426-4) such that the tiling equation A ⊕ F =

d d

Z [is aperiodic. In other words, the discrete periodic tiling conjecture fails for](https://arxiv.org/abs/2305.17743) Z .

By a standard construction (going back to Golomb [G70]) relating discrete and continuous tiling problems, we then have a corresponding counterexample to the continuous periodic tiling conjecture:

Corollary 1.7 (Counterexample to Conjecture 1.3) . For sufficiently large d , there

d

exists a bounded measurable subset Σ of R of positive measure such that the tiling

d

equation Λ ⊕ Σ = a . e . R is aperiodic. In other words, the continuous periodic tiling

d

conjecture fails for R .

We give the (straightforward) derivation of Corollary 1.7 from Corollary 1.6 in Section 2. Our methods produce a finite group G [, and hence a dimension](https://doi.org/10.1007/s10801-023-01233-7) [d](https://doi.org/10.1007/s10801-023-01233-7) [, that is in](https://doi.org/10.1007/s10801-023-01233-7) principle explicitly computable, but we have not attempted to optimize the size of these objects. In particular the dimension d produced by our construction will be extremely large.

1.3. Previous works and constructions. Aperiodic tilings have been extensively studied and have found famous applications to many areas of mathematics and physics [AG94]. The study of the periodicity of tilings has attracted many researchers, who have introduced methods from various fields, such as geometry and topology [G-BN91, Ken92, Ken93], Fourier analysis [LW96, KL96, K04], combinatorics [GT20, GT21], ergodic theory and probability [M89, L13, B20], commutative

Strictly speaking, the counterexample in that paper involved tiling a periodic subset E of the group G , rather than the full group G . See however Remark 1.8 below. This is a generalization of the argument in [GT21, Section 9].

algebra [S98, B20, GT20], model theory [BJ08, GT21], and computability theory [B66, K96, L13, JR21, GT21]. We do not attempt a comprehensive survey of aperiodic constructions here, but briefly summarize the current state of knowledge as follows.

- Aperiodic tiling by multiple tiles have been long known to exist. The online encyclopedia of tilings [FGH] contains many explicit examples of such tilings. In the plane, there are the famous substitution tilings constructions of Penrose and Ammann [P74, P79, DB81, G77, AGS92]. (See also [GS98] and the references therein for the study of substitution tilings.) Other aperiodic tiling construction methods include the finite state machine approaches of Kari and Culik [K96, C96], and the approach of encoding arbitrary Turing machines into a tiling problem [B66, B64, R71, O09, GT21]. • In addition, if one allows for the tile to be rotated (and/or reflected) in addition to being translated, aperiodic non-translational tilings by a single tile (or “monotile”) are known to exist; see, e.g., [ST12, WW23]. The question whether there are planar aperiodic connected tiles by translations, rotations [and reflections remained open until very recently, when the “hat” monotile](https://doi.org/10.1093/imrn/rnad048) was discovered by Smith–Myers–Kaplan–Godman-Strauss [SMKGS23a]. More- [over, in a subsequent paper, the same authors constructed a connected](https://arxiv.org/abs/2305.14028) planar domain which tiles the plane aperiodically by translations and rotations only (no reflections) [SMKGS23b]. These results solve the celebrated [“einstein problem” which is an extension of the second part of Hilbert’s](https://arxiv.org/abs/2303.10798) [eighteenth problem.](https://doi.org/10.1007/s00454-022-00426-4) • [Moreover, when one allows for the group to be](https://arxiv.org/abs/2305.17743) non-abelian , aperiodic (and [undecidable) tilings by a single tile are known to exist.](https://arxiv.org/abs/2209.08451) For instance, in [GT21, Theorem 11.2] we give a construction in Z × H for a certain finite [non-abelian group](https://arxiv.org/abs/2309.09504) [H](https://arxiv.org/abs/2309.09504) [.](https://arxiv.org/abs/2309.09504) See also [Th90, M97, GS05, SSU21, ABJ18, C17] for further references to of aperiodic tilings (or subshifts of finite type) in various groups.

We were not able to adapt the previous aperiodic constructions to the setting of a single translational tile. Instead, our source of aperiodicity is more novel, in that our tiling of Z × G is forced to exhibit a “ q -adic” (or “2-adic”) structure

s

for some large enough but fixed power of two q = 2 (say s = 10) in the sense that

j j

for each power q of q , the tiling is periodic with period q Z × { } outside of a

j

small number of cosets of that subgroup q Z × { } , but is unable to be genuinely periodic with respect to any of these periods. [To achieve this we will set up a](https://doi.org/10.1007/s10801-023-01233-7) certain “Sudoku puzzle”, which will be rigid enough to force all solutions of this problem to exhibit a certain “self-similar” (and therefore non-periodic) behavior, yet is not so rigid that there are no solutions whatsoever. By modifying arguments

This method in fact allows one to construct tiling problems which are not only aperiodic, but in fact logically undecidable ; see e.g., [GT21] for further discussion. Since the initial release of this preprint, we have learned (Emmanuel Jeandel, private communication) that a similar use of p -adic functions (with p sufficiently large, but not necessarily a power of 2) was employed by Aanderaa and Lewis [AL74], [L79] to establish the undecidability of an empty distance subshift problem, which in turn implied the undecidability of the domino problem; see [JV20, § 4] for further discussion. Intriguingly, similar “inverse limits of coset structure” appears in other aperiodic tiling constructions, such as the dragon tiling [BKS02], the Robinson tiling [R71], or the trilobite and crab tilings [GS06], as well as some square-triangle tilings.

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

Figure 1.1. A high-level overview of the logical implications used in our proof. We introduce an aperiodic Sudoku puzzle (blue) and [develop a tiling library to express this puzzle inside a tiling by a](https://doi.org/10.1007/s00454-022-00426-4) [single tile (yellow). This, in turn, eventually leads to constructions](https://arxiv.org/abs/2305.17743)

d

[of aperiodic translational tilings by a single tile in](https://arxiv.org/abs/2209.08451) Z × G , Z and

d

R (green). This diagram has been “curled up” into a compact bounding rectangle purely to save space, and the reader is welcome to mentally “straighten” it if desired.

from our previous paper [GT21], we are then able to encode this Sudoku-type puzzle as an instance of the original tiling problem A ⊕ F = Z × G . Our encoding approach is similar in nature to previous “encoding” arguments in the tiling literature. Berger [B66, B64] encoded any Turing machine as a Wang tiling problem. Since the halting problem is known to be undecidable, Berger’s encoding implies the undecidability of the Wang domino problem. Subsequently, Wang tilings were encoded to obtain aperiodicity, strong aperiodicity, or even undecidability of various other problems; see, e.g., [ST12, G70, SSU21, M89, R71, GS98, GS05]. In particular, in [GT21] we used our tiling language approach to encode any Wang tiling problem as a tiling of Z × G by two tiles, for a suitable finite abelian group G (depending on the given problem). This implies the existence of an undecidable tiling problem with only two tiles. Unfortunately, in our encoding of the Wang domino puzzle, we were not able to reduce the number of the tiles from two to one. Thus, the main difficulty we address in our current work is finding another aperiodic puzzle (replacing the Wang domino puzzle) which is also expressible in our tiling language of a tiling by a single tile.

1.4. Our argument and the organization of the paper. Our argument is a variant of the construction used in our previous paper [GT21] to produce aperiodic (and even undecidable) translational tilings with two tiles, and is summarized by

the diagram in Figure 1.1. However, the fact that we are now tiling the whole group G instead of a periodic subset of G , and that we are only allowed to use one tile instead of two, creates additional technical challenges. As in [GT21], in Section 3 we begin by replacing the single tiling equation

( m )

A ⊕ F = G with a system A ⊕ F = G , m = 1 , . . . , M of tiling equations for an arbitrary M , by an elementary “stacking” procedure that takes advantage of our freedom to enlarge the group G . This creates a flexible “tiling language” of constraints on the tiling set A ; the challenge is to use this language to obtain a system of constraints that is strict enough to force aperiodic behavior on this set A , while simultaneously being relaxed enough to admit at least one solution. Next, in Section 4, we again follow [GT21] and pass from this tiling language to a language of functional equations, basically by spending one of the equations

( m )

A ⊕ F = G in the system to force the tiling set A to be a graph of a function f = ( f , . . . , f K ), where f i : Z × G → Z /q Z , 1 ⩽ i ⩽ K , and G is an additional [small finite abelian group, which we retain for technical reasons.](https://arxiv.org/abs/1608.07167)

( m )

One can then use one or more tiling equations A ⊕ F = G in the tiling language to create a “library” of useful functional constraints on these functions f i , this is done in Section 5. For instance, one can ensure that a given function f i [exhibits periodicity in some direction](https://arxiv.org/abs/2305.14028) [v](https://arxiv.org/abs/2305.14028) [i](https://arxiv.org/abs/2305.14028) ∈ Z , or that it encodes (the periodic extension of) a permutation of a cyclic group Z /q Z . In Section 6 we express via functional equations the assertion that a certain subcollection of the f i (after a routine normalization) take values in a two-element set { a, b } (mod [q](https://arxiv.org/abs/2303.10798) [), where](https://arxiv.org/abs/2303.10798) [a, b](https://arxiv.org/abs/2303.10798) have different parity, and can thus be viewed as [boolean functions. By modifying our construction from [GT21, Section 7], we can](https://arxiv.org/abs/2305.17743) [then use tiling equations to encode arbitrary pointwise constraints](https://arxiv.org/abs/2209.08451)

( f ( x ) , . . . , f K ( x )) ∈ Ω (1.1)

K

for all x ∈ Z × G and arbitrary subsets Ω of { a, b } . This turns out to be a particularly powerful addition to our library of expressible properties. In Section 7, by some further elementary transformations (including a change of variables that resembles the classical projective duality between lines and points), we are then able to reduce matters to demonstrating aperiodicity of a certain “Sudoku puzzle”. In this puzzle, we have an unknown function F : { , . . . , N } × Z → Z /q Z \ { } on a vertically infinite “Sudoku board” { , . . . , N } × Z which fills each cell ( n, m ) of this board with an element F ( n, m ) of Z /q Z \ { } for some

s

fixed but large q = 2 . Along every row or diagonal (and more generally along any non-vertical line) of this board, the function F is required to exhibit “2-adic behavior”; the precise description of this behavior will be given in Section 7, but roughly speaking we will require that on each such non-vertical line, F behaves like a rescaled version of the function n f q ( n ) := (mod q ) q ν q ( n )

(1.2)

(where ν q ( n ) is the number of times q divides n ), that assigns to each integer n the final non-zero digit in its base q expansion (with the convention f q (0) := 1). We also impose a non-degeneracy condition that the Sudoku solution function F is a periodized permutation along any of its columns.

This is analogous to how, in the most popular form of a Sudoku puzzle, the rows, columns, and 3 × 3 blocks of cells on a board { , . . . , } × { , . . . , } are required to be permutations of the digit set { , . . . , } .

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

In Section 9, for suitable choices of parameters q, N , we “solve” this Sudoku problem and show that solutions to this problem exist, but necessarily exhibit selfsimilar behavior (in that certain rescalings of the solution obey similar properties to the original solution), and in particular are non-periodic. By combining this aperiodicity result with the previous encodings and reductions, we are able to establish Theorem 1.4 and hence Corollary 1.7.

Remark 1.8. Our current argument also provides a solution to [GT21, Problem 12.3]. Namely, using the more advanced library we develop here (Sections 2–5), we can strengthen our previous undecidability result with two tiles by now tiling all of the group rather than just a periodic subset. We leave the details of this modification of the construction to the interested reader. U 1.5. Notation. We define the disjoint union S w ∈W

E w of sets E w indexed by U some set W to be the union w ∈W

E w if the E w are disjoint, and leave w ∈W

E w

[undefined otherwise.](https://arxiv.org/abs/1608.07167) All groups in this paper will be written additively and be assumed to be abelian unless otherwise specified. If A, B, C are subsets of G , we use A ⊕ B = C to denote the assertion that the translates a + B , a ∈ A partition C ; if the translates a U + B [are not disjoint, we leave](https://arxiv.org/abs/2305.14028) [A](https://arxiv.org/abs/2305.14028) [⊕](https://arxiv.org/abs/2305.14028) [B](https://arxiv.org/abs/2305.14028) undefined. Thus A ⊕ B = C is equivalent to

[d](https://arxiv.org/abs/2305.14028) d a ∈ A

( a + B ) = C . Similarly, if Λ ⊂ R and Σ ⊂ R are discrete and measurable

d

respectively, and E ⊂ R is another measurable set, we write Λ ⊕ Σ = a . e . E if the translates λ + Σ, λ ∈ Λ partition E up to null sets; if the λ + Σ are not disjoint up to null sets, we leave Λ [⊕](https://arxiv.org/abs/2303.10798) [Σ undefined.](https://arxiv.org/abs/2303.10798) We use 1 E [to denote the indicator of an event](https://arxiv.org/abs/2305.17743) [E](https://arxiv.org/abs/2305.17743) , thus 1 E is 1 when E is true [and 0 otherwise.](https://arxiv.org/abs/2209.08451) By abuse of notation, we will sometimes identify an integer a ∈ Z with its [representative](https://arxiv.org/abs/2309.09504) [a](https://arxiv.org/abs/2309.09504) [(mod](https://arxiv.org/abs/2309.09504) [N](https://arxiv.org/abs/2309.09504) [)](https://arxiv.org/abs/2309.09504) [∈](https://arxiv.org/abs/2309.09504) [Z](https://arxiv.org/abs/2309.09504) [/N](https://arxiv.org/abs/2309.09504) Z in a cyclic group Z /N Z when there is no chance of confusion. For instance, we may refer to the multiplicative identity of Z /N Z (viewed as a ring) as 1 rather than 1 (mod N ). If v , . . . , v k are elements of a group G , we use ⟨ v , . . . , v k ⟩ to denote the group that they generate. If H is a subgroup of G , then a function f : G → X on G is said to be H -periodic if f ( x + h ) = f ( x ) for all x ∈ G and h ∈ H . In particular, a function is ⟨ v , . . . , v k ⟩ -periodic if and only if f ( x + v i ) = f ( x ) for all x ∈ G and i = 1 , . . . , k . We use X = O ( Y ), X ≪ Y , or Y ≫ X to denote the estimate | X | ⩽ CY for some absolute constant C [(which will not depend on other parameters such as](https://doi.org/10.1007/s10801-023-01233-7) [q](https://doi.org/10.1007/s10801-023-01233-7) or N [). We write](https://doi.org/10.1007/s10801-023-01233-7) X ≍ Y for X ≪ Y ≪ X .

d

We use | E | to denote the cardinality of a finite set E . If E ⊂ Ω ⊂ R with Ω non-empty, we define the upper density of E in Ω to be the quantity

d

| E ∩ {− M, . . . , M } | lim sup .

M →∞ | Ω ∩ {− M, . . . , M } d

|

Thus for instance if q, N are natural numbers, the set { , . . . , N } × q Z has upper density

q

in { , . . . , N } × Z .

1.6. Acknowledgments. RG was partially supported by the AMIAS Membership and NSF grants DMS-2242871 and DMS-1926686. TT was partially supported by NSF grant DMS-1764034 and by a Simons Investigator Award. We thank Nishant Chandgotia, Asaf Katz, S´ ebastien Labb´ e and Misha Sodin for drawing our attention to some relevant references and to Emmanuel Jeandel for helpful

comments. We are also grateful to the anonymous referee for many helpful suggestions that improved the exposition of this paper.

## 2. Building a continuous aperiodic tiling equation from a discrete aperiodic tiling equation

In this section we show that a counterexample to the discrete periodic tiling conjecture can be converted to a counterexample to the continuous periodic tiling conjecture. More precisely, we show

Theorem 2.1 (Lifting a discrete aperiodic tiling equation to a continuous aperi-

d

odic tiling equation) . Let d ⩾ . If there is an aperiodic tiling equation A ⊕ F = Z

d

### for some finite non-empty subset F of Z , then there is an aperiodic tiling equation

d d

Λ ⊕ Σ = a . e . R for some bounded measurable subset Σ of R of positive measure.

d d

In other words, if Conjecture 1.2 fails in Z , then Conjecture 1.3 fails in R .

d d

[A basic connection between the discrete lattice](https://arxiv.org/abs/1608.07167) Z and the continuous space R is given by the tiling relation

[d](https://doi.org/10.1093/imrn/rnad048) [d](https://doi.org/10.1093/imrn/rnad048)

[Z](https://doi.org/10.1093/imrn/rnad048) [⊕](https://doi.org/10.1093/imrn/rnad048) [Q](https://doi.org/10.1093/imrn/rnad048) [d](https://doi.org/10.1093/imrn/rnad048) [=](https://doi.org/10.1093/imrn/rnad048) [a](https://doi.org/10.1093/imrn/rnad048) [.](https://doi.org/10.1093/imrn/rnad048) [e](https://doi.org/10.1093/imrn/rnad048) [.](https://doi.org/10.1093/imrn/rnad048) [R](https://doi.org/10.1093/imrn/rnad048) [,](https://doi.org/10.1093/imrn/rnad048)

d

where Q d := [0 [,](https://arxiv.org/abs/2305.14028) [1]](https://arxiv.org/abs/2305.14028) is the unit cube. By translation invariance one also has

d d

( Z + t ) ⊕ Q d = a . e . R

d

for any t ∈ R . However, due to the ability to “slide” cubes Q d in various direc-

[d](https://arxiv.org/abs/2303.10798)

[tions, there are many more tilings of](https://arxiv.org/abs/2303.10798) [R](https://arxiv.org/abs/2303.10798) [by](https://arxiv.org/abs/2303.10798) Q d than these; this is evidenced for [instance by the failure of Keller’s conjecture in high dimensions [LS92]. Because of](https://doi.org/10.1007/s00454-022-00426-4) this, the unit cube Q d [is not a suitable tool for establishing Theorem 2.1. Instead,](https://arxiv.org/abs/2305.17743) we need a “rigid” version R d of Q d , or more precisely,

Lemma 2.2 [(Existence of a rigid tile)](https://arxiv.org/abs/2309.09504) . For any d ⩾ , there exists a bounded

d d d

measurable subset R d of R such that Z ⊕ R d = a . e . R , and conversely the only

d d d d d

sets Λ ⊂ R with Λ ⊕ R d = a . e . R are translates Λ = Z + t of Z for some t ∈ R .

The idea of using rigid tiles to pass back and forth between discrete and continuous tiling questions goes back to the work of Golomb [G70]; see also [GT21, Lemma 9.3] for a discretized version of this lemma.

Proof. The idea is to remove and add “bumps” at the facets of Q d to make a rigid “jigsaw puzzle piece”; see Figure 2.1. There are many constructions available. For instance, we can define R d to be the set ! ]

d ] d

R d := Q d \ C k ⊎ ( C k + e k )

k =1 k =1

d

where for e , . . . , e d is the standard basis for R , and for each k = 1 , . . . , d , C k ⊂ Q d

is a ϵ -subcube of Q d , which one can for instance define as

k ! Y − Y d

C k := [ x j , x j + ϵ ] × [0 , ϵ ] × [ x j , x j + ϵ ]

j =1 j = k +1

where 0 < ϵ < / 5 and 2 ϵ < x j < − ϵ , j = 1 , . . . , d are arbitrary. Because

d

the piece C k removed for a given k is a translate by an element of Z of the piece C k + e k added for a given k , we still have

d d d

Z ⊕ R d = a . e . Z ⊕ Q d = a . e . R .

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

Figure 2.1. A “rigid” tile R replacing the non rigid tile Q = [0 , 1] . The only tilings Λ ⊕ R = a . e . R of the plane R by R are the translated lattice tilings ( Z + t ) ⊕ R = a . e . R for t ∈ R .

d

On the other hand, it is geometrically evident that if Λ ⊕ R d = a . e . R and t ∈ Λ, then t ± e k must also lie in Λ for all k = 1 , . . . , d , as there is no other way to fit translates of R d around the added and removed “bumps” C k + t , C k + e k + t of

d

R d + t [. Thus Λ must contain a translated lattice](https://arxiv.org/abs/1608.07167) Z + t ; since this lattice already

d d

is a tiling set of R by R d , we therefore have Λ = Z + t , as required. □

[Using this rigid tile, it is now straightforward to establish Theorem 2.1.](https://doi.org/10.1093/imrn/rnad048)

d

Proof of Theorem 2.1. [Suppose that there is a finite non-empty](https://arxiv.org/abs/2305.14028) F ⊂ Z such that

d

the tiling equation A ⊕ F = Z is aperiodic. With R d being the rigid tile provided by Lemma 2.2, we introduce the bounded

d

measurable subset Σ of R by the formula

[d](https://doi.org/10.1007/s00454-022-00426-4) d

[Σ :=](https://doi.org/10.1007/s00454-022-00426-4) [F](https://doi.org/10.1007/s00454-022-00426-4) [⊕](https://doi.org/10.1007/s00454-022-00426-4) [R](https://doi.org/10.1007/s00454-022-00426-4) [d](https://doi.org/10.1007/s00454-022-00426-4) [⊂](https://doi.org/10.1007/s00454-022-00426-4) [Z](https://doi.org/10.1007/s00454-022-00426-4) [⊕](https://doi.org/10.1007/s00454-022-00426-4) Q d = a . e . R .

[Clearly Σ has positive measure.](https://arxiv.org/abs/2209.08451) It will suffice to show that the tiling equation

[d](https://arxiv.org/abs/2209.08451)

Λ ⊕ Σ = a . e . R is aperiodic. On the one hand we have

d d

A ⊕ Σ = a . e . ( A ⊕ F ) ⊕ R d = a . e . Z ⊕ R d = a . e . R

d

so there is at least one tiling of R by Σ.

d d

Conversely, suppose that we have a tiling Λ ⊕ Σ = a . e . R of R . Then we have

d

(Λ ⊕ F ) ⊕ R d = a . e . Λ ⊕ Σ = a . e . R ,

d d

and hence by Lemma 2.2, we have Λ ⊕ F = Z + t for some t ∈ R . Then Λ − t

d

is a tiling set of Z by F and is hence not periodic by hypothesis. This implies

d

that Λ is not periodic, and so the tiling equation Λ ⊕ Σ = a . e . R is aperiodic as claimed. □

In view of Theorem 2.1, we see that Corollary 1.6 implies Corollary 1.7. In

d

[MSS22] it was shown that any tiling of a quotient group Z / Λ can be identified

d

with a tiling of Z . This is done by a rigid pullback argument, generalizing [GT21, Section 9]. As a corollary, this gives that the discrete periodic tiling conjecture

d

in Z also implies the discrete periodic tiling conjecture in every quotient group

d

Z / Λ [MSS22, Corollary 1.2]. Thus, we have that Theorem 1.4 implies Corollary 1.7. It therefore remains to establish Theorem 1.4. This is the objective of the remaining sections of the paper.

## 3. Building an aperiodic tiling equation from an aperiodic system of tiling equations

Theorem 1.4 asserts the construction of a single tiling equation A ⊕ F = G which is aperiodic. As in our previous paper [GT21], it will be more convenient

to consider the significantly more flexible problem of constructing a system

A ⊕ F m = G for all m = 1 , . . . , M (3.1)

of tiling equations which are (jointly) aperiodic in the sense that solutions A ⊂ G to the system (3.1) exist, but none of them are periodic. The ability to pass to pass to this more flexible setup is provided by the following tool (compare with Theorem 2.1):

Theorem 3.1 (Concatenating an aperiodic system of tiling equations into a single aperiodic tiling equation) . Let G be a finitely generated abelian group. Suppose that there exist finite non-empty sets F , . . . , F M ⊂ G for some M ⩾ such that the system (3.1) of tiling equations is aperiodic. Then there exist a -group of the

r

form Z /N Z , N = 2 , and a finite non-empty subset F ˜ of G × Z /N Z such that the single tiling equation A ˜ ⊕ F ˜ = G × Z /N Z is aperiodic.

[This theorem is a variant of our previous result [GT21, Theorem 1.15], in which](https://doi.org/10.1093/imrn/rnad048) the 2-group Z /N Z was replaced by a proper subset of the cyclic group Z / ( M +1) Z . [In order to be able to tile the](https://arxiv.org/abs/2305.14028) [whole](https://arxiv.org/abs/2305.14028) group, we will utilize a “rigid” partition of Z /N Z . More precisely, we have the following analogue of Lemma 2.2:

Lemma 3.2 (Construction of a “rigid” partition) . For every M ⩾ , there exist N ⩾ [and a partition](https://arxiv.org/abs/2303.10798) [Z](https://arxiv.org/abs/2303.10798) [/N](https://arxiv.org/abs/2303.10798) [Z](https://arxiv.org/abs/2303.10798) [=](https://arxiv.org/abs/2303.10798) [E](https://arxiv.org/abs/2303.10798) [⊎ · · · ⊎](https://arxiv.org/abs/2303.10798) E M of Z /N Z into M non-empty sets E , . . . , E [M](https://doi.org/10.1007/s00454-022-00426-4) [, such that](https://doi.org/10.1007/s00454-022-00426-4) [E](https://arxiv.org/abs/2305.17743) [i](https://arxiv.org/abs/2305.17743) [∩](https://arxiv.org/abs/2305.17743) [(](https://arxiv.org/abs/2305.17743) [E](https://arxiv.org/abs/2305.17743) [j](https://arxiv.org/abs/2305.17743) [+](https://arxiv.org/abs/2305.17743) [h](https://arxiv.org/abs/2305.17743) [)](https://arxiv.org/abs/2305.17743) [̸](https://arxiv.org/abs/2305.17743) [=](https://arxiv.org/abs/2305.17743) [∅](https://arxiv.org/abs/2305.17743) (3.2) for any ⩽ i, j ⩽ M and h ∈ Z /N Z \{ } . In particular, for any ⩽ i, j ⩽ M and h i [, h](https://arxiv.org/abs/2309.09504) [j](https://arxiv.org/abs/2309.09504) [∈](https://arxiv.org/abs/2309.09504) [Z](https://arxiv.org/abs/2309.09504) [/N](https://arxiv.org/abs/2309.09504) [Z](https://arxiv.org/abs/2309.09504) [, we have](https://arxiv.org/abs/2309.09504)

( E i + h i ) ∩ ( E j + h j ) ̸ = ∅ (3.3)

unless h i = h j and i ̸ = j .

Proof. To construct such E , . . . , E M we use the probabilistic method. Let N be a sufficiently large power of two (depending on M ) to be chosen later. Let a : Z /N Z → { , . . . , M } be a function chosen uniformly at random, thus the a ( x ) ∈ { , . . . , M } for x ∈ Z /N Z are independent uniform random variables. We then set E i := { x ∈ Z /N Z : a ( x ) = i } to be the level sets of a . Clearly the E , . . . , E M partition Z /N Z . [The probability that a given](https://doi.org/10.1007/s10801-023-01233-7) [E](https://doi.org/10.1007/s10801-023-01233-7) [i](https://doi.org/10.1007/s10801-023-01233-7) [is empty is](https://doi.org/10.1007/s10801-023-01233-7)

N

(1 − [/M](https://doi.org/10.1007/s10801-023-01233-7) [)](https://doi.org/10.1007/s10801-023-01233-7) [.](https://doi.org/10.1007/s10801-023-01233-7) Now let 1 ⩽ i, j ⩽ M and h ∈ Z /N Z \{ } . Then the only way that (3.2) fails for this choice of parameters is if ( a ( x ) , a ( x − h )) ̸ = ( i, j ) for all x ∈ Z /N Z . As h ̸ = 0, it has even order, so one can partition Z /N Z into N/ sets of the form { x, x − h } , so the probability that (3.2) fails for this choice of

N/

parameters is at most (1 − /M ) . As the total number of choices of ( i, j, h ) is at most M N , the probability that this construction fails to work is thus at most

N N/

M (1 − /M ) + M N (1 − /M ) .

For N sufficiently large depending on M , this failure probability is less than 1, and the claim follows. □

Remark 3.3. An inspection of the bounds shows that one can take the 2-group Z /N Z to be of order N = O ( M log M ). A similar construction works with Z /N Z replaced by other finite abelian groups of comparable order. We were able to also

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

find deterministic constructions of the sets E , . . . , E M in various such groups, but for such constructions the verification of the key property (3.3) required a longer argument than the probabilistic arguments provided here.

We are now ready to prove Theorem 3.1.

Proof of Theorem 3.1. Let G, F , . . . , F M be as in that theorem. We use the partition Z /N Z = E ⊎ · · · ⊎ E M provided by the above lemma to form the combined tile ] M

F ˜ := ( F m × E m ) ⊂ G × Z /N Z . (3.4)

m =1

To complete the proof of Theorem 3.1, it suffices to show that the single tiling equation A ˜ ⊕ F ˜ = G × Z /N Z . (3.5)

is aperiodic. To verify this claim, we first observe that by hypothesis there exists A ⊂ G such that A ⊕ F m = G for all m = 1 [, . . . , M](https://doi.org/10.1093/imrn/rnad048) [. If we set ](https://doi.org/10.1093/imrn/rnad048) [A](https://doi.org/10.1093/imrn/rnad048) [˜](https://doi.org/10.1093/imrn/rnad048) [:=](https://doi.org/10.1093/imrn/rnad048) [A](https://doi.org/10.1093/imrn/rnad048) [× {](https://doi.org/10.1093/imrn/rnad048) [} ⊂](https://doi.org/10.1093/imrn/rnad048) G × Z /N Z , then we have from (3.4) that

] M ] M

A ˜ ⊕ F ˜ = (( A ⊕ F m ) × E m ) = G × E m = G × Z /N Z .

m =1 m =1

[Thus the tiling equation (3.5) has at least one solution.](https://doi.org/10.1007/s00454-022-00426-4) Conversely, suppose [A](https://arxiv.org/abs/2305.17743) [˜](https://arxiv.org/abs/2305.17743) [⊂](https://arxiv.org/abs/2305.17743) [G](https://arxiv.org/abs/2305.17743) [×](https://arxiv.org/abs/2305.17743) [Z](https://arxiv.org/abs/2305.17743) [/N](https://arxiv.org/abs/2305.17743) [Z](https://arxiv.org/abs/2305.17743) solves the tiling equation (3.5). We first [claim that any “vertical line”](https://arxiv.org/abs/2209.08451) [{](https://arxiv.org/abs/2209.08451) [a](https://arxiv.org/abs/2209.08451) [} ×](https://arxiv.org/abs/2209.08451) Z /N Z , a ∈ G intersects A ˜ in at most one

′ ′

point. [Indeed, if (](https://arxiv.org/abs/2309.09504) [a, h](https://arxiv.org/abs/2309.09504) [)](https://arxiv.org/abs/2309.09504) [,](https://arxiv.org/abs/2309.09504) [(](https://arxiv.org/abs/2309.09504) [a, h](https://arxiv.org/abs/2309.09504) [)](https://arxiv.org/abs/2309.09504) [∈](https://arxiv.org/abs/2309.09504) [A](https://arxiv.org/abs/2309.09504) ˜ for some h ̸ = h , then by (3.4) A ˜ ⊕ F ˜ will

′

contain both ( a + F ) × ( h + E ) and ( a + F ) × ( h + E ) as disjoint sets. But by

′

(3.3), h + E , h + E intersect, a contradiction. Because each vertical line { a } × Z /N Z , a ∈ G meets A in at most one point, we can write  A ˜ as a graph

A ˜ = { ( a, f ( a )) : a ∈ A }

for some A ⊂ G and some function f : A → Z /N Z . From (3.5), (3.4) we see that the sets ( a + F m ) × ( f ( a ) + E [m](https://doi.org/10.1007/s10801-023-01233-7) [)](https://doi.org/10.1007/s10801-023-01233-7) [(3.6)](https://doi.org/10.1007/s10801-023-01233-7)

for a ∈ [A](https://doi.org/10.1007/s10801-023-01233-7) [and](https://doi.org/10.1007/s10801-023-01233-7) m = 1 , . . . , M partition G × Z /N Z . We now claim that for any m = 1 , . . . , M , the sets a + F m , a ∈ A are disjoint.

′ ′ ′ ′

For if we had a + f = a + f for some distinct a, a ∈ A and f, f ∈ F m , then

′ ′ ′

{ a + f } × ( f ( a ) + E m ) and { a + f } × ( f ( a ) + E m ) would have to be disjoint, but this again contradicts (3.3). By restricting the partition (3.6) of G × Z /N Z to a single vertical line { b } × Z /N Z , we see that for any b ∈ G , we can partition Z /N Z into f ( a m ) + E m , where m = 1 , . . . , M and a m is the unique element of A (if it exists) such that b ∈ a m + F m . Since f ( a m )+ E m has cardinality | E m | > 0, and | E | + · · · + | E M | = N , we conclude that a m must exist for every m = 1 , . . . , M . In other words, A ⊕ F m = G for every m = 1 , . . . , M . By hypothesis, this implies that A is non-periodic. Since A is the projection of  A ˜ to G , this implies that  A ˜ is also non-periodic. Thus the tiling equation (3.5) is aperiodic, and Theorem 3.1 follows. □

Let us say that the multiple periodic tiling conjecture holds for some finitely generated abelian group G if, whenever F , . . . , F M are finite non-empty subsets of G , the system (3.1) of tiling equations is not aperiodic. Obviously, the multiple periodic tiling conjecture for a given group implies the periodic tiling conjecture for that group. Applying Theorem 3.1, we conclude that the periodic tiling conjecture will hold for Z × G for all finite abelian groups G if and only if the multiple periodic tiling conjecture holds for Z × G for all finite abelian groups G . Thus, to establish Theorem 1.4, it now suffices to establish

Theorem 3.4 (Counterexample to multiple periodic tiling conjecture) . There exist a finite abelian group G and a finite non-empty subsets F , . . . , F M of G = Z × G such that the system (3.1) of tiling equations is aperiodic. In other words, the multiple periodic tiling conjecture fails for Z × G .

Our remaining task is to establish Theorem 3.4. This is the objective of the [remaining sections of the paper.](https://arxiv.org/abs/1608.07167)

## 4. [Building an aperiodic system of tiling equations from an](https://doi.org/10.1093/imrn/rnad048) aperiodic property expressible in functional equations

One can view the individual tiling equations A ⊕ F m = G in (3.1) as sentences in a “tiling language” that assert various constraints on the tiling set A . Theorem 3.4 can then be thought of as an assertion that this tiling language is expressive [enough to describe a type of set](https://arxiv.org/abs/2303.10798) [A](https://arxiv.org/abs/2303.10798) [⊂](https://arxiv.org/abs/2303.10798) [Z](https://arxiv.org/abs/2303.10798) [×](https://arxiv.org/abs/2303.10798) G that can exist, but is necessarily non-periodic. In this section we show that one can replace the language of tiling equations A ⊕ F = G by the language of functional equations , in which the unknown object [is now a function](https://arxiv.org/abs/2309.09504) [α](https://arxiv.org/abs/2309.09504) [:](https://arxiv.org/abs/2309.09504) [G](https://arxiv.org/abs/2309.09504) [→](https://arxiv.org/abs/2309.09504) [H](https://arxiv.org/abs/2309.09504) from a finitely generated abelian group G to a finite abelian group H , rather than a subset A of G , and then develop the further theory of this “functional equation language”. A single functional equation in this language will take the form

]

J

( α ( x + h j ) + E j ) = H for every x ∈ G (4.1)

j =1

for some given shifts h , . . . , h J ∈ G and some sets E , . . . , E J ⊂ H , which we may take to be non-empty. For instance, in Example 4.8 below we will consider the functional equation

( α ( x ) + { } ) ⊎ ( α ( x + 1) + ( Z /N Z \{ } )) = Z /N Z

that may or may not be satisfied by a given function α : Z → Z /N Z . A system

]

J i

( α ( x + h i,j ) + E i,j ) = H for all i = 1 , . . . , M, x ∈ G (4.2)

j =1

of such functional equations will be said to be aperiodic if solutions α : G → H to this system exist, but that they are all non-periodic, by which we mean that there is no finite index subgroup Λ of G such that α ( x + h ) = α ( x ) for all x ∈ G and h ∈ Λ. We then have the following tool to convert aperiodic systems of functional equations to aperiodic systems of tiling equations, in the spirit of Theorems 2.1, 3.1.

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

Theorem 4.1 (Converting an aperiodic system of functional equations to an aperiodic system of tiling equations) . Let G be a finitely generated abelian group, and let H be a finite abelian group. Suppose that there exists [M](https://tilings.math.uni-bielefeld.de/) [⩾](https://tilings.math.uni-bielefeld.de/) [, and for each](https://tilings.math.uni-bielefeld.de/) i = 1 [, . . . , M](https://tilings.math.uni-bielefeld.de/) there exists J i ⩾ , and for each ⩽ j ⩽ J i there exist shifts h i,j ∈ G and sets E i,j ⊂ H , such that the system (4.2) of functional equations is aperiodic. Then there exists a system (3.1) of tiling equations in G × H which is aperiodic.

Proof. We will consider the system of tiling equations in G × H consisting of the “vertical line test” equation

A ⊕ ( { } × H ) = G × H (4.3)

as well as the tiling equations

]

J i

A ⊕ {− h i,j } × E i,j = G × H (4.4)

[j](https://arxiv.org/abs/1608.07167) [=1](https://arxiv.org/abs/1608.07167)

for i = 1 , . . . , M . It will suffice to show that this system of tiling equations is aperiodic. On the one hand, by hypothesis there is a solution α : G → H to the system [(4.2). If we then form the graph](https://arxiv.org/abs/2305.14028) ] A := { ( x, α ( x )) : x ∈ G } = ( { x } × { α ( x ) } ) ⊂ G × H (4.5)

x ∈ G

then one has []](https://arxiv.org/abs/2305.17743) [A](https://arxiv.org/abs/2209.08451) [⊕](https://arxiv.org/abs/2209.08451) [(](https://arxiv.org/abs/2209.08451) [{](https://arxiv.org/abs/2209.08451) [} ×](https://arxiv.org/abs/2209.08451) [H](https://arxiv.org/abs/2209.08451) ) = { x } × H = G × H

x ∈ G and ] J i ] J i

] A ⊕ {− h i,j } × E i,j = { x − h j } × ( α ( x ) + E i,j )

j =1 j =1 x ∈ G

]

J i

] = { y } × ( α ( y + h j ) + E i,j )

j =1 y ∈ G

= G × H

and so A solves the system of tiling equations (4.3), (4.4). Conversely, suppose that A ⊂ G × H solves the system of tiling equations (4.3), (4.4). From (4.3) we see that each vertical line { x } × H , x ∈ G meets A in exactly one point; in other words, A is a graph (4.5) of some function α : G → H . By the above calculations, we then see that each tiling equation (4.4) is equivalent to its functional counterpart (4.2), so that α is a solution to the system (4.2). By hypothesis, α is non-periodic, and hence A is non-periodic also. This establishes the theorem. □

In order to use the above theorem, it is convenient to introduce some notation.

Definition 4.2. Let G, H be abelian groups. A ( G, H ) -property is a property P that may or may not be satisfied by any given function α : G → H . (If one wishes,

G

one can identify such a property with a subset of H , namely with the set of all

G

α ∈ H that obey property P (after viewing α as a function from G to H .)

Example 4.3. Every functional equation (4.1) associated to a given set of parameters h , . . . , h J ∈ G and E , . . . , E J ⊂ H can be viewed as an example of a ( G, H )-property. The conjunction of any number of ( [G, H](https://tilings.math.uni-bielefeld.de/) [)-properties is ob-](https://tilings.math.uni-bielefeld.de/) [viously also a (](https://tilings.math.uni-bielefeld.de/) G, H )-property, so each functional system (4.2) also describes a ( G, H )-property.

Definition 4.4 (Expressible property) . We say that a ( G, H )-property P is expressible in the language of functional equations , or expressible for short, if there exists a system (4.2) of functional equations for some M ⩾ 0 which is obeyed by a function α : G → H if and only if α obeys property P .

One can think of expressible properties as describing certain types of subshifts of finite type; see also Remark 4.11 below.

Definition 4.5 (Aperiodic property) . We say that a ( G, H )-property P is aperiodic [if it is satisfiable, but only by non-periodic functions.](https://arxiv.org/abs/1608.07167)

The following examples may help illustrate these concepts.

Example 4.6 (Empty and full property) [.](https://doi.org/10.1093/imrn/rnad048) The empty property (satisfied by no function α : G → H ) is expressible, for instance using an empty functional equation (4.1) with J = 0. Similarly, the complete property (satisfied by every function α : G → H ) is expressible, using the empty system with M = 0 (or alternatively by using the functional equation α ( x ) + H = H ). Neither property is aperiodic [(the former has no solutions, and the latter includes periodic solutions).](https://arxiv.org/abs/2303.10798)

Example 4.7 [(Closure under conjunction)](https://arxiv.org/abs/2305.17743) [.](https://arxiv.org/abs/2305.17743) [If](https://arxiv.org/abs/2305.17743) [P](https://arxiv.org/abs/2305.17743) , . . . , P M are a finite collection of expressible ( [G, H](https://arxiv.org/abs/2209.08451) [)-properties, then their conjunction](https://arxiv.org/abs/2209.08451) P ∧ · · · ∧ P M is clearly also an expressible ( G, H )-property.

Example 4.8 (Expressing a clock) . Let Z /N Z be a cyclic group. Let us call a function α : Z → Z /N Z a clock if it obeys the property

α ( x + 1) = α ( x ) + 1

for all x ∈ Z , or equivalently if it takes the form α ( x ) = x + a (mod N ) for some a ∈ Z /N Z . Then the property of being a clock is expressible by using the single functional equation

( α ( x ) + { } ) ⊎ ( α ( x + 1) + ( Z /N Z \{ } )) = Z /N Z .

On the other hand, the property of being a clock is clearly not aperiodic.

For technical reasons we will not actually employ the clock property in our main argument, but instead rely on the following variant.

Example 4.9 (Expressing a periodized permutation) . Let Z /N Z be a cyclic group. Let us call a function α : Z → Z /N Z a periodized permutation if it is of the form α ( x ) = σ ( x (mod N )) for some permutation σ : Z /N Z → Z /N Z . For instance, every clock is a periodized permutation, but the converse is not true

This notion is somewhat analogous to the notion of an algebraic set in algebraic geometry, or of a variety in universal algebra. For instance, the claim in Example 4.7 is analogous to the claim that the intersection of finitely many algebraic sets is again algebraic. On the other hand, unlike algebraic sets which are closed under unions thanks to the integral domain property ab = 0 ⇐⇒ a = 0 ∨ b = 0, it is not the case that the disjunction of expressible properties is again expressible, as there is no analogue of the integral domain property in our setting.

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

for N > 2. We claim that the property of being a periodized permutation is expressible by the single functional equation

( α ( x ) + { } ) ⊎ ( α ( x + 1) + { } ) ⊎ · · · ⊎ ( α ( x + N − 1) + [{](https://tilings.math.uni-bielefeld.de/) [}](https://tilings.math.uni-bielefeld.de/) [) =](https://tilings.math.uni-bielefeld.de/) [Z](https://tilings.math.uni-bielefeld.de/) [/N](https://tilings.math.uni-bielefeld.de/) [Z](https://tilings.math.uni-bielefeld.de/)

for all x ∈ Z . Indeed, this equation asserts that the N points α ( x ) , . . . , α ( x + N − 1) in Z /N [Z](https://arxiv.org/abs/2211.07140) [are all distinct, which when applied to both](https://arxiv.org/abs/2211.07140) x and x + 1 implies that α ( x ) = α ( x + N ), and also that α is a permutation on any interval { x, . . . , x + N − } , which gives the claim. Obviously, this property is not aperiodic either.

Theorem 4.1 tells us that if there is an expressible ( G, H )-property P that is aperiodic, then one can use this to build an aperiodic system of tiling equations. (Note that the empty system M = 0 is not aperiodic, so we must have M ⩾ 1.) As a consequence, Theorem 3.4 is implied by the following statement.

Theorem 4.10 (Expressing aperiodicity) . There exist finite abelian groups G , H and an ( Z × G , H ) -property P that is both expressible and aperiodic.

Remark 4.11 (Translation invariance) . An expressible property P must necessarily be translation invariant in both the horizontal direction G and the vertical direction H . More precisely, if [α](https://doi.org/10.1093/imrn/rnad048) [:](https://doi.org/10.1093/imrn/rnad048) [G](https://doi.org/10.1093/imrn/rnad048) [→](https://doi.org/10.1093/imrn/rnad048) [H](https://doi.org/10.1093/imrn/rnad048) [obeys](https://doi.org/10.1093/imrn/rnad048) [P](https://doi.org/10.1093/imrn/rnad048) , then so do all the horizontal translates x → [α](https://arxiv.org/abs/2305.14028) [(](https://arxiv.org/abs/2305.14028) [x](https://arxiv.org/abs/2305.14028) [+](https://arxiv.org/abs/2305.14028) [h](https://arxiv.org/abs/2305.14028) [) for](https://arxiv.org/abs/2305.14028) [h](https://arxiv.org/abs/2305.14028) [∈](https://arxiv.org/abs/2305.14028) [G](https://arxiv.org/abs/2305.14028) , and vertical translates x → α ( x ) + u for u ∈ H . This is because each equation in (4.2) is invariant with respect to these translations. The horizontal invariance (together with the “local” nature of the equations (4.2)) also means that such properties can be interpreted as subshifts [of finite type. The “dilation lemma” (see e.g., [GGRT22, Theorem 1.2]) also can](https://arxiv.org/abs/2303.10798) [force some dilation invariances of expressible properties (at least if the shifts](https://doi.org/10.1007/s00454-022-00426-4) h i,j in (4.2) are of finite order), although we will not formalize this assertion here. These invariances are a technical complication for our applications, as they provide some limitations on what types of properties one can hope to express in the language of functional equations. For instance, one cannot remove the constant a from the clock property in Example 4.8 and still retain expressibility.

It will be convenient to “coordinatize” the function α : G → H by replacing it with a tuple ( α w ) w ∈W of functions α w : G → H w into various finite abelian groups H w indexed by a finite set W . Note that any such tuple ( Q α w ) w ∈W can be identified with a single function α : G → w ∈W

H w , defined by the formula

α ( x ) := ( α w ( x )) w ∈W

for x ∈ G . Define a ( G, ( H w ) w ∈W ) -function [to be a tuple (](https://doi.org/10.1007/s10801-023-01233-7) [α](https://doi.org/10.1007/s10801-023-01233-7) [w](https://doi.org/10.1007/s10801-023-01233-7) [)](https://doi.org/10.1007/s10801-023-01233-7) [w](https://doi.org/10.1007/s10801-023-01233-7) [∈W](https://doi.org/10.1007/s10801-023-01233-7) [of functions](https://doi.org/10.1007/s10801-023-01233-7) α w : G [→](https://doi.org/10.1007/s10801-023-01233-7) [H](https://doi.org/10.1007/s10801-023-01233-7) w , and define a ( G, ( H w ) w ∈W ) -property to be a property P of a ( G, ( H w ) w ∈W )-function ( α w ) w ∈W . We will say such a property P is expressible in the language of functional equations Q , or expressible for short, if the correspond- Q ing ( G, w ∈W

H w )-property P ˜ of the combined function α : G → w ∈W

H w is expressible, that is to say that there is a system of functional equations

]

J i

Y (( α w ( x + h i,j )) w ∈W + E i,j ) = H w for all i = 1 , . . . , M (4.6)

j =1 w ∈W

Q for some M , some J , . . . , J M , and some h i,j ∈ G and E i,j ⊂ w ∈W

H w for 1 ⩽ i ⩽ M and 1 ⩽ j ⩽ J i , which is satisfied by the tuple ( α w ) w ∈W if and only if the property P holds. We say that P is aperiodic if  P ˜ is, or equivalently if there are tuples ( α w ) w ∈W obeying property P , but any such tuple has at least one of the α w

non-periodic.

Example 4.12 (Differing by a constant is expressible) . Let H be a finite abelian group. The property of two functions α , α : Z → H differing by a constant (thus α ( x ) = α ( x ) + c for all x ∈ Z and some c ∈ H [) can be seen to be an expressible](https://tilings.math.uni-bielefeld.de/) ( Z , ( [H, H](https://tilings.math.uni-bielefeld.de/) ))-property by using the system of functional equations

[((](https://arxiv.org/abs/2211.07140) [α](https://arxiv.org/abs/2211.07140) [(](https://arxiv.org/abs/2211.07140) [x](https://arxiv.org/abs/2211.07140) [)](https://arxiv.org/abs/2211.07140) [, α](https://arxiv.org/abs/2211.07140) [(](https://arxiv.org/abs/2211.07140) [x](https://arxiv.org/abs/2211.07140) [)) + ∆)](https://arxiv.org/abs/2211.07140) [⊎](https://arxiv.org/abs/2211.07140) [(](https://arxiv.org/abs/2211.07140) [α](https://arxiv.org/abs/2211.07140) [(](https://arxiv.org/abs/2211.07140) [x](https://arxiv.org/abs/2211.07140) + e i ) , α ( x + e i )) + ( H \ ∆)) = H (4.7)

for x ∈ Z and i = 1 , 2, where e = (1 , 0), e = (0 , 1) is the standard basis of Z , and ∆ is the diagonal group

∆ := { ( a, a ) : a ∈ H } .

Indeed, the equation (4.7) can easily be seen to be equivalent to the equation

α ( x ) − α ( x ) = α ( x + e i ) − α ( x + e i ) ,

which is in turn equivalent to the constancy of α − α since the e , e generate Z . This property is of course not aperiodic, since one can easily find a pair ( α , α ) [of periodic functions that differ by a constant.](https://arxiv.org/abs/1608.07167)

Recall that Theorem 3.4 is implied by Theorem 4.10 which can now be reduced to establishing the following claim.

Theorem 4.13 [(Expressing aperiodicity for a tuple)](https://arxiv.org/abs/2305.14028) . There exist a finite abelian group G , a tuple ( H w ) w ∈W of finite abelian groups indexed by a finite set W , and a ( Z × G , ( H w ) w ∈W ) -property that is both expressible and aperiodic.

Remark 4.14. [By Remark 4.11, an expressible (](https://arxiv.org/abs/2303.10798) G, ( H w ) w ∈W )-property must be [invariant with joint horizontal translation of a (](https://doi.org/10.1007/s00454-022-00426-4) G, ( H w ) w ∈W )-function ( α w ) w ∈W to ( α w ( · + h )) w ∈W by a shift [h](https://arxiv.org/abs/2305.17743) [∈](https://arxiv.org/abs/2305.17743) [G](https://arxiv.org/abs/2305.17743) , and also by independent vertical translations ( α w + u w ) w ∈W [of such functions by arbitrary shifts](https://arxiv.org/abs/2209.08451) u w ∈ H W , and in some cases there are also dilation invariances. Again, these invariances present some limitations on what properties one can hope to be expressible.

To add even more flexibility to our framework, it will be convenient to relax the notion of expressibility in which we “allow existential quantifiers”.

Definition 4.15 (Weak expressibility) . Let G be a finite abelian group, and let ( H w ) w ∈W⊎W be a tuple of finite abelian groups indexed by the disjoint union of two finite sets W , W .

∗

(i) Given a ( G, ( H w ) w ∈W⊎W )-property P , we define the existential quantifi-

∗

cation (or projection ) P of P to ( G, ( H w ) w ∈W ) to be the ( G, ( H w ) w ∈W )- property defined by requiring a ( G, ( H w ) w ∈W [)-function (](https://doi.org/10.1007/s10801-023-01233-7) [α](https://doi.org/10.1007/s10801-023-01233-7) [w](https://doi.org/10.1007/s10801-023-01233-7) [)](https://doi.org/10.1007/s10801-023-01233-7) [w](https://doi.org/10.1007/s10801-023-01233-7) [∈W](https://doi.org/10.1007/s10801-023-01233-7) [to obey](https://doi.org/10.1007/s10801-023-01233-7) [P](https://doi.org/10.1007/s10801-023-01233-7) if and only if there exists a ( G, ( H w ) w ∈W⊎W )-function ( α w ) w ∈W⊎W extend-

∗

ing the original tuple ( α w ) w ∈W that obeys P . (ii) A ( G, ( H w ) w ∈W )-property P is said to be weakly expressible if it is the exis-

∗

tential quantification of some expressible ( G, ( H w ) w ∈W⊎W )-property P for some W disjoint from W .

Expressible and weakly expressible properties (or more precisely, the sets of tuples obeying such properties) can be viewed as analogous to Π and Σ sets respectively in the arithmetic hierarchy; we will not need any analogues of higher order sets in this hierarchy.

They are also somewhat analogous to the notions of an algebraic set and semi-algebraic set respectively in real algebraic geometry, though as before this analogy should not be taken too literally.

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

Obviously every expressible property is weakly expressible (take W = ∅ ). It is somewhat more challenging to locate a weakly expressible property that is not obviously expressible, but we will do so in later sections. [Observe that if](https://tilings.math.uni-bielefeld.de/) [P](https://tilings.math.uni-bielefeld.de/) [is](https://tilings.math.uni-bielefeld.de/) [an aperiodic weakly expressible (](https://tilings.math.uni-bielefeld.de/) G, ( H w ) w ∈W )-property, then the associated ex-

∗

pressible ( G, ( H w ) w ∈W⊎W )-property P is necessarily also aperiodic, since it is satisfied by at least one tuple ( α w ) w ∈W⊎W (formed by extending a tuple obeying P ), and any such tuple must contain a non-periodic function: α w : G → H w for at least one w ∈ W ⊎W (because the restriction ( α w ) w ∈W does). Hence, to prove Theorem 4.13, it suffices to show:

Theorem 4.16 (Weakly expressing aperiodicity for a tuple) . There exist a finite abelian group G , a tuple ( H w ) w ∈W of finite abelian groups indexed by a finite set W , and an ( Z × G , ( H w ) w ∈W ) -property that is both weakly expressible and aperiodic.

To prove this theorem, it will be useful to observe that the class of weakly expressible properties is closed under a number of natural operations, which we now introduce.

Definition 4.17 (Lift) . If G is a finitely generated abelian group, ( H w ) w ∈W is a [tuple of finite abelian groups indexed by a finite set](https://arxiv.org/abs/2305.14028) W , W is a subset of W , and P is a ( G, ( H w ) w ∈W )-property, we define the lift of P to ( G, ( H w ) w ∈W ) to be the ( G, ( H w ) w ∈W )-property P , defined by requiring a ( G, ( H w ) w ∈W )-function ( α w ) w ∈W

to obey P [if and only if the (](https://arxiv.org/abs/2303.10798) [G,](https://arxiv.org/abs/2303.10798) [(](https://arxiv.org/abs/2303.10798) [H](https://arxiv.org/abs/2303.10798) [w](https://arxiv.org/abs/2303.10798) [)](https://arxiv.org/abs/2303.10798) [w](https://arxiv.org/abs/2303.10798) [∈W](https://arxiv.org/abs/2303.10798) )-function ( α w ) w ∈W obeys P .

[One can think of this operation as that of adding “dummy functions”](https://arxiv.org/abs/2305.17743) α w : Z × G → [H](https://arxiv.org/abs/2209.08451) [w](https://arxiv.org/abs/2209.08451) [for](https://arxiv.org/abs/2209.08451) [w](https://arxiv.org/abs/2209.08451) [∈ W\W](https://arxiv.org/abs/2209.08451) that play no actual role in the lifted property P .

Example 4.18. The ( Z , ( H, H, H ))-property of a triple ( α , α , α ) of functions α , α , α : Z → H such that α , α both differ from α by a constant (i.e., α =

′ ′

α + c and α = α + c for some c, c ∈ H ) can be viewed as the conjunction of two lifts of (relabelings of) the ( Z , ( H, H ))-property described in Example 4.12; one of these lifts will capture the property of α and α differing by a constant, and another will capture the property of α and α differing by a constant. If we take an existential quantification to eliminate the role of α , we conclude (from Lemma 4.22 below) that the ( Z , ( H, H ))-property of a pair α , α : Z → H differing by a constant is then weakly expressible (since this occurs if and only if we can locate α : Z → H such that α , α both differ from α by a constant). Of course, from Example 4.12 we already knew that this property was in fact expressible, so this does not give an example of a weakly expressible property that is not expressible. However, in the next section we shall see several examples in which existential quantification can be used to produce weakly expressible properties that are not obviously expressible.

Example 4.19. If one lifts a ( G, ( H w ) w ∈W )-property P to a ( G, ( H w ) w ∈W )- property and then takes an existential quantification back to ( G, ( H w ) w ∈W ), one recovers the original property P (since one could simply set all the dummy functions equal to zero).

Definition 4.20 (Pullback) . Let G be a finitely generated abelian group, let

′

G be a subgroup of G , and let ( H w ) w ∈W be a tuple of finite abelian groups

′ ′

indexed by a finite set W . If P is a ( G , ( H w ) w ∈W )-property, we define the pullback

′

of P to ( G, ( H w ) w ∈W ) to be the ( G, ( H w ) w ∈W )-property P defined by requiring

′

a ( G, ( H w ) w ∈W )-function ( α w ) w ∈W to obey P if and only if the ( G , ( H w ) w ∈W )-

′ ′ ′ ′

function ( α w,x ) w ∈W defined by α w,x ( x ) := α w ( x + x ) for x ∈ G and w ∈ W

′

obeys P for every choice of base point x ∈ G .

Example 4.21 (Pulling back the clock) . Let v be a non-zero vector in Z . Then [we can identify](https://arxiv.org/abs/2211.07140) [Z](https://arxiv.org/abs/2211.07140) [with the subgroup](https://arxiv.org/abs/2211.07140) Z v = { nv : n ∈ Z } of Z . If we view the clock property from Example 4.8 as a ( Z v, Z /N Z )-property, its pullback to ( Z , Z /N Z ) is the ( Z , Z /N Z )-property of a function α : Z → Z /N Z being a clock along the direction v , that is to say for every x ∈ Z there exists a x ∈ Z /N Z such that α ( x + nv ) = a x + n (mod N ) for every n ∈ Z .

We now record the closure properties of (weak) expressibility that we will need.

Lemma 4.22 (Closure properties of (weak) expressibility) . (i) Any lift of an expressible (resp. weakly expressible) property is also expressible (resp. weakly expressible). (ii) Any pullback of an expressible (resp. weakly expressible) property is also expressible (resp. weakly expressible).

′

(iii) The conjunction P ∧ P [of two expressible (resp. weakly expressible)](https://doi.org/10.1093/imrn/rnad048) ( G, ( H w ) w ∈W ) - properties is also expressible (resp. weakly expressible). (iv) [Any existential quantification of a weakly expressible property is weakly ex-](https://arxiv.org/abs/2305.14028) pressible.

Proof. We begin with the expressible case of (i). Suppose that P is a ( G, ( H w ) w ∈W )- [property formed by lifting an expressible (](https://arxiv.org/abs/2303.10798) G, ( H w ) w ∈W )-property Q P . By def- [inition, we can find](https://doi.org/10.1007/s00454-022-00426-4) [M, J](https://doi.org/10.1007/s00454-022-00426-4) [, . . . , J](https://doi.org/10.1007/s00454-022-00426-4) [M](https://doi.org/10.1007/s00454-022-00426-4) [, and](https://doi.org/10.1007/s00454-022-00426-4) [h](https://doi.org/10.1007/s00454-022-00426-4) [i,j](https://doi.org/10.1007/s00454-022-00426-4) ∈ G and E i,j, ⊂ w ∈W

H w for ⩽ i [⩽](https://arxiv.org/abs/2209.08451) [M](https://arxiv.org/abs/2209.08451) [and 1](https://arxiv.org/abs/2209.08451) [⩽](https://arxiv.org/abs/2209.08451) [j](https://arxiv.org/abs/2209.08451) [⩽](https://arxiv.org/abs/2209.08451) [J](https://arxiv.org/abs/2209.08451) [i](https://arxiv.org/abs/2209.08451) [such that a (](https://arxiv.org/abs/2209.08451) G, ( H w ) w ∈W )-function ( α w ) w ∈W obeys P if and only if it solves the system

[]](https://arxiv.org/abs/2309.09504)

[J](https://arxiv.org/abs/2309.09504) [i](https://arxiv.org/abs/2309.09504)

Y (( α w ( x + h i,j )) w ∈W + E i,j, ) = H w

j =1 w ∈W

for all i = 1 , . . . , M and x ∈ G . If we then define the lifted sets Y Y E i,j := E i,j, × H w ⊂ H w

w ∈W\W w ∈W

for i = 1 , . . . , M and j = 1 , . . . , J i , we see from the definitions 4.17 and 4.4 that a ( G, ( H w ) w ∈W )-function ( α w ) w ∈W obeys P if and only if

]

J i

[Y](https://doi.org/10.1007/s10801-023-01233-7) (( α w ( x + h i,j )) w ∈W + E i,j ) = H w

j =1 w ∈W

for all i = 1 , . . . , M . The claim follows. For the weakly expressible case of (i), suppose that P is a ( G, ( H w ) w ∈W )- property formed by lifting a weakly expressible ( G, ( H w ) w ∈W )-property P . By Definition 4.15, the weakly expressible ( G, ( H w ) w ∈W )-property P is associated

∗

to an expressible ( G, ( H w ) w ∈W ⊎W )-property P . By relabeling, we may assume

∗ ∗

that W is disjoint from W . The lift P of P to ( G, ( H w ) w ∈W⊎W ) is then an expressible ( G, ( H w ) w ∈W⊎W )-property by the expressible case of (i), and can be seen to be associated to P in the sense of Definition 4.15 by expanding out the definitions. Thus P is weakly expressible as desired. Now we establish the expressible case of (ii). Suppose that P is a ( G, ( H w ) w ∈W )-

′ ′

property formed by pulling back an expressible ( G , ( H w ) w ∈W )-property P . By

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

′

Q definition, we can find M, J , . . . , J M , and h i,j ∈ G and E i,j ⊂ w ∈W

H w for

′ ′

⩽ i ⩽ M and 1 ⩽ j ⩽ J i such that a ( G , ( H w ) w ∈W )-function ( α w ) w ∈W obeys P if and only if it solves the system

]

J i

Y [((](https://arxiv.org/abs/2211.07140) [α](https://arxiv.org/abs/2211.07140) [w](https://arxiv.org/abs/2211.07140) [(](https://arxiv.org/abs/2211.07140) [x](https://arxiv.org/abs/2211.07140) [+](https://arxiv.org/abs/2211.07140) [h](https://arxiv.org/abs/2211.07140) [i,j](https://arxiv.org/abs/2211.07140) )) w ∈W + E i,j ) = H w (4.8)

j =1 w ∈W

′

for all i = 1 , . . . , M and x ∈ G . By expanding out the definitions, we then see that a ( G, ( H w ) w ∈W )-function ( α w ) w ∈W obeys P if and only if it obeys the same system of equations (4.8) for i = 1 , . . . , M , but now with x ranging over G instead

′

of G . Thus P is also expressible as required. For the weakly expressible case of (ii), suppose that P is a ( G, ( H w ) w ∈W )-

′

property formed by pulling back a weakly expressible ( G , ( H w ) w ∈W )-property

′ ′ ′

P . By Definition 4.15, P is associated to some expressible ( G , ( H w ) w ∈W⊎W )-

′ ∗ ∗ ′ ∗

property ( P ) . If we let P be the pullback of ( P ) to ( G, ( H w ) w ∈W⊎W ), then

∗

P is expressible by the expressible case of (ii), and can be seen to be associated to P in the sense of Definition 4.15 by expanding out the definitions. Thus P is weakly expressible as desired. The expressible case of (iii) is trivial (and was already noted in Remark 4.7.

[′](https://arxiv.org/abs/2305.14028)

Now suppose that [P, P](https://arxiv.org/abs/2305.14028) [are weakly expressible (](https://arxiv.org/abs/2305.14028) G, ( H w ) w ∈W )-properties. By Definition 4.15, P is associated with an expressible ( G, ( H w ) w ∈W⊎W )-property

∗ ′

P , and P is similarly associated with an expressible ( G, ( H w ) w ∈W⊎W

′ )-property

′ ∗ ′ ∗

( P ) . [By relabeling, we can assume that](https://arxiv.org/abs/2303.10798) W and W are disjoint. Let Q

∗ ′ ∗

be the ( [G,](https://doi.org/10.1007/s00454-022-00426-4) [(](https://doi.org/10.1007/s00454-022-00426-4) [H](https://doi.org/10.1007/s00454-022-00426-4) [w](https://doi.org/10.1007/s00454-022-00426-4) [)](https://doi.org/10.1007/s00454-022-00426-4) [w](https://doi.org/10.1007/s00454-022-00426-4) [∈W⊎W](https://doi.org/10.1007/s00454-022-00426-4) [⊎](https://doi.org/10.1007/s00454-022-00426-4) [W](https://doi.org/10.1007/s00454-022-00426-4)

[′](https://doi.org/10.1007/s00454-022-00426-4) )-property formed by lifting both P and ( P ) to ( G, ( H w ) w ∈W⊎W ⊎ W

′ [) and then taking their conjunction.](https://arxiv.org/abs/2305.17743) By the previously es-

[∗](https://arxiv.org/abs/2209.08451)

[tablished parts of this lemma,](https://arxiv.org/abs/2209.08451) [Q](https://arxiv.org/abs/2209.08451) is expressible, and can be seen to be associated

′

to P ∧ [P](https://arxiv.org/abs/2309.09504) in the sense of Definition 4.15 by expanding out the definitions. Thus

′

P ∧ P is weakly expressible as desired. Finally, (iv) is immediate from Definition 4.15, after observing that an existential quantification of an existential quantification is again an existential quantification. □

## 5. A library of (weakly) expressible properties

In view of Lemma 4.22, a natural strategy to establish Theorem 4.16 is to first build up a useful “library” of (weakly) expressible ( G, ( H w ) w ∈W )-properties for various choices of G and ( H w ) w ∈W , with the aim of combining them via various applications of Lemma 4.22 to create more interesting (and ultimately, aperiodic) examples of weakly expressible properties (analogously to how one can create a complex computer program by combining more fundamental library routines together in various ways). For instance, the clock in Example 4.8 can be regarded as one entry in this library, as can the property of being a periodized permutation as discussed in Example 4.9, or the property of differing by a constant as discussed in Example 4.12. The final objective is to then “program” such a combination of properties in the library that necessarily generates an non-periodic function. In fact we will achieve this by “programming” a certain type of “Sudoku puzzle” that can be solved, but only in a non-periodic fashion.

Example 5.1. Consider the ( Z , Z /N Z )-property P of a function α : Z → Z /N Z being of the form α ( x, y ) = x + y + c for all ( x, y ) ∈ Z and some c ∈ Z /N Z . This is equivalent to α being a clock along the direction e = (1 , 0) and simultaneously

being a clock along the direction e = (0 , 1), in the sense of Example 4.21. Thus this property P is the conjunction of two pullbacks of the clock property; since we know from Example 4.8 that the clock property is expressible, we conclude from several applications of Lemma 4.22 that this property P is also expressible. However, this property is not aperiodic, and so does not complete the proof of Theorem 4.16.

Example 5.2. The ( Z , ( Z /N Z ) w =1 , )-property of two functions α , α : Z → Z /N Z being periodized permutations that differ by a constant is expressible, as can be seen from Lemma 4.22 after lifting Example 4.9 twice and taking conjunctions of those lifts with Example 4.12. Again, this property is not aperiodic, and so does not complete the proof of Theorem 4.16.

5.1. Expressing linear constraints. One basic property that we will add to our library is the ability to express linear constraints (up to constants) between [different functions](https://arxiv.org/abs/1608.07167) [α](https://arxiv.org/abs/1608.07167) [w](https://arxiv.org/abs/1608.07167) , which significantly generalizes Example 4.12. The basic relation is

Proposition 5.3 [(Expressing constancy modulo a subgroup)](https://doi.org/10.1093/imrn/rnad048) [.](https://doi.org/10.1093/imrn/rnad048) Let G be a finitely

′

generated abelian group, let H be a finite abelian group, and let H be a subgroup of H . Then the ( G, H ) -property of a ( G, H ) -function α taking values in a single

′ ′ ′

coset c + H of H (i.e., there exists c ∈ H such that α ( x ) ∈ c + H for all x ∈ G ) is expressible.

Proof. [Let](https://doi.org/10.1007/s00454-022-00426-4) [e](https://doi.org/10.1007/s00454-022-00426-4) [, . . . , e](https://doi.org/10.1007/s00454-022-00426-4) [d](https://doi.org/10.1007/s00454-022-00426-4) [be a set of generators for](https://doi.org/10.1007/s00454-022-00426-4) G . Similarly to Example 4.12, we consider the functional equation

[′](https://arxiv.org/abs/2209.08451) ′

( α ( x ) + H ) ⊎ ( α ( x + e i ) + ( H \ H )) = H

for all [i](https://arxiv.org/abs/2309.09504) [= 1](https://arxiv.org/abs/2309.09504) [, . . . , d](https://arxiv.org/abs/2309.09504) [and](https://arxiv.org/abs/2309.09504) [x](https://arxiv.org/abs/2309.09504) [∈](https://arxiv.org/abs/2309.09504) [G](https://arxiv.org/abs/2309.09504) , and some unknown function α : G → H . This equation can be equivalently expressed as

′

α ( x ) = α ( x + e i ) (mod H ) ,

′

that is to say α ( x ) and α ( x + e i ) lie in the same coset of H . Since the e i generate

′

G , this is equivalent to α lying in a single coset of H , as claimed. □

We isolate two useful corollaries of this proposition:

Corollary 5.4 (Expressing periodicity) . Let G be a finitely generated abelian

′

### group, let H be a finite abelian group, and let G [be a subgroup of](https://doi.org/10.1007/s10801-023-01233-7) [G](https://doi.org/10.1007/s10801-023-01233-7) [.](https://doi.org/10.1007/s10801-023-01233-7) [Then the](https://doi.org/10.1007/s10801-023-01233-7)

′

( G, H ) -property that a ( G, H ) -function α is G -periodic in the sense that α ( x + h ) =

′

α ( x ) for all x ∈ G and h ∈ G , is expressible.

′ ′

Proof. From Proposition 5.3 with G replaced by G and H replaced by { } , we

′ ′

see that the ( G , H ) property of being a constant ( G , H )-function is expressible.

′

Pulling back from ( G , H ) to ( G, H ) using Lemma 4.22(ii), we obtain the claim. □

Corollary 5.5 (Expressing linear constraints) . Let G be a finitely generated abelian group, let Z /N Z be a cyclic group, and let c , . . . , c W ∈ Z /N Z be coefficients. Then the ( G, ( Z /N Z ) w =1 ,...,W ) -property of a tuple α , . . . , α W : G → Z /N Z of functions obeying the linear relation

c α ( x ) + · · · + c W α W ( x ) = c (5.1)

for all x ∈ G and some constant c ∈ Z /N Z , is expressible.

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

W

Proof. We can view ( α w ) w =1 ,...,W as a single ( G, ( Z /N Z ) )-function. The linear relation (5.1) is then equivalent to this function lying in a single coset of the group

′ W

[H](https://tilings.math.uni-bielefeld.de/) [:=](https://tilings.math.uni-bielefeld.de/) { ( a , . . . , a W ) ∈ ( Z /N Z ) : c a + · · · + c w a w = 0 } .

The claim now follows from Proposition 5.3. □

Remark 5.6. Note that Example 4.12 is essentially the special case of Corollary 5.5 with W = 2, c = 1, and c = − 1. The presence of the constant c in (5.1) is unfortunately necessary due to the translation invariance mentioned in Remark 4.11. We remark that a variant of Corollary 5.5 (in which one did not tile the whole group, and was thus able to set c to zero) was implicitly used in our previous work [GT21, § 6].

Example 5.7. Let Z /N Z be a cyclic group, and consider the ( Z , ( Z /N Z ) w =1 , , )- property of a triple of functions α , α , α : Z → Z /N Z obeying the properties

α ( x, y ) = α ( x + 1 , y )

α ( x, y ) = α ( x, y + 1)

α ( x, y ) = α ( x + 1 , y − 1)

[α](https://arxiv.org/abs/2305.14028) [(](https://arxiv.org/abs/2305.14028) [x, y](https://arxiv.org/abs/2305.14028) [) +](https://arxiv.org/abs/2305.14028) [α](https://arxiv.org/abs/2305.14028) [(](https://arxiv.org/abs/2305.14028) [x, y](https://arxiv.org/abs/2305.14028) [) =](https://arxiv.org/abs/2305.14028) α ( x, y )

for all ( x, y ) ∈ Z , namely, α , α , α are periodic along the directions (1 , 0) , (0 , 1) , (1 , − 1) respectively, and that α + α = α . Thus, this property is expressible. It is [not difficult to show that the solutions to this system of equations are given by](https://doi.org/10.1007/s00454-022-00426-4) α ( x, y ) = ϕ ( y ) + c , [α](https://arxiv.org/abs/2305.17743) [(](https://arxiv.org/abs/2305.17743) [x, y](https://arxiv.org/abs/2305.17743) [) =](https://arxiv.org/abs/2305.17743) [ϕ](https://arxiv.org/abs/2305.17743) [(](https://arxiv.org/abs/2305.17743) [x](https://arxiv.org/abs/2305.17743) [) +](https://arxiv.org/abs/2305.17743) [c](https://arxiv.org/abs/2305.17743) [,](https://arxiv.org/abs/2305.17743) [α](https://arxiv.org/abs/2305.17743) [(](https://arxiv.org/abs/2305.17743) [x, y](https://arxiv.org/abs/2305.17743) ) = ϕ ( x + y ) + c for some [homomorphism](https://arxiv.org/abs/2209.08451) [ϕ](https://arxiv.org/abs/2209.08451) [:](https://arxiv.org/abs/2209.08451) [Z](https://arxiv.org/abs/2209.08451) [→](https://arxiv.org/abs/2209.08451) [Z](https://arxiv.org/abs/2209.08451) [/N](https://arxiv.org/abs/2209.08451) [Z](https://arxiv.org/abs/2209.08451) and some constants c , c , c ∈ Z /N Z . Thus the property of α , α , α taking this form is expressible. Applying existential quantifi- [cation to eliminate the role of](https://arxiv.org/abs/2309.09504) [α](https://arxiv.org/abs/2309.09504) [, α](https://arxiv.org/abs/2309.09504) , we conclude that the ( Z , Z /N Z )-property of a function α : Z → Z /N Z taking the form α ( x, y ) = f ( y ) for some affine function f : Z → Z /N Z (i.e., the sum of a homomorphism and a constant), is weakly expressible. This is our first example of a property which is weakly expressible, but which is not obviously expressible.

## 6. Expressing boolean functions

Thus far we have been considering properties of functions α w : G → H w which can range over the entirety of a finite abelian group H w . In order to be able to express boolean operations (as in [GT21, § 5]), we will need to start expressing properties of functions that take on only two values { a, b } in a larger ambient

M

group H w (which we will take to be a cyclic 2-group Z / Z ). To do this, we introduce the following definition.

Definition 6.1 (Boolean function) . Let G be a finitely generated abelian group,

M

let e be an element of G of order 2, let Z / Z be a cyclic 2-group for some M ⩾ 1,

M

and let a, b be distinct elements of Z / Z of opposite parity (thus one of the a, b

M

is even and the other is odd). A function α : G → Z / Z is ( e, { a, b } ) -boolean if it takes values in { a, b } , and furthermore obeys the alternating property

α ( x + e ) = a + b − α ( x ) (6.1)

for all x ∈ G ; i.e., for each x ∈ G , α ( x ) takes one of the values a, b , and α ( x + e ) takes the other value. In particular, { a, b } is equal to the image α ( G ) of α .

′ ′

A ( e, { a, b } )-boolean function α is said to be compatible with a ( e, { a , b } )-

′ ′ ′

boolean function α if { a , b } is a translate of { a, b } , or equivalently if the image

′ ′

α ( G ) of α is a translate of the image α ( G ) of α .

M

We restrict to 2-groups Z / Z here because in later arguments it will be important to exploit the fact that all odd elements of such groups are invertible (with respect to the usual ring structure on cyclic groups), and in particular have order

M

equal to the order of the group. This will also be the main reason why we will work with “2-adic Sudoku puzzles” in later sections, as opposed to Sudoku puzzles in odd characteristic which are slightly easier to analyze.

Proposition 6.2 (Expressing a single boolean function) . Let G be a finitely gen-

M

erated abelian group, let e be an element of G of order two, and let Z / Z be a

M

cyclic -group for some M ⩾ . Then the ( G, Z / Z ) -property of being ( e, { a, b } ) -

M

boolean for some distinct a, b ∈ Z / Z of opposite parity, is expressible.

M

Proof. [Let](https://arxiv.org/abs/1608.07167) [e](https://arxiv.org/abs/1608.07167) [, . . . , e](https://arxiv.org/abs/1608.07167) [r](https://arxiv.org/abs/1608.07167) [be a set of generators for](https://arxiv.org/abs/1608.07167) G , and consider the ( G, Z / Z )-

M

property of a function α : G → Z / Z obeying the functional equation

M   M  M

α ( x ) + 2 Z / [Z](https://doi.org/10.1093/imrn/rnad048) [⊎](https://doi.org/10.1093/imrn/rnad048) [α](https://doi.org/10.1093/imrn/rnad048) [(](https://doi.org/10.1093/imrn/rnad048) [x](https://doi.org/10.1093/imrn/rnad048) [+](https://doi.org/10.1093/imrn/rnad048) [e](https://doi.org/10.1093/imrn/rnad048) [) + 2](https://doi.org/10.1093/imrn/rnad048) [Z](https://doi.org/10.1093/imrn/rnad048) [/](https://doi.org/10.1093/imrn/rnad048) [Z](https://doi.org/10.1093/imrn/rnad048) [=](https://doi.org/10.1093/imrn/rnad048) [Z](https://doi.org/10.1093/imrn/rnad048) [/](https://doi.org/10.1093/imrn/rnad048) Z (6.2)

for all x ∈ G [, as well as the equations](https://arxiv.org/abs/2305.14028) ]

M  M

( α ( y + e i ) + { } ) ⊎ ( α ( y ) + (2 Z / Z \{ } )) = Z / Z (6.3)

y = x,x + e

for all x ∈ G [and](https://arxiv.org/abs/2303.10798) [i](https://arxiv.org/abs/2303.10798) [= 1](https://arxiv.org/abs/2303.10798) [, . . . , r](https://arxiv.org/abs/2303.10798) [.](https://arxiv.org/abs/2303.10798)

M

[Suppose that](https://doi.org/10.1007/s00454-022-00426-4) [α](https://doi.org/10.1007/s00454-022-00426-4) [obeys this system (6.2), (6.3). Since 2](https://doi.org/10.1007/s00454-022-00426-4) Z / Z is an index two

M

subgroup of Z / Z [, we see that for each](https://arxiv.org/abs/2305.17743) [x](https://arxiv.org/abs/2305.17743) [, the pair (](https://arxiv.org/abs/2305.17743) α ( x ) , α ( x + e )) must consist [of an even element](https://arxiv.org/abs/2209.08451) [a](https://arxiv.org/abs/2209.08451) [(](https://arxiv.org/abs/2209.08451) [x](https://arxiv.org/abs/2209.08451) [) and an odd element](https://arxiv.org/abs/2209.08451) b ( x ) of Z / q Z . On the other hand, [from comparing (6.3) with (6.2) we have for each](https://arxiv.org/abs/2309.09504) x ∈ G and i = 1 , . . . , r that

( α ( x ) + { } ) ⊎ ( α ( x + e ) + { } ) = ( α ( x + e i ) + { } ) ⊎ ( α ( x + e + e i ) + { } )

or equivalently that a ( x ) = a ( x + e i ) and b ( x ) = b ( x + e i ). Since the e , . . . , e r

generate G , we conclude that a ( x ) = a , b ( x ) = b are constant in x , and α is ( e, { a, b } )-boolean. Conversely, if α is ( e, { a, b } )-boolean, we can reverse the above arguments and conclude the functional equations (6.2), (6.3). The claim follows. □

Let G be a finitely generated abelian group, let e be an element G of order two, let Z / q Z be a cyclic group of even order, and let W ⩾ 1. By the above proposition and Lemma 4.22, one can express the ( [G,](https://doi.org/10.1007/s10801-023-01233-7) [(](https://doi.org/10.1007/s10801-023-01233-7) [Z](https://doi.org/10.1007/s10801-023-01233-7) [/](https://doi.org/10.1007/s10801-023-01233-7) [q](https://doi.org/10.1007/s10801-023-01233-7) [Z](https://doi.org/10.1007/s10801-023-01233-7) [)](https://doi.org/10.1007/s10801-023-01233-7) [w](https://doi.org/10.1007/s10801-023-01233-7) [=1](https://doi.org/10.1007/s10801-023-01233-7) [,...,W](https://doi.org/10.1007/s10801-023-01233-7) [)-property of](https://doi.org/10.1007/s10801-023-01233-7) a tuple α , . . . , α W : G → Z / q Z of functions being such that each α i is ( e, { a i , b i } )- periodic for some a i , b i ∈ Z / q Z of different parity. However, this property does not force the boolean functions to be compatible; in other words, it does not require that the { a i , b i } are translates of each other. This is a new difficulty that was not present in our previous work [GT21], where we could enforce this compatibility by only tiling a subset of H rather than the full group H . In our context, the desired compatibility will be achieved with the assistance of the following elementary lemma.

M

Lemma 6.3 (An equation to force boolean compatibility) . Let Z / Z be a cyclic

′ ′ ′′ ′′

- group for some M ⩾ , and let { a, b } , { c, d } , { f, g } , { h , k } , { h , k } be pairs of

M M

elements of Z / Z of different parity. Let z ∈ Z / Z be such that

′ ′ ′′ ′′

( a + b ) + ( h + k ) + ( h + k ) = 2( c + d ) + ( f + g ) + 2 z. (6.4)

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

′ ′ ′ ′′ ′′

Suppose also that for any triple ( α, τ, τ ) ∈ { a, b } × { h , k } × { h , k } there exists ( β, γ ) ∈ { c, d } × { f, g } solving the equation

′

α + τ + τ = 2 β + γ + z. (6.5)

′ ′ ′′ ′′

Then the sets { a, b } , { h , k } , { h , k } are translates of each other.

′ ′ ′′ ′′

Proof. Observe that we can translate any of the pairs { a, b } , { h , k } , { h , k } by

M

some shift in Z / Z , so long as we also shift z by the same shift. So we may

′ ′′

normalize a = h = h = 0. By (6.5) we may then find ( β, γ ) ∈ { c, d } × { f, g } such that 0 = 2 β + γ + z . By shifting { c, d } by − β , { f, g } by − γ , and replacing z with 0, we may thus also normalize β = γ = z = 0, so without loss of generality c = f = z = 0. Thus we now have

′ ′′

b + k + k = 2 d + g (6.6)

′ ′ ′′

and for any triple ( α, τ, τ ) ∈ { , b } × { , k } × { , k } there exists ( β, γ ) ∈ { , d } × { , g } [such that](https://arxiv.org/abs/1608.07167)

′

α + τ + τ = 2 β + γ. In particular

[′](https://doi.org/10.1093/imrn/rnad048) [′′](https://doi.org/10.1093/imrn/rnad048)

```
b, k , k ∈ { , d, g, g + 2 d } .
```

[′](https://arxiv.org/abs/2305.14028) ′′

By the hypothesis of distinct parities, b, k , k , d, g are all odd. Thus in fact we must have

′ ′′

```
b, k , k ∈ { g, g + 2 d } .
```

′ ′′ [′](https://arxiv.org/abs/2303.10798) [′′](https://arxiv.org/abs/2303.10798)

If b = k = k [then](https://arxiv.org/abs/2303.10798) [{](https://arxiv.org/abs/2303.10798) [, b](https://arxiv.org/abs/2303.10798) [}](https://arxiv.org/abs/2303.10798) [,](https://arxiv.org/abs/2303.10798) [{](https://arxiv.org/abs/2303.10798) [, k](https://arxiv.org/abs/2303.10798) [}](https://arxiv.org/abs/2303.10798) [,](https://arxiv.org/abs/2303.10798) [{](https://arxiv.org/abs/2303.10798) [, k](https://arxiv.org/abs/2303.10798) [}](https://arxiv.org/abs/2303.10798) are translates of each other as desired. [There are only two remaining cases:](https://doi.org/10.1007/s00454-022-00426-4)

[′](https://arxiv.org/abs/2305.17743) [′′](https://arxiv.org/abs/2305.17743)

1. [1. If two of the](https://arxiv.org/abs/2209.08451) [b, k](https://arxiv.org/abs/2209.08451) [, k](https://arxiv.org/abs/2209.08451) [are equal to](https://arxiv.org/abs/2209.08451) g and the third is equal to g + 2 d , then from (6.6) we have 3 g + 2 d = 2 d + g , which is absurd since g is odd and [M](https://arxiv.org/abs/2309.09504) [⩾](https://arxiv.org/abs/2309.09504) [2.](https://arxiv.org/abs/2309.09504)

′ ′′

2. If one of the b, k , k is equal to g and the other two are equal to g + 2 d , then from (6.6) we have 3 g +4 d = 2 d + g , so in particular g +2 d = − g and so { , g }

′ ′′

and { , g + 2 d } are translates of each other. Thus { , b } , { , k } , { , k } are translates of each other as desired. □

Definition 6.4 (Compatible boolean property) . Let G be a finitely generated

′ ′′

abelian group, let e, e , e be elements of G that generate a copy of ( Z / Z ) (so

′ ′′ M

that e, e , e are of order 2 and linearly independent over Z / Z ), let Z / Z be a cyclic 2-group for some M ⩾ 2, and let W ⩾ 1. We say that a tuple ( α w ) w =1 ,...,W of

M

functions α , . . . , α W : G → Z / Z obeys the compatible boolean property P (with

′ ′′ ′ ′′ ′ ′′

parameters e, e , e ) if each α i is ⟨ e , e ⟩ -periodic (thus α i ( x + e ) = α i ( x + e ) =

M

α i ( x ) for all x ∈ G ) and ( e, { a i , b i } )-boolean for some a i , b i ∈ Z / Z of different parity, and additionally that the α i are compatible (i.e., the { a i , b i } are translates of each other).

We can exploit Lemma 6.3 as follows.

Proposition 6.5 (Expressing multiple compatible boolean functions) . The com-

M

patible boolean property P is a weakly expressible ( G, ( Z / Z ) w =1 ,...,W ) -property.

Proof. For sake of notation we just demonstrate this for W = 2; the general case is similar, and in any event follows from the W = 2 case by applying Lemma 4.22 in a similar spirit to Example 4.18.

M

Let α , α : G → Z / Z be functions. We introduce some auxiliary functions

′ ′′ M

β , β , γ , γ , τ , τ : G → Z / Z .

M ∗

[Consider the (](https://tilings.math.uni-bielefeld.de/) [G,](https://tilings.math.uni-bielefeld.de/) [(](https://tilings.math.uni-bielefeld.de/) Z / Z ) w =1 ,..., )-property P that the tuple ( α , α , β , β , γ , γ , τ ) obeys the following properties for i = 1 , 2:

[′](https://arxiv.org/abs/2211.07140) [′′](https://arxiv.org/abs/2211.07140) M

(i) [α](https://arxiv.org/abs/2211.07140) [i](https://arxiv.org/abs/2211.07140) [is](https://arxiv.org/abs/2211.07140) [⟨](https://arxiv.org/abs/2211.07140) [e](https://arxiv.org/abs/2211.07140) [, e](https://arxiv.org/abs/2211.07140) [⟩](https://arxiv.org/abs/2211.07140) [-periodic and (](https://arxiv.org/abs/2211.07140) [e,](https://arxiv.org/abs/2211.07140) { a i , b i } )-boolean for some a i , b i ∈ Z / Z of different parity.

M

(ii) β i is ( e, { c i , d i } )-boolean for some c i , d i ∈ Z / Z of different parity.

M

(iii) γ i is ( e, { f i , g i } )-boolean for some f i , g i ∈ Z / Z of different parity.

′ ′ ′′ ′ ′ ′ ′ M

(iv) τ is ⟨ e + e , e ⟩ -periodic and ( e, { h , k } )-boolean for some h , k ∈ Z / Z of different parity.

′′ ′ ′′ ′′ ′′ ′′ ′′ M

(v) τ is ⟨ e , e + e ⟩ -periodic and ( e, { h , k } )-boolean for some h , k ∈ Z / Z of different parity.

M ′ ′′

(vi) There is a constant z i ∈ Z / Z such that α i ( x ) + τ ( x ) + τ ( x ) = 2 β i ( x ) + [γ](https://arxiv.org/abs/1608.07167) [i](https://arxiv.org/abs/1608.07167) [(](https://arxiv.org/abs/1608.07167) [x](https://arxiv.org/abs/1608.07167) [) +](https://arxiv.org/abs/1608.07167) [z](https://arxiv.org/abs/1608.07167) [i](https://arxiv.org/abs/1608.07167) [for all](https://arxiv.org/abs/1608.07167) [x](https://arxiv.org/abs/1608.07167) [∈](https://arxiv.org/abs/1608.07167) [G](https://arxiv.org/abs/1608.07167) [.](https://arxiv.org/abs/1608.07167) From several applications of Corollary 5.4, Corollary 5.5, Proposition 6.2, and

∗

Lemma 4.22 we already know that [P](https://doi.org/10.1093/imrn/rnad048) [is expressible.](https://doi.org/10.1093/imrn/rnad048) To conclude the proposition, it suffices to show that the compatible boolean property P is the existential

∗

quantification of [P](https://arxiv.org/abs/2305.14028) [.](https://arxiv.org/abs/2305.14028) We first show that any pair ( α , α ) obeying the compatible boolean property

′ ∗

P can be lifted to a octuplet ( α , α , β , β , γ , γ , τ, τ ) obeying P . By hypothe-

′ ′′

sis and Definition 6.4, each α i is already ⟨ e , e ⟩ -periodic and ( e, { a i , b i } )-boolean,

[M](https://arxiv.org/abs/2303.10798)

where [a](https://doi.org/10.1007/s00454-022-00426-4) [i](https://doi.org/10.1007/s00454-022-00426-4) [, b](https://doi.org/10.1007/s00454-022-00426-4) [i](https://doi.org/10.1007/s00454-022-00426-4) [∈](https://doi.org/10.1007/s00454-022-00426-4) [Z](https://doi.org/10.1007/s00454-022-00426-4) [/](https://doi.org/10.1007/s00454-022-00426-4) [Z](https://doi.org/10.1007/s00454-022-00426-4) [are of different parity and with](https://doi.org/10.1007/s00454-022-00426-4) α , α compatible. By apply- [ing independent translations to the compatible boolean functions](https://arxiv.org/abs/2305.17743) α , α (which we [can do by Remark 4.11), we may normalize](https://arxiv.org/abs/2209.08451) { a , b } = { a , b } = { , b } for some

[M](https://arxiv.org/abs/2209.08451) [′](https://arxiv.org/abs/2209.08451) ′ ′′

odd b ∈ Z / Z . Next, let τ be an arbitrary ⟨ e + e , e ⟩ -periodic and ( e, { , b } )- boolean function; such a function can be constructed by arbitrarily partitioning

′ ′′

G into cosets x + ⟨ e, e , e ⟩ with a marked point x and then setting

′ ′′

τ ( x + re + se + te ) = b r = s

′′

on each such coset for r, s, t ∈ Z / Z . Similarly we can let τ be an arbitrary

′ ′′

⟨ e , e + e ⟩ -periodic and ( e, { , b } )-boolean function. For each i = 1 , 2, the function

′ ′′

α i + τ + τ then takes values in { , b, b, b } , and obeys the alternating property

′ ′′ ′ ′′

( α i + τ + τ )( x + e ) = 3 b − ( α i + τ + τ )( x )

for all x ∈ G . Note also that the quantities 0 , b, b, b are all distinct since b is odd and M ⩾ 2. By binary expansion, we may thus decompose

′ ′′

( α i + τ + τ )( x ) = 2 β i ( x ) + γ i ( x )

for some unique functions β i , γ i : G → { , b } . It is easy to verify that these func-

′

tions are ( e, { , b } )-boolean, and so the octuplet ( α , α , β , β , γ , γ , τ, τ ) obeys

∗

P as required (with z i = 0 in (vi)).

′

Conversely, suppose that we have an octuplet ( α , α , β , β , γ , γ , τ, τ ) obeying

∗

property P . Applying (vi) to x and x + e and summing, we have X X

′ ′′

( α i ( y ) + τ ( y ) + τ ( y )) = (2 β i ( y ) + γ i ( y )) + 2 z i

```
y = x,x + e y = x,x + e
```

′

for any x ∈ G and i = 1 , 2. Using the boolean nature of the functions α , α , β , β , γ , γ , τ, τ in the direction e , we conclude that

′ ′ ′′ ′′

( a i + b i ) + ( h + k ) + ( h + k ) = 2( c i + d i ) + ( f i + g i ) + 2 z i

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

for i = 1 , 2.

′ ′′

Let i = 1 , 2. By (i), (iv), (v), we see that for any x ∈ G , the triple ( α i ( x ) , τ ( x ) , τ ( x ))

′ ′ [′′](https://tilings.math.uni-bielefeld.de/) [′′](https://tilings.math.uni-bielefeld.de/)

takes values in the eight-element set { a i , b i } × { h , k } × { h [, k](https://tilings.math.uni-bielefeld.de/) [}](https://tilings.math.uni-bielefeld.de/) [.](https://tilings.math.uni-bielefeld.de/) [Furthermore,](https://tilings.math.uni-bielefeld.de/)

[′](https://tilings.math.uni-bielefeld.de/) ′ ′′ ′′

shifting [x](https://tilings.math.uni-bielefeld.de/) [by](https://tilings.math.uni-bielefeld.de/) [e](https://tilings.math.uni-bielefeld.de/) changes the value of τ ( x ) but not α ( x ) , τ ( x ); shifting x by e

′′ ′ ′ ′′

changes the value of τ ( x ) but not α ( x ) , τ ( x ); and shifting x by e + e + e

′ ′′

changes the value of α i ( x ) but not τ ( x ) , τ ( x ). We conclude that all eight of

′ ′ ′′ ′′

the elements of { a i , b i } × { h , k } × { h , k } are actually representable in the form

′ ′′

( α i ( x ) , τ ( x ) , τ ( x )) for some x ∈ G . By (vi), we conclude that every element

′ ′ ′ ′′ ′′ ′

( α i , τ, τ ) of { a i , b i }×{ h , k }×{ h , k } has a representation α i + τ + τ = 2 β i + γ i + z i

for some ( β i , γ i ) ∈ { c i , d i } × { f i , g i } . We can now apply Lemma 6.3 to conclude

′ ′ ′′ ′′

that { a i , b i } , { h , k } , { h , k } must be translates of each other. Thus, both α , α

′ ′′

are compatible with the τ , τ . By transitivity, this implies that α is compatible with α , and hence the compatible boolean property P holds as required. □

′ ′′ M

Let [G, M, e, e](https://arxiv.org/abs/1608.07167) [, e](https://arxiv.org/abs/1608.07167) be as in the above proposition. If α , . . . , α W : G → Z / Z obey the compatible boolean property, then (after permuting a i , b i as necessary)

′ ′′ M

each α i is ⟨ e , e ⟩ -invariant and is ( e, { a i , a i + b } )-boolean for some a i ∈ Z / Z and some odd b independent of [i](https://doi.org/10.1093/imrn/rnad048) [. Thus we have representations](https://doi.org/10.1093/imrn/rnad048)

[α](https://arxiv.org/abs/2305.14028) [i](https://arxiv.org/abs/2305.14028) [(](https://arxiv.org/abs/2305.14028) [x](https://arxiv.org/abs/2305.14028) [) =](https://arxiv.org/abs/2305.14028) [a](https://arxiv.org/abs/2305.14028) [i](https://arxiv.org/abs/2305.14028) [+](https://arxiv.org/abs/2305.14028) b α ˜ i ( x ) (6.7)

for all x ∈ G and i = 1 , . . . , W , where the normalized boolean functions ˜ α i : G →

M ′ ′′

Z / Z are ⟨ e , e ⟩ -invariant and ( e, { , } )-boolean. Note that the a i , b are only [unique up to the reflection symmetry](https://arxiv.org/abs/2303.10798)

[(](https://doi.org/10.1007/s00454-022-00426-4) [a](https://doi.org/10.1007/s00454-022-00426-4) [, . . . , a](https://doi.org/10.1007/s00454-022-00426-4) [W](https://doi.org/10.1007/s00454-022-00426-4) [, b](https://doi.org/10.1007/s00454-022-00426-4) [)](https://doi.org/10.1007/s00454-022-00426-4) [→](https://doi.org/10.1007/s00454-022-00426-4) [(](https://doi.org/10.1007/s00454-022-00426-4) [a](https://doi.org/10.1007/s00454-022-00426-4) [+](https://doi.org/10.1007/s00454-022-00426-4) b, . . . , a W + b, − b )

[that effectively replaces the normalized boolean functions ˜](https://arxiv.org/abs/2209.08451) α i with their reflections − α ˜ i .

W

Definition 6.6 (Property P Ω ) . Let Ω be a subset of { , } which is symmetric with respect to the reflection

( y , . . . , y W ) → (1 − y , . . . , − y W ) .

M

We say that a ( G, ( Z / Z ) w =1 ,...,W )-function ( α , . . . , α W ) obeys property P Ω if it obeys the compatible boolean property P , and furthermore that the normalized functions ˜ α , . . . , α ˜ W obey the boolean constraint

(˜ α ( x ) , . . . , α ˜ W ( x )) ∈ Ω

for all x ∈ G .

Note that from the symmetry hypothesis, it does not matter which of the two available normalizations ˜ α i of the α i are used here. Importantly, such relations are weakly expressible when M is large enough:

Proposition 6.7 (Expressing symmetric boolean constraints) . Let G be a finitely

′ ′′

### generated abelian group, let e, e , e be elements of G that generate a copy of

M

( Z / Z ) , let Z / Z be a cyclic -group for some M ⩾ , and let W ⩾ . Let Ω be

W M M

a symmetric subset of { , } . If > W + 4 , then the ( G, ( Z / Z ) w =1 ,...,W ) - property P Ω is weakly expressible.

Proof. This will be a variant of the arguments in [GT21, § 6]. By increasing W by

M M

one or two if necessary (and relaxing 2 > W + 4 to 2 > W ) using Lemma 4.22(iv), we may assume without loss of generality that W is odd with W ⩾ 3.

The symmetric set Ω can be expressed as the intersection of a finite number of symmetric sets of the form

W

{ , } \{ ( ϵ , . . . , ϵ W ) , (1 − ϵ , . . . , − ϵ W ) } (6.8)

for some ϵ , . . . , ϵ W ∈ { , } . By Lemma 4.22(iii), it thus suffices to verify the [claim for Ω of the form (6.8).](https://arxiv.org/abs/2211.07140)

M ∗

We introduce some auxiliary functions β , . . . , β W − : G → Z / Z , and let P Ω M

be the ( G, ( Z / Z ) w =1 ,..., W − )-property that a tuple ( α , . . . , α W , β , . . . , β W − )

M

of functions from G to Z / Z obey the following properties: (i) ( α , . . . , α W , β , . . . , β W − ) obeys the compatible boolean property P (with W replaced by 2 W − 2);

M

(ii) There is a constant z ∈ Z / Z such that

ϵ ϵ W

( − 1) α ( x ) + · · · + ( − 1) α W ( x ) = β ( x ) + · · · + β W − ( x ) + z

[for all](https://arxiv.org/abs/1608.07167) [x](https://arxiv.org/abs/1608.07167) [∈](https://arxiv.org/abs/1608.07167) [G](https://arxiv.org/abs/1608.07167) [.](https://arxiv.org/abs/1608.07167)

∗

From Proposition 6.5, Corollary 5.5, and Lemma 4.22, the property P Ω

is weakly [expressible. By Lemma 4.22(iv), it thus suffices to show that](https://doi.org/10.1093/imrn/rnad048) [P](https://doi.org/10.1093/imrn/rnad048) Ω is the existential

∗

quantification of P Ω

## . [We first show that any tuple (](https://arxiv.org/abs/2305.14028) [α](https://arxiv.org/abs/2305.14028) [, . . . , α](https://arxiv.org/abs/2305.14028) W ) obeying P Ω can be extended to a

∗

tuple ( α , . . . , α W , β , . . . , β W − ) obeying P Ω

## . By hypothesis, we can write the α i M

in the form (6.7) for some a i , b ∈ Z / Z with b odd, and some ( e, { , } )-boolean

′ ′′

and ⟨ e , e ⟩ -periodic functions ˜ α , . . . , α ˜ W : G → { , } . In particular

[ϵ](https://arxiv.org/abs/2303.10798) [ϵ](https://arxiv.org/abs/2303.10798) [W](https://doi.org/10.1007/s00454-022-00426-4)

[(](https://doi.org/10.1007/s00454-022-00426-4) [−](https://doi.org/10.1007/s00454-022-00426-4) [1)](https://doi.org/10.1007/s00454-022-00426-4) [α](https://doi.org/10.1007/s00454-022-00426-4) [+](https://doi.org/10.1007/s00454-022-00426-4) [· · ·](https://doi.org/10.1007/s00454-022-00426-4) [+ (](https://doi.org/10.1007/s00454-022-00426-4) [−](https://doi.org/10.1007/s00454-022-00426-4) [1)](https://doi.org/10.1007/s00454-022-00426-4) [α](https://doi.org/10.1007/s00454-022-00426-4) [W](https://doi.org/10.1007/s00454-022-00426-4) [=](https://doi.org/10.1007/s00454-022-00426-4) [b](https://doi.org/10.1007/s00454-022-00426-4) (˜ α ,ϵ + · · · + ˜ α W,ϵ W

) + z

[M](https://arxiv.org/abs/2305.17743)

[for some constant](https://arxiv.org/abs/2209.08451) [z](https://arxiv.org/abs/2209.08451) [∈](https://arxiv.org/abs/2209.08451) [Z](https://arxiv.org/abs/2209.08451) [/](https://arxiv.org/abs/2209.08451) [Z](https://arxiv.org/abs/2209.08451) , where ˜ α i,ϵ i

: G → { , } is the ( e, { , } )-boolean

′ [′′](https://arxiv.org/abs/2209.08451)

and ⟨ e , e ⟩ -periodic function R ϵ i

(˜ α i ), where for a = 0 ,

a

R a ( x ) := a + ( − 1) x, x ∈ G. (6.9)

By the choice (6.8) of Ω, we see that for every x , the tuple (˜ α ,ϵ ( x ) , . . . , α ˜ W,ϵ W

( x ))

W

is an element of the cube { , } that avoids both (0 , . . . , 0) and (1 , . . . , 1). In particular, we have α ˜ ,ϵ ( x ) + · · · + ˜ α W,ϵ W

( x ) = bf ( x ) for some f ( x ) ∈ { , . . . , W − } , which is well-defined since the odd element b

M M ′ ′′

of Z / Z has order 2 > W ; note that f is ⟨ e , e ⟩ -periodic and obeys the alternating property f ( x + e ) = W − f ( x ) for all x ∈ G . We can therefore write

b (˜ α ,ϵ ( x ) + · · · + ˜ α W,ϵ W

( x )) = β ( x ) + [· · ·](https://doi.org/10.1007/s10801-023-01233-7) [+](https://doi.org/10.1007/s10801-023-01233-7) [β](https://doi.org/10.1007/s10801-023-01233-7) [W](https://doi.org/10.1007/s10801-023-01233-7) [−](https://doi.org/10.1007/s10801-023-01233-7) [(](https://doi.org/10.1007/s10801-023-01233-7) [x](https://doi.org/10.1007/s10801-023-01233-7) [) +](https://doi.org/10.1007/s10801-023-01233-7) [b](https://doi.org/10.1007/s10801-023-01233-7)

for all x ∈ G , where β i ( x ) for i = 1 , . . . , W − 2 is defined by

β i ( x ) := b i<f ( x )

if f ( x ) < W/ 2 and β i ( x ) := b i ⩾ W − f ( x )

if f ( x ) > W/ 2. The reason for this rather complicated choice of β i is so that β i ′ ′′

becomes a ( e, { , b } )-boolean and ⟨ e , e ⟩ -invariant function (in particular one has

This number, while finite, could be very large (exponentially large in W ). This exponential growth will cause the dimension d in Theorem 1.4 to be enormous, as one has to perform the conjunction of exponentially many expressible properties. A substantially more efficient approach will be needed here if one wishes to obtain a more reasonable value for the dimension d .

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

β i ( x + e ) = b − β i ( x ) for all x ∈ G ). It is then a routine matter to verify that ( α , . . . , α W , β , . . . , β W − ) obeys property P Ω as required.

[∗](https://tilings.math.uni-bielefeld.de/)

Conversely, suppose that ( α , . . . , α W , β , . . . , β W − [) obeys the property](https://tilings.math.uni-bielefeld.de/) [P](https://tilings.math.uni-bielefeld.de/) [Ω](https://tilings.math.uni-bielefeld.de/)

## [. By](https://tilings.math.uni-bielefeld.de/) [property (i), we may write](https://tilings.math.uni-bielefeld.de/) α i = a i + b α ˜ i and β i = c i + b β ˜

i for some a i , c i , b ∈

M ′ ′′

Z / Z with b odd and some ⟨ e , e ⟩ -invariant and ( e, { , } )-boolean functions α ˜ , . . . , α ˜ W , β [˜](https://arxiv.org/abs/2211.07140) , . . . , β [˜](https://arxiv.org/abs/2211.07140)

W − : G → { , } . Inserting these representations into (ii),

M

we see that there exists a constant z ∈ Z / Z such that

α ˜ ,ϵ ( x ) + · · · + ˜ α W,ϵ W

( x ) =  β ˜ ( x ) + · · · +  β ˜

W − ( x ) + z

for all x ∈ G , where ˜ α i,ϵ i

is defined by R ϵ i

(˜ α i ) and (6.9). Summing over x and x + e and using the ( e, { , } )-boolean nature of the ˜ α i,ϵ i

and  β ˜

i , we conclude that

W = W − 2 + 2 z

[M](https://arxiv.org/abs/1608.07167) [−](https://arxiv.org/abs/1608.07167)

and hence [z](https://arxiv.org/abs/1608.07167) [is equal to 1 or 2](https://arxiv.org/abs/1608.07167) +1. On the other hand, since ˜ α i,ϵ

˜

i

,  β i take values

M M −

in { , } , z must take values in {− W + 2 , . . . , W } modulo 2 . Since 2 > W , we must therefore have z = 1. In particular, ˜ α ,ϵ + · · · + ˜ α W,ϵ W

takes values in { , . . . , W − } , and hence (˜ α ,ϵ , . . . , α ˜ W,ϵ W

) cannot be (0 , . . . , 0) or (1 , . . . , 1). This implies that ( [α](https://arxiv.org/abs/2305.14028) [, . . . , α](https://arxiv.org/abs/2305.14028) [W](https://arxiv.org/abs/2305.14028) [) obeys the property](https://arxiv.org/abs/2305.14028) P Ω , and we are done. □

We need a variant of the above proposition which involves a modification of Example 4.9 that is compatible with the alternating relation (6.1). We again let

′ ′′ M

G, M, e, e , e [be as in Proposition 6.5, and suppose that](https://arxiv.org/abs/2303.10798) α , . . . , α W : G → Z / Z [obey the compatible boolean property](https://doi.org/10.1007/s00454-022-00426-4) [P](https://doi.org/10.1007/s00454-022-00426-4) , so as before we have a representation [(6.7), unique up to reflection symmetry.](https://arxiv.org/abs/2209.08451)

[Definition 6.8](https://arxiv.org/abs/2309.09504) [(Boolean periodized permutation)](https://arxiv.org/abs/2309.09504) . If v ∈ G , we say that a tuple ( α , . . . , α W ) is a boolean periodized permutation along the direction v if it obeys the compatible boolean property P , and for each x ∈ G , the map

j → (˜ α ( x + jv ) , . . . , α ˜ W ( x + jv ))

W W

is a bijection from { , . . . , − } to { , } .

Note that the boolean periodized permutation property is preserved under reflection symmetry and is therefore well-defined. Comparing this claim with the corresponding claim with x replaced by x + v , we see that the boolean periodized permutation property implies in particular that

W W

(˜ α ( x + 2 v ) , . . . , α ˜ W ( x + 2 v )) = (˜ α ( x ) , . . . , α ˜ W ( x ))

W

and hence each of the ˜ α i (or α i ) are ⟨ v ⟩ -periodic.

Proposition 6.9 (Expressing a boolean periodized permutation) . Let G be a

′ ′′

### finitely generated abelian group, let e, e , e be elements of G that generate a copy

M

of ( Z / Z ) , let Z / Z be a cyclic -group for some M ⩾ , let W ⩾ , and let v ∈ G . Then the property of being a boolean periodized permutation along the

M

direction v is a weakly expressible ( G, ( Z / Z ) w =1 ,...,W ) -property.

The simpler clock property from Example 4.8 is unsuitable for this purpose due to its incompatiblity with (6.1), but the reader is encouraged to think of the periodized permutation property as technical substitute for the clock property.

Proof. We can assume that v has order at least W , otherwise the property is impossible to satisfy. We claim that a tuple ( α , . . . , α W ) obeys the boolean periodized permutation property along v if and only if it obeys the compatible boolean property [P](https://tilings.math.uni-bielefeld.de/) and additionally solves the functional equation

W

[]](https://arxiv.org/abs/2211.07140)

[−](https://arxiv.org/abs/2211.07140) M W M W

( α ( x + jv ) , . . . , α W ( x + jv )) + (2 Z / Z ) = ( Z / Z ) (6.10)

j =0

for all x . The equation (6.10) defines an expressible property by definition (the jv are all distinct as v has order at least W ), and so the proposition will follow from ths claim, Proposition 6.5, and Lemma 4.22. It remains to verify the claim. If ( α , . . . , α W ) is a boolean periodized permu-

W

tation along v , then it obeys P , and the 2 tuples

W

(˜ α ( x + jv ) , . . . , α ˜ W ( x + jv )) , j = 0 , . . . , −

[W](https://arxiv.org/abs/1608.07167)

occupy distinct points in { , } . Since α w ( x + jv ) = a i + b α ˜ w ( x + jv ) and b is

W

odd, we conclude that the 2 tuples ( α ( x + jv ) , . . . , α W ( x + jv )) occupy distinct

M W [W](https://doi.org/10.1093/imrn/rnad048)

cosets of (2 Z / Z ) [. Since there are only 2](https://doi.org/10.1093/imrn/rnad048) such cosets, this gives (6.10). The converse implication follows by reversing these steps. □

## 7. Programming a Sudoku puzzle

We now combine the various weakly expressible statements described in the [previous section to reduce matters to demonstrating aperiodicity of a certain type](https://arxiv.org/abs/2303.10798) [of “Sudoku puzzle”. To define this puzzle we need some notation.](https://arxiv.org/abs/2305.17743)

### 7.1. A -adically structured function. We begin the construction of the “Su-

s

[doku puzzle”. We henceforth fix a base](https://arxiv.org/abs/2309.09504) q = 2 , which will be a sufficiently large but constant power of two (for instance s = 10, q = 2 would suffice). In particular, the reader should interpret any exceptional set of (upper) density O (1 /q ) as being negligible in size. We define the digit set Σ to be the finite set

Σ = Σ q := ( Z /q Z ) \{ } .

We need a large width N depending on q ; one convenient choice to take will be

N := q ,

although our arguments would also work mutatis mutandis for larger choices of N . We then define the Sudoku board

B := { , . . . , N } × Z .

Elements ( n, m ) of this board will be referred to as cells . We isolate some collections of cells of relevance to our arguments:

- A column is a set of cells of the form { n } × Z for some 1 ⩽ n ⩽ N .
- A non-vertical line ℓ = ℓ i,j is a set of cells of the form

ℓ i,j := { ( n, jn + i ) : 1 ⩽ n ⩽ N }

for some slope j ∈ Z and intercept i ∈ Z .

- A row is a non-vertical line of slope 0, that is to say a set of cells of the form { , . . . , N } × { m } for some m ∈ Z .
- A diagonal is a non-vertical line of slope 1, that is to say a set of cells of the form { ( n, n + i ) : 1 ⩽ n ⩽ N } for some i ∈ Z .

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

Figure 7.1. A portion of the Sudoku board Ω, with some selected (overlapping) objects: a column (in blue), a row (in purple), a di- [agonal (in gray), an antidiagonal (in red), and a square (in green).](https://doi.org/10.1093/imrn/rnad048)

- An anti-diagonal is a non-vertical line of slope − 1, that is to say a set of cells of the form { ( n, i − n ) : 1 ⩽ n ⩽ N } for some i ∈ Z . • A square [Q](https://arxiv.org/abs/2303.10798) [n](https://arxiv.org/abs/2303.10798) [,m](https://arxiv.org/abs/2303.10798) [is a set of cells of the form](https://arxiv.org/abs/2303.10798)

[Q](https://doi.org/10.1007/s00454-022-00426-4) [n](https://doi.org/10.1007/s00454-022-00426-4) [,m](https://doi.org/10.1007/s00454-022-00426-4) [:=](https://doi.org/10.1007/s00454-022-00426-4) [{](https://doi.org/10.1007/s00454-022-00426-4) [n](https://doi.org/10.1007/s00454-022-00426-4) [, . . . , n](https://doi.org/10.1007/s00454-022-00426-4) [+ 7](https://doi.org/10.1007/s00454-022-00426-4) } × { m , . . . , m + 7 } (7.1)

[for some 1](https://arxiv.org/abs/2209.08451) [⩽](https://arxiv.org/abs/2209.08451) [n](https://arxiv.org/abs/2209.08451) [⩽](https://arxiv.org/abs/2209.08451) [N](https://arxiv.org/abs/2209.08451) [−](https://arxiv.org/abs/2209.08451) [7 and](https://arxiv.org/abs/2209.08451) m ∈ Z .

[See Figure 7.1.](https://arxiv.org/abs/2309.09504) The Sudoku puzzle that we will introduce later will be solved by filling in the cells ( n, m ) of the Sudoku board B with digits F ( n, m ) from Σ that obey certain permutation-like constraints along the lines of this board. This may be compared with a traditional Sudoku puzzle, in which the digit set is { , . . . , } , the board is { , . . . , } , and the constraints are that the digit assignment is a permutation on every row and column of the puzzle, as well as certain 3 × 3 squares in the board, and also agrees with some prescribed initial data on certain cells. We note, however, that while traditional Sudoku puzzles are designed to have a unique solution, the Sudoku puzzle that we will study will have a number of solutions, [though all have a similar 2](https://doi.org/10.1007/s10801-023-01233-7) -adic structure as described below. We now introduce a “basic 2-adically structured function” f q : Z → Σ, defined by the formula

k

f q ( q m ) := m (mod q )

whenever k ⩾ 0 and m is an integer not divisible by q , with the (somewhat arbitrary) convention that f q (0) = 1. In other words, f q ( n ) is the last non-zero digit in the base q expansion of n , or 1 if no such digit exists (see Figure 7.2). We observe the functional equations

f q ( qn ) = f q ( n ) (7.2)

for all n ∈ Z

f q ( n ) = n (mod q ) (7.3)

Figure 7.2. The function f q for q = 2 . The white cells correspond [to](https://arxiv.org/abs/2211.07140) [n](https://arxiv.org/abs/2211.07140) [∈](https://arxiv.org/abs/2211.07140) [Z](https://arxiv.org/abs/2211.07140) [\](https://arxiv.org/abs/2211.07140) [q](https://arxiv.org/abs/2211.07140) [Z](https://arxiv.org/abs/2211.07140) , the gray cells are those with n ∈ q Z \ q Z and, the red ones have n ∈ q Z \ q Z and yellow indicates n = 0. Compare with the example of a limit-periodic pattern in [ST12, Figure 3].

when n is not divisible by q ; indeed, these equations specify f q uniquely except for the value at zero. We also observe the multiplicativity property

f q ( an ) = af q ( n ) (7.4)

whenever a, n ∈ Z with a odd and n non-zero.

[Remark 7.1.](https://arxiv.org/abs/1608.07167) [The function](https://arxiv.org/abs/1608.07167) [f](https://arxiv.org/abs/1608.07167) [q](https://arxiv.org/abs/1608.07167) [:](https://arxiv.org/abs/1608.07167) [Z](https://arxiv.org/abs/1608.07167) [→](https://arxiv.org/abs/1608.07167) Σ q is an example of a limit-periodic function [G89, ST12] (so, in particular, is an almost periodic function in the sense of Besi-

r

covitch [B26]): for any natural number r , f q agrees with a q -periodic function

[r](https://doi.org/10.1093/imrn/rnad048) [r](https://doi.org/10.1093/imrn/rnad048)

outside of a single coset 0 + q [Z](https://doi.org/10.1093/imrn/rnad048) [of](https://doi.org/10.1093/imrn/rnad048) [q](https://doi.org/10.1093/imrn/rnad048) [Z](https://doi.org/10.1093/imrn/rnad048) [, so in particular it agrees with a periodic](https://doi.org/10.1093/imrn/rnad048) [function outside of a set of arbitrarily small upper density in](https://arxiv.org/abs/2305.14028) Z . For s large, this function is also “approximately affine” in the sense that it agrees with the affine map n → n (mod q ) outside of a single coset 0 + q Z of q Z , which one should view as being a relatively small (though still positive density) subset of the integers Z .

[Remark 7.2.](https://doi.org/10.1007/s00454-022-00426-4) [One could extend](https://doi.org/10.1007/s00454-022-00426-4) [f](https://doi.org/10.1007/s00454-022-00426-4) [q](https://doi.org/10.1007/s00454-022-00426-4) [to a function](https://doi.org/10.1007/s00454-022-00426-4) f q : Z → Σ q on the 2-adics

[r](https://doi.org/10.1007/s00454-022-00426-4) r

Z := lim Z [(or equivalently, the](https://arxiv.org/abs/2305.17743) [q](https://arxiv.org/abs/2305.17743) [-adics](https://arxiv.org/abs/2305.17743) [Z](https://arxiv.org/abs/2305.17743) := lim [←](https://arxiv.org/abs/2209.08451) [−](https://arxiv.org/abs/2209.08451) r →∞

Z / q

← − r →∞

Z /q Z ) which is continuous away from the origin (and has a “piecewise affine” structure). As such, we will informally think of the function f q (as well as various rescaled versions of this function) as having “2-adic structure”. However, we will not explicitly use the 2-adic numbers Z in our arguments below, as we did not find that the use of this number system gave any significant simplifications to the argument.

Our Sudoku puzzle is to fill the board B in such a way that every non-vertical line (but not necessarily every column) is a rescaled version of f q . To make this precise we introduce the following class of finite sequences.

Definition 7.3 (A class of 2-adically structured functions) . Let S [ N ] = S q [ N ] denote the set of all functions g : { , . . . , N } → Σ which take the form

g ( n ) = cf q ( an + b )

for all m = 1 , . . . , N and some integers a, b, c ∈ Z with c odd.

See Figures 7.3, 7.4, 7.5, 7.6 for some examples of elements of S [ N ], where we set q = 2 (and hence N = 16) in order to make the figures small. The scaling factor c is of little significance and will often be normalized to 1 in our arguments. We will explore the properties of this class S [ N ] further in later sections. For now, we use this class to define our Sudoku puzzle.

Definition 7.4 (Sudoku puzzle) . Define a Sudoku solution to be a function F : B → Σ with the property that for every slope j ∈ Z and intercept i ∈ Z , the function F i,j : { , . . . , N } → Σ defined by F i,j ( n ) := F ( n, jn + i ) lies in the class S [ N ]. (See Figure 7.9.) Informally, F is a Sudoku solution if it is a rescaled copy of f q along every non-vertical line ℓ i,j = { ( n, jn + i ) : 1 ⩽ n ⩽ N } .

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

[Figure 7.3.](https://tilings.math.uni-bielefeld.de/) An element g ( n ) = f q (12 − n ) of S q [ N ] with q = 4 and N = q , depicted as a row of N boxes filled with digits in [Σ =](https://arxiv.org/abs/2211.07140) [{](https://arxiv.org/abs/2211.07140) [,](https://arxiv.org/abs/2211.07140) [,](https://arxiv.org/abs/2211.07140) [}](https://arxiv.org/abs/2211.07140) [.](https://arxiv.org/abs/2211.07140) In the language of Lemma 8.1 below, the step is s g = 3 (mod q ), the order ord g is zero, the bad coset Γ g = 4 Z is the set of shaded boxes (which in this case has upper density 1 / 4), and the associated affine function α g ( n ) = 12 − n (mod 4) vanishes on the bad coset Γ g and agrees with g outside of that coset.

Figure 7.4. Another element g ( n ) = f (2( n − 8)) of S q [ N ], again [with](https://arxiv.org/abs/1608.07167) [q](https://arxiv.org/abs/1608.07167) [= 4 and](https://arxiv.org/abs/1608.07167) [N](https://arxiv.org/abs/1608.07167) [=](https://arxiv.org/abs/1608.07167) [q](https://arxiv.org/abs/1608.07167) . In the language of Lemma 8.1 below, the step is s g = 2 (mod q ), the order ord g is one, the bad coset Γ g = 2 Z is the set of shaded boxes (which in this case has upper density 1 / 2), and the associated affine function α g ( n ) = 2 n (mod 4) vanishes on the bad coset Γ [g](https://arxiv.org/abs/2305.14028) [and agrees with](https://arxiv.org/abs/2305.14028) [g](https://arxiv.org/abs/2305.14028) outside of that coset.

[Figure 7.5.](https://doi.org/10.1007/s00454-022-00426-4) [A third element](https://doi.org/10.1007/s00454-022-00426-4) [g](https://doi.org/10.1007/s00454-022-00426-4) [(](https://doi.org/10.1007/s00454-022-00426-4) [n](https://doi.org/10.1007/s00454-022-00426-4) [) =](https://doi.org/10.1007/s00454-022-00426-4) f (2 n + 1) of S [16]. In the [language of Lemma 8.1 below, the step is](https://arxiv.org/abs/2305.17743) [s](https://arxiv.org/abs/2305.17743) [g](https://arxiv.org/abs/2305.17743) = 2 (mod q ), the order [ord](https://arxiv.org/abs/2209.08451) [g](https://arxiv.org/abs/2209.08451) [is](https://arxiv.org/abs/2209.08451) [−∞](https://arxiv.org/abs/2209.08451) [, the bad coset Γ](https://arxiv.org/abs/2209.08451) [g](https://arxiv.org/abs/2209.08451) is empty (so has upper density 0), and the associated affine function α g ( n ) = 2 n + 1 (mod 4) agrees with g [everywhere.](https://arxiv.org/abs/2309.09504)

Figure 7.6. A constant element g ( n ) = 2 (mod 4) of S [16]. In the language of Lemma 8.1 below, the step is 0, the order is −∞ , the bad coset is empty, and the associated affine function α g ( n ) = 2 (mod 4) agrees with g everywhere.

A Sudoku solution is said to have good columns [if, for every](https://doi.org/10.1007/s10801-023-01233-7) [n](https://doi.org/10.1007/s10801-023-01233-7) [= 1](https://doi.org/10.1007/s10801-023-01233-7) [, . . . , N](https://doi.org/10.1007/s10801-023-01233-7) [, there](https://doi.org/10.1007/s10801-023-01233-7) exists a permutation σ n : Z /q Z → Z /q Z such that F ( n, m ) = σ n ( m (mod q )) whenever σ n ( m (mod q )) is non-zero. A Sudoku solution is periodic if the columns m → F ( n, m ) is periodic for all n = 1 , . . . , N , and non-periodic if at least one of the columns is non-periodic.

Example 7.5 (Standard Sudoku solution) . The function F ( n, m ) := f q ( m ) is a Sudoku solution with good columns (in this case, the permutations σ , . . . , σ N are all equal to the identity permutation. It is non-periodic. (See Figure 7.7.)

Example 7.6 (Constant Sudoku solutions) . If c ∈ Σ, then the constant function F ( n, m ) := c is a Sudoku solution which is periodic, but which does not have good columns.

For future reference we record some simple invariances of Sudoku solutions.

Figure 7.7. A portion of a standard Sudoku solution (with q = 4). Observe that it is affine outside of the shaded cells. This solution is non-periodic.

Figure 7.8. A portion of a constant Sudoku solution (with c = 2). Observe that it is affine and also periodic.

Proposition 7.7 (Sudoku invariances) .

(i) (Affine invariance) If F : B → Σ is a Sudoku solution, then for any integers a, b, c , the function ( n, m ) → F ( n, am + bn + c ) is also a Sudoku solution. (ii) (Reflection symmetry) If F : B → Σ is a Sudoku solution, then so is the reflection ( n, m ) → F ( N + 1 − n, m ) .

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

Figure 7.9. [A portion of a Sudoku solution with good columns.](https://doi.org/10.1093/imrn/rnad048) Observe that it is affine outside of the shaded cells, and is also nonperiodic.

(iii) (Homogeneity) If F : B → Σ is a Sudoku solution, then so is cF for any odd c ∈ Z /q Z [.](https://arxiv.org/abs/2303.10798)

Proof. [Claims (i), (ii) are immediate from Definition 7.4, while claim (iii) follows](https://arxiv.org/abs/2305.17743) [from this definition together with Definition 7.3 and (7.4).](https://arxiv.org/abs/2209.08451) □

In the remaining sections of the paper, we will prove the non-periodicity of Sudoku solutions with good columns:

Theorem 7.8 (Non-periodicity of Sudoku solutions with good columns) . Let q =

s

be sufficiently large. Then every Sudoku solution with good columns is nonperiodic.

Remark 7.9. A remarkable feature of this result is that while the property of being a Sudoku solution with good columns is “local” in the sense that it can be verified by considering a bounded number of cells of the solution at a time, the conclusion is “global” in that it genuinely involves an infinite number of cells, and is not obviously verifiable in a bounded complexity fashion. Namely, Sudoku puzzles have enough rigidity in them to achieve non-trivial constraints on the solutions, but are not so rigid that they cannot be solved. An analogous claim can be proven for odd primes q as well, and is in fact slightly simpler (for instance, the pseudo-affine functions appearing in Section 9 can be replaced by genuinely affine functions), but we will not be able to use that variant of the above theorem for our purposes, and so leave the details of this variant to the interested reader.

We assume this theorem for now and show how it implies Theorem 4.16 (and thus Theorem 1.4 and Corollary 1.7).

Proof of Theorem 4.16 assuming Theorem 7.8. We will show that Sudoku solutions with good columns can be encoded as a weakly expressible property. Assuming Theorem 7.8, this will give an aperiodic weakly expressible property, proving

Theorem 4.16. Let s , N be such that Theorem 7.8 holds. We introduce the binary

s

encoding map B : { , } → Z /q Z defined by

s −

B ( ϵ , . . . , ϵ s − ) := ϵ + 2 ϵ + · · · + 2 ϵ s [−](https://tilings.math.uni-bielefeld.de/) [;](https://tilings.math.uni-bielefeld.de/)

this is of course a bijection. In order to motivate the construction below, we begin with some preliminary calculations. Suppose one is given a Sudoku solution F : B → Σ with good columns, thus there exist permutations σ , . . . , σ N : Z /q Z → Z /q Z obeying the following properties:

- For every j, i ∈ Z , the function n → F ( n, jn + i ) for n = 1 , . . . , N lies in S [ N ].
- One has F ( n, m ) = σ n ( m (mod q )) whenever σ n ( m (mod q )) is non-zero. We encode this data as a collection of boolean functions β a,b,n : Z → { , } for a = 0 , 1, b = 0 , . . . , s − 1, and n = 1 , . . . , N by enforcing the equations

B ( β , ,n ( i, j ) , . . . , β ,s − ,n ( i, j )) = σ n ( jn + i (mod q )) (7.5)

and B ( β , ,n ( i, j [)](https://doi.org/10.1093/imrn/rnad048) [, . . . , β](https://doi.org/10.1093/imrn/rnad048) [,s](https://doi.org/10.1093/imrn/rnad048) [−](https://doi.org/10.1093/imrn/rnad048) [,n](https://doi.org/10.1093/imrn/rnad048) [(](https://doi.org/10.1093/imrn/rnad048) [i, j](https://doi.org/10.1093/imrn/rnad048) [)) =](https://doi.org/10.1093/imrn/rnad048) [F](https://doi.org/10.1093/imrn/rnad048) [(](https://doi.org/10.1093/imrn/rnad048) [n, jn](https://doi.org/10.1093/imrn/rnad048) [+](https://doi.org/10.1093/imrn/rnad048) [i](https://doi.org/10.1093/imrn/rnad048) ) (7.6) for i, j ∈ Z and [n](https://arxiv.org/abs/2305.14028) [= 1](https://arxiv.org/abs/2305.14028) [, . . . , N](https://arxiv.org/abs/2305.14028) . One then observes the following claims: I. For each ( i, j ) ∈ Z , the sequence n → B ( β , ,n ( i, j ) , . . . , β ,s − ,n ( i, j )) lies in S [ N ]. II. If n = 1 , . . . , N and ( i, j ) ∈ Z is such that B ( β , ,n ( i, j ) , . . . , β ,s − ,n ( i, j )) is [non-zero, then](https://doi.org/10.1007/s00454-022-00426-4) [B](https://doi.org/10.1007/s00454-022-00426-4) [(](https://doi.org/10.1007/s00454-022-00426-4) [β](https://doi.org/10.1007/s00454-022-00426-4) [,](https://doi.org/10.1007/s00454-022-00426-4) [,n](https://doi.org/10.1007/s00454-022-00426-4) [(](https://doi.org/10.1007/s00454-022-00426-4) [i, j](https://doi.org/10.1007/s00454-022-00426-4) [)](https://doi.org/10.1007/s00454-022-00426-4) [, . . . , β](https://doi.org/10.1007/s00454-022-00426-4) [,s](https://doi.org/10.1007/s00454-022-00426-4) [−](https://doi.org/10.1007/s00454-022-00426-4) ,n ( i, j )) = B ( β , ,n ( i, j ) , . . . , β ,s − ,n ( i, j )). III. For each a = 0 , [1,](https://arxiv.org/abs/2305.17743) [b](https://arxiv.org/abs/2305.17743) [= 1](https://arxiv.org/abs/2305.17743) [, . . . , s](https://arxiv.org/abs/2305.17743) [and](https://arxiv.org/abs/2305.17743) [n](https://arxiv.org/abs/2305.17743) [= 1](https://arxiv.org/abs/2305.17743) , . . . , N , the function β a,b,n is ⟨ [(](https://arxiv.org/abs/2209.08451) [−](https://arxiv.org/abs/2209.08451) [n,](https://arxiv.org/abs/2209.08451) [1)](https://arxiv.org/abs/2209.08451) [⟩](https://arxiv.org/abs/2209.08451) [-periodic.](https://arxiv.org/abs/2209.08451) IV. For each n = 1 , . . . , N , the tuple ( β , ,n , . . . , β ,s − ,n ) is a boolean periodized [permutation in the direction (1](https://arxiv.org/abs/2309.09504) , 0). As it turns out, the converse also holds: if β a,b,n : Z → { , } are boolean functions for a = 0 , 1, b = 0 , . . . , s − 1, and n = 1 , . . . , N obeying the properties I-IV, then they will arise from a Sudoku solution F with good columns via the relations (7.5), (7.6). From the machinery established in previous sections, the properties I-IV are essentially weakly expressible (after some technical modifications), and will form the basis of our encoding.

s N

We now turn to the details. In the space { , } of tuples

( ω a,b,n ) ( a,b,n ) ∈W

[of boolean variables](https://doi.org/10.1007/s10801-023-01233-7) ω a,b,n ∈ { , } indexed by the 2 s N -element set

W := { , } × { , . . . , s − } × { , . . . , N } ,

s N

we define the subset Ω of those tuples in { , } obeying the following axioms: (i) (Encoded Sudoku solution) The sequence n → B ( ω , ,n , . . . , ω ,s − ,n ) lies in S [ N ]. (ii) (Encoded good columns) If n = 1 , . . . , N is such that B ( ω , ,n , . . . , ω ,s − ,n ) ̸ = (0 , . . . , 0), then B ( ω , ,n , . . . , ω ,s − ,n ) = B ( ω , ,n , . . . , ω ,s − ,n ) (or equivalently that ω ,b,n = ω ,b,n for b = 0 , . . . , s − 1). (Compare with the properties I, II discused above.) The set Ω is not symmetric, sowe also introduce the symmetrized counterpart  ˜ 1+2 s N 1+2 s N

Ω ⊂ { , } in { , } consisting of those tuples ( ω ∗ , ( ω a,b,n ) ( a,b,n ) ∈W ) such that

( R ω ∗

( ω a,b,n )) ( a,b,n ) ∈W ∈ Ω

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

where R a , a = 0 , 1 is as in (6.9). We consider the group G := Z × ( Z / Z ) , which contains in particular the three elements e := ((0

′

:= ((0

[′′](https://tilings.math.uni-bielefeld.de/)

, 0) , (1 , , 0)), e , 0) , (0 , , 0)), [e](https://tilings.math.uni-bielefeld.de/) [:= ((0](https://tilings.math.uni-bielefeld.de/) [,](https://tilings.math.uni-bielefeld.de/) [0)](https://tilings.math.uni-bielefeld.de/) [,](https://tilings.math.uni-bielefeld.de/) [(0](https://tilings.math.uni-bielefeld.de/) [,](https://tilings.math.uni-bielefeld.de/) [,](https://tilings.math.uni-bielefeld.de/) [1))](https://tilings.math.uni-bielefeld.de/) [which generate a copy of (](https://tilings.math.uni-bielefeld.de/) Z / Z ) . We now introduce a property S , which aims to encode Sudoku solutions with good columns. Let M be a natural number that

M 1+2 s N

is sufficiently large depending on s , N , and let S denote the ( G, ( Z / Z ) )-

M

property that a tuple ( α ∗ , ( α a,b,n ) ( a,b,n ) ∈W ) of functions α ∗ , α a,b,n : G → Z / Z obeys the following axioms. (a) ( α ∗ , ( α a,b,n ) ( a,b,n ) ∈W ) obeys property P Ω ˜ . (b) For each a = 0 , 1; b = 0 , . . . , s − 1; n = 1 , . . . , N , the function α a,b,n is ⟨ (( − n, 1) , (0 , , 0)) ⟩ -periodic. (c) For each n = 1 , . . . , N , the tuple ( α , ,n , . . . , α ,s − ,n ) is a boolean periodized permutation in the direction ((1 , 0) , (0 , , 0)). The axioms (b), (c) should be compared with the properties III, IV discussed previously. By Proposition 6.7, Corollary 5.4, Proposition 6.9, and Lemma 4.22, S is a weakly expressible property. It will thus suffice to show that S is aperiodic. We first show that there is at least one tuple ( [α](https://doi.org/10.1093/imrn/rnad048) [∗](https://doi.org/10.1093/imrn/rnad048) [,](https://doi.org/10.1093/imrn/rnad048) [(](https://doi.org/10.1093/imrn/rnad048) [α](https://doi.org/10.1093/imrn/rnad048) [a,b,n](https://doi.org/10.1093/imrn/rnad048) [)](https://doi.org/10.1093/imrn/rnad048) [(](https://doi.org/10.1093/imrn/rnad048) a,b,n ) ∈W ) obeying S . Let F ( n, m ) be a Sudoku solution with good columns (for instance, one can take [the standard Sudoku solution from Example 7.5), and let](https://arxiv.org/abs/2305.14028) σ , . . . , σ N : Z /q Z → Z /q Z be the associated permutations. We represent this data via the boolean functions β a,b,n : Z → { , } for ( a, b, n ) ∈ W , defined by the binary encodings [(7.5), (7.6). By properties III, IV, the](https://arxiv.org/abs/2303.10798) [β](https://arxiv.org/abs/2303.10798) [a,b,n](https://arxiv.org/abs/2303.10798) are ⟨ ( − n, 1) ⟩ -periodic, and the tuple ( β , ,n [, . . . , β](https://doi.org/10.1007/s00454-022-00426-4) [,s](https://doi.org/10.1007/s00454-022-00426-4) [−](https://doi.org/10.1007/s00454-022-00426-4) [,n](https://doi.org/10.1007/s00454-022-00426-4) ) obeys the boolean permutation property in the direction (1 , 0) for each n = 1 , . . . , N [. By properties I, II, we see that the tuple (](https://arxiv.org/abs/2305.17743) β a,b,n ( i, j )) ( a,b,n ) ∈W

[lies in Ω for each (](https://arxiv.org/abs/2209.08451) [i, j](https://arxiv.org/abs/2209.08451) [)](https://arxiv.org/abs/2209.08451) [∈](https://arxiv.org/abs/2209.08451) [Z](https://arxiv.org/abs/2209.08451) [.](https://arxiv.org/abs/2209.08451) If we now define the tuple ( α ∗ , ( α a,b,n ) ( a,b,n ) ∈W ) of

M

functions α ∗ , α a,b,n : G → Z / Z by the formulae

′ ′′

α ∗ ( x, ( ϵ, ϵ , ϵ )) := ϵ

and

′ ′′

α a,b,n ( x, ( ϵ, ϵ , ϵ )) := R ϵ ( β a,b,n ( x ))

′′

for all x ∈ Z , a = 0 , 1, b = 0 , . . . , s − 1, n = 1 , . . . , N , ϵ, ϵ, ϵ ∈ { , } (where R ϵ

is as in (6.9)), it is a routine matter to verify that this tuple obeys property S . Conversely, suppose that ( α ∗ , ( α a,b,n ) ( a,b,n ) ∈W ) obeys S . By (a), we can write

′ ′ ′ ′ ′ ′ ′ M ′

α ∗ = a ∗

+ b α ˜ ∗ and α a,b,n = a a,b,n

+ b α ˜ a,b,n for some a ∗

, a a,b,n

, b ∈ Z / Z with b

′ ′′

odd, and some ⟨ e , e ⟩ -periodic ( e, { , } )-boolean functions ˜ α ∗ , α ˜ a,b,n : G → { , } such that (˜ α ∗ (˜ x ) , (˜ α a,b,n (˜ x )) ( a,b,n ) ∈W ) ∈ Ω ˜ (7.7) for all ˜ x ∈ G . If we define the functions β a,b,n : Z → { , } by the formula

β a,b,n ( x ) := R α ˜ ∗ ( x, (0 , , 0)) (˜ α a,b,n ( x, (0 , , 0)))

for all ( a, b, n ) ∈ W , x ∈ Z , we have

( β a,b,n ( x )) ( a,b,n ) ∈W ∈ Ω (7.8)

for all x ∈ Z . From axiom (b) we see that each β a,b,n is ( − n, 1)-periodic, and from axiom (c) we see that for each n = 1 , . . . , N , the tuple ( β , ,n , . . . , β ,s − ,n ) is a boolean periodized permutation in the direction (1 , 0). From the ( − n, 1)-

M

periodicity of the β a,b,n , we may define functions F a : B → Z / Z for a = 0 , 1 by requiring that

B ( β a, ,n ( i, j ) , . . . , β a,s − ,n ( i, j )) = F a ( n, jn + i )

for all n = 1 , . . . , N and ( i, j ) ∈ Z . From (7.8) we see that F is a Sudoku solution (in particular, it avoids zero and takes values in Σ), and also that F ( n, m ) = F ( n, m ) whenever F ( n, m ) is non-zero. Since ( β , ,n , . . . , β [,s](https://tilings.math.uni-bielefeld.de/) [−](https://tilings.math.uni-bielefeld.de/) [,n](https://tilings.math.uni-bielefeld.de/) [) is a boolean](https://tilings.math.uni-bielefeld.de/) periodized permutation in the direction (1 , 0), we see that for all ( n, m ) ∈ B , the q points F ( n, m ) , . . . , F ( n, m + q − 1) take on distinct values of Z /q Z , and thus we must have F ( n, m ) = σ n ( m (mod q )) for some permutation σ n : Z /q Z → Z /q Z (cf. Example 4.9). Thus F has good columns, and is thus non-periodic thanks to Theorem 7.8. If ( α ∗ , ( α a,b,n ) ( a,b,n ) ∈W ) were periodic, F would be periodic. We then conclude that ( α ∗ , ( α a,b,n ) ( a,b,n ) ∈W ) is non-periodic. Thus, property S is aperiodic as required. □

Remark 7.10. The encoding (7.6) resembles the classical projective duality between points and lines in the plane. Indeed, a non-vertical line ℓ i,j = { ( n, jn + i ) : n = 1 , . . . , N } in the Sudoku board B corresponds to a point ( i, j ) in the lattice Z ;

′ ′′

[the various boolean expressions ˜](https://arxiv.org/abs/1608.07167) [α](https://arxiv.org/abs/1608.07167) a,b,n ( i, j, ( ϵ, ϵ , ϵ )) are encoding different “bits” of the a Sudoku puzzle (and its attendant permutations) on this line ℓ i,j .

It remains to prove Theorem 7.8. This is the objective of the remaining sections of the paper.

## 8. Basic properties of -adic structured functions and Sudoku solutions

[We begin by analyzing the class](https://arxiv.org/abs/2303.10798) [S](https://arxiv.org/abs/2303.10798) [[](https://arxiv.org/abs/2303.10798) [N](https://arxiv.org/abs/2303.10798) ] defined in Definition 7.3. We can largely [describe the behavior of an element](https://doi.org/10.1007/s00454-022-00426-4) [g](https://doi.org/10.1007/s00454-022-00426-4) [of](https://doi.org/10.1007/s00454-022-00426-4) [S](https://doi.org/10.1007/s00454-022-00426-4) [[](https://doi.org/10.1007/s00454-022-00426-4) [N](https://doi.org/10.1007/s00454-022-00426-4) ] by some statistics which we call the [“order”, “step”, “bad coset”, and “associated affine function” of](https://arxiv.org/abs/2305.17743) g .

Lemma 8.1 (Statistics of a 2-adic function) . To every g ∈ S [ N ] one can find an order ord [g](https://arxiv.org/abs/2309.09504) [∈ {−∞](https://arxiv.org/abs/2309.09504) [,](https://arxiv.org/abs/2309.09504) [, . . . , s](https://arxiv.org/abs/2309.09504) [−](https://arxiv.org/abs/2309.09504) [}](https://arxiv.org/abs/2309.09504) [, a](https://arxiv.org/abs/2309.09504) step s g ∈ Z /q Z , a bad coset Γ g ⊂ Z , and an associated affine function α g : Z → Z /q Z , obeying the following axioms: (i) α g : Z → Z /q Z is not identically zero, and is a function of the form α g ( n ) = s g n + c g for some c g ∈ Z /q Z , for all n ∈ Z , thus the step s g is the slope of the affine function α g . (ii) The bad coset Γ g ⊊ Z is the zero set { n ∈ Z : α g ( n ) = 0 } of α g ; it is empty

− ord g

if ord g = −∞ , and is a coset of q Z otherwise. (In particular, the

ord g

upper density of Γ g is equal to /q , and if ord g ⩾ , then s g is an odd

ord g

multiple of .) (iii) One has g ( n ) = α g ( n ) whenever α g ( n ) ̸ = 0 [; in other words,](https://doi.org/10.1007/s10801-023-01233-7) [g](https://doi.org/10.1007/s10801-023-01233-7) [agrees with](https://doi.org/10.1007/s10801-023-01233-7) the affine function α g outside of the bad coset Γ g . (iv) One can find integers a, b ∈ Z such that α g ( n ) = an + b (mod q ) and g ( n ) = f q ( an + b ) for all n ∈ Z . (In particular, this implies that a = s g (mod q ) ,

ord g ord g

so if ord g ⩾ , a is an odd multiple of and b is divisible by .)

See Figures 7.3, 7.4, 7.5, 7.6 for some illustrations of these statistics. We remark that the elements of S [ N ] of very high order (close to s ) will be problematic for our analysis, because the bad coset has large upper density in those cases; fortunately, we will be able to show that this case occurs quite rarely for our applications.

Proof. If g ∈ S [ N ], then by definition there exist integers a, b, c with c odd such that g ( n ) = cf q ( an + b ). Since f q (0 n + 0) = f q (0 n + 1) = 1, we may assume without loss of generality that a, b do not both vanish. Noting that f q ( an + b ) =

r

f q ( a ( n + q ) + b ) for all n = 1 , . . . , N if r is large enough, we may assume without

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

loss of generality that an + b is non-vanishing on { , . . . , N } . By (7.4), we may replace a, b, c by ca, cb, 1 and assume without loss of generality that c = 1. By (7.2) we may assume that a, b are not simultaneously divisible by [q](https://tilings.math.uni-bielefeld.de/) [.](https://tilings.math.uni-bielefeld.de/) [We then set](https://tilings.math.uni-bielefeld.de/) [α](https://tilings.math.uni-bielefeld.de/) [g](https://tilings.math.uni-bielefeld.de/) [(](https://tilings.math.uni-bielefeld.de/) n ) := an + b (mod q ), s g := a (mod q ), Γ g := { n ∈ Z : α g ( n ) = 0 } . If Γ g is empty we set ord g = −∞ , otherwise we set ord g equal to the largest number of powers of two that divide a . (This order cannot exceed s − 1, otherwise α g

would be constant and non-zero, and so Γ g would be empty). The verification of the axioms (i)-(iv) is then routine. □

In principle, it is possible that the order ord g , step s g , bad coset Γ g , or associated affine function α g produced by this lemma are not unique, because there are multiple ways to express g in the form f q ( an + b ). For instance, for n = 1 , . . . , N ,

m m

the function f q ( n ) can also be written as f q ( n + q ) for any m with q > N , or

r

as f q ( q n ) for any r ⩾ 1. We will be able to exclude this scenario, thanks to (a modification of) the following useful proposition.

Proposition 8.2 (Rigidity outside of a bad coset) . Let { n , . . . , n + 7 } be an interval of length in { , . . . , N } , and let α : Z → Z /q Z be an affine function. Suppose that g ( n ) = f q ( an [+](https://doi.org/10.1093/imrn/rnad048) [b](https://doi.org/10.1093/imrn/rnad048) [)](https://doi.org/10.1093/imrn/rnad048) [is an element of](https://doi.org/10.1093/imrn/rnad048) [S](https://doi.org/10.1093/imrn/rnad048) [[](https://doi.org/10.1093/imrn/rnad048) [N](https://doi.org/10.1093/imrn/rnad048) []](https://doi.org/10.1093/imrn/rnad048) such that g ( n ) = α ( n ) whenever n ∈ { [n](https://arxiv.org/abs/2305.14028) [, . . . , n](https://arxiv.org/abs/2305.14028) [+ 7](https://arxiv.org/abs/2305.14028) [}](https://arxiv.org/abs/2305.14028) [is such that](https://arxiv.org/abs/2305.14028) α ( n ) ̸ = 0 . Then in fact we have g ( n ) = α ( n ) whenever n ∈ { , . . . , N } and α ( n ) ̸ = 0 .

We caution that while the conclusion of this proposition strongly suggests that α g = α , and the proof below will support this claim in most cases, there are a few

q q

[cases in which this is not actually true. For instance, if](https://doi.org/10.1007/s00454-022-00426-4) g ( n ) = f q (0 n + ) = ,

q

then g agrees with the affine function [α](https://arxiv.org/abs/2305.17743) [(](https://arxiv.org/abs/2305.17743) [n](https://arxiv.org/abs/2305.17743) [) :=](https://arxiv.org/abs/2305.17743) [n](https://arxiv.org/abs/2305.17743) [(mod](https://arxiv.org/abs/2305.17743) q ) whenever α ( n ) ̸ = 0, but

q

α g ( n ) = [is not the same function as](https://arxiv.org/abs/2209.08451) α .

Proof. [By definition, we can write (possibly non-uniquely)](https://arxiv.org/abs/2309.09504)

g ( n ) = f q ( an + b )

and α g ( n ) = an + b (mod q ) for some a, b ∈ Z , for all n ∈ Z . We may assume that α does not vanish identically, as the claim is vacuously true otherwise. We set Γ := { n ∈ Z : α ( n ) = 0 } to be the zero set of α ; this is

j

either empty, or a coset of 2 Z for some 1 ⩽ j ⩽ s . First suppose that we can find elements n, m ∈ { n , . . . , n + 7 } of different parity that lie outside Γ ∪ Γ g . Then the affine functions α and α g both agree at n, m ; since the odd number m − n is invertible in Z /q Z , this implies that α = α g , and hence g ( n ) = α g ( n ) = α ( n ) whenever n ∈ { [, . . . , N](https://doi.org/10.1007/s10801-023-01233-7) [}](https://doi.org/10.1007/s10801-023-01233-7) [lies outside Γ](https://doi.org/10.1007/s10801-023-01233-7) [g](https://doi.org/10.1007/s10801-023-01233-7) [= Γ,](https://doi.org/10.1007/s10801-023-01233-7) giving the claim in this case. Thus the only remaining cases are when Γ ∪ Γ g occupies at least one full coset of 2 Z . There are three ways this can happen: either Γ is a coset of 2 Z , Γ g is a coset of 2 Z , or Γ g = 4 Z + c and Γ = 4 Z + c + 2 for some c . We first exclude the latter case. Without loss of generality we may place c ∈ { n , . . . , n + 3 } . By hypothesis, we have g ( c ) = α ( c ) and g ( c + 4) = α ( c + 4);

q

since α vanishes on 4 Z + c + 2, we conclude that g ( c ) = g ( c + 4) = (mod q ). On the other hand, as c ∈ Γ g , by Lemma 8.1 (iv), we have that ord g = s − 2 (as Γ g q ′ q

to be a coset of 4 Z ), a = a is an odd multiple of and we can write ac + b = qm

′ ′

for some integer m with g ( c ) = f q ( m ) and g ( c + 4) = f q ( m + a ). As a is odd, by (7.3) we conclude that at least one of g ( c ) , g ( c + 4) is odd, a contradiction. Hence this case cannot occur. Now suppose that Γ = 2 Z + c is a coset of 2 Z . We divide into two subcases:

- If Γ g \ Γ is empty or contained in a coset of 8 Z , then g ( n ) = α ( n ) = α g ( n ) for at least three of the four points in n ∈ { n , . . . , n + 7 } ∩ (2 Z + c + 1).

q q

But α ( n ) = (mod q ) on these points, hence α g equals [(mod](https://tilings.math.uni-bielefeld.de/) [q](https://tilings.math.uni-bielefeld.de/) [) on these](https://tilings.math.uni-bielefeld.de/)

q

[points also. As](https://tilings.math.uni-bielefeld.de/) α g is affine, we conclude that α g equals (mod q ) on all of Z + c + 1, and the claim follows.

[i](https://arxiv.org/abs/2211.07140) [′](https://arxiv.org/abs/2211.07140)

- If Γ g is a coset 2 Z + c disjoint from Γ = 2 Z + c for some i = 1 , 2, then

ord g ′ ord g i

ord g = s − i , a = 2 a is an odd multiple of 2 = q/ , and we may

′

normalize c ∈ { n , n + 1 , n + 2 , n + 3 } , hence by hypothesis

′ ′ ′ i ′ i

g ( c ) = α ( c ); g ( c + 2 ) = α ( c + 2 ) .

′

As c ∈ Γ g , we may write q ′ ′ ′ i

a c + b = ac + b = qm

′ ′ ′ ′

for some integer m and odd a , with g ( c ) = f q ( m ) = α ( c ) and g ( c +

[i](https://arxiv.org/abs/1608.07167) [′](https://arxiv.org/abs/1608.07167) [′](https://arxiv.org/abs/1608.07167) i ′

[) =](https://arxiv.org/abs/1608.07167) [f](https://arxiv.org/abs/1608.07167) [q](https://arxiv.org/abs/1608.07167) [(](https://arxiv.org/abs/1608.07167) [m](https://arxiv.org/abs/1608.07167) [+](https://arxiv.org/abs/1608.07167) [a](https://arxiv.org/abs/1608.07167) [) =](https://arxiv.org/abs/1608.07167) [α](https://arxiv.org/abs/1608.07167) [(](https://arxiv.org/abs/1608.07167) [c](https://arxiv.org/abs/1608.07167) [+ 2](https://arxiv.org/abs/1608.07167) ). Since a is odd, by (7.3) at least one of

′ q

f q ( m ) , f q ( m + a ) is odd; on the other hand, α is equal to (mod q ) on

′ ′ i

Z + c + 1, and hence at [c](https://doi.org/10.1093/imrn/rnad048) [, c](https://doi.org/10.1093/imrn/rnad048) [+ 2](https://doi.org/10.1093/imrn/rnad048) [, giving a contradiction.](https://doi.org/10.1093/imrn/rnad048) Finally, suppose that Γ is not a coset of 2 Z , but Γ g = 2 Z + c is. We again divide into two subcases: • If Γ \ Γ g is empty or contained in a coset of 8 Z , then by arguing as before we

q

see that the affine function α equals (mod q ) on at least three of the four points in [n](https://arxiv.org/abs/2303.10798) [∈ {](https://arxiv.org/abs/2303.10798) [n](https://arxiv.org/abs/2303.10798) [, . . . , n](https://arxiv.org/abs/2303.10798) [+7](https://arxiv.org/abs/2303.10798) [}∩](https://arxiv.org/abs/2303.10798) [(2](https://arxiv.org/abs/2303.10798) [Z](https://arxiv.org/abs/2303.10798) [+](https://arxiv.org/abs/2303.10798) [c](https://arxiv.org/abs/2303.10798) +1), and hence on all of 2 Z + c +1. Since

q

[Γ is not a coset of 2](https://doi.org/10.1007/s00454-022-00426-4) [Z](https://doi.org/10.1007/s00454-022-00426-4) [, this forces](https://doi.org/10.1007/s00454-022-00426-4) [α](https://doi.org/10.1007/s00454-022-00426-4) to be the constant function (mod q ), and

[q](https://arxiv.org/abs/2305.17743)

hence g is equal to [(mod](https://arxiv.org/abs/2305.17743) [q](https://arxiv.org/abs/2305.17743) [) on all of](https://arxiv.org/abs/2305.17743) [{](https://arxiv.org/abs/2305.17743) [n](https://arxiv.org/abs/2305.17743) [, . . . , n](https://arxiv.org/abs/2305.17743) +7 } . In particular, g is even on { n , . . . , n + 7 } ∩ (2 Z + c ) However, if we normalize c ∈ { n , n + 1 } , we

q ′ q

[observe that ord](https://arxiv.org/abs/2309.09504) [g](https://arxiv.org/abs/2309.09504) [=](https://arxiv.org/abs/2309.09504) [s](https://arxiv.org/abs/2309.09504) [−](https://arxiv.org/abs/2309.09504) [1,](https://arxiv.org/abs/2309.09504) [a](https://arxiv.org/abs/2309.09504) = a is an odd multiple of , and ac + b = qm

′

for some integer m , with g ( c ) = f q ( m ) and g ( c + 2) = f q ( m + a ). Thus at least one of g ( c ) , g ( c + 2) is odd, a contradiction.

′

- If Γ is a coset 4 Z + c disjoint from Γ g = 2 Z + c , then α is always a multiple

q

of , so in particular g is even on { n , . . . , n + 7 } ∩ (2 Z + c ). Now we can argue as in the previous case to obtain a contradiction. □

A variant of the argument gives

Proposition 8.3. If N ⩾ , then an element g of S [ N ] has a well-defined order, step, affine function, and bad coset.

Proof. Suppose g ∈ S [ N ] has two representations g = f q ( a n + b ) = f q ( a n + b ) with associated orders ord , ord , steps s , s , affine functions α , α , and bad cosets Γ , Γ . Our task is to show that ord = ord , s = s , α = α , and Γ = Γ . First suppose that we can find elements n, m ∈ { , . . . , N } of different parity that lie outside Γ ∪ Γ . The arguments in the proof of Proposition 8.2 (with α , α playing the roles of α, α g respectively, and similarly for Γ , Γ and Γ , Γ g ) imply that α = α , which implies that the steps s = s agree, and that the bad cosets Γ = Γ (which are the zero sets of α = α ) agree. Since the upper density of Γ i ord i

is 2 /q , we then conclude that ord = ord , as claimed. On repeating the rest of the analysis in the proof of Proposition 8.2, we see that the only other case that does not lead to a contradiction is if Γ is a coset

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

Figure 9.1. [A schematic description of how enough structure is](https://doi.org/10.1093/imrn/rnad048) obtained on a Sudoku solution F with good columns that one can [eventually conclude that solutions are aperiodic and prove Theo-](https://arxiv.org/abs/2305.14028) rem 7.8. Dashed arrows indicate implications that are essentially compositions of other arrows in the diagram. At a key step in the [argument (depicted by the yellow box) the analysis shifts from a](https://arxiv.org/abs/2303.10798) [Sudoku solution](https://doi.org/10.1007/s00454-022-00426-4) [F](https://doi.org/10.1007/s00454-022-00426-4) [to its “post-Tetris move” version](https://doi.org/10.1007/s00454-022-00426-4) F ∗ (after first [shearing to normal form). Among other things, this move reduces](https://arxiv.org/abs/2305.17743) [any putative period in the solution by a factor of](https://arxiv.org/abs/2209.08451) q .

q

Z + c of 2 Z and α = (mod q ) on the complementary coset 2 Z + c + 1. Thus

q

α is either equal to α , or the constant . In the former case we are done as before. In the latter case, Γ is empty, and now we can obtain a contradiction by interchanging the roles of Γ and Γ and appealing again to the analysis in the proof of Proposition 8.2. □

We remark that the statistics s g , ord g , Γ g , α g of an element g of S [ N ] do not uniquely determine g , because there is still some variability of g within the bad coset Γ g . For instance, the elements n → f q ( n [) and](https://doi.org/10.1007/s10801-023-01233-7) [n](https://doi.org/10.1007/s10801-023-01233-7) [→](https://doi.org/10.1007/s10801-023-01233-7) [f](https://doi.org/10.1007/s10801-023-01233-7) [q](https://doi.org/10.1007/s10801-023-01233-7) [(](https://doi.org/10.1007/s10801-023-01233-7) [n](https://doi.org/10.1007/s10801-023-01233-7) [+](https://doi.org/10.1007/s10801-023-01233-7) [q](https://doi.org/10.1007/s10801-023-01233-7) [) of](https://doi.org/10.1007/s10801-023-01233-7) [S](https://doi.org/10.1007/s10801-023-01233-7) [[](https://doi.org/10.1007/s10801-023-01233-7) [N](https://doi.org/10.1007/s10801-023-01233-7) []](https://doi.org/10.1007/s10801-023-01233-7) are both of step 1 and order 0 with bad coset q Z and associated affine function n → n (mod q ), but disagree inside of the bad coset. Nevertheless, the statistics s g , ord g , Γ g , α g still give some partial constraints on the behavior of g on the bad coset Γ g ; for instance, all elements g ∈ S [ N ] with step 1, order 0, bad coset q Z and

n

associated affine function n → n (mod q ) must take the form g ( n ) =

q

− c (mod q ) for all n in the bad coset { , . . . , N } ∩ q Z except at a single point n = cq for some c = 1 , . . . , q . It is this partial control inside the bad coset which will ultimately allow us to conclude the aperiodicity required in Theorem 7.8.

## 9. The structure of Sudoku solutions

We are now ready to prove Theorem 7.8. The logical structure of the argument is summarized in Figure 9.1.

To use the property of having good columns, we begin with the following lemma. By definition, if the digits of a Sudoku solution F : B → Σ were perfectly equidistributed, then each digit would occur on a set of density

q −

[(as defined in Section](https://tilings.math.uni-bielefeld.de/) 1.5). It will be convenient to work with a weaker variant of this property. We say that F [has](https://arxiv.org/abs/2211.07140) [weak digit equidistribution](https://arxiv.org/abs/2211.07140) if each digit σ ∈ Σ occurs in the solution with upper density at most

q

in B .

Lemma 9.1 (Good columns implies weak digit equidistribution) . Every Sudoku solution with good columns has weak digit equidistribution.

Proof. Let F : B → Σ be a Sudoku solution with good columns. By the triangle inequality, it suffices to verify the claim for each separate column { n } × Z , that is to say to show that

lim sup |{ m ∈ {− M, . . . , M } : F ( n, m ) = γ }| ⩽

[M](https://arxiv.org/abs/1608.07167) [→∞](https://arxiv.org/abs/1608.07167) [M](https://arxiv.org/abs/1608.07167) [+ 1](https://arxiv.org/abs/1608.07167) q

for each n = 1 , . . . , N . By the good column property, there is a permutation σ n : Z /q Z → Z /q Z such that [F](https://doi.org/10.1093/imrn/rnad048) [(](https://doi.org/10.1093/imrn/rnad048) [n, m](https://doi.org/10.1093/imrn/rnad048) [) =](https://doi.org/10.1093/imrn/rnad048) [σ](https://doi.org/10.1093/imrn/rnad048) [n](https://doi.org/10.1093/imrn/rnad048) [(](https://doi.org/10.1093/imrn/rnad048) [m](https://doi.org/10.1093/imrn/rnad048) [(mod](https://doi.org/10.1093/imrn/rnad048) [q](https://doi.org/10.1093/imrn/rnad048) [)) whenever](https://doi.org/10.1093/imrn/rnad048) σ n ( m (mod q )) ̸ = 0. Thus the property F ( n, m ) = γ can only occur in two cosets of Z /q Z , the coset

− [−](https://arxiv.org/abs/2305.14028)

σ n

( { γ } [) and the coset](https://arxiv.org/abs/2305.14028) [σ](https://arxiv.org/abs/2305.14028) [n](https://arxiv.org/abs/2305.14028)

[(](https://arxiv.org/abs/2305.14028) [{](https://arxiv.org/abs/2305.14028) [}](https://arxiv.org/abs/2305.14028) ), and the claim follows. □

For each line ℓ i,j = { ( n, jn + i ) : 1 ⩽ n ⩽ N } in the Sudoku board, we have the associated element F i,j of S [ N ] defined by

[F](https://doi.org/10.1007/s00454-022-00426-4) [i,j](https://doi.org/10.1007/s00454-022-00426-4) [(](https://doi.org/10.1007/s00454-022-00426-4) [n](https://doi.org/10.1007/s00454-022-00426-4) [) :=](https://doi.org/10.1007/s00454-022-00426-4) [F](https://doi.org/10.1007/s00454-022-00426-4) [(](https://doi.org/10.1007/s00454-022-00426-4) [n, jn](https://doi.org/10.1007/s00454-022-00426-4) + i ) .

[In particular we have an associated order ord](https://arxiv.org/abs/2209.08451) F i,j

∈ {−∞ , , , . . . , s − } of a line to be the order of the associated sequence n → F ( n, jn + i ). We have the following [bound on the density of lines of high order:](https://arxiv.org/abs/2309.09504)

Lemma 9.2 (Weak digit equidistribution implies high-order lines are rare) . Suppose that F : B → Σ is a Sudoku solution with weak digit equidistribution. Then, for non-negative order ⩽ o ⩽ s − , and any slope j , the set { i ∈ Z : ord F i,j

= o }

− o +1

has upper density at most in Z .

o

Proof. If i is such that ord F i,j

= o , then there is an affine function n → ( an + b )

o o

with a, b ∈ Z /q Z and a odd, such that F i,j ( n ) = 2 ( an + b ) whenever 2 ( an + b ) ̸ = 0.

o o

In particular, F ( n, jn + i ) attains the value q/ 2 (mod q ) at least 2 N/q = 2 q . On the other hand, by the weak digit equidistribution assumption and the triangle [inequality the set of (](https://doi.org/10.1007/s10801-023-01233-7) n, i ) ∈ { , . . . , N } × Z for which F i,j ( n ) = q/ 2 (mod q ) has upper density at most 2 /q in { , . . . , N } × Z . The claim then follows from a standard double counting argument. □

Once one knows that high-order lines are rare, the function F becomes mostly affine along horizontal lines, diagonals, and anti-diagonals. One can then expect to “concatenate” this information together (in the spirit of [TZ16]) to conclude that F is in fact mostly a two-dimensional affine function F ( n, m ) = An + Bm + C . This is almost correct, but in our 2-adic setting there is an additional technicality, in that a small amount of quadratic behavior is also permitted. More precisely, define a pseudo-affine function on Z to be a function Ψ : Z → Z /q Z that is of the form q Ψ( n, m ) = An + Bm + C + D  m ( m − n ) (9.1)

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

q

[Figure 9.2.](https://arxiv.org/abs/2209.08451) The pseudo-affine function Ψ( n, m ) = m + m ( m − n ) (mod q ) with q = 8. Observe that while Ψ is not affine in a two-dimensional sense, it is affine along all non-vertical lines. Also, the zero set of Ψ (shaded in grey) remains well-behaved, being equal to Z × q Z . A Sudoku solution that agreed with this pseudo-affine function outside of the grey cells would be in normal form in the sense of Proposition 9.6 below, and suitable for applying a “Tetris” move for further analysis.

for some coefficients A, B, C, D ∈ Z /q Z ; see Figure 9.2. Observe that such functions are affine along infinite non-vertical lines ℓ i,j := { ( n, jn + i ) : n ∈ Z } , since   q [q](https://doi.org/10.1007/s10801-023-01233-7) [j](https://doi.org/10.1007/s10801-023-01233-7) [Ψ(](https://doi.org/10.1007/s10801-023-01233-7) [n, jn](https://doi.org/10.1007/s10801-023-01233-7) + i ) = An + Bjn + Bi + C + D  (2 nij − in + i ) + D  n

thanks to the identity   q q n n − n = q = 0 (mod q ) .

q

The quadratic term D m ( m − n ) in the definition of a pseudo-affine function is unfortunately necessary, but plays only a minor technical role in the analysis (for q large enough) and we recommend that the reader ignore these terms at a first reading. The most important coefficient of a pseudo-affine function Ψ will be the vertical coefficient B ; in particular, the behavior is particularly tractable when B is odd. It is clear that the class of pseudo-affine functions forms an additive group. Note that this group is closed under translations in Z , if Ψ( x ), x ∈ Z is a pseudo-affine

function and t ∈ Z , then Ψ( x + t ), x ∈ Z is a pseudo-affine function. We have the following concatenation result:

Lemma 9.3 (Concatenation lemma) . Let F : Q → Z /q Z be a function defined on an × square Q such that for any (infinite) line ℓ i,j = { ( n, jn + i ) : n ∈ Z } with j [=](https://arxiv.org/abs/2211.07140) [−](https://arxiv.org/abs/2211.07140) [,](https://arxiv.org/abs/2211.07140) [,](https://arxiv.org/abs/2211.07140) (i.e., an infinite anti-diagonal, horizontal line, or diagonal) intersecting Q , the function n → F ( n, jn + i ) is affine on { n : ( n, jn + i ) ∈ Q } . Then there exists a pseudo-affine function Ψ : Z → Z /q Z which agrees with F on Q .

Proof. By translation invariance we may normalize Q = { , . . . , } × { , . . . , } . The functions n → F ( n, 0) and n → F ( n, n ) are affine on { , . . . , } , thus there exist coefficients A, B, C ∈ Z /q Z such that F ( n, m ) = An + Bm + C for

( n, m ) ∈ { ( n, 0) : 0 ⩽ n ⩽ } ∪ { ( n, n ) : 0 ⩽ n ⩽ }} . (9.2)

[By subtracting the pseudo-affine function](https://arxiv.org/abs/1608.07167) An + Bm + C from F ( n, m ) we may normalize A = B = C = 0, thus F now vanishes on the set (9.2). The function n → F ( n, − n ) is affine on { , . . . , } and vanishes at n = , 6, hence vanishes on all of [{](https://doi.org/10.1093/imrn/rnad048) [, . . . ,](https://doi.org/10.1093/imrn/rnad048) [}](https://doi.org/10.1093/imrn/rnad048) [.](https://doi.org/10.1093/imrn/rnad048) [In particular](https://doi.org/10.1093/imrn/rnad048) [F](https://doi.org/10.1093/imrn/rnad048) now vanishes at both (1 , 1) and (5 , 1). Since n → F ( n, 1) is affine on { , . . . , } , we conclude that

q

F ( n, 1) = D [(1](https://arxiv.org/abs/2305.14028) [−](https://arxiv.org/abs/2305.14028) [n](https://arxiv.org/abs/2305.14028) [) for some](https://arxiv.org/abs/2305.14028) [D](https://arxiv.org/abs/2305.14028) [∈](https://arxiv.org/abs/2305.14028) [Z](https://arxiv.org/abs/2305.14028) [/q](https://arxiv.org/abs/2305.14028) Z . By subtracting the pseudo-affine

q

function D m ( m − n ) from F (which vanishes on (9.2)) we may normalize D = 0. Thus F now vanishes on { ( n, 1) : 0 ⩽ n ⩽ } . For i = 1 , . . . , [7, the function](https://arxiv.org/abs/2303.10798) [n](https://arxiv.org/abs/2303.10798) [→](https://arxiv.org/abs/2303.10798) [F](https://arxiv.org/abs/2303.10798) [(](https://arxiv.org/abs/2303.10798) [n, i](https://arxiv.org/abs/2303.10798) [−](https://arxiv.org/abs/2303.10798) n ) is affine on { , . . . , i } and vanishes at n = [i](https://doi.org/10.1007/s00454-022-00426-4) [−](https://doi.org/10.1007/s00454-022-00426-4) [, i](https://doi.org/10.1007/s00454-022-00426-4) [, hence vanishes on all of](https://doi.org/10.1007/s00454-022-00426-4) [{](https://doi.org/10.1007/s00454-022-00426-4) , . . . , i } . In particular, F (0 , m ) = F (1 , m ) = 0 for all m [= 0](https://arxiv.org/abs/2305.17743) [, . . . ,](https://arxiv.org/abs/2305.17743) [6.](https://arxiv.org/abs/2305.17743) [As](https://arxiv.org/abs/2305.17743) [n](https://arxiv.org/abs/2305.17743) [→](https://arxiv.org/abs/2305.17743) [F](https://arxiv.org/abs/2305.17743) [(](https://arxiv.org/abs/2305.17743) [n, m](https://arxiv.org/abs/2305.17743) ) is affine on { , . . . , } , we [conclude that](https://arxiv.org/abs/2209.08451) [F](https://arxiv.org/abs/2209.08451) [now vanishes on](https://arxiv.org/abs/2209.08451) { , . . . , } × { , . . . , } . By inspecting F on [diagonal and anti-diagonal lines that meet the top row](https://arxiv.org/abs/2309.09504) { , . . . , } × { } of the square, one can then check that F vanishes here also. Thus F is identically zero on Q , and the claim follows. □

We utilize this lemma as follows.

Proposition 9.4 (Weak digit equidistribution implies pseudo-affine structure) . Suppose that F : B → Σ is a Sudoku solution with weak digit equidistribution. Suppose that q is sufficiently large. Then there exists a pseudo-affine function Ψ : Z → Z /q Z , which does not vanish on at least one square { n , . . . , n + 7 } × { m , . . . , m + 7 } , such that F ( n, m ) = Ψ( n, m ) whenever ( n, m ) ∈ B is a cell with Ψ( n, m ) ̸ = 0 .

Proof. Let M > N be a sufficiently large parameter (that can depend on q ) to be chosen later. The first step is to locate a square Q = { n , . . . , n + 7 } × { m , . . . , m + 7 } in { , . . . , N } × { , . . . , M } with good properties. The number of possible such squares Q is ( N − 7)( M − 7); we select one at random. To each non-vertical line ℓ i,j = { ( n, jn + i ) : 1 ⩽ n ⩽ N } , one can form the bad set Γ i,j := { ( n, jn + i ) : n ∈ Γ F i,j

∩ { , . . . , N }} associated to the bad

o

coset Γ F i,j

of F i,j . If the ord F i,j

= o , this bad set has spacing q/ , and thus has

o o o

cardinality O (2 N/q ) = O (2 q ). Thus, there are at most O (2 q ) squares Q with the property that Q contains one of the elements of this bad set. On the other hand, for j = − , , 1 (i.e., horizontal lines, diagonals, and anti-diagonals), we see from Lemma 9.2 that the set of intercepts i with ord F i,j

= o have upper density

See the recent preprint [KT22] for some further variations on the theme of this lemma.

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

− o

O (2 ). Summing in o and over the O ( M ) possible lines ℓ i,j of slope j = − , , intersecting { , . . . , N } × { , . . . , M } , we conclude from double counting (for M large enough) that the probability that Q [contains a bad point from a horizontal](https://tilings.math.uni-bielefeld.de/)

P s − − o o o =0

q × M

line, diagonal, or anti-diagonal intersecting Q is O (

( N − 7)( M − 7)

) = O (log q/q ). [Thus, assuming](https://arxiv.org/abs/2211.07140) [q](https://arxiv.org/abs/2211.07140) is large enough, we can find a square

Q = { n , . . . , n + 7 } × { m , . . . , m + 7 }

in { , . . . , N } × { , . . . , M } with the property that all horizontal lines, diagonals, and anti-diagonals ℓ i,j passing through Q are such that Q ∩ Γ i,j = ∅ . In particular, on every such line ℓ , F agrees on Q ∩ ℓ with a (one-dimensional) affine function. Applying Lemma 9.3, we may find a pseudo-affine function Ψ : Z → Z /q Z such that F agrees with Ψ on Q . In particular, Ψ is non-vanishing on Q . Call a cell ( n, m ) good if either Ψ( n, m ) = 0, or if Ψ( n, m ) = F ( n, m ). Then all elements of Q are good. Also, from Proposition 8.2 we see that if a line ℓ i,j contains eight good consecutive cells, then all the cells in the line are good. Applying this fact to the eight horizontal lines ℓ m, = { ( n, m ) : 1 ⩽ n ⩽ N } for m ∈ { m , . . . , m + 7 } [, we conclude that all the cells in the rectagular region](https://doi.org/10.1093/imrn/rnad048) { , . . . , N } × { m , . . . , m + 7 } are good. Applying the fact again to the diagonal lines ℓ m, = { ( [n, n](https://arxiv.org/abs/2305.14028) [+](https://arxiv.org/abs/2305.14028) [m](https://arxiv.org/abs/2305.14028) [) : 1](https://arxiv.org/abs/2305.14028) [⩽](https://arxiv.org/abs/2305.14028) [n](https://arxiv.org/abs/2305.14028) [⩽](https://arxiv.org/abs/2305.14028) [M](https://arxiv.org/abs/2305.14028) [}](https://arxiv.org/abs/2305.14028) [for](https://arxiv.org/abs/2305.14028) [m](https://arxiv.org/abs/2305.14028) − ⩽ m ⩽ m + 8 − N , we conclude that all the cells in the partial horizontal line { , . . . , N } × { m + 8 } are good; applying the fact again to the horizontal line ℓ m +8 , = { ( n, m + 8) : 1 ⩽ n ⩽ N } , [we conclude that in fact all the cells in](https://arxiv.org/abs/2303.10798) [ℓ](https://arxiv.org/abs/2303.10798) [m](https://arxiv.org/abs/2303.10798) +8 , are good. A reflected version of [the same argument shows that all the cells in](https://doi.org/10.1007/s00454-022-00426-4) ℓ m − , are good. Thus we have [extended the rectangle of good cells by one row in both directions. Iterating this](https://arxiv.org/abs/2305.17743) argument to fill out the remaining rows of the Sudoku board, we conclude that all the cells in B are good, giving the claim. □

Assuming good columns, we can obtain an important control on a key coefficient B of the pseudo-affine function Ψ.

Proposition 9.5 (Odd vertical coefficient) . Let F be a Sudoku solution with good

q

columns. Let Ψ( n, m ) = An + Bm + C + D m ( m − n ) be the pseudo-affine function produced by Proposition 9.4. Then B is odd.

Proof. By Lemma 9.1, F has weak digit equidistribution. Hence, from applying Proposition 9.4 we obtain that there exists 1 ⩽ n ⩽ N such that the function m → Ψ( n, m ) is not identically zero. This function is affine on every coset of 4 [Z](https://doi.org/10.1007/s10801-023-01233-7) [, and](https://doi.org/10.1007/s10801-023-01233-7) hence is non-vanishing on at least one coset 8 Z + c of 8 Z . Suppose for contradiction

q

that B was even. Then the function m → Ψ( n, m ) is ⟨ ⟩ -periodic on 8 Z + c , thus m → F ( n, m ) is also. But as F has good columns, we also have F ( n, m ) = σ n ( m ) whenever σ n ( m (mod q )) ̸ = 0, for some permutation σ n : Z /q Z → Z /q Z . This

q q

implies that σ n has a zero in every coset { m (mod q ) , m + (mod q ) } of Z /q Z with m ∈ Z + c , which is absurd. □

This gives us a normal form as follows. Given a Sudoku solution F , define a

′

shearing of F to be any map F : B → Σ of the form

′

F ( n, m ) := BF ( n, m + An + C )

′

for some integers A, B, C with B odd. Note from Proposition 7.7 that F is also

′

a Sudoku solution; furthermore, F has good columns if and only if F does, and

′

F is periodic if and only if F is. The property of one Sudoku solution being a

shearing of another can also be easily verified to be an equivalence relation. In view of Remark 7.10, the shear-invariance of Sudoku solutions is closely related to the translation invariance of tiling equations A ⊕ F = G .

Proposition 9.6 (Normal form) . Let F ( n, m ) be a Sudoku solution which agrees

q

[with a pseudo-affine function](https://arxiv.org/abs/2211.07140) [Ψ(](https://arxiv.org/abs/2211.07140) n, m ) = An + Bm + C + D m ( m − n ) with

′

B ∈ Z /q Z odd when Ψ( n, m ) is non-zero. Then there exists a shearing F of F which is in normal form in the sense that

′

q F ( n, m ) = m + D  m ( m − n ) (9.3)

for some D ∈ Z /q Z , all n ∈ { , . . . , N } , and all m ∈ Z \ q Z .

Proof. We claim that the zero set of Ψ takes the form

′ ′

{ ( n, m ) ∈ Z : Ψ( n, m ) = 0 } = { ( n, m ) ∈ Z : m = A n + C (mod q ) } (9.4)

′ ′

[for some coefficients](https://arxiv.org/abs/1608.07167) [A](https://arxiv.org/abs/1608.07167) [, C](https://arxiv.org/abs/1608.07167) [∈](https://arxiv.org/abs/1608.07167) [Z](https://arxiv.org/abs/1608.07167) [/q](https://arxiv.org/abs/1608.07167) [Z](https://arxiv.org/abs/1608.07167) . To see this, we temporarily divide out by the invertible element B to normalize B = 1. If Ψ( n, m ) = 0, then An + m + C = 0 (mod 4), hence [q](https://doi.org/10.1093/imrn/rnad048) 0 = Ψ( n, m ) = An + m + C + D  ( − An − C )( − An − C − n ) (mod q )

[q](https://arxiv.org/abs/2305.14028) [q](https://arxiv.org/abs/2305.14028)

which one can write (using n = n (mod q )) as   q q q A + 1 0 = An + m + C + DC + (2 A + 1) DC  n + D  n (mod q )

and thus

[′](https://arxiv.org/abs/2305.17743) [′](https://arxiv.org/abs/2305.17743)

[m](https://arxiv.org/abs/2209.08451) [=](https://arxiv.org/abs/2209.08451) [A](https://arxiv.org/abs/2209.08451) n + C (mod q )

[′](https://arxiv.org/abs/2209.08451) [q](https://arxiv.org/abs/2209.08451) q  A +1  ′ q

where A := − A − (2 A + 1) DC − D and C := − C − DC . Conversely,

[′](https://arxiv.org/abs/2309.09504) [′](https://arxiv.org/abs/2309.09504)

if m = [A](https://arxiv.org/abs/2309.09504) [n](https://arxiv.org/abs/2309.09504) [+](https://arxiv.org/abs/2309.09504) [C](https://arxiv.org/abs/2309.09504) [(mod](https://arxiv.org/abs/2309.09504) [q](https://arxiv.org/abs/2309.09504) [) then](https://arxiv.org/abs/2309.09504) [An](https://arxiv.org/abs/2309.09504) + m + C = 0 (mod 4) and Ψ( n, m ) = 0. This gives (9.4).

′′

Let F denote the shearing

′′ ′ ′

F ( n, m ) := F ( n, m + A n + C )

′′ ′ ′

of F , and similarly define Ψ ( n, m ) := Ψ( n, m + A n + C ). From direct compu-

′′ ′′ ′′ ′′ ′′ ′′ q

tation, Ψ is of the form Ψ ( n, m ) = A n + B m + C + D m ( m − n ) for some

′′ ′′ ′′ ′′ ′′ ′′

A , B , C , D ∈ Z /q Z with B odd (and thus invertible), and Ψ ( n, m ) vanishes

′′ ′′

when m = 0 (mod q ). Substituting m = 0 we conclude that A = C = 0. If

′ ′′ ′′ ′

we then set F ( n, m ) := F ( n, m ) /B we obtain the desired shearing F in normal form. □

In view of Propositions 9.5, 9.6, we see that to conclude the proof of Theorem 7.8, it suffices to show that all Sudoku solutions F in normal form are non-periodic. Suppose for contradiction that we had a periodic Sudoku solution F in normal form, thus F is ⟨ (0 , M ) ⟩ -periodic for some period M (i.e., F ( n, m ) = F ( n, m + M ) for all ( n, m ) ∈ B ). From the normal form condition (9.3) we see that M must be divisible by q . The key proposition we will establish to conclude the argument is:

Proposition 9.7 (Tetris iteration) . Let F be a Sudoku solution in normal form. We consider the Tetris move of replacing F with the function

F ∗ ( n, m ) := F ( n, qm )

### which is also a Sudoku solution thanks to Proposition 7.7. Then there exists a

∗

shearing of F that is in normal form.

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

Indeed, if F is an ⟨ (0 , M ) ⟩ -periodic Sudoku solution in normal form, the post- Tetris move solution F ∗ will be a ⟨ (0 , M/q ) ⟩ -periodic Sudoku solution, and its shearing will be a ⟨ (0 , M/q ) ⟩ -periodic Sudoku solution in normal form. Iterating this gives an infinite descent of periods M , which is absurd.

[Remark 9.8.](https://arxiv.org/abs/2211.07140) In the computer game “Tetris”, every time a row is completely filled with blocks, it is deleted. Analogously to this, a Sudoku solution F in normal form has its values completely specified on all rows ℓ m, = { ( n, m ) : 1 ⩽ n ⩽ N } with m ̸ = 0 (mod q ); deleting all these rows yields the post-Tetris move solution F ∗ . This may help explain our terminology of a “Tetris move”.

9.1. Analyzing the Tetris move. It remains to establish Proposition 9.7. In order to deploy tools such as Proposition 9.4, we will need to control upper digits of densities of the post-Tetris solution F ∗ . To do this, we first analyze the diagonal lines F i, ( n ) = F ( n, n + i ) of the original solution F . From (9.3) we have q F i, ( n ) = n + i + D  ( n + i ) i (mod q )

whenever n + i ̸ = 0 (mod q [). We can simplify this to](https://doi.org/10.1093/imrn/rnad048)

[F](https://arxiv.org/abs/2305.14028) [i,](https://arxiv.org/abs/2305.14028) [(](https://arxiv.org/abs/2305.14028) [n](https://arxiv.org/abs/2305.14028) [) =](https://arxiv.org/abs/2305.14028) [a](https://arxiv.org/abs/2305.14028) [i,](https://arxiv.org/abs/2305.14028) n + b i,

whenever n + i ̸ = 0 (mod q ), where the coefficients a i, , b i, ∈ Z /q Z are given by the formulae [q](https://arxiv.org/abs/2303.10798) [a](https://doi.org/10.1007/s00454-022-00426-4) [i,](https://doi.org/10.1007/s00454-022-00426-4) [:= 1 +](https://doi.org/10.1007/s00454-022-00426-4) [D ](https://doi.org/10.1007/s00454-022-00426-4) [i](https://doi.org/10.1007/s00454-022-00426-4) (mod q ) (9.5)

and q b i, := i + D  i (mod q ) .

Observe that a i, is odd, and F i, ( n ) is equal to a i, n + b i, for n ∈ { , . . . , N } outside of the coset Γ F i,

:= { n ∈ Z : n + i = 0 (mod q ) } of q Z . By Proposition 8.3 (applied to some interval { n , . . . , n + 7 } in { , . . . , N } avoiding Γ F i,

), this forces the step s F i,

of F i, to equal a i, , and the order ord F i,

to equal 0. Thus, by Lemma 8.1 (iv), we may write

F i, ( n ) = f q (˜ a i, n +  ˜ b i, )

for some integers ˜ a i, , ˜ b i, with ˜ a i, = a i, (mod q ) and  ˜ b i, = b i, (mod q ). If we now let n i ∈ { , . . . , q } be such that n i + i = 0 (mod [q](https://doi.org/10.1007/s10801-023-01233-7) [), we conclude in particular](https://doi.org/10.1007/s10801-023-01233-7) that ˜ a i, [n](https://doi.org/10.1007/s10801-023-01233-7) [i](https://doi.org/10.1007/s10801-023-01233-7) [+ ](https://doi.org/10.1007/s10801-023-01233-7) [˜](https://doi.org/10.1007/s10801-023-01233-7) [b](https://doi.org/10.1007/s10801-023-01233-7) i, = q c ˜ i, for some integer ˜ c i, , and   n i + i F ∗ n i + qj,  + j = F i, ( n i + qj ) q (9.6) = f q ( q c ˜ i, + ˜ a i, qj )

= f q (˜ a i, j + ˜ c i, ) .

n i + i

for j = 0 , . . . , q − 1. Since ˜ a i, is odd, this implies that F ∗ ( n i + q j ,

q

+ j ) = ˜ a i, j + c ˜ i, (mod q ) for all but one value of j . In particular each digit γ of Σ is attained

n i + i

by F ∗ ( n i + q j ,

q

+ j ) at most twice. Averaging over all i and double counting using N = q , we conclude that the upper density of { ( n, m ) ∈ B : F ∗ ( n, m ) = γ } in B does not exceed the upper density of E by more than 2 /q . In other words, F ∗ has weak digit equidistribution.

We may now invoke Proposition 9.4 and conclude that there exists a pseudoaffine function q Ψ ∗ ( n, m ) = A ∗ n + B ∗ m + C ∗ + D ∗ m ( m − n )

[which is not identically zero in](https://arxiv.org/abs/2211.07140) [B](https://arxiv.org/abs/2211.07140) , and such that F ∗ ( n, m ) = Ψ ∗ ( n, m ) whenever Ψ ∗ ( n, m ) is non-zero. Since B can be covered by sets of the form { ( n + qj, m + j ) : j = 0 , . . . , q − } for n = 1 , . . . , q and m ∈ Z , we can find n = 1 , . . . , q and m ∈ Z such that Ψ ∗

does not vanish identically on this set. By repeating the calculation (9.6) (with i = qm − n ) we see that

F ∗ ( n + qj, m + j ) = f q (˜ aj + ˜ c )

for some integers ˜ a, c ˜ (depending on n , m ) with ˜ a odd. In particular,

f q (˜ aj + ˜ c ) = Ψ ∗ ( n + qj, m + j ) (9.7)

whenever j = 0 , . . . , q − 1 is such that the right-hand side is non-zero.

q

As ˜ a is odd, the left-hand side of (9.7) attains the value (mod q ) at most twice for j = 0 , . . . , q − 1. [On the other hand, at the midpoint between consecutive](https://doi.org/10.1093/imrn/rnad048) values of j [in which the (not identically zero) affine function Ψ](https://arxiv.org/abs/2305.14028) ∗ ( n + qj, m + j )

q

vanishes, this affine function will attain the value of (mod q ). We conclude that Ψ ∗ ( n + qj, m + j ) vanishes for at most three values of j = 0 , . . . , q − 1; meanwhile aj ˜ + ˜ c (mod q ) vanishes for one value of j . Hence by the pigeonhole principle, and the assumption that [q](https://arxiv.org/abs/2303.10798) [is large, the identity](https://arxiv.org/abs/2303.10798)

al ˜ + ˜ c [= Ψ](https://arxiv.org/abs/2305.17743) [∗](https://arxiv.org/abs/2305.17743) [(](https://arxiv.org/abs/2305.17743) [n](https://arxiv.org/abs/2305.17743) [+](https://arxiv.org/abs/2305.17743) [ql, m](https://arxiv.org/abs/2305.17743) [+](https://arxiv.org/abs/2305.17743) [l](https://arxiv.org/abs/2305.17743) [) (mod](https://arxiv.org/abs/2305.17743) [q](https://arxiv.org/abs/2305.17743) [);](https://arxiv.org/abs/2305.17743) l = j, j + 1

holds for two consecutive values l = j, j + 1 of l . Subtracting these two identities [and reducing modulo 2, we conclude that](https://arxiv.org/abs/2309.09504) B ∗ has the same parity as ˜ a and is thus odd. Applying Proposition 9.6, we conclude that there exists a shearing of F ∗

that is in normal form. This concludes the proof of Proposition 9.7, and hence of Theorem 7.8, Theorem 1.4, and Corollary 1.7.

## 10. Open problems

We close by posing some problems left open by our work.

10.1. Explicit bound on dimension. The dimension d produced by our proof of Corollary 1.6 is explicit but extremely large and probably not optimal. This is for a number of reasons, the most significant being that we need an enormous number of functional equations in order to encode the property P Ω ˜ appearing in Section 7. Thus, a natural question is

### Question 10.1. What is the smallest value of d for which Corollary 1.6 (resp. Corollary 1.7) is true?

The fact that our construction originates in the virtually two-dimensional space Z × G hints that Conjectures 1.2 and 1.3 might fail in a “reasonably small” dimension. On the other hand, there may be hope to extend the known positive results on the periodic tiling conjecture beyond the known cases.

### Question 10.2. Is the Conjecture 1.2 true in Z ? Is the Conjecture 1.3 true in R ?

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

### 10.2. Connected tiles. An inspection of our proof of Corollary 1.7 reveals that

d

the tile Σ ⊂ R constructed by the argument is a finite union of cubes; however, this union need not be connected. Given the positive results available for connected tiles (and in particular for topological disks [Ken92, Ken93]), it is natural to ask

[Question 10.3.](https://arxiv.org/abs/2211.07140) Is it possible in Corollary 1.7 to choose Σ to be an open connected set?

Of course the question can be trivially answered without the requirement that Σ is open, simply by adding suitable measure zero line segments to the tile Σ constructed by our arguments. Observe that an aperiodic tiling by translations, rotations and reflections of a convex domain in R was constructed by Schmitt– Conway–Danzer [S96] (aka SCD biprism).

10.3. Cardinality of aperiodic tiles. In view of the results in [S98], it might [be interesting to compute the size of our tile](https://arxiv.org/abs/1608.07167) F in Corollary 1.6.

d

Question 10.4. Suppose that a finite F ⊂ Z admits an aperiodic tiling. What [is the fewest number of prime factors that the cardinality of](https://doi.org/10.1093/imrn/rnad048) [F](https://doi.org/10.1093/imrn/rnad048) can have?

10.4. [Decidability of tilings.](https://arxiv.org/abs/2305.14028) A famous application of the study of the periodicity of tiling is to the problem of determining whether tilings are decidable . Namely, the question whether there exists an algorithm that, upon any input of a finite set F [in a finitely generated abelian group](https://arxiv.org/abs/2303.10798) G , computes (in finite time) [if this set is a tile of](https://doi.org/10.1007/s00454-022-00426-4) [G](https://doi.org/10.1007/s00454-022-00426-4) or not. A well known argument of H. Wang [W75] shows [that if any tile admits a periodic tiling then any tiling problem is decidable.](https://arxiv.org/abs/2305.17743) In this work we prove that there are tiles of finitely generated abelian groups which tile aperiodically. However, the decidability of tilings by a single tile remains [open.](https://arxiv.org/abs/2309.09504)

### Question 10.5. Does there exist any undecidable tiling problem with a single tile?

In a previous paper [GT21] we proved the undeciability of tilings of periodic sets by two tiles. This implies, in particular, the existence of aperiodic tilings by two tiles. Our proof consists of encoding any Wang tiling as a tiling of a periodic set with two tiles; then, the undecidability of Wang tilings [B66, B64] implies the existence of an undecidable tiling problem with only two tiles.

d

### 10.5. Weak periodicity. Let d and F ⊂ Z [be as in Corollary 1.6.](https://doi.org/10.1007/s10801-023-01233-7) [Observe](https://doi.org/10.1007/s10801-023-01233-7)

d d d

that by our construction, all the sets in Tile( F ; Z ) := { A ⊂ Z : A ⊕ F = Z } are

d

( d − 2)-periodic in the sense that for every A ∈ Tile( F ; Z ) there exist d − 2 linearly

d

independent vectors v , . . . , v d − in Z such that A is invariant under translations by v j for every j = 1 , . . . , d − 2.

d

Definition 10.6. A set S ⊂ Z is called k -weakly periodic if it can be partitioned into finitely many sets, each of which is k -periodic.

Note added in proof: the first author and Kolountzakis have answered this question in the affirmative in [GK23]. One can also ask, for an individual tile F , whether the existence of a tiling A ⊕ F = G is logically decidable (i.e., provable or disprovable) in a first-order theory such as ZFC. The two questions are closely related; see [GT21] for further discussion. Note added in proof: we have answered this question in the affirmative in [GT23].

d d

It is not difficult to show that if a tile in Z admits a tiling of Z which is ( d − 1)-weakly periodic then it also admits a tiling which is periodic. Thus, our aperiodic construction contains the largest possible amount of periodicity. In [GT20] we showed that for every F ⊂ Z all the sets in Tile( F ; Z ) are 1-weakly periodic. This, in particular, implies Conjecture 1.2 in Z . The following question remains open.

d

Question 10.7. Let d ⩾ and F ⊂ Z be finite. Are there any A ∈ Tile( F ; Z ) which are not 1 -weakly periodic?

10.6. The structure of our construction. We believe that with additional effort, our analysis should give a complete classification of the space of Sudoku solutions with good columns, and hence also the set of tilings by the tile F in Theorem 1.4, however the answer appears to be somewhat complicated and we do not give it here.

Problem 10.8. Find a complete classification of the space Tile( F ; Z × G ) , where F and G are as in Theorem 1.4. What is the dynamical structure of this space [(viewed as a topological dynamical system with the translation action of](https://doi.org/10.1093/imrn/rnad048) Z × G )?

[Following [L21], it would be of interest to study the tilings in Tile(](https://arxiv.org/abs/2305.14028) F ; Z × G ) that have a substitution structure.

### Question 10.9. Can any of the tilings by our aperiodic tile be interpreted as a substitution tiling?

[The 2-adic nature of the Sudoku solutions suggests a positive answer.](https://arxiv.org/abs/2305.17743)

### References

[AL74] [S. Aanderaa, H. Lewis,](https://arxiv.org/abs/2309.09504) Linear sampling and the ∀∃∀ case of the decision problem , J. Symbolic Logic (1974), 519–548. [AGS92] R. Ammann, B. Gr¨ unbaum and G.C. Shephard, Aperiodic tiles , Disc. Comp. Geom., (1992), 1–25. [AG94] Beyond quasicrystals. Papers from the Winter School held in Les Houches, March 7–18, 1994. Edited by Fran¸ coise Axel and Denis Gratias. [ABJ18] N. Aubrun, S. Barbieri, E. Jeandel, About the Domino Problem for Subshifts on Groups , In: Berth´ e, V., Rigo, M. (eds) Sequences, Groups, and Number Theory. Trends in Mathematics. Birkh¨ auser, Cham (2018). [BKS02] S. Bailey, T. Kim, R. Strichartz, Inside the L´ evy dragon , The American Mathematical Monthly, (2002), 689–703. [BJ08] A. Ballier, E. Jeandel, Tilings and model theory [, JAC 2008, Uz´](https://doi.org/10.1007/s10801-023-01233-7) [es, France, 29–39.](https://doi.org/10.1007/s10801-023-01233-7) [BN91] D. Beauquier, M. Nivat, On translating one polyomino to tile the plane , Discrete Comput. Geom. (1991), no. 6, 575–592. [B66] R. Berger, The undecidability of the domino problem , Memoirs of the American Mathematical Society, (1966) 72. [B64] R. Berger. The Undecidability of the Domino Problem. PhD thesis, Harvard University, 1964. [B26] A.S. Besicovitch, On generalized almost periodic functions , Proc. London Math. Soc., (1926), 495–512. [B20] S. Bhattacharya, Periodicity and Decidability of Tilings of Z , Amer. J. Math., , (2020), 255–266. [C17] D. B. Cohen, The large scale geometry of strongly aperiodic subshifts of finite type, Advances in Mathematics, Volume 308, 2017, 599–626.

In particular, the D coefficient in the pseudo-affine functions (9.1) is somewhat difficult to control.

## A COUNTEREXAMPLE TO THE PERIODIC TILING CONJECTURE

[C96] K. Culik II., An aperiodic set of 13 Wang tiles , Discrete Math., (1996), 245–251. [DB81] N. G. De Bruijn, Algebraic theory of Penrose’s non-periodic tilings of the plane , Kon. Nederl. Akad. Wetensch. Proc. Ser. A 43.84 (1981), 1–7. [FGH] [D. Frettl¨](https://tilings.math.uni-bielefeld.de/) [oh,](https://tilings.math.uni-bielefeld.de/) F. G¨ ahler, E. Harriss: Tilings encyclopedia, [https://tilings.math.uni-](https://tilings.math.uni-) bielefeld.de/. [G77] [M. Gardner, Scientific American January 1977, pp. 110–121.](https://arxiv.org/abs/2211.07140) [G-BN91] D. Girault-Beauquier, M. Nivat, Tiling the plane with one tile , Topology and category theory in computer science (Oxford, 1989), 291–333, Oxford Sci. Publ., Oxford Univ. Press, New York, 1991. [G89] C. Godreche, The sphinx: a limit-periodic tiling of the plane , 1989 J. Phys. A: Math. Gen. L1163. [G70] S. W. Golomb, Tiling with sets of polyominoes , J. Comb. Thy. (1970), 60–71. [GS98] C. Goodman-Strauss, Matching rules and substitution tilings , Ann. of Math. (1998), 181–223. [GS05] C. Goodman-Strauss, A strongly aperiodic set of tiles in the hyperbolic plane Invent. Math. (2005), 119–132. [GS06] [C.](https://arxiv.org/abs/1608.07167) [Goodman-Strauss,](https://arxiv.org/abs/1608.07167) [The](https://arxiv.org/abs/1608.07167) Trilobite and Crab, a full explanation , preprint. [https://arxiv.org/abs/1608.07167.](https://arxiv.org/abs/1608.07167.) [GGRT22] J. Greb´ ık, R. Greenfeld, V. Rozhoˇ n, T. Tao, Measurable tilings by abelian group actions [, International Mathematics Research Notices, Volume 2023, Issue 23, December](https://doi.org/10.1093/imrn/rnad048) 2023, Pages 20211–20251, [https://doi.org/10.1093/imrn/rnad048.](https://doi.org/10.1093/imrn/rnad048.) [[GK23] R. Greenfeld, M. Kolountzakis,](https://arxiv.org/abs/2305.14028) Tiling, spectrality and aperiodicity of connected sets , preprint. [https://arxiv.org/abs/2305.14028.](https://arxiv.org/abs/2305.14028.)

d

[GT20] R. Greenfeld, T. Tao, The structure of translational tilings in Z , Discrete Analysis (2021):16, 28 pp. [GT21] R. [Greenfeld,](https://arxiv.org/abs/2303.10798) [T.](https://arxiv.org/abs/2303.10798) [Tao,](https://arxiv.org/abs/2303.10798) [Undecidable](https://arxiv.org/abs/2303.10798) translational tilings with only two tiles, [or](https://doi.org/10.1007/s00454-022-00426-4) [one](https://doi.org/10.1007/s00454-022-00426-4) [nonabelian](https://doi.org/10.1007/s00454-022-00426-4) [tile](https://doi.org/10.1007/s00454-022-00426-4) [,](https://doi.org/10.1007/s00454-022-00426-4) [Discrete](https://doi.org/10.1007/s00454-022-00426-4) Comput Geom 70, 1652–1706 (2023). [https://doi.org/10.1007/s00454-022-00426-4.](https://arxiv.org/abs/2305.17743) [[GT22] R. Greenfeld, T. Tao,](https://arxiv.org/abs/2209.08451) A counterexample to the periodic tiling conjecture (announcement) , [https://arxiv.org/abs/2209.08451.](https://arxiv.org/abs/2209.08451.) [GT23] R. [Greenfeld,](https://arxiv.org/abs/2309.09504) [T.](https://arxiv.org/abs/2309.09504) [Tao,](https://arxiv.org/abs/2309.09504) Undecidability of translational monotilings , [https://arxiv.org/abs/2309.09504.](https://arxiv.org/abs/2309.09504.) [GS87] B. Gr¨ unbaum, G.C. Shephard, Tilings and Patterns. W.H. Freeman, 1987. [JR21] W. Jeandel, M. Rao, An aperiodic set of 11 Wang tiles , Adv. Comb. 2021, Paper No. 1, 37 pp. [JV20] E. Jeandel, P. Vanier, The undecidability of the Domino Problem. Substitution and tiling dynamics: introduction to self-inducing structures, 293–357, Lecture Notes in Math., 2273, Springer, Cham, [2020] [K96] J. Kari, A small aperiodic set of Wang tiles , Discrete Math., (1996), 259–264. [Ken92] R. Kenyon, Rigidity of planar tilings , Invent. Math., (1992), 637–651. [Ken93] R. Kenyon, Erratum: “Rigidity of planar tilings” , Invent. Math., (1993), 223. [KT22] A. Khare, A. Tikaradze, [Recovering affine-linearity of functions from their restrictions](https://doi.org/10.1007/s10801-023-01233-7) [to affine lines](https://doi.org/10.1007/s10801-023-01233-7) , J Algebr Comb 58, 761–773 (2023). [https://doi.org/10.1007/s10801-023-](https://doi.org/10.1007/s10801-023-) 01233-7 [K04] M. N. Kolountzakis, The Study of Translational Tiling with Fourier Analysis , In: Brandolini, L., Colzani, L., Travaglini, G., Iosevich, A. (eds) Fourier Analysis and Convexity. Applied and Numerical Harmonic Analysis. Birkh¨ auser, Boston, MA (2004). [KL96] M. N. Kolountzakis, J. C. Lagarias, Structure of tilings of the line by a function , Duke Math. J. (1996), 653–678. [L21] S. Labb´ e, Substitutive Structure of Jeandel–Rao Aperiodic Tilings , Discrete Comput Geom (2021), 800–855. [LS92] J. Lagarias, P. Shor, Keller’s cube-tiling conjecture is false in high dimensions , Bull. Amer. Math. Soc. (N.S.) (1992), no. 2, 279–283. [LW96] J. C. Lagarias, Y. Wang, Tiling the line with translates of one tile , Invent. Math. (1996), no. 1-3, 341–365. [LM91] H. Leptin, D. M¨ uller, Uniform partitions of unity on locally compact groups , Adv. Math. (1991), no. 1, 1–14.

[L13] L.A. Levin, Forbidden information , Journal of the ACM, (2013), 1–9. [L79] H. Lewis, Unsolvable classes of quantificational formulas. Addison-Wesley Publishing Co., Reading, Mass., 1979. [M80] [P. McMullen,](https://tilings.math.uni-bielefeld.de/) Convex bodies which tile space by translations , Mathematika (1980), 113–121. [[MSS22] T. Meyerovitch, S. Sanadhya, Y. Solomon,](https://arxiv.org/abs/2211.07140) A note on reduction of tiling problems , [https://arxiv.org/abs/2211.07140.](https://arxiv.org/abs/2211.07140.) [M89] S. Mozes, Tilings, substitution systems and dynamical systems generated by them , J. Anal. Math. (1989), 139–186. [M97] S. Mozes, Aperiodic tilings , Invent. math. (1997), 603–611. [N77] D. J. Newman, Tesselation of integers , J. Number Theory (1977), no. 1, 107–111. [O09] N. Ollinger, Tiling the plane with a fixed number of polyominoes , Lecture Notes in Comput. Sci., 5457, Springer, Berlin, 2009. [P74] R. Penrose, The role of aesthetics in pure and applied mathematical research , Bull. Inst. Math. Appl. (1974), 266–271. [P79] R. Penrose, Pentaplexity a class of non-periodic tilings of the plane , The Mathematical [Intelligencer](https://arxiv.org/abs/1608.07167) [2.1](https://arxiv.org/abs/1608.07167) [(1979), 32–37.](https://arxiv.org/abs/1608.07167) [R71] R. M. Robinson, Undecidability and nonperiodicity for tilings of the plane , Inventiones Mathematicae, (1971), (3), 177-–209. [SSU21] A. S ¸ahin, M. Schraudner, I. Ugarcovici, [A strongly aperiodic shift of finite type on the](https://doi.org/10.1093/imrn/rnad048) discrete Heisenberg group using Robinson tilings , Illinois J. Math. (2021), 655–686. [S96] M. Senechal, [7.2 The SCD (Schmitt–Conway–Danzer) tile](https://arxiv.org/abs/2305.14028) , Quasicrystals and Geometry, Cambridge University Press (1996), pp. 209–213. [ST12] J. E. S. Socolar, J. M. Taylor, Forcing Nonperiodicity with a Single Tile , Math Intelligencer 34 (2012), 18–28. [[SMKGS23a] D. Smith, J. S. Myers, C. S. Kaplan, C. Goodman-Strauss,](https://arxiv.org/abs/2303.10798) An aperiodic monotile , [preprint. [https://arxiv.org/abs/2303.10798.](https://arxiv.org/abs/2303.10798.)](https://doi.org/10.1007/s00454-022-00426-4) [[SMKGS23b] D. Smith, J. S. Myers, C. S. Kaplan, C. Goodman-Strauss,](https://arxiv.org/abs/2305.17743) A chiral aperiodic [monotile](https://arxiv.org/abs/2209.08451) [, preprint. [https://arxiv.org/abs/2305.17743.](https://arxiv.org/abs/2305.17743.)](https://arxiv.org/abs/2209.08451) [S74] S. Stein, Algebraic tiling , Amer. Math. Monthly, (1974), 445–462. [S98] [M. Szegedy,](https://arxiv.org/abs/2309.09504) Algorithms to tile the infinite grid with finite clusters , Proceedings of the 39th Annual Symposium on Foundations of Computer Science (FOCS ’98), IEEE Computer Society, Los Alamitos, CA, (1998), 137–145. [TZ16] T. Tao, T. Ziegler, Concatenation theorems for anti-Gowers-uniform functions and Host- Kra characteristic factors , Discrete Anal. (2016), Paper No. 13, 60 pp. [Th90] W.P. Thurston, Groups, tilings, and finite state automata , Lecture notes, AMS Colloquium lectures (1990). [V54] B. A. Venkov, On a class of Euclidean polyhedra , Vestnik Leningrad Univ. Ser. Math. Fiz. Him. (1954), 11–31. [WW23] J. Walton, M. Whittaker, An aperiodic tile with edge-to-edge orientational matching rules , Journal of the Institute of Mathematics of Jussieu, (2023), 1727–1755. [W60] H. Wang, Proving theorems by pattern recognition I. [, Communications of the ACM,](https://doi.org/10.1007/s10801-023-01233-7) (1960), 220–234. [W75] H. Wang, Notes on a class of tiling problems , Fundamenta Mathematicae, (1975), 295–305.

School of Mathematics, Institute for Advanced Study, Princeton, NJ 08540. Email address : greenfeld.math@gmail.com

UCLA Department of Mathematics, Los Angeles, CA 90095-1555. Email address : tao@math.ucla.edu