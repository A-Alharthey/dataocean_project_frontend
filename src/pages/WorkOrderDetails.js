import { Box, Accordion, AccordionSummary, Typography, AccordionDetails, TextField, Grid, Button, AppBar, Toolbar, Table, TableBody, TableRow, TableCell, TableHead, FormControl, FormControlLabel, Checkbox } from "@mui/material";
import DashboardLayout from "./Components/DashboardLayout"
import {ExpandMore, Label } from "@mui/icons-material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";
function WorkOrderDetails() {
    return (
        <Box sx={{ height: "100vh", width: "100vw", bgcolor: "#1c2025", display: "flex" }}>
            <DashboardLayout />
            <Box elevation sx={{ overflowY: "scroll", overflowX: "hidden", width: "100%", marginTop: "60px", marginLeft: "256px", padding: "20px", paddingTop: "30px", paddingBottom: "50px" }}>
                <Grid container justifyContent={"space-between"}>
                    <Grid item xs={12}>
                        <Typography variant="h4" color="textPrimary" >Work Orders</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained">Cancel</Button>
                        <Button variant="contained">Save</Button>
                        <Button variant="contained">Print</Button>
                    </Grid>
                </Grid>
                <Accordion sx={{ bgcolor: "#313439", width: "100%", marginTop: "20px" }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="h6" color="textPrimary">Main Data</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{borderTop:"0.5px solid rgb(224, 224, 224)"}}>
                        <Grid container spacing={3} sx={{ width: "100%",paddingTop:"15px"}}>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Number" variant="outlined"/>
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Code" variant="outlined" />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Location" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Title" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Work Order Date" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Due Date" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Maintenance Type" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <FormControlLabel control={<Checkbox/>} label="External Maintenance" />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <FormControlLabel control={<Checkbox/>} label="Required Requester Confirmation" />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Vendor" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Maintenance Requests" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Asset Items Location" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Asset Items" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Priority" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Status" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Completed Date" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Closed Date" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Reference Number1" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Reference Number2" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField label="Reference Number3" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 8 }}>
                                <TextField label="Remarks" variant="outlined" fullWidth/>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    )
}

export default WorkOrderDetails