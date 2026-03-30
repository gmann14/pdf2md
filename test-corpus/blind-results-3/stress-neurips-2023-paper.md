---
title: "Module-wise Training of Neural Networks via the Minimizing Movement Scheme"
---

# Module-wise Training of Neural Networks via the Minimizing Movement Scheme

| Skander Karkar              | Ibrahim Ayed                |
| --------------------------- | --------------------------- |
| Criteo, Sorbonne Université | Sorbonne Université, Thales |

| Emmanuel de Bézenac | Patrick Gallinari           |
| ------------------- | --------------------------- |
| ETH Zurich          | Criteo, Sorbonne Université |

## Abstract

Greedy layer-wise or module-wise training of neural networks is compelling in constrained and on-device settings where memory is limited, as it circumvents a number of problems of end-to-end back-propagation. However, it suffers from a stagnation problem, whereby early layers overfit and deeper layers stop increasing the test accuracy after a certain depth. We propose to solve this issue by introducing a module-wise regularization inspired by the minimizing movement scheme for gradient flows in distribution space. We call the method TRGL for Transport Regularized Greedy Learning and study it theoretically, proving that it leads to greedy modules that are regular and that progressively solve the task. Experimentally, we show improved accuracy of module-wise training of various architectures such as ResNets, Transformers and VGG, when our regularization is added, superior to that of other module-wise training methods and often to end-to-end training, with as much as 60% less memory usage.

## Introduction

End-to-end backpropagation is the standard training method of neural networks. However, it requires storing the whole model and computational graph during training, which requires large memory consumption. It also prohibits training the layers in parallel. Dividing the network into modules, a module being made up of one or more layers, accompanied by auxiliary classifiers, and greedily solving module-wise optimization problems sequentially (i.e. one after the other fully) or in parallel (i.e. at the same time batch-wise), consumes much less memory than end-to-end training as it does not need to store as many activations, and when done sequentially, only requires loading and training one module (so possibly one layer) at a time. Module-wise training has therefore been used in constrained settings in which end-to-end training can be impossible such as training on mobile devices [58, 57] and dealing with very large whole slide images [65]. When combined with batch buffers, parallel module-wise training also allows for parallel training of the modules [8]. Despite its simplicity, module-wise training has been recently shown to scale well [8, 47, 60, 45], outperforming more complicated alternatives to end-to-end training such as synthetic [33, 14] and delayed [32, 31] gradients, while having superior memory savings.

In a classification task, module-wise training splits the network into successive modules, a module being made up of one or more layers. Each module takes as input the output of the previous module, and each module has an auxiliary classifier so that a local loss can be computed, with backpropagation happening only inside the modules and not between them (see Figure 1 below).

The main drawback of module-wise training is the well-documented stagnation problem observed in [43, 7, 60, 47], whereby early modules overfit and learn more discriminative features than end-to-end

37th Conference on Neural Information Processing Systems (NeurIPS 2023).

training, destroying task-relevant information, and deeper modules don’t improve the test accuracy significantly, or even degrade it, which limits the deployment of module-wise training. We further highlight this phenomenon in Figures 2 and 3 in Section 4.4. To tackle this issue, InfoPro [60] propose to maximize the mutual information that each module keeps with the input, in addition to minimizing the loss. [7] make the auxiliary classifier deeper and Sedona [47] make the first module deeper. These last two methods lack a theoretical grounding, while InfoPro requires a second auxiliary network for each module besides the classifier. We propose a different perspective, leveraging the analogy between residual connections and the Euler scheme for ODEs [61]. To preserve input information, we minimize the kinetic energy of the modules along with the training loss. Intuitively, this forces the modules to change their input as little as possible. We leverage connections with the theories of gradient flows in distribution space and optimal transport to analyze our method theoretically.

Figure 1: Module-wise training.

Our approach is particularly well-adapted to networks that use residual connections such as ResNets [27, 28], their variants (e.g. ResNeXt [62], Wide ResNet [63], EfficientNet [56] and MobileNetV2 [48]) and vision transformers that are made up essentially of residual connections [39, 17], but is immediately usable on any network where many layers have the same input and output dimension such as VGG [52]. Our contributions are the following:

- We propose a new method for module-wise training. Being a regularization, it is lighter than many recent state-of-the-art methods (PredSim [45], InfoPro [60]) that train another auxiliary network besides the auxiliary classifier for each module.

- We theoretically justify our method, proving that it is a transport regularization that forces the module to be an optimal transport map making it more regular and stable. We also show that it amounts to a discretization of the gradient flow of the loss in probability space, which means that the modules progressively minimize the loss and explains why the method avoids the accuracy collapse observed in module-wise training.

- Experimentally, we consistently improve the test accuracy of module-wise trained networks (ResNets, VGG and Swin-Transformer) beating 8 other methods, in sequential and parallel module-wise training, and also in multi-lap sequential training, a variant of sequential module-wise training that we introduce and that performs better in many cases. In particular, our regularization makes parallel module-wise training superior or comparable in accuracy to end-to-end training, while consuming 10% to 60% less memory.

## Transport-regularized module-wise training

The typical setting of (sequential) module-wise training for minimizing a loss L , is, given a dataset D , to solve one after the other, for ≤ k ≤ K , Problems ∑ ( T k , F k ) ∈ arg min L ( F, T ◦ G k − ( x )) (1)

T,F x ∈D

where G k = T k

- ...
- T for ≤ k ≤ K , G = id , T k is the module (one or many layers) and F k is an auxiliary classifier. Module T k receives the output of module T k − , and auxiliary classifier F k

computes the prediction from the output of T k so the loss can be computed. The inputs are x and L has access to their labels y to calculate the loss. i.e. L ( F, T

- G k − ( x )) = l ( F
- T
- G k − ( x ) , y ) where l is a machine learning loss such as cross-entropy. See Figure 1. The final network trained this way is F K
- G K . But, at inference, we can stop at any depth k and use F k
- G k if it performs better. Indeed, an intermediate module often performs as well or better than the last module because of the early overfitting and subsequent stagnation or collapse problem of module-wise training [43, 7, 60, 47].

We propose below in (2) a regularization that avoids the destruction of task-relevant information by the early modules by forcing them to minimally modify their input. Proposition 2.2 proves that by using our regularization (2), we are indeed making the modules build upon each other to solve the task, which is the property we desire in module-wise training, as the modules now act as successive proximal optimization steps in the minimizing movement scheme optimization algorithm for maximizing the separability of the data representation. The background on optimal transport (OT), gradient flows and the minimizing movement scheme is in Appendices A and B.

## 2.1 Method statement

To keep greedily-trained modules from overfitting and destroying information needed later, we penalize their kinetic energy to force them to preserve the geometry of the problem as much as possible. If each module is a single residual block (that is a function T = id + r , which includes many transformer architectures [39, 17]), its kinetic energy is simply the squared norm of its residue r = T − id , which we add to the loss L in the target of the greedy problems (1). All layers that have the same input and output dimension can be rewritten as residual blocks and the analysis applies to a large variety of architectures such as VGG [52]. Given τ > , we now solve, for ≤ k ≤ K , Problems ∑

τ τ τ τ τ

( T k

, F k

) ∈ arg min L ( F, T ◦ G k −

( x )) + ‖ T ◦ G k −

( x ) − G k −

( x ) ‖ (2)

T,F τ

x ∈D

τ τ τ τ τ τ

where G k

= T k

- .. ◦ T for ≤ k ≤ K and G = id . The final network is F K

- G K

. Intuitively, this biases the modules towards moving the points as little as possible, thus at least keeping the performance of the previous module. Residual connections are already biased towards small displacements and this bias is desirable and should be encouraged [35, 64, 26, 15, 36]. But the method can be applied to any module where T ( x ) and x have the same dimension so that T ( x ) − x can be computed.

To facilitate the theoretical analysis, we rewrite the method in a more general formulation using data distribution ρ , which can be discrete or continuous, and the distribution-wide loss L that arises from the point-wise loss L . Then Problem (2) is equivalent to Problem ∫

τ τ τ τ

( T k

, F k

) ∈ arg min L ( F, T ] ρ k

) + ‖ T ( x ) − x ‖ d ρ k

( x ) (3)

T,F τ Ω

τ τ τ τ τ

∫ τ ∫ τ

with ρ k +1

=( T k

) ] ρ k

, ρ = ρ and L ( F, T ] ρ k

) = L ( F, T ( x )) d ρ k

( x ) = L ( F, z ) d T ] ρ k

( x ) .

## 2.2 Link with the minimizing movement scheme

We now formulate our main result: solving Problems (3) is equivalent to following a minimizing movement scheme (MMS) [50] in distribution space for minimizing Z ( μ ) := min F L ( F, μ ) , which

τ

is the loss of the best classifier. If we are limited to linear classifiers, Z ( ρ k

) is the linear separability

τ

of the representation ρ k

at module k of the data distribution ρ . The MMS, introduced in [24, 23], is a metric counterpart to Euclidean gradient descent for minimizing functionals over distributions. In our case, Z is the functional we want to minimize. We define the MMS below in Definition 2.1

The distribution space we work in is the metric Wasserstein space W (Ω) = ( P (Ω) , W ) , where

d

Ω ⊂ R is a convex compact set, P (Ω) is the set of probability distributions over Ω and W is the Wasserstein distance over P (Ω) derived from the optimal transport problem with Euclidean cost: ∫ W ( α, β ) = min ‖ T ( x ) − x ‖ d α ( x ) (4)

T s.t. T ] α = β Ω

where we assume that ∂ Ω is negligible and that the distributions are absolutely continous.

τ

Definition 2.1. Given Z : W (Ω) → R , and starting from ρ ∈ P (Ω) , the Minimizing Movement Scheme (MMS) takes proximal steps for minimizing Z . It is s given by

τ τ

ρ k +1

∈ arg min Z ( ρ ) + W ( ρ, ρ k

) (5)

ρ ∈P (Ω) τ

The MMS (5) can be seen as a non-Euclidean implicit Euler step for following the gradient flow of

τ

Z , and ρ k

converges to a minimizer of Z under some conditions (see the end of this section).

So under the mentioned assumptions on Ω and absolute continuity of the distributions, we have that Problems (3) are equivalent to the minimizing movement scheme (5):

τ τ τ τ

Proposition 2.2. The distributions ρ k +1

= ( T k

) ] ρ k

, where the functions T k

### are found by solving

τ

(3) and ρ = ρ is the data distribution, coincide with the MMS (5) for Z = min F L ( F, . ) .

τ τ τ

Proof. The minimizing movement scheme (5) is equivalent to taking ρ k +1

= ( T k

) ] ρ k

where

τ τ τ τ

T k

∈ arg min Z ( T ] ρ k

) + W ( T ] ρ k

, ρ k

) (6)

T :Ω → Ω τ

τ

under conditions that guarantee the existence of a transport map between ρ k

and any other measure,

τ τ

and absolute continuity of ρ k

suffices, and the loss can ensure that ρ k +1

is also absolutely continuous.

τ τ τ

Among the functions T k

that solve problem (6), is the optimal transport map from ρ k

to ρ k +1

## . To solve specifically for this optimal transport map, we have to solve the equivalent Problem ∫

τ τ τ

T k

∈ arg min Z ( T ] ρ k

) + ‖ T ( x ) − x ‖ d ρ k

( x ) (7)

T τ Ω

Problems (6) and (7) have the same minimum value, but the minimizer of (7) is now an optimal

τ τ

transport map between ρ k

and ρ k +1

. This is immediate from the definition (4) of the W distance. Equivalently minimizing first over F and then over T in (3), it follows from the definition of Z that Problems (3) and (7) are equivalent, which concludes.

Since we solve Problems (3) over neural networks, their representation power shown by universal approximation theorems [13, 29] is important to get close to equivalence between (5) and (3), as we need to approximate an optimal transport map. We also know that the training of each module, if it is shallow, converges [5, 6, 34, 22, 18].

If Z is lower-semi continuous then Problems (5) always admit a solution because P (Ω) is compact.

τ

If Z is also λ -geodesically convex for λ> , we have convergence of ρ k

as k →∞ and τ → to a minimizer of Z , potentially under more technical conditions (see Appendix B). Even though a machine learning loss will usually not satisfy these conditions, this analysis offers hints as to why our method avoids in practice the problem of stagnation or collapse in performance of module-wise training as k increases, as we are making proximal local steps in Wasserstein space to minimize the loss. This convergence discussion also suggests taking τ as small as possible and many modules.

## 2.3 Regularity result

τ

As a secondary result, we show that Problem (3) has a solution and that the solution module T k

is an optimal transport map between its input and output distributions, which means that it comes with some regularity. [36] show that these networks generalize better and overfit less in practice. We

τ

assume that the minimization in F is over a compact set F , that ρ k

is absolutely continuous, that L is continuous and non-negative, that Ω is convex and compact and that ∂ Ω is negligible.

τ τ τ

Proposition 2.3. Problem (3) has a minimizer ( T k

, F k

) such that T k

is an optimal transport map.

τ τ τ

And for any minimizer ( T k

, F k

) , T k

is an optimal transport map.

The proof is in Appendix C. OT maps have regularity properties under some boundedness assumptions.

τ

Given Theorem A.1 in Appendix A taken from [20], T k

is η -Hölder continuous almost everywhere and if the optimization algorithm we use to solve the discretized problem (2) returns an approximate

τ τ τ

solution pair (  F ˜ ˜ τ k

## , T ˜

k

) such that T k

is an  -optimal transport map, i.e. ‖ T ˜ τ k

− T k

‖ ∞ ≤  , then we

τ

have (using the triangle inequality) the following stability property of the module T ˜

k : τ η

‖ T ˜ τ k

### ( x ) − T ˜

k

( y ) ‖ ≤  + C ‖ x − y ‖ (8)

τ τ τ

for almost every x, y ∈ supp ( ρ k

) and C> . Composing these stability bounds on T k

and T ˜

k

allows

τ τ

G G ˜ τ τ

to get bounds for the composition networks k

and ˜

k

## =  T ˜

k

- .. ◦ T .

To summarize Section 2, the transport regularization makes each module more regular and it allows the modules to build on each other as k increases to solve the task, which is the property we desire.

## Practical implementation

## 3.1 Multi-block modules

For simplicity, we presented in (2) the case where each module is a single residual block. However, in practice, we often split the network into modules that are made-up of many residual blocks each. We show here that regularizing the kinetic energy of such modules still amounts to a transport regularization, which means that the theoretical results in Propositions 2.2 and 2.3 still apply.

If each module T k is made up of M residual blocks, i.e. applies x m +1 = x m + r m ( x m ) for ≤ m<M , then its total discrete kinetic energy for a single data point ∑ x is the sum of its squared residue norms ‖ r m ( x m ) ‖ , since a residual network can be seen as a discrete Euler scheme for an ordinary differential equation [61] with velocity field r :

x m +1 = x m + r m ( x m ) ←→ ∂ t x t = r t ( x t ) (9) ∑ ∫ and ‖ r m ( x m ) ‖ is then the discretization of the total kinetic energy ‖ r t ( x ) ‖ d t of the ODE.

x

If ψ m

denotes the position of a point x after m residual blocks, then regularizing the kinetic energy of multi-block modules now means solving

∑ M ∑

− τ τ τ x

( T k

, F k

) ∈ arg min ( L ( F, T ( G k −

( x )) + ‖ r m ( ψ m

) ‖ ) (10)

T,F τ

x ∈D m =0 x τ x x x

s.t. T = ( id + r M − )

- ...
- ( id + r ) , ψ = G k −

( x ) , ψ m +1

= ψ m

+ r m ( ψ m

)

τ τ τ τ

where G k

= T k

- .. ◦ T for ≤ k ≤ K and G = id . We also minimize this sum of squared residue norms instead of ‖ T ( x ) − x ‖ (the two no longer coincide) as it works better in practice, which we assume is because it offers a more localized control of the transport. As expressed in (9), a residual network can be seen as an Euler scheme of an ODE and Problem (10) is then the discretization of ∫

τ τ τ ( T k , F k

) ∈ arg min L ( F, T ] ρ k

) + ‖ v t ‖ L (( φ

- 

T,F τ t

) ] ρ τ k )

d t (11)

- x x ·

s.t. T = φ , ∂ t φ t

= v t ( φ t

) , φ = id

τ τ τ

where ρ k +1

= ( T k

) ] ρ k

and r m is the discretization of vector field v t at time t = m/M . Here,

τ τ

distributions ρ k

are pushed forward through the maps T k

which correspond to the flow φ at time t = 1 of the kinetically-regularized velocity field v t . We recognize in the second term in the target of (11) the optimal transport problem in its dynamic formulation (15) from [9], and given the equivalence between the Monge OT problem (4) and the dynamic OT problem (15) in Appendix A, Problem (11) is in fact equivalent to the original continuous formulation (3), and the theoretical results in Section 2 follow immediately (see also the proof of Proposition 2.3 in Appendix C).

## 3.2 Solving the module-wise problems

The module-wise problems can be solved in two ways. One can completely train each module with its auxiliary classifier for N epochs before training the next module, which receives as input the output of the previous trained module. We call this sequential module-wise training. But we can also do this batch-wise, i.e. do a complete forward pass on each batch but without a full backward pass, rather a

τ τ

backward pass that only updates the current module T k

and its auxiliary classifier F k

, meaning that

τ τ

T k

forwards its output to T k +1

immediately after it computes it. We call this parallel module-wise training. It is called decoupled greedy training in [8], which shows that combining it with batch buffers solves all three locking problems and allows a linear training parallelization in the depth of the network. We propose a variant of sequential module-wise training that we call multi-lap sequential module-wise training, in which instead of training each module for N epochs, we train each module from the first to the last sequentially for N/R epochs, then go back and train from the first module to

the last for N/R epochs again, and we do this for R laps. For the same total number of epochs and training time, and the same advantages (loading and training one module at a time) this provides a non-negligible improvement in accuracy over normal sequential module-wise training in most cases, as shown in Section 4. Despite our theoretical framework being that of sequential module-wise training, our method improves the test accuracy of all three module-wise training regimes.

## 3.3 Varying the regularization weight

The discussion in Section 2.2 suggests taking a fixed weight τ for the transport cost that is as small as possible. However, instead of using a fixed τ , we might want to vary it along the depth k to further constrain with a smaller τ k the earlier modules to avoid that they overfit or the later modules to maintain the accuracy of earlier modules. We might also want to regularize the network further in earlier epochs when the data is more entangled. We propose in Appendix D to formalize this varying weight τ k,i across modules k and SGD iterations i by using a scheme inspired by the method of multipliers to solve Problems (2) and (10). However, it works best in only one experiment in practice. The observed dynamics of τ k,i suggest simply finding a fixed value of τ that is multiplied by 2 for the second half of the network, which works best in all the other experiments (see Appendix E).

## Experiments

We call our method TRGL for Transport-Regularized Greedy Learning. For the auxiliary classifiers, we use the architecture from DGL [7, 8], that is a convolution followed by an average pooling and a fully connected layer, which is very similar to that used by InfoPro [60], except for the Swin Transformer where we use a linear layer. We call vanilla greedy module-wise training with the same architecture but without our regularization VanGL, and we include its results in all tables for ablation study purposes. The code is available at github.com/block-wise/module-wise and implementation details are in Appendix E.

## 4.1 Parallel module-wise training

To compare with other methods, we focus first on parallel training, as it performs better than sequential training and has been more explored recently. The first experiment is training in parallel 3 residual architectures and a VGG-19 [52] divided into 4 modules of equal depth on TinyImageNet. We compare in Table 1 our results in this setup to three of the best recent parallel module-wise training methods: DGL [8], PredSim [45] and Sedona [47], from Table 2 in [47]. We find that our TRGL has a much better test accuracy than the three other methods, especially on the smaller architectures. It also performs better than end-to-end training on the three ResNets. Parallel TRGL in this case with 4 modules consumes to 21% less memory than end-to-end training (with a batch size of 256).

Table 1: Test accuracy of parallel TRGL with 4 modules (average and 95 % confidence interval over 5 runs) on TinyImageNet, compared to DGL, PredSim, Sedona and E2E from Table 2 in [47], with memory saved compared to E2E as a percentage of E2E memory consumption in red.

Architecture Parallel VanGL Parallel TRGL (ours) PredSim DGL Sedona E2E

| VGG-19     | 56.17 | ±   | 0.29 ( | ↓   | 27% | )   | 57.28 | ±   | 0.20 ( | ↓   | 21% | )   | 44.70 | 51.40 | 56.56 | 58.74 |
| ---------- | ----- | --- | ------ | --- | --- | --- | ----- | --- | ------ | --- | --- | --- | ----- | ----- | ----- | ----- |
| ResNet-50  | 58.43 | ±   | 0.45 ( | ↓   | 26% | )   | 60.30 | ±   | 0.58 ( | ↓   | 20% | )   | 47.48 | 53.96 | 54.40 | 58.10 |
| ResNet-101 | 63.64 | ±   | 0.30 ( | ↓   | 24% | )   | 63.71 | ±   | 0.40 ( | ↓   | 11% | )   | 53.92 | 53.80 | 59.12 | 62.01 |
| ResNet-152 | 63.87 | ±   | 0.16 ( | ↓   | 21% | )   | 64.23 | ±   | 0.14 ( | ↓   | 10% | )   | 51.76 | 57.64 | 64.10 | 62.32 |

The second experiment is training in parallel two ResNets divided into 2 modules on CIFAR100 [37]. We compare in Table 2 our results in this setup to the two delayed gradient methods DDG [32] and FR [31] from Table 2 in [31]. Here again, parallel TRGL has a better accuracy than the other two methods and than end-to-end training. With only two modules, the memory gains from less backpropagation are neutralized by the weight of the extra classifier and there are negligible memory savings compared to end-to-end training. However, parallel TRGL has a better test accuracy by up to almost 2 percentage points.

Table 2: Test accuracy of parallel TRGL with 2 modules (average and 95 % confidence interval over 3 runs) on CIFAR100, compared to DDG, FR and E2E from Table 2 in [31].

Architecture Parallel VanGL Parallel TRGL (ours) DDG FR E2E

| ResNet-101 | 77.31 | ±   | 0.27 | 77.87 | ±   | 0.44 | 75.75 | 76.90 | 76.52 |
| ---------- | ----- | --- | ---- | ----- | --- | ---- | ----- | ----- | ----- |
| ResNet-152 | 75.40 | ±   | 0.75 | 76.55 | ±   | 1.90 | 73.61 | 76.39 | 74.80 |

The third experiment is training in parallel a ResNet-110 divided into two, four, eight and sixteen modules on STL10 [12]. We compare in Table 3 our results in this setup to the recent methods InfoPro [60] and DGL [8] from Table 2 in [60]. TRGL largely outperforms the other methods. It also outperforms end-to-end training in all but one case (that with 16 modules). With a batch size of 64, memory savings of parallel TRGL compared to end-to-end training reach 48% and . 5% with 8 and 16 modules respectively, with comparable test accuracy. With 4 modules, TRGL training weighs 24% less than end-to-end-training, and has a test accuracy that is better by percentage points (see Section 4.2 and Table 6 for a detailed memory usage comparison with InfoPro).

Table 3: Test accuracy of Parallel (Par) TRGL with K modules (average and 95 % confidence interval over 5 runs) using a ResNet-110 on STL10, compared to DGL, two variants of InfoPro and E2E from Table 2 in [60].

K Par VanGL Par TRGL (ours) DGL InfoPro S InfoPro C E2E

| 79.85 | ±   | 0.93 | 80.04 | ±   | 0.85 | 75.03 | ±   | 1.18 | 78.98 | ±   | 0.51 | 79.01 | ±   | 0.64 | 77.73 | ±   | 1.61 |
| ----- | --- | ---- | ----- | --- | ---- | ----- | --- | ---- | ----- | --- | ---- | ----- | --- | ---- | ----- | --- | ---- |
| 77.11 | ±   | 2.31 | 79.72 | ±   | 0.81 | 73.23 | ±   | 0.64 | 78.72 | ±   | 0.27 | 77.27 | ±   | 0.40 | 77.73 | ±   | 1.61 |
| 75.71 | ±   | 0.55 | 77.82 | ±   | 0.73 | 72.67 | ±   | 0.24 | 76.40 | ±   | 0.49 | 74.85 | ±   | 0.52 | 77.73 | ±   | 1.61 |
| 73.57 | ±   | 0.95 | 77.22 | ±   | 1.20 | 72.27 | ±   | 0.58 | 73.95 | ±   | 0.71 | 73.73 | ±   | 0.48 | 77.73 | ±   | 1.61 |

The fourth experiment is training (from scratch) in parallel a Swin-Tiny Transformer [39] divided into 4 modules on three datasets. We compare in Table 4 our results with those of InfoPro [60] and InfoProL, a variant of InfoPro proposed in [46]. TRGL outperforms the other module-wise training methods. It does not outperform end-to-end training in this case, but consumes 29% less memory on CIFAR10 and CIFAR100 and 50 % less on STL10, compared to 38% for InfoPro and 45% for InfoProL in [46].

Table 4: Test accuracy of parallel TRGL with 4 modules (average and 95 % confidence interval over 5 runs) on a Swin-Tiny Transformer, compared to InfoPro, InfoProL and E2E from Table 3 in [46], with memory saved compared to E2E as a percentage of E2E memory consumption in red.

Dataset Parallel VanGL Parallel TRGL (ours) InfoPro InfoProL E2E

| STL10    | 67.00 | ±   | 1.36 ( | ↓   | 55% | )   | 67.92 | ±   | 1.12 ( | ↓   | 50% | )   | 64.61 ( | ↓   | 38% | )   | 66.89 ( | ↓   | 45% | )   | 72.19 |
| -------- | ----- | --- | ------ | --- | --- | --- | ----- | --- | ------ | --- | --- | --- | ------- | --- | --- | --- | ------- | --- | --- | --- | ----- |
| CIFAR10  | 83.94 | ±   | 0.42 ( | ↓   | 33% | )   | 86.48 | ±   | 0.54 ( | ↓   | 29% | )   | 83.38 ( | ↓   | 38% | )   | 86.28 ( | ↓   | 45% | )   | 91.37 |
| CIFAR100 | 69.34 | ±   | 0.91 ( | ↓   | 33% | )   | 74.11 | ±   | 0.31 ( | ↓   | 29% | )   | 68.36 ( | ↓   | 38% | )   | 73.00 ( | ↓   | 45% | )   | 75.03 |

Finally, we compare our method to InfoPro, DGL and Sedona in Table 5 below on a large scale experiment on ImageNet.

Table 5: Top 1 test accuracy of parallel TRGL with 2 modules on a ResNet-101 trained on ImageNet, compared to VanGL (baseline vanilla module-wise training), DGL and Sedona from [47] and InfoPro from [60] and end-to-end training.

Dataset Parallel VanGL Parallel TRGL (ours) DGL Sedona InfoPro E2E

ImageNet 78.11 79.41 78.47 79.28 78.15 78.71

## 4.2 Memory savings and training time

As seen above, parallel TRGL is lighter than end-to-end training by up to almost 60% . The extra memory consumed by our regularization compared to parallel VanGL is between 2 and 13% of

end-to-end memory. Memory savings depend then mainly on the size of the auxiliary classifier, which can easily be adjusted. Note that delayed gradients method DDG and FR increase memory usage [31], and Sedona does not claim to save memory, but rather to speed up training [47]. DGL is architecture-wise essentially identical to VanGL and consumes the same memory.

We compare in Table 6 the memory consumption of our method to that of InfoPro [60] on a ResNet- 110 on STL10 with a batch size of 64 (so the same setting as in Table 3). InfoPro [60] also propose to split the network into modules that have the same weight but not necessarily the same number of layers. They only implement this for K ≤ modules. When the modules are even in weight and not in depth, we call the training methods VanGL*, TRGL* and InfoPro*. In practice, this leads to shallower early modules which slightly hurts performance according to [47], and as seen below. However, TRGL* still outperforms InfoPro and end-to-end training, and it leads to even bigger memory savings than InfoPro*. We see in Table 6 below that TRGL saves more memory than InfoPro in two out of three cases (4 and 8 modules), and about the same in the third case (16 modules), with much better test accuracy in all cases. Likewise, TRGL* is lighter than InfoPro*, with better accuracy.

| Table 6: Memory savings using a ResNet-110 on STL10 split into          | K   | modules trained in parallel with |
| ----------------------------------------------------------------------- | --- | -------------------------------- |
| runs is between brackets. Test accuracy of end-to-end training is 77.73 | %   | .                                |

Equally deep modules Equally heavy modules

K Par VanGL Par TRGL (ours) InfoPro Par VanGL* Par TRGL* (ours) InfoPro*

| %   | (75.71) | %   | (   | 77.82 | )   | %   | (76.40) |
| --- | ------- | --- | --- | ----- | --- | --- | ------- |
| %   | (73.57) | %   | (   | 77.22 | )   | %   | (73.95) |

However, parallel module-wise training does slightly slow down training. Epoch time increases by 6% with 2 modules and by 16% with 16 modules. TRGL is only slower than VanGL by 2% for all number of modules due to the additional regularization term. This is comparable to InfoPro which reports a time overhead between 1 and 27% compared to end-to-end training. See Appendix F for details.

## 4.3 Sequential full block-wise training

Block-wise sequential training, meaning that each module is a single residual block and that the blocks are trained sequentially, therefore requiring only enough memory to train one block and its classifier. Even though it has been less explored in recent module-wise training methods, it has been used in practice in very constrained settings such as on-device training [58, 57]. We therefore test our regularization in this section in this setting, with more details in Appendix G.

We propose here to use shallower ResNets that are initially wider. These architectures are welladapted to layer-wise training as seen in [7]. We check first in Table 10 in Appendix G that this architecture works well with parallel module-wise training with 2 modules by comparing it favorably on CIFAR10 [37] with methods DGL [8], InfoPro [60] and DDG [32] that use a ResNet-110 with the same number of parameters.

We then train a 10-block ResNet block-wise on CIFAR100. In Tables 11 and 12 in Appendix G, we see that MLS training improves the accuracy of sequential training by . percentage points when the trainset is full, but works less well on small train sets. Of the two, the regularization mainly improves the test accuracy of MLS training. The improvement increases as the training set gets smaller and reaches 1 percentage point. While parallel module-wise training performs quite close to end-to-end training in the full data regime and much better in the small data regime, sequential and multi-lap sequential training are competitive with end-to-end training in the small data regime. Combining the multi-lap trick and the regularization improves the accuracy of sequential training by 1.2 percentage points when using the entire trainset. We report further results for full block-wise training on MNIST [38] and CIFAR10 [37] in Tables 13 and 14 in Appendix G.

The 88% accuracy of sequential training on CIFAR10 in Table 13 is the same as in Table 2 of [7], which is the best method for layer-wise sequential training available, with VGG networks of comparable depth and width.

## 4.4 Accuracy after each module

Finally, we verify that our method avoids the stagnation or collapse in accuracy with depth. In Figure 2 below, we show the accuracy of each module with and without the regularization.

On the left, from parallel module-wise training experiments from Table 3, TRGL performs worse than vanilla greedy learning early, but surpasses it in later modules, indicating that it does avoid early overfitting. On the right, from sequential block-wise training experiments from Table 13, we see a large decline in performance that the regularization avoids. We see similar patterns in Figure 3 in Appendix G with parallel and MLS block-wise training.

Figure 2: Test accuracy after each module averaged over 10 runs with 95% confidence intervals. Left: parallel vanilla (VanGL, in blue) and regularized (TRGL, in red) module-wise training of a ResNet-110 with 16 modules on STL10 (Table 3). Right: sequential vanilla (VanGL, in blue) and regularized (TRGL, in red) block-wise training of a 10-block ResNet on 2% of CIFAR10 (Table 13).

## Limitations

The results in Appendix G show a few limitations of our method, as the improvements from the regularization are sometimes minimal on sequential training. However, the results show that our approach works in all settings (parallel and sequential with many or few modules), whereas other papers don’t test their methods in all settings, and some show problems in other settings than the original one in subsequent papers (e.g. delayed gradients methods when the number of modules increases [31] and PredSim in [47]). Also, for parallel training in Section 4.1, the improvement from the regularization compared to VanGL is larger and increases with the number of modules (so with the memory savings) and reaches almost 5 percentage points. We show in Appendix H that our method is not very sensitive to the choice of hyperparameter τ over a large scale.

## Related work

Layer-wise training was initially considered as a pre-training and initialization method [10, 43] and was recently shown to be competitive with end-to-end training [7, 45]. Many papers consider using a different auxiliary loss, instead of or in addition to the classification loss: kernel similarity [42], information-theory-inspired losses [53, 44, 41, 60] and biologically plausible losses [53, 45, 25, 11]. Methods [7], PredSim [45], DGL [8], Sedona [47] and InfoPro [60] report the best module-wise training results. [7, 8] do it simply through the architecture choice of the auxiliary networks. Sedona applies architecture search to decide on where to split the network into modules and what auxiliary classifier to use before module-wise training. Only BoostResNet [30] also proposes a block-wise training idea geared for ResNets. However, their results only show better early performance and end-to-end fine-tuning is required to be competitive. A method called ResIST [19] that is similar to block-wise training of ResNets randomly assigns ResBlocks to one of up to 16 modules that

are trained independently and reassembled before another random partition. More of a distributed training method, it is only compared to local SGD [54]. These methods can all be combined with our regularization, and we do use the auxiliary classifier from [7, 8].

Besides module-wise training, methods such as DNI [33, 14], DDG [32] and FR [31], solve the update and backward locking problems with an eye towards parallelization by using delayed or predicted gradients, or even predicted inputs to address forward locking, which is what [55] do. But they observe training issues with more than 5 modules [31]. This makes them compare unfavorably to module-wise training [8]. The high dimension of the predicted gradient, which scales with the size of the network, makes [33, 14] challenging in practice. Therefore, despite its simplicity, greedy module-wise training is more appealing when working in a constrained setting.

Viewing ResNets as dynamic transport systems [16, 36] followed from their view as a discretization of ODEs [61]. Transport regularization of ResNets in particular is motivated by the observation that they are naturally biased towards minimally modifying their input [35, 26]. We further linked this transport viewpoint with gradient flows in the Wasserstein space to apply it in a principled way to module-wise training. Gradient flows on the data distribution appeared recently in deep learning. In [1], the focus is on functionals of measures whose first variations are known in closed form and used, through their gradients, in the algorithm. This limits the scope of their applications to transfer learning and similar tasks. Likewise, [21, 40, 4, 3] use the explicit gradient flow of f -divergences and other distances between measures for generation and generator refinement. In contrast, we use the discrete minimizing movement scheme which does not require computation of the first variation and allows to consider classification.

## Conclusion

We introduced a transport regularization for module-wise training that theoretically links module-wise training to gradient flows of the loss in probability space. Our method provably leads to more regular modules and experimentally improves the test accuracy of module-wise parallel, sequential and multi-lap sequential (a variant of sequential training that we introduce) training. Through this simple method that does not complexify the architecture, we make module-wise training competitive with end-to-end training while benefiting from its lower memory usage. Being a regularization, the method can easily be combined with other layer-wise training methods. Future work can experiment with working in Wasserstein space W p for p =2 , i.e. regularizing with a norm ‖ . ‖ p with p =2 .

## References

- A LVAREZ -M ELIS , D., AND F USI , N. Dataset dynamics via gradient flows in probability space. ICML (2021).

- A MBROSIO , L., G IGLI , N., AND S AVARE , G. Gradient Flows in Metric Spaces and in the Space of Probability Measures . Birkhäuser Basel, 2005.

- A NSARI , A. F., A NG , M. L., AND S OH , H. Refining deep generative models via discriminator gradient flow. In ICLR (2021).

- A RBEL , M., K ORBA , A., S ALIM , A., AND G RETTON , A. Maximum mean discrepancy gradient flow. In NeurIPS (2019).

- A RORA , R., B ASU , A., M IANJY , P., AND M UKHERJEE , A. Understanding deep neural networks with rectified linear units. In International Conference on Learning Representations (2018).

- B ACH , F. Breaking the curse of dimensionality with convex neural networks. Journal of Machine Learning Research 18 , 19 (2017), 1–53.

- B ELILOVSKY , E., E ICKENBERG , M., AND O YALLON , E. Greedy layerwise learning can scale to imagenet. In ICML (2019).

- B ELILOVSKY , E., E ICKENBERG , M., AND O YALLON , E. Decoupled greedy learning of cnns. In ICML (2020).

- B ENAMOU , J., AND B RENIER , Y. A computational fluid mechanics solution to the mongekantorovich mass transfer problem. Numerische Mathematik (2000).

- B ENGIO , Y., L AMBLIN , P., P OPOVICI , D., AND L AROCHELLE , H. Greedy layer-wise training of deep networks. In NeurIPS (2006). [11] B ERND I LLING , W ULFRAM G ERSTNER , G. B. Towards truly local gradients with clapp: Contrastive, local and predictive plasticity. arXiv (2020). [12] C OATE , A., L EE , H., AND N G , A. Y. An analysis of single layer networks in unsupervised feature learning. In AISTATS (2011). [13] C YBENKO , G. Approximation by superpositions of a sigmoidal function. Mathematics of Control, Signals and Systems 2 (1989), 303–314.

- C ZARNECKI , W. M., ´ S WIRSZCZ , G., J ADERBERG , M., O SINDERO , S., V INYALS , O., AND

K AVUKCUOGLU , K. Understanding synthetic gradients and decoupled neural interfaces. In ICML (2017). [15] D E , S., AND S MITH , S. L. Batch normalization biases residual blocks towards the identity function in deep networks. In NeurIPS (2020). [16] DE B ÉZENAC , E., A YED , I., AND G ALLINARI , P. Optimal unsupervised domain translation. arXiv (2019). [17] D OSOVITSKIY , A., B EYER , L., K OLESNIKOV , A., W EISSENBORN , D., Z HAI , X., U N -

TERTHINER , T., D EHGHANI , M., M INDERER , M., H EIGOLD , G., G ELLY , S., U SZKOREIT , J., AND H OULSBY , N. An image is worth 16x16 words: Transformers for image recognition at scale. In International Conference on Learning Representations (2021). [18] D U , S. S., AND G OEL , S. Improved learning of one-hidden-layer convolutional neural networks with overlaps. arXiv (2018). [19] D UN , C., W OLFE , C. R., J ERMAINE , C. M., AND K YRILLIDIS , A. Resist: Layer-wise decomposition of resnets for distributed training. arXiv (2021). [20] F IGALLI , A. The Monge-Ampere Equation and Its Applications . Zurich lectures in advanced mathematics. European Mathematical Society, 2017. [21] G AO , Y., J IAO , Y., W ANG , Y., W ANG , Y., Y ANG , C., AND Z HANG , S. Deep generative learning via variational gradient flow. In ICML (2019). [22] G E , R., L EE , J. D., AND M A , T. Learning one-hidden-layer neural networks with landscape design. In International Conference on Learning Representations (2018). [23] G IANAZZA , U., G OBBINO , M., AND S AVARÈ , G. Evolution problems and minimizing movements. Atti della Accademia Nazionale dei Lincei. Classe di Scienze Fisiche, Matematiche e Naturali. Rendiconti Lincei. Matematica e Applicazioni 5 (1994), 289–296. [24] G IORGI , E. D., M ARINO , A., AND T OSQUES , M. Problemi di evoluzione in spazi metrici e curve di massima pendenza. Atti della Accademia Nazionale dei Lincei. Classe di Scienze Fisiche, Matematiche e Naturali. Rendiconti 68 , 3 (3 1980), 180–187. [25] G UPTA , S. K. A more biologically plausible local learning rule for anns. arXiv (2020). [26] H AUSER , M. On residual networks learning a perturbation from identity. arXiv (2019). [27] H E , K., Z HAN , X., R EN , S., AND S UN , J. Identity mappings in deep residual networks. In ECCV (2016). [28] H E , K., Z HANG , X., R EN , S., AND S UN , J. Deep residual learning for image recognition. In CVPR (2016). [29] H ORNIK , K., S TINCHCOMBE , M., AND W HITE , H. Multilayer feedforward networks are universal approximators. Neural Networks 2 , 5 (1989), 359–366. [30] H UANG , F., A SH , J., L ANGFORD , J., AND S CHAPIRE , R. Learning deep resnet blocks sequentially using boosting theory. In ICML (2018). [31] H UO , Z., G U , B., AND H UANG , H. Training neural networks using features replay. In NeurIPS (2018). [32] H UO , Z., G U , B., Y ANG , Q., AND H UANG , H. Decoupled parallel backpropagation with convergence guarantee. In ICML (2018). [33] J ADERBERG , M., C ZARNECKI , W. M., O SINDERO , S., V INYALS , O., G RAVES , A., S ILVER , D., AND K AVUKCUOGLU , K. Decoupled neural interfaces using synthetic gradients. In ICML (2017).

- J ANZAMIN , M., S EDGHI , H., AND A NANDKUMAR , A. Beating the perils of non-convexity: Guaranteed training of neural networks using tensor methods. arXiv (2016). [35] J ASTRZEBSKI , S., ET AL . Residual connections encourage iterative inference. In ICLR (2018). [36] K ARKAR , S., A YED , I., DE B ÉZENAC , E., AND G ALLINARI , P. A principle of least action for the training of neural networks. In ECML-PKDD (2020). [37] K RIZHEVSKY , A. Learning multiple layers of features from tiny images. University of Toronto Technical Report (2009). [38] L E C UN , Y., C ORTES , C., AND B URGES , C. J. MNIST handwritten digit database. yann.lecun.com/exdb/mnist (2010). [39] L IU , Z., L IN , Y., C AO , Y., H U , H., W EI , Y., Z HANG , Z., L IN , S., AND G UO , B. Swin transformer: Hierarchical vision transformer using shifted windows. In Proceedings of the IEEE/CVF International Conference on Computer Vision (ICCV) (2021). [40] L IUTKUS , A., I M ¸ SEKLI , U., M AJEWSKI , S., D URMUS , A., AND S TOTER , F.-R. Slicedwasserstein flows: Nonparametric generative modeling via optimal transport and diffusions. In ICML (2019). [41] M A , W.-D. K., L EWIS , J., AND K LEIJN , W. B. The hsic bottleneck: Deep learning without back-propagation. In AAAI (2020). [42] M ANDAR K ULKARNI , S. K. Layer-wise training of deep networks using kernel similarity. In DLPR workshop, ICPR (2016). [43] M ARQUEZ , E. S., H ARE , J. S., AND N IRANJAN , M. Deep cascade learning. IEEE Transactions on Neural Networks and Learning Systems (2018). [44] N GUYEN , T. T., AND C HOI , J. Layer-wise learning of stochastic neural networks with information bottleneck. Entropy 21 (2019). [45] N ØKLAND , A., AND E IDNES , L. H. Training neural networks with local error signals. In ICML (2019). [46] P ATHAK , P., Z HANG , J., AND S AMARAS , D. Local learning on transformers via feature reconstruction, 2022. [47] P YEON , M., M OON , J., H AHN , T., AND K IM , G. Sedona: Search for decoupled neural networks toward greedy block-wise learning. In ICLR (2021). [48] S ANDLER , M., H OWARD , A. G., Z HU , M., Z HMOGINOV , A., AND C HEN , L. Mobilenetv2: Inverted residuals and linear bottlenecks. In 2018 IEEE Conference on Computer Vision and Pattern Recognition, CVPR 2018, Salt Lake City, UT, USA, June 18-22, 2018 (2018), Computer Vision Foundation / IEEE Computer Society, pp. 4510–4520. [49] S ANTAMBROGIO , F. Optimal Transport for Applied Mathematicians . Birkhäuser, 2015. [50] S ANTAMBROGIO , F. Euclidean, metric, and wasserstein gradient flows: an overview. arXiv (2016). [51] S AXE , A. M., M CCLELLAND , J. L., AND G ANGULI , S. Exact solutions to the nonlinear dynamics of learning in deep linear neural network. In ICLR (2014). [52] S IMONYAN , K., AND Z ISSERMAN , A. Very deep convolutional networks for large-scale image recognition. In International Conference on Learning Representations (ICLR 2014) (2014). [53] S INDY L ÖWE , P ETER O’C ONNOR , B. V. Putting an end to end-to-end: Gradient-isolated learning of representations. In NeurIPS (2019). [54] S TICH , S. U. Local sgd converges fast and communicates little. In ICLR (2019). [55] S UN , Q., D ONG , H., C HEN , Z., S UN , J., L I , Z., AND D ONG , B. Layer-parallel training of residual networks with auxiliary-variable networks. arXiv (2021). [56] T AN , M., AND L E , Q. EfficientNet: Rethinking model scaling for convolutional neural networks. In Proceedings of the 36th International Conference on Machine Learning (09– 15 Jun 2019), K. Chaudhuri and R. Salakhutdinov, Eds., vol. 97 of Proceedings of Machine Learning Research , PMLR, pp. 6105–6114. [57] T ANG , Y., T ENG , Q., Z HANG , L., M IN , F., AND H E , J. Layer-wise training convolutional neural networks with smaller filters for human activity recognition using wearable sensors. IEEE Sensors Journal (2021).

- T ENG , Q., W ANG , K., Z HANG , L., AND H E , J. The layer-wise training convolutional neural networks using local loss for sensor-based human activity recognition. IEEE Sensors Journal (2020). [59] V ILLANI , C. Optimal Transport: Old and New . Springer-Verlag, 2008. [60] W ANG , Y., N I , Z., S ONG , S., AND L E Y ANG , G. H. Revisiting locally supervised learning: an alternative to end-to-end training. In ICLR (2021). [61] W EINAN , E. A proposal on machine learning via dynamical systems. Commun. Math. Stat (2017). [62] X IE , S., ET AL . Aggregated residual transformations for deep neural networks. In CVPR (2017). [63] Z AGORUYKO , S., AND K OMODAKIS , N. Wide residual networks. In BMVC (2016). [64] Z HANG , J., ET AL . Towards robust resnet: A small step but a giant leap. In IJCAI (2019). [65] Z HANG , J., Z HANG , X., M A , K., G UPTA , R., S ALTZ , J., V AKALOPOULOU , M., AND

S AMARAS , D. Gigapixel whole-slide images classification using locally supervised learning. In Medical Image Computing and Computer Assisted Intervention – MICCAI 2022 (Cham, 2022), Springer Nature Switzerland, pp. 192–201.

## A Background on optimal transport

d

The Wasserstein space W (Ω) with Ω a convex and compact subset of R is the space P (Ω) of probability measures over Ω , equipped with the distance W given by the solution to the optimal transport problem ∫ W ( α, β ) = min ‖ x − y ‖ d γ ( x, y ) (12)

γ ∈ Π( α,β ) Ω × Ω

where Π( α, β ) is the set of probability distribution over Ω × Ω with first marginal α and second marginal β , i.e. Π( α, β ) = { γ ∈ P (Ω × Ω) | π ] γ = α, π ] γ = β } where π ( x, y ) = x and π ( x, y ) = y . The optimal transport problem can be seen as looking for a transportation plan minimizing the cost of displacing some distribution of mass from one configuration to another. This problem indeed has a solution in our setting and W can be shown to be a geodesic distance (see for example [49, 59]). If α is absolutely continuous and ∂ Ω is α -negligible then the problem in (12) (called the Kantorovich problem) has a unique solution and is equivalent to the Monge problem, i.e. ∫ W ( α, β ) = min ‖ T ( x ) − x ‖ d α ( x ) (13)

T s.t. T ] α = β Ω ? ? ? ?

and this problem has a unique solution T linked to the solution γ of (12) through γ = ( id , T ) ] α . Another equivalent formulation of the optimal transport problem in this setting is the dynamical formulation [9]. Here, instead of directly pushing samples of α to β using T , we can equivalently

d d

displace mass, according to a continuous flow with velocity v t : R → R . This implies that the density α t at time t satisfies the continuity equation ∂ t α t + ∇ · ( α t v t ) = 0 , assuming that initial and final conditions are given by α = α and α = β respectively. In this case, the optimal displacement is the one that minimizes the total action caused by v : ∫ W ( α, β ) = min ‖ v t ‖ t (14)

v L ( α t )

d

s.t. ∂ t α t + ∇ · ( α t v t ) = 0 , α = α, α = β

Instead of describing the density’s evolution through the continuity equation, we can describe the

x x

paths φ t

taken by particles at position x from α when displaced along the flow v . Here φ t

is the position at time t of the particle that was at x ∼ α at time 0. The continuity equation is then equivalent

x x

to ∂ t φ t

= v t ( φ t

) . See chapters 4 and 5 of [49] for details. Rewriting the conditions as necessary, Problem (14) becomes ∫ W ( α, β ) = min ‖ v t ‖ ·

v L (( φ t

) ] α )

d t (15)

x x · ·

s.t. ∂ t φ t

= v t ( φ t

) , φ = id , ( φ ) ] α = β

? ? x

and the optimal transport map T that solves (13) is in fact T ( x ) = φ for φ that solves the

?

continuity equation together with the optimal v from (15). We refer to [49, 59] for these results on optimal transport.

Optimal transport maps have some regularity properties under some boundedness assumptions. We mention the following result from [20]:

d

Theorem A.1. Let α and β be absolutely continuous measures on R and T the optimal transport map between α and β for the Euclidean cost. Suppose there are bounded open sets X and Y , such

c c

that the density of α (respectively of β ) is null on X (respectively Y ) and bounded away from zero and infinity on X (respectively Y ).

Then there exists two relatively closed sets of null measure A ⊂ X and B ⊂ Y , such that T is η -Hölder continuous from X \ A to Y \ B , i.e. ∀ x, y ∈ X \ A we have

η

‖ T ( x ) − T ( y ) ‖ ≤ C ‖ x − y ‖ for constants η, C >

## B Background on gradient flows

d

We follow [50, 2] for this background on gradient flows. Given a function L : R → R and an initial

d d

point x ∈ R , a gradient flow is a curve x : [0 , ∞ [ → R that solves the Cauchy problem {

′

x ( t ) = −∇L ( x ( t )) (16) x (0) = x

τ

A solution exists and is unique if ∇L is Lipschitz or L is convex. Given τ > and x = x define a

τ

sequence ( x k

) k through the minimizing movement scheme :

τ τ

x k +1

∈ arg min L ( x ) + ‖ x − x k

‖ (17)

x ∈ R d

τ L lower semi-continous and L ( x ) ≥ C − C ‖ x ‖ guarantees existence of a solution of (17) for τ small enough. L λ -convex meets these conditions and also provides uniqueness of the solution because of strict convexity of the target. See [49, 50, 2].

τ τ

We interpret the point x k

as the value of a curve x at time kτ . We can then construct a curve x as

τ τ

the piecewise constant interpolation of the points x k

## . We can also construct a curve x ˜ as the affine

τ

interpolation of the points x k

.

τ τ

If L ( x ) < ∞ and inf L > −∞ then ( x ) and (˜ x ) converge uniformly to the same curve x as τ goes to zero (up to extracting a subsequence). If L is C , then the limit curve x is a solution of (16) (i.e. a gradient flow of L ). If L is not differentiable then x is solution of the problem defined using

′

the subdifferential of L , i.e. x satisfies x ( t ) ∈ − ∂ L ( x ( t )) for almost every t .

If L is λ -convex with λ > , then the solution to (16) converges exponentially to the unique minimizer of L (which exists by coercivity). So taking τ → and k → ∞ , we tend towards the minimizer of L .

The advantage of the minimizing movement scheme (17) is that it can be adapted to metric spaces by replacing the Euclidean distance by the metric space’s distance. In the (geodesic) metric space W (Ω) with Ω convex and compact, for L : W (Ω) → R ∪ {∞} lower semi-continuous for the weak convergence of measures in duality with C (Ω) (equivalent to lower semi-continuous with respect to

τ

the distance W ) and ρ = ρ ∈ P (Ω) , the minimizing movement scheme (17) becomes

τ τ

ρ k +1

∈ arg min L ( ρ ) + W ( ρ, ρ k

) (18)

ρ ∈P (Ω) τ  This problem has a solution because the objective is lower semi-continuous and the minimization is over P (Ω) which is compact by Banach-Alaoglu.

τ

We can construct a piecewise constant interpolation between the measures ρ k

, or a geodesic inter-

τ τ

polation where we travel along a geodesic between ρ k

and ρ k +1

in W (Ω) , constructed using the optimal transport map between these measures. Again, if L ( x ) < ∞ and inf L > −∞ then both interpolations converge uniformly to a limit curve ρ ˜ as τ goes to zero. Under further conditions on L , mainly λ -geodesic convexity (i.e. λ -convexity along geodesics) for λ > , we can prove stability and convergence of ρ ˜ ( t ) to a minimizer of L as t → ∞ , see [49, 50, 2].

## C Proof of Proposition 2.3

Proof. Take a minimizing sequence (  F ˜

i , T ˜

i ) , i.e. such that C (  F ˜

i , T ˜

i ) → min C , where C ≥ is the

τ ?

target function in (3) and denote β i =  T ˜

i] ρ ˜ ? k

## . Then by compacity F i → F and β i ⇀ β in duality

? τ ?

with C b (Ω) by Banach-Alaoglu. There exists T an optimal transport map between ρ k

and β . Then

? ?

C ( F , T ) ≤ lim C (  F ˜

i , T ˜

i ) = min C by continuity of L and because ∫

? τ τ ?

‖ T ( x ) − x ‖ d ρ k

( x ) = W ( ρ k

### , β )

Ω τ

= lim W ( ρ k

, β i ) ∫ ≤ lim ‖ T ˜ τ i ( x ) − x ‖ d ρ k

### ( x )

Ω τ τ ? ?

as W metrizes weak convergence of measures. We take ( F k

, T k

) = ( F , T ) . It is also immediate that for any minimizing pair, the transport map has to be optimal. Taking a minimizing sequence (  F ˜ i i , v ˜ ) and the corresponding induced maps T ˜

i we get the same result for Problem (11). Problems (3) and (11) are equivalent by the equivalence between Problems (13) and (15).

## D Varying the regularization weight

The discussion in Section 2.2 suggests taking a fixed weight τ for the transport cost that is as small as possible. However, instead of using a fixed τ , we might want to vary it along the depth k to further

constrain with a smaller τ k the earlier modules to avoid that they overfit or the later modules to maintain the accuracy of earlier modules. We might also want to regularize the network further in earlier epochs when the data is more entangled. To unify and formalize this varying weight τ k,i across modules k and SGD iterations i , we use a scheme inspired by the method of multipliers to solve Problems (2) and (10). To simplify the notations, we will instead consider the weight λ k,i :=2 τ k,i

given to the loss. We denote θ k,i the parameters of both T k and F k at SGD iteration i . We also denote L ( θ, x ) and W ( θ, x ) respectively the loss and the transport regularization as functions of parameters θ and data x . We now increase the weight λ k,i of the loss every s iterations of SGD by a value that is proportional to the current loss. Given increase factor h> , initial parameters θ k, , initial weights λ k, ≥ , learning rates ( η i ) and batches ( x i ) , we apply for module k and i ≥ : { θ k,i +1 = θ k,i − η i ∇ θ ( λ k,i L ( θ k,i , x i ) + W ( θ k,i , x i )) λ k,i +1 = λ k,i + hL ( θ k,i +1 , x i +1 ) if i mod s = 0 else λ k,i

The weights λ k,i will vary along modules k because they will evolve differently with iterations i for each k . They will increase more slowly with i for larger k because deeper modules will have smaller loss. This method can be seen as a method of multipliers for the problem of minimizing the transport under the constraint of zero loss. Therefore it is immediate by slightly adapting the proof of Proposition 2.3 or from [36] that we are still solving a problem that admits a solution whose non-auxiliary part is an optimal transport map with the same regularity as stated above. We use the same initial value λ = λ k, for all modules so that this method requires choosing three hyper-parameters ( h , s and λ ). In practice (see Section 4.1 and Appendix E), it works best in only one experiment. Simply manually finding a value of τ that is multiplied by 2 for the second half of the network works best in all the other experiments.

## E Implementation details

We use standard data augmentation and standard implementations for VGG-19, ResNet-50, ResNet- 101, ResNet-110, ResNet-152 and Swin-Tiny Transformer (the same as for the other methods in Section 4.1). We use NVIDIA Tesla V100 16GB GPUs for the experiments. Training a Resnet-152 on TinyImageNet in Table 1 takes about 36 hours. Training a Resnet-152 on CIFAR100 in Table 1 takes about 11 hours. Training a ResNet-110 on STL10 in Table 3 takes about 3 hours. Training a Swin-Tiny Transformer in Table 4 take between 40 minutes and 1 hour.

For sequential and multi-lap sequential training, we use SGD with a learning rate of . . With the exception of the Swin Transformer in Table 4, we use SGD for parallel training with learning rate of . in all Tables but Table 3 where the learning rate is . . For the Swin Transformer in Table 4, we use the AdamW optimizer with a learning rate of . and a CosineLR scheduler.

For end-to-end training we use a learning rate of 0.1 that is divided by five at epochs 120, 160 and 200. Momentum is always 0.9. For parallel and end-to-end training, we train for 300 epochs. For sequential and multi-lap sequential training, the number of epochs varies per module (see Section G).

For experiments in Section 4.1, we use a batch size of 256, orthogonal initialization [51] with a gain of 0.1, label smoothing of 0.1 and weight decay of 0.0002. The batch size changes to 64 for Table 3 and to 1024 for Table 4.

For experiments in Section 4.3, we use a batch size of 128, orthogonal initialization with a gain of 0.05, no label smoothing and weight decay of 0.0001.

In Table 1, we use τ = 500000 for the first two modules and then double it for the last two modules for TRGL. In Table 2, we use λ k, = 1 , h = 1 and s = 50 for TRGL. In Table 3, we use τ = 0 . and double it at the midpoint, expect for the first line where τ = 50 .

## F Memory savings and training time

We compare in Table 7 the memory consumption of our method to that of InfoPro [60] on a ResNet- 110 split into K modules trained in parallel on STL10 with a batch size of 64 (so the same setting as in Table 3 in Section 4.1). We report in Table 7 the memory saved as a percentage of the 6230 MiB memory required by end-to-end training with the same batch size. VanGL refers to our architecture trained without the regularization. InfoPro [60] also propose to split the network into K modules that

have the same weight but not necessarily the same number of layers. They only implement this for K ≤ modules. When the modules are even in weight and not in depth, we call the training methods VanGL*, TRGL* and InfoPro*. In practice, this leads to shallower early modules which slightly hurts performance according to [47]. We verify this in Table 8 (to be compared with Table 3 in Section 4.1). However, TRGL* still outperforms InfoPro and end-to-end training, and it leads to even bigger memory savings. We see in Table 7 that TRGL saves more memory than InfoPro in two out of three cases (4 and 8 modules), and about the same in the third case (16 modules), with much better test accuracy in all cases. Likewise, TRGL* is lighter than InfoPro*, with better accuracy. We also see that the added memory cost of the regularization compared to vanilla greedy learning is small. However, parallel module-wise training does slightly slow down training. Epoch time increases by 6% with 2 modules and by 16% with 16 modules. TRGL is only slower than VanGL by 2% for for all number of modules due to the additional regularization term. This is comparable to InfoPro which report a time overhead between 1 and 27% compared to end-to-end training.

| Table 7: Memory savings using a ResNet-110 on STL10 split into          | K   | modules trained in parallel with |
| ----------------------------------------------------------------------- | --- | -------------------------------- |
| runs is between brackets. Test accuracy of end-to-end training is 77.73 | %   | .                                |

Equally deep modules Equally heavy modules

K Par VanGL Par TRGL (ours) InfoPro Par VanGL* Par TRGL* (ours) InfoPro*

| %   | (75.71) | %   | (   | 77.82 | )   | %   | (76.40) |
| --- | ------- | --- | --- | ----- | --- | --- | ------- |
| %   | (73.57) | %   | (   | 77.22 | )   | %   | (73.95) |

Table 8: Test accuracy of parallel (Par) TRGL* with K modules (average and 95 % confidence interval over 5 runs) on a ResNet-110 trained on STL10, compared to InfoPro* and E2E training from Table 3 in [60]

K Par VanGL* Par TRGL* (ours) InfoPro*

| 79.05 | ±   | 1.33 | 79.47 | ±   | 1.36 | 79.05 | ±   | 0.57 |
| ----- | --- | ---- | ----- | --- | ---- | ----- | --- | ---- |
| 77.14 | ±   | 1.23 | 78.94 | ±   | 1.13 | 78.78 | ±   | 0.72 |

Note that methods DDG [32] and FR [31], being delayed gradient methods and not module-wise training methods, do no save memory (they actually increase memory usage, see FR [31]). Sedona [47] also does not claim to save memory, as their first module (the heaviest) is deeper than the others, but rather to speed up computation. Finally, DGL [8] is architecture-wise essentially identical to VanGL and consumes the same memory.

## G Sequential full block-wise training

To show that our method works well with all types of module-wise training when using few modules, we train a ResNet-101 split in 2 modules on CIFAR100, sequentially and multi-lap sequentially. Results are in Table 9. We see that our idea of multi-lap sequential training adds one percentage point of accuracy to sequential training, and that the regularization further improves the accuracy by about half a percentage point. As only one module has to be trained at a time, these two training methods require only around half the memory end-to-end training requires (the size of the heaviest module and its classifier more exactly).

Table 9: Test accuracy of sequential (Seq) and multi-lap sequential (MLS) TRGL and VanGL with 2 modules on CIFAR100 using ResNet-101 (average of 2 runs).

Seq VanGL Seq TRGL MLS VanGL MLS TRGL

73.31 73.61 74.34 74.78

We now focus on full block-wise training, meaning that each module is a single ResBlock, mostly sequentially. We propose here to use shallower and initially wider ResNets with a downsampling and 256 filters initially and a further downsampling and doubling of the number of filters at the midpoint, no matter the depth. In these ResNets, we use the ResBlock from [27] with two convolutional layers. If such a network is divided in K modules of M ResBlocks each, we call the network a K − M ResNet. These wider shallower architectures are well-adapted to layer-wise training as seen in [7]. We check in Table 10 that this architecture works well with parallel module-wise training by comparing favorably on CIFAR10 ([37]) a 2-7 ResNet with DGL, InfoPro ([60]) and DDG [32]. The 2-7 ResNet has 45 millions parameters, which is about the same as the ResNet-110 divided in two used by the other methods, and performs better when trained in parallel.

Table 10: Average test accuracy and 95 % confidence interval of 2-7 ResNet over 10 runs on CIFAR10 with parallel TRGL and VanGL, compared to DGL and DDG from [8] and InfoPro from [60] that split a ResNet-110 in 2 module-wise-parallel-trained modules.

Parallel VanGL (ours) Parallel TRGL (ours) DGL DDG InfoPro

94.01 ± .17 94.05 ± .18 93.50 93.41 93.58

We now train a 10-block ResNet block-wise on CIFAR100 (a 10-1 ResNet in our notations). We report even the small improvements in accuracy to show that our method works in all settings (parallel or sequential with many or few splits), which other methods don’t do. For sequential training, block k is trained for 50+10 k epochs where ≤ k ≤ , block 0 being the encoder. This idea of increasing the number of epochs along with the depth is found in [43]. For MLS training, block k is trained for 10+2 k epochs, and this is repeated for 5 laps. In block-wise training, the last block does not always perform the best and we report the accuracy of the best block. In Table 11, we see that MLS training improves the test accuracy of sequential training by around . percentage points when the training dataset is full, but works less well on small training sets. Of the two, the regularization mainly improves the test accuracy of MLS training. The improvement increases as the training set gets smaller and reaches 1 percentage point. That is also the case for parallel module-wise training in Table 12, which already performs quite close to end-to-end training in the full data regime and much better in the small data regime. Combining the multi-lap trick and the regularization improves the performance of sequential training by 1.2 percentage points.

Table 11: Average highest test accuracy and 95 % confidence interval of 10-1 ResNet over 10 runs on CIFAR100 with different train sizes and sequential (Seq), multi-lap sequential (MLS) and parallel (Par) TRGL and VanGL, compared to E2E.

Train size Seq VanGL Seq TRGL MLS VanGL MLS TRGL E2E

| 68.74 | ±   | 0.45 | 68.79 | ±   | 0.56 | 69.48 | ±   | 0.53 | 69.95 | ±   | 0.50 | 75.85 | ±   | 0.70 |
| ----- | --- | ---- | ----- | --- | ---- | ----- | --- | ---- | ----- | --- | ---- | ----- | --- | ---- |
| 60.48 | ±   | 0.15 | 60.59 | ±   | 0.14 | 61.33 | ±   | 0.23 | 61.71 | ±   | 0.32 | 65.36 | ±   | 0.31 |
| 51.64 | ±   | 0.33 | 51.74 | ±   | 0.26 | 51.30 | ±   | 0.22 | 51.89 | ±   | 0.30 | 52.39 | ±   | 0.97 |
| 36.37 | ±   | 0.33 | 36.40 | ±   | 0.40 | 33.68 | ±   | 0.48 | 34.61 | ±   | 0.59 | 36.38 | ±   | 0.31 |

Table 12: Average highest test accuracy and 95 % confidence interval of 10-1 ResNet over 10 runs on CIFAR100 with different train sizes and sequential (Seq), multi-lap sequential (MLS) and parallel (Par) TRGL and VanGL, compared to E2E.

Train size Par VanGL Par TRGL E2E

| 72.59 | ±   | 0.40 | 72.63 | ±   | 0.40 | 75.85 | ±   | 0.70 |
| ----- | --- | ---- | ----- | --- | ---- | ----- | --- | ---- |
| 64.84 | ±   | 0.19 | 65.01 | ±   | 0.27 | 65.36 | ±   | 0.31 |
| 55.13 | ±   | 0.24 | 55.40 | ±   | 0.35 | 52.39 | ±   | 0.97 |
| 39.45 | ±   | 0.23 | 40.36 | ±   | 0.23 | 36.38 | ±   | 0.31 |

We report further results of block-wise training on CIFAR10 in Table 13 and on MNIST [38] in Table 14, but now we report the accuracy of the last block. We see again greater improvement due to the regularization as the training set gets smaller, gaining up to 6 percentage points.

Table 13: Average last block test accuracy and 95 % confidence interval of 10-1 ResNet over 10 runs on CIFAR10 with different train sizes and sequential TRGL and VanGL, compared to E2E.

Train size Seq VanGL Seq TRGL E2E

| 88.02 | ±   | .18 | 88.20 | ±   | .24 | 91.88 | ±   | .18 |
| ----- | --- | --- | ----- | --- | --- | ----- | --- | --- |
| 83.95 | ±   | .13 | 84.28 | ±   | .22 | 88.75 | ±   | .27 |
| 76.00 | ±   | .39 | 77.18 | ±   | .34 | 82.61 | ±   | .35 |
| 67.74 | ±   | .49 | 69.67 | ±   | .44 | 73.93 | ±   | .67 |
| 45.67 | ±   | .88 | 51.34 | ±   | .90 | 50.63 | ±   | .98 |

Table 14: Average last block test accuracy and 95 % confidence interval of 20-1 ResNet (32 filters, fixed encoder, same classifier) over 20/50 runs on MNIST with different train sizes and parallel TRGL and VanGL, compared to E2E.

Train size Par VanGL Par TRGL E2E

| 99.07 | ±   | .04  | 99.08 | ±   | .04 | 99.30 | ±   | .03 |
| ----- | --- | ---- | ----- | --- | --- | ----- | --- | --- |
| 98.90 | ±   | .05  | 98.93 | ±   | .06 | 99.22 | ±   | .03 |
| 98.52 | ±   | .06  | 98.59 | ±   | .06 | 98.96 | ±   | .06 |
| 98.05 | ±   | .09  | 98.16 | ±   | .07 | 98.62 | ±   | .06 |
| 96.34 | ±   | .12  | 96.91 | ±   | .07 | 97.19 | ±   | .08 |
| 95.80 | ±   | .12  | 96.58 | ±   | .09 | 96.88 | ±   | .09 |
| 91.35 | ±   | .99  | 95.16 | ±   | .15 | 95.30 | ±   | .17 |
| 89.81 | ±   | .73  | 92.86 | ±   | .24 | 92.87 | ±   | .28 |
| 81.84 | ±   | 1.22 | 87.48 | ±   | .42 | 87.82 | ±   | .59 |

The 88% accuracy of sequential training on CIFAR10 in Table 13 is the same as for sequential training in table 2 of [7], which is the best method for layer-wise sequential training available, with VGG networks of comparable depth and width.

Figure 3: Test accuracy after each block of 10-1 ResNet averaged over 10 runs with 95% confidence intervals. Left: multi-lap sequential vanilla (VanGL, in blue) and regularized (TRGL, in red) blockwise training on 10% of the CIFAR100 training set. Right: parallel vanilla (VanGL, in blue) and regularized (TRGL, in red) block-wise training on 10% of CIFAR100 training set.

## H Sensitivity to hyper-parameters

We show in Figure 4 below that TRGL still performs better than VanGL (in the same setting as in Table 3 in Section 4.1) for values of τ from 0.03 to 100 and is still roughly equivalent to it for values up to 5000.

Figure 4: Average test accuracy over 5 runs of parallel TRGL using a ResNet110 on STL10 with 16 modules with different values of τ (in red), and of VanGL (blue line).

## I Broader impact

Less memory usage has a positive environmental impact and allows organizations with less resources to use deep learning.