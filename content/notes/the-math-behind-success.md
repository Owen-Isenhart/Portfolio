---
title: The Math Behind Success (kinda)
author: Owen Isenhart
date: 2026-06-10
tags: [math, science]
readTime: 8 min read
---

I'll get to writing out all the research and justification behind my models later, I just know it's gonna take a longggg time. So for now, I'll just put the equations here and leave the derivations and trying to figure out what all the variables mean as an exercise for the reader. If you don't care about any of this, you can just scroll down and try out the calculator.

### Expected Lifetime Earnings Model
An individual's expected annual earnings are modeled using a log-linear human capital specification:

![Expected Lifetime Earnings Equation](images/notes/earnings-equation.avif)

Where the non-linear stature-income function is formulated as:

![Stature-Income Function](images/notes/stature-function.avif)

### Multi-Factor Mortality Hazard Rate Model
The life-course hazard rate of all-cause mortality via a Cox proportional hazards framework is modeled as:

![Mortality Hazard Rate Equation](images/notes/mortality-equation.avif)

### Marital Dissolution Probability Model
The probability of divorce within a 30-year window is modeled using a logistic regression formulation:

![Marital Dissolution Equation](images/notes/marriage-equation.avif)

### Wage Negotiation Mechanics Model
Wage negotiation dynamics under varying channels of visual and oral interaction are modeled as:

![Wage Negotiation Equation](images/notes/negotiation-equation.avif)

Where the baseline productivity estimate, observed confidence signal, and perceived social skills are determined by:

![Negotiation Sub-components Equation](images/notes/negotiation-components.avif)

If you're not sure where to get the information needed for these, here are some good resources:
- [IQ](https://www.mensa.org/mensa-iq-challenge/)
- [OCEAN Personality Test](https://www.truity.com/test/big-five-personality-test)

For other things, either use your best judgement, use the proxy questions if they're available, if not, just use the auto-impute and it will guess that value based on your other values. Nothing here is an exact science lol, just have some fun.

#file:success_predictor_interactive_dashboard

Obvious disclaimer: This was just a fun topic I wanted to research and build something about, do not take anything too seriously.

If you're interested, I'm going to go through my input and the results it gave.

First, I selected male and high occupational complexity, as I feel that's where software engineering would fall into. 

![iq image](images/notes/iq.avif)
![ocean image](images/notes/ocean.avif)
My IQ was measured to be 133, and I can estimate this to probably be roughly accurate as it lines up with my SAT conversion (1540), and I was in gifted and talented as a kid. My OCEAN score also seems to be relatively accurate from my lived experience.

For height, I'm 6'3" so I put 75 inches, and for beauty I think I'm a bit better than average and due to skewed data the median for self reported beauty is around 7, so I put 8.

For childhood socioeconomic status I used proxy mapping since it's hard to know just straight up what percentile you are, and my parents both had bachelor degrees and we owned a suburban home, so that put me in the 84th percentile. 

For additional parameters, when I was living with my parents our household income was roughly $130k a year, I did not include my partner, and I left 15% up to luck. 

Now, for the results!

![results](images/notes/results.avif)

Well, it's not horrible I suppose. I think it would benefit from having an option to select your industry and base the changes from the median income of your specific occupation, but I don't think that would really work with the math. Anyways, that was fun! Hope you enjoy playing around with it!