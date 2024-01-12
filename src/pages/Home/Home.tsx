import { Button, TextField } from "@mui/material";
import { StyledHeader, StyledMain } from "./Home.styles";
import { useHome } from "../../hooks";
import { StepsTable } from "./components";

const BUCKETS = ["X", "Y", "Z"] as const;

export const Home = () => {
  const { hasError, stepsTableData, onFieldChange, onSubmit } = useHome();
  return (
    <div>
      <StyledHeader>Water Bucket Challenge</StyledHeader>

      <StyledMain>
        {BUCKETS.map((bucket) => (
          <TextField
            key={bucket}
            label={bucket}
            variant="standard"
            type="number"
            onChange={(event) =>
              onFieldChange({ bucket, volume: Number(event.target.value) })
            }
          />
        ))}

        <Button onClick={onSubmit}>Submit</Button>

        {hasError ? "No Solution" : <StepsTable data={stepsTableData} />}
      </StyledMain>
    </div>
  );
};
