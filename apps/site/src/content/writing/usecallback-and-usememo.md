---
title: 'useCallback and useMemo: understanding performance hooks'
description: 'Memoization for React: when useMemo caches values, when useCallback stabilises functions, and when neither is worth it.'
pubDate: '2023-06-25'
tags: ['react']
source: 'https://dev.to/nevnet99/usecallback-and-usememo-understanding-performance-hooks-3eoh'
archived: true
---

## Memoization

Before we dive into the hooks, it will be beneficial to understand what memoization is. In computing, memoization or memoisation is an optimization technique used primarily to speed up computer programs. It involves storing the results of expensive function calls and returning the cached result when the same inputs occur again.

To put it simply, when we refer to a function as "expensive," it means that the function takes a long time to complete. This could be due to various reasons such as complex computations or waiting for a response from an API.

If you'd like to explore memoization further, I recommend reading [this](https://betterprogramming.pub/javascript-memoization-and-expensive-code-1a0aaa37a241) blog post for more information.

## useMemo

Now that we understand memoization, you might have an idea of what useMemo can be used for. useMemo, short for memoization, is used for storing the results of expensive function calls and returning the cached result when the same inputs occur again (sound familiar? 👀).

Let's break it down with an example. Consider the following expensive function:

```jsx
const getPhrase = (phraseType) => {
  let i = 0;
  // Added to simulate an expensive function
  while (i < 1000000000) i++;

  if (phraseType === "greeting") {
    return "hello";
  } else {
    return "goodbye";
  }
};
```

In this example, I've added a while loop to simulate an expensive function. It could be replaced with any other computationally intensive task, such as making a call to an API that returns a large amount of data.

Now, let's apply this to a React component.

You can find the code [here](https://stackblitz.com/edit/react-yzrica?file=src/Phrase.js). 

When you choose "Preview" in the top-right corner, you can see the component in action.

Try clicking the "Increment" button rapidly. Notice that it's slow to update the counter value. This slowness is caused by the expensive function being called on every re-render of the component. We can address this performance issue using useMemo.

Check out the updated code [here](https://stackblitz.com/edit/react-wvrwwffile=src/Phrase.js). 

Now, if you use the "Increment" button, it responds instantly. 

Let's analyze what we have learned from memoization and apply it to the useMemo hook.

The key change between the slow and fast examples:

```jsx
const greeting = useMemo(() => getPhrase(type), [type]);
```

As we know from memoization, it's an optimization technique that stores the results of expensive function calls and returns the cached result when the same inputs occur again.

useMemo accepts two arguments. The first argument is a function that you want to apply memoization to, and the second argument is a dependency array. The function itself is self-explanatory: in our case, we want to apply useMemo to `getPhrase` since it's an expensive function. 

The dependency array might sound more complex than it actually is. If the values provided in the dependency array change, our expensive function will be executed again. However, if they don't change, React will use the cached result instead of re-running the function to obtain a new result (which explains the performance increase in the above example).

Consider the following example where we have added the `counter` to the dependency array. Now, as expected, our component becomes slow again because the `counter` variable changes, causing the component to re-render.

Check out the example [here](https://stackblitz.com/edit/react-9wumfvfile=src/Phrase.js).

That's all for `useMemo`. By now, you should have a strong understanding of memoization and knowledge of how and where to use the `useMemo` hook to achieve performance gains.

## useCallback

Now that you understand `useMemo`, let's move on to `useCallback`. `useCallback` is similar to `useMemo`, as it also accepts two arguments: a function and a dependency array.

```jsx
useCallback(() => someFunction(), [someDependency]);
```

However, instead of caching the return value of the function, `useCallback` caches the function instance itself, preserving the same instance until one of the dependencies changes.

Let's break it down with an example. Below is a React component with two click handlers and a counter that tracks the number of new functions created in the component.

Check out the code [here](https://stackblitz.com/edit/react-hps3gr?file=src%2FSomeComponent.js).

Each click of the "Increment" button creates two new functions per render. This example demonstrates the behavior without `useCallback`. Keep in mind that this is just to showcase what `useCallback` does; it may not necessarily be the best approach in this specific case.

Now, check out the updated code [here](https://stackblitz.com/edit/react-56vhrg?file=src%2FSomeComponent.js) 

after applying `useCallback`. Click the buttons, and you'll notice that no extra functions are created per render.

In my opinion, the primary use case for `useCallback` is when you're using a function as a dependency for another hook. Although there are other use cases, I find them to be rare. Take the following code as an example:

```jsx
function MyApp() {
  const memoizedFoo = useCallback(function foo() {
    // do something with state or props data
  }, [/* related state/props */]);

  useEffect(() => {
    // do something with memoizedFoo
    // maybe fetch data from an API and pass it to memoizedFoo
    memoizedFoo();
  }, [memoizedFoo]);

  return <>...</>;
}
```

You can find an example [here](https://stackoverflow.com/questions/66429202/what-are-production-use-cases-for-the-useref-usememo-usecallback-hooks) (thanks 🥰).

Without `useCallback`, this `useEffect` would execute on every re-render and ignore the dependency of `memoizedFoo`. As shown in the previous examples, functions are recreated on each re-render, which is NOT desirable. However, `useCallback` prevents this by using the memorized instance of the `memoizedFoo` function.

It's worth mentioning that it's not always the best approach to use `useCallback` for all your functions, although it might be tempting to do so. Kent C Dodds wrote an excellent blog post about when to use and when not to use `useMemo` and `useCallback`. You can check it out [here](https://kentcdodds.com/blog/usememo-and-usecallback).
