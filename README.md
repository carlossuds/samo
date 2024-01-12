# Water Bucket Challenge

In this React app, there are 3 inputs where the user can add the capacity of each jug. By clicking on the Submit button, it calculates the most efficient way of interacting with jugs X and Y in order to get the value of Z.

## Table of Contents

- [Installation](#installation)
- [Code Structure](#code-structure)
- [Functionality Overview](#functionality-overview)

## Installation

1. Run `yarn` or `npm install` to install all dependencies.
2. Run `yarn dev` or `npm run dev` to run the project.
3. Run `yarn test` or `npm run test` to run the test script.

## Code Structure

The code is fairly simple, it consists of:

1. A `Home` page that calls a hook and renders elements. This way we separate the rendering logic from the business logic.
2. A `useHome` hook that does all the logic and returns only the data that will be displayed on the `Home` page.
3. There is also an `enums` folder containing the **Actions** and **Pages** `enums`

## Functionality Overview

### 1. Buckets and Actions:

- **BucketType**: Defines the type of bucket, which can be "X" or "Y" ("Z" technically is a value, not a bucket).
- **ActionType**: Represents an action to be performed on a bucket. It includes the action type (`Actions` enum) and the target bucket (`BucketType`).
- **Actions Enum**: Enumerates the possible actions: `FILL`, `EMPTY`, and `TRANSFER`.

### 2. Explanation Text:

The `getExplanationText` function generates a human-readable explanation for each action:

- `FILL`: "Fill bucket X" or "Fill bucket Y"
- `EMPTY`: "Empty bucket X" or "Empty bucket Y"
- `TRANSFER`: "Transfer from bucket X to bucket Y" or "Transfer from bucket Y to bucket X"

### 3. State Management:

The hook manages three pieces of state:

- **bucketsVolume**: Represents the volumes of buckets X, Y, and Z.
- **hasError**: Indicates whether an error condition is met.
- **steps**: Tracks the sequence of actions performed.

### 4. Callbacks:

- **onFieldChange**: Updates the volume of a specific bucket in the state when the user changes the input field.
- **onSubmit**: Performs a series of steps to achieve a desired state, updating the `steps` state accordingly. It checks for errors, handles special cases, and generates a sequence of actions.

### 5. Algorithm Explanation:

1. Check if Z is greater than both X and Y. If true, set an error.
2. Compare the volume of the buckets X or Y and describe them as `smallBucket` and `bigBucket`.
3. Calculate the difference between Z and the volumes of `smallBucket` and `bigBucket` so we can identify the bucket (`closestToZ`).
4. Handle special cases:

   - when Z is equal to the volume of `closestToZ` bucket or
   - Z is equal to the difference between the volumes of `bigBucket` and `smallBucket`.

5. For generic cases:
   - If `closestToZ` is `bigBucket`, transfer from `smallBucket` to `bigBucket` until Z is reached.
   - If `closestToZ` is `smallBucket`, transfer from `bigBucket` to `smallBucket` until Z is reached.

### 6. Memoization:

The `useMemo` hook is used to calculate and memoize the `stepsTableData`, a representation of the state of the buckets at each step. It is based on the sequence of actions performed.

### 7. Explanation Object:

The `stepsTableData` is an array of objects (`Step`) with properties for each bucket's volume and an explanation of the action.

### 8. Rendering:

The hook returns an object with properties for handling errors (`hasError`), rendering the steps table (`stepsTableData`), and callbacks for user interactions (`onFieldChange` and `onSubmit`).
