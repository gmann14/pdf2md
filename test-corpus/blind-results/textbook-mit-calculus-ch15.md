---
title: "CHAPTER 15"
---

### CHAPTER 15

r rr Chapter rrr introduced double and triple integrals. We went from dx to dx dy and dx dy dz . All those integrals add up small pieces, and the limit gives area or volume or mass. What could be more natural than that? I regret to say, after the success of those multiple integrals, that something is missing. It is even more regrettable that we didn’t notice it. The missing piece is nothing less than the Fundamental Theorem of Calculus. rrr The double integral dx dy equals the area. To compute it, we did not use an antiderivative of 1: At least not consciously. The method was almost trial and error, and the hard part was to find the limits of integration. This chapter goes deeper, to show how the step from a double integral to a single integral is really a new form of the Fundamental Theorem—when it is done right. Two new ideas are needed early, one pleasant and one not. You will like vector fields . You may not think so highly of r line integrals . Those are ordinary single integrals like v.x/dx; but they go along curves instead of straight lines. The nice r step r dx becomes the confusing step ds: Where dx equals the length of the interval, ds is the length of the curve. The point is that regions are enclosed by curves, and we have to integrate along them. The Fundamental Theorem in its two-dimensional form (Green’s Theorem) connects a double integral over the region to a single integral along its boundary curve . The great applications are in science and engineering, where vector fields are so natural. But there are changes in the language. Instead of an antiderivative, we speak about a potential function . Instead of the derivative, we take the “ divergence ” and “ curl .” Instead of area, we compute flux and circulation and work . Examples come first.

## 15.1 Vector Fields

For an ordinary scalar function, the input is a number and the output is a number f .x/: For a vector field (or vector function), the input is a point .x; y/ and the output is a two-dimensional vector F .x; y/: There is a “field” of vectors, one at every point. In three dimensions the input point is .x; y; z/ and the output vector F has three components.

DEFINITION Let R be a region in the xy plane. A vector field F assigns to every point .x; y/ in R a vector F .x; y/ with two components:

F .x; y/ M.x; y/ i N.x; y/ j : (1)

This plane vector field involves two functions of two variables [. They are the](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) components M and N; which vary from point to point. A vector has fixed components, a vector field has varying components. A three-dimensional vector field has components M.x; y; z/ and N.x; y; z/ and P .x; y; z/: Then the vectors are F M i N j P k :

EXAMPLE 1 The position vector at .x; y/ is R i y j : Its components are M and N y: The vectors grow larger as we leave the origin (Figure 15.1a). Their direction is outward and their length is | R | a y r: The vector R is boldface, the number r is lightface.

EXAMPLE 2 The vector field R =r consists of unit vectors u r ; pointing outward. We divide R i y j by its length, at every point except the origin. The components of R =r are M x=r and N y=r: Figure 15.1 shows a third field R =r ; whose length is 1=r:

Fig. 15.1 The vector fields R and R =r and R =r are radial. Lengths r and and 1=r:

EXAMPLE 3 The spin field or rotation field or turning field goes around the origin instead of away from it. The field is S : Its components are M  y and N :

S  y i j also has length | S | a .  y/ r: (2)

S is perpendicular to R —their dot product is zero: S  R .  y/.x/ .x/.y/ 0: The spin fields S =r and S =r have lengths and 1=r :

### S y S y r

# i j has j r r

has  r    S S  i  r  y y      r     :  r

The unit vector S =r is u  : Notice the blank at .0; 0/; where this field is not defined.

## 15.1 Vector Fields

Fig. 15.2 The spin fields S and S =r and S =r go around the origin. Lengths r and and 1=r:

EXAMPLE 4 A gradient field starts with an ordinary function f .x; y/: The components M and N are the partial derivatives B f = B and B [f =](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) B [y:](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [Then the field](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [F](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) is the gradient of f :

F grad f D r f B f = B i B f = B y j : (3)

This vector field grad f is everywhere perpendicular to the level curves f .x; y/ c: The length | grad f | tells how fast f is changing (in the direction it changes fastest). Invent a function like f y; and you immediately have its gradient field F 2xy i j : To repeat, M is B f = B and N is B f = B y:

For every vector field you should ask two questions: Is it a gradient field ? If so, what is f ? Here are answers for the radial fields and spin fields:

15A The radial fields R and R =r and R =r are all gradient fields. The spin fields S and S =r are not gradients of any f .x; y/: The spin field S =r is the gradient of the polar angle  tan

.y=x/:

The derivatives of f .x y / are and y: Thus R is a gradient field. The gradient of f r is the unit vector R =r pointing outwards. Both fields are perpendicular to circles around the origin. Those are the level curves of f r and f r:

n

Question Is every R =r a gradient field? Answer Yes . But among the spin fields, the only gradient is S =r :

A major goal of this chapter is to recognize gradient fields by a simple test. The rejection of S and S =r will be interesting. For some reason  y i j is rejected and y i j is accepted. (It is the gradient of : ) The acceptance of S =r as the gradient of f  contains a surprise at the origin (Section 15.3). Gradient fields are called conservative . The function f is the potential function . These words, and the next examples, come from physics and engineering.

EXAMPLE 5 The velocity field is V and the flow field is  V :

Suppose fluid moves steadily down a pipe. Or a river flows smoothly (no waterfall). Or the air circulates in a fixed pattern. The velocity can be different at different points, but there is no change with time. The velocity vector V gives the direction of flow and speed of flow at every point.

| In reality the velocity field is V .x; y; z/; with three components M; N; P: Those are the velocities v ; v ; v in the x; y; z directions. The speed | V | is the length: V | v v v : In a “plane flow” the k component is zero, and the velocity field is v i v j M i N j :

Fig. 15.3 A steady velocity field V and two force fields F :

For a compact disc or a turning wheel, V is a spin field ( V ! S , ! angular velocity). A tornado might be closer to V S =r (except for a dead spot at the center). An explosion could have V R =r : A quieter example is flow in and out of a lake with steady rain as a source term. The flow field  V is the density  times the velocity field. While V gives the rate of movement,  V gives the rate of movement of mass . A greater density means a greater rate |  V | of “mass transport.” It is like the number of passengers on a bus times the speed of the bus.

EXAMPLE 6 Force fields from gravity: F is downward in the classroom, F is radial in space.

When gravity pulls downward, it has only one nonzero component: F  mg k : This assumes that vectors to the center of the Earth are parallel—almost true in a classroom. Then F is the gradient of  mgz (note B f = B z  mg ). In physics the usual potential is not  mgz but mgz: The force field is minus grad f also in electrical engineering. Electrons flow from high potential to low potential. The mathematics is the same, but the sign is reversed. In space, the force is radial inwards: F  mM G R =r : Its magnitude is proportional to 1=r (Newton’s inverse square law). The masses are m and M; and the gravitational constant is G 6:672   —with distance in meters, mass in kilograms, and time in seconds. The dimensions of G are . force /. distance / =. mass / : This is different from the acceleration g 9:8 m = sec ; which already accounts for the mass and radius of the Earth. Like all radial fields, gravity is a gradient field . It comes from a potential f :

mM G f mM Gx f f mM Gz f and and and r

B B  r

B mM Gy :

B y  r B B z  r (4)

EXAMPLE 7 (a short example) Current in a wire produces a magnetic field B : It is the spin field S =r around the wire, times the strength of the current.

## STREAMLINES AND LINES OF FORCE

Drawing a vector field is not always easy. Even the spin field looks messy when the vectors are too long (they go in circles and fall across each other). The circles give

## 15.1 Vector Fields

a clearer picture than the vectors . In any field, the vectors are tangent to “ field lines ”— which in the spin case are circles.

DEFINITION is a field line or integral curve if the vectors F .x; y/ are tangent to C: The slope dy=dx of the curve equals the slope N=M of the vector F M i N j : ! dy N.x; y/ for the spin field (6) dx M.x; y/

: y

We are still drawing the field of vectors, but now they are infinitesimally short. They are connected into curves! What is lost is their length, because S and S =r and S =r all have the same field lines (circles). For the position field R and gravity field R =r ; the field lines are rays from the origin. In this case the “curves” are actually straight.

EXAMPLE 8 Show that the field lines for the velocity field

ñ

V y i j are hyperbolas.

dy N y dy x dx y constant dx M y

ñ :

Fig. 15.4 Velocity fields are tangent to streamlines. Gradient fields also have equipotentials.

At every point these hyperbolas line up with the velocity V : Each particle of fluid travels on a field line . In fluid flow those hyperbolas are called streamlines . Drop a leaf into a river, and it follows a streamline. Figure 15.4 shows the streamlines for a river going around a bend. Don’t forget the essential question about each vector field. Is it a gradient field? For V y i j the answer is yes , and the potential is f xy :

the gradient of xy is . B f = B x/ i . B f = B y/ j y i j : (7)

When there is a potential, it has level curves. They connect points of equal potential, so the curves f .x; y/ c are called equipotentials . Here they are the curves xy c — also hyperbolas. Since gradients are perpendicular to level curves, the streamlines are perpendicular to the equipotentials . Figure 15.4 is sliced one way by streamlines and the other way by equipotentials.

A gradient field F B f = B i B f = B y j is tangent to the field lines (streamlines) and perpendicular to the equipotentials (level curves of f ).

In the gradient direction

# B f changes fastest. In the level direction f doesn’t change at all. The chain rule along f .x; y/ c proves these directions to be perpendicular:

dx dy . .

B f or f / / dt

# B B f grad tangent to level curve 0: y dt

# EXAMPLE 9 The streamlines of S =r are circles around ( 0; 0 ). The equipotentials are rays  c: Add rays to Figure 15.2 for the gradient field S =r :

For the gravity field those are reversed. A body is pulled in along the field lines (rays). The equipotentials are the circles where f 1=r is constant. The plane is crisscrossed by “orthogonal trajectories”—curves that meet everywhere at right angles. If you bring a magnet near a pile of iron filings, a little shake will display the field lines. In a force field, they are “lines of force.” Here are the other new words .

Vector field F .x; y; z/ M i N j P k Plane field F M.x; y/ i N.x; y/ j

Radial field: multiple of R i y j z k Spin field: multiple of S  y i j

Gradient field conservative field: M B f = B x; N B f = B y; P B f = B z

Potential f .x; y/ (not a vector) Equipotential curves f .x; y/ c

Streamline field line integral curve: a curve that has F .x; y/ as its tangent vectors.

## 15.1 EXERCISES

### Read-through questions

A vector field assigns a a to each point .x; y/ or .x; y; z/: The velocity field y i j is the gradient of f . Its In two dimensions F .x; y/ b i c j : An example is streamlines are . The slope dy=dx of a streamline equals the position field R d . Its magnitude is | R | e the ratio E of velocity components. The field is F to and its direction is f . It is the gradient field for f = the streamlines. Drop a leaf onto the flow, and it goes along g . The level curves are h , and they are i to G . the vectors Find a potential f .x; y/ for the gradient fields 1–8

: Draw the streamlines perpendicular to the equipotentials f .x; y/ c:

F i j (constant field) F i j

B

R :

Reversing this picture, the spin field is S j . Its magnitude is | S | k and its direction is l . It is not a gradient field, because no function has B f = B m and f = B y n . S is the velocity field for flow going o . F cos .x y/ i cos .x y/ j F .1=y/ i .x=y / j The streamlines or p lines or integral q are r . The flow field  V gives the rate at which s is moved F .2x i 2y j /=.x y / F i y j

by the flow. F xy

A gravity field from the origin is proportional to F t which has | F | u . This is Newton’s v square law. It is a gradient field, with potential f w . The equipotential curves f .x; y/ c are . They are y to the field lines which are z . This illustrates that the A of a function f .x; y/ is B to its level curves.

B i

B j

B B B B B

F ?  y i j

Draw the shear field F j : Check that it is not a gradient field: If f = then

B

f = y is impossible. What are the streamlines (field lines) in the direction of F ?

Find all functions that satisfy f = y and show that none of them satisfy f = y x: Then the spin field S  y i j is not a gradient field.

# B B 15.1 Vector Fields

Compute f = and B f = B y in 11–18 : Draw the gradient field The equipotentials are the parabolas y c and F is a F grad f and the equipotentials f .x; y/ c : gradient field.

f 3x y f 3y Show directly that the hyperbolas xy and  y are perpendicular at the point .2; 1/; by computing both slopes f y f .x 1/ y dy=dx and multiplying to get

f  y f e cos y

f e  y   f y=x

### Find equations for the streamlines in 19–24 by solving dy=dx

1:

N=M (including a constant ). Draw the streamlines .

F i  j F i j

F S (spin field) F S =r (spin field)

F grad .x=y/ F grad .2x y/:

B

The derivative of

B

f .x; y/ c is f f y .dy=dx/ 0: Show that the slope of this level curve is dy=dx  M=N: It is perpendicular to streamlines because (  M=N )( N=M / :

The and y derivatives of f .r/ are [B](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) f = [B](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) and f = y by the chain rule. (Test f r : ) The equipotentials are :

F .ax by/ i .bx cy/ j is a gradient field. Find the potential f [and describe the equipotentials.](https://ocw.mit.edu/pages/privacy-and-terms-of-use/)

True or false : The Earth’s gravity field is radial, but in a room the field lines seem to go straight down into the floor. This is because 1. The constant field i k is a gradient field.

nearby field lines always look : 2. For non-gradient fields, equipotentials meet streamlines at non-right angles. A line of charges produces the electrostatic force field F 3. In three dimensions the equipotentials are surfaces instead R =r .x i y j /=.x y /: Find the potential f .x; y/: ( F is also of curves. the gravity field for a line of masses.) 4. F i y j z k points outward from .0; 0; 0/ — In 27–32 write down the vector fields M i N j : a radial field.

F points radially away from the origin with magnitude 5: Create and draw f and F and your own equipotentials and streamlines. The velocity is perpendicular to the curves y c and the speed is 1: How can different vector fields have the same streamlines?

The gravitational force F comes from two unit masses at Can they have the same equipotentials? Can they have the

.0; 0/ and .1; 0/: same f ?

The streamlines are in the

direction and the speed is 4: Draw arrows at six or eight points to show the direction and magnitude of each field: The streamlines are circles clockwise around the origin and the speed is 1: (a) R S (b) R =r  S =r (c) i j (d) y i :

## 15.2 Line Integrals

A line integral is an integral along a curve . It can equal an area, but that is a special case and not typical. Instead of area, here are two important line integrals in physics and engineering:

### Work along a curve

# » F  T ds Flow across a curve

c

» F n ds

c

.

In the first integral,

F is a force field . In the second integral, F is a flow field . Work is done in the direction of movement, so we integrate F T . Flow is measured through the curve , so we integrate F  n . Here T is the unit tangent vector, and F  T is the force component along the curve. Similarly n is the unit normal vector, at right angles with T . Then F n is the component of flow perpendicular to the curve. We will write those integrals in several forms. They may never be as comfortable r as y.x/dx , but eventually we get them under control. I mention these applications early, so you can see where we are going. This section concentrates on work, and flow comes later. (It is also called

flux —the Latin word for flow.) You recognize r ds as the step along the curve, corresponding to r dx on the axis. Where dx gives the length of an interval (it equals b a ), ds is the length of the curve.

EXAMPLE 1 Flight from Atlanta to Los Angeles on a straight line and a semicircle.

According to Delta Airlines, the distance straight west is miles. Atlanta is at .1000; 0/ and Los Angeles is at .  1000; 0/ , with the origin halfway between. The semicircle route has radius . This is not a great circle route . It is more of a “flat circle,” which goes north past Chicago. No plane could fly it (it probably goes into space). The equation for the semicircle is y . Parametrically this path is cos t; y sin t . For a line integral the parameter is better. The plane leaves Atlanta at t and reaches L.A. at t  , more than three hours later. On the straight -mile path, Delta could almost do it. Around the semicircle , the distance is miles and the speed has to be miles per hour. Remember that speed is distance ds divided by time dt :

### ds=dt

a .dx=dt/ .dy=dt/

# a .  sin t/ .  cos t/ 1000: (1) The tangent vector to is proportional to ( dx=dt; dy=dt/ .  sin t; 1000 cos t ). But

»

T is a unit vector, so we divide by —which is the speed. Suppose the wind blows due east with force F M i . The components are M and zero. For M =constant, compute the dot product F  T and the work –2000 M :

F  T M i  .  sin t i cos t j M.  sin t/ 0. cos t/  M sin t !

ds F T . M sin dt sin 2000M:

c  ds » t  t/ dt

»  1000M t dt  Work is force times distance moved. It is negative, because the wind acts against the movement. You may point out that the work could have been found more simply—go 2000 miles and multiply by – M . I would object that this straight route is a different path . But you claim that the path doesn’t matter —the work of the wind is – 2000M on every path. I concede that this time you are right (but not always).

Most line integrals depend on the path. Those that don’t are crucially important. For a gradient field , we only need to know the starting point P and the finish Q .

## 15.2 Line Integrals

r 15B When F is the gradient of a potential function f .x; y/ , the work

c

F  T ds depends only on the endpoints P and Q . The work is the change in f :

If F B f = B i B f = B y j then

```
» F ds f .Q/ f .P /: (2)
```

c

T

When F M i , its components

# M and zero are the partial derivatives of f M x . To compute the line integral, just evaluate f at the endpoints. Atlanta has , Los Angeles has

# , and the potential function f M x is like an antiderivative :

work f .Q/ f .P / M.  1000/  M.1000/  2000M: (3)

Fig. 15.5 Force M i , work –2000 M on all paths. Force My i , no work on straight path.

r May I give a rough explanation of the work integral

f

B  B

F  T ds ? It becomes clearer when the small movement

B B T ds B

is written as dx i dy j . The work is the dot product with F : ! f F T ds i j .dx i dy j / dx y B f B  df:

B f dy (4) y

r The infinitesimal work is df . The total work is df f .Q/ f .P / . This is the Fundamental Theorem for a line integral . Only one warning: When F is not the gradient of any f (Example ), the Theorem does not apply.

EXAMPLE 2 Fly these paths against the non-constant force field F My i . Compute the work.

There is no force on the straight path where

# »   y . Along the axis the wind does no work. But the semicircle goes up where

# y sin t and the wind is strong:

### F T .My

» i /

# . sin t i cos t j /  » My

# sin t  1000M sin

t

ds  F T ds . 1000M sin t/  dt M sin t dt M:

c

### dt

This work is enormous (and unrealistic). But the calculations make an important point— everything is converted to the parameter t . The second point is that F

B My

B i is not a gradient field. First reason : The work was zero on the straight path and nonzero on the semicircle. Second reason : No function has B f = B My and f = y . (The first makes f depend on y and the second forbids it. This F is called a shear force .) Without a potential we cannot substitute P and Q —and the work depends on the path.

»

## THE DEFINITION OF LINE INTEGRALS

r We go back to the start, to define F  T ds . We can think of F  T as a function g.x; y/ along the path, and define its integral as a limit of sums:

X

N

g.x; y/ ds limit of g.x i ; y i /s i as .s/ max 0: (5)

c i

Ñ The points .x i ; y i / lie on the curve . The last point Q is ( N ; y N ); the first point P is .x ; y / . The step s i is the distance to ( i ; y i ) from the previous point. As the steps get small .s Ñ 0/ the straight pieces follow the curve. Exactly as in Section 8:2 , the special case g gives the arc length. As long as g.x; y/ is piecewise continuous (jumps allowed) and the path is piecewise smooth (corners allowed), the limit exists and defines the line integral. When g is the density of a wire, the line integral is the total mass. When g is F  T , the integral is the work. But nobody does the calculation by formula ( ). We now introduce a parameter

»

t —which could be the time, or the arc length s , or the distance along the base. The differential ds becomes

# » .ds=dt/dt . Everything changes over to t :

t b

g.x; y/ds g.x.t/; y.t// .dx=dt/ .dy=dt/ dt: (6)

t a

a

The curve starts when t a , runs through the points .x.t/; y.t// , and ends when t b . The square root in the integral is the speed ds=dt . In three dimensions the points on are .x.t/; y.t/; z.t// and .dz=dt/ is in the square root.

## EXAMPLE 3

?

The points on a coil spring are .x; y; z/ . cos t; sin t; t/ . Find the mass of two complete turns (from t to t ) if the density is  .

Solution The key is .dx=dt/

»

.dy=dt/ .dz=dt/ sin t cos t . Thus ds=dt . To find the mass, integrate the mass per unit length which is g  :

ds mass   dt . dt

» ? 2 dt

?

That is a line integral in three-dimensional space. It shows how to introduce t . But it misses the main point of this section, because it contains no vector field F . This section is about work , not just mass.

## DIFFERENT FORMS OF THE WORK INTEGRAL

r The work integral F  T ds can be written in a better way. The force is F M i N j . A small step along the curve is dx i dy j . Work is force times distance, but it is only the force component along the path that counts. The dot product F  T ds finds that component automatically.

## 15.2 Line Integrals

15C The vector to a point on is

R i

# » y j . Then d R T ds dx i dy j W

### work

» F d R M dx N dy: (7)

c c

r r r Along a space curve the work is F  T ds F  d R M dx N dy P dz .

The product M dx is (force in

direction)(movement in direction). This is zero if either factor is zero. When the only force is gravity, pushing a piano takes no work. It is friction that hurts. Carrying the piano up the stairs brings in

P dz , and the total work is the piano weight r P times the change in r z . To connect the new F d R with the old F T ds , remember the tangent vector T . It is d R =ds . Therefore T ds is d R . The best for computations is d R , because the unit vector T has a division by ds=dt

a .dx=dt/ .dy=dt/ [. Later we multiply](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) by this square root, in converting ds to .ds=dt/dt . It makes no sense to compute the square root, divide by it, and then multiply by it. That is avoided in the improved form r M dx N dy .

EXAMPLE 4 Vector field F  y i j , path from ( 1; 0 ) to ( 0; 1 ): Find the work.

Note 1 This F is the spin field S . It goes around the origin, while R i y j goes outward. Their dot product is F  R  yx xy . This does not mean that F  d R . The force is perpendicular to R , but not to the change in R . The work to move from .1; 0/ to .0; 1/ , axis to y axis, is not zero.

Note 2 We have not described the path . That must be done. The spin field is not a gradient field, and the work along a straight line does not equal the work on a quarter-circle:

straight line  t; y t quarter-circle cos t; y sin t .

Calculation of work Change F  d R M dx N dy to the parameter t :

Straight line:

»  y dx x dy

»  t.  dt/ .1  t/dt

Quarter-circle:

»

y dx x dy

» =2

# sin t.  sin t dt/ cos t. cos t dt/ .

General method The path is given by x.t/ and y.t/ . Substitute those into M.x; y/ and N.x; y/ —then F is a function of t . Also find dx=dt and dy=dt . Integrate M dx=dt N dy=dt from the starting time t to the finish.

r r Fig. 15.6 Three paths for F  d R  y dx x dy 1; =2; 0 .

For practice, take the path down the axis to the origin .x  t; y 0/ . Then go up the y axis .x 0; y t  1/ . The starting time at .1; 0/ is t . The turning time at the origin is t

. The finishing time at .0; 1/ is t . The integral has two parts because this new path has two parts: w Bent path: y dx x dy 0.y on one part, then 0/:

Note 3 The answer depended on the path, for this spin field F S . The answer did not

»

depend on the choice of parameter. If we follow the same path at a different speed, the work is the same. We can choose another parameter

, since .ds=dt/dt and .ds=d /d  both equal ds

# » . Traveling twice as fast on the straight path .x  2; y 2 / we finish at  instead of

# t . The work is still :

1=2 1=2

### y dx x dy . 2 /. 2d / .1 2 /.2d /

» [2 d ](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [.](https://ocw.mit.edu/pages/privacy-and-terms-of-use/)

## CONSERVATION OF TOTAL ENERGY (KINETIC

»

## POTENTIAL)

When a force field does work on a mass

m , it normally gives that mass a new velocity. Newton’s Law is F r m

# a md v =dt . (It is a vector law. Why write out three components?) The work F d R is

i Q

.m d v =dt/ . v dt/ m v v m v .Q/

P

```
| | | |  m | v .P / | : (8)
```

The work equals the change in the kinetic energy m v . But for a gradient field the work is also the change in potential —with a minus sign from physics:

### work

» F  d R  » df f .P /  f .Q/: (9)

Comparing .8/ with .9/ , the combination m | v | f is the same at P and Q . The total energy, kinetic plus potential, is conserved .

## INDEPENDENCE OF PATH: GRADIENT FIELDS

The work of the spin field S depends on the path. Example took three paths— straight line, quarter-circle, bent line. The work was , =2 , and , different on each path. This happens for more than 99:99 % of all vector fields. It does not happen for the most important fields. Mathematics and physics concentrate on very special fields—for which the work depends only on the endpoints. We now explain what happens, when the integral is independent of the path . Suppose you integrate from

¾

P to Q on one path, and back to P on another path. Combined, that is a closed path from P to P (Figure 15:7 ). But a backward integral is the negative of a forward integral, since d R switches sign. If the integrals from P to Q are equal, the integral around the closed path is zero :

P Q P Q Q

F R F d F d R F d

P  d » P  R » 0: Q

» d (10)

P

R  » F R

P

# closed path 1 back path 2 path 1 path 2

The circle on the first integral indicates a closed path. Later we will drop the P s .

## 15.2 Line Integrals

Not all closed path integrals are zero! For most fields F , different paths yield work around a closed path conserves energy. The big question is: different work. For “ conservative ” fields, all paths yield the same work. Then zero How to decide which fields are conservative, without trying all paths ? Here is the crucial information about conservative fields, in a plane region

R with no holes :

15D F M.x; y/ i N.x; y/ j is a conservative field if it has these properties: r A. The work F d R around every closed path is zero. r Q

### B. The work

P

F  d R depends only on

# B B P and Q , not on the path.

### C. F is a gradient field : M

B f = B and B N

# B B f = B y for some potential f .x; y/ .

D. The components satisfy M= y N= .

A field with one of these properties has them all. is the quick test.

These statements A  bring everything together for conservative fields (alias gradient fields). A closed path goes one way to Q and back the other way to P . The work cancels, and statements A and B are equivalent. We now connect them to . Note : Test says that the “ curl ” of F is zero. That can wait for Green’s Theorem in the next section—the full discussion of the curl comes in 15:6 . First, a gradient field F = grad f is conservative . The work is f .Q/  f .P / , by the fundamental theorem for line integrals. It depends only on the endpoints and not the path. Therefore statement leads back to B . Our job is in the other direction, to show that conservative fields M i N j are gradients. Assume that the work integral depends only on the endpoints. We must construct a potential f , so that F is its gradient. In other words, B f = B must be M and B f = B y must be N .

Fix the point P: Define f .Q/ as the work to reach Q: Then F equals grad f:

Check the reasoning. At the starting point r P; f is zero. At every other point Q; f is the work M dx N dy to reach that point. All paths from P to Q give the same f .Q/ , because the field is assumed conservative. After two examples we prove that grad f agrees with F —the construction succeeds.

B

### Fig. 15.7

B

Conservative fields:

B ¶ r Q

F  d R and

P

F  d R f .Q/  f .P /: Here f .P / .

EXAMPLE 5 Find f .x; y/ when F M i N j 2xy i j . We want f = 2xy and f = B y :

### Solution 1

# » Choose P .0; 0/ . Integrate Mdx

# » Ndy along to .x; 0/ and up to .x; y/ :

.x;0/ .x;y/

2xy dy 0 . since y 0/ dy y . which is f /:

.0;0/ .x;0/

Certainly f y meets the requirements: f 2xy and f y . Thus F = grad f . Note that dy in the first integral (on the axis). Then dx in the second integral ( is fixed). The integrals add to f y .

Solution 2 Integrate 2xy dx dy on the straight line .xt; yt/ from t to t :

» 2.xt/.yt/.x dt/ .xt/ .y dt/

» 3x yt dt yt  y:

### Most authors use Solution 1

B B

. I use Solution . Most students use Solution 3 :

Solution 3 Directly solve B f = B M 2xy and then fix up

B B

df =dy N :

f = 2xy gives f y . plus any function of y /:

In this example y already has the correct derivative f = y . No additional function of y is necessary. When we integrate with respect to , the constant of integration (usually ) becomes a function C.y/ . You will get practice in finding f . This is only possible for conservative fields! I tested M

»

2xy and N in advance (using

»

) to be sure that B M= B y B N= B .

## EXAMPLE 6

Look for f .x; y/ when M i N j is the spin field  y i j .

Attempted solution Integrate  y dx x dy from .0; 0/ to .x; 0/ to .x; y/ :

.x;0/ .x;y/

y dx and x dy xy . which seems like f /:

.0;0/ .x;0/

### Attempted solution

# »  Integrate  y dx

B B

x dy on the line

.xt; yt/ from

B t B to :

.yt/.x dt/ .xt/.y dt/ 0 . a different f; also wrong /:

B

### Attempted solution

# B B B  Directly solve f =

y and try to fix up f = y :

f = y gives

# f xy . plus any function C.y//:

The y derivative of this f is dC=dy . That does not agree with the required f = y . Conclusion: The spin field y i j is not conservative . There is no f . Test gives B M= B y  and B N= B D C .

To finish this section, we move from examples to a proof. The potential f .Q/ is defined as the work to reach Q . We must show that its partial derivatives are r M and N . This seems reasonable from the formula f .Q/ M dx N dy , but we have to think it through. Remember statement A , that all paths give the same f .Q/ . Take a path that goes from P to the left of Q . It comes in to Q on a line y = constant (so dy ). As the path reaches Q , we are only integrating M dx . The derivative of this integral, at Q , is B f = B M . That is the Fundamental Theorem of Calculus. To show that B f = B y N , take a different path. Go from P to a point below Q . The path comes up to Q on a vertical line (so dx ). Near Q we are only integrating Ndy , so B f = B y N . The requirement that the region must have no holes will be critical for test .

B

## 15.2 Line Integrals

r .x;0/

## EXAMPLE 7

# B Find f .x; y/

.0;0/

x dx y dy: Test is passed: B N= B M= y:

B

r .x;0/

B

r .x;0/

### Solution 1

.0;0/

x dx is added to

.0;0/

y dy y .

r r Solution 2 .xt/.x dt/ .yt/.y dt/ .x y /t dt .x y / .

Solution 3 f = gives f C.y/ . Then B f = B y y needs C.y/ y .

## 15.2 EXERCISES

### Read-through questions

r r Work is the a of F  d R . Here F is the b and R is

c

dx and

c

y dx : any closed circle of radius 3. the c . The d product finds the component of e r

c

.ds=dt/ dt : any path of length 5. in the direction of movement d R dx i dy j . The straight path r .x; y/ = .t; 2t/ goes from

a

f at t to g at t r with

Q Q Does P

xy dy equal xy

P

? r d R dt i h . The work of F i j is F  d R r Q Q

i dt j . Does

P

x dx equal

P

? r r r Another form of d R is T ds , where T is the k vector to the Does .

c ds/ . c dx/ . c

dy/ ? path and ds l . For the path .t; 2t/ , the unit vector T is r Does

c

.ds/ make sense? m and ds n dt . For F i j ; F  T ds is still o dt . This F is the gradient of f p . The change in f 3x y In 11–16 find the work in moving from (1, 0) to (0, 1). When F is from .0; 0/ to .1; 2/ is q . conservative, construct f . choose your own path when F is not When F = grad f , the dot product F  d R is ( B f = B x/dx conservative . r df . The work integral from P to Q is

³ df s . In this case the work depends on the t but not on the u . F i y j F y i j Around a closed path the work is v . The field is called w . F xy i yx j F e

y i xe y

j F .1 y/ i j is the gradient of f . The work from .0; 0/ to .1; 2/ is y , the change in potential. F .x=r/ i .y=r/ j F  y i j

For the spin field S z , the work (does)(does not) For which powers n is S =r

n

a gradient by test ? depend on the path. The path .x; y/ .3 cos t; 3 sin t/ is a For which powers n is R =r

n

circle with S  d R A . The work is B around the a gradient by test ?

complete circle. Formally

r g.x; y/ds is the limit of the sum . A wire hoop around a vertical circle r z a has density  a z . Find its mass M ds . The four equivalent properties of a conservative field F M i N j are A W , B : E , W F , and : G . A wire of constant density  lies on the semicircle r y Test r is (passed)(not passed) by F .y 1/ i j . The work a ; y ¡ . Find its mass

M and also its moment M y ds . F d R around the circle (cos t; sin t ) is H . The work on Where is its center of mass

¤ ¤

N M y =M , y N M =M ? the upper semicircle equals the work on I . This field is the If the density around the circle y a is  , what is gradient of f J , so the work to .  1; 0/ is K . the mass and where is the center of mass? Compute the line integrals in 1–6 . r Find F d R along the space curve t; y t ; z t ; r r t .

c

ds and

c

dy : t , y 2t , ¤ t ¤ . r r

c

x ds and

c

xy ds : cos t , y sin t , ¤ t ¤ =2 . (a) F grad .xy xz/ (b) F y i r

c

xy ds : bent line from .0; 0/ to .1; 1/ to .1; 0/ . r

c

y dx x dy : any square path, sides of length 3.

j z k

(a) Find the unit tangent vector T and the speed ds=dt along the path R 2t i t j .

(b) For F 3x i j , find F  T ds using (a) and F  d R F y i directly. (c) What is the work from .2; 1/ to .4; 4/ ?

If M.x; y; z/ i N.x; y; z/ j is the gradient of f .x; y; z/ , show that none of these functions can depend on z .

```
 j F .x i y j /=.x y 1/
```

For which numbers a and b is F axy i .x by/ j a gradient field?

Find all gradient fields of the form M.y/ i N.x/ j . r Compute the work W .x; y/ M dx N dy on the straight line path .xt; yt/ from t to t . Test to see if B W= B M and B W= B y N .

# r Compute  ydx xdy from .1; 0/ to .0; 1/ on the line t ; y

t

and the quarter-circle

cos 2t , y sin 2t . Example found and =2 with different parameters.

### Apply the test

| N |

M y to 37–42. Find f when test D is passed .

(a) M y ; N 3xy (b) M ; N 3yx F y e i 2ye j F y

ex

(c) M x=y; N y=x (d) M e

y

### ; N e

y i y j F i y j | i  2ye j

grad xy F grad xy Find a field F whose work around the unit square .y then then y then ) equals .

Find a nonconservative F whose work around the unit circle y is zero. r

| F R S

In 29–34 compute F  d R along the straight line R t i t j and the parabola R t i t j, from (0,0) to (1,1). When F is a gradient field, use its potential f .x; y/ .

¶ F

¶ .ax

F i  j F j

F 2xy i 2yx j F y i xy j

### by/

¶ i .cx dy/ j

Around the unit circle find ds and dx and xds .

True or false , with reason: r (a) When F y i the line integral F d R along a curve from P to Q equals the usual area under the curve. (b) That line integral depends only on P and Q , not on the curve. (c) That line integral around the unit circle equals  .

## 15.3 Green’s Theorem

## 15.3 Green’s Theorem

This section contains the Fundamental Theorem of Calculus, extended to two dimensions. That sounds important and it is. The formula was discovered years after Newton and Leibniz, by an ordinary mortal named George Green. His theorem connects a double integral over a region R to a line integral along its boundary C:

The integral of df =dx equals f .b/  f .a/: This connects a one-dimensional integral to a zero-dimensional integral. The boundary only contains two points a and b ! The answer f .b/  f .a/ is some kind of a “point integral.” It is this absolutely crucial idea—to integrate a derivative from information at the boundary —that Green’s Theorem extends into two dimensions.

r [r](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) There are two important integrals around r r

C: The work is F  T ds M dx N dy: The flux is F n ds M dy N dx (notice the switch). The first is for a force field, the second is for a flow field. The tangent vector T turns

clockwise to become the normal vector n : Green’s Theorem handles both, in two dimensions. In three dimensions they split into the Divergence Theorem (15.5) and Stokes’ Theorem (15.6).

Green’s Theorem applies to “smooth” functions M.x; y/ and N.x; y/; with continuous first derivatives in a region slightly bigger than R: Then all integrals are well defined. M and N will have a definite and specific meaning in each application—to electricity or magnetism or fluid flow or mechanics. The purpose of a theorem is to capture the central ideas once and for all. We do that now, and the applications follow.

15E Green’s Theorem Suppose the region R is bounded by the simple closed piecewise smooth curve C: Then an integral over

B  R

# B equals a line integral around : ¾   N M M dx N dy

» » R

B B dx dy: (1) y

A curve is “simple” if it doesn’t cross itself (figure ’s are excluded). It is “closed” if its endpoint Q is the same as its starting point P: This is indicated by the closed circle on the integral sign. The curve is “smooth” if its tangent T changes continuously— the word “piecewise” allows a finite number of corners. Fractals are not allowed, but all reasonable curves are acceptable (later we discuss figure ’s and rings). First comes an understanding of the formula, by testing it on special cases.

u rr u rr Fig. 15.8 Area of R adds up strips: x dy dx dy and y dx  dy dx:

Special case 1 :

# ¾ M and

» N

# » x: Green’s Theorem with B N= B becomes

x dy 1 dx dy (which is the area of R ) : (2)

R

The integrals look equal, because the inner integral of dx is x: Then both integrals have x dy —but we need to go carefully. The area of a layer of R is dy times the difference in (the length of the strip). The line integral in Figure 15.8 agrees. It has an upward dy times (at the right) plus a downward  dy times (at the left). The integrals add up the strips, to give the total area. u rr Special case 2 : M y and N and y dx

R

.  1/dx dy  .

# ¡ area of R/:

Now Green’s formula has a minus sign, because the line integral is counterclockwise . The top of each slice has dx (going left) and the bottom has dx (going right). Then y dx at the top and bottom combine to give minus [the area of the slice in](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) Figure 15.8b. u Special case 3 : 1 dx 0: The dx ’s to the right cancel the dx ’s to the left (the curve is closed). With

B

M and N 0; Green’s Theorem is 0:

### Most important case

B

:

B B M i

B B

N j is a gradient field . It has a potential function f .x; y/: Green’s Theorem is 0; because B M= B y B N=

# B B B x: This is test :     M f N f is the same as : (3) y y B B B B y

The cross derivatives always satisfy f yx f xy : That is why gradient fields pass test : u When the double integral is zero, the line integral is also zero:

ñ M dx

# ñ N dy 0: The work is zero.

B B B

The field is conservative ! This last step in A B ñ ñ A will be complete when Green’s Theorem is proved. u u Conservative examples are

B  ¾

x dx and

¾

y dy 0: Area is not involved. u

u Remark The special cases x dy and y dx led to the area of rr R: As long as N= M= y; the double integral becomes 1 dx dy: This gives a way to compute area by a line integral.

### The area of R is x dy y dx

¾ .x dy  y dx/: (4)

EXAMPLE 1 The area of the triangle in Figure 15.9 is 2: Check Green’s Theorem. The last area formula in (4) uses S ; half the spin field. N rr and M  y yield N  M y 1: On one side of Green’s Theorem is 1 dx dy area of triangle. On the other side, the line integral has three pieces.

Fig. 15.9 Green’s Theorem: Line integral around triangle, area integral for ellipse.

¾

## 15.3 Green’s Theorem

Two pieces are zero: x dy  y dx

# »  on the sides where and y 0: The sloping side y has dx dy: The line integral agrees with the area, confirming Green’s Theorem:

x dy y dx .2  y/dy y dy

» 2dy 2:

y

EXAMPLE 2 The area of an ellipse is ab when the semiaxes have lengths a and b .

This is a classical example, which all authors like. The points on the ellipse are a cos t; y b sin t; as t goes from to 2: (The ellipse has [.x=a/](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [.y=b/](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) 1:/ By computing the boundary integral, we discover the area inside. Note that the differential x dy  y dx is just ab dt :

.a cos t/.b cos t dt/  .b sin t/.  a sin t dt/ ab. cos t sin t/dt ab dt:

r The line integral is ab dt ab: This area ab is  r ; for a circle with a b r: Proof of Green’s Theorem : In our special cases, the two sides of the formula were equal. We now show that they are always equal. The proof uses the Fundamental Theorem to integrate . B N= B x/dx and . B M= B y/dy: Frankly speaking, this one-dimensional theorem is all we have to work with—since we don’t know M and N:

¾

The proof is a step up in mathematics, to work with symbols

» »  B

M and N instead of specific functions. The integral in (6) below has no numbers. The idea is to deal with M and N in two separate parts, which added together give Green’s Theorem:

# B M M dx dx dy and separately N dy

R

y

¾ B » » R

| B   | N      |
| --- | ------ |
| B   | dx dy: |

(5) Start with a “very simple” region (Figure 15.10a). Its top is given by

»

y f .x/ and its bottom by y

i

B B

g.x/: In the double integral, integrate B M= y first with respect to y: The inner integral is

f .x/

M f .x/

dy M.x; y/ M.x; f .x// M.x; g.x//: (6)

g.x/ y   g.x/  ¾ »

The Fundamental Theorem (in the y variable) gives this answer that depends on x: If we knew M and f and g; we could do the outer integral—from a to b: But we have to leave it and go to the other side of Green’s Theorem—the line integral:

a b

M dx M.x; y/dx M.x; g.x//dx:

top

» M.x; y/dx

bottom

```
» M.x; f .x//dx
```

b » a (7)

Fig. 15.10 Very simple region (a  b). Simple region (c) is a union of very simple regions.

Compare

B B

(7) with (6) . The integral of M.x; g.x// is the same for both. The integral of M.x; f .x// has a minus sign from (6) . In .7/ [it has a plus sign but the integral is](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) from b to a: So life is good. The part for N uses the same idea. Now the integral comes first, because . N= x/dx is practically asking to be integrated—from G.y/ at the left to F .y/ u at the right. We reach N.F .y/; y/  N.G.y/; y/: Then the y integral matches N dy and completes (5) . Adding the two parts of (5) proves Green’s Theorem.

Finally we discuss the shape of R: The broken ring in Figure 15.10 is not “very simple,” because horizontal lines go in and out and in and out. Vertical lines do the same. The and y strips break into pieces. Our reasoning assumed no break between y f .x/ at the top and y g.x/ at the bottom. There is a nice idea that saves Green’s Theorem. Separate the broken ring into three very simple regions R ; R ; R : The three double integrals equal the three line integrals around the R ’s. Now add these separate results , to produce the double integral over all of R: When we add the line integrals, the crosscuts C C are covered twice and they cancel . The cut between R and R is covered upward (around R ) and downward (around R ). That leaves the integral around the boundary equal to the double integral inside—which is Green’s Theorem. When R is a complete ring, including the piece R ; the theorem is still true. The integral around the outside is still counterclockwise. But the integral is clockwise around the inner circle. Keep the region R to your left as you go around C: The complete ring is “doubly” connected, not “simply” connected. Green’s Theorem allows any finite number of regions R i and crosscuts C C and holes.

r b

EXAMPLE 3 The area under a curve is

a

y dx; as we always believed.

In computing area we never noticed the whole boundary. The true area is a line

u integral  y dx around the closed curve in Figure 15.11a. But y on the axis. Also dx on the vertical lines (up and down at b and a ). Those parts contribute zero to the integral of y dx: The only nonzero part is back along the curve—which is r a

r b

the area

b

y dx or

a

y dx that we know well. What about signs, when the curve dips below the axis? That area has been counted as negative since Chapter 1. I saved the proof for Chapter 15. The reason lies in the arrows on C: The line integral around that part goes the other way . The arrows are clockwise, the region is on the right , and the area counts as negative. With the correct rules, a figure 8 is allowed after all.

## 15.3 Green’s Theorem

Fig. 15.11 Closed path gives the sign of the area. Nonconservative field because of hole.

## CONSERVATIVE FIELDS

We never leave gradients alone! They give conservative fields—the work around a closed path is f .P /  f .P / 0: But a potential function f .x; y/ is only available when test is passed: If B f = B M and B f = B y N then B [M=](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) B [y](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) B [N=](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) B [.](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) The reason is that f xy f yx : Some applications prefer the language of “differentials.” Instead of looking for f .x; y/; we look for df :

DEFINITION The expression M.x; y/dx N.x; y/dy is a differential form . When it agrees with the differential df . B f = B x/dx . B f = B y/dy of some function, the form is called exact . The test for an exact differential is : B N= B B M= B y:

Nothing is new but the language. Is y dx an exact differential? No , because M y

and N 0: Is y dx x dy an exact differential? Yes , it is the differential of f xy: That is the product rule! Now comes an important example, to show why R should be simply connected (a region with no holes).

EXAMPLE 4 The spin field S =r .  y i j /=.x y / almost passes test :

N

B y x.2x/

»

y .x y / y.2y/ M y :

B y  .x y  /  B B y  y

.x y / (8) Both numerators are y : Test looks good. To find f; integrate M B f = B :

f .x; y/ y dx=.x y / tan .y=x/ C.y/:

The extra part

C.y/ can be zero—the y derivative of tan

# .y=x/ gives N with no help from C.y/: The potential f is the angle  in the usual x; y; r right triangle.

¾

Test is passed and

¾

F is grad : What am I worried about? It is only this,

rr that Green’s Theorem on a circle seems to give

0: The double integral is .N M y /dx dy: According to (8) this is the integral of zero. But the line integral is :

F d R .  y dx x dy/=.x y / 2. area of circle /=a 2a =a 2:

(9) With a cos t and y a sin t we would find the same answer. The work is (not zero!) when the path goes around the origin . We have a paradox. If Green’s Theorem is wrong, calculus is in deep trouble. Some requirement must be violated to reach 0: Looking at S =r ; the problem is at the origin. The field is not defined when r (it blows up). The derivatives in (8)

are not continuous. Test does not apply at the origin, and was not passed. We could remove .0; 0/; but then the region where test is passed would have a hole .

It is amazing how one point can change everything. When the path circles the origin, the line integral is not zero. r

The potential function f rr  increases by . That agrees with F d R from (9) . It disagrees with 0 dx dy: The is right, the zero is wrong. N M y must be a “ delta function of strength 2: ”

The double integral is from an infinite spike over the origin—even though N M y everywhere else. In fluid flow the delta function is a “vortex.”

## FLOW ACROSS A CURVE: GREEN’S THEOREM TURNED BY

A flow field is easier to visualize than a force field, because something is really there and it moves. Instead of gravity in empty space, water has velocity M.x; y/ i N.x; y/ j : At the boundary it can flow in or out. The new form of Green’s Theorem is a fundamental “balance equation” of applied mathematics:

Flow through (out minus in) replacement in R (source minus sink).

The flow is steady . Whatever goes out through must be replaced in R: When there are no sources or sinks (negative sources), the total flow through must be zero. This balance law is Green’s Theorem in its “normal form” (for n ) instead of its “tangential form” (for T ):

r 15F For a steady flow field

# ¾ F M.x; y/ i N.x; y/ j ; the flux F  n ds through the boundary balances the replacement of fluid inside R :

M dy  N dx » »   R

B dx dy:

B M B (10)

B N y

¾

Figure 15.12 shows the

¾

turn. T

»

becomes n and “circulation” along

»

becomes flux through

Ñ C:

In the original form of Green’s Theorem, change

»  Ñ »

N and M to M and N to obtain the flux form:

M dx N dy N dx M dy .N M y /dx dy .M N y /dx dy:

(11) Playing with letters has proved a new theorem! The two left sides in (11) are equal,

so the right sides are equal—which is Green’s Theorem (10) for the flux. The

components M and N can be chosen freely and named freely.

The change takes M i N j into its perpendicular field  N i M j : The field is turned at every point (we are not just turning the plane by

). The spin field S y i j changes to the position field R i y j : The position field R changes to S : Streamlines of one field are equipotentials of the other field. The new form (10) of Green’s Theorem is just as important as the old one—in fact I like it better. It is easier to visualize flow across a curve than circulation along it.

## 15.3 Green’s Theorem

Fig. 15.12 The perpendicular component F  n flows through C: Note n ds dy i  dx j :

The change of letters was just for the proof. From now on F M i N j :

EXAMPLE 5 Compute both sides of the new form (10) for F 2x i 3y j : The region R is a rectangle with sides a and b:

Solution rr This field has B M= B B N= B y 3: The integral over R is

R

5 dx dy 5ab: The line integral has four parts, because R has four sides. Between the left and right sides, r M 2x increases by 2a: Down the left and up the right, M dy 2ab (those sides have length b ). Similarly N 3y changes by 3b between the bottom and top. Those sides have length a; so they contribute 3ab to a total line integral of 5ab:

Important: The “divergence” of a flow field is B M= B B N= B y: The example has divergence 5: To maintain this flow we must replace units continually—not just at the origin but everywhere. (A one-point source is in example 7.) The divergence is the source strength, because it equals the outflow. To understand Green’s Theorem for any vector field M i N j ; look at a tiny rectangle (sides dx and dy ):

Flow out the right side minus flow in the left side . change in M / times dy

Flow out the top minus flow in the bottom . change in N / times dx

Total flow out of rectangle: dM dy dN dx . B M= B B N= B y/dx dy:

The divergence times the area dx dy equals the total flow out . Section 15:5 gives more detail with more care in three dimensions. The divergence is M N y P z :

Fig. 15.13 M N y yields flux 5. area / 5ab: The flux is dM dy dN dx .M N y /dx dy: The spin field has no flux.

EXAMPLE 6 Find the flux through a closed curve of the spin field S  y i j :

Solution The field has M  y and N and M N y 0: The double integral is zero . Therefore the total flow (out minus in) is also zero—through any closed

curve. Figure 15.13 shows flow entering and leaving a square. No fluid is added or removed. There is no rain and no evaporation. When the divergence M N y is zero, there is no source or sink .

## FLOW FIELDS WITHOUT SOURCES

This is really quite important. Remember that conservative fields do no work around C; they have a potential f; and they have “zero curl.” Now turn those statements through

; to find their twins. Source-free fields have no flux through C; they have stream functions g; and they have “ zero divergence. ” The new statements E–F–G–H describe fields without sources.

15G The field F M.x; y/ i N.x; y/ j is source-free if it has these properties: u E The total flux F  n ds through every closed curve is zero. r Q

F Across all curves from P

B to Q;

# B the flux

B B P

F  n ds is the same.

G There is a stream function g.x; y/; for which M B g= B y and N B g= B x: H The components satisfy

M= N= y ( the divergence is zero ).

A field with one of these properties has them all. H is the quick test.

The spin field y i j passed this test (Example 6 was source-free). The field 2x i 3y j does not pass (Example 5 had M N y ). Example almost passes .

EXAMPLE 7 The radial field R =r .x i y j /=.x y / has a point source at .0; 0/:

# B B The new test H is divergence

# B M= B B B B N= B y 0: Those two derivatives are

y x.2x/ y y and y .x y / y y

y.2y/ : (12)

¾

### .x y /

They add to zero. There seems to be no source (if the calculation is correct). The flow through a circle

y

# ¾ a should be zero. But it’s not:

M dy N dx .x dy  y dx/=.x y / 2. area of circle /=a 2:

(13) A source is hidden somewhere. Looking at R =r ; the problem is at .0; 0/: The field is not defined when r (it blows up). The derivatives in (12) are not continuous. Test H does not apply, and was not passed. The divergence M N y must be a “delta function” of strength 2: There is a point source sending flow out through all circles. I hope you see the analogy with Example 4. The field S =r is curl-free except at r 0: The field R =r is divergence-free except at r 0: The mathematics is parallel and the fields are perpendicular. A potential f and a stream function g require a region without holes.

## 15.3 Green’s Theorem

## THE BEST FIELDS: CONSERVATIVE AND SOURCE-FREE

What if F is conservative and also source-free ? Those are outstandingly important fields. The curl is zero and the divergence is zero. Because the field is conservative, it comes from a potential. Because it is source-free, there is a stream function:

### f M

# B g and N

B f

B B g y

B : (14)

B y

B B

Those are the Cauchy-Riemann equations , named after a great mathematician of his time and one of the greatest of all time. I can’t end without an example.

EXAMPLE 8 Show that y i j is both conservative and source-free. Find f and g:

Solution With M y and N x; check first that B M= B y B N= B x: There must be a potential function. It is f xy; which achieves B f = B y and B f = B y x: Note that f xx f yy 0: Check next that B M= B B N= B y 0: There must be a stream function. It is g .y  /; which achieves B g= B y y and B g= B  x: Note that g xx

g yy 0: The curves f constant are the equipotentials. The curves g constant are the streamlines (Figure 15.4). These are the twin properties—a conservative field with a potential and a source-free field with a stream function. They come together into the fundamental partial differential equation of equilibrium— Laplace’s equation f xx f yy 0:

15H There is a potential and stream function when M y N and M  N y : They satisfy Laplace’s equation :

f xx f yy M N y and g xx g yy  N M y 0: (15)

If we have f without g; as in f y and M 2x and N 2y; we don’t have Laplace’s equation: f xx f yy 4: This is a gradient field that needs a source. If we have g without f; as in g y and M 2y and N  2x; we don’t have Laplace’s equation. The field is source-free but it has spin. The first field is R and the second field is S : With no source and no spin, we are with Laplace at the center of mathematics and science.

# ¾ Green’s Theorem

# » : Tangential form

»  u ¾

u F  T ds and normal form

» F  n ds

### M dx N dy .N M

y /dx dy M dy N dx .M N /dx dy

R

» y R

work curl flux divergence

Conservative: work zero, N M y ; gradient of a potential: M f and N f y

Source-free: flux zero, M N y ; has a stream function: M g y and N  g Conservative source-free: Cauchy-Riemann Laplace equations for f and g:

## 15.3 EXERCISES

### Read-through questions

B

u u The work integral

B M dx

B B N dy equals the double integral a For constants b and c; how is by dx cx dy related to the by b ’s Theorem. For F i j the work is c . For area inside ? If b 7; which c makes the integral zero? F d and e , the work equals the area of R: When For F grad

a

u y ; show in three ways that F  d R M f = and N f = y; the double integral is zero because around cos t; y sin t: f . The line integral is zero because g . An example is F h . The direction on is i around the outside and (a) F is a gradient field so :

j around the boundary of a hole. If R is broken into very (b) Compute F and directly integrate F d R :

simple pieces with crosscuts between them, the integrals of k (c) Compute the double integral in Green’s Theorem. cancel along the crosscuts. Devise a way

# to find the one-dimensional theorem r b

Test a

.df =dx/dx f .b/ f .a/ as a special case of Green’s u for gradient fields is

# l . A field that passes this test has F d R

m . There is a solution to f n and Theorem when R [is a square.](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) f y o . Then df M dx N dy is an p differential. (a) Choose x.t/ and y.t/ so that the path goes from .1; 0/ The spin field S =r passes test except at q . Its potential to .1; 0/ after circling the origin twice . f r rr increases by s going around the origin. The u (b) Compute y dx and compare with the area inside your integral .N M y /dx dy is not zero but t . path. u The flow form of Green’s Theorem is u v . The nor- (c) Compute .y dx  x dy/=.x y / and compare with mal vector in F  n ds points w and | n | and n ds in Example 7. r equals dy i  dx j : The divergence of M i N j is y . For F In Example of the previous section, the work S  d R i the double integral is z . There (is)(is not) a source. For between .1; 0/ and .0; 1/ was for the straight path and =2 F y i the divergence is A . The divergence of R =r is zero for the quarter-circle path. Show that the work is always twice except at B . This field has a source. the area between the path and the axes. u rr A field with no source has properties E , F E , Compute both sides of

¤

F  n ds

¤

.M N y /dx dy in G F , H zero divergence. The stream function g 15–20 . satisfies the equations G . Then B M= B B N= B y F y i j in the unit circle because B g= B B y H . The example F y i has g I . There (is)(is not) a potential function. The example F xy i in the unit square x; y F i  y j has g J and also f K . This f satisfies F R =r in the unit circle Laplace’s equation L , because the field F is both M and N . The functions f and g are connected by the O F S =r in the unit square

equations B f = B B g= B y and P . F y j in the unit triangle (sides 0; y 0; x y )

Compute the line integrals 1–6 and (separately) the double in- F grad r in the top half of the unit circle. tegrals in Green’s Theorem (1) . The circle has a cos t; y u Suppose div F except at the origin. Then the flux a sin t: The triangle has sides 0; y 0; x y 1: F u u x dy along the circle y dy along the circle u u x dx along the triangle y dx along the triangle u u y dx along the circle y dx along the triangle

# n ds is the same through any two circles around the origin, rr because : (What is .M N y /dx dy between the circles?)

Example has div F except at the origin. The flux through every circle y a is 2: The flux through a square around the origin is also because : (Compare Problem 21: ) Compute both sides of Green’s Theorem in the form (10): u Evaluate a.x; y/dx b.x; y/dy by both forms of Green’s (a) F i y j ; R upper half of the disk y ¤ 1: Theorem. The choice M a; N b in the work form gives the dou- (b) F i xy j ; C square with sides y 0; x 1; y 1; ble integral : The choice M b; N  a in the flux form 0: gives the double integral

u Show that .x y 2x/dy xy dx depends only on the area of R: Does it equal the area?

u Find the area inside the hypocycloid cos t; y sin t from x dy y dx:

B B

: There was only one Green. u Evaluate cos y dy  sin x dx by Green’s Theorem.

The field R =r in Example 7 has zero divergence except at r 0: Solve g= y x=.x y / to find an attempted stream function g: Does g have trouble at the origin?

B

## 15.3 Green’s Theorem

Show that S =r has zero divergence (except at

# B r ). Find Since div

B F

# B in Problem 39; we can solve B g= a stream function by solving g= y y=.x

# B  y /: Does g have trouble at the origin?

# B y and g= : The stream function is g : It is the imaginary part of the same .x iy/ : Check that f and g satisfy the Cauchy–Riemann equations.

B

Which differentials are exact: y dx x dy; dx y dy; y dx dy ? The real part f and imaginary part g of .x iy/

n

satisfy the Laplace and Cauchy-Riemann equations for n 1; 2; :::: (They If M N y

then the equations B g= B y and give all the polynomial solutions.) Compute f and g for g= yield a stream function. If also N M y ; show n 4: that g satisfies Laplace’s equation. When is M dy  N dx an exact differential dg ? Compute

the divergence of each field in 29–36 and solve The potential f e cos y satisfies Laplace’s equation. g y M and g N for a stream function (if possible) . There must be a g: Find the field F grad f and the stream function g.x; y/: 2xy i y j 3xy i y j

### i y j y i j

e cos y i  e sin

y j e  y

### . i j /

### 2y i =x y j =x

# Show that the spin field S does work around every simple closed curve.

For F f .x/ j and R unit square ¤ ¤ 1; ¤ y ¤ 1; xy i xy j integrate both sides of Green’s Theorem .1/: What formula is required from one-variable calculus?

Compute N M y for each field

in 29–36 and find a A region R is “ simply connected ” when every closed curve inpotential function f when possible. side R can be squeezed to a point without leaving R: Test these r Q

The potential f .Q/ is the work

P

F T ds to reach Q from regions:

a fixed point P (Section 15:2 ). In the same way, the stream function

g.Q/ can be constructed from the integral : 1. xy plane without .0; 0/ 2. xyz space without .0; 0; 0/ Then g.Q/  g.P / represents the flux across the path from P to 3. sphere y z 4. a torus (or doughnut) Q: Why do all paths give the same answer? 5. a sweater 6. a human body 7. the region between two spheres The real part of .x iy/ 3ix y  3xy  iy is f 3xy : Its gradient field is F grad f : The di- 8. xyz space with circle removed.

vergence of F is : Therefore f satisfies Laplace’s equation f xx f yy (check that it does).

## 15.4 Surface Integrals

The double integral in Green’s Theorem is over a flat surface R . Now the region moves out of the plane. It becomes a curved surface S , part of a sphere or cylinder or cone. When the surface has only one z for each ( x; y ), it is the graph of a function z.x; y/ . In other cases S can twist and close up—a sphere has an upper z and a lower z . In all cases we want to compute area and flux. This is a necessary step (it is our last step) before moving Green’s Theorem to three dimensions. r rr rrr First a quick review. The basic integrals are r dx and dx dy and dx dy dz . The one that didn’t fit was ds —the length of a curve. When we go from curves rr rr to surfaces, ds becomes dS . Area is dS and flux is F  n dS , with double integrals because the surfaces are two-dimensional. The main difficulty is in dS . All formulas are summarized in a table at the end of the section [.](https://ocw.mit.edu/pages/privacy-and-terms-of-use/)

There are two ways to deal with ds (along curves). The same methods apply to dS (on surfaces). The first is in xyz coordinates; the second uses parameters. Before this subject gets complicated, I will explain those two methods.

Method is for the graph of a function: curve y.x/ or surface z.x; y/ .

A small piece of the curve is almost straight. It goes across by dx and up by dy :

length ds

a .dx/ .dy/

a .dy=dx/ dx: (1)

A small piece of the surface is practically flat. Think of a tiny sloping rectangle. One side goes across by dx and up by . B z= B x/dx . The neighboring side goes along by dy and up by . B z= B y/dy . Computing the area is a linear problem (from Chapter ), because the flat piece is in a plane. Two vectors A and B form a parallelogram. The length of their cross product is the area . In the present case, the vectors are A i . B z= B x/ k and B j . B z= B y/ k . Then A dx and B dy are the sides of the small piece, and we compute A  B :

i j A  B        B B k

```
z= B z= i z= y j k : (2)
```

z= B y

B B  B B

This is exactly the

|

### normal vector

| |

N to the tangent plane and the surface, from Chapter 13. Please note: The small flat piece is actually a parallelogram (not always a rectangle). Its area dS is much like

# | ds , but the length of N A  B involves two derivatives:

area dS A dx B dy N dxdy

```
a . B z= B x/ . B z= B y/ dx dy: (3)
```

EXAMPLE 1 Find the area on the plane z 2y above a base area A .

This is the example to visualize . The area down in the xy plane is A . The area up on the sloping plane is greater than A . A roof has more area than the room underneath it. If the roof goes up at a

# angle, the ratio is

# ? . Formula (3) yields the correct ratio for any surface—including our plane z 2y .

## 15.4 Surface Integrals

Fig. 15.14 Roof area = base area times | N |. Cone and cylinder with parameters u and v .

The derivatives are B z= B and B z= B y . They are constant (planes are easy). The square root in (3) contains . Therefore dS

# ? [6 dx dy](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [. An area](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) in the xy plane is multiplied by

# ? up in the surface (Figure 15.14a). The vectors A and B are no longer needed—their work was done when we reached formula (3) —but here they are:

A i . B z= B x/ k i k B j . B z= B y/ k j k N  i  j k :

The length of N A  B is

# ? . The angle between k and N has cos  1=

# ? . That is the angle between base plane and sloping plane . Therefore the sloping area is

# ? times the base area. For curved surfaces the idea is the same, except that the square root in | N | 1= cos  changes as we move around the surface.

Method is for curves x.t/; y.t/ and surfaces x.u; v/; y.u; v/; z.u; v/ with parameters .

A curve has one parameter t . A surface has two parameters u and v (it is twodimensional). One advantage of parameters is that x; y; z get equal treatment, instead of picking out z as f .x; y/ . Here are the first two examples:

cone u cos v; y u sin v; z u cylinder cos v; y sin v; z u: (4)

Each choice of u and v gives a point on the surface. By making all choices, we get the complete surface. Notice that a parameter can equal a coordinate, as in z u . Sometimes both parameters are coordinates, as in u and y v and z f .u; v/ . That is just z f .x; y/ in disguise—the surface without parameters. In other cases we find the xyz equation by eliminating u and v :

cone .u cos v/ .u sin v/ u or y z or z

a y

cylinder . cos v/ . sin v/ or y 1:

The cone is the graph of f

a y . The cylinder is not the graph of any function. There is a line of z s through each point on the circle y . That is what z u tells us: Give u all values, and you get the whole line. Give u and v all values, and you get the whole cylinder. Parameters allow a surface to close up and even go through itself—which the graph of f .x; y/ can never do. Actually z

# a y gives only the top half of the cone. (A function produces only one z .) The parametric form gives the bottom half also. Similarly y

# ?  gives only the top of a circle, while cos t; y sin t goes all the way around.

Now we find dS , using parameters. Small movements give a piece of the surface, practically flat. One side comes from the change du , the neighboring side comes from dv . The two sides are given by small vectors A du and B dv :

A B i

B B z y z

### ! ! !

j i u B y B j

u B B  k and  u B B v

B k : (5)

B v B B v

### i j k z y y

u z u

To find the area

B B

dS of the parallelogram, start with the cross product N A  B :

y z z N u y i

v y v z v

B z u B B v

B u

B j k :

B v B B u

B B v

B y

B u B B v

B B u B B v  B B u B B v

(6) Admittedly this looks complicated—actual examples are often fairly simple. The area dS of the small piece of surface is

!

B B B  B B B B B B B B | N |

### du dv

B B B B

## . The length

B B | N

# B | is a square root:

### dS

g f ! !

f e B y z z y z z y y u v u v u v u v u

B v

B B u

B du dv:

B v (7)

EXAMPLE 2 Find A and B and N A  B and dS for the cone and cylinder.

The cone has u cos v , y u sin v , z u . The u derivatives produce A

B B R

B = B u cos v i sin v j k . The v derivatives produce the other tangent vector B R = v u sin v i u cos v j . The normal vector is A  B  u cos v i  u sin v j u k . Its length gives dS :

dS | A  B | du dv

# a .u cos v/ .u sin v/ u du dv

? 2 u du dv:

The cylinder is even simpler:

|

dS dudv . In these and many other examples, A is perpendicular to B . The small piece is a rectangle . Its sides have length | A | du and | B | dv . (The cone has | A | u and | B | ? , the cylinder has | A | | B | ). The cross product is hardly needed for area, when we can just multiply B | | A | du times dv .

Remark on the two methods Method also used parameters, but a very special choice— u is and v is y . The parametric equations are , y y , z f .x; y/ . If you go through the long square root in (7) , changing u to and v to y , it simplifies to the square root in (3) . (The terms B y= B and B x= B y are zero; B x= B and B y= B y are .) Still it pays to remember the shorter formula from Method .

|

Don’t forget that after computing dS , you have to integrate it. Many times the good is with polar coordinates. Surfaces are often symmetric around an axis or a point. Those are the surfaces of revolution —which we saw in Chapter 8 and will come back to. Strictly speaking, the integral starts with S (not dS ). A flat piece has area A  B | xy or | A  B | uv . The area of a curved surface is properly defined as a limit. The key step of calculus, from sums of S to the integral of dS , is safe for

## 15.4 Surface Integrals

smooth surfaces. In examples, the hard part is computing the double integral and substituting the limits on x; y or u; v .

EXAMPLE 3 Find the surface area of the cone z

# a y up to the height z

B

a . We use Method 1 (no parameters). The derivatives of

a B B |

z are computed, squared, and added:

B z z

a y y N y y y

| 2: y y

Conclusion: | N | ? and dS

# ? 2 dx dy . The cone is on a

# slope, so the area dx dy in the base is multiplied by

# ? in the surface above it (Figure 15.15). The square root in

a

dS accounts for the extra area due to slope. A horizontal surface has dS

? 1 dx dy , as we have known all year. Now for a key point. The integration is down in the base plane . The limits on and y are given by the “ shadow ” of the cone. To locate that shadow set z y equal to z a . The plane cuts the cone at the circle

# ? ? ? y a . We integrate over the inside of that circle (where the shadow is): rr surface area of cone 2 dx dy 2 a :

shadow

EXAMPLE 4 Find the same area using dS 2 u du dv from Example .

With parameters, dS looks different and the shadow in the base looks different. The circle y a becomes u cos v u sin v a . In other words u a . (The cone has z u , the plane has z a , they meet when u a .) The angle parameter v goes from to . The effect of these parameters is to switch us “automatically” to polar coordinates, where area is r dr d : ww w w a

surface area of cone dS

? 2 u du dv

? 2 a :

Fig. 15.15 Cone cut by plane leaves shadow in the base. Integrate over the shadow.

EXAMPLE 5 Find the area of the same cone up to the sloping plane z  .

Solution The cone still has dS

# ? 2 dx dy , but the limits of integration are changed. The plane cuts the cone in an ellipse. Its shadow down in the xy plane is another

ellipse (Figure 15.15c). To find the edge of the shadow, set z

# a y equal to z  . We square both sides:

?

y  or .x / y :

This is the ellipse in the base—where height makes no difference and z is gone. The area of an ellipse is ab , when the equation is in the form .x=a/ ’ .y=b/ . After multiplying by 3=4 we find a

# ? 4=3 and b

# ? 4=3 . Then

? 2 dx dy 2 ab is the surface area of the cone. The hard part was finding the shadow ellipse (I went quickly). Its area ab came from Example 15:3:2 . The new part is from the slope.

EXAMPLE 6 Find the surface area of a sphere of radius a (known to be 4a ).

This is a good example, because both methods almost work. The equation of the sphere is

B B

### y z

# B B a . Method writes z

# a a   y . The and y derivatives are  x=z and  y=z : ! ! z z z y a a : y z

a z

z

z a   y

The square root gives dS a dx dy= a y . Notice that z is gone (as it should be). Now integrate dS over the shadow of the sphere, which is a circle. Instead of dx dy , switch to polar coordinates and

» » ?   r dr d

a  :

rr a

a r dr d  a

dS 2a a r 2a : (8)

shadow a r

This calculation is successful but wrong. 2a is the area of the half-sphere above the xy plane. The lower half takes the negative square root of z a   y . This shows the danger of Method , when the surface is not the graph of a function.

EXAMPLE 7 (same sphere by Method : use parameters ) The natural choice is spherical coordinates. Every point has an angle u  down from the North Pole and an angle v  around the equator. The xyz coordinates from Section 14.4 are a sin  cos  , y a sin  sin  , z a cos  . The radius  a is fixed (not a parameter). Compute the first term in equation (6) , noting B z= B  :

. B y= B /. B z= B  /  . B z= B /. B y= B  /  .  a sin /.a sin  cos  / a sin  cos :

The other terms in (6) are a sin  sin  and a sin  cos  . Then dS in equation (7) squares these three components and adds. We factor out a and simplify:

a . sin  cos  sin  sin  sin  cos / a . sin  sin  cos / a sin :

Conclusion : dS a sin  d d . A spherical person will recognize this immediately. It is the volume element d V  sin  d d d , except d is missing. The small box has area dS and thickness d and volume d V . Here we only want dS :

area of sphere

» » dS

» »

a sin  d d 4a : (9)

Figure 15.16a shows a small surface with sides a d and a sin  d . Their product is dS . Figure 15.16b goes back to Method , where equation (8) gave dS .a=z/ dx dy .

## 15.4 Surface Integrals

I doubt that you will like Figure 15.16c—and you don’t need it. With parameters  and  , the shadow of the sphere is a rectangle. The equator is the line down the middle, where  =2 . The height is z a cos  . The area d d in the base is the shadow of dS a sin  d d up in the sphere. Maybe this figure shows what we don’t halve to know about parameters.

Fig. 15.16 Surface area on a sphere: (a) spherical coordinates (b) xyz coordinates (c)  space.

EXAMPLE 8 Rotate y around the axis. Find the surface area using parame-

a

ters. The first parameter is (from a to b ). The second parameter is the rotation angle  (from to ). The points on the surface in Figure 15.17 are , y cos  , z sin  . Equation (7) leads after much calculation to dS

# ? 4x dx d r . Main point : dS agrees with Section 8.3, where the area was 2y .dy=dx/ dx . The comes from the  integral and y

# is . Parameters give this formula automatically.

### VECTOR FIELDS AND THE INTEGRAL OF F n

Formulas for surface area are dominated by square roots. There is a square root in dS , as there was in r ds . Areas are like arc lengths, one dimension up. The good point about line integrals F  n ds is that the square root disappears. It is in the denominator of n , where ds cancels it: F rr

n ds

# M dy  N dx . The same good thing will now happen for surface integrals F n dS .

15I Through the surface z f .x; y/ , the vector field F .x; y; z/ M i N j P k has ! rr rr f f flux F n dS P

surface

# shadow

M

B N

B  B dx dy: (10)

B y

This formula tells what to integrate, given the surface and the vector field (

B B  B B |

f and F ). The xy limits come from the shadow. Formula (10) takes the normal vector from Method 1:

```
N f = i f = y j k and | N
```

```
a . B f = B x/ . B f = B y/ :
```

For the unit normal vector

?  ?

n , divide N by its length:

B B

n

# B N = | N | . The square root is in the denominator, and the same square root is in dS . See equation (3) : ! F N f f F  n dS dx dy M N P dx dy:

(11)

B y

That is formula (10) , with cancellation of square roots. The expression F n dS is often written as F  d S , again relying on boldface to make d S a vector. Then d S equals n dS , with direction n and magnitude dS .

Fig. 15.17 Surface of revolution: parameters x;  . Fig. 15.18 F  n dS gives flow through dS .

EXAMPLE 9 Find

|

n dS for the plane z 2y . Then find F  n dS for F k . This plane produced

# ? in Example (for area). For flux the

# ? disappears:

N i j k n dS dS 6 dx dy . i j / dx dy: N |   ? ?   k

For the flow field F k , the dot product k  n dS reduces to

1dx dy . The slope of the plane makes no difference! The flow through the base also flows through the plane . The areas are different, but flux is like rain. Whether it hits a tent or the ground ’ ’ below, it is the same rain (Figure 15.18). In this case

F n dS dx dy shadow area in the base.

EXAMPLE 10 Find the flux of F i y j z k through the cone z

# a y .       y Solution F n dS  a y y

a y dx dy y

a 0:

The zero comes as

a surprise, but it shouldn’t. The cone goes straight out from the origin, and so does F . The vector

a

n that is perpendicular to the cone is also perpendicular to F . There is no flow through the cone, because F  n . The flow travels out along rays. rr F n dS FOR A SURFACE WITH PARAMETERS

In Example the cone was z f .x; y/ y . We found dS by Method . Parameters were not needed (more exactly, they were and y ). For surfaces that fold and twist, the formulas with u and v look complicated but the actual calculations can be simpler. This was certainly the case for dS du dv on the cylinder. A small piece of surface has area dS | A  B | du dv . The vectors along the sides are A u i y u j z u k and B v i y v j z v k . They are tangent to the surface.

## 15.4 Surface Integrals

Now we put their cross product N A  B to another use, because F  n dS involves not only area but direction . We need the unit vector n to see how much flow goes through. The direction vector is n N = | N | . Equation (7) is dS | N | du dv , so the square root | N | cancels in n dS . This leaves a nice formula for the “normal component” of flow:

15J Through a surface with parameters u and v , the field F M i N j P k has

flux

» » F  n dS

» » F  N du dv

» » F  . A  B / du dv: (12)

EXAMPLE 11 Find the flux of F i y j z k through the cylinder y , ¤ z ¤ b .

Solution The surface of the cylinder is cos u , y sin u , z v . The tangent vectors from (5) are A .  sin u/ i . cos u/ j and B k . The normal vector in Figure 15.19 goes straight out through the cylinder:

N A  B cos u i sin u j (check A  N and B  N 0/:

To find F  N , switch F i y j z k to the parameters u and v . Then F  N :

F  N . cos u i sin u j v k /  . cos u i sin u j / cos u sin u:

For the flux, integrate F  N and apply the limits on u  and v z :

flux

» b

# » 1 du dv 2b surface area of the cylinder :

Note that the top and bottom were not included! We can find those fluxes too. The outward direction is n k at the top and n  k down through the bottom. Then F  n is z b at the top and  z at the bottom. The bottom flux is zero, the top flux is b times the area (or b ). The total flux is 2b b 3b . Hold that answer for the next section. Apology: I made u the angle and v the height. Then N goes outward not inward.

EXAMPLE 12 Find the flux of F k out the top half of the sphere y z a .

Solution Use spherical coordinates. Example had u  and v  . We found

N A  B a sin  cos  i a sin  sin  j a sin  cos  k :

The dot product with F k is F  N a sin  cos  . The integral goes from the pole to the equator,  to  =2 , and around from  to  :

flux

» » =2

=2

sin  a sin  cos  d d 2a a :

The next section will show that the flux remains at a through any surface (!) that is bounded by the equator. A special case is a flat surface—the disk of radius a at the

equator. Figure 15.18 shows ’ n k pointing directly up, so F  n k  k . The flux is 1 dS = area of disk = a . All fluid goes past the equator and out through the sphere .

Fig. 15.19 Flow through cylinder. Fig. 15.20 M obius strip (no way to choose R n ).

I have to mention one more problem. It might not occur to a reasonable person, but sometimes a surface has only one side . The famous example is the M obius strip R , for which you take a strip of paper, twist it once, and tape the ends together. Its special property appears when you run a pen along the “inside.” The pen in Figure 15.20 suddenly goes “outside.” After another round trip it goes back “inside.” Those words are in quotation marks, because on a M o R bius strip they have no meaning. Suppose the pen represents the normal vector. On a sphere n points outward. Alternatively n could point inward; we are free to choose. But the M o R bius strip makes the choice impossible. After moving the pen continuously, it comes back in the opposite direction.

This surface is not orientable . We cannot integrate F  n to compute the flux, because we cannot decide the direction of n . A surface is oriented when we can and do choose n . This uses the final property of cross products, that they have length and direction and also a right-hand rule . We can tell A B from B  A . Those give the two orientations of n . For an open surface (like a wastebasket) you can select either one. For a closed surface (like a sphere) it is conventional for n to be outward. By making that decision once and for all, the sign of the flux is established: outward flux is positive .

Method 1: Parameters x; y Method 2: Parameters u; v

Coordinates x; y; z.x; y/ x.u; v/; y.u; v/; z.u; v/ on surface FORMULAS FOR A i

## SURFACE

B z= B k N A  B A B x= B u i B y= B u j B z= B u k

B j B z= B y k n N = INTEGRALS

| N | B B x= B v i B y= B v j B z= B v k

dS | N | dx dy

b z z y

dx dy dS | N | du dv

n dS N dx dy . B z= B i  B z= B y j k /dx dy n dS N du dv

## 15.4 Surface Integrals

## 15.4 EXERCISES

### Read-through questions

’ A small piece of the surface z f .x; y/ is nearly a . When In 15  18 compute the surface integrals g.x; y; z/dS . we go across by dx , we go up by b . That movement is A dx , g xy over the triangle y z 1; x; y; z ¥ . where the vector A is i c . The other side of the piece is B dy , where B j d . The cross product A  B is N e . The g y over the top half of y z (use ; / .

area of the piece is dS | N | dx dy . For the surface z xy , the vecg xyz on y z above z y (use ; / . tors are ’ A f and B g and N h . The area integral g on the cylinder y between z and z . is dS i dx dy . In 19  22 calculate A, B, N, and dS . With parameters u and v , a typical point on a

cone is u cos v , y j , z k . A change in u moves that point u , y v u , z v 2u . by A du . cos v i l ) du . A change in v moves the point by uv , y u [v](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [,](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [z](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [u](https://ocw.mit.edu/pages/privacy-and-terms-of-use/)  [v](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [.](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) B dv m . The normal vector is N A  B n . The area is dS o du dv . In this example A  B p so the small .3 cos u/ cos v , y .3 cos u/ sin v , z sin u .

piece is a q and dS | A || B | du dv . u cos v , y u sin v , z v (not z u/ .

For flux we need n dS . The r vector n is N A  B divided by s . For a surface z f .x; y/ , the product n dS is the vector t (to memorize from table). The particular surface z xy has n dS u dx dy . For F i y j z k the flux through z xy is F  n dS v dx dy .

On a

# cone the points are 2u cos v , y 2u sin v , z u . The tangent vectors are A w and B . This cone has n dS A  B du dv y . For F i y j z k , the flux

### rr

# In Problems   respectively find the flux F

# n dS for F i y j z k . rr In Problems respectively compute

# ¤ F n dS for F y i j through the region u v .

element through the cone is F  n dS z . The reason for this answer is A . The reason we don’t compute flux through a M obius R strip is B .

rr In 1  14 find N and dS | N | dx dy and the surface area dS . Integrate over the

xy shadow which ends where the z ’s are equal ( y in Problem 1) . A unit circle is rotated around the

# | z axis to give a torus (see fig-

Paraboloid z y below the plane z . ure). The center of the circle stays a distance from the z axis. Show that Problem Paraboloid z y between z rr gives a typical point rr .x; y; z/ on the torus and find the surface area dS N | du dv .

The surface r cos  , y r sin  , z rr a  r is bounded by

¤ and ¤ z ¤ .

Plane z y inside the cylinder y .

Plane z 3x 4y above the square , y ¤ . the equator .r a/ . Find N and the flux k  n dS , and compare with Example . Spherical cap y z above z 1=

? .

Spherical band y z between z and 1=

# ? Make a “double M obius strip” from a strip of paper by twisting R . it twice and taping the ends. Does a normal vector (use a pen) have

Plane z 7y above a triangle of area A . the same direction after a round trip?

Cone z y between planes z a and z b . Make a “triple M obius R strip” with three twists. Is it orientable—does the normal vector come back in the same or The monkey saddle z  xy inside y . opposite direction?

z y above triangle with vertices .0; 0/ , .2; 2/ , .0; 2/ . If a very wavy surface stays close to a smooth surface, are their

Plane z  2x  2y inside ¥ , y ¥ , z ¥ . areas close? ’ Cylinder z a inside y a . Only set up dS . Give the equation of a plane with roof area dS times base area dx dy . Right circular cone of radius a and height h . Choose The points .x; f .x/ cos  , f .x/ sin / are on the surface of z f .x; y/ or parameters u and v . revolution: y f .x/ revolved around the axis, parameters u Gutter z below z and between y  . and v  . Find N and compare dS | N | dx d with Example and Section 8:3 .

## 15.5 The Divergence Theorem

This section returns to the fundamental law . flow out /  . flow in / . source / . In two dimensions, the flow was in and out through a closed curve . The plane region inside was R . In three dimensions, the flow enters and leaves through a closed surface S: The solid region inside is V: Green’s Theorem in its normal form (for the flux of a smooth vector field) now becomes the great three-dimensional balance equation— the Divergence Theorem

» »  N P F  n dS

» » »

:

15K The flux of F M i N j P k through the boundary surface S equals the integral of the divergence of F inside V: The Divergence Theorem is

div F d V

» » » B

B B M

B B B B y

B B dx dy dz: (1)

B z

In Green’s Theorem the divergence was M= N= y: The new term B P = B z accounts for upward flow. Notice that a constant upward component P adds nothing to the divergence (its derivative is zero). It also adds nothing to the flux (flow up through the top equals flow up through the bottom). When the whole field F is constant, the theorem becomes 0: There are other vector fields with div F 0: They are of the greatest importance. The Divergence Theorem for those fields is again 0; and there is conservation of fluid. When div F 0; flow in equals flow out . We begin with examples of these “ divergence-free ” fields.

EXAMPLE 1 The spin fields  y i j k and i  z j y k have zero divergence.

The first is an old friend, spinning around the z axis. The second is new, spinning around the axis. Three-dimensional flow has a great variety of spin fields. The separate terms B M= B , B N= B y , B P = B z are all zero, so div F 0: The flow goes around in circles, and whatever goes out through rr u S comes back in. (We might have put a circle on

s

as we did on

c

; to emphasize that S is closed.)

EXAMPLE 2 The position field R i y j z k has div R 3:

This is radial flow, straight out from the origin. Mass has to be added at every point rrr to keep the flow going. On the right side of the divergence theorem is 3 d V: Therefore the flux is three times the volume. Example 11 in Section 15.4 found the flux of R through a cylinder. The answer was 3b: Now we also get 3b from the Divergence Theorem, since the volume is b: This is one of many cases in which the triple integral is easier than the double integral.

EXAMPLE 3 An electrostatic field R =

# a or gravity field  R = almost has div F 0:

The vector R i y j z k has length y z : Then F has length = (inverse square law). Gravity from a point mass pulls inward (minus sign). The

B

electric field from a point charge repels

B

outward . The three steps almost show that div F :

Step 1. B = B x=; B = B y y=; B = B z z= —but do not add those three. F is not  or 1= (these are scalars). The vector field is R = : We need B M= B x; B N= B y; P = z:

# B B B 15.5 The Divergence Theorem

Step 2. M= = B x.x= / is equal to 1=  .3x B = B x/= 1=  3x = : For B N= B y and B P = B z; replace 3x by 3y and 3z : Now add those three.

Step 3. div F 3=  3.x y z /= 3=  3= 0:

The calculation div rrr F leaves a puzzle. One side of the Divergence Theorem seems rr to give 0 d V 0: Then the other side should be F  n dS 0: But the flux is not zero when all flow is outward:

The unit normal vector to the sphere  constant is n R =: The outward flow rrr

# F  rr n . R = /  . R =/  = is always positive. Then F n dS dS= = 4: We have reached 0:

This paradox in three dimensions is the same as for R =r in two dimensions. Section 15.3 reached 0; and the explanation was a point source at the origin. Same explanation here: M; N; P are infinite when  0: The divergence is a “delta function” times 4; from the point source. The Divergence Theorem does not apply (unless we allow delta functions). That single point makes all the difference. Every surface enclosing the origin has

flux 4: Our calculation was for a sphere. The surface integral is much harder when S is twisted (Figure 15.21a). But the Divergence Theorem takes care of everything, because div rr

# F in the volume V between these surfaces. Therefore rr

# F n dS for the two surfaces together. The rr flux F n dS into the sphere must be balanced by F  n dS out of the twisted surface.

Fig. 15.21 Point rrr

# B source:

# B flux through

all enclosing surfaces. Net flux upward . P = z/dV:

Instead of a paradox 0; this example leads to Gauss’s Law. A mass M at the origin produces a gravity field F GM R = : A charge q at the origin produces an electric field E .q=4" / R = : The physical constants are G and " ; the mathematical constant is the relation between divergence and flux. Equation (1) yields equation (2) , in which the mass densities M.x; y; z/ and charge densities q.x; y; z/ need not be concentrated at the origin:

15L Gauss’s law in differential form: div F  4GM and div E q=" : Gauss’s law in integral form: Flux is proportional to total mass or charge:

# » » F  n dS  » » » 4GMd V and

» » E  n dS

» » » q d V =" : (2)

## THE REASONING BEHIND THE DIVERGENCE THEOREM

The general principle is clear: Flow out minus flow in equals source. Our goal is to see why the divergence of F measures the source . In a small box around each point, we show that div F d V balances F  n dS through the six sides. So consider a small box. Its center is at .x; y; z/: Its edges have length x; y; z: Out of the top and bottom, the normal vectors are k and  k : The dot product with F M i N j P k is P or  P: The area S is xy: So the two fluxes are close to P .x; y; z z/xy and  P .x; y; z  z/xy: When the top is combined with the bottom, the difference of those P ’s is P :

net flux upward  Pxy .P =z/xyz  . B P = B z/V: (3)

Similarly, the combined flux on two side faces is approximately ( B N= B y/V: On the front and back it is ( B M= B x/V: Adding the six faces, we reach the key point:

flux out of the box  . B M= B B N= B y B P = B z/V: (4)

This is (div F ) V: For a constant field both sides are zero—the flow goes straight through. For F i y j z k ; a little more goes out than comes in. The divergence is 3; so 3V is created inside the box. By the balance equation the flux is also 3V: The approximation symbol  means that the leading term is correct (probably not the next term). The ratio P =z is not exactly B P = B z: The difference is of order z; so the error in (3) is of higher order Vz: Added over many boxes (about 1=V boxes), this error disappears as z Ñ 0: rrr The sum of (div F ) V over all the boxes approaches . div F /d V: On the other side of the equation is a sum of fluxes. There is

F  n S out of the top of one box, plus F  n S out of the bottom of the box above. The first has n k and the second has n  k : They cancel each other—the flow goes from box to box . This happens every time two boxes meet. The only fluxes that survive (because nothing cancels them) are at the outer surface rr S: The final step, as x; y; z Ñ 0; is that those outside terms approach F n dS: Then the local divergence theorem

B B

(4) becomes the global Divergence Theorem (1) .

Remark on the proof That “final step” is not easy, because the box surfaces don’t

B

line up with the outer surface S: A formal proof of the Divergence Theorem would imrrr itate the proof of Green’s Theorem. On a very simple region

# B rr rr . P = z/dx dy dz equals P dx dy over the top minus rr

# P dx dy over the bottom. After checking the orientation this is P k n dS: rr Similarly the volume integrals of rr

B M= B and N= y are the surface integrals M i n dS and N j  n dS: Adding the three integrals gives the Divergence Theorem. Since Green’s Theorem was already proved in this way, the reasoning behind (4) is more helpful than repeating a detailed proof. The discoverer of the Divergence Theorem was probably Gauss. His notebooks only contain the outline of a proof—but after all, this is Gauss. Green and Ostrogradsky both published proofs in 1828; one in England and the other in St. Petersburg (now Leningrad). As the theorem was studied, the requirements came to light (smoothness of F and S; avoidance of one-sided Möbius strips). New applications are discovered all the time— when a scientist writes down a balance equation in a small box . The source is known. The equation is div F source. After Example 5 we explain F :

EXAMPLE 4 If the temperature inside the sun is rr

# T ln 1=; find the heat flow F  grad T and the source div F and the flux F n dS: The sun is a ball of radius  :

» B

## 15.5 The Divergence Theorem

Solution F is

# B  grad ln 1=

B D C

# B grad

B ln

# B : Derivatives of ln  bring division by  :

F  . = » i »

```
= y j = z k /= .x i y j z k /= :
```

This flow is radially outward, of magnitude 1=: The normal vector n is also radially outward, of magnitude

# » 1: The dot product on the sun’s surface is 1= :

### F n dS

» dS= »

. surface area /= = : (5)

Check that answer by the Divergence Theorem. Example 5 will find div F 1= : Integrate over the sun. In spherical coordinates we integrate

# » d , sin d; and d :

rrr

div F d V  sin  d d d= . /.2/.2/ as in .5/:

sun

This example illustrates the basic framework of equilibrium . The pattern appears everywhere in applied mathematics—electromagnetism, heat flow, elasticity, even relativity. There is usually a constant c that depends on the material (the example has c ). The names change, but we always take the divergence of the gradient :

potential f Ñ force field  c grad f: Then div .  c grad f / electric charge

temperature T Ñ flow field  c grad T: Then div .  c grad T / heat source

displacement u Ñ stress field c grad u: Then div .  c grad u/ outside force :

You are studying calculus, not physics or thermodynamics or elasticity. But please notice the main point. The equation to solve is div .  c grad f / known source. The divergence and gradient are exactly what the applications need. Calculus teaches the right things. This framework is developed in many books, including my own text Introduction to Applied Mathematics (Wellesley-Cambridge Press). It governs equilibrium, in matrix equations and differential equations.

## PRODUCT RULE FOR VECTORS: INTEGRATION BY PARTS

May I go back to basic facts about the divergence? First the definition:

F .x; y; z/ M i N j P k has div F D r  F B M= B B N= B y B P = B z:

The divergence is a scalar (not a vector). At each point div F is a number. In fluid flow, it is the rate at which mass leaves—the “flux per unit volume” or “flux density.” The symbol r stands for a vector whose components are operations not numbers :

r D “ del ” i B = B j B = B y k B = B z: (6)

This vector is illegal but very useful. First, apply it to an ordinary function f .x; y; z/ :

r f “ del f ” i B f = B j B f = B y k B f = B z gradient of f: (7)

Second, take the dot product r  F with a vector function F .x; y; z/ M i N j P k :

r  F “ del dot F ” B M= B B N= B y B P = B z divergence of F : (8)

Third, take the cross product r  F : This produces the vector curl F (next section):

r  F “ del cross F ” : : : (to be defined) : : : curl of F : (9)

The gradient and divergence and curl are r and r  and r  : The three great operations of vector calculus use a single notation! You are free to write r or not—to make equations shorter or to help the memory. Notice that Laplace’s equation shrinks to       f r  r f

B B B 0:

B B B y

B f (10)

B f y B B z

B B z

Equation (10) gives the potential when the source is zero (very common). F grad f combines with div F into Laplace’s equation div grad f 0: This equation is so important that it shrinks further to r f and even to [f](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [0:](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [Of course](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) f f xx f yy f zz has nothing to do with f f .x x/  f .x/: Above all, remember that f is a scalar and F is a vector: gradient of scalar is vector and divergence of vector is scalar . Underlying this chapter is the idea of extending calculus to vectors. So far we have emphasized the Fundamental Theorem. The integral of df =dx is now the integral of div F : Instead of endpoints a and b; we have a curve or surface S: But it is the rules for derivatives and integrals that make calculus work, and we need them now for vectors. Remember the derivative of u times v and the integral (by parts) of u dv=dx :

15M Scalar functions u.x; y; z/ and vector fields V .x; y; z/ obey the product rule : div .u V / u div V V  . grad u/: (11)

The reverse of the product rule is integration by parts (

| »   | »   | »   |
| --- | --- | --- |
| »   | »   | B   |

u div V

B

dx dy dz  » » » Gauss’s Formula ):

V  .

B

grad u/ dx dy dz

» » » B »

u V  n dS:

B B

(12)

For a plane field this is Green’s Formula

# » » B (and u gives Green’s Theorem):     M N u u u dx dy N y

M dx dy u.M i N j /  n ds:

B y (13)

Those look like heavy formulas. They are too much to memorize, unless you use them often. The important point is to connect vector calculus with “scalar calculus,” which is not heavy. Every product rule yields two terms:

.uM / u B M= B M B u= B .uN / y u B N= B y N B u= B y .uP / z u B P = B z P B u= B z:

Add those ordinary rules and you have the vector rule

rr (11) for the divergence of u V : Integrating the two parts of div .u V / gives u V  n dS by the Divergence Theorem. Then one part moves to the other side, producing the minus signs in (12) and (13) . Integration by parts leaves a boundary term r r , in three and two dimensions as it did

b

in one dimension: uv dx u vdx Œuv a

:

EXAMPLE 5 Find the divergence of F R = ; starting from grad  R =:

## 15.5 The Divergence Theorem

Solution Take V R and u 1= in the product rule (11) . Then div F . div R /=  R . grad 1= ). The divergence of R i y j z k is 3: For grad 1= apply the chain rule:

R  . grad 1= /  R  . grad /=  R  R =  2= :

The two parts of div F combine into 3=  2= 1= —as claimed in Example 4.

EXAMPLE 6 Find the balance equation for flow with velocity V and fluid density :

V is the rate of movement of fluid, while  V is the rate of movement of mass . Comparing the ocean to the atmosphere shows the difference. Air has a greater velocity than water, but a much lower density. So normally F  V is larger for the ocean. (Don’t confuse the density  with the radial distance : [The Greeks only used](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) letters.) There is another difference between water and air. Water is virtually incompressible (meaning  constant). Air is certainly compressible (its density varies). The balance equation is a fundamental law—the conservation of mass or the “ continuity equation ” for fluids. This is a mathematical statement about a physical flow without sources or sinks:

### Continuity Equation

: div . V / B = B t 0: (14) rrr rrr Explanation: The mass in a region is  d V: Its rate of decrease is  B p= B t d V: The decrease comes from flow out through the surface (normal vector n ). The dot

rr product

# F n  V n is the rate of mass flow through the surface. So the integral

rrr F n dS is the total rate that mass goes out. By the Divergence Theorem this is div F d V: rrr To balance  Ñ B = B t d V in every region, div

Ñ

F must equal B = B t at every point. The figure shows this continuity equation (14) for flow in the direction.

mass in extra mass out mass loss mass dS dx  V dS dt d. V / dS dt  d dS dx

Fig. 15.22 Conservation of mass during time dt W d. V /=dx d=dt 0:

## 15.5 EXERCISES

### Read-through questions

rr In words, the basic balance law is a . The flux of F The field F R = has div F except m . F  n dS through a closed surface S is the double integral b . The equals n over any surface around the origin. This divergence of M i N j P k is c , and it measures d . illustrates Gauss’s Law rr The total source is the triple integral e . That equals the flux by the f Theorem.

For F 5z k the divergence is

# o . The field F i y j  2z k has div F p and F n dS q . For this F ; the flux out through a pyramid and in through its base are r .

g . If V is a cube of side a then the triple integral equals h . The top surface where The symbol r stands for s . In this notation div F is z a has n i and F rr

n j . The bottom and sides have t . The gradient of f is u . The divergence of grad f is F  n k . The integral F  n dS equals l . v . The equation div grad f is w ’s equation.

rr The divergence of a product is div rrr .u V / . Integration rrr Give an example where F  n dS is easier than by parts is u div V dx dy dz y z . In two div F dV: dimensions this becomes A . In one dimension it becomes Suppose F M.x; y/

i N.x; y/ j , R is a region in the xy plane, B . For steady fluid flow the and .x; y; z/ is in V if .x; y/ is in R and

# continuity equation is div  V . rr

# | z | ¥ 1: rrr (a) Describe V and reduce div F dV to a double In 1–10

compute the flux F n dS by the Divergence integral. Theorem . rr (b) Reduce F n dS to a line integral (check top, bottom,

F i j k ; S : unit sphere y z 1: side). (c) Whose theorem says that the double integral equals F y i j ; V : unit cube ¤ ¤ 1; 0 ¤ y ¤ 1; 0 ¤ z ¤ 1: the line integral? F i y j z k ; S : unit sphere Is it possible to have F  n at all points of S and also F i 8y j z k ; V : unit cube. div F at all points in V ? F is not allowed.

F i 2y j ; S : sides 0; y 0; z 0; x y z 1: [Inside a solid ball (radius a, density](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [1;](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [mass](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) M 4a =3 ) the gravity field is F  [GM](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [R](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [=a](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [:](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) F u r .x i y j z k /=; S : sphere  a: (a) Check div F  4G in Gauss’s Law. F .x i y j z k /; S : sphere  a (b) The force at the surface is the same as if the whole F i y j z k ; S : sphere  a: mass M were : (c) Find a gradient field with div F in the ball  F z k ; V : upper half of ball  ¤ a:

# ¤ a and div F outside. F grad .xe

y

sin z/; S : sphere  a: The outward field F R = has magnitude | F | 1= : rrr Find div .x rr i y

j k /dV in the cube ¤ x; y; z ¤ a: Through an area A on a sphere of radius ; the flux is : A Also compute n and F n dS for all six faces and add. spherical box has faces at  and  with A  sin dd and A  sin dd: Deduce that the flux out of the box is zero, which When a is small in problem

11; the answer is close to ca : confirms div F 0: Find the number In Gauss’s Law, what charge distribution q.x; y; z/ gives the unit

¤

c: At what point does div F c ?

(a) Integrate the divergence of

F  i in the ball  ¤ a: rr field E u r ? What is the flux through the unit sphere? (b) Compute F n dS over the spherical surface  a: rr If a fluid with velocity V is incompressible (constant den- Integrate

¤ ¤ ¤ R

n dS over the faces of the box ¤ ¤ , sity  ), then its continuity equation reduces to : If it y , z and check by the Divergence Theorem. is irrotational then F grad f: If it is both then f satisfies rr Evaluate F n dS when F i z j y k and: equation.

(a) S is the cone z y bounded above by the plane True or false , with a good reason. rr z 1: (a) If F  n dS for every closed surface, F is constant. (b) S is the pyramid with corners .0; 0; 0/ , .1; 0; 0/ , .0; 1; 0/ , (b) If

| F | ¤

grad f then div F

|

0: rrr .0; 0; 1/: (c) If | F | ¤ at all points then

# | div

¤ F dV ¤ area of the surface S: Compute all integrals in the Divergence Theorem when F x. i j  k / and V is the unit cube ¤ x; y; z ¤ 1: (d) If F at all points then

Following

B

Example 5; compute the divergence of

# div

# F at all points.

Write down statements E F G H for source-free fields

### .x i y

B

j z k /= : F .x; y; z/ in three dimensions. In statement F ; paths sharing the same endpoint become surfaces sharing the same boundary . grad f /  n is the derivative of f in the direction curve. In G ; the stream function becomes a vector field such rr : It is also written B f = B n: If f xx f yy f zz in V; dethat F curl g : rive f = n dS from the Divergence Theorem. Describe two different surfaces bounded by the circle Describe the closed surface S and outward normal n : y , z 0: The field F automatically has the same flux (a) V hollow ball ¤ y z ¤ 9: through both if : (b) V solid cylinder y ¤ 1; | z | ¤ 7: The boundary of a bounded region R has no boundary. (c) V pyramid ¥ 0; y ¥ 0; z ¥ 0; x 2y 3z ¤ 1: Draw a plane region and explain what that means. What does (d) V solid cone y ¤ z ¤ 1: it mean for a solid ball?

## 15.6 Stokes’ Theorem and the Curl of F

## 15.6 Stokes’ Theorem and the Curl of F

For the Divergence Theorem, the surface was closed. S was the boundary of V . Now the surface is not closed and S has its own boundary—a curve called . We are back near the original setting for Green’s Theorem (region bounded by curve, double integral equal to work integral). But Stokes’ Theorem, also called Stokes’s Theorem,

B

is in three-dimensional space. There is a curved surface S bounded by a space curve . This is our first integral around a space curve. The move to three dimensions brings a change in the vector field. The plane field F .x; y/ M i N j becomes a space field F .x; y; z/ M i N j P k . The work Mdx N= B  Ndy

B now includes M= B P dz . The critical quantity in the double integral (it was y ) must change too. We called this scalar quantity “curl F ,” but in reality it is only the third component of a vector. Stokes’ Theorem needs all three components of that vector—which is curl

B F .

## DEFINITION

The curl of a vector field

B N

B  B B B F .x; y; z/

B B M i

B B N

j

# B P k is the vector field   P M P N M curl F i

B B B B

j

B

k : (1) y z B y The symbol r F stands for a determinant that yields those six derivatives:

B i j k curl B

F D r  F

z

= = y = z (2)

B M N P

:

The three products i = y P and j B = B z M and k B = B x N have plus signs. The three products like k B = B y M , down to the left, have minus signs. There is a cyclic symmetry. This determinant helps the memory, even if it looks and is illegal. A determinant is not supposed to have a row of vectors, a row of operators, and a row of functions.

EXAMPLE 1 The plane field M.x; y/ i N.x; y/ j has P and B M= B z and B N= B z . Only two terms survive: curl F . B N= B  B M= B y/ k . Back to Green.

EXAMPLE 2 The cross product a  R is a spin field S . Its axis is the fixed vector a a i a j a k . The flow in Figure 15.23 turns around a , and its components are

S a  R

i j k     a a a  y z

.a z a y/ i .a a z/ j .a y :

a x/ k

(3) Our favorite spin field y i j has .a ; a ; a / .0; 0; 1/ and its axis is a k .

B

The divergence of a spin field is M N y P z . Note how the divergence uses

B B M B B

while the curl uses

B B

N and P . The curl of S is the vector a :

B P N M P N

B M i j 2a i 2a 2a k a : y z z

B B  B k j y This example begins to reveal the meaning of the curl. It measures the spin! The direction of curl F is the axis of rotation —in this case along a . The magnitude of

curl F is twice the speed of rotation . In this case | curl F | | a | and the angular velocity is | a | .

Fig. 15.23 Spin field

B

S a  R , position field R , velocity field (shear field) V z i , any field F .

EXAMPLE 3 (!!) Every gradient field F B f = B i B f = B [y](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [j](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) B [f =](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) B [z](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [k](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [has](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) curl F :       f curl F j

B y

B B f f f i : z

k

B B (4) z

B f

B y B B z

B f

B  B B B B z B B B B y

B B y

# B B Always f yz equals f zy . They cancel. Also f xz f zx and f yx f xy . So curl grad f .

EXAMPLE 4 (twin of Example 3) The divergence of curl

# B B B B B  B B B B F is also automatically zero:       P N M P N div curl F 0:

B B B B y

B M z y z z

B B  B B y (5) Again the mixed derivatives give P xy P yx and N xz N zx and M zy M yz . The terms cancel in pairs. In “curl grad” and “div curl”, everything is arranged to give zero.

15N The curl of the gradient of every f .x; y; z/ is curl grad f D r  r f . The divergence of the curl of every F .x; y; z/ is div curl F D r  r  F .

The spin field S has no divergence. The position field R has no curl. R is the gradient of f .x y z / . S is the curl of a suitable F . Then div S div curl F and curl R curl grad f are automatically zero. You correctly believe that curl F measures the “spin” of the field. You may expect that curl . F G / is curl F curl G . Also correct. Finally you may think that a field of parallel vectors has no spin. That is wrong. Example 5 has parallel vectors, but their different lengths produce spin.

EXAMPLE 5 The field V z i in the direction has curl V j in the y direction.

If you put a wheel in the xz plane, this field will turn it . The velocity z i at the top of the wheel is greater than z i at the bottom (Figure 15.23c). So the top goes faster and the wheel rotates. The axis of rotation is curl V j . The turning speed is , because this curl has magnitude . Another velocity field v  k produces the same spin: curl v j . The flow is in the z direction, it varies in the direction, and the spin is in the y direction. Also interesting is V v . The two “shear fields” add to a perfect spin field S z i  k , whose curl is j .

## 15.6 Stokes’ Theorem and the Curl of F

## THE MEANING OF CURL F

Example 5 put a paddlewheel into the flow. This is possible for any vector field F , and it gives insight into curl F . The turning of the wheel (if it turns) depends on its location .x; y; z/ . The turning also depends on the orientation of the wheel. We could put it into a spin field, and if the wheel axis n is perpendicular to the spin axis a , the wheel won’t turn! The general rule for turning speed is this: the angular velocity of the wheel is . curl F /  n . This is the “ directional spin ,” just as . grad f /  u was the “ directional derivative ”—and n is a unit vector like u . There is no spin anywhere in a gradient field. It is irrotational : curl grad f . The pure spin field a  R has curl F a . The angular velocity is a  n (note that cancels ). This turning is everywhere, not just at the origin . If you put a penny on a compact disk, it turns once when the disk rotates once. That spin is “ around itself ,” and it is the same whether the penny is at the center or not. The turning speed is greatest when the wheel axis n [lines up with the spin axis](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [a](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [.](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) Then a  n is the full length | a | . The gradient gives the direction of fastest growth, and the curl gives the direction of fastest turning:

maximum growth rate of f is | grad f | in the direction of grad f

maximum rotation rate of F is | curl F | in the direction of curl F .

## STOKES’ THEOREM

Finally we come to the big theorem. It will be like Green’s Theorem—a line integral equals a surface integral. The line integral is still the work

¶ rr F  d R around a curve. The surface integral in Green’s Theorem is .N  M y /dx dy . The surface is flat (in the xy plane). Its normal direction is k , and we now recognize N  M y as the k component of the curl. Green’s Theorem uses only this component because the normal direction is always k . For Stokes’ Theorem on a curved surface, we need all three components of curl F . Figure 15.24 shows a hat-shaped surface S and its boundary (a closed curve). Walking in the positive direction around , with your head pointing in the direction of n , the surface is on your left . You may be standing straight up ( n k in Green’s Theorem). You may even be upside down . n  k is allowed / . In that case you must go the other way around , to keep the two sides of equation (6) equal. The surface is still on the left. A Möbius strip is not allowed, because its normal direction cannot be established. The unit vector n determines the “counterclockwise direction” along .

### 15O . Stokes’ Theorem /

¾ F  d R

# » » . curl F /

¶ dS:  (6) c s  n

The right side adds up small spins in the surface. The left side is the total circulation (or work) around . That is not easy to visualize—this may be the hardest theorem in the book—but notice one simple conclusion. If curl F then F d R . This applies above all to gradient fields —as we know. A gradient field has no curl, by (4). A gradient field does no work, by (6). In three dimensions as in two dimensions, gradient fields are conservative fields . They will be the focus of this section, after we outline a proof (or two proofs) of Stokes’ Theorem.

The first proof shows why the theorem is true. The second proof shows that it really is true (and how to compute). You may prefer the first.

First proof Figure 15.24 has a triangle ABC attached to a triangle ACD . Later there can be more triangles. S will be piecewise flat , close to a curved surface. Two triangles are enough to make the point. In the plane of each triangle (they have different n ’s) Green’s Theorem is known: u rr u rr F d R F n curl n dS:

AB CA  curl ABC  dS

F d R F

BC AC CD DA

# ACD

’ Now add. The right sides give curl F n dS over the two triangles. On the left, the integral over CA cancels the integral over AC . The “crosscut” disappears. That leaves AB BC CD DA . This line integral goes around the outer boundary —which is the left side of Stokes’ Theorem.

Fig. 15.24 Surfaces S and boundary curves . Change in B Ñ curl E Ñ current in .

Second proof Now the surface can be curved. A new proof may seem excessive, but it brings formulas you could compute with. From z f .x; y/ we have

dz B f =

¶ B x dx

B f =

# ¶ B y dy and n dS .

```
B B f = B i  B f = B y j k /dx dy:
```

For n dS , see equation 15.4.11. With this dz , the line integral in Stokes’ Theorem is

F d R Mdx Ndy P . f = (7)

shadowof C

```
B x dx B f = B y dy/:
```

The dot product of curl

B B

rr F and n dS gives the surface integral

# B B curl

F n dS

S

:

### ww Œ.P

B y B

N z /. f = x/ .M z P /. f = y/ .N

B B M y /dx dy: (8)

shadowof S

To prove (7) (8) , change M in Green’s Theorem to M P f = . Also change N to N P f = y . Then (7) (8) is Green’s Theorem down on the shadow (Problem 47). This proves Stokes’ Theorem up on S . Notice how Green’s Theorem (flat surface) was the key to both proofs of Stokes’ Theorem (curved surface).

EXAMPLE 6 Stokes’ Theorem in electricity and magnetism yields Faraday’s Law.

Stokes’ Theorem is not heavily used for calculations—equation (8) shows why. But the spin or curl or vorticity of a flow is absolutely basic in fluid mechanics. The other important application, coming now, is to electric fields. Faraday’s Law is to Gauss’s Law as Stokes’ Theorem is to the Divergence Theorem.

## 15.6 Stokes’ Theorem and the Curl of F

Suppose the curve is an actual wire. We can produce current along ’

by varying the magnetic field B .t/ . The flux ' B  n dS , passing within and changing in time, creates an electric field E that does work:

Faraday’s Law (integral form) W work

¾ E  d R d'=dt:

That is physics. It may be true, it may be an approximation. Now comes mathematics (surely true), which turns this integral form into a differential equation. Information at points is more convenient than information around curves. Stokes converts the line integral of E into the surface integral of curl E : u r r r r E  d R curl E n and also B t/ n dS:

S

dS  B '= B t . =

S

B B  These are equal for any curve , however small. So the right sides are equal for any surface S . We squeeze to a point. The right hand sides give one of Maxwell’s equations: Faraday’s Law (differential form): curl E B B = B t:

## CONSERVATIVE FIELDS AND POTENTIAL FUNCTIONS

The chapter ends with our constant and important question: Which fields do no work around closed curves? Remember test

# B B for plane curves and plane vector fields:

if B M= B y N= then F is conservative and F grad f and

¾ F  d R 0:

Now allow a three-dimensional field like F 2xy i .x z/ j y k . Does it do work around a space curve? Or is it a gradient field ? That will require B f = B 2xy and B f = B y z and B f = B z y . We have three equations for one function f .x; y; z/ . Normally they can’t be solved. When test is passed (now it is the threedimensional test: curl F ) they can be solved. This example passes test , and f is y yz .

15P F .x; y; z/ M i N j P k is a conservative field if it has these properties: A. The work

# ¶ F  d R around every closed path in space is zero.

### B. The work

³ Q P

F  d R depends on P and Q , not on the path in space. C. F is a gradient field : M B f = B and N B f = B y and P B f = B z . D. The components satisfy M y N ; M z P , and N z P y (curl F is zero ). A field with one of these properties has them all. is the quick test.

A detailed proof of A ñ B ñ ñ ñ A is not needed. Only notice how ñ : curl grad F is always zero. The newest part is ñ A . If curl F then

¶ F  d R . But that is not news. It is Stokes’ Theorem. The interesting problem is to solve the three equations for f , when test is passed. The example above had

B B B f = B 2xy ñ f

# ³ 2xy dx y plus any function C.y; z/

f = B B y z B ñ C= B y ñ yz plus any function c.z/ f = z y y dc=dz c.z/ can be zero.

The first step leaves an arbitrary C.y; z/ to fix the second step. The second step leaves an arbitrary c.z/ to fix the third step (not needed here). Assembling the three steps, f y y yz

c

# y yz . Please recognize that the “fix-up” is only possible when curl F . Test must be passed.

EXAMPLE 7 Is F .z y/ i .x z/ j .y  x/ k the gradient of any f ?

Test says no . This F is a spin field a  R . Its curl is a .2; 2; 2/ , which is not zero. A search for f is bound to fail, but we can try. To match B f = B z  y , we must have f zx  yx C.y; z/ . The y derivative is  B C= B y: That never matches N  z , so f can’t exist.

## EXAMPLE 8

B

What choice of P makes F yz i xz j P k conservative? Find f .

Solution We need curl

P = B B F

M= B , by test . First check

```
z 2yz and B P = B B M=
```

y B B y [z](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) B [N=](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) B [. Also](https://ocw.mit.edu/pages/privacy-and-terms-of-use/)

N= B z 2xz:

P 2xyz passes all tests. To find f we can solve the three equations, or notice that f xyz is successful. Its gradient is F . A third method defines f .x; y; z/ as the work to reach .x; y; z/ from .0; 0; 0/ . The path doesn’t matter. For practice we integrate F  d R Mdx Ndy P dz along the straight line .xt; yt; zt/ :

### f .x; y; z/

# » .yt/.zt/ .x dt/ .xt/.zt/ .y dt/ 2.xt/.yt/.zt/.z dt/ xyz :

EXAMPLE 9 Why is div curl grad f automatically zero (in two ways)?

Solution First, curl grad f is zero (always). Second, div curl F is zero (always). Those are the key identities of vector calculus. We end with a review.

### Green’s Theorem W

¾ ¾ F  d R

```
» » . B N= B  B M= B y/dx dy
```

F  n ds

```
» » . B M= B B N= B y/dx dy
```

### Divergence Theorem W

» » F  n dS

```
» » » . B M= B B N= B y B P = B z/dx dy dz
```

### Stokes’ Theorem W

¾ F  d R

# » » curl F  n dS:

The first form of Green’s Theorem leads to Stokes’ Theorem. The second form becomes the Divergence Theorem. You may ask, why not go to three dimensions in the first place ? The last two theorems contain the first two (take P and a flat surface). We could have reduced this chapter to two theorems, not four. I admit that, but a fundamental principle is involved: “It is easier to generalize than to specialize.” For the same reason df =dx came before partial derivatives and the gradient.

## 15.6 Stokes’ Theorem and the Curl of F

## 15.6 EXERCISES

### Read-through questions

The curl of M i N j P k is the vector a . It equals the In 15, suppose

S is the top half of the earth ( n goes out) and T is by determinant b . The curl of i z k is c . the bottom half ( rr n comes in). What are rr and V ? Show by example For S y i  .x z/ j y k the curl is d . This S is a e that

S

### F n dS

T

F  n dS is not generally true. field a  R . curl F /  R , with axis vector a f . For any rr Explain why curl F  n dS over the closed boundary of any gradient field f i f y j f z k the curl is g . That is the solid V . important identity curl grad f h . It is based on f xy f yx

and i and j . The twin identity is k . Suppose curl F and div F . (a) Why is F the gradient of a potential? (b) Why does the potential satisfy Laplace’s equation The curl measures the i of a vector field. A paddlewheel in f xx f yy f zz ? the field with its axis along n has turning speed m . The spin is greatest when n is in the direction of n . Then the angular In 19–22, find a potential [f](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [if it exists](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) [.](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) velocity is o . F z i j k . F 2xyz i z j y k Stokes’ Theorem is p q . The curve is the r of the s S . This is t Theorem extended to u dimen- F e

z i  e  z

k F yz i xz j .xy z / k sions. Both sides are zero when F is a gradient field because v . Find a field with curl F .1; 0; 0/: The four properties of a conservative field are A w , B , y , z . The field y z i 2xy z k Find all fields with curl F .1; 0; 0/: (passes)(fails) test r . This field is the gradient of f A . The S a  R is a spin field. Compute F b  S (constant vector b ) work F  d R from ’ .0; 0; 0/

to .1; 1; 1/ is B (on which path?). and find its curl. For every field F , curl F n ds is the same out through a pyramid and up through its base because . How fast is a paddlewheel turned by the field F y i  k (a) if its axis direction is n j ? (b) if its axis is lined up with curl F ? In Problems 1–6 find curl F . (c) if its axis is perpendicular to curl F ?

F z i j y k F grad .xe

y

How is curl F related to the angular velocity ! in the spin field sin z/ F !.  y i j / ? How fast does a wheel spin, if it is in the plane y z ? F .x y z/. i j k / F .x y/ i  .x y/ k Find a vector field F whose curl is S y i  j . F

n

.x i y j z k / F . i j /  R Find a vector field F whose curl is S a  R .

Find a potential f for the field in Problem 3. True or false : when two vector fields have the same curl at all points: (a) their difference is a constant field (b) their difference is a Find a potential f for the field in Problem 5. gradient field (c) they have the same divergence.

When do the fields

m i and n

j have zero curl? rr In 31–34, compute curl F

When does .a a y a z/ k have zero curl?

# n dS over the top half of the sphere y z and (separately)

# ¶ F  d R around the equator .

### In 11–14, compute curl F and find

¶ c

F  d R by Stokes’ F y i  j F R = Theorem . F a  R F . a F i y k ; C circle z 1; y .

R

/  R

The circle in the plane y z has radius r and center F i  R ; C circle z 1; y . at .1; 2; 3/ . The field F is 3z j 2y k . Compute F . i j /  R ; C circle y z 1; x .

# ¶ F d R around .

rr S is the top half of the unit sphere and

# F z i j xyz k . Find F .y i  j /  .x i y j /; C circle y 1; z . curl F n dS .

(important) Suppose two surfaces S and T have the same bound- Find g.x; y/ so that curl g k y i j . What is the name for g

ary , and the direction around is the same. in Section 15.3? It exists because y i j has zero . rr rr (a) Prove

S

curl F  n dS

T

curl F  n dS . Construct F so that curl F 2x i 3y j  5z k (which has zero divergence). (b) rrr Second proof: The difference between those integrals is div . curl F /dV . By what Theorem? What region is V ? Why Split the field F xy i into V W with curl V and div is this integral zero? W .

Ampère’s law for a steady magnetic field B is curl B  J (a) The second proof of Stokes’ Theorem took M . J current density ;  constant / . Find the work done by B around

# M.x; y; f .x; y// P .x; y; f .x; y// B f = B as the M in Green’s a space curve from the current passing through it. Theorem. Compute

Maxwell allows varying currents which brings in the electric field.

B M

# = B y from the chain rule and product rule (there are five terms).

(b) Similarly N

N.x; y; f / P .x; y; f / B f = B y has the For F .x y / i , compute curl . curl F / and grad . div F / and derivative N N z f P f y P z f f y Pf yx . Check that F xx F yy F zz . N

M

y

matches the right side of equation (8), as needed in the proof. For F v.x; y; z/ i , prove these useful identities: “The shadow of the boundary is the boundary of the shadow.” (a) curl . curl F / grad . div F /  . F xx F yy F zz / . This fact was used in the second proof of Stokes’ Theorem, going (b) curl .f F / f curl F . grad f /  F . to Green’s Theorem on the shadow. Give two examples of S and and their shadows. If B a cos t (constant direction a ), find curl E from Faraday’s Law. Then find the alternating spin field E . Which integrals are equal when boundary of S or S boundary of V ? With G .x; y; z/ m i n j p k , write out F  G and take its divergence. Match the answer with G  curl F  F  curl G .

Write down Green’s Theorem in the xz plane from Stokes’ Theorem.

True or false : r  F is perpendicular to F .

¶ F  d R

¶

rr . curl F /   d R

# ¶ . curl F /  n ds F  n dS rr rr rr rrr div F dS . curl F / n dS . grad div F /  n dS div F dV

Draw the field V k spinning a wheel in the xz plane. What wheels would not spin?

[MIT OpenCourseWare](https://ocw.mit.edu/) http s ://ocw.mit.edu

#### Resource: Calculus

Gilbert Strang

The following may not correspond to a particular course on MIT OpenCourseWare, but has been provided by the author as an individual learning resource.

For information about citing these materials or our Terms of Use, visit: http s ://ocw.mit.edu/terms.

[MIT OpenCourseWare](https://ocw.mit.edu/) http s ://ocw.mit.edu

#### Resource: Calculus

Gilbert Strang

The following may not correspond to a particular course on MIT OpenCourseWare, but has been provided by the author as an individual learning resource.

For information about citing these materials or our Terms of Use, visit: http s ://ocw.mit.edu/terms.