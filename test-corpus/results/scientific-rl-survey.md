---
title: "A Brief Survey of Deep Reinforcement Learning"
---

# A Brief Survey of Deep Reinforcement Learning

Kai Arulkumaran, Marc Peter Deisenroth, Miles Brundage, Anil Anthony Bharath

Abstract —Deep reinforcement learning is poised to revolu- is to cover both seminal and recent developments in DRL, tionise the field of AI and represents a step towards building conveying the innovative ways in which neural networks can autonomous systems with a higher level understanding of the be used to bring us closer towards developing autonomous visual world. Currently, deep learning is enabling reinforcement learning to scale to problems that were previously intractable, agents. For a more comprehensive survey of recent efforts in such as learning to play video games directly from pixels. Deep DRL, including applications of DRL to areas such as natural reinforcement learning algorithms are also applied to robotics, language processing [106, 5], we refer readers to the overview allowing control policies for robots to be learned directly from by Li [78]. camera inputs in the real world. In this survey, we begin with Deep learning enables RL to scale to decision-making an introduction to the general field of reinforcement learning, then progress to the main streams of value-based and policy- problems that were previously intractable, i.e., settings with based methods. Our survey will cover central algorithms in high-dimensional state and action spaces. Amongst recent deep reinforcement learning, including the deep Q -network, work in the field of DRL, there have been two outstanding trust region policy optimisation, and asynchronous advantage success stories. The first, kickstarting the revolution in DRL, actor-critic. In parallel, we highlight the unique advantages of was the development of an algorithm that could learn to play deep neural networks, focusing on visual understanding via reinforcement learning. To conclude, we describe several current a range of Atari 2600 video games at a superhuman level, areas of research within the field. directly from image pixels [84]. Providing solutions for the instability of function approximation techniques in RL, this I. I NTRODUCTION work was the first to convincingly demonstrate that RL agents One of the primary goals of the field of artificial intelligence could be trained on raw, high-dimensional observations, solely (AI) is to produce fully autonomous agents that interact with based on a reward signal. The second standout success was their environments to learn optimal behaviours, improving over the development of a hybrid DRL system, AlphaGo, that time through trial and error. Crafting AI systems that are defeated a human world champion in Go [128], paralleling the responsive and can effectively learn has been a long-standing historic achievement of IBM’s Deep Blue in chess two decades challenge, ranging from robots, which can sense and react earlier [19] and IBM’s Watson DeepQA system that beat the to the world around them, to purely software-based agents, best human Jeopardy! players [31]. Unlike the handcrafted which can interact with natural language and multimedia. rules that have dominated chess-playing systems, AlphaGo A principled mathematical framework for experience-driven was composed of neural networks that were trained using autonomous learning is reinforcement learning (RL) [135]. Al- supervised and reinforcement learning, in combination with though RL had some successes in the past [141, 129, 62, 93], a traditional heuristic search algorithm. previous approaches lacked scalablity and were inherently DRL algorithms have already been applied to a wide range limited to fairly low-dimensional problems. These limitations of problems, such as robotics, where control policies for robots exist because RL algorithms share the same complexity is- can now be learned directly from camera inputs in the real sues as other algorithms: memory complexity, computational world [74, 75], succeeding controllers that used to be hand- complexity, and in the case of machine learning algorithms, engineered or learned from low-dimensional features of the sample complexity [133]. What we have witnessed in recent robot’s state. In a step towards even more capable agents, years—the rise of deep learning, relying on the powerful DRL has been used to create agents that can meta-learn (“learn

arXiv:1708.05866v2 [cs.LG] 28 Sep 2017 function approximation and representation learning properties to learn”) [29, 156], allowing them to generalise to complex of deep neural networks—has provided us with new tools to visual environments they have never seen before [29]. In overcoming these problems. Figure 1, we showcase just some of the domains that DRL The advent of deep learning has had a significant impact has been applied to, ranging from playing video games [84] on many areas in machine learning, dramatically improving to indoor navigation [167]. the state-of-the-art in tasks such as object detection, speech Video games may be an interesting challenge, but learning recognition, and language translation [70]. The most important how to play them is not the end goal of DRL. One of the property of deep learning is that deep neural networks can driving forces behind DRL is the vision of creating systems automatically find compact low-dimensional representations that are capable of learning how to adapt in the real world. (features) of high-dimensional data (e.g., images, text and From managing power consumption [142] to picking and audio). Through crafting inductive biases into neural network stowing objects [75], DRL stands to increase the amount architectures, particularly that of hierarchical representations, of physical tasks that can be automated by learning. How- machine learning practitioners have made effective progress ever, DRL does not stop there, as RL is a general way of in addressing the curse of dimensionality [15]. Deep learning approaching optimisation problems by trial and error. From has similarly accelerated progress in RL, with the use of designing state-of-the-art machine translation models [168] to deep learning algorithms within RL defining the field of constructing new optimisation functions [76], DRL has already “deep reinforcement learning” (DRL). The aim of this survey been used to approach all manner of machine learning tasks.

Fig. 1. A range of visual RL domains. (a) Two classic Atari 2600 video games, “Freeway” and “Seaquest”, from the Arcade Learning Environment (ALE) [10]. Due to the range of supported games that vary in genre, visuals and difficulty, the ALE has become a standard testbed for DRL algorithms [84, 95, 44, 122, 132, 157, 85]. As we will discuss later, the ALE is one of several benchmarks that are now being used to standardise evaluation in RL. (b) The TORCS car racing simulator, which has been used to test DRL algorithms that can output continuous actions [64, 79, 85] (as the games from the ALE only support discrete actions). (c) Utilising the potentially unlimited amount of training data that can be amassed in robotic simulators, several methods aim to transfer knowledge from the simulator to the real world [22, 115, 146]. (d) Two of the four robotic tasks designed by Levine et al. [74]: screwing on a bottle cap and placing a shaped block in the correct hole. Levine et al. [74] were able to train visuomotor policies in an end-to-end fashion, showing that visual servoing could be learned directly from raw camera inputs by using deep neural networks. (e) A real room, in which a wheeled robot trained to navigate the building is given a visual cue as input, and must find the corresponding location [167]. (f) A natural image being captioned by a neural network that uses reinforcement learning to choose where to look [166]. By processing a small portion of the image for every word generated, the network can focus its attention on the most salient points. Figures reproduced from [10, 79, 146, 74, 167, 166], respectively.

And, in the same way that deep learning has been utilised and thereby comprises all the necessary information for the across many branches of machine learning, it seems likely agent to take the best action, which can include parts of the that in the future, DRL will be an important component in agent, such as the position of its actuators and sensors. In the constructing general AI systems [68]. optimal control literature, states and actions are often denoted by x t and u t , respectively. II. R EWARD - DRIVEN B EHAVIOUR

Before examining the contributions of deep neural networks to RL, we will introduce the field of RL in general. The essence of RL is learning through interaction . An RL agent The best sequence of actions is determined by the rewards interacts with its environment and, upon observing the conse- provided by the environment. Every time the environment quences of its actions, can learn to alter its own behaviour in transitions to a new state, it also provides a scalar reward response to rewards received. This paradigm of trial-and error- r t +1 to the agent as feedback. The goal of the agent is to learning has its roots in behaviourist psychology, and is one learn a policy (control strategy) π that maximises the expected of the main foundations of RL [135]. The other key influence return (cumulative, discounted reward). Given a state, a policy on RL is optimal control, which has lent the mathematical returns an action to perform; an optimal policy is any policy formalisms (most notably dynamic programming [13]) that that maximises the expected return in the environment. In underpin the field. this respect, RL aims to solve the same problem as optimal In the RL set-up, an autonomous agent , controlled by control. However, the challenge in RL is that the agent needs a machine learning algorithm, observes a state s t from its to learn about the consequences of actions in the environment environment at timestep t . The agent interacts with the envi- by trial and error, as, unlike in optimal control, a model of the ronment by taking an action a t in state s t . When the agent state transition dynamics is not available to the agent. Every takes an action, the environment and the agent transition to interaction with the environment yields information, which the a new state s t +1 based on the current state and the chosen agent uses to update its knowledge. This perception-action- action. The state is a sufficient statistic of the environment learning loop is illustrated in Figure 2.

Fig. 2. The perception-action-learning loop. At time t , the agent receives state s t from the environment. The agent uses its policy to choose an action a t . Once the action is executed, the environment transitions a step, providing the next state s t +1 as well as feedback in the form of a reward r t +1 . The agent uses knowledge of state transitions, of the form ( s t , a t , s t +1 , r t +1 ) , in order to learn and improve its policy.

- Markov Decision Processes observation o t ∈ Ω , where the distribution of the observation Formally, RL can be described as a Markov decision process p ( o t +1 | s t +1 , a t ) is dependent on the current state and the (MDP), which consists of: previous action [56]. In a control and signal processing con-

- A set of states S , plus a distribution of starting states text, the observation would be described by a measurement/ p ( s ) . observation mapping in a state-space-model that depends on

- A set of actions A . the current state and the previously applied action.

- Transition dynamics T ( s t +1 | s t , a t ) that map a state- POMDP algorithms typically maintain a belief over the action pair at time t onto a distribution of states at time current state given the previous belief state, the action taken t + 1 . and the current observation. A more common approach in

- An immediate/instantaneous reward function deep learning is to utilise recurrent neural networks (RNNs) R ( s t , a t , s t +1 ) . [163, 44, 45, 85, 96], which, unlike feedforward neural

- A discount factor γ ∈ [0 , 1] , where lower values place networks, are dynamical systems. This approach to solving more emphasis on immediate rewards. POMDPs is related to other problems using dynamical systems In general, the policy π is a mapping from states to a and state space models, where the true state can only be probability distribution over actions: π : S → p ( A = a |S ) . If estimated [16]. the MDP is episodic , i.e., the state is reset after each episode of B. Challenges in RL length T , then the sequence of states, actions and rewards in an episode constitutes a trajectory or rollout of the policy. Every It is instructive to emphasise some challenges faced in RL:

rollout of a policy accumulates rewards from the environment, •

∑ The optimal policy must be inferred by trial-and-error

T − t

resulting in the return R =

t =0

γ r t +1 . The goal of RL is interaction with the environment. The only learning signal

∗

to find an optimal policy, π , which achieves the maximum the agent receives is the reward. expected return from all states: • The observations of the agent depend on its actions and

∗

can contain strong temporal correlations. π = argmax E [ R | π ] . (1)

- π

Agents must deal with long-range time dependencies: Often the consequences of an action only materialise after It is also possible to consider non-episodic MDPs, where many transitions of the environment. This is known as the T = ∞ . In this situation, γ < prevents an infinite sum (temporal) credit assignment problem [135]. of rewards from being accumulated. Furthermore, methods that rely on complete trajectories are no longer applicable, We will illustrate these challenges in the context of an but those that use a finite set of transitions still are. indoor robotic visual navigation task: if the goal location is A key concept underlying RL is the Markov property— specified, we may be able to estimate the distance remaining only the current state affects the next state, or in other words, (and use it as a reward signal), but it is unlikely that we will the future is conditionally independent of the past given know exactly what series of actions the robot needs to take the present state. This means that any decisions made at s t to reach the goal. As the robot must choose where to go as it can be based solely on s t − , rather than { s , s , . . . , s t − } . navigates the building, its decisions influence which rooms it Although this assumption is held by the majority of RL sees and, hence, the statistics of the visual sequence captured. algorithms, it is somewhat unrealistic, as it requires the states Finally, after navigating several junctions, the robot may find to be fully observable . A generalisation of MDPs are partially itself in a dead end. There is a range of problems, from observable MDPs (POMDPs), in which the agent receives an learning the consequences of actions to balancing exploration

π π

against exploitation, but ultimately these can all be addressed Q ), which results in setting Y = r t + γQ ( s t +1 , a t +1 ) . Q -

π

formally within the framework of RL. learning is off-policy , as Q is instead updated by transitions III. R EINFORCEMENT L EARNING A LGORITHMS

that were not necessarily generated by the derived policy.

π

So far, we have introduced the key formalism used in RL, Instead, Q -learning uses Y = r t + γ max a Q ( s t +1 , a ) , which

∗

the MDP, and briefly noted some challenges in RL. In the directly approximates Q .

∗ π

following, we will distinguish between different classes of To find Q from an arbitrary Q , we use generalised

RL algorithms. There are two main approaches to solving policy iteration , where policy iteration consists of policy eval-

RL problems: methods based on value functions and methods uation and policy improvement . Policy evaluation improves

based on policy search . There is also a hybrid, actor-critic the estimate of the value function, which can be achieved

approach, which employs both value functions and policy by minimising TD errors from trajectories experienced by

search. We will now explain these approaches and other useful following the policy. As the estimate improves, the policy can

concepts for solving RL problems. naturally be improved by choosing actions greedily based on the updated value function. Instead of performing these steps A. Value Functions separately to convergence (as in policy iteration), generalised Value function methods are based on estimating the value policy iteration allows for interleaving the steps, such that (expected return) of being in a given state. The state-value progress can be made more rapidly.

π

function V ( s ) is the expected return when starting in state s B. Sampling and following π henceforth: Instead of bootstrapping value functions using dynamic

π

V ( s ) = E [ R | s , π ] (2) programming methods, Monte Carlo methods estimate the expected return (2) from a state by averaging the return from

∗

The optimal policy, π , has a corresponding state-value multiple rollouts of a policy. Because of this, pure Monte Carlo

∗

function V ( s ) , and vice-versa, the optimal state-value func- methods can also be applied in non-Markovian environments. tion can be defined as On the other hand, they can only be used in episodic MDPs,

∗ π

as a rollout has to terminate for the return to be calculated. V ( s ) = max V ( s ) ∀ s ∈ S . (3)

π

It is possible to get the best of both methods by combining

∗

TD learning and Monte Carlo policy evaluation, as in done in If we had V ( s ) available, the optimal policy could be re- the TD( λ ) algorithm [135]. Similarly to the discount factor, trieved by choosing among all actions available at s t and pick-

∗

the λ in TD( λ ) is used to interpolate between Monte Carlo ing the action a that maximises E s t +1 ∼T ( s t +1 | s t , a ) [ V ( s t +1 )] . evaluation and bootstrapping. As demonstrated in Figure 3, In the RL setting, the transition dynamics T are unavailable. this results in an entire spectrum of RL methods based around Therefore, we construct another function, the state-action-

π π

the amount of sampling utilised. value or quality function Q ( s , a ) , which is similar to V , Another major value-function based method relies on learn- except that the initial action a is provided, and π is only π

ing the advantage function A ( s , a ) [6, 43]. Unlike producing followed from the succeeding state onwards: π π

absolute state-action values, as with Q , A instead represents

π relative state-action values. Learning relative values is akin Q ( s , a ) = E [ R | s , a , π ] . (4) to removing a baseline or average level of a signal; more

π

The best policy, given Q ( s , a ) , can be found by choosing a intuitively, it is easier to learn that one action has better

π

greedily at every state: argmax a

Q ( s , a ) . Under this policy, consequences than another, than it is to learn the actual return

π π π π

we can also define V ( s ) by maximising Q ( s , a ) : V ( s ) = from taking the action. A represents a relative advantage

π π π π

max a Q ( s , a ) . of actions through the simple relationship A = Q − V ,

π

Dynamic Programming: To actually learn Q , we exploit and is also closely related to the baseline method of variance

the Markov property and define the function as a Bellman reduction within gradient-based policy search methods [164].

equation [13], which has the following recursive form: The idea of advantage updates has been utilised in many recent DRL algorithms [157, 40, 85, 123].

π π

Q ( s t , a t ) = E s t +1

```
[ r t +1 + γQ ( s t +1 , π ( s t +1 ))] . (5)
C. Policy Search
```

π

This means that Q can be improved by bootstrapping , i.e., Policy search methods do not need to maintain a value

π

we can use the current values of our estimate of Q to improve function model, but directly search for an optimal policy

∗

our estimate. This is the foundation of Q -learning [159] and π . Typically, a parameterised policy π θ is chosen, whose

the state-action-reward-state-action (SARSA) algorithm [112]: parameters are updated to maximise the expected return E [ R | θ ] using either gradient-based or gradient-free optimisation [26].

π π

Q ( s t , a t ) ← Q ( s t , a t ) + αδ, (6) Neural networks that encode policies have been successfully trained using both gradient-free [37, 23, 64] and gradient-

π

| poral difference (TD) error; here, | Y         | is a target as in a standard | optimisation can effectively cover low-dimensional parameter |
| ---------------------------------- | --------- | ---------------------------- | ------------------------------------------------------------ |
| regression problem. SARSA, an      | on-policy | learning algorithm,          | spaces, but despite some successes in applying them to large |

π

is used to improve the estimate of Q by using transitions networks [64], gradient-based training remains the method of generated by the behavioural policy (the policy derived from choice for most DRL algorithms, being more sample-efficient

Fig. 3. Two dimensions of RL algorithms, based on the backups used to learn Fig. 4. Actor-critic set-up. The actor (policy) receives a state from the or construct a policy. At the extremes of these dimensions are (a) dynamic environment and chooses an action to perform. At the same time, the critic programming, (b) exhaustive search, (c) one-step TD learning and (d) pure (value function) receives the state and reward resulting from the previous Monte Carlo approaches. Bootstrapping extends from (c) 1-step TD learning interaction. The critic uses the TD error calculated from this information to to n -step TD learning methods [135], with (d) pure Monte Carlo approaches update itself and the actor. Recreated from [135]. not relying on bootstrapping at all. Another possible dimension of variation is choosing to (c, d) sample actions versus (a, b) taking the expectation over all choices. Recreated from [135].

when policies possess a large number of parameters. the log-likelihood in supervised learning. Intuitively, gradient

When constructing the policy directly, it is common to ascent using the estimator increases the log probability of the

output parameters for a probability distribution; for continuous sampled action, weighted by the return. More formally, the

actions, this could be the mean and standard deviations of REINFORCE rule can be used to compute the gradient of an

Gaussian distributions, whilst for discrete actions this could expectation over a function f of a random variable X with

be the individual probabilities of a multinomial distribution. respect to parameters θ :

The result is a stochastic policy from which we can directly ∇ θ E X [ f ( X ; θ )] = E X [ f ( X ; θ ) ∇ θ log p ( X )] . (7) sample actions. With gradient-free methods, finding better policies requires a heuristic search across a predefined class As this computation relies on the empirical return of a of models. Methods such as evolution strategies essentially trajectory, the resulting gradients possess a high variance. perform hill-climbing in a subspace of policies [116], whilst By introducing unbiased estimates that are less noisy it is more complex methods, such as compressed network search, possible to reduce the variance. The general methodology impose additional inductive biases [64]. Perhaps the greatest for performing this is to subtract a baseline, which means advantage of gradient-free policy search is that they can also weighting updates by an advantage rather than the pure return. optimise non-differentiable policies. The simplest baseline is the average return taken over several

Policy Gradients: Gradients can provide a strong learning episodes [164], but many more options are available [123].

signal as to how to improve a parameterised policy. However, Actor-critic Methods: It is possible to combine value

to compute the expected return (1) we need to average over functions with an explicit representation of the policy, resulting

plausible trajectories induced by the current policy parameter- in actor-critic methods, as shown in Figure 4. The “actor”

isation. This averaging requires either deterministic approxi- (policy) learns by using feedback from the “critic” (value

mations (e.g., linearisation) or stochastic approximations via function). In doing so, these methods trade off variance

sampling [26]. Deterministic approximations can only be ap- reduction of policy gradients with bias introduction from value

plied in a model-based setting where a model of the underlying function methods [63, 123].

transition dynamics is available. In the more common model- Actor-critic methods use the value function as a baseline

free RL setting, a Monte Carlo estimate of the expected return for policy gradients, such that the only fundamental difference

is determined. For gradient-based learning, this Monte Carlo between actor-critic methods and other baseline methods are

approximation poses a challenge since gradients cannot pass that actor-critic methods utilise a learned value function. For

through these samples of a stochastic function. Therefore, we this reason, we will later discuss actor-critic methods as a

turn to an estimator of the gradient, known in RL as the REIN- subset of policy gradient methods.

FORCE rule [164], elsewhere known as the score function [34] D. Planning and Learning or likelihood-ratio estimator [36]. The latter name is telling as Given a model of the environment, it is possible to use using the estimator is similar to the practice of optimising dynamic programming over all possible actions (Figure 3

(a)), sample trajectories for heuristic search (as was done by over long time steps, and it may be be pertinent to instead use AlphaGo [128]), or even perform an exhaustive search (Figure a value function to summarise the statistics of the rollouts [46]. 3 (b)). Sutton and Barto [135] define planning as any method We have previously mentioned that representation learning and which utilises a model to produce or improve a policy. This function approximation are key to the success of DRL, but it includes distribution models , which include T and R , and is also true to say that the field of deep learning has inspired sample models , from which only samples of transitions can new ways of thinking about RL. be drawn. Following our review of RL, we will now partition the In RL, we focus on learning without access to the underly- next part of the survey into value function and policy search ing model of the environment. However, interactions with the methods in DRL, starting with the well-known deep Q - environment could be used to learn value functions, policies, network (DQN) [84]. In these sections, we will focus on state- and also a model. Model-free RL methods learn directly of-the-art techniques, as well as the historical works they are from interactions with the environment, but model-based RL built upon. The focus of the state-of-the-art techniques will be methods can simulate transitions using the learned model, on those for which the state space is conveyed through visual resulting in increased sample efficiency. This is particularly inputs, e.g., images and video. To conclude, we will examine important in domains where each interaction with the environ- ongoing research areas and open challenges. ment is expensive. However, learning a model introduces extra IV. V ALUE F UNCTIONS

complexities, and there is always the danger of suffering from The well-known function approximation properties of neural model errors, which in turn affects the learned policy; a com- networks led naturally to the use of deep learning to regress mon but partial solution in this latter scenario is to use model functions for use in RL agents. Indeed, one of the earliest predictive control, where planning is repeated after small success stories in RL is TD-Gammon, a neural network that sequences of actions in the real environment [16]. Although reached expert-level performance in Backgammon in the early deep neural networks can potentially produce very complex 90s [141]. Using TD methods, the network took in the state of and rich models [95, 132, 32], sometimes simpler, more data- the board to predict the probability of black or white winning. efficient methods are preferable [40]. These considerations Although this simple idea has been echoed in later work also play a role in actor-critic methods with learned value [128], progress in RL research has favoured the explicit use functions [63, 123]. of value functions, which can capture the structure underlying E. The Rise of DRL the environment. From early value function methods in DRL,

Many of the successes in DRL have been based on scaling which took simple states as input [109], current methods

up prior work in RL to high-dimensional problems. This is are now able to tackle visually and conceptually complex

due to the learning of low-dimensional feature representations environments [84, 122, 85, 96, 167].

and the powerful function approximation properties of neural A. Function Approximation and the DQN networks. By means of representation learning, DRL can deal We begin our survey of value-function-based DRL al- efficiently with the curse of dimensionality, unlike tabular and gorithms with the DQN [84], pictured in Figure 5, which traditional non-parametric methods [15]. For instance, convo- achieved scores across a wide range of classic Atari 2600 video lutional neural networks (CNNs) can be used as components games [10] that were comparable to that of a professional of RL agents, allowing them to learn directly from raw, high- video games tester. The inputs to the DQN are four greyscale dimensional visual inputs. In general, DRL is based on training frames of the game, concatenated over time, which are initially

∗

deep neural networks to approximate the optimal policy π , processed by several convolutional layers in order to extract

∗ ∗ ∗

and/or the optimal value functions V , Q and A . spatiotemporal features, such as the movement of the ball Although there have been DRL successes with gradient- in “Pong” or “Breakout.” The final feature map from the free methods [37, 23, 64], the vast majority of current works convolutional layers is processed by several fully connected rely on gradients and hence the backpropagation algorithm layers, which more implicitly encode the effects of actions. [162, 111]. The primary motivation is that when available, This contrasts with more traditional controllers that use fixed gradients provide a strong learning signal. In reality, these preprocessing steps, which are therefore unable to adapt their gradients are estimated based on approximations, through processing of the state in response to the learning signal. sampling or otherwise, and as such we have to craft algorithms A forerunner of the DQN—neural fitted Q iteration with useful inductive biases in order for them to be tractable. (NFQ)—involved training a neural network to return the Q - The other benefit of backpropagation is to view the op- value given a state-action pair [109]. NFQ was later extended timisation of the expected return as the optimisation of a to train a network to drive a slot car using raw visual inputs stochastic function [121, 46]. This function can comprise of from a camera over the race track, by combining a deep several parts—models, policies and value functions—which autoencoder to reduce the dimensionality of the inputs with can be combined in various ways. The individual parts, such as a separate branch to predict Q -values [69]. Although the pre- value functions, may not directly optimise the expected return, vious network could have been trained for both reconstruction but can instead embody useful information about the RL and RL tasks simultaneously, it was both more reliable and domain. For example, using a differentiable model and policy, computationally efficient to train the two parts of the network it is possible to forward propagate and backpropagate through sequentially. entire rollouts; on the other hand, innacuracies can accumulate The DQN [84] is closely related to the model proposed

Fig. 5. The deep Q -network [84]. The network takes the state—a stack of greyscale frames from the video game—and processes it with convolutional and fully connected layers, with ReLU nonlinearities in between each layer. At the final layer, the network outputs a discrete action, which corresponds to one of the possible control inputs for the game. Given the current state and chosen action, the game returns a new score. The DQN uses the reward—the difference between the new score and the previous one—to learn from its decision. More precisely, the reward is used to update its estimate of Q , and the error between its previous estimate and its new estimate is backpropagated through the network.

by Lange et al. [69], but was the first RL algorithm that lies in its ability to compactly represent both high-dimensional was demonstrated to work directly from raw visual inputs observations and the Q -function using deep neural networks. and on a wide variety of environments. It was designed such Without this ability, tackling the discrete Atari domain from

π

that the final fully connected layer outputs Q ( s , · ) for all raw visual inputs would be impractical. action values in a discrete set of actions—in this case, the The DQN addressed the fundamental instability problem various directions of the joystick and the fire button. This not of using function approximation in RL [145] by the use of

π

only enables the best action, argmax a

Q ( s , a ) , to be chosen two techniques: experience replay [80] and target networks. after a single forward pass of the network, but also allows the Experience replay memory stores transitions of the form network to more easily encode action-independent knowledge ( s t , a t , s t +1 , r t +1 ) in a cyclic buffer, enabling the RL agent in the lower, convolutional layers. With merely the goal of to sample from and train on previously observed data offline. maximising its score on a video game, the DQN learns to Not only does this massively reduce the amount of interactions extract salient visual features, jointly encoding objects, their needed with the environment, but batches of experience can movements, and, most importantly, their interactions. Using be sampled, reducing the variance of learning updates. Fur- techniques originally developed for explaining the behaviour thermore, by sampling uniformly from a large memory, the of CNNs in object recognition tasks, we can also inspect what temporal correlations that can adversely affect RL algorithms parts of its view the agent considers important (see Figure 6). are broken. Finally, from a practical perspective, batches of data can be efficiently processed in parallel by modern hardware, increasing throughput. Whilst the original DQN algorithm used uniform sampling [84], later work showed that prioritising samples based on TD errors is more effective for learning [118]. We note that although experience replay is typically thought of as a model-free technique, it could actually be considered a simple model [150]. The second stabilising method, introduced by Mnih et al. [84], is the use of a target network that initially contains the weights of the network enacting the policy, but is kept frozen for a large period of time. Rather than having to calculate the TD error based on its own rapidly fluctuating estimates of the Q -values, the policy network uses the fixed target network. During training, the weights of the target network are updated to match the policy network after a fixed number of steps.

Fig. 6. Saliency map of a trained DQN [84] playing “Space Invaders” [10]. Both experience replay and target networks have gone on to

By backpropagating the training signal to the image space, it is possible to see what a neural-network-based agent is attending to. In this frame, the

be used in subsequent DRL works [40, 79, 158, 89].

most salient points—shown with the red overlay—are the laser that the agent B. Q -Function Modifications

recently fired, and also the enemy that it anticipates hitting in a few time steps.

Considering that one of the key components of the DQN is a function approximator for the Q -function, it can benefit from The true underlying state of the game is contained within fundamental advances in RL. van Hasselt [148] showed that bytes of Atari RAM. However, the DQN was the single estimator used in the Q -learning update rule over- designed to directly learn from visual inputs ( × pixel estimates the expected return due to the use of the maximum 8-bit RGB images), which it takes as the state s . It is action value as an approximation of the maximum expected

π

impractical to represent Q ( s , a ) exactly as a lookup table: action value. Double- Q learning provides a better estimate When combined with 18 possible actions, we obtain a Q - through the use of a double estimator [148]. Whilst double-

× ×

table of size |S| × |A| = 18 × . Even if it were Q learning requires an additional function to be learned, later feasible to create such a table, it would be sparsely populated, work proposed using the already available target network from and information gained from one state-action pair cannot be the DQN algorithm, resulting in significantly better results propagated to other state-action pairs. The strength of the DQN with only a small change in the update step [149]. A more

radical proposal by Bellemare et al. [12] was to actually learn rely on evaluating the performance of a population of agents. the full value distribution , rather than just the expectation; this Hence, they are expensive for large populations or agents with provides additional information, such as whether the potential many parameters. However, as black-box optimisation meth- rewards come from a skewed or multimodal distribution. Al- ods they can be used to optimise arbitrary, non-differentiable though the resulting algorithm—based on learning categorical models and naturally allow for more exploration in parameter distributions—was used to construct the Categorical DQN, the space. In combination with a compressed representation of benefits can potentially be applied to any RL algorithm that neural network weights, evolutionary algorithms can even be utilises learned value functions. used to train large networks; such a technique resulted in the Yet another way to adjust the DQN architecture is to first deep neural network to learn an RL task, straight from decompose the Q -function into meaningful functions, such high-dimensional visual inputs [64]. Recent work has reignited

π

as constructing Q by adding together separate layers that interest in evolutionary methods for RL as they can potentially

π

compute the state-value function V and advantage function be distributed at larger scales than techniques that rely on

π

A [157]. Rather than having to come up with accurate Q - gradients [116]. values for all actions, the duelling DQN [157] benefits from a A. Backpropagation through Stochastic Functions

π

single baseline for the state in the form of V , and easier-to-

π

The workhorse of DRL, however, remains backpropagation learn relative values in the form of A . The combination of the [162, 111]. The previously discussed REINFORCE rule [164] duelling DQN with prioritised experience replay [118] is one allows neural networks to learn stochastic policies in a task- of the state-of-the-art techniques in discrete action settings.

π

dependent manner, such as deciding where to look in an Further insight into the properties of A by Gu et al. [40] image to track [120], classify [83] or caption objects [166]. led them to modify the DQN with a convex advantage layer In these cases, the stochastic variable would determine the that extended the algorithm to work over sets of continuous coordinates of a small crop of the image, and hence reduce actions, creating the normalised advantage function (NAF) the amount of computation needed. This usage of RL to make algorithm. Benefiting from experience replay, target networks discrete, stochastic decisions over inputs is known in the deep and advantage updates, NAF is one of several state-of-the-art learning literature as hard attention , and is one of the more techniques in continuous control problems [40]. compelling uses of basic policy search methods in recent years, Some RL domains, such as recommender systems, have having many applications outside of traditional RL domains. very large discrete action spaces, and hence may be difficult to More generally, the ability to backpropagate through stochastic directly deal with. Dulac-Arnold et al. [30] proposed learning functions, using techniques such as REINFORCE [164] or the “action embeddings” over the large set of original actions, “reparameterisation trick” [61, 108], allows neural networks and then using k -nearest neighbors to produce “proto-actions” to be treated as stochastic computation graphs that can be which can be used with traditional RL methods. The idea of optimised over [121], which is a key concept in algorithms using representation learning to create distributed embeddings such as stochastic value gradients (SVGs) [46]. is a particular strength of DRL, and has been successfully B. Compounding Errors utilised for other purposes [161, 100]. Another related scenario in RL is when many actions need to be made simultaneously, Searching directly for a policy represented by a neural

such as specifying the torques in a many-jointed robot, which network with very many parameters can be difficult and can

results in the action space growing exponentially. A naive but suffer from severe local minima. One way around this is to

reasonable approach is to factorise the policy, treating each use guided policy search (GPS), which takes a few sequences

action independently [115]. An alternative is to construct an of actions from another controller (which could be constructed

autoregressive policy, where each action in a single timestep using a separate method, such as optimal control). GPS learns

is predicted conditionally on the state and previously chosen from them by using supervised learning in combination with

actions from the same timestep [106, 5, 168]. Metz et al. importance sampling, which corrects for off-policy samples

[81] used this idea in order to construct the sequential DQN, [73]. This approach effectively biases the search towards a

allowing them to discretise a large action space and outperform good (local) optimum. GPS works in a loop, by optimising

NAF—which is limited by its quadratic advantage function— policies to match sampled trajectories, and optimising tra-

in continous control problems. In a broader context, rather jectory distributions to match the policy and minimise costs.

than dealing directly with primitive actions directly, one may Initially, GPS was used to train neural networks on simulated

choose to invoke “subpolicies” from higher-level policies continuous RL problems [72], but was later utilised to train

[136]; this concept, known as hierarchical reinforcement learn- a policy for a real robot based on visual inputs [74]. This

ing (HRL), will be discussed later. research by Levine et al. [74] showed that it was possible to train visuomotor policies for a robot “end-to-end”, straight V. P OLICY S EARCH

from the RGB pixels of the camera to motor torques, and, Policy search methods aim to directly find policies by means hence, is one of the seminal works in DRL. of gradient-free or gradient-based methods. Prior to the current A more commonly used method is to use a trust region, in surge of interest in DRL, several successful methods in DRL which optimisation steps are restricted to lie within a region eschewed the commonly used backpropagation algorithm in where the approximation of the true cost function still holds. favour of evolutionary algorithms [37, 23, 64], which are By preventing updated policies from deviating too wildly gradient-free policy search algorithms. Evolutionary methods from previous policies, the chance of a catastrophically bad

update is lessened, and many algorithms that use trust regions allowing standard gradients to be used (instead of the high- guarantee or practically result in monotonic improvement in variance REINFORCE estimator [164]). The resulting SVG policy performance. The idea of constraining each policy methods are flexible, and can be used both with (SVG(0) and gradient update, as measured by the Kullback-Leibler (KL) SVG(1)) and without (SVG( ∞ )) value function critics, and divergence between the current and proposed policy, has a long with (SVG( ∞ ) and SVG(1)) and without (SVG(0)) models. history in RL [57, 4, 59, 103]. One of the newer algorithms in Later work proceeded to integrate DPGs and SVGs with this line of work, trust region policy optimisation (TRPO), RNNs, allowing them to solve continuous control problems has been shown to be relatively robust and applicable to in POMDPs, learning directly from pixels [45]. domains with high-dimensional inputs [122]. To achieve this, Value functions introduce a broadly applicable benefit in TRPO optimises a surrogate objective function—specifically, actor-critic methods—the ability to use off-policy data. On- it optimises an (importance sampled) advantage estimate, con- policy methods can be more stable, whilst off-policy methods strained using a quadratic approximation of the KL divergence. can be more data efficient, and hence there have been several Whilst TRPO can be used as a pure policy gradient method attempts to merge the two [158, 94, 41, 39, 42]. Earlier with a simple baseline, later work by Schulman et al. [123] work has either utilised a mix of on-policy and off-policy introduced generalised advantage estimation (GAE), which gradient updates [158, 94, 39], or used the off-policy data proposed several, more advanced variance reduction baselines. to train a value function in order to reduce the variance of The combination of TRPO and GAE remains one of the state- on-policy gradient updates [41]. The more recent work by of-the-art RL techniques in continuous control. However, the Gu et al. [42] unified these methods under interpolated policy constrained optimisation of TRPO requires calculating second- gradients (IPGs), resulting in one of the newest state-of-the- order gradients, limiting its applicability. In contrast, the art continuous DRL algorithms, and also providing insights for newer proximal policy optimisation (PPO) algorithm performs future research in this area. Together, the ideas behind IPGs unconstrained optimisation, requiring only first-order gradient and SVGs (of which DPGs can be considered a special case) information [1, 47, 125]. The two main variants include an form algorithmic approaches for improving learning efficiency adaptive penalty on the KL divergence, and a heuristic clipped in DRL. objective which is independent of the KL divergence [125]. An orthogonal approach to speeding up learning is to Being less expensive whilst retaining the performance of exploit parallel computation. In particular, methods for training TRPO means that PPO (with or without GAE) is gaining networks through asynchronous gradient updates have been popularity for a range of RL tasks [47, 125]. developed for use on both single machines [107] and dis- tributed systems [25]. By keeping a canonical set of parameters C. Actor-Critic Methods that are read by and updated in an asynchronous fashion Instead of utilising the average of several Monte Carlo by multiple copies of a single network, computation can be returns as the baseline for policy gradient methods, actor- efficiently distributed over both processing cores in a single critic approaches have grown in popularity as an effective CPU, and across CPUs in a cluster of machines. Using a means of combining the benefits of policy search methods distributed system, Nair et al. [91] developed a framework with learned value functions, which are able to learn from full for training multiple DQNs in parallel, achieving both better returns and/or TD errors. They can benefit from improvements performance and a reduction in training time. However, the in both policy gradient methods, such as GAE [123], and value simpler asynchronous advantage actor-critic (A3C) algorithm function methods, such as target networks [84]. In the last few [85], developed for both single and distributed machine set- years, DRL actor-critic methods have been scaled up from tings, has become one of the most popular DRL techniques learning simulated physics tasks [46, 79] to real robotic visual in recent times. A3C combines advantage updates with the navigation tasks [167], directly from image pixels. actor-critic formulation, and relies on asynchronously updated One recent development in the context of actor-critic algo- policy and value function networks trained in parallel over rithms are deterministic policy gradients (DPGs) [127], which several processing threads. The use of multiple agents, situated extend the standard policy gradient theorems for stochastic in their own, independent environments, not only stabilises policies [164] to deterministic policies. One of the major improvements in the parameters, but conveys an additional advantages of DPGs is that, whilst stochastic policy gradi- benefit in allowing for more exploration to occur. A3C has ents integrate over both state and action spaces, DPGs only been used as a standard starting point in many subsequent integrate over the state space, requiring fewer samples in works, including the work of Zhu et al. [167], who applied it problems with large action spaces. In the initial work on to robotic navigation in the real world through visual inputs. DPGs, Silver et al. [127] introduced and demonstrated an For simplicity, the underlying algorithm may be used with off-policy actor-critic algorithm that vastly improved upon just one agent, termed advantage actor-critic (A2C) [156]. a stochastic policy gradient equivalent in high-dimensional Alternatively, segments from the trajectories of multiple agents continuous control problems. Later work introduced deep DPG can be collected and processed together in a batch, with (DDPG), which utilised neural networks to operate on high- batch processing more efficiently enabled by GPUs; this dimensional, visual state spaces [79]. In the same vein as synchronous version also goes by the name of A2C [125]. DPGs, Heess et al. [46] devised a method for calculating There have been several major advancements on the original gradients to optimise stochastic policies, by “reparameterising” A3C algorithm that reflect various motivations in the field of [61, 108] the stochasticity away from the network, thereby DRL. The first is actor-critic with experience replay [158, 39],

which adds Retrace( λ ) off-policy bias correction [88] to a it can also learn to downplay this information if it believes Q -value-based A3C, allowing it to use experience replay in that the model is inaccurate [161]. This can be more efficient, order to improve sample complexity. Others have attempted to though less principled, than Bayesian methods for propagating bridge the gap between value and policy-based RL, utilising uncertainty [52]. Another way to make use of the flexiblity theoretical advancements to improve upon the original A3C of neural-network-based models is to let them decide when to [89, 94, 124]. Finally, there is a growing trend towards ex- plan, that is, given a finite amount of computation, whether it is ploiting auxiliary tasks to improve the representations learned worth modelling one long trajectory, several short trajectories, by DRL agents, and, hence, improve both the learning speed anything in-between, or simply to take an action in the real and final performance of these agents [77, 54, 82]. environment [100].

## VI. C URRENT R ESEARCH AND C HALLENGES Although deep neural networks can make reasonable pre-

To conclude, we will highlight some current areas of re- dictions in simulated environments over hundreds of timesteps

search in DRL, and the challenges that still remain. Previously, [21], they typically require many samples to tune the large

we have focused mainly on model-free methods, but we will amount of parameters they contain. Training these models

now examine a few model-based DRL algorithms in more often requires more samples (interaction with the environment)

detail. Model-based RL algorithms play an important role in than simpler models. For this reason, Gu et al. [40] train

making RL data-efficient and in trading off exploration and locally linear models for use with the NAF algorithm—

exploitation. After tackling exploration strategies, we shall the continuous equivalent of the DQN [84]—to improve the

then address HRL, which imposes an inductive bias on the algorithm’s sample complexity in the robotic domain where

final policy by explicitly factorising it into several levels. When samples are expensive. In order to spur the adoption of deep

available, trajectories from other controllers can be used to models in model-based DRL, it is necessary to find strategies

bootstrap the learning process, leading us to imitation learning that can be used in order to improve their data efficiency [90].

and inverse RL (IRL). For the final topic specific to RL, we A less common but potentially useful paradigm exists will look at multi-agent systems, which have their own special between model-free and model-based methods—the successor considerations. We then bring to attention two broader areas— representation (SR) [24]. Rather than picking actions directly the use of RNNs, and transfer learning—in the context of or performing planning with models, learning T is replaced DRL. We then examine the issue of evaluating RL, and current with learning expected (discounted) future occupancies (SRs), benchmarks for DRL. which can be linearly combined with R in order to calculate the optimal action; this decomposition makes SRs more robust A. Model-based RL than model-free methods when the reward structure changes The key idea behind model-based RL is to learn a tran- (but still fallible when T changes). Work extending SRs to sition model that allows for simulation of the environment deep neural networks has demonstrated its usefulness in multi- without interacting with the environment directly. Model-based task settings, whilst within a complex visual environment [66]. RL does not assume specific prior knowledge. However, in practice, we can incorporate prior knowledge (e.g., physics- B. Exploration vs. Exploitation

based models [58]) to speed up learning. Model learning One of the greatest difficulties in RL is the fundamental plays an important role in reducing the amount of required dilemma of exploration versus exploitation : When should the interactions with the (real) environment, which may be limited agent try out (perceived) non-optimal actions in order to in practice. For example, it is unrealistic to perform millions of explore the environment (and potentially improve the model), experiments with a robot in a reasonable amount of time and and when should it exploit the optimal action in order to make without significant hardware wear and tear. There are various useful progress? Off-policy algorithms, such as the DQN [84], approaches to learn predictive models of dynamical systems typically use the simple  -greedy exploration policy, which using pixel information. Based on the deep dynamical model chooses a random action with probability  ∈ [0 , 1] , and the [154], where high-dimensional observations are embedded optimal action otherwise. By decreasing  over time, the agent into a lower-dimensional space using autoencoders, several progresses towards exploitation. Although adding independent model-based DRL algorithms have been proposed for learning noise for exploration is usable in continuous control problems, models and policies from pixel information [95, 160, 155]. If a more sophisticated strategies inject noise that is correlated sufficiently accurate model of the environment can be learned, over time (e.g., from stochastic processes) in order to better then even simple controllers can be used to control a robot preserve momentum [79]. directly from camera images [32]. Learned models can also The observation that temporal correlation is important led be used to guide exploration purely based on simulation of the Osband et al. [97] to propose the bootstrapped DQN, which environment, with deep models allowing these techniques to maintains several Q -value “heads” that learn different values be scaled up to high-dimensional visual domains [132]. through a combination of different weight initialisations and A compelling insight on the benefits of neural-network- bootstrapped sampling from experience replay memory. At based models is that they can overcome some of the problems the beginning of each training episode, a different head is incurred by planning with imperfect models; in effect, by chosen, leading to temporally-extended exploration. Usunier embedding the activations and predictions (outputs) of these et al. [147] later proposed a similar method that performed models into a vector, a DRL agent can not only obtain more exploration in policy space by adding noise to a single output information than just the final result of any model rollouts, but head, using zero-order gradient estimates to allow backpropa-

gation through the policy. when it is unsure, allowing it to learn from states away from One of the main principled exploration strategies is the the optimal trajectories [110]. This has been applied to a deep upper confidence bound (UCB) algorithm, based on the prin- learning setting, where a CNN trained in a visual navigation ciple of “optimism in the face of uncertainty” [67]. The idea task with active learning significantly improved upon a pure behind UCB is to pick actions that maximise E [ R ] + κσ [ R ] , imitation learning baseline [53]. where σ [ R ] is the standard deviation of the return and The goal of IRL is to estimate an unknown reward function κ > . UCB therefore encourages exploration in regions with from observed trajectories that characterise a desired solution high uncertainty and moderate expected return. Whilst easily [92]; IRL can be used in combination with RL to improve achievable in small tabular cases, the use of powerful density upon demonstrated behaviour. Using the power of deep neural models [11], or conversely, hashing [139], has allowed this networks, it is now possible to learn complex, nonlinear reward algorithm to scale to high-dimensional visual domains with functions for IRL [165]. Ho and Ermon [51] showed that poli- DRL. UCB is only one technique for trading off exploration cies are uniquely characterised by their occupancies (visited and exploitation in the context of Bayesian optimisation [126]; state and action distributions) allowing IRL to be reduced to future work in DRL may benefit from investigating other the problem of measure matching. With this insight, they were successful techniques that are used in Bayesian optimisation. able to use generative adversarial training [38] to facilitate UCB can also be considered one way of implementing reward function learning in a more flexible manner, resulting in intrinsic motivation , which is a general concept that advocates the generative adversarial imitation learning (GAIL) algorithm. decreasing uncertainty/making progress in learning about the GAIL was later extended to allow IRL to be applied even when environment [119]. There have been several DRL algorithms receiving expert trajectories from a different visual viewpoint that try to implement intrinsic motivation via minimising to that of the RL agent [131]. In complementary work, Baram model prediction error [132, 101] or maximising information et al. [7] exploit gradient information that was not used in gain [86, 52]. GAIL to learn models within the IRL process.

- Hierarchical RL E. Multi-agent RL In the same way that deep learning relies on hierarchies Usually, RL considers a single learning agent in a sta- of features, HRL relies on hierarchies of policies. Early work tionary environment. In contrast, multi-agent RL (MARL) in this area introduced options , in which, apart from primi- considers multiple agents learning through RL, and often the tive actions (single-timestep actions), policies could also run non-stationarity introduced by other agents changing their other policies (multi-timestep “actions”) [136]. This approach behaviours as they learn [18]. In DRL, the focus has been allows top-level policies to focus on higher-level goals , whilst on enabling (differentiable) communication between agents, subpolicies are responsible for fine control. Several works in which allows them to co-operate. Several approaches have DRL have attempted HRL by using one top-level policy that been proposed for this purpose, including passing messages chooses between subpolicies, where the division of states or to agents sequentially [33], using a bidirectional channel goals in to subpolicies is achieved either manually [2, 143, 65] (providing ordering with less signal loss) [102], and an all- or automatically [3, 151, 152]. One way to help construct to-all channel [134]. The addition of communication channels subpolicies is to focus on discovering and reaching goals, is a natural strategy to apply to MARL in complex scenarios which are specific states in the environment; they may often be and does not preclude the usual practice of modelling co- locations, which an agent should navigate to. Whether utilised operative or competing agents as applied elsewhere in the with HRL or not, the discovery and generalisation of goals is MARL literature [18]. Other DRL works of note in MARL also an important area of ongoing research [117, 66, 152]. investigate the effects of learning and sequential decision

- Imitation Learning and Inverse RL making in game theory [48, 71].

One may ask why, if given a sequence of “optimal” actions F. Memory and Attention from expert demonstrations, it is not possible to use supervised As one of the earliest works in DRL the DQN spawned learning in a straightforward manner—a case of “learning many extensions. One of the first extensions was converting from demonstration”. This is indeed possible, and is known the DQN into an RNN, which allows the network to better as behavioural cloning in traditional RL literature. Taking deal with POMDPs by integrating information over long time advantage of the stronger signals available in supervised learn- periods. Like recursive filters, recurrent connections provide an ing problems, behavioural cloning enjoyed success in earlier efficient means of acting conditionally on temporally distant neural network research, with the most notable success being prior observations. By using recurrent connections between ALVINN, one of the earliest autonomous cars [104]. However, its hidden units, the deep recurrent Q -network (DRQN) in- behavioural cloning cannot adapt to new situations, and small troduced by Hausknecht and Stone [44] was able to suc- deviations from the demonstration during the execution of the cessfully infer the velocity of the ball in the game “Pong,” learned policy can compound and lead to scenarios where the even when frames of the game were randomly blanked out. policy is unable to recover. A more generalisable solution is Further improvements were gained by introducing attention — to use provided trajectories to guide the learning of suitable a technique where additional connections are added from the state-action pairs, but fine-tune the agent using RL [49]. recurrent units to lower layers—to the DRQN, resulting in the Alternatively, if the expert is still available to query during deep attention recurrent Q -network (DARQN) [130]. Attention training, the agent can use active learning to gather extra data gives a network the ability to choose which part of its next

input to focus on, and allowed the DARQN to beat both mally changing pixel inputs), plus reward prediction and value the DQN and DRQN on games, which require longer-term function learning from experience replay [54]. Meanwhile, the planning. However, the DQN outperformed the DRQN and A3C-based agent of Mirowski et al. [82] was additionally DARQN on games requiring quick reactions, where Q -values trained to construct a depth map given RGB inputs, which can fluctuate more rapidly. helps it in its task of learning to navigate a 3D environment. Taking recurrent processing further, it is possible to add a In an ablation study, Mirowski et al. [82] showed the predicting differentiable memory to the DQN, which allows it to more depth was more useful than receiving depth as an extra input, flexibly process information in its “working memory” [96]. In lending further support to the idea that gradients induced by traditional RNNs, recurrent units are responsible for both per- auxiliary tasks can be extremely effective at boosting DRL. forming calculations and storing information. Differentiable Transfer learning can also be used to construct more memories add large matrices that are purely used for storing data- and parameter-efficient policies. In the student-teacher information, and can be accessed using differentiable read paradigm in machine learning, one can first train a more and write operations, analagously to computer memory. With powerful “teacher” model, and then use it to guide the training their key-value-based memory Q -network (MQN), Oh et al. of a less powerful “student” model. Whilst originally applied [96] constructed an agent that could solve a simple maze to supervised learning, the neural network knowledge transfer built in Minecraft, where the correct goal in each episode technique known as distillation [50] has been utilised to both was indicated by a coloured block shown near the start of transfer policies learned by large DQNs to smaller DQNs, and the maze. The MQN, and especially its more sophisticated transfer policies learned by several DQNs trained on separate variants, significantly outperformed both DQN and DRQN games to one single DQN [99, 113]. Together, the combination baselines, highlighting the importance of using decoupled of multitask and transfer learning can improve the sample memory storage. More recent work, where the memory was efficiency and robustness of current DRL algorithms [140]. given a 2D structure in order to resemble a spatial map, hints These are important topics if we wish to construct agents that at future research where more specialised memory structures can accomplish a wide range of tasks, since naively training will be developed to address specific problems, such as 2D or on multiple RL objectives at once may be infeasible. 3D navigation [98]. Alternatively, differentiable memories can H. Benchmarks be used as approximate hash tables, allowing DRL algorithms to store and retrieve successful experiences to facilitate rapid One of the challenges in any field in machine learning is

learning [105]. developing a standardised way to evaluate new techniques.

Note that RNNs are not restricted to value-function-based Although much early work focused on simple, custom MDPs,

methods but have also been successfully applied to policy there shortly emerged control problems that could be used as

search [163] and actor-critic methods [45, 85]. standard benchmarks for testing new algorithms, such as the Cartpole [8] and Mountain Car [87] domains. G. Transfer Learning However, these problems were limited to relatively small Even though DRL algorithms can process high-dimensional state spaces, and therefore failed to capture the complexities inputs, it is rarely feasible to train RL agents directly on that would be encountered in most realistic scenarios. Ar- visual inputs in the real world, due to the large number of guably the initial driver of DRL, the ALE provided an interface samples required. To speed up learning in DRL, it is possible to Atari 2600 video games, with code to access over 50 games to exploit previously acquired knowledge from related tasks, provided with the initial release [10]. As video games can vary which comes in several guises: transfer learning, multitask greatly, but still present interesting and challenging objectives learning [20] and curriculum learning [14] to name a few. for humans, they provide an excellent testbed for RL agents. There is much interest in transferring learning from one task to As the first algorithm to successfully play a range of these another, particularly from training in physics simulators with games directly from their visuals, the DQN [84] has secured visual renderers and fine-tuning the models in the real world. its place as a milestone in the development of RL algorithms. This can be achieved in a naive fashion, directly using the This success story has started a trend of using video games same network in both the simulated and real phases [167], or as standardised RL testbeds, with several interesting options with more sophisticated training procedures that directly try now available. ViZDoom provides an interface to the Doom to mitigate the problem of neural networks “catastrophically first-person shooter [60], and echoing the popularity of e- forgetting” old knowledge by adding extra layers when trans- sports competitions, ViZDoom competitions are now held at ferring domain [114, 115]. Other approaches involve directly the yearly IEEE Conference on Computational Intelligence learning an alignment between simulated and real visuals in Games. Facebook’s TorchCraft [137] and DeepMind’s [146], or even between two different camera viewpoints [131]. StarCraft II Learning Environment [153] respectively provide A different form of transfer can be utilised to help RL in interfaces to the StarCraft and StarCraft II real-time strategy the form of multitask training [77, 54, 82]. Especially with games, presenting challenges in both micromanagement and neural networks, supervised and unsupervised learning tasks long-term planning. In an aim to provide more flexible envi- can help train features that can be used by RL agents, making ronments, DeepMind Lab was developed on top of the Quake optimising the RL objective easier to achieve. For example, III Arena first-person shooter engine [9], and Microsoft’s the “unsupervised reinforcement and auxiliary learning” A3C- Project Malmo exposed an interface to the Minecraft sandbox based agent is additionally trained with “pixel control” (maxi- game [55]. Both environments provide customisable platforms

for RL agents in 3D environments. PhD funding from the Department of Bioengineering, Imperial Most DRL approaches focus on discrete actions, but some College London. This research has been partially funded by a solutions have also been developed for continuous control Google Faculty Research Award to Marc Deisenroth. problems. Many DRL papers in continuous control [122, 46, R EFERENCES

79, 85, 7, 131] have used the MuJoCo physics engine to

[1] Pieter Abbeel and John Schulman. Deep Reinforcement Learning

obtain relatively realistic dynamics for multi-joint continuous through Policy Optimization, 2016. Tutorial at NIPS 2016.

control problems [144], and there has now been some effort [2] Kai Arulkumaran, Nat Dilokthanakul, Murray Shanahan, and Anil An-

to standardise these problems [28].

thony Bharath. Classifying Options for Deep Reinforcement Learning. In IJCAI Workshop on Deep Reinforcement Learning: Frontiers and

To help with standardisation and reproducibility, most of Challenges , 2016.

the aforementioned RL domains and more have been made [3] Pierre-Luc Bacon, Jean Harb, and Doina Precup. The Option-Critic Architecture. In AAAI , 2017.

available in the OpenAI Gym, a library and online service

[4] J Andrew Bagnell and Jeff Schneider. Covariant Policy Search. In

that allows people to easily interface with and publicly share IJCAI , 2003.

the results of RL algorithms on these domains [17]. [5] Dzmitry Bahdanau, Philemon Brakel, Kelvin Xu, Anirudh Goyal, Ryan Lowe, Joelle Pineau, Aaron Courville, and Yoshua Bengio. An Actor-

VII. C ONCLUSION : B EYOND P ATTERN R ECOGNITION Critic Algorithm for Sequence Prediction. In ICLR , 2017.

Despite the successes of DRL, many problems need to be

[6] Leemon C Baird III. Advantage Updating. Technical report, DTIC, 1993.

addressed before these techniques can be applied to a wide [7] Nir Baram, Oron Anschel, and Shie Mannor. Model-Based Adver-

range of complex real-world problems [68]. Recent work with sarial Imitation Learning. In NIPS Workshop on Deep Reinforcement

(non-deep) generative causal models demonstrated superior

Learning , 2016. [8] Andrew G Barto, Richard S Sutton, and Charles W Anderson. Neu-

generalisation over standard DRL algorithms [85, 114] in ronlike Adaptive Elements That Can Solve Difficult Learning Control

some benchmarks [10], achieved by reasoning about causes Problems. IEEE Trans. on Systems, Man, and Cybernetics , (5):834–

and effects in the environment [58]. For example, the schema

846, 1983. [9] Charles Beattie, Joel Z Leibo, Denis Teplyashin, Tom Ward, Marcus

networks of Kanksy et al. [58] trained on the game “Breakout” Wainwright, Heinrich K¨ uttler, Andrew Lefrancq, Simon Green, V´ ıctor

immediately adapted to a variant where a small wall was Vald´ es, Amir Sadik, et al. DeepMind Lab. arXiv:1612.03801 , 2016.

placed in front of the target blocks, whilst progressive (A3C)

| [10] | Marc G Bellemare, Yavar Naddaf, Joel Veness, and Michael Bowl- |
| ---- | -------------------------------------------------------------- |
| ing. | The Arcade Learning Environment: An Evaluation Platform for    |

networks [114] failed to match the performance of the schema General Agents. In IJCAI , 2015.

networks even after training on the new domain. Although [11] Marc G Bellemare, Sriram Srinivasan, Georg Ostrovski, Tom Schaul,

DRL has already been combined with AI techniques, such as

| David Saxton, and R´         | emi Munos. | Unifying Count-Based Exploration |
| ---------------------------- | ---------- | -------------------------------- |
| and Intrinsic Motivation. In | NIPS       | , 2016.                          |

search [128] and planning [138], a deeper integration with [12] Marc G Bellemare, Will Dabney, and R´ emi Munos. A Distributional

other traditional AI approaches promises benefits such as Perspective on Reinforcement Learning. In ICML , 2017.

better sample complexity, generalisation and interpretability

[13] Richard Bellman. On the Theory of Dynamic Programming. PNAS , 38(8):716–719, 1952.

[35]. In time, we also hope that our theoretical understanding [14] Yoshua Bengio, J´ erˆ ome Louradour, Ronan Collobert, and Jason We-

of the properties of neural networks (particularly within DRL) ston. Curriculum Learning. In ICML , 2009.

will improve, as it currently lags far behind practice.

[15] Yoshua Bengio, Aaron Courville, and Pascal Vincent. Representation Learning: A Review and New Perspectives. IEEE Trans. on Pattern

To conclude, it is worth revisiting the overarching goal Analysis and Machine Intelligence , 35(8):1798–1828, 2013.

of all of this research: the creation of general-purpose AI [16] Dimitri P Bertsekas. Dynamic Programming and Suboptimal Control:

systems that can interact with and learn from the world around

A Survey from ADP to MPC. European Journal of Control , 11(4-5): 310–334, 2005.

them. Interaction with the environment is simultaneously the [17] Greg Brockman, Vicki Cheung, Ludwig Pettersson, Jonas Schneider,

advantage and disadvantage of RL. Whilst there are many John Schulman, Jie Tang, and Wojciech Zaremba. OpenAI Gym.

challenges in seeking to understand our complex and ever-

arXiv:1606.01540 , 2016. [18] Lucian Busoniu, Robert Babuska, and Bart De Schutter. A Compre-

changing world, RL allows us to choose how we explore hensive survey of Multiagent Reinforcement Learning. IEEE Trans. on

it. In effect, RL endows agents with the ability to perform Systems, Man, And Cybernetics , 2008.

experiments to better understand their surroundings, enabling

[19] Murray Campbell, A Joseph Hoane, and Feng-hsiung Hsu. Deep Blue. Artificial Intelligence , 134(1-2):57–83, 2002.

them to learn even high-level causal relationships. The avail- [20] Rich Caruana. Multitask Learning. Machine Learning , 28(1):41–75,

ability of high-quality visual renderers and physics engines 1997.

now enables us to take steps in this direction, with works that

[21] Silvia Chiappa, S´ ebastien Racaniere, Daan Wierstra, and Shakir Mo- hamed. Recurrent Environment Simulators. In ICLR , 2017.

try to learn intuitive models of physics in visual environments [22] Paul Christiano, Zain Shah, Igor Mordatch, Jonas Schneider, Trevor

[27]. Challenges remain before this will be possible in the real Blackwell, Joshua Tobin, Pieter Abbeel, and Wojciech Zaremba. Trans-

world, but steady progress is being made in agents that learn

fer from Simulation to Real World through Learning Deep Inverse Dynamics Model. arXiv:1610.03518 , 2016.

the fundamental principles of the world through observation [23] Giuseppe Cuccu, Matthew Luciw, J¨ urgen Schmidhuber, and Faustino

and action. Perhaps, then, we are not too far away from Gomez. Intrinsically Motivated Neuroevolution for Vision-Based

AI systems that learn and act in more human-like ways in

Reinforcement Learning. In ICDL , volume 2, 2011. [24] Peter Dayan. Improving Generalization for Temporal Difference

increasingly complex environments. Learning: The Successor Representation. Neural Computation , 5(4): 613–624, 1993.

A CKNOWLEDGMENTS [25] Jeffrey Dean, Greg Corrado, Rajat Monga, Kai Chen, Matthieu Devin,

The authors would like to thank the reviewers and broader Mark Mao, Andrew Senior, Paul Tucker, Ke Yang, Quoc V Le, et al.

community for their feedback on this survey; in particular,

Large Scale Distributed Deep Networks. In NIPS , 2012. [26] Marc P Deisenroth, Gerhard Neumann, and Jan Peters. A Survey on

we would like to thank Nicolas Heess for clarifications on

Policy Search for Robotics. Foundations and Trends © R in Robotics , 2

several points. Kai Arulkumaran would like to acknowledge (1–2), 2013.

[27] Misha Denil, Pulkit Agrawal, Tejas D Kulkarni, Tom Erez, Peter [53] Ahmed Hussein, Mohamed Medhat Gaber, and Eyad Elyan. Deep Battaglia, and Nando de Freitas. Learning to Perform Physics Ex- Active Learning for Autonomous Navigation. In EANN , 2016. periments via Deep Reinforcement Learning. In ICLR , 2017. [54] Max Jaderberg, Volodymyr Mnih, Wojciech Marian Czarnecki, Tom [28] Yan Duan, Xi Chen, Rein Houthooft, John Schulman, and Pieter Schaul, Joel Z Leibo, David Silver, and Koray Kavukcuoglu. Re- Abbeel. Benchmarking Deep Reinforcement Learning for Continuous inforcement Learning with Unsupervised Auxiliary Tasks. In ICLR , Control. In ICML , 2016. 2017. [29] Yan Duan, John Schulman, Xi Chen, Peter L Bartlett, Ilya Sutskever, [55] Matthew Johnson, Katja Hofmann, Tim Hutton, and David Bignell. and Pieter Abbeel. RL : Fast Reinforcement Learning via Slow The Malmo Platform for Artificial Intelligence Experimentation. In Reinforcement Learning. In NIPS Workshop on Deep Reinforcement IJCAI , 2016. Learning , 2016. [56] Leslie P Kaelbling, Michael L Littman, and Anthony R Cassandra. [30] Gabriel Dulac-Arnold, Richard Evans, Hado van Hasselt, Peter Sune- Planning and Acting in Partially Observable Stochastic Domains. hag, Timothy Lillicrap, Jonathan Hunt, Timothy Mann, Theophane We- Artificial Intelligence , 101(1):99–134, 1998. ber, Thomas Degris, and Ben Coppin. Deep Reinforcement Learning [57] Sham M Kakade. A Natural Policy Gradient. In NIPS , 2002. in Large Discrete Action Spaces. arXiv:1512.07679 , 2015. [58] Ken Kansky, Tom Silver, David A M´ ely, Mohamed Eldawy, Miguel [31] David Ferrucci, Eric Brown, Jennifer Chu-Carroll, James Fan, David L´ azaro-Gredilla, Xinghua Lou, Nimrod Dorfman, Szymon Sidor, Scott Gondek, Aditya A Kalyanpur, Adam Lally, J William Murdock, Eric Phoenix, and Dileep George. Schema Networks: Zero-Shot Transfer Nyberg, John Prager, et al. Building Watson: An Overview of the with a Generative Causal Model of Intuitive Physics. In ICML , 2017. DeepQA Project. AI Magazine , 31(3):59–79, 2010. [59] Hilbert J Kappen. Path Integrals and Symmetry Breaking for Optimal [32] Chelsea Finn, Xin Yu Tan, Yan Duan, Trevor Darrell, Sergey Levine, Control Theory. JSTAT , 2005(11):P11011, 2005. and Pieter Abbeel. Deep Spatial Autoencoders for Visuomotor Learn- [60] Michał Kempka, Marek Wydmuch, Grzegorz Runc, Jakub Toczek, and ing. In ICRA , 2016. Wojciech Ja´ skowski. ViZDoom: A Doom-Based AI Research Platform [33] Jakob Foerster, Yannis M Assael, Nando de Freitas, and Shimon White- for Visual Reinforcement Learning. In CIG , 2016. son. Learning to Communicate with Deep Multi-Agent Reinforcement [61] Diederik P Kingma and Max Welling. Auto-Encoding Variational Learning. In NIPS , 2016. Bayes. In ICLR , 2014. [34] Michael C Fu. Gradient Estimation. Handbooks in Operations [62] Nate Kohl and Peter Stone. Policy Gradient Reinforcement Learning Research and Management Science , 13:575–616, 2006. for Fast Quadrupedal Locomotion. In ICRA , volume 3, 2004. [35] Marta Garnelo, Kai Arulkumaran, and Murray Shanahan. Towards [63] Vijay R Konda and John N Tsitsiklis. On Actor-Critic Algorithms. Deep Symbolic Reinforcement Learning. In NIPS Workshop on Deep SICON , 42(4):1143–1166, 2003. Reinforcement Learning , 2016. [64] Jan Koutn´ ık, Giuseppe Cuccu, J¨ urgen Schmidhuber, and Faustino [36] Peter W Glynn. Likelihood Ratio Gradient Estimation for Stochastic Gomez. Evolving Large-Scale Neural Networks for Vision-Based Systems. Communications of the ACM , 33(10):75–84, 1990. Reinforcement Learning. In GECCO , 2013. [37] Faustino Gomez and J¨ urgen Schmidhuber. Evolving Modular Fast- [65] Tejas D Kulkarni, Karthik Narasimhan, Ardavan Saeedi, and Josh Weight Networks for Control. In ICANN , 2005. Tenenbaum. Hierarchical Deep Reinforcement Learning: Integrating [38] Ian Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Temporal Abstraction and Intrinsic Motivation. In NIPS , 2016. Warde-Farley, Sherjil Ozair, Aaron Courville, and Yoshua Bengio. [66] Tejas D Kulkarni, Ardavan Saeedi, Simanta Gautam, and Samuel J Ger- Generative Adversarial Nets. In NIPS , 2014. shman. Deep Successor Reinforcement Learning. In NIPS Workshop [39] Audrunas Gruslys, Mohammad Gheshlaghi Azar, Marc G Bellemare, on Deep Reinforcement Learning , 2016. and R´ emi Munos. The Reactor: A Sample-Efficient Actor-Critic [67] Tze Leung Lai and Herbert Robbins. Asymptotically Efficient Adaptive Architecture. arXiv:1704.04651 , 2017. Allocation Rules. Advances in Applied Mathematics , 6(1):4–22, 1985. [40] Shixiang Gu, Timothy Lillicrap, Ilya Sutskever, and Sergey Levine. [68] Brenden M Lake, Tomer D Ullman, Joshua B Tenenbaum, and Continuous Deep Q-Learning with Model-Based Acceleration. In Samuel J Gershman. Building Machines That Learn and Think Like ICLR , 2016. People. The Behavioral and Brain Sciences , page 1, 2016. [41] Shixiang Gu, Timothy Lillicrap, Zoubin Ghahramani, Richard E [69] Sascha Lange, Martin Riedmiller, and Arne Voigtlander. Autonomous Turner, and Sergey Levine. Q-Prop: Sample-Efficient Policy Gradient Reinforcement Learning on Raw Visual Input Data in a Real World with an Off-Policy Critic. In ICLR , 2017. Application. In IJCNN , 2012. [42] Shixiang Gu, Timothy Lillicrap, Zoubin Ghahramani, Richard E [70] Yann LeCun, Yoshua Bengio, and Geoffrey Hinton. Deep Learning. Turner, Bernhard Sch¨ olkopf, and Sergey Levine. Interpolated Policy Nature , 521(7553):436–444, 2015. Gradient: Merging On-Policy and Off-Policy Gradient Estimation for [71] Joel Z Leibo, Vinicius Zambaldi, Marc Lanctot, Janusz Marecki, and Deep Reinforcement Learning. In NIPS , 2017. Thore Graepel. Multi-Agent Reinforcement Learning in Sequential [43] Mance E Harmon and Leemon C Baird III. Multi-Player Residual Social Dilemmas. In AAMAS , 2017. Advantage Learning with General Function Approximation. Technical [72] Sergey Levine and Pieter Abbeel. Learning Neural Network Policies report, DTIC, 1996. with Guided Policy Search under Unknown Dynamics. In NIPS , 2014. [44] Matthew Hausknecht and Peter Stone. Deep Recurrent Q-Learning for [73] Sergey Levine and Vladlen Koltun. Guided Policy Search. In ICLR , Partially Observable MDPs. In AAAI Fall Symposium Series , 2015. 2013. [45] Nicolas Heess, Jonathan J Hunt, Timothy P Lillicrap, and David Silver. [74] Sergey Levine, Chelsea Finn, Trevor Darrell, and Pieter Abbeel. End- Memory-Based Control with Recurrent Neural Networks. In NIPS to-End Training of Deep Visuomotor Policies. JMLR , 17(39):1–40, Workshop on Deep Reinforcement Learning , 2015. 2016. [46] Nicolas Heess, Gregory Wayne, David Silver, Tim Lillicrap, Tom Erez, [75] Sergey Levine, Peter Pastor, Alex Krizhevsky, and Deirdre Quillen. and Yuval Tassa. Learning Continuous Control Policies by Stochastic Learning Hand-Eye Coordination for Robotic Grasping with Deep Value Gradients. In NIPS , 2015. Learning and Large-Scale Data Collection. In ISER , 2016. [47] Nicolas Heess, Srinivasan Sriram, Jay Lemmon, Josh Merel, Greg [76] Ke Li and Jitendra Malik. Learning to Optimize. 2017. Wayne, Yuval Tassa, Tom Erez, Ziyu Wang, Ali Eslami, Martin [77] Xiujun Li, Lihong Li, Jianfeng Gao, Xiaodong He, Jianshu Chen, Riedmiller, et al. Emergence of Locomotion Behaviours in Rich Li Deng, and Ji He. Recurrent Reinforcement Learning: A Hybrid Environments. arXiv:1707.02286 , 2017. Approach. arXiv:1509.03044 , 2015. [48] Johannes Heinrich and David Silver. Deep Reinforcement Learning [78] Yuxi Li. Deep Reinforcement Learning: An Overview. from Self-Play in Imperfect-Information Games. 2016. arXiv:1701.07274 , 2017. [49] Todd Hester, Matej Vecerik, Olivier Pietquin, Marc Lanctot, Tom [79] Timothy P Lillicrap, Jonathan J Hunt, Alexander Pritzel, Nicolas Heess, Schaul, Bilal Piot, Andrew Sendonaris, Gabriel Dulac-Arnold, Ian Tom Erez, Yuval Tassa, David Silver, and Daan Wierstra. Continuous Osband, John Agapiou, et al. Learning from Demonstrations for Real Control with Deep Reinforcement Learning. In ICLR , 2016. World Reinforcement Learning. arXiv:1704.03732 , 2017. [80] Long-Ji Lin. Self-Improving Reactive Agents Based on Reinforcement [50] Geoffrey Hinton, Oriol Vinyals, and Jeff Dean. Distilling the Knowl- Learning, Planning and Teaching. Machine Learning , 8(3–4):293–321, edge in a Neural Network. 2014. 1992. [51] Jonathan Ho and Stefano Ermon. Generative Adversarial Imitation [81] Luke Metz, Julian Ibarz, Navdeep Jaitly, and James Davidson. Dis- Learning. In NIPS , 2016. crete Sequential Prediction of Continuous Actions for Deep RL. [52] Rein Houthooft, Xi Chen, Yan Duan, John Schulman, Filip De Turck, arXiv:1705.05035 , 2017. and Pieter Abbeel. VIME: Variational Information Maximizing Explo- [82] Piotr Mirowski, Razvan Pascanu, Fabio Viola, Hubert Soyer, Andy Bal- ration. In NIPS , 2016. lard, Andrea Banino, Misha Denil, Ross Goroshin, Laurent Sifre, Koray

Kavukcuoglu, et al. Learning to Navigate in Complex Environments. In ICLR , 2016. In ICLR , 2017. [107] Benjamin Recht, Christopher Re, Stephen Wright, and Feng Niu. [83] Volodymyr Mnih, Nicolas Heess, Alex Graves, and Koray Hogwild: A Lock-Free Approach to Parallelizing Stochastic Gradient Kavukcuoglu. Recurrent Models of Visual Attention. In NIPS , Descent. In NIPS , 2011. 2014. [108] Danilo Jimenez Rezende, Shakir Mohamed, and Daan Wierstra. [84] Volodymyr Mnih, Koray Kavukcuoglu, David Silver, Andrei A Rusu, Stochastic Backpropagation and Approximate Inference in Deep Gen- Joel Veness, Marc G Bellemare, Alex Graves, Martin Riedmiller, erative Models. In ICML , 2014. Andreas K Fidjeland, Georg Ostrovski, et al. Human-Level Control [109] Martin Riedmiller. Neural Fitted Q Iteration—First Experiences with through Deep Reinforcement Learning. Nature , 518(7540):529–533, a Data Efficient Neural Reinforcement Learning Method. In ECML , 2015. 2005. [85] Volodymyr Mnih, Adria Puigdomenech Badia, Mehdi Mirza, Alex [110] St´ ephane Ross, Geoffrey J Gordon, and Drew Bagnell. A Reduction Graves, Timothy P Lillicrap, Tim Harley, David Silver, and Koray of Imitation Learning and Structured Prediction to No-Regret Online Kavukcuoglu. Asynchronous Methods for Deep Reinforcement Learn- Learning. In AISTATS , 2011. ing. In ICLR , 2016. [111] David E Rumelhart, Geoffrey E Hinton, and Ronald J Williams. Learn- [86] Shakir Mohamed and Danilo Jimenez Rezende. Variational Information ing Representations by Back-Propagating Errors. Cognitive Modeling , Maximisation for Intrinsically Motivated Reinforcement Learning. In 5(3):1, 1988. NIPS , 2015. [112] Gavin A Rummery and Mahesan Niranjan. On-line Q-learning using [87] Andrew William Moore. Efficient Memory-Based Learning for Robot Connectionist Systems . University of Cambridge, Department of Control. Technical report, University of Cambridge, Computer Labo- Engineering, 1994. ratory, 1990. [113] Andrei A Rusu, Sergio Gomez Colmenarejo, Caglar Gulcehre, Guil- [88] R´ emi Munos, Tom Stepleton, Anna Harutyunyan, and Marc G Belle- laume Desjardins, James Kirkpatrick, Razvan Pascanu, Volodymyr mare. Safe and Efficient Off-Policy Reinforcement Learning. In NIPS , Mnih, Koray Kavukcuoglu, and Raia Hadsell. Policy Distillation. In 2016. ICLR , 2016. [89] Ofir Nachum, Mohammad Norouzi, Kelvin Xu, and Dale Schuurmans. [114] Andrei A Rusu, Neil C Rabinowitz, Guillaume Desjardins, Hubert Bridging the Gap Between Value and Policy Based Reinforcement Soyer, James Kirkpatrick, Koray Kavukcuoglu, Razvan Pascanu, and Learning. arXiv:1702.08892 , 2017. Raia Hadsell. Progressive Neural Networks. arXiv:1606.04671 , 2016. [90] Anusha Nagabandi, Gregory Kahn, Ronald S Fearing, and Sergey [115] Andrei A Rusu, Matej Vecerik, Thomas Roth¨ orl, Nicolas Heess, Razvan Levine. Neural Network Dynamics for Model-Based Deep Reinforce- Pascanu, and Raia Hadsell. Sim-to-Real Robot Learning from Pixels ment Learning with Model-Free Fine-Tuning. arXiv:1708.02596 , 2017. with Progressive Nets. In CoRL , 2017. [91] Arun Nair, Praveen Srinivasan, Sam Blackwell, Cagdas Alcicek, Rory [116] Tim Salimans, Jonathan Ho, Xi Chen, and Ilya Sutskever. Evolu- Fearon, Alessandro De Maria, Vedavyas Panneershelvam, Mustafa tion Strategies as a Scalable Alternative to Reinforcement Learning. Suleyman, Charles Beattie, Stig Petersen, et al. Massively Parallel arXiv:1703.03864 , 2017. Methods for Deep Reinforcement Learning. In ICML Workshop on [117] Tom Schaul, Daniel Horgan, Karol Gregor, and David Silver. Universal Deep Learning , 2015. Value Function Approximators. In ICML , 2015. [92] Andrew Y Ng and Stuart J Russell. Algorithms for Inverse Reinforce- [118] Tom Schaul, John Quan, Ioannis Antonoglou, and David Silver. Pri- ment Learning. In ICML , 2000. oritized Experience Replay. In ICLR , 2016. [93] Andrew Y Ng, Adam Coates, Mark Diel, Varun Ganapathi, Jamie [119] J¨ urgen Schmidhuber. A Possibility for Implementing Curiosity and Schulte, Ben Tse, Eric Berger, and Eric Liang. Autonomous Inverted Boredom in Model-Building Neural Controllers. In SAB , 1991. Helicopter Flight via Reinforcement Learning. Experimental Robotics , [120] J¨ urgen Schmidhuber and Rudolf Huber. Learning to Generate Artificial pages 363–372, 2006. Fovea Trajectories for Target Detection. IJNS , 2(01n02):125–134, [94] Brendan O’Donoghue, R´ emi Munos, Koray Kavukcuoglu, and 1991. Volodymyr Mnih. PGQ: Combining Policy Gradient and Q-Learning. [121] John Schulman, Nicolas Heess, Theophane Weber, and Pieter Abbeel. In ICLR , 2017. Gradient Estimation using Stochastic Computation Graphs. In NIPS , [95] Junhyuk Oh, Xiaoxiao Guo, Honglak Lee, Richard L Lewis, and 2015. Satinder Singh. Action-Conditional Video Prediction using Deep [122] John Schulman, Sergey Levine, Pieter Abbeel, Michael Jordan, and Networks in Atari Games. In NIPS , 2015. Philipp Moritz. Trust Region Policy Optimization. In ICML , 2015. [96] Junhyuk Oh, Valliappa Chockalingam, Satinder Singh, and Honglak [123] John Schulman, Philipp Moritz, Sergey Levine, Michael Jordan, and Lee. Control of Memory, Active Perception, and Action in Minecraft. Pieter Abbeel. High-Dimensional Continuous Control using General- In ICLR , 2016. ized Advantage Estimation. In ICLR , 2016. [97] Ian Osband, Charles Blundell, Alexander Pritzel, and Benjamin [124] John Schulman, Pieter Abbeel, and Xi Chen. Equivalence Between Van Roy. Deep Exploration via Bootstrapped DQN. In NIPS , 2016. Policy Gradients and Soft Q-Learning. arXiv:1704.06440 , 2017. [98] Emilio Parisotto and Ruslan Salakhutdinov. Neural Map: Structured [125] John Schulman, Filip Wolski, Prafulla Dhariwal, Alec Radford, Memory for Deep Reinforcement Learning. arXiv:1702.08360 , 2017. and Oleg Klimov. Proximal Policy Optimization Algorithms. [99] Emilio Parisotto, Jimmy L Ba, and Ruslan Salakhutdinov. Actor- arXiv:1707.06347 , 2017. Mimic: Deep Multitask and Transfer Reinforcement Learning. In ICLR , [126] Bobak Shahriari, Kevin Swersky, Ziyu Wang, Ryan P Adams, and 2016. Nando de Freitas. Taking the Human out of the Loop: A Review [100] Razvan Pascanu, Yujia Li, Oriol Vinyals, Nicolas Heess, Lars Buesing, of Bayesian Optimization. Proc. of the IEEE , 104(1):148–175, 2016. Sebastien Racani` ere, David Reichert, Th´ eophane Weber, Daan Wier- [127] David Silver, Guy Lever, Nicolas Heess, Thomas Degris, Daan Wier- stra, and Peter Battaglia. Learning Model-Based Planning from Scratch. stra, and Martin Riedmiller. Deterministic Policy Gradient Algorithms. arXiv:1707.06170 , 2017. In ICML , 2014. [101] Deepak Pathak, Pulkit Agrawal, Alexei A Efros, and Trevor Darrell. [128] David Silver, Aja Huang, Chris J Maddison, Arthur Guez, Lau- Curiosity-Driven Exploration by Self-supervised Prediction. In ICML , rent Sifre, George van den Driessche, Julian Schrittwieser, Ioannis 2017. Antonoglou, Veda Panneershelvam, Marc Lanctot, et al. Mastering [102] Peng Peng, Ying Wen, Yaodong Yang, Quan Yuan, Zhenkun Tang, the Game of Go with Deep Neural Networks and Tree Search. Nature , Haitao Long, and Jun Wang. Multiagent Bidirectionally-Coordinated 529(7587):484–489, 2016. Nets: Emergence of Human-level Coordination in Learning to Play [129] Satinder Singh, Diane Litman, Michael Kearns, and Marilyn Walker. StarCraft Combat Games. arXiv:1703.10069 , 2017. Optimizing Dialogue Management with Reinforcement Learning: Ex- [103] Jan Peters, Katharina M¨ ulling, and Yasemin Altun. Relative Entropy periments with the NJFun System. JAIR , 16:105–133, 2002. Policy Search. In AAAI , 2010. [130] Ivan Sorokin, Alexey Seleznev, Mikhail Pavlov, Aleksandr Fedorov, [104] Dean A Pomerleau. ALVINN, an Autonomous Land Vehicle in and Anastasiia Ignateva. Deep Attention Recurrent Q-Network. In a Neural Network. Technical report, Carnegie Mellon University, NIPS Workshop on Deep Reinforcement Learning , 2015. Computer Science Department, 1989. [131] Bradley C Stadie, Pieter Abbeel, and Ilya Sutskever. Third Person [105] Alexander Pritzel, Benigno Uria, Sriram Srinivasan, Adri` a Puig- Imitation Learning. In ICLR , 2017. dom` enech, Oriol Vinyals, Demis Hassabis, Daan Wierstra, and Charles [132] Bradly C Stadie, Sergey Levine, and Pieter Abbeel. Incentivizing Blundell. Neural Episodic Control. In ICML , 2017. Exploration in Reinforcement Learning with Deep Predictive Models. [106] Marc’Aurelio Ranzato, Sumit Chopra, Michael Auli, and Wojciech In NIPS Workshop on Deep Reinforcement Learning , 2015. Zaremba. Sequence Level Training with Recurrent Neural Networks. [133] Alexander L Strehl, Lihong Li, Eric Wiewiora, John Langford, and

Michael L Littman. PAC Model-Free Reinforcement Learning. In [161] Th´ eophane Weber, S´ ebastien Racani` ere, David P Reichert, Lars ICML , 2006. Buesing, Arthur Guez, Danilo Jimenez Rezende, Adria Puigdom` enech [134] Sainbayar Sukhbaatar, Arthur Szlam, and Rob Fergus. Learning Badia, Oriol Vinyals, Nicolas Heess, Yujia Li, et al. Imagination- Multiagent Communication with Backpropagation. In NIPS , 2016. Augmented Agents for Deep Reinforcement Learning. In NIPS , 2017. [135] Richard S Sutton and Andrew G Barto. Reinforcement Learning: An [162] Paul John Werbos. Beyond Regression: New Tools for Prediction Introduction . MIT Press, 1998. and Analysis in the Behavioral Sciences. Technical report, Harvard [136] Richard S Sutton, Doina Precup, and Satinder Singh. Between University, Applied Mathematics, 1974. MDPs and Semi-MDPs: A Framework for Temporal Abstraction in [163] Daan Wierstra, Alexander F¨ orster, Jan Peters, and J¨ urgen Schmidhuber. Reinforcement Learning. Artificial Intelligence , 112(1–2):181–211, Recurrent Policy Gradients. Logic Journal of the IGPL , 18(5):620–634, 1999. 2010. [137] Gabriel Synnaeve, Nantas Nardelli, Alex Auvolat, Soumith Chintala, [164] Ronald J Williams. Simple Statistical Gradient-Following Algorithms Timoth´ ee Lacroix, Zeming Lin, Florian Richoux, and Nicolas Usunier. for Connectionist Reinforcement Learning. Machine Learning , 8(3-4): TorchCraft: A Library for Machine Learning Research on Real-Time 229–256, 1992. Strategy Games. arXiv:1611.00625 , 2016. [165] Markus Wulfmeier, Peter Ondruska, and Ingmar Posner. Maximum [138] Aviv Tamar, Yi Wu, Garrett Thomas, Sergey Levine, and Pieter Abbeel. Entropy Deep Inverse Reinforcement Learning. In NIPS Workshop on Value Iteration Networks. In NIPS , 2016. Deep Reinforcement Learning , 2015. [139] Haoran Tang, Rein Houthooft, Davis Foote, Adam Stooke, Xi Chen, [166] Kelvin Xu, Jimmy Ba, Ryan Kiros, Kyunghyun Cho, Aaron C Yan Duan, John Schulman, Filip De Turck, and Pieter Abbeel. #Explo- Courville, Ruslan Salakhutdinov, Richard S Zemel, and Yoshua Bengio. ration: A Study of Count-Based Exploration for Deep Reinforcement Show, Attend and Tell: Neural Image Caption Generation with Visual Learning. In NIPS , 2017. Attention. In ICML , volume 14, 2015. [140] Yee Whye Teh, Victor Bapst, Wojciech Marian Czarnecki, John Quan, [167] Yuke Zhu, Roozbeh Mottaghi, Eric Kolve, Joseph J Lim, Abhinav James Kirkpatrick, Raia Hadsell, Nicolas Heess, and Razvan Pascanu. Gupta, Li Fei-Fei, and Ali Farhadi. Target-Driven Visual Navigation Distral: Robust Multitask Reinforcement Learning. In NIPS , 2017. in Indoor Scenes using Deep Reinforcement Learning. In ICRA , 2017. [141] Gerald Tesauro. Temporal Difference Learning and TD-Gammon. [168] Barret Zoph and Quoc V Le. Neural Architecture Search with Communications of the ACM , 38(3):58–68, 1995. Reinforcement Learning. In ICLR , 2017. [142] Gerald Tesauro, Rajarshi Das, Hoi Chan, Jeffrey Kephart, David Levine, Freeman Rawson, and Charles Lefurgy. Managing Power Con- sumption and Performance of Computing Systems using Reinforcement Learning. In NIPS , 2008. [143] Chen Tessler, Shahar Givony, Tom Zahavy, Daniel J Mankowitz, and Shie Mannor. A Deep Hierarchical Approach to Lifelong Learning in Kai Arulkumaran (ka709@imperial.ac.uk) is a Ph.D. candidate in the Minecraft. In AAAI , 2017. Department of Bioengineering at Imperial College London. He received a [144] Emanuel Todorov, Tom Erez, and Yuval Tassa. MuJoCo: A Physics B.A. in Computer Science at the University of Cambridge in 2012, and an Engine for Model-Based Control. In IROS , 2012. M.Sc. in Biomedical Engineering at Imperial College London in 2014. He [145] John N Tsitsiklis and Benjamin Van Roy. Analysis of Temporal- was a Research Intern in Twitter Magic Pony and Microsoft Research in Difference Learning with Function Approximation. In NIPS , 1997. 2017. His research focus is deep reinforcement learning and transfer learning [146] Eric Tzeng, Coline Devin, Judy Hoffman, Chelsea Finn, Xingchao for visuomotor control. Peng, Sergey Levine, Kate Saenko, and Trevor Darrell. Towards Adapting Deep Visuomotor Representations from Simulated to Real Environments. In WAFR , 2016. [147] Nicolas Usunier, Gabriel Synnaeve, Zeming Lin, and Soumith Chintala. Episodic Exploration for Deep Deterministic Policies: An Application to StarCraft Micromanagement Tasks. In ICLR , 2017. Marc Peter Deisenroth (m.deisenroth@imperial.ac.uk) is a Lecturer in [148] Hado van Hasselt. Double Q-Learning. In NIPS , 2010. Statistical Machine Learning in the Department of Computing at Imperial [149] Hado van Hasselt, Arthur Guez, and David Silver. Deep Reinforcement College London and with PROWLER.io. He received an M.Eng. in Computer Learning with Double Q-Learning. In AAAI , 2016. Science at the University of Karlsruhe in 2006 and a Ph.D. in Machine [150] Harm Vanseijen and Rich Sutton. A Deeper Look at Planning as Learning at the Karlsruhe Institute of Technology in 2009. He has been Learning from Replay. In ICML , 2015. awarded an Imperial College Research Fellowship in 2014 and received Best [151] Alexander Vezhnevets, Volodymyr Mnih, Simon Osindero, Alex Paper Awards at ICRA 2014 and ICCAS 2016. He is a recipient of a Google Graves, Oriol Vinyals, John Agapiou, and Koray Kavukcuoglu. Strate- Faculty Research Award and a Microsoft Ph.D. Scholarship. His research gic Attentive Writer for Learning Macro-Actions. In NIPS , 2016. is centred around data-efficient machine learning for autonomous decision [152] Alexander Sasha Vezhnevets, Simon Osindero, Tom Schaul, Nicolas making. Heess, Max Jaderberg, David Silver, and Koray Kavukcuoglu. FeUdal Networks for Hierarchical Reinforcement Learning. In ICML , 2017. [153] Oriol Vinyals, Timo Ewalds, Sergey Bartunov, Petko Georgiev, Alexan- der Sasha Vezhnevets, Michelle Yeo, Alireza Makhzani, Heinrich K¨ uttler, John Agapiou, Julian Schrittwieser, et al. StarCraft II: A New Challenge for Reinforcement Learning. arXiv:1708.04782 , 2017. Miles Brundage (miles.brundage@philosophy.ox.ac.uk) is a Ph.D. candidate [154] Niklas Wahlstr¨ om, Thomas B Sch¨ on, and Marc P Deisenroth. Learning in Human and Social Dimensions of Science and Technology at Arizona Deep Dynamical Models from Image Pixels. IFAC SYSID , 48(28), State University, and a Research Fellow at the University of Oxford’s Future 2015. of Humanity Institute. He received a B.A. in Political Science at George [155] Niklas Wahlstr¨ om, Thomas B Sch¨ on, and Marc P Deisenroth. From Washington University in 2010. His research focuses on governance issues Pixels to Torques: Policy Learning with Deep Dynamical Models. In related to artificial intelligence. ICML Workshop on Deep Learning , 2015. [156] Jane X Wang, Zeb Kurth-Nelson, Dhruva Tirumala, Hubert Soyer, Joel Z Leibo, R´ emi Munos, Charles Blundell, Dharshan Kumaran, and Matt Botvinick. Learning to Reinforcement Learn. In CogSci , 2017. [157] Ziyu Wang, Nando de Freitas, and Marc Lanctot. Dueling Network Architectures for Deep Reinforcement Learning. In ICLR , 2016. Anil Anthony Bharath (a.bharath@imperial.ac.uk) is a Reader in the De- [158] Ziyu Wang, Victor Bapst, Nicolas Heess, Volodymyr Mnih, R´ emi partment of Bioengineering at Imperial College London and a Fellow of the Munos, Koray Kavukcuoglu, and Nando de Freitas. Sample Efficient Institution of Engineering and Technology. He received a B.Eng. in Electronic Actor-Critic with Experience Replay. In ICLR , 2017. and Electrical Engineering from University College London in 1988, and [159] Christopher JCH Watkins and Peter Dayan. Q-Learning. Machine a Ph.D. in Signal Processing from Imperial College London in 1993. He Learning , 8(3-4):279–292, 1992. was an academic visitor in the Signal Processing Group at the University of [160] Manuel Watter, Jost Springenberg, Joschka Boedecker, and Martin Cambridge in 2006. He is a co-founder of Cortexica Vision Systems. His Riedmiller. Embed to Control: A Locally Linear Latent Dynamics research interests are in deep architectures for visual inference. Model for Control from Raw Images. In NIPS , 2015.