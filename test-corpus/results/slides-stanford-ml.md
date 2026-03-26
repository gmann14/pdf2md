#### CS229 Lecture Notes

###### Andrew Ng

###### Updated by Tengyu Ma

# Contents

###### I Supervised learning

Linear regression 1.1 LMS algorithm . . . . . . . . . . . . . . . . . . . . . . . . . . 1.2 The normal equations . . . . . . . . . . . . . . . . . . . . . . . 1.2.1 Matrix derivatives . . . . . . . . . . . . . . . . . . . . . 1.2.2 Least squares revisited . . . . . . . . . . . . . . . . . . 1.3 Probabilistic interpretation . . . . . . . . . . . . . . . . . . . . 1.4 Locally weighted linear regression (optional reading) . . . . . .

Classification and logistic regression 2.1 Logistic regression . . . . . . . . . . . . . . . . . . . . . . . . 2.2 Digression: the perceptron learning algorithn . . . . . . . . . . 2.3 Another algorithm for maximizing ` ( θ ) . . . . . . . . . . . . .

Generalized linear models 3.1 The exponential family . . . . . . . . . . . . . . . . . . . . . . 3.2 Constructing GLMs . . . . . . . . . . . . . . . . . . . . . . . . 3.2.1 Ordinary least squares . . . . . . . . . . . . . . . . . . 3.2.2 Logistic regression . . . . . . . . . . . . . . . . . . . . 3.2.3 Softmax regression . . . . . . . . . . . . . . . . . . . .

Generative learning algorithms 4.1 Gaussian discriminant analysis . . . . . . . . . . . . . . . . . . 4.1.1 The multivariate normal distribution . . . . . . . . . . 4.1.2 The Gaussian discriminant analysis model . . . . . . . 4.1.3 Discussion: GDA and logistic regression . . . . . . . . 4.2 Naive bayes . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4.2.1 Laplace smoothing . . . . . . . . . . . . . . . . . . . . 4.2.2 Event models for text classification . . . . . . . . . . .

CS229 Spring 2022

Kernel methods 5.1 Feature maps . . . . . . . . . . . . . . . . . . . . . . . . . . . 5.2 LMS (least mean squares) with features . . . . . . . . . . . . . 5.3 LMS with the kernel trick . . . . . . . . . . . . . . . . . . . . 5.4 Properties of kernels . . . . . . . . . . . . . . . . . . . . . . .

Support vector machines 6.1 Margins: intuition . . . . . . . . . . . . . . . . . . . . . . . . . 6.2 Notation (option reading) . . . . . . . . . . . . . . . . . . . . 6.3 Functional and geometric margins (option reading) . . . . . . 6.4 The optimal margin classifier (option reading) . . . . . . . . . 6.5 Lagrange duality (optional reading) . . . . . . . . . . . . . . . 6.6 Optimal margin classifiers: the dual form (option reading) . . 6.7 Regularization and the non-separable case (optional reading) . 6.8 The SMO algorithm (optional reading) . . . . . . . . . . . . . 6.8.1 Coordinate ascent . . . . . . . . . . . . . . . . . . . . . 6.8.2 SMO . . . . . . . . . . . . . . . . . . . . . . . . . . . .

###### II Deep learning

Deep learning 7.1 Supervised learning with non-linear models . . . . . . . . . . . 7.2 Neural networks . . . . . . . . . . . . . . . . . . . . . . . . . . 7.3 Backpropagation . . . . . . . . . . . . . . . . . . . . . . . . . 7.3.1 Preliminary: chain rule . . . . . . . . . . . . . . . . . . 7.3.2 One-neuron neural networks . . . . . . . . . . . . . . . 7.3.3 Two-layer neural networks: a low-level unpacked com- putation . . . . . . . . . . . . . . . . . . . . . . . . . . 7.3.4 Two-layer neural network with vector notation . . . . . 7.3.5 Multi-layer neural networks . . . . . . . . . . . . . . . 7.4 Vectorization over training examples . . . . . . . . . . . . . .

###### III Generalization and regularization

Generalization 8.1 Bias-variance tradeoff . . . . . . . . . . . . . . . . . . . . . . . 105 8.1.1 A mathematical decomposition (for regression) . . . . . 110 8.2 The double descent phenomenon . . . . . . . . . . . . . . . . . 111

CS229 Spring 2022

8.3 Sample complexity bounds (optional readings) . . . . . . . . . 116 8.3.1 Preliminaries . . . . . . . . . . . . . . . . . . . . . . . 116 8.3.2 The case of finite H . . . . . . . . . . . . . . . . . . . . 118 8.3.3 The case of infinite H . . . . . . . . . . . . . . . . . . 121

Regularization and model selection 9.1 Regularization . . . . . . . . . . . . . . . . . . . . . . . . . . . 125 9.2 Implicit regularization effect . . . . . . . . . . . . . . . . . . . 127 9.3 Model selection via cross validation . . . . . . . . . . . . . . . 129 9.4 Bayesian statistics and regularization . . . . . . . . . . . . . . 132

###### IV Unsupervised learning

10 Clustering and the k -means algorithm

11 EM algorithms 11.1 EM for mixture of Gaussians . . . . . . . . . . . . . . . . . . . 138 11.2 Jensen’s inequality . . . . . . . . . . . . . . . . . . . . . . . . 141 11.3 General EM algorithms . . . . . . . . . . . . . . . . . . . . . . 142 11.3.1 Other interpretation of ELBO . . . . . . . . . . . . . . 148 11.4 Mixture of Gaussians revisited . . . . . . . . . . . . . . . . . . 148 11.5 Variational inference and variational auto-encoder (optional reading) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 150

12 Principal components analysis

13 Independent components analysis 13.1 ICA ambiguities . . . . . . . . . . . . . . . . . . . . . . . . . . 162 13.2 Densities and linear transformations . . . . . . . . . . . . . . . 163 13.3 ICA algorithm . . . . . . . . . . . . . . . . . . . . . . . . . . . 164

14 Self-supervised learning and foundation models 14.1 Pretraining and adaptation . . . . . . . . . . . . . . . . . . . . 167 14.2 Pretraining methods in computer vision . . . . . . . . . . . . . 169 14.3 Pretrained large language models . . . . . . . . . . . . . . . . 171 14.3.1 Zero-shot learning and in-context learning . . . . . . . 173

CS229 Spring 2022

###### V Reinforcement Learning and Control

15 Reinforcement learning 15.1 Markov decision processes . . . . . . . . . . . . . . . . . . . . 177 15.2 Value iteration and policy iteration . . . . . . . . . . . . . . . 179 15.3 Learning a model for an MDP . . . . . . . . . . . . . . . . . . 181 15.4 Continuous state MDPs . . . . . . . . . . . . . . . . . . . . . 183 15.4.1 Discretization . . . . . . . . . . . . . . . . . . . . . . . 183 15.4.2 Value function approximation . . . . . . . . . . . . . . 186 15.5 Connections between Policy and Value Iteration (Optional) . . 190

16 LQR, DDP and LQG 16.1 Finite-horizon MDPs . . . . . . . . . . . . . . . . . . . . . . . 193 16.2 Linear Quadratic Regulation (LQR) . . . . . . . . . . . . . . . 197 16.3 From non-linear dynamics to LQR . . . . . . . . . . . . . . . 200 16.3.1 Linearization of dynamics . . . . . . . . . . . . . . . . 201 16.3.2 Differential Dynamic Programming (DDP) . . . . . . . 201 16.4 Linear Quadratic Gaussian (LQG) . . . . . . . . . . . . . . . . 203

17 Policy Gradient (REINFORCE)

# Part I

# Supervised learning

Let’s start by talking about a few examples of supervised learning prob- lems. Suppose we have a dataset giving the living areas and prices of 47 houses from Portland, Oregon:

Living area (feet ) Price (1000 $ s)

. . . . . .

We can plot this data:

housing prices

price (in $1000)

square feet

Given data like this, how can we learn to predict the prices of other houses in Portland, as a function of the size of their living areas?

( i )

To establish notation for future use, we’ll use x to denote the “input”

( i )

variables (living area in this example), also called input features , and y to denote the “output” or target variable that we are trying to predict

( i ) ( i )

(price). A pair ( x , y ) is called a training example , and the dataset

( i ) ( i )

that we’ll be using to learn—a list of n training examples { ( x , y ); i = , . . . , n } —is called a training set . Note that the superscript “( i )” in the notation is simply an index into the training set, and has nothing to do with exponentiation. We will also use X denote the space of input values, and Y the space of output values. In this example, X = Y = R . To describe the supervised learning problem slightly more formally, our goal is, given a training set, to learn a function h : X 7 → Y so that h ( x ) is a “good” predictor for the corresponding value of y . For historical reasons, this

function h is called a hypothesis . Seen pictorially, the process is therefore like this:

Training set

Learning algorithm

x h predicted y

| (living area of | (predicted price) |
| --------------- | ----------------- |
| house.)         | of house)         |

When the target variable that we’re trying to predict is continuous, such as in our housing example, we call the learning problem a regression prob- lem. When y can take on only a small number of discrete values (such as if, given the living area, we wanted to predict if a dwelling is a house or an apartment, say), we call it a classification problem.

# Chapter 1

# Linear regression

To make our housing example more interesting, let’s consider a slightly richer dataset in which we also know the number of bedrooms in each house:

Living area (feet ) #bedrooms Price (1000 $ s)

. . . . . . . . .

( i )

Here, the x ’s are two-dimensional vectors in R . For instance, x is the

( i )

living area of the i -th house in the training set, and x is its number of bedrooms. (In general, when designing a learning problem, it will be up to you to decide what features to choose, so if you are out in Portland gathering housing data, you might also decide to include other features such as whether each house has a fireplace, the number of bathrooms, and so on. We’ll say more about feature selection later, but for now let’s take the features as given.) To perform supervised learning, we must decide how we’re going to rep- resent functions/hypotheses h in a computer. As an initial choice, let’s say we decide to approximate y as a linear function of x :

h θ ( x ) = θ + θ x + θ x

Here, the θ i ’s are the parameters (also called weights ) parameterizing the space of linear functions mapping from X to Y . When there is no risk of

confusion, we will drop the θ subscript in h θ ( x ), and write it more simply as h ( x ). To simplify our notation, we also introduce the convention of letting x = 1 (this is the intercept term ), so that

∑ d T

h ( x ) = θ i x i = θ x,

i =0

where on the right-hand side above we are viewing θ and x both as vectors, and here d is the number of input variables (not counting x ). Now, given a training set, how do we pick, or learn, the parameters θ ? One reasonable method seems to be to make h ( x ) close to y , at least for the training examples we have. To formalize this, we will define a function

( i )

that measures, for each value of the θ ’s, how close the h ( x )’s are to the

( i )

corresponding y ’s. We define the cost function :

∑ n ( i ) ( i )

J ( θ ) =  ( h θ ( x ) − y ) .

i =1

If you’ve seen linear regression before, you may recognize this as the familiar least-squares cost function that gives rise to the ordinary least squares regression model. Whether or not you have seen it previously, let’s keep going, and we’ll eventually show this to be a special case of a much broader family of algorithms.

##### 1.1 LMS algorithm

We want to choose θ so as to minimize J ( θ ). To do so, let’s use a search algorithm that starts with some “initial guess” for θ , and that repeatedly changes θ to make J ( θ ) smaller, until hopefully we converge to a value of θ that minimizes J ( θ ). Specifically, let’s consider the gradient descent algorithm, which starts with some initial θ , and repeatedly performs the update: ∂ θ j := θ j − α  J ( θ ) . ∂θ j

(This update is simultaneously performed for all values of j = 0 , . . . , d .) Here, α is called the learning rate . This is a very natural algorithm that repeatedly takes a step in the direction of steepest decrease of J . In order to implement this algorithm, we have to work out what is the partial derivative term on the right hand side. Let’s first work it out for the

case of if we have only one training example ( x, y ), so that we can neglect the sum in the definition of J . We have:

∂ ∂ J ( θ ) = ( h θ ( x ) − y ) ∂θ j ∂θ j

∂ = · ( h θ ( x ) − y ) · ( h θ ( x ) − y ) ∂θ j

( ∑

d

) ∂ = ( h θ ( x ) − y ) · θ i x i − y ∂θ j i =0

= ( h θ ( x ) − y ) x j

For a single training example, this gives the update rule: (

( i ) ( i )

) ( i )

θ j := θ j + α y − h θ ( x ) x j

.

The rule is called the LMS update rule (LMS stands for “least mean squares”), and is also known as the Widrow-Hoff learning rule. This rule has several properties that seem natural and intuitive. For instance, the magnitude of

( i ) ( i )

the update is proportional to the error term ( y − h θ ( x )); thus, for in- stance, if we are encountering a training example on which our prediction

( i )

nearly matches the actual value of y , then we find that there is little need to change the parameters; in contrast, a larger change to the parameters will

( i )

be made if our prediction h θ ( x ) has a large error (i.e., if it is very far from

( i )

y ). We’d derived the LMS rule for when there was only a single training example. There are two ways to modify this method for a training set of more than one example. The first is replace it with the following algorithm:

Repeat until convergence {

∑ n

(

( i ) ( i )

) ( i )

θ j := θ j + α y − h θ ( x ) x j

, (for every j ) (1.1)

i =1

}

We use the notation “ a := b ” to denote an operation (in a computer program) in which we set the value of a variable a to be equal to the value of b . In other words, this operation overwrites a with the value of b . In contrast, we will write “ a = b ” when we are asserting a statement of fact, that the value of a is equal to the value of b .

By grouping the updates of the coordinates into an update of the vector θ , we can rewrite update (1.1) in a slightly more succinct way:

∑ n

(

( i ) ( i )

)

( i )

θ := θ + α y − h θ ( x ) x

i =1

The reader can easily verify that the quantity in the summation in the update rule above is just ∂J ( θ ) /∂θ j (for the original definition of J ). So, this is simply gradient descent on the original cost function J . This method looks at every example in the entire training set on every step, and is called batch gradient descent . Note that, while gradient descent can be susceptible to local minima in general, the optimization problem we have posed here for linear regression has only one global, and no other local, optima; thus gradient descent always converges (assuming the learning rate α is not too large) to the global minimum. Indeed, J is a convex quadratic function. Here is an example of gradient descent as it is run to minimize a quadratic function.

The ellipses shown above are the contours of a quadratic function. Also shown is the trajectory taken by gradient descent, which was initialized at (48,30). The x ’s in the figure (joined by straight lines) mark the successive values of θ that gradient descent went through. When we run batch gradient descent to fit θ on our previous dataset, to learn to predict housing price as a function of living area, we obtain θ = 71 . 27, θ = 0 . 1345. If we plot h θ ( x ) as a function of x (area), along with the training data, we obtain the following figure:

housing prices

price (in $1000)

square feet

If the number of bedrooms were included as one of the input features as well, we get θ = 89 . , θ = 0 . 1392, θ = − . 738. The above results were obtained with batch gradient descent. There is an alternative to batch gradient descent that also works very well. Consider the following algorithm:

Loop {

for i = 1 to n , {

(

( i ) ( i )

) ( i )

θ j := θ j + α y − h θ ( x ) x j

, (for every j ) (1.2)

}

}

By grouping the updates of the coordinates into an update of the vector θ , we can rewrite update (1.2) in a slightly more succinct way: (

( i ) ( i )

)

( i )

θ := θ + α y − h θ ( x ) x

In this algorithm, we repeatedly run through the training set, and each time we encounter a training example, we update the parameters according to the gradient of the error with respect to that single training example only. This algorithm is called stochastic gradient descent (also incremental gradient descent ). Whereas batch gradient descent has to scan through the entire training set before taking a single step—a costly operation if n is large—stochastic gradient descent can start making progress right away, and

continues to make progress with each example it looks at. Often, stochastic gradient descent gets θ “close” to the minimum much faster than batch gra- dient descent. (Note however that it may never “converge” to the minimum, and the parameters θ will keep oscillating around the minimum of J ( θ ); but in practice most of the values near the minimum will be reasonably good approximations to the true minimum. ) For these reasons, particularly when the training set is large, stochastic gradient descent is often preferred over batch gradient descent.

##### 1.2 The normal equations

Gradient descent gives one way of minimizing J . Let’s discuss a second way of doing so, this time performing the minimization explicitly and without resorting to an iterative algorithm. In this method, we will minimize J by explicitly taking its derivatives with respect to the θ j ’s, and setting them to zero. To enable us to do this without having to write reams of algebra and pages full of matrices of derivatives, let’s introduce some notation for doing calculus with matrices.

###### 1.2.1 Matrix derivatives

n × d

For a function f : R → R mapping from n -by- d matrices to the real numbers, we define the derivative of f with respect to A to be: 

∂f ∂f



∂A

- · ·

∂A d

 ∇ A f ( A ) = .  . .  . .  . . .  . 

∂f ∂f ∂A n

- · ·

∂A nd

Thus, the gradient ∇ A f ( A ) is itself an [ n -by- d matrix, whose ( ] i, j )-element is

A A

∂f /∂A ij . For example, suppose A = is a 2-by-2 matrix, and

A A

×

the function f : R → R is given by

f ( A ) =  A + 5 A + A A .

By slowly letting the learning rate α decrease to zero as the algorithm runs, it is also possible to ensure that the parameters will converge to the global minimum rather than merely oscillate around the minimum.

Here, A ij denotes the ( i, j ) entry of the matrix A . We then have [ ] A ∇ A f ( A ) = . A A

###### 1.2.2 Least squares revisited

Armed with the tools of matrix derivatives, let us now proceed to find in closed-form the value of θ that minimizes J ( θ ). We begin by re-writing J in matrix-vectorial notation. Given a training set, define the design matrix X to be the n -by- d matrix (actually n -by- d + 1, if we include the intercept term) that contains the training examples’ input values in its rows:  

(1) T

- ( x ) —  (2) T

 — ( x ) —   X =  .  .  . . 

( n ) T

- ( x ) —

Also, let ~ y be the n -dimensional vector containing all the target values from the training set:  

(1)

y  (2)

 y   ~ y =  .   . . . 

( n )

y

( i ) ( i ) T

Now, since h θ ( x ) = ( x ) θ , we can easily verify that    

(1) T (1)

( x ) θ y  Xθ − ~ y = .  .     − . .  . . 

( n ) T ( n )

( x ) θ y  

(1) (1)

h θ ( x ) − y  = .  .  .  .

( n ) ( n )

h θ ( x ) − y

T

∑ Thus, using the fact that for a vector z , we have that z z = i

z i

:

∑

n T ( i ) ( i )

( Xθ − ~ y ) ( Xθ − ~ y ) = ( h θ ( x ) − y )

i =1

= J ( θ )

Finally, to minimize J , let’s find its derivatives with respect to θ . Hence,

T

∇ θ J ( θ ) = ∇ θ ( Xθ − ~ y ) ( Xθ − ~ y )

(

T T T T

) = ∇ θ ( Xθ ) Xθ − ( Xθ ) ~ y − ~ y ( Xθ ) + ~ y ~ y

(

T T T T

) = ∇ θ θ ( X X ) θ − ~ y ( Xθ ) − ~ y ( Xθ )

(

T T T T

) = ∇ θ θ ( X X ) θ − 2( X ~ y ) θ

(

T T

) = X Xθ − X ~ y

T T

= X Xθ − X ~ y

T T

In the third step, we used the fact that a b = b a , and in the fifth step

T T

used the facts ∇ x b x = b and ∇ x x Ax = 2 Ax for symmetric matrix A (for more details, see Section 4.3 of “Linear Algebra Review and Reference”). To minimize J , we set its derivatives to zero, and obtain the normal equations :

T T

X Xθ = X ~ y

Thus, the value of θ that minimizes J ( θ ) is given in closed form by the equation

T − T

θ = ( X X ) X ~ y.

##### 1.3 Probabilistic interpretation

When faced with a regression problem, why might linear regression, and specifically why might the least-squares cost function J , be a reasonable choice? In this section, we will give a set of probabilistic assumptions, under which least-squares regression is derived as a very natural algorithm. Let us assume that the target variables and the inputs are related via the equation

( i ) T ( i ) ( i )

y = θ x +  ,

T

Note that in the above step, we are implicitly assuming that X X is an invertible matrix. This can be checked before calculating the inverse. If either the number of linearly independent examples is fewer than the number of features, or if the features

T

are not linearly independent, then X X will not be invertible. Even in such cases, it is possible to “fix” the situation with additional techniques, which we skip here for the sake of simplicty.

( i )

where  is an error term that captures either unmodeled effects (such as if there are some features very pertinent to predicting housing price, but that we’d left out of the regression), or random noise. Let us further assume

( i )

that the  are distributed IID (independently and identically distributed) according to a Gaussian distribution (also called a Normal distribution) with

( i )

mean zero and some variance σ . We can write this assumption as “  ∼

( i )

N (0 , σ ).” I.e., the density of  is given by (

( i )

)

( i )

(  ) p (  ) = √ exp − . πσ σ

This implies that (

( i ) T ( i )

)

( i ) ( i )

( y − θ x ) p ( y | x ; θ ) = √ exp − . πσ σ

( i ) ( i ) ( i )

The notation “ p ( y | x ; θ )” indicates that this is the distribution of y

( i )

given x and parameterized by θ . Note that we should not condition on θ

( i ) ( i )

(“ p ( y | x , θ )”), since θ is not a random variable. We can also write the

( i ) ( i ) ( i ) T ( i )

distribution of y as y | x ; θ ∼ N ( θ x , σ ).

( i )

Given X (the design matrix, which contains all the x ’s) and θ , what

( i )

is the distribution of the y ’s? The probability of the data is given by p ( ~ y | X ; θ ). This quantity is typically viewed a function of ~ y (and perhaps X ), for a fixed value of θ . When we wish to explicitly view this as a function of θ , we will instead call it the likelihood function:

L ( θ ) = L ( θ ; X, ~ y ) = p ( ~ y | X ; θ ) .

( i )

Note that by the independence assumption on the  ’s (and hence also the

( i ) ( i )

y ’s given the x ’s), this can also be written

∏

n ( i ) ( i )

L ( θ ) = p ( y | x ; θ )

i =1

∏ n (

( i ) T ( i )

) ( y − θ x ) = √ exp − .

i =1

πσ σ

( i ) ( i )

Now, given this probabilistic model relating the y ’s and the x ’s, what is a reasonable way of choosing our best guess of the parameters θ ? The principal of maximum likelihood says that we should choose θ so as to make the data as high probability as possible. I.e., we should choose θ to maximize L ( θ ).

Instead of maximizing L ( θ ), we can also maximize any strictly increasing function of L ( θ ). In particular, the derivations will be a bit simpler if we instead maximize the log likelihood ` ( θ ):

` ( θ ) = log L ( θ ) ∏

n (

( i ) T ( i )

) ( y − θ x ) = log √ exp −

i =1

πσ σ

∑ n (

( i ) T ( i )

) ( y − θ x ) = log √ exp −

i =1

πσ σ

∑

n ( i ) T ( i )

= n log √ − · ( y − θ x ) . πσ σ

i =1

Hence, maximizing ` ( θ ) gives the same answer as minimizing

∑ n ( i ) T ( i )

( y − θ x ) ,

i =1

which we recognize to be J ( θ ), our original least-squares cost function. To summarize: Under the previous probabilistic assumptions on the data, least-squares regression corresponds to finding the maximum likelihood esti- mate of θ . This is thus one set of assumptions under which least-squares re- gression can be justified as a very natural method that’s just doing maximum likelihood estimation. (Note however that the probabilistic assumptions are by no means necessary for least-squares to be a perfectly good and rational procedure, and there may—and indeed there are—other natural assumptions that can also be used to justify it.) Note also that, in our previous discussion, our final choice of θ did not depend on what was σ , and indeed we’d have arrived at the same result even if σ were unknown. We will use this fact again later, when we talk about the exponential family and generalized linear models.

##### 1.4 Locally weighted linear regression (optional reading)

Consider the problem of predicting y from x ∈ R . The leftmost figure below shows the result of fitting a y = θ + θ x to a dataset. We see that the data doesn’t really lie on straight line, and so the fit is not very good.

4.5 4.5 4.5

3.5 3.5 3.5

2.5 2.5 2.5

y y y

1.5 1.5 1.5

0.5 0.5 0.5

x x x

Instead, if we had added an extra feature x , and fit y = θ + θ x + θ x , then we obtain a slightly better fit to the data. (See middle figure) Naively, it might seem that the more features we add, the better. However, there is also a danger in adding too many features: The rightmost figure is the result of ∑

j

fitting a 5-th order polynomial y = j =0

θ j x . We see that even though the fitted curve passes through the data perfectly, we would not expect this to be a very good predictor of, say, housing prices ( y ) for different living areas ( x ). Without formally defining what these terms mean, we’ll say the figure on the left shows an instance of underfitting —in which the data clearly shows structure not captured by the model—and the figure on the right is an example of overfitting . (Later in this class, when we talk about learning theory we’ll formalize some of these notions, and also define more carefully just what it means for a hypothesis to be good or bad.) As discussed previously, and as shown in the example above, the choice of features is important to ensuring good performance of a learning algorithm. (When we talk about model selection, we’ll also see algorithms for automat- ically choosing a good set of features.) In this section, let us briefly talk about the locally weighted linear regression (LWR) algorithm which, assum- ing there is sufficient training data, makes the choice of features less critical. This treatment will be brief, since you’ll get a chance to explore some of the properties of the LWR algorithm yourself in the homework. In the original linear regression algorithm, to make a prediction at a query point x (i.e., to evaluate h ( x )), we would: ∑

( i ) T ( i )

1. Fit θ to minimize i

( y − θ x ) .

T

2. Output θ x .

In contrast, the locally weighted linear regression algorithm does the fol- lowing: ∑

( i ) ( i ) T ( i )

1. Fit θ to minimize i

w ( y − θ x ) .

T

2. Output θ x .

( i ) ( i )

Here, the w ’s are non-negative valued weights . Intuitively, if w is large

( i )

for a particular value of i , then in picking θ , we’ll try hard to make ( y −

T ( i ) ( i ) ( i ) T ( i )

θ x ) small. If w is small, then the ( y − θ x ) error term will be pretty much ignored in the fit. A fairly standard choice for the weights is (

( i )

)

( i )

( x − x ) w = exp − τ

Note that the weights depend on the particular point x at which we’re trying

( i ) ( i )

to evaluate x . Moreover, if | x − x | is small, then w is close to 1; and

( i ) ( i )

if | x − x | is large, then w is small. Hence, θ is chosen giving a much higher “weight” to the (errors on) training examples close to the query point x . (Note also that while the formula for the weights takes a form that is

( i )

cosmetically similar to the density of a Gaussian distribution, the w ’s do

( i )

not directly have anything to do with Gaussians, and in particular the w are not random variables, normally distributed or otherwise.) The parameter τ controls how quickly the weight of a training example falls off with distance

( i )

of its x from the query point x ; τ is called the bandwidth parameter, and is also something that you’ll get to experiment with in your homework. Locally weighted linear regression is the first example we’re seeing of a non-parametric algorithm. The (unweighted) linear regression algorithm that we saw earlier is known as a parametric learning algorithm, because it has a fixed, finite number of parameters (the θ i ’s), which are fit to the data. Once we’ve fit the θ i ’s and stored them away, we no longer need to keep the training data around to make future predictions. In contrast, to make predictions using locally weighted linear regression, we need to keep the entire training set around. The term “non-parametric” (roughly) refers to the fact that the amount of stuff we need to keep in order to represent the hypothesis h grows linearly with the size of the training set.

( i ) ( i ) T ( i )

If x is vector-valued, this is generalized to be w = exp( − ( x − x ) ( x − x ) / (2 τ )),

( i ) ( i ) T − ( i )

or w = exp( − ( x − x ) Σ ( x − x ) / (2 τ )), for an appropriate choice of τ or Σ.

# Chapter 2

# Classification and logistic regression

Let’s now talk about the classification problem. This is just like the regression problem, except that the values y we now want to predict take on only a small number of discrete values. For now, we will focus on the binary classification problem in which y can take on only two values, 0 and 1. (Most of what we say here will also generalize to the multiple-class case.)

( i )

For instance, if we are trying to build a spam classifier for email, then x may be some features of a piece of email, and y may be 1 if it is a piece of spam mail, and 0 otherwise. 0 is also called the negative class , and 1 the positive class , and they are sometimes also denoted by the symbols “-”

( i ) ( i )

and “+.” Given x , the corresponding y is also called the label for the training example.

##### 2.1 Logistic regression

We could approach the classification problem ignoring the fact that y is discrete-valued, and use our old linear regression algorithm to try to predict y given x . However, it is easy to construct examples where this method performs very poorly. Intuitively, it also doesn’t make sense for h θ ( x ) to take values larger than 1 or smaller than 0 when we know that y ∈ { , } . To fix this, let’s change the form for our hypotheses h θ ( x ). We will choose

T

h θ ( x ) = g ( θ x ) = 1 + e − θ T

x

,

where g ( z ) = 1 + e − z

is called the logistic function or the sigmoid function . Here is a plot showing g ( z ):

0.9

0.8

0.7

0.6

g(z)

0.5

0.4

0.3

0.2

0.1

−5 −4 −3 −2 −1 z

Notice that g ( z ) tends towards 1 as z → ∞ , and g ( z ) tends towards 0 as z → −∞ . Moreover, g(z), and hence also h ( x ), is always bounded between 0 and 1. As before, we are keeping the convention of letting ∑ x = 1, so that

T d

θ x = θ + j =1

θ j x j . For now, let’s take the choice of g as given. Other functions that smoothly increase from 0 to 1 can also be used, but for a couple of reasons that we’ll see later (when we talk about GLMs, and when we talk about generative learning algorithms), the choice of the logistic function is a fairly natural one. Before moving on, here’s a useful property of the derivative of the sigmoid function,

′

which we write as g :

′

d g ( z ) = dz 1 + e − z

(

− z

) = (1 + e − z

e ) ( ) = · − (1 + e − z

) (1 + e − z

) = g ( z )(1 − g ( z )) .

So, given the logistic regression model, how do we fit θ for it? Following how we saw least squares regression could be derived as the maximum like- lihood estimator under a set of assumptions, let’s endow our classification model with a set of probabilistic assumptions, and then fit the parameters via maximum likelihood.

Let us assume that

P ( y = 1 | x ; θ ) = h θ ( x ) P ( y = 0 | x ; θ ) = − h θ ( x )

Note that this can be written more compactly as

y − y

p ( y | x ; θ ) = ( h θ ( x )) (1 − h θ ( x ))

Assuming that the n training examples were generated independently, we can then write down the likelihood of the parameters as

L ( θ ) = p ( ~ y | X ; θ ) ∏

n ( i ) ( i )

= p ( y | x ; θ )

i =1

∏ n

( i

( i )

) y

( ) (

( i )

) − y

( i )

= h θ ( x ) − h θ ( x )

i =1

As before, it will be easier to maximize the log likelihood:

` ( θ ) = log L ( θ ) ∑

n ( i ) ( i ) ( i ) ( i )

= y log h ( x ) + (1 − y ) log(1 − h ( x ))

i =1

How do we maximize the likelihood? Similar to our derivation in the case of linear regression, we can use gradient ascent. Written in vectorial notation, our updates will therefore be given by θ := θ + α ∇ θ ` ( θ ). (Note the positive rather than negative sign in the update formula, since we’re maximizing, rather than minimizing, a function now.) Let’s start by working with just one training example ( x, y ), and take derivatives to derive the stochastic gradient ascent rule: ( ) ∂ ∂ T

` ( θ ) = y − (1 − y ) g ( θ ∂θ j g ( θ T

x ) − g ( θ T

x ) x ) ∂θ j

( )

T T

∂ T

= y − − ) g ( θ x )(1 g θ g ( θ T

(1 y − ( x ) − g ( θ T

x )) θ x x ) ∂θ j

(

T T

) = y (1 − g ( θ x )) − (1 − y ) g ( θ x ) x j

= ( y − h θ ( x )) x j

′

Above, we used the fact that g ( z ) = g ( z )(1 − g ( z )). This therefore gives us the stochastic gradient ascent rule (

( i ) ( i )

) ( i )

θ j := θ j + α y − h θ ( x ) x j

If we compare this to the LMS update rule, we see that it looks identical; but

( i )

this is not the same algorithm, because h θ ( x ) is now defined as a non-linear

T ( i )

function of θ x . Nonetheless, it’s a little surprising that we end up with the same update rule for a rather different algorithm and learning problem. Is this coincidence, or is there a deeper reason behind this? We’ll answer this when we get to GLM models.

##### 2.2 Digression: the perceptron learning algo- rithn

We now digress to talk briefly about an algorithm that’s of some historical interest, and that we will also return to later when we talk about learning theory. Consider modifying the logistic regression method to “force” it to output values that are either 0 or 1 or exactly. To do so, it seems natural to change the definition of g to be the threshold function: { if z ≥ g ( z ) = if z <

T

If we then let h θ ( x ) = g ( θ x ) as before but using this modified definition of g , and if we use the update rule (

( i ) ( i )

) ( i )

θ j := θ j + α y − h θ ( x ) x j

.

then we have the perceptron learning algorithn . In the 1960s, this “perceptron” was argued to be a rough model for how individual neurons in the brain work. Given how simple the algorithm is, it will also provide a starting point for our analysis when we talk about learning theory later in this class. Note however that even though the perceptron may be cosmetically similar to the other algorithms we talked about, it is actually a very different type of algorithm than logistic regression and least squares linear regression; in particular, it is difficult to endow the perceptron’s predic- tions with meaningful probabilistic interpretations, or derive the perceptron as a maximum likelihood estimation algorithm.

f(x) f(x) f(x)

−10 −10 −10 1.5 2.5 3.5 4.5 1.5 2.5 3.5 4.5 1.5 2.5 3.5 4.5 x x x

##### 2.3 Another algorithm for maximizing ` ( θ )

Returning to logistic regression with g ( z ) being the sigmoid function, let’s now talk about a different algorithm for maximizing ` ( θ ). To get us started, let’s consider Newton’s method for finding a zero of a function. Specifically, suppose we have some function f : R → R , and we wish to find a value of θ so that f ( θ ) = 0. Here, θ ∈ R is a real number. Newton’s method performs the following update:

f ( θ ) θ := θ − f ′

. ( θ )

This method has a natural interpretation in which we can think of it as approximating the function f via a linear function that is tangent to f at the current guess θ , solving for where that linear function equals to zero, and letting the next guess for θ be where that linear function is zero. Here’s a picture of the Newton’s method in action: In the leftmost figure, we see the function f plotted along with the line y = 0. We’re trying to find θ so that f ( θ ) = 0; the value of θ that achieves this is about 1.3. Suppose we initialized the algorithm with θ = 4 . 5. Newton’s method then fits a straight line tangent to f at θ = 4 . 5, and solves for the where that line evaluates to 0. (Middle figure.) This give us the next guess for θ , which is about 2.8. The rightmost figure shows the result of running one more iteration, which the updates θ to about 1.8. After a few more iterations, we rapidly approach θ = 1 . 3. Newton’s method gives a way of getting to f ( θ ) = 0. What if we want to use it to maximize some function ` ? The maxima of ` correspond to points

′ ′

where its first derivative ` ( θ ) is zero. So, by letting f ( θ ) = ` ( θ ), we can use the same algorithm to maximize ` , and we obtain update rule:

′

` ( θ ) θ := θ − . ` ′′

( θ )

(Something to think about: How would this change if we wanted to use Newton’s method to minimize rather than maximize a function?)

Lastly, in our logistic regression setting, θ is vector-valued, so we need to generalize Newton’s method to this setting. The generalization of Newton’s method to this multidimensional setting (also called the Newton-Raphson method) is given by

−

θ := θ − H ∇ θ ` ( θ ) .

Here, ∇ θ ` ( θ ) is, as usual, the vector of partial derivatives of ` ( θ ) with respect to the θ i ’s; and H is an d -by- d matrix (actually, d +1 − by − d+1, assuming that we include the intercept term) called the Hessian , whose entries are given by ∂ ` ( θ ) H ij = . ∂θ i ∂θ j

Newton’s method typically enjoys faster convergence than (batch) gra- dient descent, and requires many fewer iterations to get very close to the minimum. One iteration of Newton’s can, however, be more expensive than one iteration of gradient descent, since it requires finding and inverting an d -by- d Hessian; but so long as d is not too large, it is usually much faster overall. When Newton’s method is applied to maximize the logistic regres- sion log likelihood function ` ( θ ), the resulting method is also called Fisher scoring .

# Chapter 3

# Generalized linear models

So far, we’ve seen a regression example, and a classification example. In the regression example, we had y | x ; θ ∼ N ( μ, σ ), and in the classification one, y | x ; θ ∼ Bernoulli( φ ), for some appropriate definitions of μ and φ as functions of x and θ . In this section, we will show that both of these methods are special cases of a broader family of models, called Generalized Linear Models (GLMs). We will also show how other models in the GLM family can be derived and applied to other classification and regression problems.

##### 3.1 The exponential family

To work our way up to GLMs, we will begin by defining exponential family distributions. We say that a class of distributions is in the exponential family if it can be written in the form

T

p ( y ; η ) = b ( y ) exp( η T ( y ) − a ( η )) (3.1)

Here, η is called the natural parameter (also called the canonical param- eter ) of the distribution; T ( y ) is the sufficient statistic (for the distribu- tions we consider, it will often be the case that T ( y ) = y ); and a ( η ) is the log

− a ( η )

partition function . The quantity e essentially plays the role of a nor- malization constant, that makes sure the distribution p ( y ; η ) sums/integrates over y to 1. A fixed choice of T , a and b defines a family (or set) of distributions that is parameterized by η ; as we vary η , we then get different distributions within this family.

| Jordan, | Learning in graphical models        | (unpublished book draft), and also McCullagh and |
| ------- | ----------------------------------- | ------------------------------------------------ |
| Nelder, | Generalized Linear Models (2nd ed.) | .                                                |

We now show that the Bernoulli and the Gaussian distributions are ex- amples of exponential family distributions. The Bernoulli distribution with mean φ , written Bernoulli( φ ), specifies a distribution over y ∈ { , } , so that p ( y = 1; φ ) = φ ; p ( y = 0; φ ) = 1 − φ . As we vary φ , we obtain Bernoulli distributions with different means. We now show that this class of Bernoulli distributions, ones obtained by varying φ , is in the exponential family; i.e., that there is a choice of T , a and b so that Equation (3.1) becomes exactly the class of Bernoulli distributions. We write the Bernoulli distribution as:

y − y

p ( y ; φ ) = φ (1 − φ ) = exp( y log φ + (1 − y ) log(1 − φ )) (( ( )) ) φ = exp log y + log(1 − φ ) . − φ

Thus, the natural parameter is given by η = log( φ/ (1 − φ )). Interestingly, if we invert this definition for η by solving for φ in terms of η , we obtain φ =

− η

/ (1 + e ). This is the familiar sigmoid function! This will come up again when we derive logistic regression as a GLM. To complete the formulation of the Bernoulli distribution as an exponential family distribution, we also have

T ( y ) = y a ( η ) = − log(1 − φ )

η

= log(1 + e ) b ( y ) =

This shows that the Bernoulli distribution can be written in the form of Equation (3.1), using an appropriate choice of T , a and b . Let’s now move on to consider the Gaussian distribution. Recall that, when deriving linear regression, the value of σ had no effect on our final choice of θ and h θ ( x ). Thus, we can choose an arbitrary value for σ without changing anything. To simplify the derivation below, let’s set σ = 1. We

If we leave σ as a variable, the Gaussian distribution can also be shown to be in the exponential family, where η ∈ R is now a 2-dimension vector that depends on both μ and σ . For the purposes of GLMs, however, the σ parameter can also be treated by considering

T

a more general definition of the exponential family: p ( y ; η, τ ) = b ( a, τ ) exp(( η T ( y ) − a ( η )) /c ( τ )). Here, τ is called the dispersion parameter , and for the Gaussian, c ( τ ) = σ ; but given our simplification above, we won’t need the more general definition for the examples we will consider here.

then have: ( ) p ( y ; μ ) = √ exp − ( y − μ ) π ( ) ( ) = √ exp − y · exp μy − μ π

Thus, we see that the Gaussian is in the exponential family, with

η = μ T ( y ) = y a ( η ) = μ / = η / √ b ( y ) = (1 / π ) exp( − y / 2) .

There’re many other distributions that are members of the exponen- tial family: The multinomial (which we’ll see later), the Poisson (for mod- elling count-data; also see the problem set); the gamma and the exponen- tial (for modelling continuous, non-negative random variables, such as time- intervals); the beta and the Dirichlet (for distributions over probabilities); and many more. In the next section, we will describe a general “recipe” for constructing models in which y (given x and θ ) comes from any of these distributions.

##### 3.2 Constructing GLMs

Suppose you would like to build a model to estimate the number y of cus- tomers arriving in your store (or number of page-views on your website) in any given hour, based on certain features x such as store promotions, recent advertising, weather, day-of-week, etc. We know that the Poisson distribu- tion usually gives a good model for numbers of visitors. Knowing this, how can we come up with a model for our problem? Fortunately, the Poisson is an exponential family distribution, so we can apply a Generalized Linear Model (GLM). In this section, we will we will describe a method for constructing GLM models for problems such as these. More generally, consider a classification or regression problem where we would like to predict the value of some random variable y as a function of x . To derive a GLM for this problem, we will make the following three assumptions about the conditional distribution of y given x and about our model:

1. y | x ; θ ∼ ExponentialFamily( η ). I.e., given x and θ , the distribution of y follows some exponential family distribution, with parameter η .

2. Given x , our goal is to predict the expected value of T ( y ) given x . In most of our examples, we will have T ( y ) = y , so this means we would like the prediction h ( x ) output by our learned hypothesis h to satisfy h ( x ) = E[ y | x ]. (Note that this assumption is satisfied in the choices for h θ ( x ) for both logistic regression and linear regression. For instance, in logistic regression, we had h θ ( x ) = p ( y = 1 | x ; θ ) = 0 · p ( y = | x ; θ ) + 1 · p ( y = 1 | x ; θ ) = E[ y | x ; θ ].)

T

3. The natural parameter η and the inputs x are related linearly: η = θ x .

T

(Or, if η is vector-valued, then η i = θ i

x .)

The third of these assumptions might seem the least well justified of the above, and it might be better thought of as a “design choice” in our recipe for designing GLMs, rather than as an assumption per se. These three assumptions/design choices will allow us to derive a very elegant class of learning algorithms, namely GLMs, that have many desirable properties such as ease of learning. Furthermore, the resulting models are often very effective for modelling different types of distributions over y ; for example, we will shortly show that both logistic regression and ordinary least squares can both be derived as GLMs.

###### 3.2.1 Ordinary least squares

To show that ordinary least squares is a special case of the GLM family of models, consider the setting where the target variable y (also called the response variable in GLM terminology) is continuous, and we model the conditional distribution of y given x as a Gaussian N ( μ, σ ). (Here, μ may depend x .) So, we let the ExponentialF amily ( η ) distribution above be the Gaussian distribution. As we saw previously, in the formulation of the Gaussian as an exponential family distribution, we had μ = η . So, we have

| =   | μ   |
| --- | --- |
| =   | η   |

T

= θ x.

The first equality follows from Assumption 2, above; the second equality follows from the fact that y | x ; θ ∼ N ( μ, σ ), and so its expected value is given

by μ ; the third equality follows from Assumption 1 (and our earlier derivation showing that μ = η in the formulation of the Gaussian as an exponential family distribution); and the last equality follows from Assumption 3.

###### 3.2.2 Logistic regression

We now consider logistic regression. Here we are interested in binary classifi- cation, so y ∈ { , } . Given that y is binary-valued, it therefore seems natural to choose the Bernoulli family of distributions to model the conditional dis- tribution of y given x . In our formulation of the Bernoulli distribution as

− η

an exponential family distribution, we had φ = 1 / (1 + e ). Furthermore, note that if y | x ; θ ∼ Bernoulli( φ ), then E[ y | x ; θ ] = φ . So, following a similar derivation as the one for ordinary least squares, we get:

h θ ( x ) = E [ y | x ; θ ] = φ

− η

= / (1 + e )

− θ

T

x

= / (1 + e )

− θ

T

x

So, this gives us hypothesis functions of the form h θ ( x ) = 1 / (1 + e ). If you are previously wondering how we came up with the form of the logistic

− z

function 1 / (1 + e ), this gives one answer: Once we assume that y condi- tioned on x is Bernoulli, it arises as a consequence of the definition of GLMs and exponential family distributions. To introduce a little more terminology, the function g giving the distri- bution’s mean as a function of the natural parameter ( g ( η ) = E[ T ( y ); η ])

−

is called the canonical response function . Its inverse, g , is called the canonical link function . Thus, the canonical response function for the Gaussian family is just the identify function; and the canonical response function for the Bernoulli is the logistic function.

###### 3.2.3 Softmax regression

Let’s look at one more example of a GLM. Consider a classification problem in which the response variable y can take on any one of k values, so y ∈ { , , . . . , k } . For example, rather than classifying email into the two classes

−

Many texts use g to denote the link function, and g to denote the response function; but the notation we’re using here, inherited from the early machine learning literature, will be more consistent with the notation used in the rest of the class.

spam or not-spam—which would have been a binary classification problem— we might want to classify it into three classes, such as spam, personal mail, and work-related mail. The response variable is still discrete, but can now take on more than two values. We will thus model it as distributed according to a multinomial distribution. Let’s derive a GLM for modelling this type of multinomial data. To do so, we will begin by expressing the multinomial as an exponential family distribution. To parameterize a multinomial over k possible outcomes, one could use k parameters φ , . . . , φ k specifying the probability of each of the outcomes. However, these parameters would be redundant, or more formally, they would not be independent (since knowing any ∑ k − 1 of the φ i ’s uniquely determines

k

the last one, as they must satisfy i =1

φ i = 1). So, we will instead pa- rameterize the multinomial with only k ∑ − 1 parameters, φ , . . . , φ k − , where

k −

φ i = p ( y = i ; φ ), and p ( y = k ; φ ) = 1 − ∑ i =1

φ i . For notational convenience,

k −

we will also let φ k = 1 − i =1

φ i , but we should keep in mind that this is not a parameter, and that it is fully specified by φ , . . . , φ k − . To express the multinomial as an exponential family distribution, we will

k −

define T ( y ) ∈ R as follows:

         

                              T (1) =   , T (2) =   , T (3) =   , · · · , T ( k − 1) =   , T ( k ) =   ,  .   .  . .   .   .  .   .  . . .   .   .   .  . 

Unlike our previous examples, here we do not have T ( y ) = y ; also, T ( y ) is now a k − 1 dimensional vector, rather than a real number. We will write ( T ( y )) i to denote the i -th element of the vector T ( y ). We introduce one more very useful piece of notation. An indicator func- tion 1 {·} takes on a value of 1 if its argument is true, and 0 otherwise (1 { True } = 1, 1 { False } = 0). For example, 1 { 2 = 3 } = 0, and 1 { 3 = − } = 1. So, we can also write the relationship between T ( y ) and y as ( T ( y )) i = 1 { y = i } . (Before you continue reading, please make sure you un- derstand why this is true!) Further, we have that E[( T ( y )) i ] = P ( y = i ) = φ i . We are now ready to show that the multinomial is a member of the

exponential family. We have:

{ y =1 } { y =2 } { y = k }

p ( y ; φ ) = φ φ · · · φ k ∑

k −

{ y =1 } { y =2 } −

i =1

{ y = i }

= φ φ · · · φ k ∑

k −

( T ( y )) ( T ( y )) −

i =1

( T ( y )) i

= φ φ · · · φ k

= exp(( T ( y )) log( φ ) + ( T ( y )) log( φ ) + ( ∑ )

k −

- · · + − i =1

( T ( y )) i log( φ k ))

= exp(( T ( y )) log( φ /φ k ) + ( T ( y )) log( φ /φ k ) + · · · + ( T ( y )) k − log( φ k − /φ k ) + log( φ k ))

T

= b ( y ) exp( η T ( y ) − a ( η ))

where   log( φ /φ k )   log( φ /φ k )   η =  .  .  , .  log( φ k − /φ k )

a ( η ) = − log( φ k ) b ( y ) = .

This completes our formulation of the multinomial as an exponential family distribution. The link function is given (for i = 1 , . . . , k ) by

φ i

η i = log . φ k

For convenience, we have also defined η k = log( φ k /φ k ) = 0. To invert the link function and derive the response function, we therefore have that

η i

φ i

e = φ k η i

φ k e = φ i (3.2) ∑

k

∑

k η i

φ k e = φ i = 1

i =1 i =1

∑ k η i

This implies that φ k = 1 / i =1

e , which can be substituted back into Equa- tion (3.2) to give the response function

η i

e φ i = ∑ k j =1

e

η j

This function mapping from the η ’s to the φ ’s is called the softmax function. To complete our model, we use Assumption 3, given earlier, that the η i ’s

T

are linearly related to the x ’s. So, have η i = θ i

x (for i = 1 , . . . , k − 1),

d +1

where θ , . . . , θ k − ∈ R are the parameters of our model. For notational

T

convenience, we can also define θ k = 0, so that η k = θ k

x = 0, as given previously. Hence, our model assumes that the conditional distribution of y given x is given by

p ( y = i | x ; θ ) = φ i η i

e = ∑ k η j

j =1

e

θ

T

e i

x

= ∑ k θ

T j

x

(3.3)

j =1

e

This model, which applies to classification problems where y ∈ { , . . . , k } , is called softmax regression . It is a generalization of logistic regression. Our hypothesis will output

h θ ( x ) = E[ T ( y ) | x ; θ ]  ∣  { y = 1 } ∣ ∣   { y = 2 } ∣  ∣  = E  .  . ∣ x ; θ  . ∣  ∣ { y = k − } ∣   φ    φ  =  .  .  .  φ k −



exp( θ

T

x )



∑

k T

 j =1

exp( θ

j

x )

 exp( θ

T



x )

 ∑



k 

=1

exp( θ

T

=  j j

x )

  . . .   .  

exp( θ

T k −

x )



∑

k j =1

exp( θ

T j

x )

In other words, our hypothesis will output the estimated probability that p ( y = i | x ; θ ), for every value of i = 1 , . . . , k . (Even though h θ ( x ) as defined above is only ∑ k − 1 dimensional, clearly p ( y = k | x ; θ ) can be obtained as

k −

− i =1

φ i .)

Lastly, let’s discuss parameter fitting. Similar to our original derivation of ordinary least squares and logistic regression, if we have a training set of

( i ) ( i )

n examples { ( x , y ); i = 1 , . . . , n } and would like to learn the parameters θ i of this model, we would begin by writing down the log-likelihood

∑

n ( i ) ( i )

` ( θ ) = log p ( y | x ; θ )

i =1

∑

n

∏

k

(

θ

T

x

( i )

) { y

( i )

= l }

e l

= log ∑ k θ

T ( ) j

x i

i =1 l =1 j =1

e

To obtain the second line above, we used the definition for p ( y | x ; θ ) given in Equation (3.3). We can now obtain the maximum likelihood estimate of the parameters by maximizing ` ( θ ) in terms of θ , using a method such as gradient ascent or Newton’s method.

# Chapter 4

# Generative learning algorithms

So far, we’ve mainly been talking about learning algorithms that model p ( y | x ; θ ), the conditional distribution of y given x . For instance, logistic

T

regression modeled p ( y | x ; θ ) as h θ ( x ) = g ( θ x ) where g is the sigmoid func- tion. In these notes, we’ll talk about a different type of learning algorithm. Consider a classification problem in which we want to learn to distinguish between elephants ( y = 1) and dogs ( y = 0), based on some features of an animal. Given a training set, an algorithm like logistic regression or the perceptron algorithm (basically) tries to find a straight line—that is, a decision boundary—that separates the elephants and dogs. Then, to classify a new animal as either an elephant or a dog, it checks on which side of the decision boundary it falls, and makes its prediction accordingly. Here’s a different approach. First, looking at elephants, we can build a model of what elephants look like. Then, looking at dogs, we can build a separate model of what dogs look like. Finally, to classify a new animal, we can match the new animal against the elephant model, and match it against the dog model, to see whether the new animal looks more like the elephants or more like the dogs we had seen in the training set. Algorithms that try to learn p ( y | x ) directly (such as logistic regression), or algorithms that try to learn mappings directly from the space of inputs X to the labels { , } , (such as the perceptron algorithm) are called discrim- inative learning algorithms. Here, we’ll talk about algorithms that instead try to model p ( x | y ) (and p ( y )). These algorithms are called generative learning algorithms. For instance, if y indicates whether an example is a dog (0) or an elephant (1), then p ( x | y = 0) models the distribution of dogs’ features, and p ( x | y = 1) models the distribution of elephants’ features. After modeling p ( y ) (called the class priors ) and p ( x | y ), our algorithm

can then use Bayes rule to derive the posterior distribution on y given x :

p ( x | y ) p ( y ) p ( y | x ) = . p ( x )

Here, the denominator is given by p ( x ) = p ( x | y = 1) p ( y = 1) + p ( x | y = 0) p ( y = 0) (you should be able to verify that this is true from the standard properties of probabilities), and thus can also be expressed in terms of the quantities p ( x | y ) and p ( y ) that we’ve learned. Actually, if were calculating p ( y | x ) in order to make a prediction, then we don’t actually need to calculate the denominator, since

p ( x | y ) p ( y ) arg max p ( y | x ) = arg max

y y p ( x ) = arg max p ( x | y ) p ( y ) .

y

##### 4.1 Gaussian discriminant analysis

The first generative learning algorithm that we’ll look at is Gaussian discrim- inant analysis (GDA). In this model, we’ll assume that p ( x | y ) is distributed according to a multivariate normal distribution. Let’s talk briefly about the properties of multivariate normal distributions before moving on to the GDA model itself.

###### 4.1.1 The multivariate normal distribution

The multivariate normal distribution in d -dimensions, also called the multi-

d

variate Gaussian distribution, is parameterized by a mean vector μ ∈ R

d × d

and a covariance matrix Σ ∈ R , where Σ ≥ 0 is symmetric and positive semi-definite. Also written “ N ( μ, Σ)”, its density is given by: ( )

T −

p ( x ; μ, Σ) = (2 π ) d/

− ( x − μ ) Σ ( x − μ ) . | Σ | /

exp

In the equation above, “ | Σ | ” denotes the determinant of the matrix Σ. For a random variable X distributed N ( μ, Σ), the mean is (unsurpris- ingly) given by μ : ∫ E[ X ] = x p ( x ; μ, Σ) dx = μ

x

The covariance of a vector-valued random variable Z is defined as Cov( Z ) =

T

E[( Z − E[ Z ])( Z − E[ Z ]) ]. This generalizes the notion of the variance of a

real-valued random variable. The covariance can also be defined as Cov( Z ) =

T T

E[ ZZ ] − (E[ Z ])(E[ Z ]) . (You should be able to prove to yourself that these two definitions are equivalent.) If X ∼ N ( μ, Σ), then

Cov( X ) = Σ .

Here are some examples of what the density of a Gaussian distribution looks like:

0.25 0.25 0.25

0.2 0.2 0.2

0.15 0.15 0.15

0.1 0.1 0.1

0.05 0.05 0.05

−1 −1 −1 −1 −1 −1 −2 −2 −2 −2 −2 −2 −3 −3 −3 −3 −3 −3

The left-most figure shows a Gaussian with mean zero (that is, the 2x1 zero-vector) and covariance matrix Σ = I (the 2x2 identity matrix). A Gaus- sian with zero mean and identity covariance is also called the standard nor- mal distribution . The middle figure shows the density of a Gaussian with zero mean and Σ = 0 . I ; and in the rightmost figure shows one with , Σ = 2 I . We see that as Σ becomes larger, the Gaussian becomes more “spread-out,” and as it becomes smaller, the distribution becomes more “compressed.” Let’s look at some more examples.

0.25 0.25 0.25

0.2 0.2 0.2

0.15 0.15 0.15

0.1 0.1 0.1

0.05 0.05 0.05

−1 −1 −1

−2 −2 −2 −1 −1 −1 −3 −2 −3 −2 −3 −2 −3 −3 −3

The figures above show Gaussians with mean 0, and with covariance matrices respectively [ ] [ ] [ ] 0.5 0.8 Σ = ; Σ = ; Σ = . 0.5 0.8

The leftmost figure shows the familiar standard normal distribution, and we see that as we increase the off-diagonal entry in Σ, the density becomes more

- 

“compressed” towards the 45 line (given by x = x ). We can see this more clearly when we look at the contours of the same three densities:

−1 −1 −1

−2 −2 −2

−3 −3 −3 −3 −2 −1 −3 −2 −1 −3 −2 −1

Here’s one last set of examples generated by varying Σ:

−1 −1 −1

−2 −2 −2

−3 −3 −3

−3 −2 −1 −3 −2 −1 −3 −2 −1

The plots above used, respectively, [ ] [ ] [ ] -0.5 -0.8 0.8 Σ = ; Σ = ; Σ = . -0.5 -0.8 0.8

From the leftmost and middle figures, we see that by decreasing the off- diagonal elements of the covariance matrix, the density now becomes “com- pressed” again, but in the opposite direction. Lastly, as we vary the pa- rameters, more generally the contours will form ellipses (the rightmost figure showing an example). As our last set of examples, fixing Σ = I , by varying μ , we can also move the mean of the density around.

0.25 0.25 0.25

0.2 0.2 0.2

0.15 0.15 0.15

0.1 0.1 0.1

0.05 0.05 0.05

−1 −1 −1 −1 −1 −1 −2 −2 −2 −2 −2 −2 −3 −3 −3 −3 −3 −3

The figures above were generated using Σ = I , and respectively [ ] [ ] [ ] -0.5 -1 μ = ; μ = ; μ = . -1.5

###### 4.1.2 The Gaussian discriminant analysis model

When we have a classification problem in which the input features x are continuous-valued random variables, we can then use the Gaussian Discrim- inant Analysis (GDA) model, which models p ( x | y ) using a multivariate nor- mal distribution. The model is:

| x   | |   | y   | = 0 | ∼   | N   | (   | μ   | ,   | Σ)  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| x   | |   | y   | = 1 | ∼   | N   | (   | μ   | ,   | Σ)  |

Writing out the distributions, this is:

y − y

p ( y ) = φ (1 − φ ) ( )

T −

p ( x | y = 0) = − (2 π ) d/

( x − μ ) Σ ( x − μ ) | Σ | /

exp ( )

T −

p ( x | y = 1) = (2 π ) d/

− ( x − μ ) Σ ( x − μ ) | Σ | /

exp

Here, the parameters of our model are φ , Σ, μ and μ . (Note that while there’re two different mean vectors μ and μ , this model is usually applied using only one covariance matrix Σ.) The log-likelihood of the data is given by

∏

n ( i ) ( i )

` ( φ, μ , μ , Σ) = log p ( x , y ; φ, μ , μ , Σ)

i =1

∏ n ( i ) ( i ) ( i )

= log p ( x | y ; μ , μ , Σ) p ( y ; φ ) .

i =1

By maximizing ` with respect to the parameters, we find the maximum like- lihood estimate of the parameters (see problem set 1) to be:

∑ n ( i )

φ = { y = 1 } n

i =1

∑ n ( i ) ( i ) i =1

{ y = 0 } x μ = ∑ n ( i ) i =1

{ y = 0 } ∑ n ( i ) ( i )

μ ∑

i =1

{ y = 1 } x = n i ) i =1

{ y (

= 1 } ∑

n ( i ) ( i ) T

Σ = ( x − μ y ( i ) )( x − μ y ( i ) ) . n

i =1

Pictorially, what the algorithm is doing can be seen in as follows:

−1

−2

−3

−4

−5

−6

−7 −2 −1

Shown in the figure are the training set, as well as the contours of the two Gaussian distributions that have been fit to the data in each of the two classes. Note that the two Gaussians have contours that are the same shape and orientation, since they share a covariance matrix Σ, but they have different means μ and μ . Also shown in the figure is the straight line giving the decision boundary at which p ( y = 1 | x ) = 0 . 5. On one side of the boundary, we’ll predict y = 1 to be the most likely outcome, and on the other side, we’ll predict y = 0.

###### 4.1.3 Discussion: GDA and logistic regression

The GDA model has an interesting relationship to logistic regression. If we view the quantity p ( y = 1 | x ; φ, μ , μ , Σ) as a function of x , we’ll find that it can be expressed in the form

p ( y = 1 | x ; φ, Σ , μ , μ ) = 1 + exp( − θ T

, x )

where θ is some appropriate function of φ, Σ , μ , μ . This is exactly the form that logistic regression—a discriminative algorithm—used to model p ( y = | x ). When would we prefer one model over another? GDA and logistic regres- sion will, in general, give different decision boundaries when trained on the same dataset. Which is better? We just argued that if p ( x | y ) is multivariate gaussian (with shared Σ), then p ( y | x ) necessarily follows a logistic function. The converse, however, is not true; i.e., p ( y | x ) being a logistic function does not imply p ( x | y ) is multivariate gaussian. This shows that GDA makes stronger modeling as- sumptions about the data than does logistic regression. It turns out that when these modeling assumptions are correct, then GDA will find better fits to the data, and is a better model. Specifically, when p ( x | y ) is indeed gaus- sian (with shared Σ), then GDA is asymptotically efficient . Informally, this means that in the limit of very large training sets (large n ), there is no algorithm that is strictly better than GDA (in terms of, say, how accurately they estimate p ( y | x )). In particular, it can be shown that in this setting, GDA will be a better algorithm than logistic regression; and more generally, even for small training set sizes, we would generally expect GDA to better. In contrast, by making significantly weaker assumptions, logistic regres- sion is also more robust and less sensitive to incorrect modeling assumptions. There are many different sets of assumptions that would lead to p ( y | x ) taking the form of a logistic function. For example, if x | y = 0 ∼ Poisson( λ ), and x | y = 1 ∼ Poisson( λ ), then p ( y | x ) will be logistic. Logistic regression will also work well on Poisson data like this. But if we were to use GDA on such data—and fit Gaussian distributions to such non-Gaussian data—then the results will be less predictable, and GDA may (or may not) do well. To summarize: GDA makes stronger modeling assumptions, and is more data efficient (i.e., requires less training data to learn “well”) when the mod- eling assumptions are correct or at least approximately correct. Logistic

( i )

This uses the convention of redefining the x ’s on the right-hand-side to be ( d + 1)-

( i )

dimensional vectors by adding the extra coordinate x = 1; see problem set 1.

regression makes weaker assumptions, and is significantly more robust to deviations from modeling assumptions. Specifically, when the data is in- deed non-Gaussian, then in the limit of large datasets, logistic regression will almost always do better than GDA. For this reason, in practice logistic re- gression is used more often than GDA. (Some related considerations about discriminative vs. generative models also apply for the Naive Bayes algo- rithm that we discuss next, but the Naive Bayes algorithm is still considered a very good, and is certainly also a very popular, classification algorithm.)

##### 4.2 Naive bayes

In GDA, the feature vectors x were continuous, real-valued vectors. Let’s now talk about a different learning algorithm in which the x j ’s are discrete- valued. For our motivating example, consider building an email spam filter using machine learning. Here, we wish to classify messages according to whether they are unsolicited commercial (spam) email, or non-spam email. After learning to do this, we can then have our mail reader automatically filter out the spam messages and perhaps place them in a separate mail folder. Classifying emails is one example of a broader set of problems called text classification . Let’s say we have a training set (a set of emails labeled as spam or non- spam). We’ll begin our construction of our spam filter by specifying the features x j used to represent an email. We will represent an email via a feature vector whose length is equal to the number of words in the dictionary. Specifically, if an email contains the j -th word of the dictionary, then we will set x j = 1; otherwise, we let x j = 0. For instance, the vector   a     aardvark     .  aardwolf

x =  .  . .  . .     buy    . . .  . . . zygmurgy

is used to represent an email that contains the words “a” and “buy,” but not

“aardvark,” “aardwolf” or “zygmurgy.” The set of words encoded into the feature vector is called the vocabulary , so the dimension of x is equal to the size of the vocabulary. Having chosen our feature vector, we now want to build a generative model. So, we have to model p ( x | y ). But if we have, say, a vocabulary of 50000 words, then x ∈ { , } ( x is a 50000-dimensional vector of 0’s and 1’s), and if we were to model x explicitly with a multinomial distribution over the 2 possible outcomes, then we’d end up with a (2 − 1)-dimensional parameter vector. This is clearly too many parameters. To model p ( x | y ), we will therefore make a very strong assumption. We will assume that the x i ’s are conditionally independent given y . This assumption is called the Naive Bayes (NB) assumption , and the resulting algorithm is called the Naive Bayes classifier . For instance, if y = 1 means spam email; “buy” is word 2087 and “price” is word 39831; then we are assuming that if I tell you y = 1 (that a particular piece of email is spam), then knowledge of x (knowledge of whether “buy” appears in the message) will have no effect on your beliefs about the value of x (whether “price” appears). More formally, this can be written p ( x | y ) = p ( x | y, x ). (Note that this is not the same as saying that x and x are independent, which would have been written “ p ( x ) = p ( x | x )”; rather, we are only assuming that x and x are conditionally independent given y .) We now have:

p ( x , . . . , x | y ) = p ( x | y ) p ( x | y, x ) p ( x | y, x , x ) · · · p ( x | y, x , . . . , x ) = p ( x | y ) p ( x | y ) p ( x | y ) · · · p ( x | y ) ∏

d

= p ( x j | y )

j =1

The first equality simply follows from the usual properties of probabilities, and the second equality used the NB assumption. We note that even though

Actually, rather than looking through an English dictionary for the list of all English words, in practice it is more common to look through our training set and encode in our feature vector only the words that occur at least once there. Apart from reducing the number of words modeled and hence reducing our computational and space requirements, this also has the advantage of allowing us to model/include as a feature many words that may appear in your email (such as “cs229”) but that you won’t find in a dictionary. Sometimes (as in the homework), we also exclude the very high frequency words (which will be words like “the,” “of,” “and”; these high frequency, “content free” words are called stop words ) since they occur in so many documents and do little to indicate whether an email is spam or non-spam.

the Naive Bayes assumption is an extremely strong assumptions, the resulting algorithm works well on many problems. Our model is parameterized by φ j | y =1 = p ( x j = 1 | y = 1), φ j | y =0 = p ( x j =

( i ) ( i )

| y = 0), and φ y = p ( y = 1). As usual, given a training set { ( x , y ); i = , . . . , n } , we can write down the joint likelihood of the data:

∏

n ( i ) ( i )

L ( φ y , φ j | y =0 , φ j | y =1 ) = p ( x , y ) .

i =1

Maximizing this with respect to φ y , φ j | y =0 and φ j | y =1 gives the maximum likelihood estimates: ∑ n ( i ) ( i ) i =1

{ x j

= 1 ∧ y = 1 } φ j | y =1 = ∑ n ( i ) i =1

{ y = 1 } ∑ n ( i ) ( i ) i =1

{ x j

= 1 ∧ y = 0 } φ j | y =0 = ∑ n i =1

{ y ( i )

= 0 } ∑ n ( i ) i =1

{ y = 1 } φ y = n

In the equations above, the “ ∧ ” symbol means “and.” The parameters have a very natural interpretation. For instance, φ j | y =1 is just the fraction of the spam ( y = 1) emails in which word j does appear. Having fit all these parameters, to make a prediction on a new example with features x , we then simply calculate

p ( x | y = 1) p ( y = 1) p ( y = 1 | x ) = p ( x ) ( ∏ )

d j =1

p ( x j | y = 1) p ( y = 1) = ( ∏ ) (

d

∏ ) ,

d j =1

p ( x j | y = 1) p ( y = 1) + j =1

p ( x j | y = 0) p ( y = 0)

and pick whichever class has the higher posterior probability. Lastly, we note that while we have developed the Naive Bayes algorithm mainly for the case of problems where the features x j are binary-valued, the generalization to where x j can take values in { , , . . . , k j } is straightforward. Here, we would simply model p ( x j | y ) as multinomial rather than as Bernoulli. Indeed, even if some original input attribute (say, the living area of a house, as in our earlier example) were continuous valued, it is quite common to discretize it—that is, turn it into a small set of discrete values—and apply Naive Bayes. For instance, if we use some feature x j to represent living area, we might discretize the continuous values as follows:

Living area (sq. feet) < 400-800 800-1200 1200-1600 > x i

Thus, for a house with living area 890 square feet, we would set the value of the corresponding feature x j to 3. We can then apply the Naive Bayes algorithm, and model p ( x j | y ) with a multinomial distribution, as described previously. When the original, continuous-valued attributes are not well- modeled by a multivariate normal distribution, discretizing the features and using Naive Bayes (instead of GDA) will often result in a better classifier.

###### 4.2.1 Laplace smoothing

The Naive Bayes algorithm as we have described it will work fairly well for many problems, but there is a simple change that makes it work much better, especially for text classification. Let’s briefly discuss a problem with the algorithm in its current form, and then talk about how we can fix it. Consider spam/email classification, and let’s suppose that, we are in the year of 20xx, after completing CS229 and having done excellent work on the project, you decide around May 20xx to submit work you did to the NeurIPS conference for publication. Because you end up discussing the conference in your emails, you also start getting messages with the word “neurips” in it. But this is your first NeurIPS paper, and until this time, you had not previously seen any emails containing the word “neurips”; in particular “neurips” did not ever appear in your training set of spam/non-spam emails. Assuming that “neurips” was the 35000th word in the dictionary, your Naive Bayes spam filter therefore had picked its maximum likelihood estimates of the parameters φ | y to be

∑ n ( i ) ( i ) i =1

{ x = 1 ∧ y = 1 } φ | y =1 = ∑ n ( i )

= 0

i =1

{ y = 1 } ∑ n ( i ) ( i ) i =1

{ x = 1 ∧ y = 0 } φ | y =0 = ∑ n i

= 0

i =1

{ y ( )

= 0 }

I.e., because it has never seen “neurips” before in either spam or non-spam training examples, it thinks the probability of seeing it in either type of email is zero. Hence, when trying to decide if one of these messages containing

NeurIPS is one of the top machine learning conferences. The deadline for submitting a paper is typically in May-June.

| ∏   | d   |
| --- | --- |
| j   | =1  |

p ( x j | y = 1) p ( y = 1) p ( y = 1 | x ) = ∏ d

∏ d j =1

p ( x j | y = 1) p ( y = 1) + j =1

p ( x j | y = 0) p ( y = 0)

= .

∏ d

This is because each of the terms “ j =1

p ( x j | y )” includes a term p ( x | y ) = 0 that is multiplied into it. Hence, our algorithm obtains 0 / 0, and doesn’t know how to make a prediction. Stating the problem more broadly, it is statistically a bad idea to esti- mate the probability of some event to be zero just because you haven’t seen it before in your finite training set. Take the problem of estimating the mean of a multinomial random variable z taking values in { , . . . , k } . We can pa- rameterize our multinomial with φ j = p ( z = j ). Given a set of n independent

(1) ( n )

observations { z , . . . , z } , the maximum likelihood estimates are given by ∑ n ( i ) i =1

{ z = j } φ j = . n

As we saw previously, if we were to use these maximum likelihood estimates, then some of the φ j ’s might end up as zero, which was a problem. To avoid this, we can use Laplace smoothing , which replaces the above estimate with ∑ n ( i )

1 + i =1

{ z = j } φ j =  . k + n Here, we’ve added 1 to the numerator, and ∑ k to the denominator. Note that

k j =1

φ j = 1 still holds (check this yourself!), which is a desirable property since the φ j ’s are estimates for probabilities that we know must sum to 1. Also, φ j = 0 for all values of j , solving our problem of probabilities being estimated as zero. Under certain (arguably quite strong) conditions, it can be shown that the Laplace smoothing actually gives the optimal estimator of the φ j ’s. Returning to our Naive Bayes classifier, with Laplace smoothing, we therefore obtain the following estimates of the parameters: ∑ n ( i ) ( i )

1 + i =1

{ x j

= 1 ∧ y = 1 } φ j | y =1 = ∑ n

2 + ( i ) i =1

{ y = 1 } ∑ n ( i ) ( i )

1 + i =1

{ x j

= 1 ∧ y = 0 } φ j | y =0 = ∑ n

2 + ( i i =1

{ y )

= 0 }

(In practice, it usually doesn’t matter much whether we apply Laplace smooth- ing to φ y or not, since we will typically have a fair fraction each of spam and non-spam messages, so φ y will be a reasonable estimate of p ( y = 1) and will be quite far from 0 anyway.)

###### 4.2.2 Event models for text classification

To close off our discussion of generative learning algorithms, let’s talk about one more model that is specifically for text classification. While Naive Bayes as we’ve presented it will work well for many classification problems, for text classification, there is a related model that does even better. In the specific context of text classification, Naive Bayes as presented uses the what’s called the Bernoulli event model (or sometimes multi-variate Bernoulli event model ). In this model, we assumed that the way an email is generated is that first it is randomly determined (according to the class priors p ( y )) whether a spammer or non-spammer will send you your next message. Then, the person sending the email runs through the dictionary, deciding whether to include each word j in that email independently and according to the probabilities p ( x j = 1 | y ) = φ ∏

j | y . Thus, the probability of a

d

message was given by p ( y ) j =1

p ( x j | y ). Here’s a different model, called the Multinomial event model . To describe this model, we will use a different notation and set of features for representing emails. We let x j denote the identity of the j -th word in the email. Thus, x j is now an integer taking values in { , . . . , | V |} , where | V | is the size of our vocabulary (dictionary). An email of d words is now rep- resented by a vector ( x , x , . . . , x d ) of length d ; note that d can vary for different documents. For instance, if an email starts with “A NeurIPS . . . ,” then x = 1 (“a” is the first word in the dictionary), and x = 35000 (if “neurips” is the 35000th word in the dictionary). In the multinomial event model, we assume that the way an email is generated is via a random process in which spam/non-spam is first deter- mined (according to p ( y )) as before. Then, the sender of the email writes the email by first generating x from some multinomial distribution over words ( p ( x | y )). Next, the second word x is chosen independently of x but from the same multinomial distribution, and similarly for x , x , and so on, until all d words of the email have been generated. Thus, the overall probability of ∏ d

a message is given by p ( y ) j =1

p ( x j | y ). Note that this formula looks like the one we had earlier for the probability of a message under the Bernoulli event model, but that the terms in the formula now mean very different things. In particular x j | y is now a multinomial, rather than a Bernoulli distribution.

The parameters for our new model are φ y = p ( y ) as before, φ k | y =1 = p ( x j = k | y = 1) (for any j ) and φ k | y =0 = p ( x j = k | y = 0). Note that we have assumed that p ( x j | y ) is the same for all values of j (i.e., that the distribution according to which a word is generated does not depend on its position j within the email).

( i ) ( i ) ( i )

If we are given a training set { ( x , y ); i = 1 , . . . , n } where x =

( i ) ( i ) ( i )

( x , x , . . . , x d i

) (here, d i is the number of words in the i -training example), the likelihood of the data is given by

∏

n ( i ) ( i )

L ( φ y , φ k | y =0 , φ k | y =1 ) = p ( x , y )

i =1

∏ n

( ) ∏

d i

( i ) ( i )

= p ( x j

| y ; φ k | y =0 , φ k | y =1 ) p ( y ; φ y ) .

i =1 j =1

Maximizing this yields the maximum likelihood estimates of the parameters:

∑ n

∑ d i ( i ) ( i ) i =1 j =1

{ x j

= k ∧ y = 1 } φ k | y =1 = ∑ n i =1

{ y ( i )

= 1 } d i

∑ n

∑ d i ( i ) ( i ) i =1 j =1

{ x j

= k ∧ y = 0 } φ k | y =0 = ∑ n ( i ) i =1

{ y = 0 } d i

∑ n ( i ) i =1

{ y = 1 } φ y = . n

If we were to apply Laplace smoothing (which is needed in practice for good performance) when estimating φ k | y =0 and φ k | y =1 , we add 1 to the numerators and | V | to the denominators, and obtain:

∑ n

∑ d i ( i ) ( i )

1 + i =1 j =1

{ x j

= k ∧ y = 1 } φ k | y =1 = ∑ n

| V | + ( i ) i =1

{ y = 1 } d i

∑ n

∑ d i ( i ) ( i )

1 + i =1 j =1

{ x j

= k ∧ y = 0 } φ k | y =0 = ∑ n

| V | + i =1

{ y ( i )

. = 0 } d i

While not necessarily the very best classification algorithm, the Naive Bayes classifier often works surprisingly well. It is often also a very good “first thing to try,” given its simplicity and ease of implementation.

# Chapter 5

# Kernel methods

##### 5.1 Feature maps

Recall that in our discussion about linear regression, we considered the prob- lem of predicting the price of a house (denoted by y ) from the living area of the house (denoted by x ), and we fit a linear function of x to the training data. What if the price y can be more accurately represented as a non-linear function of x ? In this case, we need a more expressive family of models than linear models. We start by considering fitting cubic functions y = θ x + θ x + θ x + θ . It turns out that we can view the cubic function as a linear function over the a different set of feature variables (defined below). Concretely, let the function φ : R → R be defined as

 

 x  φ ( x ) =    x  ∈ R . (5.1)

x

Let θ ∈ R be the vector containing θ , θ , θ , θ as entries. Then we can rewrite the cubic function in x as:

T

θ x + θ x + θ x + θ = θ φ ( x )

Thus, a cubic function of the variable x can be viewed as a linear function over the variables φ ( x ). To distinguish between these two sets of variables, in the context of kernel methods, we will call the “original” input value the input attributes of a problem (in this case, x , the living area). When the

original input is mapped to some new set of quantities φ ( x ), we will call those new quantities the features variables. (Unfortunately, different authors use different terms to describe these two things in different contexts.) We will call φ a feature map , which maps the attributes to the features.

##### 5.2 LMS (least mean squares) with features

T

We will derive the gradient descent algorithm for fitting the model θ φ ( x ).

T

First recall that for ordinary least square problem where we were to fit θ x , the batch gradient descent update is (see the first lecture note for its deriva- tion):

∑

n

(

( i ) ( i )

)

( i )

θ := θ + α y − h θ ( x ) x

i =1

∑ n

(

( i ) T ( i )

)

( i )

:= θ + α y − θ x x . (5.2)

i =1

d p d

Let φ : R → R be a feature map that maps attribute x (in R ) to the

p

features φ ( x ) in R . (In the motivating example in the previous subsection,

T

we have d = 1 and p = 4.) Now our goal is to fit the function θ φ ( x ), with

p d

θ being a vector in R instead of R . We can replace all the occurrences of

( i ) ( i )

x in the algorithm above by φ ( x ) to obtain the new update:

∑

n

(

( i ) T ( i )

)

( i )

θ := θ + α y − θ φ ( x ) φ ( x ) (5.3)

i =1

Similarly, the corresponding stochastic gradient descent update rule is (

( i ) T ( i )

)

( i )

θ := θ + α y − θ φ ( x ) φ ( x ) (5.4)

##### 5.3 LMS with the kernel trick

The gradient descent update, or stochastic gradient update above becomes computationally expensive when the features φ ( x ) is high-dimensional. For example, consider the direct extension of the feature map in equation (5.1)

d

to high-dimensional input x : suppose x ∈ R , and let φ ( x ) be the vector that

contains all the monomials of x with degree ≤  

  x     x    .  .  .      x     x x    φ ( x  x x  ) =  . (5.5)  .  .  .     x x    .  .  .     x     x x   . . .

The dimension of the features φ ( x ) is on the order of d . This is a pro- hibitively long vector for computational purpose — when d = 1000, each update requires at least computing and storing a 1000 = 10 dimensional vector, which is 10 times slower than the update rule for for ordinary least squares updates (5.2). It may appear at first that such d runtime per update and memory usage are inevitable, because the vector θ itself is of dimension p ≈ d , and we may need to update every entry of θ and store it. However, we will introduce the kernel trick with which we will not need to store θ explicitly, and the runtime can be significantly improved. For simplicity, we assume the initialize the value θ = 0, and we focus on the iterative update (5.3). The main observation is that at any time, θ

(1) ( n )

can be represented as a linear combination of the vectors φ ( x ) , . . . , φ ( x ). Indeed, we can show this inductively as follows. At initialization, ∑ θ = 0 =

n ( i ) i =1

- φ ( x ). Assume at some point, θ can be represented as

∑ n ( i )

θ = β i φ ( x ) (5.6)

i =1

Here, for simplicity, we include all the monomials with repetitions (so that, e.g., x x x and x x x both appear in φ ( x )). Therefore, there are totally 1 + d + d + d entries in φ ( x ).

for some β , . . . , β n ∈ R . Then we claim that in the next round, θ is still a

(1) ( n )

linear combination of φ ( x ) , . . . , φ ( x ) because

∑ n

(

( i ) T ( i )

)

( i )

θ := θ + α y − θ φ ( x ) φ ( x )

i =1

∑

n

∑

n ( i )

(

( i ) T ( i )

)

( i )

= β i φ ( x ) + α y − θ φ ( x ) φ ( x )

i =1 i =1

∑ n

(

( i ) T ( i )

)

( i )

= ( β i + α y − θ φ ( x ) ) φ ( x ) (5.7)

i =1

︸ ︷︷ ︸

new β i

You may realize that our general strategy is to implicitly represent the p - dimensional vector θ by a set of coefficients β , . . . , β n . Towards doing this, we derive the update rule of the coefficients β , . . . , β n . Using the equation above, we see that the new β i depends on the old one via (

( i ) T ( i )

) β i := β i + α y − θ φ ( x ) (5.8)

Here we still have the old ∑ θ on the RHS of the equation. Replacing θ by

n ( j )

θ = j =1

β j φ ( x ) gives

( ) ∑ n ( i ) ( j ) T ( i )

∀ i ∈ { , . . . , n } , β i := β i + α y − β j φ ( x ) φ ( x )

j =1

( j ) T ( i ) ( j ) ( i )

We often rewrite φ ( x ) φ ( x ) as 〈 φ ( x ) , φ ( x ) 〉 to emphasize that it’s the inner product of the two feature vectors. Viewing β i ’s as the new representa- tion of θ , we have successfully translated the batch gradient descent algorithm into an algorithm that updates the value of β iteratively. It may appear that

( j ) ( i )

at every iteration, we still need to compute the values of 〈 φ ( x ) , φ ( x ) 〉 for all pairs of i, j , each of which may take roughly O ( p ) operation. However, two important properties come to rescue:

( j ) ( i )

1. We can pre-compute the pairwise inner products 〈 φ ( x ) , φ ( x ) 〉 for all pairs of i, j before the loop starts.

2. For the feature map φ defined in (5.5) (or many other interesting fea-

( j ) ( i )

ture maps), computing 〈 φ ( x ) , φ ( x ) 〉 can be efficient and does not

( i )

necessarily require computing φ ( x ) explicitly. This is because:

∑

d

∑ ∑ 〈 φ ( x ) , φ ( z ) 〉 = 1 + x i z i + x i x j z i z j + x i x j x k z i z j z k

i =1 i,j ∈{ ,...,d } i,j,k ∈{ ,...,d }

( ) ∑

d

∑

d

) ( ∑

d

= 1 + x i z i + x i z i + x i z i

i =1 i =1 i =1

= 1 + 〈 x, z 〉 + 〈 x, z 〉 + 〈 x, z 〉 (5.9)

Therefore, to compute 〈 φ ( x ) , φ ( z ) 〉 , we can first compute 〈 x, z 〉 with O ( d ) time and then take another constant number of operations to com- pute 1 + 〈 x, z 〉 + 〈 x, z 〉 + 〈 x, z 〉 .

As you will see, the inner products between the features 〈 φ ( x ) , φ ( z ) 〉 are essential here. We define the Kernel corresponding to the feature map φ as a function that maps X × X → R satisfying:

K ( x, z ) , 〈 φ ( x ) , φ ( z ) 〉 (5.10)

To wrap up the discussion, we write the down the final algorithm as follows:

( i ) ( j ) ( i ) ( j )

1. Compute all the values K ( x , x ) , 〈 φ ( x ) , φ ( x ) 〉 using equa- tion (5.9) for all i, j ∈ { , . . . , n } . Set β := 0.

2. Loop: ( ∑ n

)

( i ) ( i ) ( j )

∀ i ∈ { , . . . , n } , β i := β i + α y − β j K ( x , x ) (5.11)

j =1

Or in vector notation, letting K be the n × n matrix with K ij =

( i ) ( j )

K ( x , x ), we have

β := β + α ( ~ y − Kβ )

With the algorithm above, we can update the representation β of the vector θ efficiently with O ( n ) time per update. Finally, we need to show that

d

Recall that X is the space of the input x . In our running example, X = R

the knowledge of the representation β suffices to compute the prediction

T

θ φ ( x ). Indeed, we have

∑ n

∑ n T ( i ) T ( i )

θ φ ( x ) = β i φ ( x ) φ ( x ) = β i K ( x , x ) (5.12)

i =1 i =1

You may realize that fundamentally all we need to know about the feature map φ ( · ) is encapsulated in the corresponding kernel function K ( · , · ). We will expand on this in the next section.

##### 5.4 Properties of kernels

In the last subsection, we started with an explicitly defined feature map φ , which induces the kernel function K ( x, z ) , 〈 φ ( x ) , φ ( z ) 〉 . Then we saw that the kernel function is so intrinsic so that as long as the kernel function is defined, the whole training algorithm can be written entirely in the language of the kernel without referring to the feature map φ , so can the prediction of a test example x (equation (5.12).) Therefore, it would be tempted to define other kernel function K ( · , · ) and run the algorithm (5.11). Note that the algorithm (5.11) does not need to explicitly access the feature map φ , and therefore we only need to ensure the existence of the feature map φ , but do not necessarily need to be able to explicitly write φ down. What kinds of functions K ( · , · ) can correspond to some feature map φ ? In other words, can we tell if there is some feature mapping φ so that K ( x, z ) =

T

φ ( x ) φ ( z ) for all x , z ? If we can answer this question by giving a precise characterization of valid kernel functions, then we can completely change the interface of selecting feature maps φ to the interface of selecting kernel function K . Concretely, we can pick a function K , verify that it satisfies the characterization (so that there exists a feature map φ that K corresponds to), and then we can run update rule (5.11). The benefit here is that we don’t have to be able to compute φ or write it down analytically, and we only need to know its existence. We will answer this question at the end of this subsection after we go through several concrete examples of kernels.

d

Suppose x, z ∈ R , and let’s first consider the function K ( · , · ) defined as:

T

K ( x, z ) = ( x z ) .

We can also write this as ( ∑

d

) ( ∑

d

)

K ( x, z ) = x i z i x j z j

i =1 j =1

∑ d

∑ d

= x i x j z i z j

i =1 j =1

∑

d

= ( x i x j )( z i z j )

i,j =1

Thus, we see that K ( x, z ) = 〈 φ ( x ) , φ ( z ) 〉 is the kernel function that corre- sponds to the the feature mapping φ given (shown here for the case of d = 3) by   x x   x x     x x     x x   φ ( x ) =    x x  .    x x    x x    x x  x x

Revisiting the computational efficiency perspective of kernel, note that whereas calculating the high-dimensional φ ( x ) requires O ( d ) time, finding K ( x, z ) takes only O ( d ) time—linear in the dimension of the input attributes. For another related example, also consider K ( · , · ) defined by

T

K ( x, z ) = ( x z + c ) ∑ d

∑ d

√ √ = ( x i x j )( z i z j ) + ( cx i )( cz i ) + c .

i,j =1 i =1

(Check this yourself.) This function K is a kernel function that corresponds

to the feature mapping (again shown for d = 3)   x x   x x     x x     x x     x x     x x   φ ( x ) =   x x   ,   x x     √ x x     √ cx     √ cx    cx 

c

and the parameter c controls the relative weighting between the x i (first order) and the x i x j (second order) terms.

T k

More broadly, the kernel ( K ( x, z ) = ( x z + c ) corresponds to a feature

d + k

) mapping to an

k

feature space, corresponding of all monomials of the form x i x i . . . x i k

that are up to order k . However, despite working in this

k

O ( d )-dimensional space, computing K ( x, z ) still takes only O ( d ) time, and hence we never need to explicitly represent feature vectors in this very high dimensional feature space.

Kernels as similarity metrics. Now, let’s talk about a slightly different view of kernels. Intuitively, (and there are things wrong with this intuition, but nevermind), if φ ( x ) and φ ( z ) are close together, then we might expect

T

K ( x, z ) = φ ( x ) φ ( z ) to be large. Conversely, if φ ( x ) and φ ( z ) are far apart—

T

say nearly orthogonal to each other—then K ( x, z ) = φ ( x ) φ ( z ) will be small. So, we can think of K ( x, z ) as some measurement of how similar are φ ( x ) and φ ( z ), or of how similar are x and z . Given this intuition, suppose that for some learning problem that you’re working on, you’ve come up with some function K ( x, z ) that you think might be a reasonable measure of how similar x and z are. For instance, perhaps you chose ( ) || x − z || K ( x, z ) = exp − . σ

This is a reasonable measure of x and z ’s similarity, and is close to 1 when x and z are close, and near 0 when x and z are far apart. Does there exist

a feature map φ such that the kernel K defined above satisfies K ( x, z ) =

T

φ ( x ) φ ( z )? In this particular example, the answer is yes. This kernel is called the Gaussian kernel , and corresponds to an infinite dimensional feature mapping φ . We will give a precise characterization about what properties a function K needs to satisfy so that it can be a valid kernel function that corresponds to some feature map φ .

Necessary conditions for valid kernels. Suppose for now that K is indeed a valid kernel corresponding to some feature mapping φ , and we will first see what properties it satisfies. Now, consider some finite set of n points

(1) ( n )

(not necessarily the training set) { x , . . . , x } , and let a square, n -by- n

( i ) ( j )

matrix K be defined so that its ( i, j )-entry is given by K ij = K ( x , x ). This matrix is called the kernel matrix . Note that we’ve overloaded the notation and used K to denote both the kernel function K ( x, z ) and the kernel matrix K , due to their obvious close relationship.

( i ) ( j ) ( i ) T ( j )

Now, if K is a valid kernel, then K ij = K ( x , x ) = φ ( x ) φ ( x ) =

( j ) T ( i ) ( j ) ( i )

φ ( x ) φ ( x ) = K ( x , x ) = K ji , and hence K must be symmetric. More- over, letting φ k ( x ) denote the k -th coordinate of the vector φ ( x ), we find that for any vector z , we have ∑ ∑

T

z Kz = z i K ij z j

i j

∑ ∑

( i ) T ( j )

= z i φ ( x ) φ ( x ) z j

i j

∑ ∑ ∑

( i ) ( j )

= z i φ k ( x ) φ k ( x ) z j

i j k

∑ ∑ ∑

( i ) ( j )

= z i φ k ( x ) φ k ( x ) z j

k i j

( ) ∑ ∑

( i )

= z i φ k ( x )

k i

≥ . ∑ ∑ The second-to-last step uses the fact that i,j

a i a j = ( i

a i ) for a i =

( i )

z i φ k ( x ). Since z was arbitrary, this shows that K is positive semi-definite ( K ≥ 0). Hence, we’ve shown that if K is a valid kernel (i.e., if it corresponds to

n × n

some feature mapping φ ), then the corresponding kernel matrix K ∈ R is symmetric positive semidefinite.

Sufficient conditions for valid kernels. More generally, the condition above turns out to be not only a necessary, but also a sufficient, condition for K to be a valid kernel (also called a Mercer kernel). The following result is due to Mercer.

d d

Theorem (Mercer). Let K : R × R → R be given. Then for K to be a valid (Mercer) kernel, it is necessary and sufficient that for any

(1) ( n )

{ x , . . . , x } , ( n < ∞ ), the corresponding kernel matrix is symmetric pos- itive semi-definite.

Given a function K , apart from trying to find a feature mapping φ that corresponds to it, this theorem therefore gives another way of testing if it is a valid kernel. You’ll also have a chance to play with these ideas more in problem set 2. In class, we also briefly talked about a couple of other examples of ker- nels. For instance, consider the digit recognition problem, in which given an image (16x16 pixels) of a handwritten digit (0-9), we have to figure out

T k

which digit it was. Using either a simple polynomial kernel K ( x, z ) = ( x z ) or the Gaussian kernel, SVMs were able to obtain extremely good perfor- mance on this problem. This was particularly surprising since the input attributes x were just 256-dimensional vectors of the image pixel intensity values, and the system had no prior knowledge about vision, or even about which pixels are adjacent to which other ones. Another example that we briefly talked about in lecture was that if the objects x that we are trying to classify are strings (say, x is a list of amino acids, which strung together form a protein), then it seems hard to construct a reasonable, “small” set of features for most learning algorithms, especially if different strings have dif- ferent lengths. However, consider letting φ ( x ) be a feature vector that counts the number of occurrences of each length- k substring in x . If we’re consid-

k

ering strings of English letters, then there are 26 such strings. Hence, φ ( x )

k

is a 26 dimensional vector; even for moderate values of k , this is probably too big for us to efficiently work with. (e.g., 26 ≈ 460000.) However, using (dynamic programming-ish) string matching algorithms, it is possible to ef-

T

ficiently compute K ( x, z ) = φ ( x ) φ ( z ), so that we can now implicitly work

k

in this 26 -dimensional feature space, but without ever explicitly computing feature vectors in this space.

Many texts present Mercer’s theorem in a slightly more complicated form involving

d

L functions, but when the input attributes take values in R , the version given here is equivalent.

Application of kernel methods: We’ve seen the application of kernels to linear regression. In the next part, we will introduce the support vector machines to which kernels can be directly applied. dwell too much longer on it here. In fact, the idea of kernels has significantly broader applicability than linear regression and SVMs. Specifically, if you have any learning algorithm that you can write in terms of only inner products 〈 x, z 〉 between input attribute vectors, then by replacing this with K ( x, z ) where K is a kernel, you can “magically” allow your algorithm to work efficiently in the high dimensional feature space corresponding to K . For instance, this kernel trick can be applied with the perceptron to derive a kernel perceptron algorithm. Many of the algorithms that we’ll see later in this class will also be amenable to this method, which has come to be known as the “kernel trick.”

# Chapter 6

# Support vector machines

This set of notes presents the Support Vector Machine (SVM) learning al- gorithm. SVMs are among the best (and many believe are indeed the best) “off-the-shelf” supervised learning algorithms. To tell the SVM story, we’ll need to first talk about margins and the idea of separating data with a large “gap.” Next, we’ll talk about the optimal margin classifier, which will lead us into a digression on Lagrange duality. We’ll also see kernels, which give a way to apply SVMs efficiently in very high dimensional (such as infinite- dimensional) feature spaces, and finally, we’ll close off the story with the SMO algorithm, which gives an efficient implementation of SVMs.

##### 6.1 Margins: intuition

We’ll start our story on SVMs by talking about margins. This section will give the intuitions about margins and about the “confidence” of our predic- tions; these ideas will be made formal in Section 6.3. Consider logistic regression, where the probability p ( y = 1 | x ; θ ) is mod-

T

eled by h θ ( x ) = g ( θ x ). We then predict “1” on an input x if and only if

T

h θ ( x ) ≥ . 5, or equivalently, if and only if θ x ≥ 0. Consider a positive

T

training example ( y = 1). The larger θ x is, the larger also is h θ ( x ) = p ( y = | x ; θ ), and thus also the higher our degree of “confidence” that the label is 1. Thus, informally we can think of our prediction as being very confident that

T

y = 1 if θ x  0. Similarly, we think of logistic regression as confidently

T

predicting y = 0, if θ x  0. Given a training set, again informally it seems that we’d have found a good fit to the training data if we can find θ so that

T ( i ) ( i ) T ( i ) ( i )

θ x  0 whenever y = 1, and θ x  0 whenever y = 0, since this would reflect a very confident (and correct) set of classifications for all the

training examples. This seems to be a nice goal to aim for, and we’ll soon formalize this idea using the notion of functional margins. For a different type of intuition, consider the following figure, in which x’s represent positive training examples, o’s denote negative training examples,

T

a decision boundary (this is the line given by the equation θ x = 0, and is also called the separating hyperplane ) is also shown, and three points have also been labeled A, B and C.

A   

B   

C   

Notice that the point A is very far from the decision boundary. If we are asked to make a prediction for the value of y at A, it seems we should be quite confident that y = 1 there. Conversely, the point C is very close to the decision boundary, and while it’s on the side of the decision boundary on which we would predict y = 1, it seems likely that just a small change to the decision boundary could easily have caused out prediction to be y = 0. Hence, we’re much more confident about our prediction at A than at C. The point B lies in-between these two cases, and more broadly, we see that if a point is far from the separating hyperplane, then we may be significantly more confident in our predictions. Again, informally we think it would be nice if, given a training set, we manage to find a decision boundary that allows us to make all correct and confident (meaning far from the decision boundary) predictions on the training examples. We’ll formalize this later using the notion of geometric margins.

##### 6.2 Notation (option reading)

To make our discussion of SVMs easier, we’ll first need to introduce a new notation for talking about classification. We will be considering a linear classifier for a binary classification problem with labels y and features x . From now, we’ll use y ∈ {− , } (instead of { , } ) to denote the class labels. Also, rather than parameterizing our linear classifier with the vector θ , we will use parameters w, b , and write our classifier as

T

h w,b ( x ) = g ( w x + b ) .

Here, g ( z ) = 1 if z ≥ 0, and g ( z ) = − 1 otherwise. This “ w, b ” notation allows us to explicitly treat the intercept term b separately from the other parameters. (We also drop the convention we had previously of letting x = 1 be an extra coordinate in the input feature vector.) Thus, b takes the role of

T

what was previously θ , and w takes the role of [ θ . . . θ d ] . Note also that, from our definition of g above, our classifier will directly predict either 1 or − 1 (cf. the perceptron algorithm), without first going through the intermediate step of estimating p ( y = 1) (which is what logistic regression does).

##### 6.3 Functional and geometric margins (op- tion reading)

Let’s formalize the notions of the functional and geometric margins. Given a

( i ) ( i )

training example ( x , y ), we define the functional margin of ( w, b ) with respect to the training example as

( i ) ( i ) T ( i )

γ ˆ = y ( w x + b ) .

( i )

Note that if y = 1, then for the functional margin to be large (i.e., for

T ( i )

our prediction to be confident and correct), we need w x + b to be a large

( i )

positive number. Conversely, if y = − 1, then for the functional margin

T ( i )

to be large, we need w x + b to be a large negative number. Moreover, if

( i ) T ( i )

y ( w x + b ) > 0, then our prediction on this example is correct. (Check this yourself.) Hence, a large functional margin represents a confident and a correct prediction. For a linear classifier with the choice of g given above (taking values in {− , } ), there’s one property of the functional margin that makes it not a very good measure of confidence, however. Given our choice of g , we note that

T T

if we replace w with 2 w and b with 2 b , then since g ( w x + b ) = g (2 w x + 2 b ), this would not change h w,b ( x ) at all. I.e., g , and hence also h w,b ( x ), depends

T

only on the sign, but not on the magnitude, of w x + b . However, replacing ( w, b ) with (2 w, b ) also results in multiplying our functional margin by a factor of 2. Thus, it seems that by exploiting our freedom to scale w and b , we can make the functional margin arbitrarily large without really changing anything meaningful. Intuitively, it might therefore make sense to impose some sort of normalization condition such as that || w || = 1; i.e., we might replace ( w, b ) with ( w/ || w || , b/ || w || ), and instead consider the functional margin of ( w/ || w || , b/ || w || ). We’ll come back to this later.

( i ) ( i )

Given a training set S = { ( x , y ); i = 1 , . . . , n } , we also define the function margin of ( w, b ) with respect to S as the smallest of the functional margins of the individual training examples. Denoted by ˆ γ , this can therefore be written:

( i )

γ ˆ = min γ ˆ .

i =1 ,...,n

Next, let’s talk about geometric margins . Consider the picture below:

A w

(i)

γ

B

The decision boundary corresponding to ( w, b ) is shown, along with the

- 

vector w . Note that w is orthogonal (at 90 ) to the separating hyperplane. (You should convince yourself that this must be the case.) Consider the

( i )

point at A, which represents the input x of some training example with

( i ) ( i )

label y = 1. Its distance to the decision boundary, γ , is given by the line segment AB.

( i )

How can we find the value of γ ? Well, w/ || w || is a unit-length vector

( i )

pointing in the same direction as w . Since A represents x , we therefore

( i ) ( i )

find that the point B is given by x − γ · w/ || w || . But this point lies on the decision boundary, and all points x on the decision boundary satisfy the

T

equation w x + b = 0. Hence, ( )

T ( i ) ( i )

w w x − γ + b = 0 . || w ||

( i )

Solving for γ yields

T ( i )

( ) T ( i )

w x + b w ( i )

b γ = = x + . || w || || w || || w ||

This was worked out for the case of a positive training example at A in the figure, where being on the “positive” side of the decision boundary is good. More generally, we define the geometric margin of ( w, b ) with respect to a

( i ) ( i )

training example ( x , y ) to be ( ( ) )

T ( i ) ( i )

w ( i )

b γ = y x + . || w || || w ||

Note that if || w || = 1, then the functional margin equals the geometric margin—this thus gives us a way of relating these two different notions of margin. Also, the geometric margin is invariant to rescaling of the parame- ters; i.e., if we replace w with 2 w and b with 2 b , then the geometric margin does not change. This will in fact come in handy later. Specifically, because of this invariance to the scaling of the parameters, when trying to fit w and b to training data, we can impose an arbitrary scaling constraint on w without changing anything important; for instance, we can demand that || w || = 1, or | w | = 5, or | w + b | + | w | = 2, and any of these can be satisfied simply by rescaling w and b .

( i ) ( i )

Finally, given a training set S = { ( x , y ); i = 1 , . . . , n } , we also define the geometric margin of ( w, b ) with respect to S to be the smallest of the geometric margins on the individual training examples:

( i )

γ = min γ .

i =1 ,...,n

##### 6.4 The optimal margin classifier (option read- ing)

Given a training set, it seems from our previous discussion that a natural desideratum is to try to find a decision boundary that maximizes the (ge- ometric) margin, since this would reflect a very confident set of predictions

on the training set and a good “fit” to the training data. Specifically, this will result in a classifier that separates the positive and the negative training examples with a “gap” (geometric margin). For now, we will assume that we are given a training set that is linearly separable; i.e., that it is possible to separate the positive and negative ex- amples using some separating hyperplane. How will we find the one that achieves the maximum geometric margin? We can pose the following opti- mization problem:

max γ,w,b γ

( i ) T ( i )

s.t. y ( w x + b ) ≥ γ, i = 1 , . . . , n || w || = 1 .

I.e., we want to maximize γ , subject to each training example having func- tional margin at least γ . The || w || = 1 constraint moreover ensures that the functional margin equals to the geometric margin, so we are also guaranteed that all the geometric margins are at least γ . Thus, solving this problem will result in ( w, b ) with the largest possible geometric margin with respect to the training set. If we could solve the optimization problem above, we’d be done. But the “ || w || = 1” constraint is a nasty (non-convex) one, and this problem certainly isn’t in any format that we can plug into standard optimization software to solve. So, let’s try transforming the problem into a nicer one. Consider:

γ ˆ max γ,w,b ˆ

|| w ||

( i ) T ( i )

s.t. y ( w x + b ) ≥ γ, ˆ i = 1 , . . . , n

Here, we’re going to maximize ˆ γ/ || w || , subject to the functional margins all being at least ˆ γ . Since the geometric and functional margins are related by γ = ˆ γ/ || w | , this will give us the answer we want. Moreover, we’ve gotten rid of the constraint || w || = 1 that we didn’t like. The downside is that we now

γ ˆ

have a nasty (again, non-convex) objective

|| w ||

function; and, we still don’t have any off-the-shelf software that can solve this form of an optimization problem. Let’s keep going. Recall our earlier discussion that we can add an arbi- trary scaling constraint on w and b without changing anything. This is the key idea we’ll use now. We will introduce the scaling constraint that the functional margin of w, b with respect to the training set must be 1:

γ ˆ = 1 .

Since multiplying w and b by some constant results in the functional margin being multiplied by that same constant, this is indeed a scaling constraint, and can be satisfied by rescaling w, b . Plugging this into our problem above, and noting that maximizing ˆ γ/ || w || = 1 / || w || is the same thing as minimizing || w || , we now have the following optimization problem:

min w,b || w ||

( i ) T ( i )

s.t. y ( w x + b ) ≥ , i = 1 , . . . , n

We’ve now transformed the problem into a form that can be efficiently solved. The above is an optimization problem with a convex quadratic ob- jective and only linear constraints. Its solution gives us the optimal mar- gin classifier . This optimization problem can be solved using commercial quadratic programming (QP) code. While we could call the problem solved here, what we will instead do is make a digression to talk about Lagrange duality. This will lead us to our optimization problem’s dual form, which will play a key role in allowing us to use kernels to get optimal margin classifiers to work efficiently in very high dimensional spaces. The dual form will also allow us to derive an efficient algorithm for solving the above optimization problem that will typically do much better than generic QP software.

##### 6.5 Lagrange duality (optional reading)

Let’s temporarily put aside SVMs and maximum margin classifiers, and talk about solving constrained optimization problems. Consider a problem of the following form:

min w f ( w ) s.t. h i ( w ) = 0 , i = 1 , . . . , l.

Some of you may recall how the method of Lagrange multipliers can be used to solve it. (Don’t worry if you haven’t seen it before.) In this method, we define the Lagrangian to be

∑ l

L ( w, β ) = f ( w ) + β i h i ( w )

i =1

You may be familiar with linear programming, which solves optimization problems that have linear objectives and linear constraints. QP software is also widely available, which allows convex quadratic objectives and linear constraints.

Here, the β i ’s are called the Lagrange multipliers . We would then find and set L ’s partial derivatives to zero:

| ∂   | L   | ∂   | L   |
| --- | --- | --- | --- |
| ∂w  | i   | ∂β  | i   |

and solve for w and β . In this section, we will generalize this to constrained optimization prob- lems in which we may have inequality as well as equality constraints. Due to time constraints, we won’t really be able to do the theory of Lagrange duality justice in this class, but we will give the main ideas and results, which we will then apply to our optimal margin classifier’s optimization problem. Consider the following, which we’ll call the primal optimization problem:

min w f ( w ) s.t. g i ( w ) ≤ , i = 1 , . . . , k h i ( w ) = 0 , i = 1 , . . . , l.

To solve it, we start by defining the generalized Lagrangian

∑

k

∑

l

L ( w, α, β ) = f ( w ) + α i g i ( w ) + β i h i ( w ) .

i =1 i =1

Here, the α i ’s and β i ’s are the Lagrange multipliers. Consider the quantity

θ P ( w ) = max L ( w, α, β ) .

α,β : α i ≥

Here, the “ P ” subscript stands for “primal.” Let some w be given. If w violates any of the primal constraints (i.e., if either g i ( w ) > 0 or h i ( w ) = 0 for some i ), then you should be able to verify that

∑

k

∑

l

θ P ( w ) = max f ( w ) + α i g i ( w ) + β i h i ( w ) (6.1)

α,β : α i ≥ i =1 i =1

= ∞ . (6.2)

Conversely, if the constraints are indeed satisfied for a particular value of w , then θ P ( w ) = f ( w ). Hence, { f ( w ) if w satisfies primal constraints θ P ( w ) = ∞ otherwise .

Readers interested in learning more about this topic are encouraged to read, e.g., R. T. Rockarfeller (1970), Convex Analysis, Princeton University Press.

Thus, θ P takes the same value as the objective in our problem for all val- ues of w that satisfies the primal constraints, and is positive infinity if the constraints are violated. Hence, if we consider the minimization problem

min θ P ( w ) = min max L ( w, α, β ) ,

w w α,β : α i ≥

we see that it is the same problem (i.e., and has the same solutions as) our original, primal problem. For later use, we also define the optimal value of

∗

the objective to be p = min w θ P ( w ); we call this the value of the primal problem. Now, let’s look at a slightly different problem. We define

θ D ( α, β ) = min L ( w, α, β ) .

w

Here, the “ D ” subscript stands for “dual.” Note also that whereas in the definition of θ P we were optimizing (maximizing) with respect to α, β , here we are minimizing with respect to w . We can now pose the dual optimization problem:

max θ D ( α, β ) = max min L ( w, α, β ) .

α,β : α i ≥ α,β : α i ≥ w

This is exactly the same as our primal problem shown above, except that the order of the “max” and the “min” are now exchanged. We also define the

∗

optimal value of the dual problem’s objective to be d = max α,β : α i ≥ θ D ( w ). How are the primal and the dual problems related? It can easily be shown that

∗ ∗

d = max min L ( w, α, β ) ≤ min max L ( w, α, β ) = p .

α,β : α i ≥ w w α,β : α i ≥

(You should convince yourself of this; this follows from the “max min” of a function always being less than or equal to the “min max.”) However, under certain conditions, we will have

∗ ∗

d = p ,

so that we can solve the dual problem in lieu of the primal problem. Let’s see what these conditions are. Suppose f and the g i ’s are convex, and the h i ’s are affine. Suppose further that the constraints g i are (strictly) feasible; this means that there exists some w so that g i ( w ) < 0 for all i .

When f has a Hessian, then it is convex if and only if the Hessian is positive semi-

T

definite. For instance, f ( w ) = w w is convex; similarly, all linear (and affine) functions are also convex. (A function f can also be convex without being differentiable, but we won’t need those more general definitions of convexity here.)

T

I.e., there exists a i , b i , so that h i ( w ) = a i

w + b i . “Affine” means the same thing as linear, except that we also allow the extra intercept term b i .

∗ ∗ ∗ ∗

Under our above assumptions, there must exist w , α , β so that w is the

∗ ∗

solution to the primal problem, α , β are the solution to the dual problem,

∗ ∗ ∗ ∗ ∗ ∗ ∗ ∗

and moreover p = d = L ( w , α , β ). Moreover, w , α and β satisfy the Karush-Kuhn-Tucker (KKT) conditions , which are as follows:

∂ ∗ ∗ ∗

L ( w , α , β ) = , i = 1 , . . . , d (6.3) ∂w i

∂ ∗ ∗ ∗

L ( w , α , β ) = , i = 1 , . . . , l (6.4) ∂β i ∗ ∗

α i

g i ( w ) = , i = 1 , . . . , k (6.5)

∗

g i ( w ) ≤ , i = 1 , . . . , k (6.6)

∗

α ≥ , i = 1 , . . . , k (6.7)

∗ ∗ ∗

Moreover, if some w , α , β satisfy the KKT conditions, then it is also a solution to t he primal and dual problems. We draw attention to Equation (6.5), which is called the KKT dual

∗

complementarity condition. Specifically, it implies that if α i

> 0, then

∗

g i ( w ) = 0. (I.e., the “ g i ( w ) ≤ 0” constraint is active , meaning it holds with equality rather than with inequality.) Later on, this will be key for showing that the SVM has only a small number of “support vectors”; the KKT dual complementarity condition will also give us our convergence test when we talk about the SMO algorithm.

##### 6.6 Optimal margin classifiers: the dual form (option reading)

| problem     | (6.12) | , and the relationship between the primary and dual variables |
| ----------- | ------ | ------------------------------------------------------------- |
| in equation | (6.10) | are the most important take home messages of this section.    |

Previously, we posed the following (primal) optimization problem for find- ing the optimal margin classifier:

min w,b || w || (6.8)

( i ) T ( i )

s.t. y ( w x + b ) ≥ , i = 1 , . . . , n

We can write the constraints as

( i ) T ( i )

g i ( w ) = − y ( w x + b ) + 1 ≤ .

We have one such constraint for each training example. Note that from the KKT dual complementarity condition, we will have α i > 0 only for the train- ing examples that have functional margin exactly equal to one (i.e., the ones corresponding to constraints that hold with equality, g i ( w ) = 0). Consider the figure below, in which a maximum margin separating hyperplane is shown by the solid line.

The points with the smallest margins are exactly the ones closest to the decision boundary; here, these are the three points (one negative and two pos- itive examples) that lie on the dashed lines parallel to the decision boundary. Thus, only three of the α i ’s—namely, the ones corresponding to these three training examples—will be non-zero at the optimal solution to our optimiza- tion problem. These three points are called the support vectors in this problem. The fact that the number of support vectors can be much smaller than the size the training set will be useful later. Let’s move on. Looking ahead, as we develop the dual form of the prob- lem, one key idea to watch out for is that we’ll try to write our algorithm

( i ) ( j ) ( i ) T ( j )

in terms of only the inner product 〈 x , x 〉 (think of this as ( x ) x ) between points in the input feature space. The fact that we can express our algorithm in terms of these inner products will be key when we apply the kernel trick. When we construct the Lagrangian for our optimization problem we have:

∑

n

[

( i ) T ( i )

] L ( w, b, α ) =  || w || − α i y ( w x + b ) − . (6.9)

i =1

Note that there’re only “ α i ” but no “ β i ” Lagrange multipliers, since the problem has only inequality constraints.

Let’s find the dual form of the problem. To do so, we need to first minimize L ( w, b, α ) with respect to w and b (for fixed α ), to get θ D , which we’ll do by setting the derivatives of L with respect to w and b to zero. We have: ∑

n ( i ) ( i )

∇ w L ( w, b, α ) = w − α i y x = 0

i =1

This implies that ∑

n ( i ) ( i )

w = α i y x . (6.10)

i =1

As for the derivative with respect to b , we obtain

∂ ∑

n ( i )

L ( w, b, α ) = α i y = 0 . (6.11) ∂b

i =1

If we take the definition of w in Equation (6.10) and plug that back into the Lagrangian (Equation 6.9), and simplify, we get

∑ n

∑ n

∑

n ( i ) ( j ) ( i ) T ( j ) ( i )

L ( w, b, α ) = α i − y y α i α j ( x ) x − b α i y .

i =1 i,j =1 i =1

But from Equation (6.11), the last term must be zero, so we obtain

∑

n

∑

n ( i ) ( j ) ( i ) T ( j )

L ( w, b, α ) = α i − y y α i α j ( x ) x .

i =1 i,j =1

Recall that we got to the equation above by minimizing L with respect to w and b . Putting this together with the constraints α i ≥ 0 (that we always had) and the constraint (6.11), we obtain the following dual optimization problem:

∑ n

∑ n ( i ) ( j ) ( i ) ( j )

max α W ( α ) = α i − y y α i α j 〈 x , x 〉 . (6.12)

i =1 i,j =1

s.t. α i ≥ , i = 1 , . . . , n ∑

n ( i )

α i y = 0 ,

i =1

∗ ∗

You should also be able to verify that the conditions required for p = d and the KKT conditions (Equations 6.3–6.7) to hold are indeed satisfied in

our optimization problem. Hence, we can solve the dual in lieu of solving the primal problem. Specifically, in the dual problem above, we have a maximization problem in which the parameters are the α i ’s. We’ll talk later about the specific algorithm that we’re going to use to solve the dual problem, but if we are indeed able to solve it (i.e., find the α ’s that maximize W ( α ) subject to the constraints), then we can use Equation (6.10) to go back and

∗

find the optimal w ’s as a function of the α ’s. Having found w , by considering the primal problem, it is also straightforward to find the optimal value for the intercept term b as

∗ T ( i ) ∗ T ( i ) ∗

max i : y ( i )

= −

w x + min i : y ( i )

=1

w x b = − . (6.13)

(Check for yourself that this is correct.) Before moving on, let’s also take a more careful look at Equation (6.10), which gives the optimal value of w in terms of (the optimal value of) α . Suppose we’ve fit our model’s parameters to a training set, and now wish to

T

make a prediction at a new point input x . We would then calculate w x + b , and predict y = 1 if and only if this quantity is bigger than zero. But using (6.10), this quantity can also be written:

(

n

) T

∑

T ( i ) ( i )

w x + b = α i y x x + b (6.14)

i =1

∑

n ( i ) ( i )

= α i y 〈 x , x 〉 + b. (6.15)

i =1

Hence, if we’ve found the α i ’s, in order to make a prediction, we have to calculate a quantity that depends only on the inner product between x and the points in the training set. Moreover, we saw earlier that the α i ’s will all be zero except for the support vectors. Thus, many of the terms in the sum above will be zero, and we really need to find only the inner products between x and the support vectors (of which there is often only a small number) in order calculate (6.15) and make our prediction. By examining the dual form of the optimization problem, we gained sig- nificant insight into the structure of the problem, and were also able to write the entire algorithm in terms of only inner products between input feature vectors. In the next section, we will exploit this property to apply the ker- nels to our classification problem. The resulting algorithm, support vector machines , will be able to efficiently learn in very high dimensional spaces.

##### 6.7 Regularization and the non-separable case (optional reading)

The derivation of the SVM as presented so far assumed that the data is linearly separable. While mapping data to a high dimensional feature space via φ does generally increase the likelihood that the data is separable, we can’t guarantee that it always will be so. Also, in some cases it is not clear that finding a separating hyperplane is exactly what we’d want to do, since that might be susceptible to outliers. For instance, the left figure below shows an optimal margin classifier, and when a single outlier is added in the upper-left region (right figure), it causes the decision boundary to make a dramatic swing, and the resulting classifier has a much smaller margin.

To make the algorithm work for non-linearly separable datasets as well as be less sensitive to outliers, we reformulate our optimization (using ` regularization ) as follows:

∑ n

min γ,w,b || w || + C ξ i

i =1 ( i ) T ( i )

s.t. y ( w x + b ) ≥ − ξ i , i = 1 , . . . , n ξ i ≥ , i = 1 , . . . , n.

Thus, examples are now permitted to have (functional) margin less than 1, and if an example has functional margin 1 − ξ i (with ξ > 0), we would pay a cost of the objective function being increased by Cξ i . The parameter C controls the relative weighting between the twin goals of making the || w || small (which we saw earlier makes the margin large) and of ensuring that most examples have functional margin at least 1.

As before, we can form the Lagrangian:

∑ n

∑ n n T

[ ∑

( i ) T

] L ( w, b, ξ, α, r ) =  w w + C ξ i − α i y ( x w + b ) − 1 + ξ i − r i ξ i .

i =1 i =1 i =1

Here, the α i ’s and r i ’s are our Lagrange multipliers (constrained to be ≥ 0). We won’t go through the derivation of the dual again in detail, but after setting the derivatives with respect to w and b to zero as before, substituting them back in, and simplifying, we obtain the following dual form of the problem:

∑

n

∑

n ( i ) ( j ) ( i ) ( j )

max α W ( α ) = α i − y y α i α j 〈 x , x 〉

i =1 i,j =1

s.t. ≤ α i ≤ C, i = 1 , . . . , n ∑

n ( i )

α i y = 0 ,

i =1

As before, we also have that w can be expressed in terms of the α i ’s as given in Equation (6.10), so that after solving the dual problem, we can con- tinue to use Equation (6.15) to make our predictions. Note that, somewhat surprisingly, in adding ` regularization, the only change to the dual prob- lem is that what was originally a constraint that 0 ≤ α i has now become

∗

≤ α i ≤ C . The calculation for b also has to be modified (Equation 6.13 is no longer valid); see the comments in the next section/Platt’s paper. Also, the KKT dual-complementarity conditions (which in the next sec- tion will be useful for testing for the convergence of the SMO algorithm) are:

( i ) T ( i )

α i = 0 ⇒ y ( w x + b ) ≥ (6.16)

( i ) T ( i )

α i = C ⇒ y ( w x + b ) ≤ (6.17)

( i ) T ( i )

< α i < C ⇒ y ( w x + b ) = 1 . (6.18)

Now, all that remains is to give an algorithm for actually solving the dual problem, which we will do in the next section.

##### 6.8 The SMO algorithm (optional reading)

The SMO (sequential minimal optimization) algorithm, due to John Platt, gives an efficient way of solving the dual problem arising from the derivation

of the SVM. Partly to motivate the SMO algorithm, and partly because it’s interesting in its own right, let’s first take another digression to talk about the coordinate ascent algorithm.

###### 6.8.1 Coordinate ascent

Consider trying to solve the unconstrained optimization problem

max W ( α , α , . . . , α n ) .

α

Here, we think of W as just some function of the parameters α i ’s, and for now ignore any relationship between this problem and SVMs. We’ve already seen two optimization algorithms, gradient ascent and Newton’s method. The new algorithm we’re going to consider here is called coordinate ascent :

Loop until convergence: {

For i = 1 , . . . , n , {

α i := arg max α ˆ i

W ( α , . . . , α i − , α ˆ i , α i +1 , . . . , α n ).

}

}

Thus, in the innermost loop of this algorithm, we will hold all the variables except for some α i fixed, and reoptimize W with respect to just the parameter α i . In the version of this method presented here, the inner-loop reoptimizes the variables in order α , α , . . . , α n , α , α , . . . . (A more sophisticated version might choose other orderings; for instance, we may choose the next variable to update according to which one we expect to allow us to make the largest increase in W ( α ).) When the function W happens to be of such a form that the “arg max” in the inner loop can be performed efficiently, then coordinate ascent can be a fairly efficient algorithm. Here’s a picture of coordinate ascent in action:

2.5

1.5

0.5

−0.5

−1

−1.5

−2

−2 −1.5 −1 −0.5 0.5 1.5 2.5

The ellipses in the figure are the contours of a quadratic function that we want to optimize. Coordinate ascent was initialized at (2 , − 2), and also plotted in the figure is the path that it took on its way to the global maximum. Notice that on each step, coordinate ascent takes a step that’s parallel to one of the axes, since only one variable is being optimized at a time.

###### 6.8.2 SMO

We close off the discussion of SVMs by sketching the derivation of the SMO algorithm. Here’s the (dual) optimization problem that we want to solve:

∑ n

∑ n ( i ) ( j ) ( i ) ( j )

max α W ( α ) = α i − y y α i α j 〈 x , x 〉 . (6.19)

i =1 i,j =1

s.t. ≤ α i ≤ C, i = 1 , . . . , n (6.20) ∑

n ( i )

α i y = 0 . (6.21)

i =1

Let’s say we have set of α i ’s that satisfy the constraints (6.20-6.21). Now, suppose we want to hold α , . . . , α n fixed, and take a coordinate ascent step and reoptimize the objective with respect to α . Can we make any progress? The answer is no, because the constraint (6.21) ensures that

∑

n (1) ( i )

α y = − α i y .

i =2

(1)

Or, by multiplying both sides by y , we equivalently have

∑

n (1) ( i )

α = − y α i y .

i =2

(1) (1)

(This step used the fact that y ∈ {− , } , and hence ( y ) = 1.) Hence, α is exactly determined by the other α i ’s, and if we were to hold α , . . . , α n

fixed, then we can’t make any change to α without violating the con- straint (6.21) in the optimization problem. Thus, if we want to update some subject of the α i ’s, we must update at least two of them simultaneously in order to keep satisfying the constraints. This motivates the SMO algorithm, which simply does the following:

Repeat till convergence {

1. Select some pair α i and α j to update next (using a heuristic that tries to pick the two that will allow us to make the biggest progress towards the global maximum).

2. Reoptimize W ( α ) with respect to α i and α j , while holding all the other α k ’s ( k = i, j ) fixed.

}

To test for convergence of this algorithm, we can check whether the KKT conditions (Equations 6.16-6.18) are satisfied to within some t ol . Here, t ol is the convergence tolerance parameter, and is typically set to around 0.01 to 0.001. (See the paper and pseudocode for details.) The key reason that SMO is an efficient algorithm is that the update to α i , α j can be computed very efficiently. Let’s now briefly sketch the main ideas for deriving the efficient update. Let’s say we currently have some setting of the α i ’s that satisfy the con- straints (6.20-6.21), and suppose we’ve decided to hold α , . . . , α n fixed, and want to reoptimize W ( α , α , . . . , α n ) with respect to α and α (subject to the constraints). From (6.21), we require that

∑

n (1) (2) ( i )

α y + α y = − α i y .

i =3

Since the right hand side is fixed (as we’ve fixed α , . . . α n ), we can just let it be denoted by some constant ζ :

(1) (2)

α y + α y = ζ. (6.22)

We can thus picture the constraints on α and α as follows:

C

H y

(1) (2)

α + α y =ζ

α

L α C

From the constraints (6.20), we know that α and α must lie within the box

(1) (2)

[0 , C ] × [0 , C ] shown. Also plotted is the line α y + α y = ζ , on which we know α and α must lie. Note also that, from these constraints, we know L ≤ α ≤ H ; otherwise, ( α , α ) can’t simultaneously satisfy both the box and the straight line constraint. In this example, L = 0. But depending on

(1) (2)

what the line α y + α y = ζ looks like, this won’t always necessarily be the case; but more generally, there will be some lower-bound L and some upper-bound H on the permissible values for α that will ensure that α , α lie within the box [0 , C ] × [0 , C ]. Using Equation (6.22), we can also write α as a function of α :

(2) (1)

α = ( ζ − α y ) y .

(1)

(Check this derivation yourself; we again used the fact that y ∈ {− , } so

(1)

that ( y ) = 1.) Hence, the objective W ( α ) can be written

(2) (1)

W ( α , α , . . . , α n ) = W (( ζ − α y ) y , α , . . . , α n ) .

Treating α , . . . , α n as constants, you should be able to verify that this is just some quadratic function in α . I.e., this can also be expressed in the form aα + bα + c for some appropriate a , b , and c . If we ignore the “box” constraints (6.20) (or, equivalently, that L ≤ α ≤ H ), then we can easily maximize this quadratic function by setting its derivative to zero and solving.

n ew,unclipped

We’ll let α denote the resulting value of α . You should also be able to convince yourself that if we had instead wanted to maximize W with respect to α but subject to the box constraint, then we can find the resulting

n ew,unclipped

value optimal simply by taking α and “clipping” it to lie in the

[ L, H ] interval, to get 

n ew,unclipped

 H if α > H

n ew n ew,unclipped n ew,unclipped

α = α if L ≤ α ≤ H  n ew,unclipped

L if α < L

n ew

Finally, having found the α , we can use Equation (6.22) to go back and

n ew

find the optimal value of α . There’re a couple more details that are quite easy but that we’ll leave you to read about yourself in Platt’s paper: One is the choice of the heuristics used to select the next α i , α j to update; the other is how to update b as the SMO algorithm is run.

# Part II

# Deep learning

# Chapter 7

# Deep learning

We now begin our study of deep learning. In this set of notes, we give an overview of neural networks, discuss vectorization and discuss training neural networks with backpropagation.

##### 7.1 Supervised learning with non-linear mod- els

In the supervised learning setting (predicting y from the input x ), suppose our model/hypothesis is h θ ( x ). In the past lectures, we have considered the

>

cases when h θ ( x ) = θ x (in linear regression or logistic regression) or h θ ( x ) =

>

θ φ ( x ) (where φ ( x ) is the feature map). A commonality of these two models is that they are linear in the parameters θ . Next we will consider learning general family of models that are non-linear in both the parameters θ and the inputs x . The most common non-linear models are neural networks, which we will define staring from the next section. For this section, it suffices to think h θ ( x ) as an abstract non-linear model.

( i ) ( i ) n

Suppose { ( x , y ) } i =1

are the training examples. For simplicity, we start

( i )

with the case where y ∈ R and h θ ( x ) ∈ R .

Cost/loss function. We define the least square cost function for the i -th

( i ) ( i )

example ( x , y ) as

( i ) ( i ) ( i )

J ( θ ) =  ( h θ ( x ) − y ) (7.1)

If a concrete example is helpful, perhaps think about the model h θ ( x ) = θ x + θ x + · · · + θ d

x d

in this subsection, even though it’s not a neural network.

and define the mean-square cost function for the dataset as

∑ n ( i )

J ( θ ) =  J ( θ ) (7.2) n

i =1

which is same as in linear regression except that we introduce a constant /n in front of the cost function to be consistent with the convention. Note that multiplying the cost function with a scalar will not change the local minima or global minima of the cost function. Also note that the underlying parameterization for h θ ( x ) is different from the case of linear regression, even though the form of the cost function is the same mean-squared loss. Throughout the notes, we use the words “loss” and “cost” interchangeably.

Optimizers (SGD). Commonly, people use gradient descent (GD), stochas- tic gradient (SGD), or their variants to optimize the loss function J ( θ ). GD’s update rule can be written as

θ := θ − α ∇ θ J ( θ ) (7.3)

where α > 0 is often referred to as the learning rate or step size. Next, we introduce a version of the SGD (Algorithm 1), which is lightly different from that in the first lecture notes.

Algorithm 1 Stochastic Gradient Descent

1: Hyperparameter: learning rate α , number of total iteration n iter .

2: Initialize θ randomly.

3: for i = 1 to n iter do

4: Sample j uniformly from { , . . . , n } , and update θ by

( j )

θ := θ − α ∇ θ J ( θ ) (7.4)

Oftentimes computing the gradient of B examples simultaneously for the parameter θ can be faster than computing B gradients separately due to hardware parallelization. Therefore, a mini-batch version of SGD is most

Recall that, as defined in the previous lecture notes, we use the notation “ a := b ” to denote an operation (in a computer program) in which we set the value of a variable a to be equal to the value of b . In other words, this operation overwrites a with the value of b . In contrast, we will write “ a = b ” when we are asserting a statement of fact, that the value of a is equal to the value of b .

commonly used in deep learning, as shown in Algorithm 2. There are also other variants of the SGD or mini-batch SGD with slightly different sampling schemes.

Algorithm 2 Mini-batch Stochastic Gradient Descent

1: Hyperparameters: learning rate α , batch size B , # iterations n iter .

2: Initialize θ randomly

3: for i = 1 to n iter do

4: Sample B examples j , . . . , j B (without replacement) uniformly from { , . . . , n } , and update θ by

B

α ∑

( j k )

θ := θ − ∇ θ J ( θ ) (7.5) B

k =1

With these generic algorithms, a typical deep learning model is learned with the following steps. 1. Define a neural network parametrization h θ ( x ), which we will introduce in Section 7.2, and 2. write the backpropagation

( j )

| algorithm to compute the gradient of the loss function  | J   | (   | θ   | ) efficiently, |
| ------------------------------------------------------- | --- | --- | --- | -------------- |
| other gradient-based optimizers) with the loss function | J   | (   | θ   | ).             |

##### 7.2 Neural networks

Neural networks refer to broad type of non-linear models/parametrizations h θ ( x ) that involve combinations of matrix multiplications and other entry- wise non-linear operations. We will start small and slowly build up a neural network, step by step.

A Neural Network with a Single Neuron. Recall the housing price prediction problem from before: given the size of the house, we want to predict the price. We will use it as a running example in this subsection. Previously, we fit a straight line to the graph of size vs. housing price. Now, instead of fitting a straight line, we wish to prevent negative housing prices by setting the absolute minimum price as zero. This produces a “kink” in the graph as shown in Figure 7.1. How do we represent such a function with a single kink as h θ ( x ) with unknown parameter? (After doing so, we can invoke the machinery in Section 7.1.)

We define a parameterized function h θ ( x ) with input x , parameterized by θ , which outputs the price of the house y . Formally, h θ : x → y . Perhaps one of the simplest parametrization would be

h θ ( x ) = max( wx + b, 0) , where θ = ( w, b ) ∈ R (7.6)

Here h θ ( x ) returns a single value: ( wx + b ) or zero, whichever is greater. In the context of neural networks, the function max { t, } is called a ReLU (pro- nounced “ray-lu”), or rectified linear unit, and often denoted by ReLU( t ) , max { t, } . Generally, a one-dimensional non-linear function that maps R to R such as ReLU is often referred to as an activation function . The model h θ ( x ) is said to have a single neuron partly because it has a single non-linear activation function. (We will discuss more about why a non-linear activation is called neuron.)

d

When the input x ∈ R has multiple dimensions, a neural network with a single neuron can be written as

> d

h θ ( x ) = ReLU( w x + b ) , where w ∈ R , b ∈ R , and θ = ( w, b ) (7.7)

The term b is often referred to as the “bias”, and the vector w is referred to as the weight vector. Such a neural network has 1 layer. (We will define what multiple layers mean in the sequel.)

Stacking Neurons. A more complex neural network may take the single neuron described above and “stack” them together such that one neuron passes its output as input into the next neuron, resulting in a more complex function. Let us now deepen the housing prediction example. In addition to the size of the house, suppose that you know the number of bedrooms, the zip code and the wealth of the neighborhood. Building neural networks is analogous to Lego bricks: you take individual bricks and stack them together to build complex structures. The same applies to neural networks: we take individual neurons and stack them together to create complex neural networks. Given these features (size, number of bedrooms, zip code, and wealth), we might then decide that the price of the house depends on the maximum family size it can accommodate. Suppose the family size is a function of the size of the house and number of bedrooms (see Figure 7.2). The zip code may provide additional information such as how walkable the neighborhood is (i.e., can you walk to the grocery store or do you need to drive everywhere). Combining the zip code with the wealth of the neighborhood may predict

housing prices

price (in $1000)

square feet

Figure 7.1: Housing prices with a “kink” in the graph.

the quality of the local elementary school. Given these three derived features (family size, walkable, school quality), we may conclude that the price of the home ultimately depends on these three features.

Size Family Size # Bedrooms Price y Walkable Zip Code

School Quality Wealth

Figure 7.2: Diagram of a small neural network for predicting housing prices.

Formally, the input to a neural network is a set of input features x , x , x , x . We denote the intermediate variables for “family size”, “walk- able”, and “school quality” by a , a , a (these a i ’s are often referred to as “hidden units” or “hidden neurons”). We represent each of the a i ’s as a neu- ral network with a single neuron with a subset of x , . . . , x as inputs. Then as in Figure 7.1, we will have the parameterization:

| a   | = ReLU( | θ   | x   | +   | θ   | x   | +   | θ   | )   |
| --- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
| a   | = ReLU( | θ   | x   | +   | θ   | x   | +   | θ   | )   |

where ( θ , · · · , θ ) are parameters. Now we represent the final output h θ ( x ) as another linear function with a , a , a as inputs, and we get

h θ ( x ) = θ a + θ a + θ a + θ (7.8)

where θ contains all the parameters ( θ , · · · , θ ). Now we represent the output as a quite complex function of x with pa- rameters θ . Then you can use this parametrization h θ with the machinery of Section 7.1 to learn the parameters θ .

Inspiration from Biological Neural Networks. As the name suggests, artificial neural networks were inspired by biological neural networks. The hidden units a , . . . , a m correspond to the neurons in a biological neural net- work, and the parameters θ i ’s correspond to the synapses. However, it’s unclear how similar the modern deep artificial neural networks are to the bi- ological ones. For example, perhaps not many neuroscientists think biological neural networks could have 1000 layers, while some modern artificial neural networks do (we will elaborate more on the notion of layers.) Moreover, it’s an open question whether human brains update their neural networks in a way similar to the way that computer scientists learn artificial neural net- works (using backpropagation, which we will introduce in the next section.).

Two-layer Fully-Connected Neural Networks. We constructed the neural network in equation (7.8) using a significant amount of prior knowl- edge/belief about how the “family size”, “walkable”, and “school quality” are determined by the inputs. We implicitly assumed that we know the family size is an important quantity to look at and that it can be determined by only the “size” and “# bedrooms”. Such a prior knowledge might not be available for other applications. It would be more flexible and general to have a generic parameterization. A simple way would be to write the intermediate variable a as a function of all x , . . . , x :

>

a = ReLU( w x + b ) , where w ∈ R and b ∈ R (7.9)

>

a = ReLU( w x + b ) , where w ∈ R and b ∈ R

>

a = ReLU( w x + b ) , where w ∈ R and b ∈ R

We still define h θ ( x ) using equation (7.8) with a , a , a being defined as above. Thus we have a so-called fully-connected neural network as

Typically, for multi-layer neural network, at the end, near the output, we don’t apply ReLU, especially when the output is not necessarily a positive number.

Figure 7.3: Diagram of a two-layer fully connected neural network. Each edge from node x i to node a j indicates that a j depends on x i . The edge from

[1]

x i to a j is associated with the weight ( w j

) i which denotes the i -th coordinate

[1]

of the vector w j

. The activation a j can be computed by taking the ReLUof the weighted sum of x i ’s with the weights being the weights associated with ∑ d [1]

the incoming edges, that is, a j = ReLU( i =1

( w j

) i x i ) .

visualized in the dependency graph in Figure 7.3 because all the intermediate variables a i ’s depend on all the inputs x i ’s. For full generality, a two-layer fully-connected neural network with m

d

hidden units and d dimensional input x ∈ R is defined as

[1] > [1] [1] d [1]

∀ j ∈ [1 , ..., m ] , z j = w j

x + b j

where w j

∈ R , b j

∈ R (7.10)

a j = ReLU( z j ) ,

> m

a = [ a , . . . , a m ] ∈ R

[2] > [2] [2] m [2]

h θ ( x ) = w a + b where w ∈ R , b ∈ R , (7.11)

d

Note that by default the vectors in R are viewed as column vectors, and in particular a is a column vector with components a , a , ..., a m . The indices

[1] [2] [1]

and are used to distinguish two sets of parameters: the w j

’s (each of

d [2] m

which is a vector in R ) and w (which is a vector in R ). We will have more of these later.

Vectorization. Before we introduce neural networks with more layers and more complex structures, we will simplify the expressions for neural networks with more matrix and vector notations. Another important motivation of

vectorization is the speed perspective in the implementation. In order to implement a neural network efficiently, one must be careful when using for loops. The most natural way to implement equation (7.10) in code is perhaps to use a for loop. In practice, the dimensionalities of the inputs and hidden units are high. As a result, code will run very slowly if you use for loops. Leveraging the parallelism in GPUs is/was crucial for the progress of deep learning. This gave rise to vectorization . Instead of using for loops, vectorization takes advantage of matrix algebra and highly optimized numerical linear algebra packages (e.g., BLAS) to make neural network computations run quickly. Before the deep learning era, a for loop may have been sufficient on smaller datasets, but modern deep networks and state-of-the-art datasets will be infeasible to run with for loops. We vectorize the two-layer fully-connected neural network as below. We

[1] m × d

define a weight matrix W in R as the concatenation of all the vectors

[1]

w j

’s in the following way:



[1] >

 — w — 

[1]



[1] >  — w —  W =   m × d

 . ∈ R (7.12) .   . 

[1] >

- w m —

Now by the definition of matrix vector multiplication, we can write z =

> m

[ z , . . . , z m ] ∈ R as

  

[1] >

    [1]

 z — w — x b  .   [1] >    . .   — w —  x   [1]

       b    . = . . . .    .   .  +  .   .   .  (7.13) . . 

[1] >

x [1]

z m d

︸ ︷︷ ︸ — w m — b m

︸ ︷︷ ︸ ︸ ︷︷ ︸ ︸ ︷︷ ︸

m × d ×

z ∈ R [1] m × d x ∈ R [1] m ×

W ∈ R b ∈ R

Or succinctly,

[1] [1]

z = W x + b (7.14)

d

We remark again that a vector in R in this notes, following the conventions previously established, is automatically viewed as a column vector, and can also be viewed as a d × 1 dimensional matrix. (Note that this is different from numpy where a vector is viewed as a row vector in broadcasting.)

m m

Computing the activations a ∈ R from z ∈ R involves an element- wise non-linear application of the ReLU function, which can be computed in parallel efficiently. Overloading ReLU for element-wise application of ReLU

d

(meaning, for a vector t ∈ R , ReLU( t ) is a vector such that ReLU( t ) i = ReLU( t i )), we have

a = ReLU( z ) (7.15)

[2] [2] > × m

Define W = [ w ] ∈ R similarly. Then, the model in equa- tion (7.11) can be summarized as

[1] [1]

a = ReLU( W x + b )

[2] [2]

h θ ( x ) = W a + b (7.16)

[1] [2]

Here θ consists of W , W (often referred to as the weight matrices) and

[1] [2] [1] [1]

b , b (referred to as the biases). The collection of W , b is referred to as

[2] [2]

the first layer, and W , b the second layer. The activation a is referred to as the hidden layer. A two-layer neural network is also called one-hidden-layer neural network.

Multi-layer fully-connected neural networks. With this succinct no- tations, we can stack more layers to get a deeper fully-connected neu- ral network. Let r be the number of layers (weight matrices). Let

[1] [ r ] [1] [ r ]

W , . . . , W , b , . . . , b be the weight matrices and biases of all the layers. Then a multi-layer neural network can be written as

[1] [1] [1]

a = ReLU( W x + b )

[2] [2] [1] [2]

a = ReLU( W a + b ) · · ·

[ r − 1] [ r − 1] [ r − 2] [ r − 1]

a = ReLU( W a + b )

[ r ] [ r − 1] [ r ]

h θ ( x ) = W a + b (7.17)

We note that the weight matrices and biases need to have compatible

[ k ]

dimensions for the equations above to make sense. If a has dimension m k ,

[ k ]

then the weight matrix W should be of dimension m k × m k − , and the bias

[ k ] m [1] m × d [ r ] × r

b ∈ R k m −

. Moreover, W ∈ R and W ∈ R . The total number of neurons in the network is m + · · · + m r , and the total number of parameters in this network is ( d + 1) m + ( m + 1) m + · · · + ( m r − + 1) m r .

[0] [ r ]

Sometimes for notational consistency we also write a = x , and a = h θ ( x ). Then we have simple recursion that

[ k ] [ k ] [ k − 1] [ k ]

a = ReLU( W a + b ) , ∀ k = 1 , . . . , r − (7.18)

Note that this would have be true for k = r if there were an additional ReLU in equation (7.17), but often people like to make the last layer linear (aka without a ReLU) so that negative outputs are possible and it’s easier to interpret the last layer as a linear model. (More on the interpretability at the “connection to kernel method” paragraph of this section.)

Other activation functions. The activation function ReLU can be re- placed by many other non-linear function σ ( · ) that maps R to R such as

σ ( z ) = 1 + e − z

(sigmoid) (7.19)

z − z

e − e σ ( z ) = e z

+ e − z

(tanh) (7.20)

Why do we not use the identity function for σ ( z ) ? That is, why

[1] [2]

not use σ ( z ) = z ? Assume for sake of argument that b and b are zeros. Suppose σ ( z ) = z , then for two-layer neural network, we have that

[2] [1]

h θ ( x ) = W a (7.21)

[2] [1]

= W σ ( z ) by definition (7.22)

[2] [1]

= W z since σ ( z ) = z (7.23)

[2] [1]

= W W x from Equation (7.13) (7.24)

=  W x ˜ where W ˜ [2] [1]

= W W (7.25)

[2] [1]

Notice how W W collapsed into W ˜ . This is because applying a linear function to another linear function will result in a linear function over the original input (i.e., you can construct a  W ˜

[1]

such that W x ˜ [2]

= W W x ). This loses much of the representational power of the neural network as often times the output we are trying to predict has a non-linear relationship with the inputs. Without non-linear activation functions, the neural network will simply perform linear regression.

Connection to the Kernel Method. In the previous lectures, we covered the concept of feature maps. Recall that the main motivation for feature

>

maps is to represent functions that are non-linear in the input x by θ φ ( x ), where θ are the parameters and φ ( x ), the feature map, is a handcrafted function non-linear in the raw input x . The performance of the learning algorithms can significantly depends on the choice of the feature map φ ( x ). Oftentimes people use domain knowledge to design the feature map φ ( x ) that suits the particular applications. The process of choosing the feature maps is often referred to as feature engineering . We can view deep learning as a way to automatically learn the right feature map (sometimes also referred to as “the representation”) as follows. Suppose we denote by β the collection of the parameters in a fully-connected neural networks (equation (7.17)) except those in the last layer. Then we

[ r − 1]

can abstract right a as a function of the input x and the parameters in

[ r − 1]

β : a = φ β ( x ). Now we can write the model as

[ r ] [ r ]

h θ ( x ) = W φ β ( x ) + b (7.26)

When β is fixed, then φ β ( · ) can viewed as a feature map, and therefore h θ ( x ) is just a linear model over the features φ β ( x ). However, we will train the

[ r ] [ r ]

neural networks, both the parameters in β and the parameters W , b are optimized, and therefore we are not learning a linear model in the feature space, but also learning a good feature map φ β ( · ) itself so that it’s possi- ble to predict accurately with a linear model on top of the feature map. Therefore, deep learning tends to depend less on the domain knowledge of the particular applications and requires often less feature engineering. The

[ r ]

penultimate layer a is often (informally) referred to as the learned features or representations in the context of deep learning. In the example of house price prediction, a fully-connected neural network does not need us to specify the intermediate quantity such “family size”, and may automatically discover some useful features in the last penultimate layer

[ r − 1]

(the activation a ), and use them to linearly predict the housing price. Often the feature map / representation obtained from one datasets (that is, the function φ β ( · ) can be also useful for other datasets, which indicates they contain essential information about the data. However, oftentimes, the neural network will discover complex features which are very useful for predicting the output but may be difficult for a human to understand or interpret. This is why some people refer to neural networks as a black box , as it can be difficult to understand the features it has discovered.

##### 7.3 Backpropagation

In this section, we introduce backpropgation or auto-differentiation, which

( j )

computes the gradient of the loss ∇ J ( θ ) efficiently. We will start with an informal theorem that states that as long as a real-valued function f can be efficiently computed/evaluated by a differentiable network or circuit, then its gradient can be efficiently computed in a similar time. We will then show how to do this concretely for fully-connected neural networks. Because the formality of the general theorem is not the main focus here, we will introduce the terms with informal definitions. By a differentiable circuit or a differentiable network, we mean a composition of a sequence of differentiable arithmetic operations (additions, subtraction, multiplication, divisions, etc) and elementary differentiable functions (ReLU, exp, log, sin, cos, etc.). Let the size of the circuit be the total number of such operations and elementary functions. We assume that each of the operations and func- tions, and their derivatives or partial derivatives ecan be computed in O (1) time in the computer.

Theorem 7.3.1: [backpropagation or auto-differentiation, informally stated] Suppose a differentiable circuit of size N computes a real-valued function

`

f : R → R . Then, the gradient ∇ f can be computed in time O ( N ) , by a circuit of size O ( N ) .

( j )

We note that the loss function J ( θ ) for j -th example can be indeed computed by a sequence of operations and functions involving additions, subtraction, multiplications, and non-linear activations. Thus the theorem

( j )

suggests that we should be able to compute the ∇ J ( θ ) in a similar time

( j )

to that for computing J ( θ ) itself. This does not only apply to the fully- connected neural network introduced in the Section 7.2, but also many other types of neural networks. In the rest of the section, we will showcase how to compute the gradient of the loss efficiently for fully-connected neural networks using backpropagation. Even though auto-differentiation or backpropagation is implemented in all the deep learning packages such as tensorflow and pytorch, understanding it is very helpful for gaining insights into the working of deep learning.

We note if the output of the function f does not depend on some of the input co- ordinates, then we set by default the gradient w.r.t that coordinate to zero. Setting to zero does not count towards the total runtime here in our accounting scheme. This is why when N ≤ ` , we can compute the gradient in O ( N ) time, which might be potentially even less than ` .

###### 7.3.1 Preliminary: chain rule

We first recall the chain rule in calculus. Suppose the variable J depends on the variables θ , . . . , θ p via the intermediate variable g , . . . , g k :

g j = g j ( θ , . . . , θ p ) , ∀ j ∈ { , · · · , k } (7.27) J = J ( g , . . . , g k ) (7.28)

Here we overload the meaning of g j ’s: they denote both the intermediate variables but also the functions used to compute the intermediate variables. Then, by the chain rule, we have that ∀ i ,

∂J ∑

k

∂J ∂g j

= (7.29) ∂θ i j =1

∂g j ∂θ i

For the ease of invoking the chain rule in the following subsections in various ways, we will call J the output variable, g , . . . , g k intermediate variables, and θ , . . . , θ p the input variable in the chain rule.

###### 7.3.2 One-neuron neural networks

Simplifying notations: In the rest of the section, we will consider a generic input x and compute the gradient of h θ ( x ) w.r.t θ . For simplicity, we use o as a shorthand for h θ ( x ) ( o stands for output ). For simplicity, with slight abuse of notation, we use J = ( y − o ) to denote the loss function. (Note that this overrides the definition of J as the total loss in Section 7.1.) Our goal is to compute the derivative of J w.r.t the parameter θ . We first consider the neural network with one neuron defined in equa- tion (7.7). Recall that we compute the loss function via the following se- quential steps:

>

z = w x + b (7.30) o = ReLU( z ) (7.31)

J =  ( y − o ) (7.32)

By the chain rule with J as the output variable, o as the intermediate variable, and w i the input variable, we have that

∂J ∂J ∂o = · (7.33) ∂w i ∂o ∂w i

Invoking the chain rule with o as the output variable, z as the intermediate variable, and w i the input variable, we have that

∂o ∂o ∂z = · ∂w i ∂z ∂w i

Combining the equation above with equation (7.33), we have

∂J ∂J ∂o ∂z ′

= · · = ( o − y ) · ReLU ( z ) · x i

∂w i ∂o ∂z ∂w i ∂J ∂o ′ ∂z

(because

∂o

= ( o − y ) and

∂z

= ReLU ( z ) and

∂w i

= x i )

∂J

Here, the key is that we reduce the computation of

∂w i

to the computa-

∂J ∂o ∂z

tion of three simpler more “local” objects

∂o

,

∂z

, and

∂w i

, which are much simpler to compute because J directly depends on o via equation (7.32), o directly depends on a via equation (7.31), and z directly depends on w i via equation (7.30). Note that in a vectorized form, we can also write

′

∇ w J = ( o − y ) · ReLU ( z ) · x

Similarly, we compute the gradient w.r.t b by

∂J ∂J ∂o ∂z ′

= · · = ( o − y ) · ReLU ( z ) ∂b ∂o ∂z ∂b

∂J ∂o ′ ∂z

(because

∂o

= ( o − y ) and

∂z

= ReLU ( z ) and

∂b

= 1)

###### 7.3.3 Two-layer neural networks: a low-level unpacked computation

Note: this subsection derives the derivatives with low-level notations to help you build up intuition on backpropagation. If you are looking for a clean formula, or you are familiar with matrix derivatives, then feel free to jump to the next subsection directly. Now we consider the two-layer neural network defined in equation (7.11). We compute the loss J by following sequence of operations

[1] > [1] [1] d [1]

∀ j ∈ [1 , ..., m ] , z j = w j

x + b j

where w j

∈ R , b j

a j = ReLU( z j ) ,

> m

a = [ a , . . . , a m ] ∈ R

[2] > [2] [2] m [2]

o = w a + b where w ∈ R , b ∈ R

J =  ( y − o ) (7.34)

[2] [2] [1]

We will use ( w ) ` to denote the ` -th coordinate of w , and ( w j

) ` to denote

[1]

the ` -coordinate of w j

. (We will avoid using these cumbersome notations once we figure out how to write everything in matrix and vector forms.) By invoking chain rule with J as the output variable, o as intermediate

[2]

variable, and ( w ) ` as the input variable, we have

∂J ∂J ∂o ∂ ( w [2]

= ) [2] ` ∂o ∂ ( w ) `

∂o = ( o − y ) ∂ ( w [2]

) `

= ( o − y ) a `

∂J

It’s more challenging to compute [1]

. Towards computing it, we first

∂ ( w

j

) `

invoke the chain rule with J as the output variable, z j as the intermediate

[1]

variable, and ( w j

) ` as the input variable.

∂J ∂J ∂z j [1]

= ·

[1]

∂ ( w j

) `

∂z j ∂ ( w j

) `

∂J ∂z j

= · x ` (becaues [1]

= x ` .) ∂z j ∂ ( w

j

) `

∂J

Thus, it suffices to compute the

∂z j

. We invoke the chain rule with J as the output variable, a j as the intermediate variable, and z j as the input variable,

∂J ∂J ∂a j

= ∂z j ∂a j ∂z j

∂J ′

= ReLU ( z j ) ∂a j

∂J

Now it suffices to compute

∂a j

, and we invoke the chain rule with J as the output variable, o as the intermediate variable, and a j as the input variable,

∂J ∂J ∂o = ∂a j ∂o ∂a j [2]

= ( o − y ) · ( w ) j

Now combining the equations above, we obtain

∂J [2] ′ [1]

= ( o − y ) · ( w ) j ReLU ( z j ) x `

∂ ( w j

) `

Next we gauge the runtime of computing these partial derivatives. Let p denotes the total number of parameters in the network. We note that p ≥ md where m is the number of hidden units and d is the input dimension. For

∂J

every j and ` , to compute [1]

, apparently we need to compute at least

∂ ( w

j

) `

the output o , which takes at least p ≥ md operations. Therefore at the first glance computing a single gradient takes at least md time, and the total time to compute the derivatives w.r.t to all the parameters is at least ( md ) , which is inefficient. However, the key of the backpropagation is that for different choices of ` ,

∂J

the formulas above for computing [1]

share many terms, such as, ( o − y ),

∂ ( w

j

) `

[2] ′

( w ) j and ReLU ( z j ). This suggests that we can re-organize the computation to leverage the shared computation.

∂J

It turns out the crucial shared quantities in these formulas are

∂o

,

∂J ∂J ∂z

, . . . ,

∂z m

. We now write the following formulas to compute the gradi- ents efficiently in Algorithm 3.

Algorithm 3 Backpropagation for two-layer neural networks

1: Compute the values of z , . . . , z m , a , . . . , a m and o as in the definition of neural network (equation (7.34)).

∂J

2: Compute

∂o

= ( o − y ).

∂J

3: Compute

∂z j

for j = 1 , . . . , m by

∂J ∂J ∂o ∂a j ∂J [2] ′

= = · ( w ) j · ReLU ( z j ) (7.35) ∂z j ∂o ∂a j ∂z j ∂o

∂J ∂J ∂J ∂J

4: Compute [1]

, [1]

,

∂ ( w [2]

) j

, and

∂b [2]

by

∂ ( w

j

) ` ∂b

j

∂J ∂J ∂z j ∂J

[1]

= ·

[1]

= · x `

∂ ( w j

) `

∂z j ∂ ( w j

) `

∂z j

∂J ∂J ∂z j ∂J

[1]

= ·

[1]

= ∂b j

∂z j ∂b j

∂z j

∂J ∂J ∂o ∂J ∂ ( w [2]

=

[2]

= · a j

) j ∂o ∂ ( w ) j ∂o ∂J ∂J ∂o ∂J ∂b [2]

= = ∂o ∂b [2]

∂o

###### 7.3.4 Two-layer neural network with vector notation

As we have done before in the definition of neural networks, the equations for backpropagation becomes much cleaner with proper matrix notation. Here we state the algorithm first and also provide a cleaner proof via matrix cal- culus. Let

[2]

∂J δ , ∈ R ∂o

[1]

∂J m

δ , ∈ R (7.36) ∂z

Here we note that when A is a real-valued variable, and B is a vector or

∂A

matrix variable, then

∂B

denotes the collection of the partial derivatives with the same shape as B . In other words, if B is a matrix of dimension m × d ,

∂A m × d ∂A

then

∂B

is a matrix in R with

∂B ij

as the ij th-entry. Let v w denote the entry-wise product of two vectors v and w of the same dimension. Now we are ready to describe backpropagation in Algorithm 4.

Algorithm 4 Back-propagation for two-layer neural networks in vectorized notations. .

m m

1: Compute the values of z ∈ R , a ∈ R , and o

[2]

2: Compute δ = ( o − y ) ∈ R

[1] [2] > ′ m ×

3: Compute δ = ( o − y ) · W ReLU ( z ) ∈ R

4: Compute

∂J [2] > × m

= ∂W [2]

δ a ∈ R

∂J [2]

δ ∈ ∂b [2]

= R

∂J [1] > m × d

= δ x R ∂W [1]

∈

∂J [1] m

= δ ∈ ∂b [1]

R

∂A

We will avoid using the notation

∂B

for A that is not a real-valued variable. If you are familiar with the notion of total derivatives, we note that the dimensionality here is different from that for total derivatives.

Derivation using the chain rule for matrix multiplication. To have a succinct derivation of the backpropagation algorithm in Algorithm 4 without working with the complex indices, we state the extensions of the chain rule in vectorized notations. It requires more knowledge of matrix calculus to state the most general result, and therefore we will introduce a few special cases that are most relevant for deep learning. Suppose J

m

is a real-valued output variable, z ∈ R is the intermediate variable and

m × d d

W ∈ R , u ∈ R are the input variables. Suppose they satisfy:

m × d

z = W u + b, where W ∈ R J = J ( z ) (7.37)

∂J ∂J

Then we can compute

∂u

and

∂W

by:

∂J >

∂J = W (7.38) ∂u ∂z ∂J ∂J >

= · u (7.39) ∂W ∂z ∂J ∂J = (7.40) ∂b ∂z

∂J m

We can verify the dimensionality is indeed compatible because

∂z

∈ R ,

> d × m ∂J d ∂J m × d > × d

W ∈ R ,

∂u

∈ R ,

∂W

∈ R , u ∈ R . Here the chain rule in equation (7.38) only works for the special cases where z = W u . Another useful case is the following:

d

a = σ ( z ) , where σ is an element-wise activation, z, a ∈ R J = J ( a )

Then, we have that

∂J ∂J ′

= σ ( z ) (7.41) ∂z ∂a

′

where σ ( · ) is the element-wise derivative of the activation function σ , and is element-wise product of two vectors of the same dimensionality. Using equation (7.38), (7.39),and (7.41), we can verify the correctness of Algorithm 4. Indeed, using the notations in the two-layer neural network

∂J ∂J ′ by invoking equation (7.41) with setting

= ReLU ( z ) ( J ← J , a ← a , z ← a , σ ← ReLU.

) ∂z ∂a

[2] > ′ by invoking equation (7.38) with setting

= ( o − y ) W ReLU ( z ) (

J ← J , z ← o , W ← W

[2]

, u ← a , b ← b

[2] )

[1] ∂J

Therefore, δ =

∂z

, and we verify the correctness of Line 3 in Algorithm 4. Similarly, let’s verify the third equation in Line 4,

∂J ∂J > by invoking equation (7.39) with setting

= x ∂W [1]

- ( ∂z

J ← J , z ← z , W ← W

[1]

, u ← x , b ← b

[1] )

[1] > [1] ∂J

= δ x (because we have proved δ =

∂z

)

###### 7.3.5 Multi-layer neural networks

In this section, we will derive the backpropagation algorithms for the model defined in (7.17). Recall that we have

[1] [1] [1]

a = ReLU( W x + b )

[2] [2] [1] [2]

a = ReLU( W a + b ) · · ·

[ r − 1] [ r − 1] [ r − 2] [ r − 1]

a = ReLU( W a + b )

[ r ] [ r ] [ r ] [ r − 1] [ r ]

a = z = W a + b

[ r ]

J =  ( a − y )

[ r ] [ r ]

Here we define both a and z as h θ ( x ) for notational simplicity. Define

[ k ]

∂J δ = ∂z [ k ]

(7.42)

[ k ]

The backpropagation algorithm computes δ ’s from k = r to 1, and

∂J [ k ]

computes

∂W [

k ]

from δ as described in Algorithm 5.

##### 7.4 Vectorization over training examples

As we discussed in Section 7.1, in the implementation of neural networks, we will leverage the parallelism across the multiple examples. This means that we will need to write the forward pass (the evaluation of the outputs) of the neural network and the backward pass (backpropagation) for multiple training examples in matrix notation.

The basic idea. The basic idea is simple. Suppose you have a training

(1) (2) (3)

set with three examples x , x , x . The first-layer activations for each

Algorithm 5 Back-propagation for multi-layer neural networks. .

[ k ] [ k ]

1: Compute and store the values of a ’s and z ’s for k = 1 , . . . , r − 1, and J . . This is often called the “forward pass”

[ r ] ∂J [ r ]

2: Compute δ =

∂z [ r ]

= ( z − o ).

3: for k = r − 1 to 1 do

4: Compute

( )

[ k ]

∂J [ k +1] > [ k +1] ′ [ k ]

δ = ∂z [ k ]

= W δ ReLU ( z )

5: Compute

∂J [ k +1] [ k ] >

∂W [ k +1]

= δ a

∂J [ k +1]

∂b [ k +1]

= δ

example are as follows:

[1](1) [1] (1) [1]

z = W x + b

[1](2) [1] (2) [1]

z = W x + b

[1](3) [1] (3) [1]

z = W x + b

Note the difference between square brackets [ · ], which refer to the layer num- ber, and parenthesis ( · ), which refer to the training example number. In- tuitively, one would implement this using a for loop. It turns out, we can vectorize these operations as well. First, define:   | | |

(1) (3)

X =  (2)

x x x  d ×

∈ R (7.43) | | |

Note that we are stacking training examples in columns and not rows. We can then combine this into a single unified formulation:   | | |

[1] [1](1) [1](2) [1](3) [1] [1]

Z =  z z z  = W X + b (7.44) | | |

[1] × [1]

You may notice that we are attempting to add b ∈ R to W X ∈

×

R . Strictly following the rules of linear algebra, this is not allowed. In

practice however, this addition is performed using broadcasting . We create

×

an intermediate  ˜ [1]

b ∈ R :   | | | ˜ [1]

b =  [1] [1] [1]

b b b  (7.45) | | |

[1] [1] [1]

We can then perform the computation: Z = W X +  ˜ b . Often times, it

[1]

is not necessary to explicitly construct  ˜ b . By inspecting the dimensions in

[1] × [1] ×

(7.44), you can assume b ∈ R is correctly broadcast to W X ∈ R . The matricization approach as above can easily generalize to multiple layers, with one subtlety though, as discussed below.

Complications/Subtlety in the Implementation. All the deep learn- ing packages or implementations put the data points in the rows of a data matrix. (If the data point itself is a matrix or tensor, then the data are con- centrated along the zero-th dimension.) However, most of the deep learning papers use a similar notation to these notes where the data points are treated as column vectors. There is a simple conversion to deal with the mismatch: in the implementation, all the columns become row vectors, row vectors be- come column vectors, all the matrices are transposed, and the orders of the matrix multiplications are flipped. In the example above, using the row ma-

× d

jor convention, the data matrix is X ∈ R , the first layer weight matrix has dimensionality d × m (instead of m × d as in the two layer neural net

[1] × m

section), and the bias vector b ∈ R . The computation for the hidden activation becomes

[1] [1] [1] × m

Z = XW + b ∈ R (7.46)

The instructor suspects that this is mostly because in mathematics we naturally mul- tiply a matrix to a vector on the left hand side.

# Part III

# Generalization and regularization

# Chapter 8

# Generalization

This chapter discusses tools to analyze and understand the generaliza- tion of machine learning models, i.e, their performances on unseen test examples. Recall that for supervised learning problems, given a train-

( i ) ( i ) n

ing dataset { ( x , y ) } i =1

, we typically learn a model h θ by minimizing a loss/cost function J ( θ ), which encourages h θ to fit the data. E.g., when the loss function is the least square loss (aka mean squared error), we have ∑ n ( i ) ( i )

J ( θ ) =

n i =1

( y − h θ ( x )) . This loss function for training purposes is oftentimes referred to as the training loss/error/cost. However, minimizing the training loss is not our ultimate goal—it is merely our approach towards the goal of learning a predictive model. The most important evaluation metric of a model is the loss on unseen test exam- ples, which is oftentimes referred to as the test error. Formally, we sample a test example ( x, y ) from the so-called test distribution D , and measure the model’s error on it, by, e.g., the mean squared error, ( h θ ( x ) − y ) . The ex- pected loss/error over the randomness of the test example is called the test loss/error,

L ( θ ) = E ( x,y ) ∼D [( y − h θ ( x )) ] (8.1)

Note that the measurement of the error involves computing the expectation, and in practice, it can be approximated by the average error on many sampled test examples, which are referred to as the test dataset. Note that the key difference here between training and test datasets is that the test examples

In theoretical and statistical literature, we oftentimes call the uniform distribution

( i ) ( i ) n

over the training set { ( x , y ) } ̂

i =1

, denoted by D , an empirical distribution, and call D the population distribution. Partly because of this, the training loss is also referred to as the empirical loss/risk/error, and the test loss is also referred to as the population loss/risk/error.

are unseen , in the sense that the training procedure has not used the test examples. In classical statistical learning settings, the training examples are also drawn from the same distribution as the test distribution D , but still the test examples are unseen by the learning procedure whereas the training examples are seen. Because of this key difference between training and test datasets, even if they are both drawn from the same distribution D , the test error is not necessarily always close to the training error. As a result, successfully min- imizing the training error may not always lead to a small test error. We typically say the model overfits the data if the model predicts accurately on the training dataset but doesn’t generalize well to other test examples, that is, if the training error is small but the test error is large. We say the model underfits the data if the training error is relatively large (and in this case, typically the test error is also relatively large.) This chapter studies how the test error is influenced by the learning pro- cedure, especially the choice of model parameterizations. We will decompose the test error into “bias” and “variance” terms and study how each of them is affected by the choice of model parameterizations and their tradeoffs. Using the bias-variance tradeoff, we will discuss when overfitting and underfitting will occur and be avoided. We will also discuss the double descent phe- nomenon in Section 8.2 and some classical theoretical results in Section 8.3.

These days, researchers have increasingly been more interested in the setting with “domain shift”, that is, the training distribution and test distribution are different. the difference between test error and training error is often referred to as the gener- alization gap. The term generalization error in some literature means the test error, and in some other literature means the generalization gap. e.g., larger than the intrinsic noise level of the data in regression problems.

##### 8.1 Bias-variance tradeoff

training dataset test dataset

1.5 1.5 training data test data

* *

ground truth h ground truth h

1.0 1.0

y y

0.5 0.5

0.0 0.0

0.0 0.2 0.4 0.6 0.8 1.0 0.0 0.2 0.4 0.6 0.8 1.0 x x

Figure 8.1: A running example of training and test dataset for this section.

As an illustrating example, we consider the following training dataset and

( i )

test dataset, which are also shown in Figure 8.1. The training inputs x ’s are

( i ) ( i ) ? ( i ) ( i )

randomly chosen and the outputs y are generated by y = h ( x ) + ξ

?

where the function h ( · ) is a quadratic function and is shown in Figure 8.1

( i )

as the solid line, and ξ is the a observation noise assumed to be generated from ∼ N (0 , σ ). A test example ( x, y ) also has the same input-output

?

relationship y = h ( x ) + ξ where ξ ∼ N (0 , σ ). It’s impossible to predict the

?

noise ξ , and therefore essentially our goal is to recover the function h ( · ). We will consider the test error of learning various types of models. When talking about linear regression, we discussed the problem of whether to fit a “simple” model such as the linear “ y = θ + θ x ,” or a more “complex” model such as the polynomial “ y = θ + θ x + · · · θ x .” We start with fitting a linear model, as shown in Figure 8.2. The best fitted linear model cannot predict y from x accurately even on the training dataset, let alone on the test dataset. This is because the true relationship between y and x is not linear—any linear model is far away from the true

?

function h ( · ). As a result, the training error is large and this is a typical situation of underfitting .

1.5 1.5 training data test data best fit linear model best fit linear model

1.0 1.0

y y

0.5 0.5

0.0 0.0

0.0 0.2 0.4 0.6 0.8 1.0 0.0 0.2 0.4 0.6 0.8 1.0 x x

Figure 8.2: The best fit linear model has large training and test errors.

The issue cannot be mitigated with more training examples—even with a very large amount of, or even infinite training examples, the best fitted linear model is still inaccurate and fails to capture the structure of the data (Figure 8.3). Even if the noise is not present in the training data, the issue still occurs (Figure 8.4). Therefore, the fundamental bottleneck here is the linear model family’s inability to capture the structure in the data—linear

?

models cannot represent the true quadratic function h —, but not the lack of the data. Informally, we define the bias of a model to be the test error even if we were to fit it to a very (say, infinitely) large training dataset. Thus, in this case, the linear model suffers from large bias, and underfits (i.e., fails to capture structure exhibited by) the data.

fitting linear models on a large dataset fitting linear models on a noiseless dataset

1.5 1.5 training data training data

*

ground truth h *

ground truth h

1.0 best fit linear model 1.0 best fit linear model

y y

0.5 0.5

0.0 0.0

0.0 0.2 0.4 0.6 0.8 1.0 0.0 0.2 0.4 0.6 0.8 1.0 x x

| model on a much larger dataset    | model on a noiseless dataset also |
| --------------------------------- | --------------------------------- |
| still has a large training error. | has a large training/test error.  |

Next, we fit a 5th-degree polynomial to the data. Figure 8.5 shows that it fails to learn a good model either. However, the failure pattern is different from the linear model case. Specifically, even though the learnt 5th-degree

( i ) ( i )

polynomial did a very good job predicting y ’s from x ’s for training ex- amples, it does not work well on test examples (Figure 8.5). In other words, the model learnt from the training set does not generalize well to other test examples—the test error is high. Contrary to the behavior of linear models, the bias of the 5-th degree polynomials is small—if we were to fit a 5-th de- gree polynomial to an extremely large dataset, the resulting model would be close to a quadratic function and be accurate (Figure 8.6). This is because the family of 5-th degree polynomials contains all the quadratic functions (setting θ = θ = θ = 0 results in a quadratic function), and, therefore, 5-th degree polynomials are in principle capable of capturing the structure of the data.

1.5 1.5 training data test data best fit 5-th degree model *

ground truth h

1.0 1.0 best fit 5-th degree model

y y

0.5 0.5

0.0 0.0

0.0 0.2 0.4 0.6 0.8 1.0 0.0 0.2 0.4 0.6 0.8 1.0 x x

Figure 8.5: Best fit 5-th degree polynomial has zero training error, but still has a large test error and does not recover the the ground truth. This is a classic situation of overfitting.

fitting 5-th degree model on large dataset

1.5 training data best fit 5-th degree model

1.0

*

ground truth h

y

0.5

0.0

0.0 0.2 0.4 0.6 0.8 1.0 x

Figure 8.6: The best fit 5-th degree polynomial on a huge dataset nearly recovers the ground-truth—suggesting that the culprit in Figure 8.5 is the variance (or lack of data) but not bias.

The failure of fitting 5-th degree polynomials can be captured by another

component of the test error, called variance of a model fitting procedure. Specifically, when fitting a 5-th degree polynomial as in Figure 8.7, there is a large risk that we’re fitting patterns in the data that happened to be present in our small, finite training set, but that do not reflect the wider pattern of the relationship between x and y . These “spurious” patterns in the training

( i )

set are (mostly) due to the observation noise ξ , and fitting these spurious patters results in a model with large test error. In this case, we say the model has a large variance.

fitting 5-th degree model on different datasets

1.5 1.5 1.5 training data training data training data best fit 5-th degree model best fit 5-th degree model best fit 5-th degree model

1.0 1.0 1.0

y y y

0.5 0.5 0.5

0.0 0.0 0.0

0.0 0.2 0.4 0.6 0.8 1.0 0.0 0.2 0.4 0.6 0.8 1.0 0.0 0.2 0.4 0.6 0.8 1.0 x x x

Figure 8.7: The best fit 5-th degree models on three different datasets gen- erated from the same distribution behave quite differently, suggesting the existence of a large variance.

The variance can be intuitively (and mathematically, as shown in Sec- tion 8.1.1) characterized by the amount of variations across models learnt on multiple different training datasets (drawn from the same underlying dis- tribution). The “spurious patterns” are specific to the randomness of the noise (and inputs) in a particular dataset, and thus are different across mul- tiple training datasets. Therefore, overfitting to the “spurious patterns” of multiple datasets should result in very different models. Indeed, as shown in Figure 8.7, the models learned on the three different training datasets are quite different, overfitting to the “spurious patterns” of each datasets. Often, there is a tradeoff between bias and variance. If our model is too “simple” and has very few parameters, then it may have large bias (but small variance), and it typically may suffer from underfittng. If it is too “complex” and has very many parameters, then it may suffer from large variance (but have smaller bias), and thus overfitting. See Figure 8.8 for a typical tradeoff between bias and variance.

Optimal Tradeoff Test Error (= Bias +Variance)

Variance

Error

Bias Model Complexity

Figure 8.8: An illustration of the typical bias-variance tradeoff.

As we will see formally in Section 8.1.1, the test error can be decomposed as a summation of bias and variance. This means that the test error will have a convex curve as the model complexity increases, and in practice we should tune the model complexity to achieve the best tradeoff. For instance, in the example above, fitting a quadratic function does better than either of the extremes of a first or a 5-th degree polynomial, as shown in Figure 8.9.

1.5 1.5 training data test data best fit quadratic model best fit quadratic model

1.0 1.0

*

ground truth h

y y

0.5 0.5

0.0 0.0

0.0 0.2 0.4 0.6 0.8 1.0 0.0 0.2 0.4 0.6 0.8 1.0 x x

Figure 8.9: Best fit quadratic model has small training and test error because quadratic model achieves a better tradeoff.

Interestingly, the bias-variance tradeoff curves or the test error curves do not universally follow the shape in Figure 8.8, at least not universally when the model complexity is simply measured by the number of parameters. (We will discuss the so-called double descent phenomenon in Section 8.2.) Nevertheless, the principle of bias-variance tradeoff is perhaps still the first resort when analyzing and predicting the behavior of test errors.

###### 8.1.1 A mathematical decomposition (for regression)

To formally state the bias-variance tradeoff for regression problems, we con- sider the following setup (which is an extension of the beginning paragraph of Section 8.1).

( i ) ( i ) n ( i ) ? ( i ) ( i )

- Draw a training dataset S = { x , y } i =1

such that y = h ( x ) + ξ

( i )

where ξ ∈ N (0 , σ ).

- Train a model on the dataset S , denoted by  h ˆ

S .

?

- Take a test example ( x, y ) such that y = h ( x ) + ξ where ξ ∼ N (0 , σ ), and measure the expected test error (averaged over the random draw of the training set S and the randomness of ξ )

MSE( x ) = E S,ξ [( y − h S ( x )) ] (8.2)

We will decompose the MSE into a bias and variance term. We start by stating a following simple mathematical tool that will be used twice below.

Claim 8.1.1: Suppose A and B are two independent real random variables and E [ A ] = 0. Then, E [( A + B ) ] = E [ A ] + E [ B ]. As a corollary, because a random variable A is independent with a con- stant c , when E [ A ] = 0, we have E [( A + c ) ] = E [ A ] + c .

The proof of the claim follows from expanding the square: E [( A + B ) ] = E [ A ] + E [ B ] + 2 E [ AB ] = E [ A ] + E [ B ]. Here we used the independence to show that E [ AB ] = E [ A ] E [ B ] = 0.

?

Using Claim 8.1.1 with A = ξ and B = h ( x ) − h ˆ

S ( x ), we have

?

MSE( x ) = E [( y − h S ( x )) ] = E [( ξ + ( h ( x ) − h S ( x ))) ] (8.3)

?

= E [ ξ ] + E [( h ( x ) − h S ( x )) ] (by Claim 8.1.1)

?

= σ + E [( h ( x ) − h S ( x )) ] (8.4)

Then, let’s define h avg ( x ) = E S [ h S ( x )] as the “average model”—the model obtained by drawing an infinite number of datasets, training on them, and averaging their predictions on x . Note that h avg is a hypothetical model for analytical purposes that can not be obtained in reality (because we don’t

For simplicity, the test input x is considered to be fixed here, but the same conceptual message holds when we average over the choice of x ’s. The subscript under the expectation symbol is to emphasize the variables that are considered as random by the expectation operation.

have infinite number of datasets). It turns out that for many cases, h avg

is (approximately) equal to the the model obtained by training on a single dataset with infinite samples. Thus, we can also intuitively interpret h avg this way, which is consistent with our intuitive definition of bias in the previous subsection.

?

We can further decompose MSE( x ) by letting c = h ( x ) − h avg ( x ) (which is a constant that does not depend on the choice of S !) and A = h avg ( x ) − h S ( x ) in the corollary part of Claim 8.1.1:

?

MSE( x ) = σ + E [( h ( x ) − h S ( x )) ] (8.5)

?

= σ + ( h ( x ) − h avg ( x )) + E [( h avg − h S ( x )) ] (8.6)

?

= ︸︷︷︸ σ + ( h ( x ) − h avg ( x )) + var( h S ( x )) (8.7) ︸ ︷︷ ︸ ︸ ︷︷ ︸

unavoidable , bias , variance

We call the second term the bias (square) and the third term the variance. As discussed before, the bias captures the part of the error that are introduced due to the lack of expressivity of the model. Recall that h avg can be thought of as the best possible model learned even with infinite data. Thus, the bias is not due to the lack of data, but is rather caused by that the family of models

?

fundamentally cannot approximate the h . For example, in the illustrating example in Figure 8.2, because any linear model cannot approximate the

?

true quadratic function h , neither can h avg , and thus the bias term has to be large. The variance term captures how the random nature of the finite dataset introduces errors in the learned model. It measures the sensitivity of the learned model to the randomness in the dataset. It often decreases as the size of the dataset increases. There is nothing we can do about the first term σ as we can not predict the noise ξ by definition. Finally, we note that the bias-variance decomposition for classification is much less clear than for regression problems. There have been several proposals, but there is as yet no agreement on what is the “right” and/or the most useful formalism.

##### 8.2 The double descent phenomenon

Model-wise double descent. Recent works have demonstrated that the test error can present a “double descent” phenomenon in a range of machine

learning models including linear models and deep neural networks. The conventional wisdom, as discussed in Section 8.1, is that as we increase the model complexity, the test error first decreases and then increases, as illus- trated in Figure 8.8. However, in many cases, we empirically observe that the test error can have a second descent—it first decreases, then increases to a peak around when the model size is large enough to fit all the training data very well, and then decreases again in the so-called overparameterized regime, where the number of parameters is larger than the number of data points. See Figure 8.10 for an illustration of the typical curves of test errors against model complexity (measured by the number of parameters). To some extent, the overparameterized regime with the second descent is considered as new to the machine learning community—partly because lightly-regularized, overparameterized models are only extensively used in the deep learning era. A practical implication of the phenomenon is that one should not hold back from scaling into and experimenting with over-parametrized models because the test error may well decrease again to a level even smaller than the previ- ous lowest point. Actually, in many cases, larger overparameterized models always lead to a better test performance (meaning there won’t be a second ascent after the second descent).

| classical regime:      | modern regime:        |
| ---------------------- | --------------------- |
| bias-variance tradeoff | over-parameterization |

typically when # parameters is sufficient to fit the data

test error

# parameters

Figure 8.10: A typical model-wise double descent phenomenon. As the num- ber of parameters increases, the test error first decreases when the number of parameters is smaller than the training data. Then in the overparameterized regime, the test error decreases again.

The discovery of the phenomenon perhaps dates back to Opper [1995, 2001], and has been recently popularized by Belkin et al. [2020], Hastie et al. [2019], etc.

Sample-wise double descent. A priori, we would expect that more training examples always lead to smaller test errors—more samples give strictly more information for the algorithm to learn from. However, recent work [Nakkiran, 2019] observes that the test error is not monotonically de- creasing as we increase the sample size. Instead, as shown in Figure 8.11, the test error decreases, and then increases and peaks around when the number of examples (denoted by n ) is similar to the number of parameters (denoted by d ), and then decreases again. We refer to this as the sample-wise dou- ble descent phenomenon. To some extent, sample-wise double descent and model-wise double descent are essentially describing similar phenomena—the test error is peaked when n ≈ d .

Explanation and mitigation strategy. The sample-wise double descent, or, in particular, the peak of test error at n ≈ d , suggests that the existing training algorithms evaluated in these experiments are far from optimal when n ≈ d . We will be better off by tossing away some examples and run the algorithms with a smaller sample size to steer clear of the peak. In other words, in principle, there are other algorithms that can achieve smaller test error when n ≈ d , but the algorithms evaluated in these experiments fail to do so. The sub-optimality of the learning procedure appears to be the culprit of the peak in both sample-wise and model-wise double descent. Indeed, with an optimally-tuned regularization (which will be discussed more in Section 9), the test error in the n ≈ d regime can be dramatically improved, and the model-wise and sample-wise double descent are both mit- igated. See Figure 8.11. The intuition above only explains the peak in the model-wise and sample- wise double descent, but does not explain the second descent in the model- wise double descent—why overparameterized models are able to generalize so well. The theoretical understanding of overparameterized models is an ac- tive research area with many recent advances. A typical explanation is that the commonly-used optimizers such as gradient descent provide an implicit regularization effect (which will be discussed in more detail in Section 9.2). In other words, even in the overparameterized regime and with an unregular- ized loss function, the model is still implicitly regularized, and thus exhibits a better test performance than an arbitrary solution that fits the data. For example, for linear models, when n  d , the gradient descent optimizer with zero initialization finds the minimum norm solution that fits the data (in- stead of an arbitrary solution that fits the data), and the minimum norm reg- ularizer turns out to be a sufficiently good for the overparameterized regime (but it’s not a good regularizer when n ≈ d , resulting in the peak of test

error).

T est Error vs. Samples

2.00

T est Err or

1.75

1.50

1.25

or

Err

1.00

est

T

0.75

0.50

0.25

0.00

Num Samples

Figure 8.11: Left: The sample-wise double descent phenomenon for linear models. Right: The sample-wise double descent with different regularization strength for linear models. Using the optimal regularization parameter λ (optimally tuned for each n , shown in green solid curve) mitigates double descent. Setup: The data distribution of ( x, y ) is x ∼ N (0 , I d ) and y ∼

>

x β + N (0 , σ ) where d = 500 , σ = 0 . 5 and ‖ β ‖ = 1.

Finally, we also remark that the double descent phenomenon has been mostly observed when the model complexity is measured by the number of parameters. It is unclear if and when the number of parameters is the best complexity measure of a model. For example, in many situations, the norm of the models is used as a complexity measure. As shown in Figure 8.12 right, for a particular linear case, if we plot the test error against the norm of the learnt model, the double descent phenomenon no longer occurs. This is partly because the norm of the learned model is also peaked around n ≈ d (See Figure 8.12 (middle) or Belkin et al. [2019], Mei and Montanari [2022], and discussions in Section 10.8 of James et al. [2021]). For deep neural networks, the correct complexity measure is even more elusive. The study of double descent phenomenon is an active research topic.

The figure is reproduced from Figure 1 of Nakkiran et al. [2020]. Similar phenomenon are also observed in Hastie et al. [2022], Mei and Montanari [2022]

test err or vs. params norm vs. params test err or vs. norm

1.0 1.0

0.8 0.8

d=n

or or

0.6 0.6

err err

norm

0.4 0.4

test test

parameters

0.2 0.2

0.0 0.0

parameters parameters norm

Figure 8.12: Left: The double descent phenomenon, where the number of pa- rameters is used as the model complexity. Middle: The norm of the learned model is peaked around n ≈ d . Right: The test error against the norm of the learnt model. The color bar indicate the number of parameters and the arrows indicates the direction of increasing model size. Their relationship are closer to the convention wisdom than to a double descent. Setup: We consider a linear regression with a fixed dataset of size n = 500 . The input x is a random ReLU feature on Fashion-MNIST, and output y ∈ R is the one-hot label. This is the same setting as in Section 5.2 of Nakkiran et al. [2020].

##### 8.3 Sample complexity bounds (optional readings)

###### 8.3.1 Preliminaries

In this set of notes, we begin our foray into learning theory. Apart from being interesting and enlightening in its own right, this discussion will also help us hone our intuitions and derive rules of thumb about how to best apply learning algorithms in different settings. We will also seek to answer a few questions: First, can we make formal the bias/variance tradeoff that was just discussed? This will also eventually lead us to talk about model selection methods, which can, for instance, automatically decide what order polynomial to fit to a training set. Second, in machine learning it’s really generalization error that we care about, but most learning algorithms fit their models to the training set. Why should doing well on the training set tell us anything about generalization error? Specifically, can we relate error on the training set to generalization error? Third and finally, are there conditions under which we can actually prove that learning algorithms will work well? We start with two simple but very useful lemmas.

Lemma. (The union bound). Let A , A , . . . , A k be k different events (that may not be independent). Then

P ( A ∪ · · · ∪ A k ) ≤ P ( A ) + . . . + P ( A k ) .

In probability theory, the union bound is usually stated as an axiom (and thus we won’t try to prove it), but it also makes intuitive sense: The probability of any one of k events happening is at most the sum of the probabilities of the k different events.

Lemma. (Hoeffding inequality) Let Z , . . . , Z n be n independent and iden- tically distributed (iid) random variables drawn from a Bernoulli( φ ∑ ) distri-

n

bution. I.e., P ( Z i = 1) = φ , and P ( Z i = 0) = 1 − φ . Let  φ ˆ = (1 /n ) i =1

Z i

be the mean of these random variables, and let any γ > 0 be fixed. Then

P ( | φ − φ ˆ | > γ ) ≤ 2 exp( − γ n )

This lemma (which in learning theory is also called the Chernoff bound ) says that if we take  φ ˆ —the average of n Bernoulli( φ ) random variables—to be our estimate of φ , then the probability of our being far from the true value is small, so long as n is large. Another way of saying this is that if you have a biased coin whose chance of landing on heads is φ , then if you toss it n

times and calculate the fraction of times that it came up heads, that will be a good estimate of φ with high probability (if n is large). Using just these two lemmas, we will be able to prove some of the deepest and most important results in learning theory. To simplify our exposition, let’s restrict our attention to binary classifica- tion in which the labels are y ∈ { , } . Everything we’ll say here generalizes to other problems, including regression and multi-class classification.

( i ) ( i )

We assume we are given a training set S = { ( x , y ); i = 1 , . . . , n } of size

( i ) ( i )

n , where the training examples ( x , y ) are drawn iid from some probability distribution D . For a hypothesis h , we define the training error (also called the empirical risk or empirical error in learning theory) to be

∑

n ( i ) ( i )

ε ˆ ( h ) =  { h ( x ) = y } . n

i =1

This is just the fraction of training examples that h misclassifies. When we want to make explicit the dependence of ˆ ε ( h ) on the training set S , we may also write this a ˆ ε S ( h ). We also define the generalization error to be

ε ( h ) = P ( x,y ) ∼D ( h ( x ) = y ) .

I.e. this is the probability that, if we now draw a new example ( x, y ) from the distribution D , h will misclassify it. Note that we have assumed that the training data was drawn from the same distribution D with which we’re going to evaluate our hypotheses (in the definition of generalization error). This is sometimes also referred to as one of the PAC assumptions.

T

Consider the setting of linear classification, and let h θ ( x ) = 1 { θ x ≥ } . What’s a reasonable way of fitting the parameters θ ? One approach is to try to minimize the training error, and pick

θ ˆ = arg min ε ˆ ( h θ ) .

θ

We call this process empirical risk minimization (ERM), and the resulting hypothesis output by the learning algorithm is  h ˆ = h θ ˆ . We think of ERM as the most “basic” learning algorithm, and it will be this algorithm that we

PAC stands for “probably approximately correct,” which is a framework and set of assumptions under which numerous results on learning theory were proved. Of these, the assumption of training and testing on the same distribution, and the assumption of the independently drawn training examples, were the most important.

focus on in these notes. (Algorithms such as logistic regression can also be viewed as approximations to empirical risk minimization.) In our study of learning theory, it will be useful to abstract away from the specific parameterization of hypotheses and from issues such as whether we’re using a linear classifier. We define the hypothesis class H used by a learning algorithm to be the set of all classifiers considered by it. For linear

T d +1

classification, H = { h θ : h θ ( x ) = 1 { θ x ≥ } , θ ∈ R } is thus the set of all classifiers over X (the domain of the inputs) where the decision boundary is linear. More broadly, if we were studying, say, neural networks, then we could let H be the set of all classifiers representable by some neural network architecture. Empirical risk minimization can now be thought of as a minimization over the class of functions H , in which the learning algorithm picks the hypothesis:

h ˆ = arg min ε ˆ ( h )

h ∈H

###### 8.3.2 The case of finite H

Let’s start by considering a learning problem in which we have a finite hy- pothesis class H = { h , . . . , h k } consisting of k hypotheses. Thus, H is just a set of k functions mapping from X to { , } , and empirical risk minimization selects  h ˆ to be whichever of these k functions has the smallest training error. We would like to give guarantees on the generalization error of  h ˆ . Our strategy for doing so will be in two parts: First, we will show that ˆ ε ( h ) is a reliable estimate of ε ( h ) for all h . Second, we will show that this implies an upper-bound on the generalization error of  h ˆ . Take any one, fixed, h i ∈ H . Consider a Bernoulli random variable Z whose distribution is defined as follows. We’re going to sample ( x, y ) ∼ D . Then, we set Z = 1 { h i ( x ) = y } . I.e., we’re going to draw one example, and let Z indicate whether h i misclassifies it. Similarly, we also define Z j =

( j ) ( j )

{ h i ( x ) = y } . Since our training set was drawn iid from D , Z and the Z j ’s have the same distribution. We see that the misclassification probability on a randomly drawn example—that is, ε ( h )—is exactly the expected value of Z (and Z j ). More- over, the training error can be written

∑

n

ε ˆ ( h i ) =  Z j . n

j =1

Thus, ˆ ε ( h i ) is exactly the mean of the n random variables Z j that are drawn iid from a Bernoulli distribution with mean ε ( h i ). Hence, we can apply the

Hoeffding inequality, and obtain

P ( | ε ( h i ) − ε ˆ ( h i ) | > γ ) ≤ 2 exp( − γ n ) .

This shows that, for our particular h i , training error will be close to generalization error with high probability, assuming n is large. But we don’t just want to guarantee that ε ( h i ) will be close to ˆ ε ( h i ) (with high probability) for just only one particular h i . We want to prove that this will be true simultaneously for all h ∈ H . To do so, let A i denote the event that | ε ( h i ) − ε ˆ ( h i ) | > γ . We’ve already shown that, for any particular A i , it holds true that P ( A i ) ≤ 2 exp( − γ n ). Thus, using the union bound, we have that

P ( ∃ h ∈ H . | ε ( h i ) − ε ˆ ( h i ) | > γ ) = P ( A ∪ · · · ∪ A k ) ∑

k

≤ P ( A i )

i =1

∑

k

≤ 2 exp( − γ n )

i =1

= k exp( − γ n )

If we subtract both sides from 1, we find that

P ( ¬∃ h ∈ H . | ε ( h i ) − ε ˆ ( h i ) | > γ ) = P ( ∀ h ∈ H . | ε ( h i ) − ε ˆ ( h i ) | ≤ γ ) ≥ − k exp( − γ n )

(The “ ¬ ” symbol means “not.”) So, with probability at least − k exp( − γ n ), we have that ε ( h ) will be within γ of ˆ ε ( h ) for all h ∈ H . This is called a uniform convergence result, because this is a bound that holds simultaneously for all (as opposed to just one) h ∈ H . In the discussion above, what we did was, for particular values of n and γ , give a bound on the probability that for some h ∈ H , | ε ( h ) − ε ˆ ( h ) | > γ . There are three quantities of interest here: n , γ , and the probability of error; we can bound either one in terms of the other two. For instance, we can ask the following question: Given γ and some δ > 0, how large must n be before we can guarantee that with probability at least − δ , training error will be within γ of generalization error? By setting δ = 2 k exp( − γ n ) and solving for n , [you should convince yourself this is the right thing to do!], we find that if

k n ≥ log  , γ δ

then with probability at least 1 − δ , we have that | ε ( h ) − ε ˆ ( h ) | ≤ γ for all h ∈ H . (Equivalently, this shows that the probability that | ε ( h ) − ε ˆ ( h ) | > γ for some h ∈ H is at most δ .) This bound tells us how many training examples we need in order make a guarantee. The training set size n that a certain method or algorithm requires in order to achieve a certain level of performance is also called the algorithm’s sample complexity . The key property of the bound above is that the number of training examples needed to make this guarantee is only logarithmic in k , the number of hypotheses in H . This will be important later. Similarly, we can also hold n and δ fixed and solve for γ in the previous equation, and show [again, convince yourself that this is right!] that with probability 1 − δ , we have that for all h ∈ H , √ k | ε ˆ ( h ) − ε ( h ) | ≤ log  . n δ

Now, let’s assume that uniform convergence holds, i.e., that | ε ( h ) − ε ˆ ( h ) | ≤ γ for all h ∈ H . What can we prove about the generalization of our learning algorithm that picked  h ˆ = arg min h ∈H ε ˆ ( h )?

∗

Define h = arg min h ∈H ε ( h ) to be the best possible hypothesis in H . Note

∗

that h is the best that we could possibly do given that we are using H , so

∗

it makes sense to compare our performance to that of h . We have:

ε ( h ˆ ) ≤ ε ˆ ( h ˆ ) + γ

∗

≤ ε ˆ ( h ) + γ

∗

≤ ε ( h ) + 2 γ

The first line used the fact that | ε ( h ˆ ) − ε ˆ ( h ˆ ) | ≤ γ (by our uniform convergence assumption). The second used the fact that  h ˆ was chosen to minimize ˆ ε ( h ),

∗

and hence ˆ ε ( h ˆ ) ≤ ε ˆ ( h ) for all h , and in particular ˆ ε ( h ˆ ) ≤ ε ˆ ( h ). The third

∗

line used the uniform convergence assumption again, to show that ˆ ε ( h ) ≤

∗

ε ( h ) + γ . So, what we’ve shown is the following: If uniform convergence occurs, then the generalization error of  h ˆ is at most 2 γ worse than the best possible hypothesis in H ! Let’s put all this together into a theorem.

Theorem. Let |H| = k , and let any n, δ be fixed. Then with probability at least 1 − δ , we have that

( ) √ k ε ( h ˆ ) ≤ min ε ( h ) + 2 log  .

h ∈H n δ

√ This is proved by letting γ equal the · term, using our previous argu- ment that uniform convergence occurs with probability at least 1 − δ , and then noting that uniform convergence implies ε ( h ) is at most 2 γ higher than

∗

ε ( h ) = min h ∈H ε ( h ) (as we showed previously). This also quantifies what we were saying previously saying about the bias/variance tradeoff in model selection. Specifically, suppose we have some hypothesis class H , and are considering switching to some much larger hy-

′ ′

pothesis class H ⊇ H . If we switch to H , then the first term min h ε ( h ) can only decrease (since we’d then be taking a min over a larger set of func- tions). Hence, by learning using a larger hypothesis class, our “bias” can √ only decrease. However, if k increases, then the second 2 · term would also increase. This increase corresponds to our “variance” increasing when we use a larger hypothesis class. By holding γ and δ fixed and solving for n like we did before, we can also obtain the following sample complexity bound:

Corollary. Let |H| = k , and let any δ, γ be fixed. Then for ε ( h ˆ ) ≤ min h ∈H ε ( h ) + 2 γ to hold with probability at least 1 − δ , it suffices that

k n ≥ log  γ δ ( ) k = O log , γ δ

###### 8.3.3 The case of infinite H

We have proved some useful theorems for the case of finite hypothesis classes. But many hypothesis classes, including any parameterized by real numbers (as in linear classification) actually contain an infinite number of functions. Can we prove similar results for this setting? Let’s start by going through something that is not the “right” argument. Better and more general arguments exist , but this will be useful for honing our intuitions about the domain. Suppose we have an H that is parameterized by d real numbers. Since we are using a computer to represent real numbers, and IEEE double-precision floating point ( double ’s in C) uses 64 bits to represent a floating point num- ber, this means that our learning algorithm, assuming we’re using double- precision floating point, is parameterized by 64 d bits. Thus, our hypothesis

d

class really consists of at most k = 2 different hypotheses. From the Corol- lary at the end of the previous section, we therefore find that, to guarantee

∗

ε ( h ˆ ) ≤ ( ε ( h ) + 2 γ , with to hold with probability at least 1

d

) ( ) − δ , it suffices that

d

n ≥ O

γ

log

δ

= O

γ

log

δ

= O γ,δ ( d ). (The γ, δ subscripts indicate that the last big- O is hiding constants that may depend on γ and δ .) Thus, the number of training examples needed is at most linear in the parameters of the model. The fact that we relied on 64-bit floating point makes this argument not entirely satisfying, but the conclusion is nonetheless roughly correct: If what we try to do is minimize training error, then in order to learn “well” using a hypothesis class that has d parameters, generally we’re going to need on the order of a linear number of training examples in d . (At this point, it’s worth noting that these results were proved for an al- gorithm that uses empirical risk minimization. Thus, while the linear depen- dence of sample complexity on d does generally hold for most discriminative learning algorithms that try to minimize training error or some approxima- tion to training error, these conclusions do not always apply as readily to discriminative learning algorithms. Giving good theoretical guarantees on many non-ERM learning algorithms is still an area of active research.) The other part of our previous argument that’s slightly unsatisfying is that it relies on the parameterization of H . Intuitively, this doesn’t seem like it should matter: We had written the class of linear classifiers as h θ ( x ) = { θ + θ x + · · · θ d x d ≥ } , with n + 1 parameters θ , . . . , θ d . But it could also be written h u,v ( x ) = 1 { ( u − v ) + ( u − v ) x + · · · ( u d

− v d

) x d ≥ } with 2 d + 2 parameters u i , v i . Yet, both of these are just defining the same H : The set of linear classifiers in d dimensions. To derive a more satisfying argument, let’s define a few more things.

( i ) ( D )

Given a set S = { x , . . . , x } (no relation to the training set) of points

( i )

x ∈ X , we say that H shatters S if H can realize any labeling on S .

(1) ( D )

I.e., if for any set of labels { y , . . . , y } , there exists some h ∈ H so that

( i ) ( i )

h ( x ) = y for all i = 1 , . . . D . Given a hypothesis class H , we then define its Vapnik-Chervonenkis dimension , written VC( H ), to be the size of the largest set that is shattered by H . (If H can shatter arbitrarily large sets, then VC( H ) = ∞ .) For instance, consider the following set of three points:

  

  

## x

  

## x

Can the set H of linear classifiers in two dimensions ( h ( x ) = 1 { θ + θ x + θ x ≥ } ) can shatter the set above? The answer is yes. Specifically, we see that, for any of the eight possible labelings of these points, we can find a linear classifier that obtains “zero training error” on them:

x x x x

x x x x

x x x x

x x x x

Moreover, it is possible to show that there is no set of 4 points that this hypothesis class can shatter. Thus, the largest set that H can shatter is of size 3, and hence VC( H ) = 3. Note that the VC dimension of H here is 3 even though there may be sets of size 3 that it cannot shatter. For instance, if we had a set of three points lying in a straight line (left figure), then there is no way to find a linear separator for the labeling of the three points shown below (right figure):

  

### x

  

### x

  

### x x

In order words, under the definition of the VC dimension, in order to prove that VC( H ) is at least D , we need to show only that there’s at least one set of size D that H can shatter. The following theorem, due to Vapnik, can then be shown. (This is, many would argue, the most important theorem in all of learning theory.) Theorem. Let H be given, and let D = VC( H ). Then with probability at least 1 − δ , we have that for all h ∈ H , (√ ) D n | ε ( h ) − ε ˆ ( h ) | ≤ O log +  log  . n D n δ

Thus, with probability at least 1 − δ , we also have that: (√ )

∗

n ε ( h ˆ D ) ≤ ε ( h ) + O log +  log  . n D n δ

In other words, if a hypothesis class has finite VC dimension, then uniform convergence occurs as n becomes large. As before, this allows us to give a

∗

bound on ε ( h ) in terms of ε ( h ). We also have the following corollary:

Corollary. For | ε ( h ) − ε ˆ ( h ) | ≤ γ to hold for all h ∈ H (and hence ε ( h ˆ ) ≤

∗

ε ( h ) + 2 γ ) with probability at least 1 − δ , it suffices that n = O γ,δ ( D ).

In other words, the number of training examples needed to learn “well” using H is linear in the VC dimension of H . It turns out that, for “most” hypothesis classes, the VC dimension (assuming a “reasonable” parameter- ization) is also roughly linear in the number of parameters. Putting these together, we conclude that for a given hypothesis class H (and for an algo- rithm that tries to minimize training error), the number of training examples needed to achieve generalization error close to that of the optimal classifier is usually roughly linear in the number of parameters of H .

# Chapter 9

# Regularization and model selection

##### 9.1 Regularization

Recall that as discussed in Section 8.1, overftting is typically a result of using too complex models, and we need to choose a proper model complexity to achieve the optimal bias-variance tradeoff. When the model complexity is measured by the number of parameters, we can vary the size of the model (e.g., the width of a neural net). However, the correct, informative complex- ity measure of the models can be a function of the parameters (e.g., ` norm of the parameters), which may not necessarily depend on the number of pa- rameters. In such cases, we will use regularization, an important technique in machine learning, control the model complexity and prevent overfitting. Regularization typically involves adding an additional term, called a reg- ularizer and denoted by R ( θ ) here, to the training loss/cost function:

J λ ( θ ) = J ( θ ) + λR ( θ ) (9.1)

Here J λ is often called the regularized loss, and λ ≥ 0 is called the regular- ization parameter. The regularizer R ( θ ) is a nonnegative function (in almost all cases). In classical methods, R ( θ ) is purely a function of the parameter θ , but some modern approach allows R ( θ ) to depend on the training dataset. The regularizer R ( θ ) is typically chosen to be some measure of the com- plexity of the model θ . Thus, when using the regularized loss, we aim to find a model that both fit the data (a small loss J ( θ )) and have a small

Here our notations generally omit the dependency on the training dataset for simplicity—we write J ( θ ) even though it obviously needs to depend on the training dataset.

model complexity (a small R ( θ )). The balance between the two objectives is controlled by the regularization parameter λ . When λ = 0, the regularized loss is equivalent to the original loss. When λ is a sufficiently small positive number, minimizing the regularized loss is effectively minimizing the original loss with the regularizer as the tie-breaker. When the regularizer is extremely large, then the original loss is not effective (and likely the model will have a large bias.) The most commonly used regularization is perhaps ` regularization, where R ( θ ) = ‖ θ ‖ . It encourages the optimizer to find a model with small ` norm. In deep learning, it’s oftentimes referred to as weight de- cay , because gradient descent with learning rate η on the regularized loss R λ ( θ ) is equivalent to shrinking/decaying θ by a scalar factor of 1 − ηλ and then applying the standard gradient

θ ← θ − η ∇ J λ ( θ ) = θ − ηλθ − η ∇ J ( θ ) = (1 − λη ) θ − η ∇ J ( θ ) (9.2) ︸ ︷︷ ︸

decaying weights

Besides encouraging simpler models, regularization can also impose in- ductive biases or structures on the model parameters. For example, suppose we had a prior belief that the number of non-zeros in the ground-truth model parameters is small, —which is oftentimes called sparsity of the model—, we can impose a regularization on the number of non-zeros in θ , denoted by ‖ θ ‖ , to leverage such a prior belief. Imposing additional structure of the parameters narrows our search space and makes the complexity of the model family smaller,—e.g., the family of sparse models can be thought of as having lower complexity than the family of all models—, and thus tends to lead to a better generalization. On the other hand, imposing additional structure may risk increasing the bias. For example, if we regularize the sparsity strongly but no sparse models can predict the label accurately, we will suffer from large bias (analogously to the situation when we use linear models to learn data than can only be represented by quadratic functions in Section 8.1.) The sparsity of the parameters is not a continuous function of the param- eters, and thus we cannot optimize it with (stochastic) gradient descent. A common relaxation is to use R ( θ ) = ‖ θ ‖ as a continuous surrogate.

For linear models, this means the model just uses a few coordinates of the inputs to make an accurate prediction. There has been a rich line of theoretical work that explains why ‖ θ ‖ is a good sur- rogate for encouraging sparsity, but it’s beyond the scope of this course. An intuition is: assuming the parameter is on the unit sphere, the parameter with smallest ` norm also

The R ( θ ) = ‖ θ ‖ (also called LASSO) and R ( θ ) = ‖ θ ‖ are perhaps among the most commonly used regularizers for linear models. Other norm and powers of norms are sometimes also used. The ` norm regularization is much more commonly used with kernel methods because ` regularization is typically not compatible with the kernel trick (the optimal solution cannot be written as functions of inner products of features.) In deep learning, the most commonly used regularizer is ` regularization or weight decay. Other common ones include dropout, data augmentation, regularizing the spectral norm of the weight matrices, and regularizing the Lipschitzness of the model, etc. Regularization in deep learning is an ac- tive research area, and it’s known that there is another implicit source of regularization, as discussed in the next section.

##### 9.2 Implicit regularization effect

The implicit regularization effect of optimizers, or implicit bias or algorithmic regularization, is a new concept/phenomenon observed in the deep learning era. It largely refers to that the optimizers can implicitly impose structures on parameters beyond what has been imposed by the regularized loss. In most classical settings, the loss or regularized loss has a unique global minimum, and thus any reasonable optimizer should converge to that global minimum and cannot impose any additional preferences. However, in deep learning, oftentimes the loss or regularized loss has more than one (approx- imate) global minima, and difference optimizers may converge to different global minima. Though these global minima have the same or similar train- ing losses, they may be of different nature and have dramatically different generalization performance. See Figures 9.1 and 9.2 and its caption for an illustration and some experiment results. For example, it’s possible that one global minimum gives a much more Lipschitz or sparse model than others and thus has a better test error. It turns out that many commonly-used op- timizers (or their components) prefer or bias towards finding global minima of certain properties, leading to a better test performance.

happen to be the sparsest parameter with only 1 non-zero coordinate. Thus, sparsity and ` norm gives the same extremal points to some extent.

loss

θ

Figure 9.1: An Illustration that different global minima of the training loss can have different test performance.

Figure 9.2: Left: Performance of neural networks trained by two different learning rates schedules on the CIFAR-10 dataset. Although both exper- iments used exactly the same regularized losses and the optimizers fit the training data perfectly, the models’ generalization performance differ much. Right: On a different synthetic dataset, optimizers with different initializa- tions have the same training error but different generalization performance.

In summary, the takehome message here is that the choice of optimizer does not only affect minimizing the training loss, but also imposes implicit regularization and affects the generalization of the model. Even if your cur- rent optimizer already converges to a small training error perfectly, you may still need to tune your optimizer for a better generalization, .

The setting is the same as in Woodworth et al. [2020], HaoChen et al. [2020]

One may wonder which components of the optimizers bias towards what type of global minima and what type of global minima may generalize bet- ter. These are open questions that researchers are actively investigating. Empirical and theoretical research have offered some clues and heuristics. In many (but definitely far from all) situations, among those setting where optimization can succeed in minimizing the training loss, the use of larger initial learning rate, smaller initialization, smaller batch size, and momen- tum appears to help with biasing towards more generalizable solutions. A conjecture (that can be proven in certain simplified case) is that stochas- ticity in the optimization process help the optimizer to find flatter global minima (global minima where the curvature of the loss is small), and flat global minima tend to give more Lipschitz models and better generalization. Characterizing the implicit regularization effect formally is still a challenging open research question.

##### 9.3 Model selection via cross validation

Suppose we are trying select among several different models for a learning problem. For instance, we might be using a polynomial regression model

k

h θ ( x ) = g ( θ + θ x + θ x + · · · + θ k x ), and wish to decide if k should be 0, 1, . . . , or 10. How can we automatically select a model that represents a good tradeoff between the twin evils of bias and variance ? Alternatively, suppose we want to automatically choose the bandwidth parameter τ for locally weighted regression, or the parameter C for our ` -regularized SVM. How can we do that? For the sake of concreteness, in these notes we assume we have some finite set of models M = { M , . . . , M d } that we’re trying to select among. For instance, in our first example above, the model M i would be an i -th degree polynomial regression model. (The generalization to infinite M is not hard. ) Alternatively, if we are trying to decide between using an SVM, a neural network or logistic regression, then M may contain these models.

Given that we said in the previous set of notes that bias and variance are two very different beasts, some readers may be wondering if we should be calling them “twin” evils here. Perhaps it’d be better to think of them as non-identical twins. The phrase “the fraternal twin evils of bias and variance” doesn’t have the same ring to it, though. If we are trying to choose from an infinite set of models, say corresponding to the

+

possible values of the bandwidth τ ∈ R , we may discretize τ and consider only a finite number of possible values for it. More generally, most of the algorithms described here can all be viewed as performing optimization search in the space of models, and we can perform this search over infinite model classes as well.

Cross validation. Lets suppose we are, as usual, given a training set S . Given what we know about empirical risk minimization, here’s what might initially seem like a algorithm, resulting from using empirical risk minimiza- tion for model selection:

1. Train each model M i on S , to get some hypothesis h i .

2. Pick the hypotheses with the smallest training error.

This algorithm does not work. Consider choosing the degree of a poly- nomial. The higher the degree of the polynomial, the better it will fit the training set S , and thus the lower the training error. Hence, this method will always select a high-variance, high-degree polynomial model, which we saw previously is often poor choice. Here’s an algorithm that works better. In hold-out cross validation (also called simple cross validation ), we do the following:

1. Randomly split S into S train (say, 70% of the data) and S cv (the remain- ing 30%). Here, S cv is called the hold-out cross validation set.

2. Train each model M i on S train only, to get some hypothesis h i .

3. Select and output the hypothesis h i that had the smallest error ˆ ε S cv

( h i ) on the hold out cross validation set. (Here ˆ ε S cv

( h ) denotes the average error of h on the set of examples in S cv .) The error on the hold out validation set is also referred to as the validation error.

By testing/validating on a set of examples S cv that the models were not trained on, we obtain a better estimate of each hypothesis h i ’s true general- ization/test error. Thus, this approach is essentially picking the model with the smallest estimated generalization/test error. The size of the validation set depends on the total number of available examples. Usually, somewhere between 1 / − / 3 of the data is used in the hold out cross validation set, and 30% is a typical choice. However, when the total dataset is huge, validation set can be a smaller fraction of the total examples as long as the absolute number of validation examples is decent. For example, for the ImageNet dataset that has about 1M training images, the validation set is sometimes set to be 50K images, which is only about 5% of the total examples. Optionally, step 3 in the algorithm may also be replaced with selecting the model M i according to arg min i ε ˆ S cv

( h i ), and then retraining M i on the entire training set S . (This is often a good idea, with one exception being learning algorithms that are be very sensitive to perturbations of the initial

conditions and/or data. For these methods, M i doing well on S train does not necessarily mean it will also do well on S cv , and it might be better to forgo this retraining step.) The disadvantage of using hold out cross validation is that it “wastes” about 30% of the data. Even if we were to take the optional step of retraining the model on the entire training set, it’s still as if we’re trying to find a good model for a learning problem in which we had 0 . n training examples, rather than n training examples, since we’re testing models that were trained on only 0 . n examples each time. While this is fine if data is abundant and/or cheap, in learning problems in which data is scarce (consider a problem with n = 20, say), we’d like to do something better. Here is a method, called k -fold cross validation , that holds out less data each time:

1. Randomly split S into k disjoint subsets of m/k training examples each. Lets call these subsets S , . . . , S k .

2. For each model M i , we evaluate it as follows:

For j = 1 , . . . , k

Train the model M i on S ∪ · · · ∪ S j − ∪ S j +1 ∪ · · · S k (i.e., train on all the data except S j ) to get some hypothesis h ij . Test the hypothesis h ij on S j , to get ˆ ε S j

( h ij ).

The estimated generalization error of model M i is then calculated as the average of the ˆ ε S j

( h ij )’s (averaged over j ).

3. Pick the model M i with the lowest estimated generalization error, and retrain that model on the entire training set S . The resulting hypothesis is then output as our final answer.

A typical choice for the number of folds to use here would be k = 10. While the fraction of data held out each time is now 1 /k —much smaller than before—this procedure may also be more computationally expensive than hold-out cross validation, since we now need train to each model k times. While k = 10 is a commonly used choice, in problems in which data is really scarce, sometimes we will use the extreme choice of k = m in order to leave out as little data as possible each time. In this setting, we would repeatedly train on all but one of the training examples in S , and test on that held-out example. The resulting m = k errors are then averaged together to obtain our estimate of the generalization error of a model. This method has

its own name; since we’re holding out one training example at a time, this method is called leave-one-out cross validation. Finally, even though we have described the different versions of cross vali- dation as methods for selecting a model, they can also be used more simply to evaluate a single model or algorithm. For example, if you have implemented some learning algorithm and want to estimate how well it performs for your application (or if you have invented a novel learning algorithm and want to report in a technical paper how well it performs on various test sets), cross validation would give a reasonable way of doing so.

##### 9.4 Bayesian statistics and regularization

In this section, we will talk about one more tool in our arsenal for our battle against overfitting. At the beginning of the quarter, we talked about parameter fitting using maximum likelihood estimation (MLE), and chose our parameters according to ∏

n ( i ) ( i )

θ MLE = arg max p ( y | x ; θ ) .

θ i =1

Throughout our subsequent discussions, we viewed θ as an unknown param- eter of the world. This view of the θ as being constant-valued but unknown is taken in frequentist statistics. In the frequentist this view of the world, θ is not random—it just happens to be unknown—and it’s our job to come up with statistical procedures (such as maximum likelihood) to try to estimate this parameter. An alternative way to approach our parameter estimation problems is to take the Bayesian view of the world, and think of θ as being a random variable whose value is unknown. In this approach, we would specify a prior distribution p ( θ ) on θ that expresses our “prior beliefs” about the

( i ) ( i ) n

parameters. Given a training set S = { ( x , y ) } i =1

, when we are asked to make a prediction on a new value of x , we can then compute the posterior distribution on the parameters

p ( S | θ ) p ( θ ) p ( θ | S ) = p ( S ) (∏

n ( i ) ( i )

)

i =1

p ( y | x , θ ) p ( θ ) = ∫ ∏ n ( i θ

( ) ( i )

(9.3)

i =1

p ( y | x , θ ) p ( θ )) dθ

( i ) ( i )

In the equation above, p ( y | x , θ ) comes from whatever model you’re using

for your learning problem. For example, if you are using Bayesian logistic re-

( i ) ( i ) ( i ) y

( i )

( i ) (1 − y

( i )

)

gression, then you might choose p ( y | x , θ ) = h θ ( x ) (1 − h θ ( x )) ,

( i ) T ( i )

where h θ ( x ) = 1 / (1 + exp( − θ x )). When we are given a new test example x and asked to make it prediction on it, we can compute our posterior distribution on the class label using the posterior distribution on θ : ∫ p ( y | x, S ) = p ( y | x, θ ) p ( θ | S ) dθ (9.4)

θ

In the equation above, p ( θ | S ) comes from Equation (9.3). Thus, for example, if the goal is to the predict the expected value of y given x , then we would output ∫ E[ y | x, S ] = yp ( y | x, S ) dy

y

The procedure that we’ve outlined here can be thought of as doing “fully Bayesian” prediction, where our prediction is computed by taking an average with respect to the posterior p ( θ | S ) over θ . Unfortunately, in general it is computationally very difficult to compute this posterior distribution. This is because it requires taking integrals over the (usually high-dimensional) θ as in Equation (9.3), and this typically cannot be done in closed-form. Thus, in practice we will instead approximate the posterior distribution for θ . One common approximation is to replace our posterior distribution for θ (as in Equation 9.4) with a single point estimate. The MAP (maximum a posteriori) estimate for θ is given by

∏

n ( i ) ( i )

θ MAP = arg max p ( y | x , θ ) p ( θ ) . (9.5)

θ i =1

Note that this is the same formulas as for the MLE (maximum likelihood) estimate for θ , except for the prior p ( θ ) term at the end. In practical applications, a common choice for the prior p ( θ ) is to assume that θ ∼ N (0 , τ I ). Using this choice of prior, the fitted parameters θ MAP will have smaller norm than that selected by maximum likelihood. In practice, this causes the Bayesian MAP estimate to be less susceptible to overfitting than the ML estimate of the parameters. For example, Bayesian logistic regression turns out to be an effective algorithm for text classification, even though in text classification we usually have d  n .

Since we are now viewing θ as a random variable, it is okay to condition on it value, and write “ p ( y | x, θ )” instead of “ p ( y | x ; θ ).” The integral below would be replaced by a summation if y is discrete-valued.

# Part IV

# Unsupervised learning

# Chapter 10

# Clustering and the k -means algorithm

(1) ( n )

In the clustering problem, we are given a training set { x , . . . , x } , and

( i ) d

want to group the data into a few cohesive “clusters.” Here, x ∈ R

( i )

as usual; but no labels y are given. So, this is an unsupervised learning problem. The k -means clustering algorithm is as follows:

d

1. Initialize cluster centroids μ , μ , . . . , μ k ∈ R randomly.

2. Repeat until convergence: {

For every i , set

( i ) ( i )

c := arg min || x − μ j || .

j

For each j , set ∑ n ( i ) ( i ) i =1

{ c = j } x μ j := ∑ n ( i )

.

i =1

{ c = j }

}

In the algorithm above, k (a parameter of the algorithm) is the number of clusters we want to find; and the cluster centroids μ j represent our current guesses for the positions of the centers of the clusters. To initialize the cluster centroids (in step 1 of the algorithm above), we could choose k training examples randomly, and set the cluster centroids to be equal to the values of these k examples. (Other initialization methods are also possible.) The inner-loop of the algorithm repeatedly carries out two steps: (i)

( i )

“Assigning” each training example x to the closest cluster centroid μ j , and

Figure 10.1: K-means algorithm. Training examples are shown as dots, and cluster centroids are shown as crosses. (a) Original dataset. (b) Random ini- tial cluster centroids (in this instance, not chosen to be equal to two training examples). (c-f) Illustration of running two iterations of k -means. In each iteration, we assign each training example to the closest cluster centroid (shown by “painting” the training examples the same color as the cluster centroid to which is assigned); then we move each cluster centroid to the mean of the points assigned to it. (Best viewed in color.) Images courtesy Michael Jordan.

(ii) Moving each cluster centroid μ j to the mean of the points assigned to it. Figure 10.1 shows an illustration of running k -means. Is the k -means algorithm guaranteed to converge? Yes it is, in a certain sense. In particular, let us define the distortion function to be:

∑

n ( i )

J ( c, μ ) = || x − μ c ( i ) ||

i =1

Thus, J measures the sum of squared distances between each training exam-

( i )

ple x and the cluster centroid μ c ( i ) to which it has been assigned. It can be shown that k -means is exactly coordinate descent on J . Specifically, the inner-loop of k -means repeatedly minimizes J with respect to c while holding μ fixed, and then minimizes J with respect to μ while holding c fixed. Thus,

J must monotonically decrease, and the value of J must converge. (Usu- ally, this implies that c and μ will converge too. In theory, it is possible for k -means to oscillate between a few different clusterings—i.e., a few different values for c and/or μ —that have exactly the same value of J , but this almost never happens in practice.) The distortion function J is a non-convex function, and so coordinate descent on J is not guaranteed to converge to the global minimum. In other words, k -means can be susceptible to local optima. Very often k -means will work fine and come up with very good clusterings despite this. But if you are worried about getting stuck in bad local minima, one common thing to do is run k -means many times (using different random initial values for the cluster centroids μ j ). Then, out of all the different clusterings found, pick the one that gives the lowest distortion J ( c, μ ).

# Chapter 11

# EM algorithms

In this set of notes, we discuss the EM (Expectation-Maximization) algorithm for density estimation.

##### 11.1 EM for mixture of Gaussians

(1) ( n )

Suppose that we are given a training set { x , . . . , x } as usual. Since we are in the unsupervised learning setting, these points do not come with any labels.

( i ) ( i )

We wish to model the data by specifying a joint distribution p ( x , z ) =

( i ) ( i ) ( i ) ( i )

∑ k

p ( x | z ) p ( z ). Here, z ∼ Multinomial( φ ) (where φ j ≥ 0, j =1

φ j = 1,

( i ) ( i ) ( i )

and the parameter φ j gives p ( z = j )), and x | z = j ∼ N ( μ j , Σ j ). We

( i )

let k denote the number of values that the z ’s can take on. Thus, our

( i ) ( i )

model posits that each x was generated by randomly choosing z from

( i )

{ , . . . , k } , and then x was drawn from one of k Gaussians depending on

( i )

z . This is called the mixture of Gaussians model. Also, note that the

( i )

z ’s are latent random variables, meaning that they’re hidden/unobserved. This is what will make our estimation problem difficult. The parameters of our model are thus φ , μ and Σ. To estimate them, we can write down the likelihood of our data:

∑ n ( i )

` ( φ, μ, Σ) = log p ( x ; φ, μ, Σ)

i =1

∑ n

∑ k ( i ) ( i ) ( i )

= log p ( x | z ; μ, Σ) p ( z ; φ ) .

i =1 z ( i )

=1

However, if we set to zero the derivatives of this formula with respect to

the parameters and try to solve, we’ll find that it is not possible to find the maximum likelihood estimates of the parameters in closed form. (Try this yourself at home.)

( i ) ( i )

The random variables z indicate which of the k Gaussians each x

( i )

had come from. Note that if we knew what the z ’s were, the maximum likelihood problem would have been easy. Specifically, we could then write down the likelihood as

∑ n ( i ) ( i ) ( i )

` ( φ, μ, Σ) = log p ( x | z ; μ, Σ) + log p ( z ; φ ) .

i =1

Maximizing this with respect to φ , μ and Σ gives the parameters:

∑

n ( i )

φ j = { z = j } , n

i =1

∑ n ( i ) ( i ) i =1

{ z = j } x μ j = ∑ n ( i

,

i =1

{ z )

= j } ∑ n ( i ) ( i ) ( i ) T i =1

{ z = j } ( x − μ j )( x − μ Σ j

∑

j ) = n ( i )

.

i =1

{ z = j }

( i )

Indeed, we see that if the z ’s were known, then maximum likelihood estimation becomes nearly identical to what we had when estimating the parameters of the Gaussian discriminant analysis model, except that here

( i )

the z ’s playing the role of the class labels.

( i )

However, in our density estimation problem, the z ’s are not known. What can we do? The EM algorithm is an iterative algorithm that has two main steps. Applied to our problem, in the E-step, it tries to “guess” the values of the

( i )

z ’s. In the M-step, it updates the parameters of our model based on our guesses. Since in the M-step we are pretending that the guesses in the first part were correct, the maximization becomes easy. Here’s the algorithm:

Repeat until convergence: {

(E-step) For each i, j , set

( i ) ( i ) ( i )

w j

:= p ( z = j | x ; φ, μ, Σ)

There are other minor differences in the formulas here from what we’d obtained in

( i )

PS1 with Gaussian discriminant analysis, first because we’ve generalized the z ’s to be multinomial rather than Bernoulli, and second because here we are using a different Σ j

for each Gaussian.

(M-step) Update the parameters:

∑ n ( i )

φ j := w j

, n

i =1

∑ n ( i ) ( i ) i =1

w j

x μ j := ∑ n ( i )

,

i =1

w j

∑ n ( i ) ( i ) ( i ) T i =1

w j

( x − μ j )( x − μ j ) Σ j := ∑ n ( i ) i =1

w j

}

In the E-step, we calculate the posterior probability of our parameters

( i ) ( i )

the z ’s, given the x and using the current setting of our parameters. I.e., using Bayes rule, we obtain:

( i ) ( i ) ( i ) ( i ) ( i )

p ( x | z = j ; μ, Σ) p ( z = j ; φ ) p ( z = j | x ; φ, μ, Σ) = ∑ k ( i ) l =1

p ( x | z ( i )

= l ; μ, Σ) p ( z ( i )

= l ; φ )

( i ) ( i )

Here, p ( x | z = j ; μ, Σ) is given by evaluating the density of a Gaussian

( i ) ( i )

with mean μ j and covariance Σ j at x ; p ( z = j ; φ ) is given by φ j , and so

( i )

on. The values w j

calculated in the E-step represent our “soft” guesses for

( i )

the values of z . Also, you should contrast the updates in the M-step with the formulas we

( i )

had when the z ’s were known exactly. They are identical, except that in-

( i )

stead of the indicator functions “1 { z = j } ” indicating from which Gaussian

( i )

each datapoint had come, we now instead have the w j

’s. The EM-algorithm is also reminiscent of the K-means clustering algo- rithm, except that instead of the “hard” cluster assignments c ( i ), we instead

( i )

have the “soft” assignments w j

. Similar to K-means, it is also susceptible to local optima, so reinitializing at several different initial parameters may be a good idea. It’s clear that the EM algorithm has a very natural interpretation of

( i )

repeatedly trying to guess the unknown z ’s; but how did it come about, and can we make any guarantees about it, such as regarding its convergence? In the next set of notes, we will describe a more general view of EM, one

The term “soft” refers to our guesses being probabilities and taking values in [0 , 1]; in contrast, a “hard” guess is one that represents a single best guess (such as taking values in { , } or { , . . . , k } ).

that will allow us to easily apply it to other estimation problems in which there are also latent variables, and which will allow us to give a convergence guarantee.

##### 11.2 Jensen’s inequality

We begin our discussion with a very useful result called Jensen’s inequality Let f be a function whose domain is the set of real numbers. Recall that

′′

f is a convex function if f ( x ) ≥ 0 (for all x ∈ R ). In the case of f taking vector-valued inputs, this is generalized to the condition that its hessian H

′′

is positive semi-definite ( H ≥ 0). If f ( x ) > 0 for all x , then we say f is strictly convex (in the vector-valued case, the corresponding statement is that H must be positive definite, written H > 0). Jensen’s inequality can then be stated as follows:

Theorem. Let f be a convex function, and let X be a random variable. Then: E[ f ( X )] ≥ f (E X ) .

Moreover, if f is strictly convex, then E[ f ( X )] = f (E X ) holds true if and only if X = E[ X ] with probability 1 (i.e., if X is a constant).

Recall our convention of occasionally dropping the parentheses when writ- ing expectations, so in the theorem above, f (E X ) = f (E[ X ]). For an interpretation of the theorem, consider the figure below.

f(a) f

E[f(X)]

f(b)

f(EX)

a E[X] b

Here, f is a convex function shown by the solid line. Also, X is a random variable that has a 0.5 chance of taking the value a , and a 0.5 chance of

taking the value b (indicated on the x -axis). Thus, the expected value of X is given by the midpoint between a and b . We also see the values f ( a ), f ( b ) and f (E[ X ]) indicated on the y -axis. Moreover, the value E[ f ( X )] is now the midpoint on the y -axis between f ( a ) and f ( b ). From our example, we see that because f is convex, it must be the case that E[ f ( X )] ≥ f (E X ). Incidentally, quite a lot of people have trouble remembering which way the inequality goes, and remembering a picture like this is a good way to quickly figure out the answer. Remark. Recall that f is [strictly] concave if and only if − f is [strictly]

′′

convex (i.e., f ( x ) ≤ 0 or H ≤ 0). Jensen’s inequality also holds for concave functions f , but with the direction of all the inequalities reversed (E[ f ( X )] ≤ f (E X ), etc.).

##### 11.3 General EM algorithms

Suppose we have an estimation problem in which we have a training set

(1) ( n )

{ x , . . . , x } consisting of n independent examples. We have a latent vari- able model p ( x, z ; θ ) with z being the latent variable (which for simplicity is assumed to take finite number of values). The density for x can be obtained by marginalized over the latent variable z : ∑ p ( x ; θ ) = p ( x, z ; θ ) (11.1)

z

We wish to fit the parameters θ by maximizing the log-likelihood of the data, defined by

∑

n ( i )

` ( θ ) = log p ( x ; θ ) (11.2)

i =1

We can rewrite the objective in terms of the joint density p ( x, z ; θ ) by

∑ n ( i )

` ( θ ) = log p ( x ; θ ) (11.3)

i =1

∑

n

∑

( i ) ( i )

= log p ( x , z ; θ ) . (11.4)

i =1 z ( i )

But, explicitly finding the maximum likelihood estimates of the parameters θ may be hard since it will result in difficult non-convex optimization prob-

( i )

lems. Here, the z ’s are the latent random variables; and it is often the case

( i )

that if the z ’s were observed, then maximum likelihood estimation would be easy. In such a setting, the EM algorithm gives an efficient method for max- imum likelihood estimation. Maximizing ` ( θ ) explicitly might be difficult, and our strategy will be to instead repeatedly construct a lower-bound on ` (E-step), and then optimize that lower-bound (M-step). ∑ n

It turns out that the summation i =1

is not essential here, and towards a simpler exposition of the EM algorithm, we will first consider optimizing the the likelihood log p ( x ) for a single example x . After we derive the algorithm for optimizing log p ( x ), we will convert it to an algorithm that works for n examples by adding back the sum to each of the relevant equations. Thus, now we aim to optimize log p ( x ; θ ) which can be rewritten as ∑ log p ( x ; θ ) = log p ( x, z ; θ ) (11.5)

z

∑ Let Q be a distribution over the possible values of z . That is, z

Q ( z ) = 1, Q ( z ) ≥ 0). Consider the following: ∑ log p ( x ; θ ) = log p ( x, z ; θ )

z

∑ p ( x, z ; θ ) = log Q ( z ) (11.6)

z

Q ( z ) ∑ p ( x, z ; θ ) ≥ Q ( z ) log (11.7)

z

Q ( z )

The last step of this derivation used Jensen’s inequality. Specifically,

′′

f ( x ) = log x is a concave function, since f ( x ) = − /x < 0 over its domain

It’s mostly an empirical observation that the optimization problem is difficult to op- timize. Empirically, the E-step and M-step can often be computed more efficiently than op- timizing the function ` ( · ) directly. However, it doesn’t necessarily mean that alternating the two steps can always converge to the global optimum of ` ( · ). Even for mixture of Gaussians, the EM algorithm can either converge to a global optimum or get stuck, de- pending on the properties of the training data. Empirically, for real-world data, often EM can converge to a solution with relatively high likelihood (if not the optimum), and the theory behind it is still largely not understood. If z were continuous, then Q would be a density, and the summations over z in our discussion are replaced with integrals over z .

+

x ∈ R . Also, the term

∑ [ ] p ( x, z ; θ ) Q ( z )

z

Q ( z )

in the summation is just an expectation of the quantity [ p ( x, z ; θ ) /Q ( z )] with respect to z drawn according to the distribution given by Q . By Jensen’s inequality, we have ( [ ]) [ ( )] p ( x, z ; θ ) p ( x, z ; θ ) f E z ∼ Q ≥ E z ∼ Q f , Q ( z ) Q ( z )

where the “ z ∼ Q ” subscripts above indicate that the expectations are with respect to z drawn from Q . This allowed us to go from Equation (11.6) to Equation (11.7). Now, for any distribution Q , the formula (11.7) gives a lower-bound on log p ( x ; θ ). There are many possible choices for the Q ’s. Which should we choose? Well, if we have some current guess θ of the parameters, it seems natural to try to make the lower-bound tight at that value of θ . I.e., we will make the inequality above hold with equality at our particular value of θ . To make the bound tight for a particular value of θ , we need for the step involving Jensen’s inequality in our derivation above to hold with equality. For this to be true, we know it is sufficient that the expectation be taken over a “constant”-valued random variable. I.e., we require that

p ( x, z ; θ ) = c Q ( z )

for some constant c that does not depend on z . This is easily accomplished by choosing Q ( z ) ∝ p ( x, z ; θ ) . ∑ Actually, since we know z

Q ( z ) = 1 (because it is a distribution), this further tells us that

p ( x, z ; θ ) Q ( z ) = ∑

z

| p   | (   | x, z | ;   | θ   | )   |
| --- | --- | ---- | --- | --- | --- |
| p   | (   | x, z | ;   | θ   | )   |
| p   | (   | x    | ;   | θ   | )   |

p ( x,z ; θ )

We note that the notion

Q ( z )

only makes sense if Q ( z ) = 0 whenever p ( x, z ; θ ) = 0. Here we implicitly assume that we only consider those Q with such a property.

Thus, we simply set the Q ’s to be the posterior distribution of the z ’s given x and the setting of the parameters θ . Indeed, we can directly verify that when Q ( z ) = p ( z | x ; θ ), then equa- tion (11.7) is an equality because ∑ p ( x, z ; θ ) ∑ p ( x, z ; θ ) Q ( z ) log = p ( z | x ; θ ) log

z

Q ( z )

z

p ( z | x ; θ ) ∑ p ( z | x ; θ ) p ( x ; θ ) = p ( z | x ; θ ) log

z

p ( z | x ; θ ) ∑ = p ( z | x ; θ ) log p ( x ; θ )

z

∑ = log p ( x ; θ ) p ( z | x ; θ )

z

∑ = log p ( x ; θ ) (because z

p ( z | x ; θ ) = 1)

For convenience, we call the expression in Equation (11.7) the evidence lower bound (ELBO) and we denote it by ∑ p ( x, z ; θ ) ELBO( x ; Q, θ ) = Q ( z ) log (11.9)

z

Q ( z )

With this equation, we can re-write equation (11.7) as

∀ Q, θ, x, log p ( x ; θ ) ≥ ELBO( x ; Q, θ ) (11.10)

Intuitively, the EM algorithm alternatively updates Q and θ by a) set- ting Q ( z ) = p ( z | x ; θ ) following Equation (11.8) so that ELBO( x ; Q, θ ) = log p ( x ; θ ) for x and the current θ , and b) maximizing ELBO( x ; Q, θ ) w.r.t θ while fixing the choice of Q . Recall that all the discussion above was under the assumption that we aim to optimize the log-likelihood log p ( x ; θ ) for a single example x . It turns out that with multiple training examples, the basic idea is the same and we only needs to take a sum over examples at relevant places. Next, we will build the evidence lower bound for multiple training examples and make the EM algorithm formal.

(1) ( n )

Recall we have a training set { x , . . . , x } . Note that the optimal choice of Q is p ( z | x ; θ ), and it depends on the particular example x . Therefore here

( i )

we will introduce n distributions Q , . . . , Q n , one for each example x . For

( i )

each example x , we can build the evidence lower bound ∑ ( i ) ( i ) ( i ) ( i ) ( i )

p ( x , z ; θ ) log p ( x ; θ ) ≥ ELBO( x ; Q i , θ ) = Q i ( z ) log Q i z ( i )

i ( z ( )

)

Taking sum over all the examples, we obtain a lower bound for the log- likelihood ∑

( i )

` ( θ ) ≥ ELBO( x ; Q i , θ ) (11.11)

i

∑ ∑ ( i ) ( i ) ( i )

p ( x , z ; θ ) = Q i ( z ) log

i

Q i ( z ( i ) z ( i )

)

For any set of distributions Q , . . . , Q n , the formula (11.11) gives a lower- bound on ` ( θ ), and analogous to the argument around equation (11.8), the Q i that attains equality satisfies

( i ) ( i ) ( i )

Q i ( z ) = p ( z | x ; θ )

( i )

Thus, we simply set the Q i ’s to be the posterior distribution of the z ’s

( i )

given x with the current setting of the parameters θ . Now, for this choice of the Q i ’s, Equation (11.11) gives a lower-bound on the loglikelihood ` that we’re trying to maximize. This is the E-step. In the M-step of the algorithm, we then maximize our formula in Equation (11.11) with respect to the parameters to obtain a new setting of the θ ’s. Repeatedly carrying out these two steps gives us the EM algorithm, which is as follows:

Repeat until convergence {

(E-step) For each i , set

( i ) ( i ) ( i )

Q i ( z ) := p ( z | x ; θ ) .

(M-step) Set

∑

n ( i )

θ := arg max ELBO( x ; Q i , θ )

θ i =1

∑ ∑ ( i ) ( i ) ( i )

p ( x , z ; θ ) = arg max Q i ( z ) log . (11.12)

θ i z ( i )

Q i ( z ( i )

)

}

( t )

How do we know if this algorithm will converge? Well, suppose θ and

( t +1)

θ are the parameters from two successive iterations of EM. We will now

( t ) ( t +1)

prove that ` ( θ ) ≤ ` ( θ ), which shows EM always monotonically im- proves the log-likelihood. The key to showing this result lies in our choice of

the Q i ’s. Specifically, on the iteration of EM in which the parameters had

( t ) ( t ) ( i ) ( i ) ( i ) ( t )

started out as θ , we would have chosen Q i

( z ) := p ( z | x ; θ ). We saw earlier that this choice ensures that Jensen’s inequality, as applied to get Equation (11.11), holds with equality, and hence

∑ n ( t ) ( i ) ( t ) ( t )

` ( θ ) = ELBO( x ; Q i

, θ ) (11.13)

i =1

( t +1)

The parameters θ are then obtained by maximizing the right hand side of the equation above. Thus,

∑

n ( t +1) ( i ) ( t ) ( t +1)

` ( θ ) ≥ ELBO( x ; Q i

, θ )

i =1

(because ineqaulity (11.11) holds for all Q and θ ) ∑ n ( i ) ( t ) ( t )

≥ ELBO( x ; Q i

, θ ) (see reason below)

i =1 ( t )

= ` ( θ ) (by equation (11.13))

( t +1)

where the last inequality follows from that θ is chosen explicitly to be

∑

n ( i ) ( t )

arg max ELBO( x ; Q i

, θ )

θ i =1

Hence, EM causes the likelihood to converge monotonically. In our de- scription of the EM algorithm, we said we’d run it until convergence. Given the result that we just showed, one reasonable convergence test would be to check if the increase in ` ( θ ) between successive iterations is smaller than some tolerance parameter, and to declare convergence if EM is improving ` ( θ ) too slowly.

Remark. If we define (by overloading ELBO( · ))

∑ n

∑ ∑ ( i ) ( i ) ( i ) ( i )

p ( x , z ; θ ) ELBO( Q, θ ) = ELBO( x ; Q i , θ ) = Q i ( z ) log

i =1 i

Q ( i ) z ( i )

i ( z )

(11.14)

then we know ` ( θ ) ≥ ELBO( Q, θ ) from our previous derivation. The EM can also be viewed an alternating maximization algorithm on ELBO( Q, θ ), in which the E-step maximizes it with respect to Q (check this yourself), and the M-step maximizes it with respect to θ .

###### 11.3.1 Other interpretation of ELBO

∑ p ( x,z ; θ )

Let ELBO( x ; Q, θ ) = z

Q ( z ) log

Q ( z )

be defined as in equation (11.9). There are several other forms of ELBO. First, we can rewrite

ELBO( x ; Q, θ ) = E z ∼ Q [log p ( x, z ; θ )] − E z ∼ Q [log Q ( z )] = E z ∼ Q [log p ( x | z ; θ )] − D KL ( Q ‖ p z ) (11.15)

where we use p z to denote the marginal distribution of z (under the distri- bution p ( x, z ; θ )), and D KL () denotes the KL divergence

∑ Q ( z ) D KL ( Q ‖ p z ) = Q ( z ) log (11.16)

z

p ( z )

In many cases, the marginal distribution of z does not depend on the param- eter θ . In this case, we can see that maximizing ELBO over θ is equivalent to maximizing the first term in (11.15). This corresponds to maximizing the conditional likelihood of x conditioned on z , which is often a simpler question than the original question. Another form of ELBO( · ) is (please verify yourself)

ELBO( x ; Q, θ ) = log p ( x ) − D KL ( Q ‖ p z | x ) (11.17)

where p z | x is the conditional distribution of z given x under the parameter θ . This forms shows that the maximizer of ELBO( Q, θ ) over Q is obtained when Q = p z | x , which was shown in equation (11.8) before.

##### 11.4 Mixture of Gaussians revisited

Armed with our general definition of the EM algorithm, let’s go back to our old example of fitting the parameters φ , μ and Σ in a mixture of Gaussians. For the sake of brevity, we carry out the derivations for the M-step updates only for φ and μ j , and leave the updates for Σ j as an exercise for the reader. The E-step is easy. Following our algorithm derivation above, we simply calculate

( i ) ( i ) ( i ) ( i )

w j

= Q i ( z = j ) = P ( z = j | x ; φ, μ, Σ) .

( i ) ( i )

Here, “ Q i ( z = j )” denotes the probability of z taking the value j under the distribution Q i .

Next, in the M-step, we need to maximize, with respect to our parameters φ, μ, Σ, the quantity

∑ n

∑ ( i ) ( i ) ( i )

p ( x , z ; φ, μ, Σ) Q i ( z ) log

i =1

Q ) i ( z ( i z ( i )

)

∑

n

∑

k ( i ) ( i ) ( i ) ( i )

p ( x | z = j ; μ, Σ) p ( z = j ; φ ) = Q i ( z = j ) log

i =1 j =1

Q i ( z ( i )

= j ) ( ∑

n

∑

k ( i ) T − ( i )

)

d/

( i ) (2 π ) | Σ j | /

exp − ( x − μ j ) Σ j

( x − μ j ) · φ j

= w j

log

( i ) i =1 j =1

w j

Let’s maximize this with respect to μ l . If we take the derivative with respect to μ l , we find (

(

∑ n

∑ k i ) T − ( i )

)

( i ) (2 π ) d/

| Σ j | /

exp − ( x − μ j ) Σ j

( x − μ j ) · φ j

∇ μ l

w j

log

( i ) i =1 j =1

w j

∑

n

∑

k ( i ) ( i ) T − ( i )

= −∇ μ l

w j

( x − μ j ) Σ j

( x − μ j )

i =1 j =1

∑

n ( i ) T − ( i ) T −

= w l

∇ μ l

μ l

Σ l

x − μ l

Σ l

μ l

i =1

∑

n ( i )

(

− ( i ) −

) = w l

Σ l

x − Σ l

μ l

i =1

Setting this to zero and solving for μ l therefore yields the update rule

∑ n ( i ) ( i ) i =1

w l

x μ l := ∑ n ( i )

,

i =1

w l

which was what we had in the previous set of notes. Let’s do one more example, and derive the M-step update for the param- eters φ j . Grouping together only the terms that depend on φ j , we find that we need to maximize ∑ n

∑ k ( i )

w j

log φ j .

i =1 j =1

However, there is an additional constraint that the φ j ’s sum to 1, since they

( i )

represent the probabilities φ j = p ( z = j ; φ ). To deal with the constraint

∑ k

that j =1

φ j = 1, we construct the Lagrangian

∑

n

∑

k k ( i )

∑ L ( φ ) = w j

log φ j + β ( φ j − 1) ,

i =1 j =1 j =1

where β is the Lagrange multiplier. Taking derivatives, we find

∑ n ( i )

∂ w j

L ( φ ) = + β ∂φ j i =1

φ j

Setting this to zero and solving, we get ∑ n ( i ) i =1

w j

φ j = − β ∑ n ( i )

∑ I.e., φ j ∝ i =1

w j

. Using the constraint that j

φ j = 1, we easily find ∑ n

∑ k ( i )

∑ n ( i )

that − β = i =1 j =1

w j

= i =1

1 = n . (This used the fact that w j

=

( i )

∑ ( i )

Q i ( z = j ), and since probabilities sum to 1, j

w j

= 1.) We therefore have our M-step updates for the parameters φ j :

∑

n ( i )

φ j :=  w j

. n

i =1

The derivation for the M-step updates to Σ j are also entirely straightfor- ward.

##### 11.5 Variational inference and variational auto-encoder (optional reading)

Loosely speaking, variational auto-encoder Kingma and Welling [2013] gen- erally refers to a family of algorithms that extend the EM algorithms to more complex models parameterized by neural networks. It extends the technique of variational inference with the additional “re-parametrization trick” which will be introduced below. Variational auto-encoder may not give the best performance for many datasets, but it contains several central ideas about how to extend EM algorithms to high-dimensional continuous latent variables

We don’t need to worry about the constraint that φ j ≥ 0, because as we’ll shortly see, the solution we’ll find from this derivation will automatically satisfy that anyway.

with non-linear models. Understanding it will likely give you the language and backgrounds to understand various recent papers related to it. As a running example, we will consider the following parameterization of p ( x, z ; θ ) by a neural network. Let θ be the collection of the weights of a

k d

neural network g ( z ; θ ) that maps z ∈ R to R . Let

z ∼ N (0 , I k × k ) (11.18) x | z ∼ N ( g ( z ; θ ) , σ I d × d ) (11.19)

Here I k × k denotes identity matrix of dimension k by k , and σ is a scalar that we assume to be known for simplicity. For the Gaussian mixture models in Section 11.4, the optimal choice of Q ( z ) = p ( z | x ; θ ) for each fixed θ , that is the posterior distribution of z , can be analytically computed. In many more complex models such as the model (11.19), it’s intractable to compute the exact the posterior distribution p ( z | x ; θ ). Recall that from equation (11.10), ELBO is always a lower bound for any choice of Q , and therefore, we can also aim for finding an approximation of the true posterior distribution. Often, one has to use some particular form to approximate the true posterior distribution. Let Q be a family of Q ’s that we are considering, and we will aim to find a Q within the family of Q that is closest to the true posterior distribution. To formalize, recall the definition of the ELBO lower bound as a function of Q and θ defined in equation (11.14)

∑

n

∑ ∑ ( i ) ( i ) ( i ) ( i )

p ( x , z ; θ ) ELBO( Q, θ ) = ELBO( x ; Q i , θ ) = Q i ( z ) log Q i ( z ( i ) i =1 i z ( i )

)

Recall that EM can be viewed as alternating maximization of ELBO( Q, θ ). Here instead, we optimize the EBLO over Q ∈ Q

max max ELBO( Q, θ ) (11.20)

Q ∈Q θ

Now the next question is what form of Q (or what structural assumptions to make about Q ) allows us to efficiently maximize the objective above. When the latent variable z are high-dimensional discrete variables, one popular as- sumption is the mean field assumption , which assumes that Q i ( z ) gives a distribution with independent coordinates, or in other words, Q i can be de-

k

composed into Q i ( z ) = Q i

( z ) · · · Q i

( z k ). There are tremendous applications of mean field assumptions to learning generative models with discrete latent variables, and we refer to Blei et al. [2017] for a survey of these models and

their impact to a wide range of applications including computational biology, computational neuroscience, social sciences. We will not get into the details about the discrete latent variable cases, and our main focus is to deal with continuous latent variables, which requires not only mean field assumptions, but additional techniques.

k

When z ∈ R is a continuous latent variable, there are several decisions to make towards successfully optimizing (11.20). First we need to give a succinct representation of the distribution Q i because it is over an infinite number of points. A natural choice is to assume Q i is a Gaussian distribution with some mean and variance. We would also like to have more succinct representation

( i )

of the means of Q i of all the examples. Note that Q i ( z ) is supposed to

( i ) ( i )

approximate p ( z | x ; θ ). It would make sense let all the means of the Q i ’s

( i )

be some function of x . Concretely, let q ( · ; φ ) , v ( · ; φ ) be two functions that map from dimension d to k , which are parameterized by φ and ψ , we assume that

( i ) ( i )

Q i = N ( q ( x ; φ ) , diag( v ( x ; ψ )) ) (11.21)

k

Here diag( w ) means the k × k matrix with the entries of w ∈ R on the diagonal. In other words, the distribution Q i is assumed to be a Gaussian distribution with independent coordinates, and the mean and standard de- viations are governed by q and v . Often in variational auto-encoder, q and v are chosen to be neural networks. In recent deep learning literature, often q, v are called encoder (in the sense of encoding the data into latent code), whereas g ( z ; θ ) if often referred to as the decoder. We remark that Q i of such form in many cases are very far from a good ap- proximation of the true posterior distribution. However, some approximation is necessary for feasible optimization. In fact, the form of Q i needs to satisfy other requirements (which happened to be satisfied by the form (11.21)) Before optimizing the ELBO, let’s first verify whether we can efficiently evaluate the value of the ELBO for fixed Q of the form (11.21) and θ . We rewrite the ELBO as a function of φ, ψ, θ by

∑

n [

( i ) ( i )

] p ( x , z ; θ ) ELBO( φ, ψ, θ ) = E z ( i )

∼ Q i

log

( i )

, (11.22)

i =1

Q i ( z )

( i ) ( i )

where Q i = N ( q ( x ; φ ) , diag( v ( x ; ψ )) )

( i )

Note that to evaluate Q i ( z ) inside the expectation, we should be able to compute the density of Q i . To estimate the expectation E z ( i )

∼ Q i

, we

q and v can also share parameters. We sweep this level of details under the rug in this note.

should be able to sample from distribution Q i so that we can build an empirical estimator with samples. It happens that for Gaussian distribution

( i ) ( i )

Q i = N ( q ( x ; φ ) , diag( v ( x ; ψ )) ), we are able to be both efficiently. Now let’s optimize the ELBO. It turns out that we can run gradient ascent over φ, ψ, θ instead of alternating maximization. There is no strong need to compute the maximum over each variable at a much greater cost. (For Gaus- sian mixture model in Section 11.4, computing the maximum is analytically feasible and relatively cheap, and therefore we did alternating maximization.) Mathematically, let η be the learning rate, the gradient ascent step is

| θ   | :=  | θ   | +   | η   | ∇   | θ   | ELBO( | φ, ψ, θ | )   |
| --- | --- | --- | --- | --- | --- | --- | ----- | ------- | --- |
| φ   | :=  | φ   | +   | η   | ∇   | φ   | ELBO( | φ, ψ, θ | )   |
| ψ   | :=  | ψ   | +   | η   | ∇   | ψ   | ELBO( | φ, ψ, θ | )   |

Computing the gradient over θ is simple because

∑

n [

( i ) ( i )

] p ( x , z ; θ ) ∇ θ ELBO( φ, ψ, θ ) = ∇ θ E z ( i )

∼ Q i

log

i =1

Q ( i ) i ( z )

∑ n

[

( i ) ( i )

] = ∇ θ E z ( i )

∼ Q i

log p ( x , z ; θ )

i =1

∑ n

[

( i ) ( i )

] = E z ( i )

∼ Q i

∇ θ log p ( x , z ; θ ) , (11.23)

i =1

But computing the gradient over φ and ψ is tricky because the sam- pling distribution Q i depends on φ and ψ . (Abstractly speaking, the is- sue we face can be simplified as the problem of computing the gradi- ent E z ∼ Q φ

[ f ( φ )] with respect to variable φ . We know that in general, ∇ E z ∼ Q φ

[ f ( φ )] = E z ∼ Q φ

[ ∇ f ( φ )] because the dependency of Q φ on φ has to be taken into account as well. ) The idea that comes to rescue is the so-called re-parameterization

( i ) ( i ) ( i )

trick : we rewrite z ∼ Q i = N ( q ( x ; φ ) , diag( v ( x ; ψ )) ) in an equivalent way:

( i ) ( i ) ( i ) ( i ) ( i )

z = q ( x ; φ ) + v ( x ; ψ ) ξ where ξ ∼ N (0 , I k × k ) (11.24)

Here x y denotes the entry-wise product of two vectors of the same dimension. Here we used the fact that x ∼ N ( μ, σ ) is equivalent to that x = μ + ξσ with ξ ∼ N (0 , 1). We mostly just used this fact in every dimension

( i )

simultaneously for the random variable z ∼ Q i .

With this re-parameterization, we have that [

( i ) ( i )

] p ( x , z ; θ ) E z ( i )

∼ Q i

log Q ( i )

(11.25)

i ( z ) [

( i ) ( i ) ( i ) ( i )

] p ( x , q ( x ; φ ) + v ( x ; ψ ) ξ ; θ ) = E ξ ( i )

∼N (0 , 1)

log Q i ( q ( x ( i )

; φ ) + v ( x ( i )

; ψ ) ξ ( i )

)

It follows that [

( i ) ( i )

] p ( x , z ; θ ) ∇ φ E z ( i )

∼ Q i

log Q i ( z ( i )

) [

( i ) ( i ) ( i ) ( i )

] p ( x , q ( x ; φ ) + v ( x ; ψ ) ξ ; θ ) = ∇ φ E ξ ( i )

∼N (0 , 1)

log Q i ( q ( x ( i )

; φ ) + v ( x ( i )

; ψ ) ξ ( i )

) [

( i ) ( i ) ( i ) ( i )

] p ( x , q ( x ; φ ) + v ( x ; ψ ) ξ ; θ ) = E ξ ( i )

∼N (0 , 1)

∇ φ log Q i ( q ( x ( i )

; φ ) + v ( x ( i )

; ψ ) ξ ( i )

)

( i )

We can now sample multiple copies of ξ ’s to estimate the the expecta- tion in the RHS of the equation above. We can estimate the gradient with respect to ψ similarly, and with these, we can implement the gradient ascent algorithm to optimize the ELBO over φ, ψ, θ. There are not many high-dimensional distributions with analytically com- putable density function are known to be re-parameterizable. We refer to Kingma and Welling [2013] for a few other choices that can replace Gaussian distribution.

Empirically people sometimes just use one sample to estimate it for maximum com- putational efficiency.

# Chapter 12

# Principal components analysis

In this set of notes, we will develop a method, Principal Components Analysis (PCA), that tries to identify the subspace in which the data approximately lies. PCA is computationally efficient: it will require only an eigenvector calculation (easily done with the eig function in Matlab).

( i )

Suppose we are given a dataset { x ; i = 1 , . . . , n } of attributes of n dif- ferent types of automobiles, such as their maximum speed, turn radius, and

( i ) d

so on. Let x ∈ R for each i ( d  n ). But unknown to us, two different attributes—some x i and x j —respectively give a car’s maximum speed mea- sured in miles per hour, and the maximum speed measured in kilometers per hour. These two attributes are therefore almost linearly dependent, up to only small differences introduced by rounding off to the nearest mph or kph. Thus, the data really lies approximately on an n − 1 dimensional subspace. How can we automatically detect, and perhaps remove, this redundancy? For a less contrived example, consider a dataset resulting from a survey of

( i )

pilots for radio-controlled helicopters, where x is a measure of the piloting

( i )

skill of pilot i , and x captures how much he/she enjoys flying. Because RC helicopters are very difficult to fly, only the most committed students, ones that truly enjoy flying, become good pilots. So, the two attributes x and x are strongly correlated. Indeed, we might posit that that the data actually likes along some diagonal axis (the u direction) capturing the intrinsic piloting “karma” of a person, with only a small amount of noise lying off this axis. (See figure.) How can we automatically compute this u direction?

u

u

(enjoyment) x

x (skill)

We will shortly develop the PCA algorithm. But prior to running PCA per se, typically we first preprocess the data by normalizing each feature to have mean 0 and variance 1. We do this by subtracting the mean and dividing by the empirical standard deviation:

( i ) ( i )

x j

− μ j

x j

← σ j

∑ n ( i )

∑ n ( i )

where μ j =

n i =1

x j

and σ j

=

n i =1

( x j

− μ j ) are the mean variance of feature j , respectively. Subtracting μ j zeros out the mean and may be omitted for data known to have zero mean (for instance, time series corresponding to speech or other acoustic signals). Dividing by the standard deviation σ j rescales each coor- dinate to have unit variance, which ensures that different attributes are all treated on the same “scale.” For instance, if x was cars’ maximum speed in mph (taking values in the high tens or low hundreds) and x were the num- ber of seats (taking values around 2-4), then this renormalization rescales the different attributes to make them more comparable. This rescaling may be omitted if we had a priori knowledge that the different attributes are all on the same scale. One example of this is if each data point represented a

( i )

grayscale image, and each x j

took a value in { , , . . . , } corresponding to the intensity value of pixel j in image i . Now, having normalized our data, how do we compute the “major axis of variation” u —that is, the direction on which the data approximately lies? One way is to pose this problem as finding the unit vector u so that when

the data is projected onto the direction corresponding to u , the variance of the projected data is maximized. Intuitively, the data starts off with some amount of variance/information in it. We would like to choose a direction u so that if we were to approximate the data as lying in the direction/subspace corresponding to u , as much as possible of this variance is still retained. Consider the following dataset, on which we have already carried out the normalization steps:

Now, suppose we pick u to correspond the the direction shown in the figure below. The circles denote the projections of the original data onto this line.

                                                                

            

       

                                            

We see that the projected data still has a fairly large variance, and the points tend to be far from zero. In contrast, suppose had instead picked the following direction:

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     

Here, the projections have a significantly smaller variance, and are much closer to the origin. We would like to automatically select the direction u corresponding to the first of the two figures shown above. To formalize this, note that given a

unit vector u and a point x , the length of the projection of x onto u is given

T ( i )

by x u . I.e., if x is a point in our dataset (one of the crosses in the plot), then its projection onto u (the corresponding circle in the figure) is distance

T

x u from the origin. Hence, to maximize the variance of the projections, we would like to choose a unit-length u so as to maximize:

∑ n n ( i ) T

∑

T ( i ) ( i ) T

( x u ) =  u x x u n

i =1

n

i

(

=1

∑

n

)

T ( i ) ( i ) T

= u x x u. n

i =1

We easily recognize that the maximizing this subject to ‖ u ‖ = 1 gives the ∑ n ( i ) ( i ) T

principal eigenvector of Σ =

n i =1

x x , which is just the empirical covariance matrix of the data (assuming it has zero mean). To summarize, we have found that if we wish to find a 1-dimensional subspace with with to approximate the data, we should choose u to be the principal eigenvector of Σ. More generally, if we wish to project our data into a k -dimensional subspace ( k < d ), we should choose u , . . . , u k to be the top k eigenvectors of Σ. The u i ’s now form a new, orthogonal basis for the data.

( i )

Then, to represent x in this basis, we need only compute the corre- sponding vector  

T ( i )

u x  T ( i ) ( i )  u x   k

y =  .   . ∈ R . . 

T ( i )

u k

x

( i ) d ( i )

Thus, whereas x ∈ R , the vector y now gives a lower, k -dimensional,

( i )

approximation/representation for x . PCA is therefore also referred to as a dimensionality reduction algorithm. The vectors u , . . . , u k are called the first k principal components of the data.

Remark. Although we have shown it formally only for the case of k = 1, using well-known properties of eigenvectors it is straightforward to show that

If you haven’t seen this before, try using the method of Lagrange multipliers to max-

T T

imize u Σ u subject to that u u = 1. You should be able to show that Σ u = λu , for some λ , which implies u is an eigenvector of Σ, with eigenvalue λ . Because Σ is symmetric, the u i ’s will (or always can be chosen to be) orthogonal to each other.

of all possible orthogonal bases ∑ u , . . . , u k , the one that we have chosen max-

( i )

imizes i

‖ y ‖ . Thus, our choice of a basis preserves as much variability as possible in the original data.

PCA can also be derived by picking the basis that minimizes the ap- proximation error arising from projecting the data onto the k -dimensional subspace spanned by them. (See more in homework.) PCA has many applications; we will close our discussion with a few exam-

( i ) ( i )

ples. First, compression—representing x ’s with lower dimension y ’s—is an obvious application. If we reduce high dimensional data to k = 2 or 3 di-

( i )

mensions, then we can also plot the y ’s to visualize the data. For instance, if we were to reduce our automobiles data to 2 dimensions, then we can plot it (one point in our plot would correspond to one car type, say) to see what cars are similar to each other and what groups of cars may cluster together. Another standard application is to preprocess a dataset to reduce its dimension before running a supervised learning learning algorithm with the

( i )

x ’s as inputs. Apart from computational benefits, reducing the data’s dimension can also reduce the complexity of the hypothesis class considered and help avoid overfitting (e.g., linear classifiers over lower dimensional input spaces will have smaller VC dimension). Lastly, as in our RC pilot example, we can also view PCA as a noise reduction algorithm. In our example it, estimates the intrinsic “piloting karma” from the noisy measures of piloting skill and enjoyment. In class, we also saw the application of this idea to face images, resulting in eigenfaces

( i ) ×

method. Here, each point x ∈ R was a 10000 dimensional vector, with each coordinate corresponding to a pixel intensity value in a 100x100

( i )

image of a face. Using PCA, we represent each image x with a much lower-

( i )

dimensional y . In doing so, we hope that the principal components we found retain the interesting, systematic variations between faces that capture what a person really looks like, but not the “noise” in the images introduced by minor lighting variations, slightly different imaging conditions, and so on. We then measure distances between faces i and j by working in the reduced

( i ) ( j )

dimension, and computing ‖ y − y ‖ . This resulted in a surprisingly good face-matching and retrieval algorithm.

# Chapter 13

# Independent components analysis

Our next topic is Independent Components Analysis (ICA). Similar to PCA, this will find a new basis in which to represent our data. However, the goal is very different. As a motivating example, consider the “cocktail party problem.” Here, d speakers are speaking simultaneously at a party, and any microphone placed in the room records only an overlapping combination of the d speakers’ voices. But lets say we have d different microphones placed in the room, and because each microphone is a different distance from each of the speakers, it records a different combination of the speakers’ voices. Using these microphone record- ings, can we separate out the original d speakers’ speech signals?

d

To formalize this problem, we imagine that there is some data s ∈ R that is generated via d independent sources. What we observe is

x = As,

where A is an unknown square matrix called the mixing matrix . Repeated

( i )

observations gives us a dataset { x ; i = 1 , . . . , n } , and our goal is to recover

( i ) ( i ) ( i )

the sources s that had generated our data ( x = As ).

( i ) ( i )

In our cocktail party problem, s is an d -dimensional vector, and s j

is

( i )

the sound that speaker j was uttering at time i . Also, x in an d -dimensional

( i )

vector, and x j

is the acoustic reading recorded by microphone j at time i .

−

Let W = A be the unmixing matrix. Our goal is to find W , so

( i )

that given our microphone recordings x , we can recover the sources by

( i ) ( i ) T

computing s = W x . For notational convenience, we also let w i

denote

the i -th row of W , so that  

T

- w —  W = .  .  .  .

T

- w d

- 

d ( i ) T ( i )

Thus, w i ∈ R , and the j -th source can be recovered as s j

= w j

x .

##### 13.1 ICA ambiguities

−

To what degree can W = A be recovered? If we have no prior knowledge about the sources and the mixing matrix, it is easy to see that there are some

( i )

inherent ambiguities in A that are impossible to recover, given only the x ’s. Specifically, let P be any d -by- d permutation matrix. This means that each row and each column of P has exactly one “1.” Here are some examples of permutation matrices:   [ ] [ ] P =   ; P = ; P = .

If z is a vector, then P z is another vector that contains a permuted version

( i )

of z ’s coordinates. Given only the x ’s, there will be no way to distinguish between W and P W . Specifically, the permutation of the original sources is ambiguous, which should be no surprise. Fortunately, this does not matter for most applications. Further, there is no way to recover the correct scaling of the w i ’s. For in-

( i ) ( i )

stance, if A were replaced with 2 A , and every s were replaced with (0 . 5) s ,

( i ) ( i )

then our observed x = 2 A · (0 . 5) s would still be the same. More broadly, if a single column of A were scaled by a factor of α , and the corresponding source were scaled by a factor of 1 /α , then there is again no way to determine

( i )

that this had happened given only the x ’s. Thus, we cannot recover the “correct” scaling of the sources. However, for the applications that we are concerned with—including the cocktail party problem—this ambiguity also

( i )

does not matter. Specifically, scaling a speaker’s speech signal s j

by some positive factor α affects only the volume of that speaker’s speech. Also, sign

( i ) ( i )

changes do not matter, and s j

and − s j

sound identical when played on a speaker. Thus, if the w i found by an algorithm is scaled by any non-zero real

T

number, the corresponding recovered source s i = w i

x will be scaled by the

same factor; but this usually does not matter. (These comments also apply to ICA for the brain/MEG data that we talked about in class.) Are these the only sources of ambiguity in ICA? It turns out that they are, so long as the sources s i are non-Gaussian . To see what the difficulty is with Gaussian data, consider an example in which n = 2, and s ∼ N (0 , I ). Here, I is the 2x2 identity matrix. Note that the contours of the density of the standard normal distribution N (0 , I ) are circles centered on the origin, and the density is rotationally symmetric. Now, suppose we observe some x = As , where A is our mixing matrix.

T

Then, the distribution of x will be Gaussian, x ∼ N (0 , AA ), since

E s ∼N (0 ,I ) [ x ] = E[ As ] = A E[ s ] = 0

T T T T T T T

Cov[ x ] = E s ∼N (0 ,I ) [ xx ] = E[ Ass A ] = A E[ ss ] A = A · Cov[ s ] · A = AA

Now, let R be an arbitrary orthogonal (less formally, a rotation/reflection)

T T ′

matrix, so that RR = R R = I , and let A = AR . Then if the data had

′

been mixed according to A instead of A , we would have instead observed

′ ′ ′ ′ T

x = A s . The distribution of x is also Gaussian, x ∼ N (0 , AA ), since

′ ′ T ′ T ′ T T T T T T

E s ∼N (0 ,I ) [ x ( x ) ] = E[ A ss ( A ) ] = E[ ARss ( AR ) ] = ARR A = AA .

′

Hence, whether the mixing matrix is A or A , we would observe data from

T

a N (0 , AA ) distribution. Thus, there is no way to tell if the sources were

′

mixed using A and A . There is an arbitrary rotational component in the mixing matrix that cannot be determined from the data, and we cannot recover the original sources. Our argument above was based on the fact that the multivariate standard normal distribution is rotationally symmetric. Despite the bleak picture that this paints for ICA on Gaussian data, it turns out that, so long as the data is not Gaussian, it is possible, given enough data, to recover the d independent sources.

##### 13.2 Densities and linear transformations

Before moving on to derive the ICA algorithm proper, we first digress briefly to talk about the effect of linear transformations on densities. Suppose a random variable s is drawn according to some density p s ( s ). For simplicity, assume for now that s ∈ R is a real number. Now, let the random variable x be defined according to x = As (here, x ∈ R , A ∈ R ). Let p x be the density of x . What is p x ?

−

Let W = A . To calculate the “probability” of a particular value of x , it is tempting to compute s = W x , then then evaluate p s at that point, and

conclude that “ p x ( x ) = p s ( W x ).” However, this is incorrect . For example, let s ∼ Uniform[0 , 1], so p s ( s ) = 1 { ≤ s ≤ } . Now, let A = 2, so x = 2 s . Clearly, x is distributed uniformly in the interval [0 , 2]. Thus, its density is given by p x ( x ) = (0 . 5)1 { ≤ x ≤ } . This does not equal p s ( W x ), where

−

W = 0 . 5 = A . Instead, the correct formula is p x ( x ) = p s ( W x ) | W | . More generally, if s is a vector-valued distribution with density p s , and x = As for a square, invertible matrix A , then the density of x is given by

p x ( x ) = p s ( W x ) · | W | ,

−

where W = A .

d

Remark. If you’re seen the result that A maps [0 , 1] to a set of volume | A | , then here’s another way to remember the formula for p x given above, that also

d × d

generalizes our previous 1-dimensional example. Specifically, let A ∈ R be

− d

given, and let W = A as usual. Also let C = [0 , 1] be the d -dimensional

d

hypercube, and define C = { As : s ∈ C } ⊆ R to be the image of C under the mapping given by A . Then it is a standard result in linear algebra (and, indeed, one of the ways of defining determinants) that the volume of

d

C is given by | A | . Now, suppose s is uniformly distributed in [0 , 1] , so its density is p s ( s ) = 1 { s ∈ C } . Then clearly x will be uniformly distributed in C . Its density is therefore found to be p x ( x ) = 1 { x ∈ C } / vol( C ) (since it must integrate over C to 1). But using the fact that the determinant of the inverse of a matrix is just the inverse of the determinant, we have

−

/ vol( C ) = 1 / | A | = | A | = | W | . Thus, p x ( x ) = 1 { x ∈ C }| W | = 1 { W x ∈ C }| W | = p s ( W x ) | W | .

##### 13.3 ICA algorithm

We are now ready to derive an ICA algorithm. We describe an algorithm by Bell and Sejnowski, and we give an interpretation of their algorithm as a method for maximum likelihood estimation. (This is different from their orig- inal interpretation involving a complicated idea called the infomax principal which is no longer necessary given the modern understanding of ICA.) We suppose that the distribution of each source s j is given by a density p s , and that the joint distribution of the sources s is given by

∏

d

p ( s ) = p s ( s j ) .

j =1

Note that by modeling the joint distribution as a product of marginals, we capture the assumption that the sources are independent. Using our formulas from the previous section, this implies the following density on x = As =

−

W s : ∏

d T

p ( x ) = p s ( w j

x ) · | W | .

j =1

All that remains is to specify a density for the individual sources p s . Recall that, given a real-valued random variable z , its cumulative distri- ∫ z

bution function (cdf) F is defined by F ( z ) = P ( z ≤ z ) =

−∞

p z ( z ) dz and

′

the density is the derivative of the cdf: p z ( z ) = F ( z ). Thus, to specify a density for the s i ’s, all we need to do is to specify some cdf for it. A cdf has to be a monotonic function that increases from zero to one. Following our previous discussion, we cannot choose the Gaussian cdf, as ICA doesn’t work on Gaussian data. What we’ll choose instead as a reasonable “default” cdf that slowly increases from 0 to 1, is the sigmoid

− s ′

function g ( s ) = 1 / (1 + e ). Hence, p s ( s ) = g ( s ). The square matrix W is the parameter in our model. Given a training

( i )

set { x ; i = 1 , . . . , n } , the log likelihood is given by ( ∑ n

∑ d

)

′ T ( i )

` ( W ) = log g ( w j

x ) + log | W | .

i =1 j =1

We would like to maximize this in terms W . By taking derivatives and using

− T

the fact (from the first set of notes) that ∇ W | W | = | W | ( W ) , we easily

( i )

derive a stochastic gradient ascent learning rule. For a training example x , the update rule is:    

T ( i )

− g ( w x )   T ( i )

  − g ( w x )    ( i ) T T −  W := W + α   . .  x + ( W )  ,   .  

T ( i )

− g ( w d

x )

If you have prior knowledge that the sources’ densities take a certain form, then it is a good idea to substitute that in here. But in the absence of such knowledge, the sigmoid function can be thought of as a reasonable default that seems to work well for

( i )

many problems. Also, the presentation here assumes that either the data x has been preprocessed to have zero mean, or that it can naturally be expected to have zero mean

′

(such as acoustic signals). This is necessary because our assumption that p s ( s ) = g ( s ) implies E[ s ] = 0 (the derivative of the logistic function is a symmetric function, and hence gives a density corresponding to a random variable with zero mean), which implies E[ x ] = E[ As ] = 0.

where α is the learning rate.

( i ) ( i )

After the algorithm converges, we then compute s = W x to recover the original sources.

Remark. When writing down the likelihood of the data, we implicitly as-

( i )

sumed that the x ’s were independent of each other (for different values of i ; note this issue is different from whether the different coordinates of

( i )

x ∏ are independent), so that the likelihood of the training set was given

( i )

by i

p ( x ; W ). This assumption is clearly incorrect for speech data and

( i )

other time series where the x ’s are dependent, but it can be shown that having correlated training examples will not hurt the performance of the al- gorithm if we have sufficient data. However, for problems where successive training examples are correlated, when implementing stochastic gradient as- cent, it sometimes helps accelerate convergence if we visit training examples in a randomly permuted order. (I.e., run stochastic gradient ascent on a randomly shuffled copy of the training set.)

# Chapter 14

# Self-supervised learning and foundation models

Despite its huge success, supervised learning with neural networks typically relies on the availability of a labeled dataset of decent size, which is some- times costly to collect. Recently, AI and machine learning are undergoing a paradigm shift with the rise of models (e.g., BERT [Devlin et al., 2019] and GPT-3 [Brown et al., 2020]) that are pre-trained on broad data at scale and are adaptable to a wide range of downstream tasks. These models, called foundation models by Bommasani et al. [2021], oftentimes leverage massive unlabeled data so that much fewer labeled data in the downstream tasks are needed. Moreover, though foundation models are based on standard deep learning and transfer learning, their scale results in new emergent capabil- ities. These models are typically (pre-)trained by self-supervised learning methods where the supervisions/labels come from parts of the inputs. This chapter will introduce the paradigm of foundation models and basic related concepts.

##### 14.1 Pretraining and adaptation

The foundation models paradigm consists of two phases: pretraining (or sim- ply training) and adaptation. We first pretrain a large model on a massive unlabeled dataset (e.g., billions of unlabeled images). Then, we adapt the pretrained model to a downstream task (e.g., detecting cancer from scan im- ages). These downstream tasks are often prediction tasks with limited or

Sometimes, pretraining can involve large-scale labeled datasets as well (e.g., the Ima- geNet dataset).

even no labeled data. The intuition is that the pretrained models learn good representations that capture intrinsic semantic structure/ information about the data, and the adaptation phase customizes the model to a particular downstream task by, e.g., retrieving the information specific to it. For ex- ample, a model pretrained on massive unlabeled image data may learn good general visual representations/features, and we adapt the representations to solve biomedical imagining tasks. We formalize the two phases below.

Pretraining. Suppose we have an unlabeled pretraining dataset

(1) (2) ( n ) d

{ x , x · · · , x } that consists of n examples in R . Let φ θ be a model that is parameterized by θ and maps the input x to some m -dimensional represen-

m

tation φ θ ( x ). (People also call φ θ ( x ) ∈ R the embedding or features of the example x .) We pretrain the model θ with a pretraining loss, which is often ∑ n ( i )

an average of loss functions on all the examples: L pre ( θ ) =

n i =1

` pre ( θ, x ).

( i )

Here ` pre is a so-called self-supervised loss on a single datapoint x , because as shown later, e.g., in Section 14.3, the “supervision” comes from the data

( i )

point x itself. It is also possible that the pretraining loss is not a sum of losses on individual examples. We will discuss two pretraining losses in Section 14.2 and Section 14.3. We use some optimizers (mostly likely SGD or ADAM [Kingma and Ba, 2014]) to minimize L pre ( θ ). We denote the obtained pretrained model by  θ ˆ .

Adaptation. For a downstream task, we usually have a labeled dataset

(1) (1) ( n task ) ( n task )

{ ( x task

, y task

) , · · · , ( x task

, y task

) } with n task examples. The setting when n task = 0 is called zero-shot learning—the downstream task doesn’t have any labeled examples. When n task is relatively small (say, between 1 and 50), the setting is called few-shot learning. It’s also pretty common to have a larger n task on the order of ranging from hundreds to tens of thousands. An adaptation algorithm generally takes in a downstream dataset and the pretrained model  θ ˆ , and outputs a variant of  θ ˆ that solves the downstream task. We will discuss below two popular and general adaptation methods, linear probe and finetuning. In addition, two other methods specific to lan- guage problems are introduced in 14.3.1. The linear probe approach uses a linear head on top of the representation to predict the downstream labels. Mathematically, the adapted model out-

> m

puts w φ θ ˆ ( x ), where w ∈ R is a parameter to be learned, and  θ ˆ is exactly the pretrained model (fixed). We can use SGD (or other optimizers) to train

w on the downstream task loss to predict the task label

n

∑ task

( i ) > ( i )

min ` task ( y task

, w φ

w ∈ R m θ ˆ ( x task

)) (14.1) n task i =1

E.g., if the downstream task is a regression problem, we will have

> >

` task ( y task , w φ θ ˆ ( x task )) = ( y task − w φ θ ˆ ( x task )) . The finetuning algorithm uses a similar structure for the downstream prediction model, but also further finetunes the pretrained model (instead

>

of keeping it fixed). Concretely, the prediction model is w φ θ ( x ) with pa- rameters w and θ. We optimize both w and θ to fit the downstream data, but initialize θ with the pretrained model  θ ˆ . The linear head w is usually initialized randomly.

n

∑ task

( i ) > ( i )

minimize ` task ( y task

, w φ θ ( x task

)) (14.2)

w,θ n task i =1

with initialization w ← random vector (14.3)

θ ← θ ˆ (14.4)

Various other adaptation methods exists and are sometimes specialized to the particular pretraining methods. We will discuss one of them in Sec- tion 14.3.1.

##### 14.2 Pretraining methods in computer vision

This section introduces two concrete pretraining methods for computer vi- sion: supervised pretraining and contrastive learning.

Supervised pretraining. Here, the pretraining dataset is a large-scale labeled dataset (e.g., ImageNet), and the pretrained models are simply a neural network trained with vanilla supervised learning (with the last layer being removed). Concretely, suppose we write the learned neural network as U φ θ ˆ ( x ), where U is the last (fully-connected) layer parameters,  θ ˆ corresponds to the parameters of all the other layers, and φ θ ˆ ( x ) are the penultimate activations layer (which serves as the representation). We simply discard U and use φ θ ˆ ( x ) as the pretrained model.

Contrastive learning. Contrastive learning is a self-supervised pretraining method that uses only unlabeled data. The main intuition is that a good representation function φ θ ( · ) should map semantically similar images to sim- ilar representations, and that random pair of images should generally have

distinct representations. E.g., we may want to map images of two huskies to similar representations, but a husky and an elephant should have different representations. One definition of similarity is that images from the same class are similar. Using this definition will result in the so-called supervised contrastive algorithms that work well when labeled pretraining datasets are available. Without labeled data, we can use data augmentation to generate a pair of “similar” augmented images given an original image x . Data augmenta- tion typically means that we apply random cropping, flipping, and/or color transformation on the original image x to generate a variant. We can take two random augmentations, denoted by ˆ x and ˜ x , of the same original image x , and call them a positive pair. We observe that positive pairs of images are often semantically related because they are augmentations of the same image. We will design a loss function for θ such that the representations of a positive pair, φ θ (ˆ x ) , φ θ (˜ x ), as close to each other as possible. On the other hand, we can also take another random image z from the pretraining dataset and generate an augmentation ˆ z from z . Note that (ˆ x, z ˆ ) are from different images; therefore, with a good chance, they are not seman- tically related. We call (ˆ x, z ˆ ) a negative or random pair. We will design a loss to push the representation of random pairs, φ θ (ˆ x ) , φ θ (ˆ z ), far away from each other. There are many recent algorithms based on the contrastive learning prin- ciple, and here we introduce SIMCLR [Chen et al., 2020] as an concrete

( B )

example. The loss function is defined on a batch of examples ( x , · · · , x ) with batch size B . The algorithm computes two random augmentations for

( i ) ( i ) ( i )

each example x in the batch, denoted by ˆ x and ˜ x . As a result, we

( B ) ( B )

have the augmented batch of 2 B examples: ˆ x , · · · , x ˆ , ˜ x , · · · , x ˜ . The SIMCLR loss is defined as ( ∑ B ( i ) > ( i )

) exp φ θ (ˆ x ) φ θ (˜ x ) L pre ( θ ) = − log

i =1

exp ( φ θ (ˆ x ( i )

) >

φ θ (˜ x ( i )

∑ )) + ( i ) > j = i

exp ( φ θ (ˆ x ) φ θ (˜ x ( j )

. ))

( i ) > ( j )

The intuition is as follows. The loss is increasing in φ θ (ˆ x ) φ θ (˜ x ), and

( i ) > ( j )

thus minimizing the loss encourages φ θ (ˆ x ) φ θ (˜ x ) to be small, making

( i ) ( j )

φ θ (ˆ x ) far away from φ θ (˜ x ). On the other hand, the loss is decreasing in

Random pair may be a more accurate term because it’s still possible (though not likely) that x and z are semantically related, so are ˆ x and ˆ z . But in the literature, the term negative pair seems to be also common. This is a variant and simplification of the original loss that does not change the essence (but may change the efficiency slightly).

( i ) > ( i ) ( i ) > ( i )

φ θ (ˆ x ) φ θ (˜ x ), and thus minimizing the loss encourages φ θ (ˆ x ) φ θ (˜ x )

( i ) ( i )

to be large, resulting in φ θ (ˆ x ) and φ θ (˜ x ) to be close.

##### 14.3 Pretrained large language models

Natural language processing is another area where pretraining models are particularly successful. In language problems, an examples typically cor- responds to a document or generally a sequence/trunk of words, denoted by x = ( x , · · · , x T ) where T is the length of the document/sequence, x i ∈ { , · · · , V } are words in the document, and V is the vocabulary size. A language model is a probabilistic model representing the probability of a document, denoted by p ( x , · · · , x T ) . This probability distribution is very

T

complex because its support size is V — exponential in the length of the document. Instead of modeling the distribution of a document itself, we can apply the chain rule of conditional probability to decompose it as follows:

p ( x , · · · , x T ) = p ( x ) p ( x | x ) · · · p ( x T | x , · · · , x T − ) . (14.5)

Now the support of each of the conditional probability p ( x t | x , · · · , x t − ) is V . We will model the conditional probability p ( x t | x , · · · , x t − ) with some parameterized form. To this end, we first turn the discrete words into word embeddings.

d

Let e i ∈ R be the embedding of the word i ∈ { , , · · · , V } . We call

d × V

[ e , · · · , e V ] ∈ R the embedding matrix. The most commonly used model is transformer [Vaswani et al., 2017]. We will introduce the basic concepts regarding the inputs and outputs of a transformer, but treat the interme- diate computation in transformer as a blackbox. We refer the students to more advanced courses or the original paper for more details. The high-level pipeline is visualized in Figure 14.1. Given a document ( x , · · · , x T ), we first compute the corresponding word embeddings ( e x , · · · , e x T

). Then, the word embeddings is passed to a transformer model, which takes in a sequence of

p

To see this, you can verify that the function − log

p + q

is decreasing in p , and increasing in q when p, q > . In the practical implementations, typically all the data are concatenated into a single sequence in some order, and each example typically corresponds a sub-sequence of consec- utive words which may corresponds to a subset of a document or may span across multiple documents. Technically, words may be decomposed into tokens which could be words or sub-words (combinations of letters), but this note omits this technicality. In fact most commons words are a single token themselves.

vectors and outputs a sequence of vectors ( c , · · · , c T +1 ) . In particular, here we use the autoregressive version of the transformers which makes sure that c t only depends on x , · · · , x t − . The c t ’s are often called the representations or the contextualized embeddings, and we write c t = φ θ ( x , . . . , x t − ) where φ θ denotes the mapping from the input to the representations.

Figure 14.1: The input-output interface of a transformer.

To learn the parameters θ in the transformer, we use c t to predict the conditional probability p ( x t | x , · · · , x t − ). We parameterize p ( x t | x , · · · , x t − ) by   p ( x t = 1 | x · · · , x t − )   p ( x t = 2 | x · · · , x t − )   V

 . .  = softmax( W t c t ) ∈ R (14.6)  .  p ( x t = V | x · · · , x t − )

= softmax( W t φ θ ( x , · · · , x t − )) , (14.7)

V × d

where W ∈ R is a weight matrix that maps the contextualized embedding c t to the logits. In other words, W t is an additional linear layer for the

V V

prediction of the conditional probability. Recall that softmax( · ) : R → R maps the logits to the probabilities: 

exp( u )



∑

V

exp( u i

 i =1

)

.  softmax( u ) =  .  .   (14.8)

exp( u V ) ∑

V i =1

exp( u i )

This property no longer holds in masked language models [Devlin et al., 2019] where the losses are also different. Here t ≥ 2 and we omit the loss for predicting p ( x ) for simplicity (which also doesn’t affect the performance much). To formally model p ( x ), an option is to prepend a special token x = ⊥ to the sequence, and then ask the language model to predict p ( x | x = ⊥ ).

We train all the parameters θ in the transformers as well as the parameters W = ( W , . . . , W T ) by the cross entropy loss. Let p t =

V

softmax( W t φ θ ( x , · · · , x t − )) ∈ R be the predicted conditional probability at position t . Let W be the concatenation of W , · · · , W T . The loss function is often called language modeling loss and defined as

∑

T

L ( W, θ ) = (cross entropy loss at position t )

t =2

∑

T

= − log p t,x t

, (14.9)

t =2

where p t,j denotes the j -th entry of the probability vector p t .

###### 14.3.1 Zero-shot learning and in-context learning

For language models, there are many ways to adapt a pretrained model to downstream tasks. In this notes, we discuss three of them: finetuning, zero- shot learning, and in-context learning.

Finetuning is not very common for the autoregressive language models that we introduced in Section 14.3 but much more common for other variants such as masked language models which has similar input-output interfaces but are pretrained differently [Devlin et al., 2019]. The finetuning method is the same as introduced generally in Section 14.1—the only question is how we define the prediction task with an additional linear head. One option

>

is to treat c T +1 = φ θ ( x , · · · , x T ) as the representation and use w c T +1 =

>

w φ θ ( x , · · · , x T ) to predict task label. As described in Section 14.1, we initialize θ to the pretrained model  θ ˆ and then optimize both w and θ .

Zero-shot adaptation or zero-shot learning is the setting where there is no input-output pairs from the downstream tasks. For language problems tasks, typically the task is formatted as a question or a cloze test form via natural language. For example, we can format an example as a question:

x task = ( x task , , · · · , x task ,T ) = “Is the speed of light a universal constant?”

Then, we compute the most likely next word predicted by the lan- guage model given this question, that is, computing argmax x T +1

p ( x T +1 | x task , , · · · , x task ,T ). In this case, if the most likely next word x T +1 is “No”, then we solve the task. (The speed of light is only a constant in vacuum). We note that there are many ways to decode the answer from the language

models, e.g., instead of computing the argmax, we may use the language model to generate a few words word. It is an active research question to find the best way to utilize the language models.

In-context learning is mostly used for few-shot settings where we have a

(1) (1) ( n task ) ( n task )

few labeled examples ( x task

, y task

) , · · · , ( x task

, y task

). Given a test example x test , we construct a document ( x , · · · , x T ), which is more commonly called a “prompt” in this context, by concatenating the labeled examples and the text example in some format. For example, we may construct the prompt as follows

(1)

x , · · · , x T = “Q: 2 ∼ 3 = ? x

task (1)

A: 5 y

task (2)

Q: 6 ∼ 7 = ? x

task (2)

A: 13 y

task

- · ·

Q: 15 ∼ 2 = ?” x test

Then, we let the pretrained model generate the most likely x T +1 , x T +2 , · · · . In this case, if the model can “learn” that the symbol ∼ means addition from the few examples, we will obtain the following which suggests the answer is 17.

x T +1 , x T +2 , · · · = “A: 17” .

The area of foundation models is very new and quickly growing. The notes here only attempt to introduce these models on a conceptual level with a significant amount of simplification. We refer the readers to other materials, e.g., Bommasani et al. [2021], for more details.

# Part V

# Reinforcement Learning and Control

# Chapter 15

# Reinforcement learning

We now begin our study of reinforcement learning and adaptive control. In supervised learning, we saw algorithms that tried to make their outputs mimic the labels y given in the training set. In that setting, the labels gave an unambiguous “right answer” for each of the inputs x . In contrast, for many sequential decision making and control problems, it is very difficult to provide this type of explicit supervision to a learning algorithm. For example, if we have just built a four-legged robot and are trying to program it to walk, then initially we have no idea what the “correct” actions to take are to make it walk, and so do not know how to provide explicit supervision for a learning algorithm to try to mimic. In the reinforcement learning framework, we will instead provide our al- gorithms only a reward function, which indicates to the learning agent when it is doing well, and when it is doing poorly. In the four-legged walking ex- ample, the reward function might give the robot positive rewards for moving forwards, and negative rewards for either moving backwards or falling over. It will then be the learning algorithm’s job to figure out how to choose actions over time so as to obtain large rewards. Reinforcement learning has been successful in applications as diverse as autonomous helicopter flight, robot legged locomotion, cell-phone network routing, marketing strategy selection, factory control, and efficient web-page indexing. Our study of reinforcement learning will begin with a definition of the Markov decision processes (MDP) , which provides the formalism in which RL problems are usually posed.

##### 15.1 Markov decision processes

A Markov decision process is a tuple ( S, A, { P sa } , γ, R ), where:

- S is a set of states . (For example, in autonomous helicopter flight, S might be the set of all possible positions and orientations of the heli- copter.)

- A is a set of actions . (For example, the set of all possible directions in which you can push the helicopter’s control sticks.)

- P sa are the state transition probabilities. For each state s ∈ S and action a ∈ A , P sa is a distribution over the state space. We’ll say more about this later, but briefly, P sa gives the distribution over what states we will transition to if we take action a in state s .

- γ ∈ [0 , 1) is called the discount factor .

- R : S × A → R is the reward function . (Rewards are sometimes also written as a function of a state S only, in which case we would have R : S → R ).

The dynamics of an MDP proceeds as follows: We start in some state s , and get to choose some action a ∈ A to take in the MDP. As a result of our choice, the state of the MDP randomly transitions to some successor state s , drawn according to s ∼ P s a . Then, we get to pick another action a . As a result of this action, the state transitions again, now to some s ∼ P s a . We then pick a , and so on. . . . Pictorially, we can represent this process as follows:

a a a a

s −→ s −→ s −→ s −→ . . .

Upon visiting the sequence of states s , s , . . . with actions a , a , . . . , our total payoff is given by

R ( s , a ) + γR ( s , a ) + γ R ( s , a ) + · · · .

Or, when we are writing rewards as a function of the states only, this becomes

R ( s ) + γR ( s ) + γ R ( s ) + · · · .

For most of our development, we will use the simpler state-rewards R ( s ), though the generalization to state-action rewards R ( s, a ) offers no special difficulties.

Our goal in reinforcement learning is to choose actions over time so as to maximize the expected value of the total payoff: [ ] E R ( s ) + γR ( s ) + γ R ( s ) + · · ·

t

Note that the reward at timestep t is discounted by a factor of γ . Thus, to make this expectation large, we would like to accrue positive rewards as soon as possible (and postpone negative rewards as long as possible). In economic applications where R ( · ) is the amount of money made, γ also has a natural interpretation in terms of the interest rate (where a dollar today is worth more than a dollar tomorrow). A policy is any function π : S → A mapping from the states to the actions. We say that we are executing some policy π if, whenever we are in state s , we take action a = π ( s ). We also define the value function for a policy π according to

π

[ ∣ V ( s ) = E R ( s ) + γR ( s ) + γ R ( s ) + · · · ∣ s = s, π ] .

π

V ( s ) is simply the expected sum of discounted rewards upon starting in state s , and taking actions according to π .

π

Given a fixed policy π , its value function V satisfies the Bellman equa- tions : ∑

π ′ π ′

V ( s ) = R ( s ) + γ P sπ ( s ) ( s ) V ( s ) .

s ′

∈ S

π

This says that the expected sum of discounted rewards V ( s ) for starting in s consists of two terms: First, the immediate reward R ( s ) that we get right away simply for starting in state s , and second, the expected sum of future discounted rewards. Examining the second term in more detail, we

′

see that the summation term above can be rewritten E s ′

π ∼ P sπ ( s )

[ V ( s )]. This

′ ′

is the expected sum of discounted rewards for starting in state s , where s is distributed according P sπ ( s ) , which is the distribution over where we will end up after taking the first action π ( s ) in the MDP from state s . Thus, the second term above gives the expected sum of discounted rewards obtained after the first step in the MDP.

π

Bellman’s equations can be used to efficiently solve for V . Specifically, in a finite-state MDP ( | S | < ∞ ), we can write down one such equation for

π

V ( s ) for every state s . This gives us a set of | S | linear equations in | S |

π

variables (the unknown V ( s )’s, one for each state), which can be efficiently

π

solved for the V ( s )’s.

This notation in which we condition on π isn’t technically correct because π isn’t a random variable, but this is quite standard in the literature.

We also define the optimal value function according to

∗ π

V ( s ) = max V ( s ) . (15.1)

π

In other words, this is the best possible expected sum of discounted rewards that can be attained using any policy. There is also a version of Bellman’s equations for the optimal value function: ∑

∗ ′ ∗ ′

V ( s ) = R ( s ) + max γ P sa ( s ) V ( s ) . (15.2)

a ∈ A s ′

∈ S

The first term above is the immediate reward as before. The second term is the maximum over all actions a of the expected future sum of discounted rewards we’ll get upon after action a . You should make sure you understand this equation and see why it makes sense.

∗

We also define a policy π : S → A as follows: ∑

∗ ′ ∗ ′

π ( s ) = arg max P sa ( s ) V ( s ) . (15.3)

a ∈ A s ′

∈ S

∗

Note that π ( s ) gives the action a that attains the maximum in the “max” in Equation (15.2). It is a fact that for every state s and every policy π , we have

∗ π

∗

π

V ( s ) = V ( s ) ≥ V ( s ) .

π

∗

∗

The first equality says that the V , the value function for π , is equal to the

∗

optimal value function V for every state s . Further, the inequality above

∗

says that π ’s value is at least a large as the value of any other other policy.

∗

In other words, π as defined in Equation (15.3) is the optimal policy.

∗

| Note that  | π   | has the interesting property that it is the optimal policy    |
| ---------- | --- | ------------------------------------------------------------- |
| some state | s   | then there’d be some optimal policy for that state, and if we |

′

were starting in some other state s then there’d be some other policy that’s

′ ∗

optimal policy for s . The same policy π attains the maximum in Equa-

∗

tion (15.1) for all states s . This means that we can use the same policy π no matter what the initial state of our MDP is.

##### 15.2 Value iteration and policy iteration

We now describe two efficient algorithms for solving finite-state MDPs. For now, we will consider only MDPs with finite state and action spaces ( | S | <

∞ , | A | < ∞ ). In this section, we will also assume that we know the state transition probabilities { P sa } and the reward function R . The first algorithm, value iteration , is as follows:

Algorithm 6 Value Iteration

1: For each state s , initialize V ( s ) := 0.

2: for until convergence do

3: For every state, update ∑

′ ′

V ( s ) := R ( s ) + max γ P sa ( s ) V ( s ) . (15.4)

a ∈ A s ′

This algorithm can be thought of as repeatedly trying to update the estimated value function using Bellman Equations (15.2). There are two possible ways of performing the updates in the inner loop of the algorithm. In the first, we can first compute the new values for V ( s ) for every state s , and then overwrite all the old values with the new values. This is called a synchronous update. In this case, the algorithm can be viewed as implementing a “Bellman backup operator” that takes a current estimate of the value function, and maps it to a new estimate. (See homework problem for details.) Alternatively, we can also perform asynchronous updates. Here, we would loop over the states (in some order), updating the values one at a time. Under either synchronous or asynchronous updates, it can be shown that

∗ ∗

value iteration will cause V to converge to V . Having found V , we can then use Equation (15.3) to find the optimal policy. Apart from value iteration, there is a second standard algorithm for find- ing an optimal policy for an MDP. The policy iteration algorithm proceeds as follows: Thus, the inner-loop repeatedly computes the value function for the cur- rent policy, and then updates the policy using the current value function. (The policy π found in step (b) is also called the policy that is greedy with respect to V .) Note that step (a) can be done via solving Bellman’s equa- tions as described earlier, which in the case of a fixed policy, is just a set of | S | linear equations in | S | variables. After at most a finite number of iterations of this algorithm, V will con-

∗ ∗

verge to V , and π will converge to π .

∗

Note that value iteration cannot reach the exact V in a finite number of iterations,

Algorithm 7 Policy Iteration

1: Initialize π randomly.

2: for until convergence do

π

3: Let V := V . . typically by linear system solver

4: For each state s , let ∑

′ ′

π ( s ) := arg max P sa ( s ) V ( s ) .

a ∈ A s ′

Both value iteration and policy iteration are standard algorithms for solv- ing MDPs, and there isn’t currently universal agreement over which algo- rithm is better. For small MDPs, policy iteration is often very fats and converges with very few iterations. However, for MDPs with large state

π

spaces, solving for V explicitly would involve solving a large system of lin- ear equations, and could be difficult (and note that one has to solve the linear system multiple times in policy iteration). In these problems, value iteration may be preferred. For this reason, in practice value iteration seems to be used more often than policy iteration. For some more discussions on the comparison and connection of value iteration and policy iteration, please see Section 15.5.

##### 15.3 Learning a model for an MDP

So far, we have discussed MDPs and algorithms for MDPs assuming that the state transition probabilities and rewards are known. In many realistic prob- lems, we are not given state transition probabilities and rewards explicitly, but must instead estimate them from data. (Usually, S, A and γ are known.) For example, suppose that, for the inverted pendulum problem (see prob-

whereas policy iteration with an exact linear system solver, can. This is because when the actions space and policy space are discrete and finite, and once the policy reaches the optimal policy in policy iteration, then it will not change at all. On the other hand, even

∗

though value iteration will converge to the V , but there is always some non-zero error in the learned value function.

lem set 4), we had a number of trials in the MDP, that proceeded as follows:

(1) (1) (1) (1)

(1) a (1) a (1) a (1) a

s −→ s −→ s −→ s −→ . . .

(2) (2) (2) (2)

(2) a (2) a (2) a (2) a

s −→ s −→ s −→ s −→ . . . . . .

( j ) ( j )

Here, s i

is the state we were at time i of trial j , and a i

is the cor- responding action that was taken from that state. In practice, each of the trials above might be run until the MDP terminates (such as if the pole falls over in the inverted pendulum problem), or it might be run for some large but finite number of timesteps. Given this “experience” in the MDP consisting of a number of trials, we can then easily derive the maximum likelihood estimates for the state transition probabilities:

′ ′

#times took we action a in state s and got to s P sa ( s ) =  (15.5) #times we took action a in state s

Or, if the ratio above is “0/0”—corresponding to the case of never having

′

taken action a in state s before—the we might simply estimate P sa ( s ) to be / | S | . (I.e., estimate P sa to be the uniform distribution over all states.) Note that, if we gain more experience (observe more trials) in the MDP, there is an efficient way to update our estimated state transition probabilities using the new experience. Specifically, if we keep around the counts for both the numerator and denominator terms of (15.5), then as we observe more trials, we can simply keep accumulating those counts. Computing the ratio of these counts then given our estimate of P sa . Using a similar procedure, if R is unknown, we can also pick our estimate of the expected immediate reward R ( s ) in state s to be the average reward observed in state s . Having learned a model for the MDP, we can then use either value it- eration or policy iteration to solve the MDP using the estimated transition probabilities and rewards. For example, putting together model learning and value iteration, here is one possible algorithm for learning in an MDP with unknown state transition probabilities:

1. Initialize π randomly.

2. Repeat {

(a) Execute π in the MDP for some number of trials.

(b) Using the accumulated experience in the MDP, update our esti- mates for P sa (and R , if applicable).

(c) Apply value iteration with the estimated state transition probabil- ities and rewards to get a new estimated value function V .

(d) Update π to be the greedy policy with respect to V .

}

We note that, for this particular algorithm, there is one simple optimiza- tion that can make it run much more quickly. Specifically, in the inner loop of the algorithm where we apply value iteration, if instead of initializing value iteration with V = 0, we initialize it with the solution found during the pre- vious iteration of our algorithm, then that will provide value iteration with a much better initial starting point and make it converge more quickly.

##### 15.4 Continuous state MDPs

So far, we’ve focused our attention on MDPs with a finite number of states. We now discuss algorithms for MDPs that may have an infinite number of states. For example, for a car, we might represent the state as ( x, y, θ, x, ˙ y, ˙ θ ˙ ), comprising its position ( x, y ); orientation θ ; velocity in the x and y directions x ˙ and ˙ y ; and angular velocity  θ ˙ . Hence, S = R is an infinite set of states, because there is an infinite number of possible positions and orientations for the car. Similarly, the inverted pendulum you saw in PS4 has states ( x, θ, x, ˙ θ ˙ ), where θ is the angle of the pole. And, a helicopter flying in 3d space has states of the form ( x, y, z, φ, θ, ψ, x, ˙ y, ˙ z, ˙ φ, ˙ θ, ˙ ψ ˙ ), where here the roll φ , pitch θ , and yaw ψ angles specify the 3d orientation of the helicopter.

d

In this section, we will consider settings where the state space is S = R , and describe ways for solving such MDPs.

###### 15.4.1 Discretization

Perhaps the simplest way to solve a continuous-state MDP is to discretize the state space, and then to use an algorithm like value iteration or policy iteration, as described previously. For example, if we have 2d states ( s , s ), we can use a grid to discretize the state space:

Technically, θ is an orientation and so the range of θ is better written θ ∈ [ − π, π ) than θ ∈ R ; but for our purposes, this distinction is not important.

[t]

Here, each grid cell represents a separate discrete state s ¯ . We can then approximate the continuous-state MDP via a discrete-state one (  S, A, ¯ { P sa ¯ } , γ, R ), where  S ¯ is the set of discrete states, { P sa ¯ } are our state transition probabilities over the discrete states, and so on. We can then use

∗ ∗

value iteration or policy iteration to solve for the V (¯ s ) and π (¯ s ) in the discrete state MDP (  S, A, ¯ { P sa ¯ } , γ, R ). When our actual system is in some continuous-valued state s ∈ S and we need to pick an action to execute, we

∗

compute the corresponding discretized state ¯ s , and execute action π (¯ s ). This discretization approach can work well for many problems. However,

∗

there are two downsides. First, it uses a fairly naive representation for V

∗

(and π ). Specifically, it assumes that the value function is takes a constant value over each of the discretization intervals (i.e., that the value function is piecewise constant in each of the gridcells). To better understand the limitations of such a representation, consider a supervised learning problem of fitting a function to this dataset:

5.5

4.5

y 3.5

2.5

1.5

[t] x

Clearly, linear regression would do fine on this problem. However, if we instead discretize the x -axis, and then use a representation that is piecewise constant in each of the discretization intervals, then our fit to the data would look like this:

5.5

4.5

y 3.5

2.5

1.5

[t] x

This piecewise constant representation just isn’t a good representation for many smooth functions. It results in little smoothing over the inputs, and no generalization over the different grid cells. Using this sort of representation, we would also need a very fine discretization (very small grid cells) to get a good approximation. A second downside of this representation is called the curse of dimen-

d

sionality . Suppose S = R , and we discretize each of the d dimensions of the

d

state into k values. Then the total number of discrete states we have is k . This grows exponentially quickly in the dimension of the state space d , and thus does not scale well to large problems. For example, with a 10d state, if we discretize each state variable into 100 values, we would have 100 = 10 discrete states, which is far too many to represent even on a modern desktop computer. As a rule of thumb, discretization usually works extremely well for 1d and 2d problems (and has the advantage of being simple and quick to im- plement). Perhaps with a little bit of cleverness and some care in choosing the discretization method, it often works well for problems with up to 4d states. If you’re extremely clever, and somewhat lucky, you may even get it to work for some 6d problems. But it very rarely works for problems any higher dimensional than that.

###### 15.4.2 Value function approximation

We now describe an alternative method for finding policies in continuous-

∗

state MDPs, in which we approximate V directly, without resorting to dis- cretization. This approach, called value function approximation, has been successfully applied to many RL problems.

Using a model or simulator

To develop a value function approximation algorithm, we will assume that we have a model , or simulator , for the MDP. Informally, a simulator is a black-box that takes as input any (continuous-valued) state s t and action a t , and outputs a next-state s t +1 sampled according to the state transition probabilities P s t a t

:

[t]

There are several ways that one can get such a model. One is to use physics simulation. For example, the simulator for the inverted pendulum in PS4 was obtained by using the laws of physics to calculate what position and orientation the cart/pole will be in at time t + 1, given the current state at time t and the action a taken, assuming that we know all the parameters of the system such as the length of the pole, the mass of the pole, and so on. Alternatively, one can also use an off-the-shelf physics simulation software package which takes as input a complete physical description of a mechanical system, the current state s t and action a t , and computes the state s t +1 of the system a small fraction of a second into the future. An alternative way to get a model is to learn one from data collected in the MDP. For example, suppose we execute n trials in which we repeatedly take actions in an MDP, each trial for T timesteps. This can be done picking actions at random, executing some specific policy, or via some other way of

Open Dynamics Engine (http://www.ode.com) is one example of a free/open-source physics simulator that can be used to simulate systems like the inverted pendulum, and that has been a reasonably popular choice among RL researchers.

choosing actions. We would then observe n state sequences like the following:

(1) (1) (1) (1)

(1) a (1) a (1) a a

T − (1)

s −→ s −→ s −→ · · · −→ s T

(2) (2) (2) (2)

(2) a (2) a (2) a a

T − (2)

s −→ s −→ s −→ · · · −→ s T

- · ·

( n ) ( n ) ( n ) ( n )

( n ) a ( n ) a ( n ) a a

T − ( n )

s −→ s −→ s −→ · · · −→ s T

We can then apply a learning algorithm to predict s t +1 as a function of s t

and a t . For example, one may choose to learn a linear model of the form

s t +1 = As t + Ba t , (15.6)

using an algorithm similar to linear regression. Here, the parameters of the model are the matrices A and B , and we can estimate them using the data collected from our n trials, by picking

∑

n

∑

T − ∥ ( )∥ ∥ ( i ) ( i ) ( i ) ∥ arg min ∥ s t +1

− As t

+ Ba t ∥ .

A,B i =1 t =0

We could also potentially use other loss functions for learning the model. For example, it has been found in recent work Luo et al. [2018] that using ‖ · ‖ norm (without the square) may be helpful in certain cases. Having learned A and B , one option is to build a deterministic model, in which given an input s t and a t , the output s t +1 is exactly determined. Specifically, we always compute s t +1 according to Equation (15.6). Alter- natively, we may also build a stochastic model, in which s t +1 is a random function of the inputs, by modeling it as

s t +1 = As t + Ba t +  t ,

where here  t is a noise term, usually modeled as  t ∼ N (0 , Σ). (The covari- ance matrix Σ can also be estimated from data in a straightforward way.) Here, we’ve written the next-state s t +1 as a linear function of the current state and action; but of course, non-linear functions are also possible. Specif- ically, one can learn a model s t +1 = Aφ s ( s t ) + Bφ a ( a t ), where φ s and φ a are some non-linear feature mappings of the states and actions. Alternatively, one can also use non-linear learning algorithms, such as locally weighted lin- ear regression, to learn to estimate s t +1 as a function of s t and a t . These approaches can also be used to build either deterministic or stochastic sim- ulators of an MDP.

Fitted value iteration

We now describe the fitted value iteration algorithm for approximating the value function of a continuous state MDP. In the sequel, we will assume

d

that the problem has a continuous state space S = R , but that the action space A is small and discrete. Recall that in value iteration, we would like to perform the update ∫

′ ′ ′

V ( s ) := R ( s ) + γ max P sa ( s ) V ( s ) ds (15.7)

a s ′

′

= R ( s ) + γ max E s ′

∼ P sa

[ V ( s )] (15.8)

a

(In Section 15.2, we had written the value iteration update with a summation ∑

′ ′

V ( s ) := R ( s ) + γ max a s ′ P sa ( s ) V ( s ) rather than an integral over states; the new notation reflects that we are now working in continuous states rather than discrete states.) The main idea of fitted value iteration is that we are going to approxi-

(1) ( n )

mately carry out this step, over a finite sample of states s , . . . , s . Specif- ically, we will use a supervised learning algorithm—linear regression in our description below—to approximate the value function as a linear or non-linear function of the states:

T

V ( s ) = θ φ ( s ) .

Here, φ is some appropriate feature mapping of the states. For each state s in our finite sample of n states, fitted value iteration

( i )

will first compute a quantity y , which will be our approximation to R ( s ) +

′

γ max a E s ′

∼ P sa

[ V ( s )] (the right hand side of Equation 15.8). Then, it will apply a supervised learning algorithm to try to get V ( s ) close to R ( s ) +

′ (

γ max a E s ′

i ) ∼ P sa

[ V ( s )] (or, in other words, to try to get V ( s ) close to y ). In detail, the algorithm is as follows:

(1) (2) ( n )

1. Randomly sample n states s , s , . . . s ∈ S .

2. Initialize θ := 0.

3. Repeat {

For i = 1 , . . . , n {

In practice, most MDPs have much smaller action spaces than state spaces. E.g., a car has a 6d state space, and a 2d action space (steering and velocity controls); the inverted pendulum has a 4d state space, and a 1d action space; a helicopter has a 12d state space, and a 4d action space. So, discretizing this set of actions is usually less of a problem than discretizing the state space would have been.

For each action a ∈ A {

′ ′

Sample s , . . . , s k

∼ P s ( i )

a

(using a model of the MDP). ∑ k ( i ) ′

Set q ( a ) =

k j =1

R ( s ) + γV ( s j

)

( i )

// Hence, q ( a ) is an estimate of R ( s ) +

′

γ E s ′

∼ P

s ( i ) a

[ V ( s )].

}

( i )

Set y = max a q ( a ).

( i ) ( i )

// Hence, y is an estimate of R ( s ) +

′

γ max a E s ′

∼ P

s ( i ) a

[ V ( s )].

}

// In the original value iteration algorithm (over discrete states)

( i ) ( i )

// we updated the value function according to V ( s ) := y .

( i ) ( i )

// In this algorithm, we want V ( s ) ≈ y , which we’ll achieve

// using supervised learning (linear regression). ∑ n

(

T ( i ) ( i )

) Set θ := arg min θ i =1

θ φ ( s ) − y

}

Above, we had written out fitted value iteration using linear regression

( i ) ( i )

as the algorithm to try to make V ( s ) close to y . That step of the algo- rithm is completely analogous to a standard supervised learning (regression)

(1) (1) (2) (2) ( n ) ( n )

problem in which we have a training set ( x , y ) , ( x , y ) , . . . , ( x , y ), and want to learn a function mapping from x to y ; the only difference is that here s plays the role of x . Even though our description above used linear re- gression, clearly other regression algorithms (such as locally weighted linear regression) can also be used. Unlike value iteration over a discrete set of states, fitted value iteration cannot be proved to always to converge. However, in practice, it often does converge (or approximately converge), and works well for many problems. Note also that if we are using a deterministic simulator/model of the MDP, then fitted value iteration can be simplified by setting k = 1 in the algorithm. This is because the expectation in Equation (15.8) becomes an expectation over a deterministic distribution, and so a single example is sufficient to exactly compute that expectation. Otherwise, in the algorithm above, we had to draw k samples, and average to try to approximate that expectation (see the definition of q ( a ), in the algorithm pseudo-code).

Finally, fitted value iteration outputs V , which is an approximation to

∗

V . This implicitly defines our policy. Specifically, when our system is in some state s , and we need to choose an action, we would like to choose the action

′

arg max E s ′

∼ P sa

[ V ( s )] (15.9)

a

The process for computing/approximating this is similar to the inner-loop of

′ ′

fitted value iteration, where for each action, we sample s , . . . , s k

∼ P sa to approximate the expectation. (And again, if the simulator is deterministic, we can set k = 1.) In practice, there are often other ways to approximate this step as well. For example, one very common case is if the simulator is of the form s t +1 = f ( s t , a t ) +  t , where f is some deterministic function of the states (such as f ( s t , a t ) = As t + Ba t ), and  is zero-mean Gaussian noise. In this case, we can pick the action given by

arg max V ( f ( s, a )) .

a

In other words, here we are just setting  t = 0 (i.e., ignoring the noise in the simulator), and setting k = 1. Equivalent, this can be derived from Equation (15.9) using the approximation

′ ′

E s ′ [ V ( s )] ≈ V (E s ′ [ s ]) (15.10) = V ( f ( s, a )) , (15.11)

′

where here the expectation is over the random s ∼ P sa . So long as the noise terms  t are small, this will usually be a reasonable approximation. However, for problems that don’t lend themselves to such approximations, having to sample k | A | states using the model, in order to approximate the expectation above, can be computationally expensive.

##### 15.5 Connections between Policy and Value Iteration (Optional)

In the policy iteration, line 3 of Algorithm 7, we typically use linear system

π

solver to compute V . Alternatively, one can also the iterative Bellman

π

updates, similarly to the value iteration, to evaluate V , as in the Procedure VE( · ) in Line 1 of Algorithm 8 below. Here if we take option 1 in Line 2 of the Procedure VE, then the difference between the Procedure VE from the

Algorithm 8 Variant of Policy Iteration

π

1: procedure VE ( π , k ) . To evaluate V

2: Option 1: initialize V ( s ) := 0; Option 2: Initialize from the current V in the main algorithm.

3: for i = 0 to k − do

4: For every state s , update ∑

′ ′

V ( s ) := R ( s ) + γ P sπ ( s ) ( s ) V ( s ) . (15.12)

s ′

return V

5:

Require: hyperparameter k .

6: Initialize π randomly.

7: for until convergence do

8: Let V = VE( π, k ).

9: For each state s , let ∑

′ ′

π ( s ) := arg max P sa ( s ) V ( s ) . (15.13)

a ∈ A s ′

value iteration (Algorithm 6) is that on line 4, the procedure is using the action from π instead of the greedy action. Using the Procedure VE, we can build Algorithm 8, which is a variant of policy iteration that serves an intermediate algorithm that connects pol- icy iteration and value iteration. Here we are going to use option 2 in VE to maximize the re-use of knowledge learned before. One can verify indeed that if we take k = 1 and use option 2 in Line 2 in Algorithm 8, then Algo- rithm 8 is semantically equivalent to value iteration (Algorithm 6). In other words, both Algorithm 8 and value iteration interleave the updates in (15.13) and (15.12). Algorithm 8 alternate between k steps of update (15.12) and one step of (15.13), whereas value iteration alternates between 1 steps of up- date (15.12) and one step of (15.13). Therefore generally Algorithm 8 should not be faster than value iteration, because assuming that update (15.12) and (15.13) are equally useful and time-consuming, then the optimal balance of the update frequencies could be just k = 1 or k ≈ 1. On the other hand, if k steps of update (15.12) can be done much faster than k times a single step of (15.12), then taking additional steps of equa- tion (15.12) in group might be useful. This is what policy iteration is lever- aging — the linear system solver can give us the result of Procedure VE with k = ∞ much faster than using the Procedure VE for a large k . On the flip side, when such a speeding-up effect no longer exists, e.g.,, when the state space is large and linear system solver is also not fast, then value iteration is more preferable.

# Chapter 16

# LQR, DDP and LQG

##### 16.1 Finite-horizon MDPs

In Chapter 15, we defined Markov Decision Processes (MDPs) and covered Value Iteration / Policy Iteration in a simplified setting. More specifically we introduced the optimal Bellman equation that defines the optimal value

π

∗

∗

function V of the optimal policy π .

π

∗

∑

′ π

∗

′

V ( s ) = R ( s ) + max γ P sa ( s ) V ( s )

a ∈A s ′

∈ S

Recall that from the optimal value function, we were able to recover the

∗

optimal policy π with ∑

∗ ′ ∗ ′

π ( s ) = argmax a ∈A

P sa ( s ) V ( s )

s ′

∈S

In this chapter, we’ll place ourselves in a more general setting:

1. We want to write equations that make sense for both the discrete and the continuous case. We’ll therefore write

[

π

∗

′

] E s ′

∼ P sa

V ( s ) instead of ∑

′ π

∗

′

P sa ( s ) V ( s )

s ′

∈ S

meaning that we take the expectation of the value function at the next state. In the finite case, we can rewrite the expectation as a sum over

states. In the continuous case, we can rewrite the expectation as an

′ ′

integral. The notation s ∼ P sa means that the state s is sampled from the distribution P sa .

2. We’ll assume that the rewards depend on both states and actions . In other words, R : S × A → R . This implies that the previous mechanism for computing the optimal action is changed into

∗

[

π

∗

′

] π ( s ) = argmax a ∈A

R ( s, a ) + γ E s ′

∼ P sa

V ( s )

3. Instead of considering an infinite horizon MDP, we’ll assume that we have a finite horizon MDP that will be defined as a tuple

( S , A , P sa , T, R )

with T > 0 the time horizon (for instance T = 100). In this setting, our definition of payoff is going to be (slightly) different:

R ( s , a ) + R ( s , a ) + · · · + R ( s T , a T )

instead of (infinite horizon case)

R ( s , a ) + γR ( s , a ) + γ R ( s , a ) + . . . ∑

∞ t

R ( s t , a t ) γ

t =0

What happened to the discount factor γ ? Remember that the intro- duction of γ was (partly) justified by the necessity of making sure that the infinite sum would be finite and well-defined. If the rewards are bounded by a constant  R ¯ , the payoff is indeed bounded by

∑ ∞

∑ ∞ t

| ≤ R ¯ t

| R ( s t ) γ γ

t =0 t =0

and we recognize a geometric sum! Here, as the payoff is a finite sum, the discount factor γ is not necessary anymore.

In this new setting, things behave quite differently. First, the optimal

∗

policy π might be non-stationary, meaning that it changes over time . In other words, now we have

( t )

π : S → A

where the superscript ( t ) denotes the policy at time step t . The dynam-

( t )

ics of the finite horizon MDP following policy π proceeds as follows:

(0)

we start in some state s , take some action a := π ( s ) according to our policy at time step 0. The MDP transitions to a successor s , drawn

(1)

according to P s a . Then, we get to pick another action a := π ( s ) following our new policy at time step 1 and so on...

Why does the optimal policy happen to be non-stationary in the finite- horizon setting? Intuitively, as we have a finite numbers of actions to take, we might want to adopt different strategies depending on where we are in the environment and how much time we have left. Imagine a grid with 2 goals with rewards +1 and +10. At the beginning, we might want to take actions to aim for the +10 goal. But if after some steps, dynamics somehow pushed us closer to the +1 goal and we don’t have enough steps left to be able to reach the +10 goal, then a better strategy would be to aim for the +1 goal...

4. This observation allows us to use time dependent dynamics

( t )

s t +1 ∼ P s t ,a t

( t )

meaning that the transition’s distribution P s t ,a t

changes over time. The

( t )

same thing can be said about R . Note that this setting is a better model for real life. In a car, the gas tank empties, traffic changes, etc. Combining the previous remarks, we’ll use the following general formulation for our finite horizon MDP

(

( t ) ( t )

) S , A , P sa

, T, R

Remark : notice that the above formulation would be equivalent to adding the time into the state.

The value function at time t for a policy π is then defined in the same way as before, as an expectation over trajectories generated following policy π starting in state s .

[

( t ) ( T )

] V t ( s ) = E R ( s t , a t ) + · · · + R ( s T , a T ) | s t = s, π

Now, the question is

In this finite-horizon setting, how do we find the optimal value function

∗ π

V t

( s ) = max V t

( s )

π

It turns out that Bellman’s equation for Value Iteration is made for Dy- namic Programming . This may come as no surprise as Bellman is one of the fathers of dynamic programming and the Bellman equation is strongly related to the field. To understand how we can simplify the problem by adopting an iteration-based approach, we make the following observations:

1. Notice that at the end of the game (for time step T ), the optimal value is obvious

∗ ( T )

∀ s ∈ S : V T

( s ) := max R ( s, a ) (16.1)

a ∈A

2. For another time step 0 ≤ t < T , if we suppose that we know the

∗

optimal value function for the next time step V t +1

, then we have

[

∗ ( t )

[ ]

∗ ′

] ∀ t < T, s ∈ S : V t

( s ) := max R ( s, a ) + E

a s ′ ( t )

∼ P sa

V t +1

( s ) (16.2)

∈A

With these observations in mind, we can come up with a clever algorithm to solve for the optimal value function:

∗

1. compute V T

using equation (16.1).

2. for t = T − , . . . , 0:

∗ ∗

compute V t

using V t +1

using equation (16.2)

Side note We can interpret standard value iteration as a special case of this general case, but without keeping track of time. It turns out that

T

| in the standard setting, if we run value iteration for T steps, we get a | γ   |
| ------------------------------------------------------------------------ | --- |
| approximation of the optimal value iteration (geometric convergence).    | See |

Theorem Let B denote the Bellman update and || f ( x ) || ∞ := sup x

| f ( x ) | . If V t denotes the value function at the t -th step, then

∗ ∗

|| V t +1 − V || ∞ = || B ( V t ) − V || ∞ ∗

≤ γ || V t − V || ∞ t ∗

≤ γ || V − V || ∞

In other words, the Bellman operator B is a γ -contracting operator.

##### 16.2 Linear Quadratic Regulation (LQR)

In this section, we’ll cover a special case of the finite-horizon setting described in Section 16.1, for which the exact solution is (easily) tractable. This model is widely used in robotics, and a common technique in many problems is to reduce the formulation to this framework. First, let’s describe the model’s assumptions. We place ourselves in the continuous setting, with

d d

S = R , A = R

and we’ll assume linear transitions (with noise)

s t +1 = A t s t + B t a t + w t

d × d d × d

where A t ∈ R , B t ∈ R are matrices and w t ∼ N (0 , Σ t ) is some gaussian noise (with zero mean). As we’ll show in the following paragraphs, it turns out that the noise, as long as it has zero mean, does not impact the optimal policy! We’ll also assume quadratic rewards

( t ) > >

R ( s t , a t ) = − s t

U t s t − a t

W t a t

d × n d × d

where U t ∈ R , W t ∈ R are positive definite matrices (meaning that the reward is always negative ).

Remark Note that the quadratic formulation of the reward is equivalent to saying that we want our state to be close to the origin (where the reward is higher). For example, if U t = I d (the identity matrix) and W t = I d , then R t = −|| s t || − || a t || , meaning that we want to take smooth actions (small norm of a t ) to go back to the origin (small norm of s t ). This could model a car trying to stay in the middle of lane without making impulsive moves...

Now that we have defined the assumptions of our LQR model, let’s cover the 2 steps of the LQR algorithm

step 1 suppose that we don’t know the matrices A, B, Σ. To esti- mate them, we can follow the ideas outlined in the Value Ap- proximation section of the RL notes. First, collect transitions from an arbitrary policy. Then, use linear regression to find ∑ n

∑ ∥ ( )∥

T − ∥ ( i ) ( i ) ( i ) ∥ argmin A,B i =1 t =0

∥ s t +1

− As t

+ Ba t ∥ . Finally, use a tech- nique seen in Gaussian Discriminant Analysis to learn Σ.

step 2 assuming that the parameters of our model are known (given or esti- mated with step 1), we can derive the optimal policy using dynamic programming.

In other words, given

{ s t +1 = A t s t + B t a t + w t A t , B t , U t , W t , Σ t known

( t ) > >

R ( s t , a t ) = − s t

U t s t − a t

W t a t

∗

we want to compute V t

. If we go back to section 16.1, we can apply dynamic programming, which yields

1. Initialization step

For the last time step T ,

∗

V T

( s T ) = max R T ( s T , a T )

a T ∈A

> >

= max − s T

U T s T − a T

W t a T a T ∈A

>

= − s T

U t s T (maximized for a T = 0)

2. Recurrence step

∗

Let t < T . Suppose we know V t +1

.

∗ ∗

Fact 1: It can be shown that if V t +1

is a quadratic function in s t , then V t

is also a quadratic function. In other words, there exists some matrix Φ and some scalar Ψ such that

∗ >

if V t +1

( s t +1 ) = s t +1

Φ t +1 s t +1 + Ψ t +1

∗ >

then V t

( s t ) = s t

Φ t s t + Ψ t

For time step t = T , we had Φ t = − U T and Ψ T = 0.

Fact 2: We can show that the optimal policy is just a linear function of the state.

∗

Knowing V t +1

is equivalent to knowing Φ t +1 and Ψ t +1 , so we just need to explain how we compute Φ t and Ψ t from Φ t +1 and Ψ t +1 and the other parameters of the problem.

∗ >

V t

( s t ) = s t

Φ t s t + Ψ t

[ ]

( t ) ∗

= max R ( s t , a t ) + E ( t )

a t

s t +1 ∼ P s

t

( s t )]

t ,a

[ V +1 +1

t

[

> > >

] = max − s t

U t s t − a t

V t a t + E s t +1 ∼N ( A t s t + B t a t , Σ t ) [ s t +1

Φ t +1 s t +1 + Ψ t +1 ]

a t

where the second line is just the definition of the optimal value function and the third line is obtained by plugging in the dynamics of our model along with the quadratic assumption. Notice that the last expression is a quadratic function in a t and can thus be (easily) optimized . We get

∗

the optimal action a t

∗

[

> −

] a t

= ( B t

Φ t +1 B t − V t ) B t Φ t +1 A t · s t

= L t · s t

where [

> −

] L t := ( B t

Φ t +1 B t − W t ) B t Φ t +1 A t

[

>

] Use the identity E w t

Φ t +1 w t = Tr(Σ t Φ t +1 ) with w t ∼ N (0 , Σ t )

which is an impressive result: our optimal policy is linear in s t . Given

∗

a t

we can solve for Φ t and Ψ t . We finally get the Discrete Ricatti equations

(

>

(

>

) −

) Φ t = A t

Φ t +1 − Φ t +1 B t B t

Φ t +1 B t − W t B t Φ t +1 A t − U t

Ψ t = − tr (Σ t Φ t +1 ) + Ψ t +1

Fact 3: we notice that Φ t depends on neither Ψ nor the noise Σ t ! As L t

is a function of A t , B t and Φ t +1 , it implies that the optimal policy also does not depend on the noise ! (But Ψ t does depend on Σ t , which

∗

implies that V t

depends on Σ t .)

Then, to summarize, the LQR algorithm works as follows

1. (if necessary) estimate parameters A t , B t , Σ t

2. initialize Φ T := − U T and Ψ T := 0.

3. iterate from t = T − . . . 0 to update Φ t and Ψ t using Φ t +1 and Ψ t +1

using the discrete Ricatti equations. If there exists a policy that drives the state towards zero, then convergence is guaranteed!

Using Fact 3, we can be even more clever and make our algorithm run (slightly) faster! As the optimal policy does not depend on Ψ t , and the update of Φ t only depends on Φ t , it is sufficient to update only Φ t !

##### 16.3 From non-linear dynamics to LQR

It turns out that a lot of problems can be reduced to LQR, even if dynamics are non-linear. While LQR is a nice formulation because we are able to come up with a nice exact solution, it is far from being general. Let’s take for instance the case of the inverted pendulum. The transitions between states look like       x t +1 x t

  x ˙ t +1

    t

 = θ t +1

 F   x ˙        , a t

θ t

 θ ˙

t +1 θ ˙

t

where the function F depends on the cos of the angle etc. Now, the question we may ask is

Can we linearize this system?

###### 16.3.1 Linearization of dynamics

Let’s suppose that at time t , the system spends most of its time in some state s ¯ t and the actions we perform are around ¯ a t . For the inverted pendulum, if we reached some kind of optimal, this is true: our actions are small and we don’t deviate much from the vertical. We are going to use Taylor expansion to linearize the dynamics. In the simple case where the state is one-dimensional and the transition function F does not depend on the action, we would write something like

′

s t +1 = F ( s t ) ≈ F ( ¯ s t ) + F ( ¯ s t ) · ( s t − s ¯ t )

In the more general setting, the formula looks the same, with gradients instead of simple derivatives

s t +1 ≈ F ( ¯ s t , a ¯ t ) + ∇ s F ( ¯ s t , a ¯ t ) · ( s t − s ¯ t ) + ∇ a F ( ¯ s t , a ¯ t ) · ( a t − a ¯ t ) (16.3)

and now, s t +1 is linear in s t and a t , because we can rewrite equation (16.3) as

s t +1 ≈ As t + Bs t + κ

where κ is some constant and A, B are matrices. Now, this writing looks awfully similar to the assumptions made for LQR. We just have to get rid of the constant term κ ! It turns out that the constant term can be absorbed into s t by artificially increasing the dimension by one. This is the same trick that we used at the beginning of the class for linear regression...

###### 16.3.2 Differential Dynamic Programming (DDP)

The previous method works well for cases where the goal is to stay around

∗

some state s (think about the inverted pendulum, or a car having to stay in the middle of a lane). However, in some cases, the goal can be more complicated. We’ll cover a method that applies when our system has to follow some trajectory (think about a rocket). This method is going to discretize the trajectory into discrete time steps, and create intermediary goals around which we will be able to use the previous technique! This method is called Differential Dynamic Programming . The main steps are

step 1 come up with a nominal trajectory using a naive controller, that approx- imate the trajectory we want to follow. In other words, our controller is able to approximate the gold trajectory with

∗ ∗ ∗ ∗

s , a → s , a → . . .

∗

step 2 linearize the dynamics around each trajectory point s t

, in other words

∗ ∗ ∗ ∗ ∗ ∗ ∗ ∗

s t +1 ≈ F ( s t

, a t

) + ∇ s F ( s t

, a t

)( s t − s t

) + ∇ a F ( s t

, a t

)( a t − a t

)

where s t , a t would be our current state and action. Now that we have a linear approximation around each of these points, we can use the previous section and rewrite

s t +1 = A t · s t + B t · a t

(notice that in that case, we use the non-stationary dynamics setting that we mentioned at the beginning of these lecture notes)

( t )

Note We can apply a similar derivation for the reward R , with a second-order Taylor expansion.

∗ ∗ ∗ ∗ ∗ ∗ ∗ ∗

R ( s t , a t ) ≈ R ( s t

, a t

) + ∇ s R ( s t

, a t

)( s t − s t

) + ∇ a R ( s t

, a t

)( a t − a t

)

∗ > ∗ ∗ > ∗

+  ( s t − s t

) H ss ( s t − s t

) + ( s t − s t

) H sa ( a t − a t

)

∗ > ∗

+  ( a t − a t

) H aa ( a t − a t

)

where H xy refers to the entry of the Hessian of R with respect to x and

∗ ∗

y evaluated in ( s t

, a t

) (omitted for readability). This expression can be re-written as

> >

R t ( s t , a t ) = − s t

U t s t − a t

W t a t

for some matrices U t , W t , with the same trick of adding an extra dimen- sion of ones. To convince yourself, notice that

( ) ( ) ( ) a b x · · = a + 2 bx + cx b c x

step 3 Now, you can convince yourself that our problem is strictly re-written in the LQR framework. Let’s just use LQR to find the optimal policy π t . As a result, our new controller will (hopefully) be better!

Note: Some problems might arise if the LQR trajectory deviates too much from the linearized approximation of the trajectory, but that can be fixed with reward-shaping...

step 4 Now that we get a new controller (our new policy π t ), we use it to produce a new trajectory

∗ ∗ ∗ ∗ ∗

s , π ( s ) → s , π ( s ) → . . . → s T

note that when we generate this new trajectory, we use the real F and not its linear approximation to compute transitions, meaning that

∗ ∗ ∗

s t +1

= F ( s t

, a t

)

then, go back to step 2 and repeat until some stopping criterion.

##### 16.4 Linear Quadratic Gaussian (LQG)

Often, in the real word, we don’t get to observe the full state s t . For example, an autonomous car could receive an image from a camera, which is merely an observation , and not the full state of the world. So far, we assumed that the state was available. As this might not hold true for most of the real-world problems, we need a new tool to model this situation: Partially Observable MDPs . A POMDP is an MDP with an extra observation layer. In other words, we introduce a new variable o t , that follows some conditional distribution given the current state s t

o t | s t ∼ O ( o | s )

Formally, a finite-horizon POMDP is given by a tuple

( S , O , A , P sa , T, R )

Within this framework, the general strategy is to maintain a belief state (distribution over states) based on the observation o , . . . , o t . Then, a policy in a POMDP maps this belief states to actions.

In this section, we’ll present a extension of LQR to this new setting.

n

Assume that we observe y t ∈ R with m < n such that { y t = C · s t + v t

s t +1 = A · s t + B · a t + w t

n × d

where C ∈ R is a compression matrix and v t is the sensor noise (also

( t )

gaussian, like w t ). Note that the reward function R is left unchanged, as a function of the state (not the observation) and action. Also, as distributions are gaussian, the belief state is also going to be gaussian. In this new frame- work, let’s give an overview of the strategy we are going to adopt to find the optimal policy:

step 1 first, compute the distribution on the possible states (the belief state), based on the observations we have. In other words, we want to compute the mean s t | t and the covariance Σ t | t of

( ) s t | y , . . . , y t ∼ N s t | t , Σ t | t

to perform the computation efficiently over time, we’ll use the Kalman Filter algorithm (used on-board Apollo Lunar Module!).

step 2 now that we have the distribution, we’ll use the mean s t | t as the best approximation for s t

step 3 then set the action a t := L t s t | t where L t comes from the regular LQR algorithm.

Intuitively, to understand why this works, notice that s t | t is a noisy ap- proximation of s t (equivalent to adding more noise to LQR) but we proved that LQR is independent of the noise! Step 1 needs to be explicated. We’ll cover a simple case where there is no action dependence in our dynamics (but the general case follows the same idea). Suppose that { s t +1 = A · s t + w t , w t ∼ N (0 , Σ s ) y t = C · s t + v t , v t ∼ N (0 , Σ y )

As noises are Gaussians, we can easily prove that the joint distribution is also Gaussian

  s  .  .  .     s t    ∼ N ( μ, Σ) for some μ, Σ  y   .   . . 

y t

then, using the marginal formulas of gaussians (see Factor Analysis notes), we would get

( ) s t | y , . . . , y t ∼ N s t | t , Σ t | t

However, computing the marginal distribution parameters using these formulas would be computationally expensive! It would require manipulating matrices of shape t × t . Recall that inverting a matrix can be done in O ( t ), and it would then have to be repeated over the time steps, yielding a cost in O ( t )! The Kalman filter algorithm provides a much better way of computing the mean and variance, by updating them over time in constant time in t ! The kalman filter is based on two basics steps. Assume that we know the distribution of s t | y , . . . , y t :

predict step compute s t +1 | y , . . . , y t

update step compute s t +1 | y , . . . , y t +1

and iterate over time steps! The combination of the predict and update steps updates our belief states. In other words, the process looks like

predict update predict

( s t | y , . . . , y t ) − − − − → ( s t +1 | y , . . . , y t ) − − − − → ( s t +1 | y , . . . , y t +1 ) − − − − → . . .

predict step Suppose that we know the distribution of

( ) s t | y , . . . , y t ∼ N s t | t , Σ t | t

then, the distribution over the next state is also a gaussian distribution

( ) s t +1 | y , . . . , y t ∼ N s t +1 | t , Σ t +1 | t

where

{ s t +1 | t = A · s t | t >

Σ t +1 | t = A · Σ t | t · A + Σ s

update step given s t +1 | t and Σ t +1 | t such that

( ) s t +1 | y , . . . , y t ∼ N s t +1 | t , Σ t +1 | t

we can prove that

( ) s t +1 | y , . . . , y t +1 ∼ N s t +1 | t +1 , Σ t +1 | t +1

where

{ s t +1 | t +1 = s t +1 | t + K t ( y t +1 − Cs t +1 | t ) Σ t +1 | t +1 = Σ t +1 | t − K t · C · Σ t +1 | t

with

> > −

K t := Σ t +1 | t C ( C Σ t +1 | t C + Σ y )

The matrix K t is called the Kalman gain .

Now, if we have a closer look at the formulas, we notice that we don’t need the observations prior to time step t ! The update steps only depends on the previous distribution. Putting it all together, the algorithm first runs a forward pass to compute the K t , Σ t | t and s t | t (sometimes referred to as s ˆ in the literature). Then, it runs a backward pass (the LQR updates) to compute the quantities Ψ t , Ψ t and L t . Finally, we recover the optimal policy

∗

with a t

= L t s t | t .

# Chapter 17

# Policy Gradient (REINFORCE)

We will present a model-free algorithm called REINFORCE that does not require the notion of value functions and Q functions. It turns out to be more convenient to introduce REINFORCE in the finite horizon case, which will be assumed throughout this note: we use τ = ( s , a , . . . , s T − , a T − , s T ) to denote a trajectory, where T < ∞ is the length of the trajectory. Moreover, REINFORCE only applies to learning a randomized policy . We use π θ ( a | s ) to denote the probability of the policy π θ outputting the action a at state s . The other notations will be the same as in previous lecture notes. The advantage of applying REINFORCE is that we only need to assume that we can sample from the transition probabilities { P sa } and can query the reward function R ( s, a ) at state s and action a , but we do not need to know the analytical form of the transition probabilities or the reward function. We do not explicitly learn the transition probabilities or the reward function either. Let s be sampled from some distribution μ . We consider optimizing the expected total payoff of the policy π θ over the parameter θ defined as. [ ∑

T −

]

t

η ( θ ) , E γ R ( s t , a t ) (17.1)

t =0

Recall that s t ∼ P s t − a t −

and a t ∼ π θ ( ·| s t ). Also note that η ( θ ) =

π

E θ

s ∼ P [ V ( s )] if we ignore the difference between finite and infinite hori- zon.

In this notes we will work with the general setting where the reward depends on both the state and the action.

We aim to use gradient ascent to maximize η ( θ ). The main challenge we face here is to compute (or estimate) the gradient of η ( θ ) without the knowledge of the form of the reward function and the transition probabilities. Let P θ ( ∑ τ ) denote the distribution of τ (generated by the policy π θ ), and

T − t

let f ( τ ) = t =0

γ R ( s t , a t ). We can rewrite η ( θ ) as

η ( θ ) = E τ ∼ P θ

[ f ( τ )] (17.2)

We face a similar situations in the variational auto-encoder (VAE) setting covered in the previous lectures, where the we need to take the gradient w.r.t to a variable that shows up under the expectation — the distribution P θ

depends on θ . Recall that in VAE, we used the re-parametrization techniques to address this problem. However it does not apply here because we do know not how to compute the gradient of the function f . (We only have an efficient way to evaluate the function f by taking a weighted sum of the observed rewards, but we do not necessarily know the reward function itself to compute the gradient.) The REINFORCE algorithm uses an another approach to estimate the gradient of η ( θ ). We start with the following derivation: ∫ ∇ θ E τ ∼ P θ

[ f ( τ )] = ∇ θ P θ ( τ ) f ( τ ) dτ ∫ = ∇ θ ( P θ ( τ ) f ( τ )) dτ (swap integration with gradient) ∫ = ( ∇ θ P θ ( τ )) f ( τ ) dτ (becaue f does not depend on θ ) ∫ = P θ ( τ )( ∇ θ log P θ ( τ )) f ( τ ) dτ

∇ P θ ( τ )

(because ∇ log P θ ( τ ) =

P θ ( τ )

)

= E τ ∼ P θ

[( ∇ θ log P θ ( τ )) f ( τ )] (17.3)

(1) ( n )

Now we have a sample-based estimator for ∇ θ E τ ∼ P θ

[ f ( τ )]. Let τ , . . . , τ be n empirical samples from P θ (which are obtained by running the policy π θ for n times, with T steps for each run). We can estimate the gradient of η ( θ ) by

∇ θ E τ ∼ P θ

[ f ( τ )] = E τ ∼ P θ

[( ∇ θ log P θ ( τ )) f ( τ )] (17.4) ∑

n ( i ) ( i )

≈ ( ∇ θ log P θ ( τ )) f ( τ ) (17.5) n

i =1

The next question is how to compute log P θ ( τ ). We derive an analyt- ical formula for log P θ ( τ ) and compute its gradient w.r.t θ (using auto- differentiation). Using the definition of τ , we have

P θ ( τ ) = μ ( s ) π θ ( a | s ) P s a ( s ) π θ ( a | s ) P s a ( s ) · · · P s T − a T −

( s T ) (17.6)

Here recall that μ to used to denote the density of the distribution of s . It follows that

log P θ ( τ ) = log μ ( s ) + log π θ ( a | s ) + log P s a ( s ) + log π θ ( a | s ) + log P s a ( s ) + · · · + log P s T − a T −

( s T ) (17.7)

Taking gradient w.r.t to θ , we obtain

∇ θ log P θ ( τ ) = ∇ θ log π θ ( a | s ) + ∇ θ log π θ ( a | s ) + · · · + ∇ θ log π θ ( a T − | s T − )

Note that many of the terms disappear because they don’t depend on θ and thus have zero gradients. (This is somewhat important — we don’t know how to evaluate those terms such as log P s a ( s ) because we don’t have access to the transition probabilities, but luckily those terms have zero gradients!) Plugging the equation above into equation (17.4), we conclude that [( ∑ T −

) ]

∇ θ η ( θ ) = ∇ θ E τ ∼ P θ

[ f ( τ )] = E τ ∼ P θ

∇ θ log π θ ( a t | s t ) · f ( τ )

t =0

[( ∑ T −

) ( ∑ T −

)]

t

= E τ ∼ P θ

∇ θ log π θ ( a t | s t ) · γ R ( s t , a t )

t =0 t =0

(17.8)

We estimate the RHS of the equation above by empirical sample trajectories, and the estimate is unbiased. The vanilla REINFORCE algorithm iteratively updates the parameter by gradient ascent using the estimated gradients.

Interpretation of the policy gradient formula ∑ (17.8) . The quantity

T −

∇ θ P θ ( τ ) = t =0

∇ θ log π θ ( a t | s t ) is intuitively the direction of the change of θ that will make the trajectory τ more likely to occur (or increase the probability of choosing action a , . . . , a t − ), and f ( τ ) is the total payoff of this trajectory. Thus, by taking a gradient step, intuitively we are trying to improve the likelihood of all the trajectories, but with a different emphasis or weight for each τ (or for each set of actions a , a , . . . , a t − ). If τ is very rewarding (that is, f ( τ ) is large), we try very hard to move in the direction

that can increase the probability of the trajectory τ (or the direction that increases the probability of choosing a , . . . , a t − ), and if τ has low payoff, we try less hard with a smaller weight. An interesting fact that follows from formula (17.3) is that [ ∑ T −

]

E τ ∼ P θ

∇ θ log π θ ( a t | s t ) = 0 (17.9)

t =0

To see this, we take f ( τ ) = 1 (that is, the reward is always a constant), then the LHS of (17.8) is zero because the payoff is always a fixed constant ∑ T t t =0

γ . Thus the RHS of (17.8) is also zero, which implies (17.9). In fact, one can verify that E a t ∼ π θ ( ·| s t ) ∇ θ log π θ ( a t | s t ) = 0 for any fixed t and s t . This fact has two consequences. First, we can simplify formula (17.8) to

T −

[ ( )] ∑ ∑

T − j

∇ θ η ( θ ) = E τ ∼ P θ

∇ θ log π θ ( a t | s t ) · γ R ( s j , a j )

t =0 j =0

∑

T −

[ ( )] ∑

T − j

= E τ ∼ P θ

∇ θ log π θ ( a t | s t ) · γ R ( s j , a j ) (17.10)

t =0 j ≥ t

where the second equality follows from [ (  )] ∑

j

E τ ∼ P θ

∇ θ log π θ ( a t | s t ) · γ R ( s j , a j )

≤ j<t

[ (  )] ∑

j

= E E [ ∇ θ log π θ ( a t | s t ) | s , a , . . . , s t − , a t − , s t ] · γ R ( s j , a j )

≤ j<t

= 0 (because E [ ∇ θ log π θ ( a t | s t ) | s , a , . . . , s t − , a t − , s t ] = 0)

Note that here we used the law of total expectation. The outer expecta- tion in the second line above is over the randomness of s , a , . . . , a t − , s t , whereas the inner expectation is over the randomness of a t (conditioned on s , a , . . . , a t − , s t .) We see that we’ve made the estimator slightly simpler. The second consequence of E a t ∼ π θ ( ·| s t ) ∇ θ log π θ ( a t | s t ) = 0 is the following: for any value B ( s t ) that only depends on s t , it holds that

E τ ∼ P θ

[ ∇ θ log π θ ( a t | s t ) · B ( s t )] = E [E [ ∇ θ log π θ ( a t | s t ) | s , a , . . . , s t − , a t − , s t ] B ( s t )] = 0 (because E [ ∇ θ log π θ ( a t | s t ) | s , a , . . . , s t − , a t − , s t ] = 0)

In general, it’s true that E x ∼ p θ

[ ∇ log p θ ( x )] = 0.

Again here we used the law of total expectation. The outer expecta- tion in the second line above is over the randomness of s , a , . . . , a t − , s t , whereas the inner expectation is over the randomness of a t (conditioned on s , a , . . . , a t − , s t .) It follows from equation (17.10) and the equation above that )] ∑ T −

[ ( ∑ T − j t

∇ θ η ( θ ) = E τ ∼ P θ

∇ θ log π θ ( a t | s t ) · γ R ( s j , a j ) − γ B ( s t )

t =0 j ≥ t

∑ T −

[ ( ∑ T −

)]

t j − t

= E τ ∼ P θ

∇ θ log π θ ( a t | s t ) · γ γ R ( s j , a j ) − B ( s t )

t =0 j ≥ t

(17.11)

Therefore, we will get a different estimator for estimating the ∇ η ( θ ) with a difference choice of B ( · ). The benefit of introducing a proper B ( · ) — which is often referred to as a baseline — is that it helps reduce the variance of the estimator. It turns out that a near optimal estimator would be the expected [ ∑ ]

T − j − t

future payoff E j ≥ t

γ R ( s j , a j ) | s t , which is pretty much the same as the

π

value function V θ

( s t ) (if we ignore the difference between finite and infinite

π

horizon.) Here one could estimate the value function V θ

( · ) in a crude way, because its precise value doesn’t influence the mean of the estimator but only the variance. This leads to a policy gradient algorithm with baselines stated in Algorithm 9.

∑ As a heuristic but illustrating example, suppose for a fixed t , the future reward

T − j − t j ≥ t

γ R ( s j , a j ) randomly takes two values 1000 + 1 and 1000 − 2 with equal proba- bility, and the corresponding values for ∇ θ log π θ ( a t | s t ) are vector z and − z . (Note that because E [ ∇ θ log π θ ( a t | s t )] = 0, if ∇ θ log π θ ( a t | s t ) can only take two values uniformly, then the two values have to two vectors in an opposite direction.) In this case, without subtracting the baseline, the estimators take two values (1000 + 1) z and − (1000 − 2) z , whereas after subtracting a baseline of 1000, the estimator has two values z and 2 z . The latter estimator has much lower variance compared to the original estimator. We note that the estimator of the gradient in the algorithm does not exactly match

t

the equation 17.11. If we multiply γ in the summand of equation (17.13), then they will exactly match. Removing such discount factors empirically works well because it gives a large update.

Algorithm 9 Vanilla policy gradient with baseline for i = 1 , · · · do Collect a set of trajectories by executing the current policy. Use ∑ R ≥ t T − j − t

as a shorthand for j ≥ t

γ R ( s j , a j ) Fit the baseline by finding a function B that minimizes ∑ ∑ ( R ≥ t − B ( s t )) (17.12)

τ t

Update the policy parameter θ with the gradient estimator ∑ ∑ ∇ θ log π θ ( a t | s t ) · ( R ≥ t − B ( s t )) (17.13)

τ t

# Bibliography

Mikhail Belkin, Daniel Hsu, Siyuan Ma, and Soumik Mandal. Reconciling modern machine-learning practice and the classical bias–variance trade- off. Proceedings of the National Academy of Sciences , 116(32):15849–15854, 2019.

Mikhail Belkin, Daniel Hsu, and Ji Xu. Two models of double descent for weak features. SIAM Journal on Mathematics of Data Science , 2(4):1167– 1180, 2020.

David M Blei, Alp Kucukelbir, and Jon D McAuliffe. Variational inference: A review for statisticians. Journal of the American Statistical Association , 112(518):859–877, 2017.

Rishi Bommasani, Drew A Hudson, Ehsan Adeli, Russ Altman, Simran Arora, Sydney von Arx, Michael S Bernstein, Jeannette Bohg, Antoine Bosselut, Emma Brunskill, et al. On the opportunities and risks of foun- dation models. arXiv preprint arXiv:2108.07258 , 2021.

Tom Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah, Jared D Ka- plan, Prafulla Dhariwal, Arvind Neelakantan, Pranav Shyam, Girish Sas- try, Amanda Askell, et al. Language models are few-shot learners. Advances in neural information processing systems , 33:1877–1901, 2020.

Ting Chen, Simon Kornblith, Mohammad Norouzi, and Geoffrey Hinton. A simple framework for contrastive learning of visual representations. In International Conference on Machine Learning , pages 1597–1607. PMLR, 2020.

Jacob Devlin, Ming-Wei Chang, Kenton Lee, and Kristina Toutanova. Bert: Pre-training of deep bidirectional transformers for language understand- ing. In Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Tech- nologies, Volume 1 (Long and Short Papers) , pages 4171–4186, 2019.

Jeff Z HaoChen, Colin Wei, Jason D Lee, and Tengyu Ma. Shape matters: Understanding the implicit bias of the noise covariance. arXiv preprint arXiv:2006.08680 , 2020.

Trevor Hastie, Andrea Montanari, Saharon Rosset, and Ryan J Tibshirani. Surprises in high-dimensional ridgeless least squares interpolation. 2019.

Trevor Hastie, Andrea Montanari, Saharon Rosset, and Ryan J Tibshirani. Surprises in high-dimensional ridgeless least squares interpolation. The Annals of Statistics , 50(2):949–986, 2022.

Gareth James, Daniela Witten, Trevor Hastie, and Robert Tibshirani. An introduction to statistical learning, second edition , volume 112. Springer, 2021.

Diederik P Kingma and Jimmy Ba. Adam: A method for stochastic opti- mization. arXiv preprint arXiv:1412.6980 , 2014.

Diederik P Kingma and Max Welling. Auto-encoding variational bayes. arXiv preprint arXiv:1312.6114 , 2013.

Yuping Luo, Huazhe Xu, Yuanzhi Li, Yuandong Tian, Trevor Darrell, and Tengyu Ma. Algorithmic framework for model-based deep reinforcement learning with theoretical guarantees. In International Conference on Learn- ing Representations , 2018.

Song Mei and Andrea Montanari. The generalization error of random features regression: Precise asymptotics and the double descent curve. Communi- cations on Pure and Applied Mathematics , 75(4):667–766, 2022.

Preetum Nakkiran. More data can hurt for linear regression: Sample-wise double descent. 2019.

Preetum Nakkiran, Prayaag Venkat, Sham Kakade, and Tengyu Ma. Optimal regularization can mitigate double descent. 2020.

Manfred Opper. Statistical mechanics of learning: Generalization. The hand- book of brain theory and neural networks , pages 922–925, 1995.

Manfred Opper. Learning to generalize. Frontiers of Life , 3(part 2):763–775, 2001.

Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N Gomez, Lukasz Kaiser, and Illia Polosukhin. Attention is all you need. arXiv preprint arXiv:1706.03762 , 2017.

Blake Woodworth, Suriya Gunasekar, Jason D Lee, Edward Moroshko, Pe- dro Savarese, Itay Golan, Daniel Soudry, and Nathan Srebro. Kernel and rich regimes in overparametrized models. arXiv preprint arXiv:2002.09277 , 2020.