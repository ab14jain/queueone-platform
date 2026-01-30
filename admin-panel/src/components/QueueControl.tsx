import { useState } from "react";
import { Box, Button, Container, Stack } from "@mui/material";
import DoctorEnrollment from "./DoctorEnrollment";
import QueueControlRoom from "./QueueControlRoom";

type View = "enroll" | "control";

export default function AdminHome() {
  const [view, setView] = useState<View>("enroll");

  return (
    <Box>
      {view === "enroll" && (
        <>
          <DoctorEnrollment />
          <Container maxWidth="md" sx={{ pb: 4 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button variant="outlined" onClick={() => setView("control")}>
                → Queue Control Room
              </Button>
            </Stack>
          </Container>
        </>
      )}

      {view === "control" && (
        <>
          <QueueControlRoom />
          <Container maxWidth="md" sx={{ pb: 4 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button variant="outlined" onClick={() => setView("enroll")}>
                ← Back to Enrollment
              </Button>
            </Stack>
          </Container>
        </>
      )}
    </Box>
  );
}
