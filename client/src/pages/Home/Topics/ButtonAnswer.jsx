import Button from "@mui/material/Button";
import React from "react";

export default function ButtonAnswer() {
  return (
    <div>
      <Button
        style={{
          marginLeft: 10,
          marginTop: 10,
          fontSize: 10,
          fontWeight: "bold",
        }}
        variant="outlined"
      >
        Trả lời
      </Button>
    </div>
  );
}
