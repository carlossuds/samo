import { Step } from "../../../hooks";
import { Box } from "@mui/material";

export const StepsTable = ({ data }: { data: Array<Step> }) => {
  if (!data.length) return null;
  return (
    <Box width={600} alignSelf="center" gap={2}>
      <Box
        display="flex"
        gap={2}
        justifyContent="space-between"
        borderBottom="1px solid black"
      >
        <Box flex={1}>Bucket X</Box>
        <Box flex={1}>Bucket Y</Box>
        <Box flex={1}>Explanation</Box>
      </Box>
      {data.map(({ X, Y, explanation }) => (
        <Box
          key={`${explanation}${X}${Y}`}
          display="flex"
          gap={2}
          justifyContent="space-between"
          borderBottom="1px solid black"
        >
          <Box flex={1}>{X}</Box>
          <Box flex={1}>{Y}</Box>
          <Box flex={1}>{explanation}</Box>
        </Box>
      ))}
    </Box>
  );
};
