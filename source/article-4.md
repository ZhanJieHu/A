---
title: Prompt Quality Often Matters More Than Model Choice in Daily Work
date: 2026.09.09
description: Practical advice for using LLMs.
---

*Practical advice for using LLMs*

## Model-Selection Anxiety

People sometimes become surprisingly anxious when they do not have access to the newest large language model.

When an LLM gives an unsatisfactory answer, a common reaction is:

> Maybe the free model is just not smart enough.
> Maybe the newest model would understand what I mean.

Sometimes that is true. Better models can reason more reliably, follow instructions better, handle longer contexts, and make fewer mistakes.

But in everyday work, I think people often **overestimate the importance of model selection and underestimate the importance of the information they provide to the model**.



## A Simplified View of How LLMs Work

A large language model learns statistical patterns from enormous amounts of data during training.

At inference time, it receives the text and other context available in the current conversation and predicts what should come next.

No matter how advanced models become, one basic limitation remains unchanged:

**the model must make its decision based on information available to it.**

Suppose you ask:

> Which option should I choose?

The model may know a great deal about the options themselves.

But perhaps the correct answer depends on:

* your budget,
* your deadline,
* your technical background,
* your location,
* your long-term goal,
* or a constraint you forgot to mention.

No amount of model intelligence can guarantee the correct recommendation if the decisive information is missing.



## A Little Philosophy: Information Does Not Appear from Nowhere

There is a simple principle behind many disappointing LLM interactions:

> **Missing information cannot be reliably recovered by intelligence alone.**

An LLM can infer missing details from patterns and probabilities.

Sometimes those inferences are impressive.

But inference is not the same as knowing.

If some critical fact was absent from both the model's relevant knowledge and the context you provided, the model has only a few options:

1. make an assumption;
2. infer the most likely situation;
3. produce a generic answer.

This is one reason stronger models sometimes appear to "understand" vague prompts better: they are often better at making reasonable assumptions.

But reasonable assumptions are still assumptions.

For important tasks, **providing the missing information is usually safer than hoping the model guesses correctly**.

## So What Should We Do?

The obvious answer is:

**write better prompts.**

There are already countless prompt-engineering tutorials, and ironically, you can ask an LLM itself to improve your prompt.

I only want to emphasize a few principles that I find especially useful.



## 1. Provide Precise Information, Not Maximum Information

A good prompt is not necessarily a long prompt.

The ideal situation is that you understand what information is necessary to solve the problem and provide exactly that information.

Then the model can combine:

> **your context + its existing knowledge + reasoning**

to produce the answer.

A common mistake is to paste a huge amount of loosely related material into the conversation.

Powerful models are increasingly good at identifying relevant information inside long contexts, but irrelevant details can still create noise.

They may:

* distract the model from the actual objective;
* introduce contradictory information;
* make important constraints harder to notice;
* encourage the model to solve the wrong problem.

The goal should therefore not be:

> Give the model as much information as possible.

It should be:

> **Give the model exactly the information it needs to derive the answer.**



## 2. Let the Model Ask You Questions

Sometimes the problem is that **you do not know what information is important**.

This happens frequently outside your own field.

There is a very simple solution: explicitly tell the model not to guess.

For example:

> If important information is missing, do not assume what I mean. Ask me the necessary questions before giving your recommendation.

Or more specifically:

> Before answering, identify any missing information that could materially change your recommendation. Ask me for that information first.

In other words, **you do not always need to know how to write the perfect prompt yourself**.

You can let the model help construct the prompt through conversation.

