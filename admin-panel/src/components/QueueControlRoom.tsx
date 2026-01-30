import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { callNext, fetchQueue, QueueResponse, setQueueStatus, skipCurrent } from "../services/api";
import { createQueueSocket } from "../services/socket";

export default function QueueControlRoom() {
  const [publicId, setPublicId] = useState("");
  const [queue, setQueue] = useState<QueueResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const queueId = useMemo(() => queue?.queue.id ?? null, [queue]);

  const loadQueue = async () => {
    if (!publicId.trim()) return;
    try {
      setLoading(true);
      const response = await fetchQueue(publicId.trim());
      setQueue(response);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!queueId) return;
    const socket = createQueueSocket(queueId);
    socket.on(
      "queue:update",
      (payload: { waitingCount?: number; nowServing?: string | null; status?: "OPEN" | "CLOSED" }) => {
        setQueue((current) => {
          if (!current) return current;
          return {
            ...current,
            nowServing: payload.nowServing ?? current.nowServing,
            waitingCount: payload.waitingCount ?? current.waitingCount,
            queue: {
              ...current.queue,
              status: payload.status ?? current.queue.status,
            },
          };
        });
      }
    );
    return () => {
      socket.disconnect();
    };
  }, [queueId]);

  const handleNext = async () => {
    if (!queueId) return;
    await callNext(queueId);
  };

  const handleSkip = async () => {
    if (!queueId) return;
    await skipCurrent(queueId);
  };

  const handleToggleStatus = async () => {
    if (!queueId || !queue) return;
    const nextStatus = queue.queue.status === "OPEN" ? "close" : "open";
    const response = await setQueueStatus(queueId, nextStatus);
    setQueue((current) =>
      current
        ? {
            ...current,
            queue: {
              ...current.queue,
              status: response.status,
            },
          }
        : current
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardHeader title="Queue Control Room" subheader="Manage live queue operations" />
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Queue Public ID"
              placeholder="Enter queue public ID"
              value={publicId}
              onChange={(event) => setPublicId(event.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={loadQueue}
              disabled={loading}
              sx={{ minWidth: 140 }}
            >
              {loading ? <CircularProgress size={22} /> : "Load Queue"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {queue ? (
        <>
          <Card sx={{ mb: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {queue.queue.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {queue.queue.location.name}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.100", borderRadius: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      Now Serving
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                      {queue.nowServing || "—"}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.100", borderRadius: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      Waiting
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                      {queue.waitingCount}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      people
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.100", borderRadius: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      Status
                    </Typography>
                    <Chip
                      label={queue.queue.status}
                      color={queue.queue.status === "OPEN" ? "success" : "default"}
                      sx={{ mt: 1, fontWeight: 600 }}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleNext}
                  fullWidth
                >
                  Call Next Token
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<SkipNextIcon />}
                  onClick={handleSkip}
                  fullWidth
                >
                  Skip Current Token
                </Button>
                <Button
                  variant="contained"
                  color={queue.queue.status === "OPEN" ? "error" : "success"}
                  startIcon={<PowerSettingsNewIcon />}
                  onClick={handleToggleStatus}
                  fullWidth
                >
                  {queue.queue.status === "OPEN" ? "Close Queue" : "Open Queue"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </>
      ) : null}
    </Container>
  );
}
