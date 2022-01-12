import React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RateReviewIcon from "@mui/icons-material/RateReview";

function ButtonHandle({ handleCreateTopicComment }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Button onClick={handleCreateTopicComment} variant="outlined">
        <AddIcon />
      </Button>
    </div>
  );
}

export default ButtonHandle;
