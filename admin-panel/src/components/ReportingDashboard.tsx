import { useEffect, useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from "@mui/material";
import {
  reportingApi,
  TimeRangeStats,
  DoctorStats,
  DoctorSummary,
} from "../services/reporting";

type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

interface ReportingDashboardProps {
  doctorId?: string;
}

export default function ReportingDashboard({ doctorId }: ReportingDashboardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  const [stats, setStats] = useState<TimeRangeStats[]>([]);
  const [summary, setSummary] = useState<DoctorSummary | null>(null);
  const [allDoctorsStats, setAllDoctorsStats] = useState<DoctorStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    loadData();
  }, [doctorId, timeRange, startDate, endDate]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const dateRange = {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      };

      if (doctorId) {
        const [statsData, summaryData] = await Promise.all([
          loadStatsByTimeRange(doctorId, timeRange, dateRange),
          reportingApi.getDoctorSummary(doctorId, dateRange),
        ]);

        setStats(statsData);
        setSummary(summaryData);
      } else {
        const doctorsData = await reportingApi.getAllDoctorsStats(dateRange);
        setAllDoctorsStats(doctorsData);
      }
    } catch (err) {
      setError("Failed to load reporting data");
    } finally {
      setLoading(false);
    }
  };

  const loadStatsByTimeRange = async (
    docId: string,
    range: TimeRange,
    dateRange: { startDate?: Date; endDate?: Date }
  ): Promise<TimeRangeStats[]> => {
    switch (range) {
      case "daily":
        return reportingApi.getDailyStats(docId, dateRange);
      case "weekly":
        return reportingApi.getWeeklyStats(docId, dateRange);
      case "monthly":
        return reportingApi.getMonthlyStats(docId, dateRange);
      case "yearly":
        return reportingApi.getYearlyStats(docId, dateRange);
      default:
        return [];
    }
  };

  const formatPeriod = (period: string, range: TimeRange): string => {
    switch (range) {
      case "daily":
        return new Date(period).toLocaleDateString();
      case "weekly":
      case "monthly":
      case "yearly":
      default:
        return period;
    }
  };

  const resetDateRange = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {doctorId ? "Doctor Reporting Dashboard" : "All Doctors Statistics"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {doctorId
            ? "View token statistics and performance metrics"
            : "Overview of all doctors performance"}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardHeader title="Filters" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: "flex", alignItems: "center" }}>
              <Button variant="outlined" color="secondary" fullWidth onClick={resetDateRange}>
                Reset Dates
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : doctorId ? (
        <>
          {summary && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <Card sx={{ boxShadow: 1 }}>
                  <CardContent>
                    <Typography variant="caption" color="textSecondary">
                      Total Tokens
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>
                      {summary.totalTokens}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <Card sx={{ boxShadow: 1 }}>
                  <CardContent>
                    <Typography variant="caption" color="textSecondary">
                      Waiting
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "warning.main" }}>
                      {summary.waitingTokens}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <Card sx={{ boxShadow: 1 }}>
                  <CardContent>
                    <Typography variant="caption" color="textSecondary">
                      Serving
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "secondary.main" }}>
                      {summary.servingTokens}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <Card sx={{ boxShadow: 1 }}>
                  <CardContent>
                    <Typography variant="caption" color="textSecondary">
                      Served
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "success.main" }}>
                      {summary.servedTokens}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <Card sx={{ boxShadow: 1 }}>
                  <CardContent>
                    <Typography variant="caption" color="textSecondary">
                      Skipped
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "error.main" }}>
                      {summary.skippedTokens}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <Card sx={{ boxShadow: 1 }}>
                  <CardContent>
                    <Typography variant="caption" color="textSecondary">
                      Avg Service Time
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "info.main" }}>
                      {summary.avgServiceTime ? `${summary.avgServiceTime.toFixed(1)}m` : "N/A"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          <Card sx={{ mb: 3, boxShadow: 2 }}>
            <CardContent>
              <ToggleButtonGroup
                value={timeRange}
                exclusive
                onChange={(_: MouseEvent<HTMLElement>, value: TimeRange | null) =>
                  value && setTimeRange(value)
                }
                size="small"
              >
                {(["daily", "weekly", "monthly", "yearly"] as TimeRange[]).map((range) => (
                  <ToggleButton key={range} value={range}>
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </CardContent>
          </Card>

          <Card sx={{ boxShadow: 2 }}>
            <CardHeader
              title={`${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Token Statistics`}
            />
            <CardContent>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Period</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Waiting</TableCell>
                      <TableCell>Serving</TableCell>
                      <TableCell>Served</TableCell>
                      <TableCell>Skipped</TableCell>
                      <TableCell>Completion %</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No data available for the selected period
                        </TableCell>
                      </TableRow>
                    ) : (
                      stats.map((stat: TimeRangeStats, index: number) => (
                        <TableRow key={index} hover>
                          <TableCell>{formatPeriod(stat.period, timeRange)}</TableCell>
                          <TableCell>{stat.totalTokens}</TableCell>
                          <TableCell sx={{ color: "warning.main" }}>{stat.waitingTokens}</TableCell>
                          <TableCell sx={{ color: "secondary.main" }}>{stat.servingTokens}</TableCell>
                          <TableCell sx={{ color: "success.main" }}>{stat.servedTokens}</TableCell>
                          <TableCell sx={{ color: "error.main" }}>{stat.skippedTokens}</TableCell>
                          <TableCell>
                            {stat.totalTokens > 0
                              ? ((stat.servedTokens / stat.totalTokens) * 100).toFixed(1)
                              : "0"}
                            %
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card sx={{ boxShadow: 2 }}>
          <CardHeader title="Doctors Performance Overview" />
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Doctor Name</TableCell>
                    <TableCell>Total Tokens</TableCell>
                    <TableCell>Served Tokens</TableCell>
                    <TableCell>Completion Rate</TableCell>
                    <TableCell>Avg Service Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allDoctorsStats.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No doctor data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    allDoctorsStats.map((doctor: DoctorStats) => (
                      <TableRow key={doctor.doctorId} hover>
                        <TableCell>{doctor.doctorName}</TableCell>
                        <TableCell>{doctor.totalTokens}</TableCell>
                        <TableCell sx={{ color: "success.main" }}>{doctor.servedTokens}</TableCell>
                        <TableCell>
                          {doctor.totalTokens > 0
                            ? ((doctor.servedTokens / doctor.totalTokens) * 100).toFixed(1)
                            : "0"}
                          %
                        </TableCell>
                        <TableCell sx={{ color: "info.main" }}>
                          {doctor.avgServiceTime ? `${doctor.avgServiceTime.toFixed(1)} min` : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
