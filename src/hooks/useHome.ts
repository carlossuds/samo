import { cloneDeep } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { Actions } from "../enums";

type BucketType = "X" | "Y";
type ActionType = {
  action: Actions;
  targetBucket: BucketType;
};
export type Step = Record<BucketType, number> & { explanation: string };

const getExplanationText = ({ action, targetBucket }: ActionType) => {
  switch (action) {
    case Actions.FILL:
      return `Fill bucket ${targetBucket}`;
    case Actions.EMPTY:
      return `Empty bucket ${targetBucket}`;
    case Actions.TRANSFER: {
      const originBucket = targetBucket === "X" ? "Y" : "X";
      return `Transfer from bucket ${originBucket} to bucket ${targetBucket}`;
    }
    default: {
      const exhaustiveCheck: never = action;
      throw new Error(`Unhandled action ${exhaustiveCheck}`);
    }
  }
};

export const useHome = () => {
  const [bucketsVolume, setBucketsVolume] = useState({
    X: 0,
    Y: 0,
    Z: 0,
  });
  const [hasError, setHasError] = useState(false);
  const [steps, setSteps] = useState<Array<ActionType>>([]);

  const onFieldChange = useCallback(
    ({ bucket, volume }: { bucket: BucketType | "Z"; volume: number }) => {
      const clonedState = cloneDeep(bucketsVolume);
      clonedState[bucket] = volume;
      setBucketsVolume(clonedState);
    },
    [bucketsVolume]
  );

  const onSubmit = useCallback(() => {
    const { X, Y, Z } = bucketsVolume;
    const isZGreaterThanBoth = Z > X && Z > Y;

    if (isZGreaterThanBoth) {
      setHasError(true);
      return;
    }

    // Find from which bucket Z's value is closer to
    const smallBucket = X >= Y ? "Y" : "X";
    const bigBucket = X < Y ? "Y" : "X";

    const smallVolume = bucketsVolume[smallBucket];
    const bigVolume = bucketsVolume[bigBucket];

    const differenceToSmall = Z - smallVolume;
    const differenceToBig = bigVolume - Z;

    const closestToZ =
      differenceToBig > differenceToSmall ? smallBucket : bigBucket;

    // Handles special case when Z is smaller than both.
    // e.g: X: 70, Y: 90, Z: 20
    if (Z === bigVolume - smallVolume) {
      setSteps([
        {
          action: Actions.FILL,
          targetBucket: bigBucket,
        },
        {
          action: Actions.TRANSFER,
          targetBucket: smallBucket,
        },
      ]);
      return;
    }

    // First step, fills the bucket from where we'll have less iterations
    const currentSteps: Array<ActionType> = [
      {
        action: Actions.FILL,
        targetBucket: closestToZ,
      },
    ];

    // Handles special case when Z is equal to any of the buckets
    if (Z === bucketsVolume[closestToZ]) {
      setSteps(currentSteps);
      return;
    }

    let count = 0;
    // Handling generic cases. e.g: X < Z < Y
    // -> Remove X from Y until we get Z
    if (closestToZ === bigBucket) {
      let difference = bigVolume - count * smallVolume;
      while (Z < difference) {
        currentSteps.push({
          action: Actions.TRANSFER,
          targetBucket: smallBucket,
        });

        count++;
        difference = bigVolume - count * smallVolume;

        if (Z !== difference) {
          currentSteps.push({
            action: Actions.EMPTY,
            targetBucket: smallBucket,
          });
        }
      }
      if (Z > difference) {
        setHasError(true);
        return;
      }
    }
    // -> Add X to Y until we get Z
    if (closestToZ === smallBucket) {
      let sum = count * smallVolume;
      while (Z > sum) {
        currentSteps.push({
          action: Actions.TRANSFER,
          targetBucket: bigBucket,
        });

        count++;
        sum = count * smallVolume;

        if (Z !== sum) {
          currentSteps.push({
            action: Actions.FILL,
            targetBucket: smallBucket,
          });
        }
      }
      if (Z > Y) {
        setHasError(true);
        return;
      }
    }
    setSteps(currentSteps);
    setHasError(false);
  }, [bucketsVolume]);

  const stepsTableData = useMemo(
    () =>
      steps.reduce((acc, { action, targetBucket }, index) => {
        const auxBucket = targetBucket === "X" ? "Y" : "X";
        const myObject: Step = {
          explanation: getExplanationText({
            action,
            targetBucket,
          }),
          X: 0,
          Y: 0,
        };

        switch (action) {
          case Actions.EMPTY: {
            myObject[targetBucket] = 0;
            myObject[auxBucket] = acc[index - 1]?.[auxBucket] ?? 0;
            break;
          }
          case Actions.FILL: {
            myObject[targetBucket] = bucketsVolume[targetBucket];
            myObject[auxBucket] = acc[index - 1]?.[auxBucket] ?? 0;
            break;
          }
          case Actions.TRANSFER: {
            const targetCapacity = bucketsVolume[targetBucket];
            const auxCapacity = bucketsVolume[auxBucket];

            // Filling the bigger bucket
            if (targetCapacity > auxCapacity) {
              myObject[auxBucket] = 0;
              myObject[targetBucket] =
                acc[index - 1][targetBucket] + auxCapacity;
              break;
            }

            // Removing from the bigger bucket
            myObject[auxBucket] = acc[index - 1][auxBucket] - targetCapacity;
            myObject[targetBucket] = targetCapacity;
            break;
          }
          default: {
            const exhaustiveCheck: never = action;
            throw new Error(`Unhandled action ${exhaustiveCheck}`);
          }
        }
        acc.push(myObject);
        return acc;
      }, [] as Array<Step>),
    [steps, bucketsVolume]
  );

  return {
    bucketsVolume,
    hasError,
    steps,
    stepsTableData,
    onFieldChange,
    onSubmit,
  };
};
