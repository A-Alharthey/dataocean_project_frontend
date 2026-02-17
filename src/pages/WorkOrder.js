import { Box, Accordion, AccordionSummary, Typography, AccordionDetails, TextField, Grid, Button, AppBar, Toolbar, Table, TableBody, TableRow, TableCell, TableHead, TablePagination } from "@mui/material";
import DashboardLayout from "./Components/DashboardLayout"
import { ExpandMore, Label } from "@mui/icons-material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
function WorkOrder() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const [data, setData] = useState({ "page": 1, "total": 49, "list": [{ "ID": 50, "number": 28, "code": "WO-26-BIO-28", "status": "Open", "statusCssClass": "success", "priorityId": "Routine", "priorityCssClass": "warning", "title": "PPM Test", "LocationId": "BioMedical", "workOrderDate": "2026-03-25", "completedDate": null, "dueDate": "2026-03-25", "assetItemId": "FCU-2F-M18-T18-LTAC-2F", "assetLocationId": "SINGLE BEDROOM", "customerId": null, "vendorId": null, "maintenanceRequestId": null, "maintenancePlanId": "PPM Test", "cancelDate": null, "cancelBy": null }, { "ID": 49, "number": 27, "code": "WO-26-BIO-27", "status": "Open", "statusCssClass": "success", "priorityId": "Routine", "priorityCssClass": "warning", "title": "PPM Test", "LocationId": "BioMedical", "workOrderDate": "2026-03-18", "completedDate": null, "dueDate": "2026-03-18", "assetItemId": "FCU-2F-M18-T18-LTAC-2F", "assetLocationId": "SINGLE BEDROOM", "customerId": null, "vendorId": null, "maintenanceRequestId": null, "maintenancePlanId": "PPM Test", "cancelDate": null, "cancelBy": null }, { "ID": 48, "number": 26, "code": "WO-26-BIO-26", "status": "Open", "statusCssClass": "success", "priorityId": "Routine", "priorityCssClass": "warning", "title": "PPM Test", "LocationId": "BioMedical", "workOrderDate": "2026-03-11", "completedDate": null, "dueDate": "2026-03-11", "assetItemId": "FCU-2F-M18-T18-LTAC-2F", "assetLocationId": "SINGLE BEDROOM", "customerId": null, "vendorId": null, "maintenanceRequestId": null, "maintenancePlanId": "PPM Test", "cancelDate": null, "cancelBy": null }, { "ID": 47, "number": 25, "code": "WO-26-BIO-25", "status": "Open", "statusCssClass": "success", "priorityId": "Routine", "priorityCssClass": "warning", "title": "PPM Test", "LocationId": "BioMedical", "workOrderDate": "2026-03-04", "completedDate": null, "dueDate": "2026-03-04", "assetItemId": "FCU-2F-M18-T18-LTAC-2F", "assetLocationId": "SINGLE BEDROOM", "customerId": null, "vendorId": null, "maintenanceRequestId": null, "maintenancePlanId": "PPM Test", "cancelDate": null, "cancelBy": null }, { "ID": 46, "number": 24, "code": "WO-26-BIO-24", "status": "Open", "statusCssClass": "success", "priorityId": "Routine", "priorityCssClass": "warning", "title": "PPM Test", "LocationId": "BioMedical", "workOrderDate": "2026-02-25", "completedDate": null, "dueDate": "2026-02-25", "assetItemId": "FCU-2F-M18-T18-LTAC-2F", "assetLocationId": "SINGLE BEDROOM", "customerId": null, "vendorId": null, "maintenanceRequestId": null, "maintenancePlanId": "PPM Test", "cancelDate": null, "cancelBy": null }] })
    //disabled for now cause of infinite requests problem
    // async function getData() {
    //     const config = {
    //         method: "GET",
    //         headers: {
    //             "Accept": "application/json, text/plain, */*",
    //             "Authorization": `bearer ${window.localStorage.getItem("token")}`,
    //             "formid": "903005"
    //         }
    //     }
    //     fetch("http://92.205.234.30:7071/api/WorkOrder/GetList?pageSize=150&pageNumber=1&criteria=%7B%7D", config).then(res => {
    //         if (!res.ok) {
    //             navigate("/")
    //         }
    //         return res.json()
    //     }).then(res => setData(res)).catch(e => navigate("/"))
    // }
    // getData()
    return (
        <Box sx={{ height: "100vh", width: "100vw", bgcolor: "#1c2025", display: "flex" }}>
            <DashboardLayout />
            <Box elevation sx={{ overflowY: "scroll", overflowX: "hidden", width: "100%", marginTop: "64px", marginLeft: "256px", padding: "20px", paddingTop: "50px", paddingBottom: "50px" }}>
                <Grid container>
                    <Accordion sx={{ bgcolor: "#313439", borderRadius: "10px", width: "100%" }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h5" color="textPrimary">Filter</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={3} sx={{ width: "100%" }}>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="WO Code" variant="outlined" fullWidth />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="From WO Date" variant="outlined" fullWidth />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="From WO Number" variant="outlined" fullWidth />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="Location" variant="outlined" fullWidth />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="Maintenance Type" variant="outlined" fullWidth />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="WO Number" variant="outlined" fullWidth />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="Priority" variant="outlined" fullWidth />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="Status" variant="outlined" fullWidth />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="WO Title" variant="outlined" fullWidth />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="To WO Date" variant="outlined" fullWidth />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="To WO Number" variant="outlined" fullWidth />
                                </Grid>
                                <Grid item size={{ xs: 12 }} sx={{ textAlign: "center" }}>
                                    <Button variant="contained" sx={{}}>APPLY FILTER</Button>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid container>
                    <Grid item size={{ xs: 12 }} sx={{ marginTop: "20px" }}>
                        <Toolbar sx={{ bgcolor: "#313439", marginTop: "20px", borderRadius: "5px" }}>
                            <Typography color="textPrimary">Work Orders</Typography>
                            <div style={{ flexGrow: "1" }}></div>
                            <Button sx={{ fontWeight: "bold" }} variant="contained">
                                + NEW
                            </Button>
                        </Toolbar>
                        <Toolbar sx={{ bgcolor: "#313439", border: "1px dashed rgb(204, 204, 204)" }}>
                            <Typography variant="caption" color="textPrimary">Drag headers ...</Typography>
                        </Toolbar>
                    </Grid>
                    <Grid overflow={"scroll"} item size={{ xs: 12 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: "#313439" }}>
                                    <TableCell>Action</TableCell>
                                    <TableCell>WO Number</TableCell>
                                    <TableCell>WO Code</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>WO Title</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>WO Date</TableCell>
                                    <TableCell>Completed Date</TableCell>
                                    <TableCell>Due Date</TableCell>
                                    <TableCell>Asset Item</TableCell>
                                    <TableCell>Asset Location</TableCell>
                                    <TableCell>Maintenance Request</TableCell>
                                    <TableCell>Maintenance Plan</TableCell>
                                    <TableCell>Cancel Date</TableCell>
                                    <TableCell>Cancel By</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { 
                                    data.list ? data.list.slice(page * pageSize, page * pageSize + pageSize).map((item) => (
                                        <TableRow key={item.ID} sx={{ bgcolor: "#313439" }}>
                                            <TableCell>
                                                <Button onClick={() => navigate(`/transactions/workorder/${item.ID}`)} sx={{ color: "rgba(255, 255, 255, 0.54)" }}>
                                                    <ArrowForwardIcon />
                                                </Button></TableCell>
                                            <TableCell>{item.number}</TableCell>
                                            <TableCell>{item.code}</TableCell>
                                            <TableCell>{item.status}</TableCell>
                                            <TableCell>{item.priorityId}</TableCell>
                                            <TableCell>{item.title}</TableCell>
                                            <TableCell>{item.LocationId}</TableCell>
                                            <TableCell>{item.workOrderDate}</TableCell>
                                            <TableCell>{item.completedDate}</TableCell>
                                            <TableCell>{item.dueDate}</TableCell>
                                            <TableCell>{item.assetItemId}</TableCell>
                                            <TableCell>{item.assetLocationId}</TableCell>
                                            <TableCell>{item.maintenanceRequestId}</TableCell>
                                            <TableCell>{item.maintenancePlanId}</TableCell>
                                            <TableCell>{item.cancelDate}</TableCell>
                                            <TableCell>{item.cancelBy}</TableCell>
                                        </TableRow>
                                    )) : <TableRow><TableCell colSpan={17} align="center">Loading...</TableCell></TableRow>
                                }
                            </TableBody>
                        </Table>
                    </Grid>
                    <TablePagination
                        sx={{ bgcolor: "#313439", width: "100%" }}
                        component="div"
                        count={data.total}
                        page={page}
                        rowsPerPage={pageSize}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(event) => setPageSize(parseInt(event.target.value, 10))}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                </Grid>
            </Box>
        </Box>
    )
}

export default WorkOrder