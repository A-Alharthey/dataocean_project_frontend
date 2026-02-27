import { Box, Accordion, AccordionSummary, Typography, AccordionDetails, TextField, Grid, Button, AppBar, Toolbar, Table, TableBody, TableRow, TableCell, TableHead, TablePagination, Select, Autocomplete, CircularProgress } from "@mui/material";
import DashboardLayout from "./Components/DashboardLayout"
import { ExpandMore, Label } from "@mui/icons-material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
function WorkOrder() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const [data, setData] = useState({})
    const [Suggestions, setSuggestions] = useState({ location: null, maintenanceType: null, priority: null, status: null })
    const [isLoading, setIsLoading] = useState({ location: false, maintenanceType: false, priority: false, status: false })
    const [filter, setFilter] = useState({ code: "", fromDate: null, fromNumber: "", locationId: null, maintenanceTypeId: null, number: "", priorityId: null, status: null, title: "", toDate: null, toNumber: "" })
    //http://92.205.234.30:7071/api/WorkOrder/GetList?pageSize=150&pageNumber=1&criteria={"code":"a","fromDate":"2026/2/23","fromNumber":"1","locationId":{"valueField":173,"textField":"MNT-BIO-BioMedical","searchField":"MNT-BIO"},"maintenanceTypeId":{"valueField":16,"textField":"MNT-0001-PPM","searchField":"MNT-0001"},"number":"1","priorityId":{"valueField":5,"textField":"E-Emergency","searchField":"E"},"status":{"valueField":1,"textField":"1-Open","searchField":"1"},"title":"t","toDate":"2026/2/24","toNumber":"4"}
    useEffect(() => {
        getTableData()
    }, [page,pageSize])
    //the autocomplete function needs specific ids to fetch data, the ids are as follow: location: 6001, maintenanceType: 6005, priority: 6004, status: 6010
    async function getAutoCompleteSuggestions(id, fieldName) {
        const config = {
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Authorization": `bearer ${window.localStorage.getItem("token")}`,
                "formid": "903005"
            }
        }
        setIsLoading(prev => ({ ...prev, [fieldName]: true }))
        fetch(`http://92.205.234.30:7071/api/General/Search?SearchID=${id}&loadLimit=100`, config).then(res => {
            if (!res.ok) {
                navigate("/")
            }
            return res.json()
        }).then(res => {
            let temp = []
            res.list.forEach(element => {
                // the object has to be structured with two name fields so autocomplete can structure its search and display properly
                temp.push({ label: element.name, [fieldName+"Id"]:{valueField:element.ID,textField:element.name,searchField:element.searchField} })
            })
            console.log(Suggestions)
            setSuggestions(prev => ({ ...prev, [fieldName]: temp }))
        }).catch(e => navigate("/")).finally(() => setIsLoading(prev => ({ ...prev, [fieldName]: false })))
    }
    async function getTableData() {
        const config = {
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Authorization": `bearer ${window.localStorage.getItem("token")}`,
                "formid": "903005"
            }
        }
        fetch(`http://92.205.234.30:7071/api/WorkOrder/GetList?pageSize=${pageSize}&pageNumber=${page+1}&criteria=${JSON.stringify(filter)}`, config).then(res => {
            if (!res.ok) {
                navigate("/")
            }
            return res.json()
        }).then(res => setData(res)).catch(e => navigate("/"))
    }
    return (
        <Box sx={{ height: "100vh", width: "100vw", bgcolor: "#1c2025", display: "flex" }}>
            <DashboardLayout />
            <Box sx={{ overflowY: "scroll", overflowX: "hidden", width: "100%", marginTop: "64px", marginLeft: "256px", padding: "20px", paddingTop: "50px", paddingBottom: "50px" }}>
                <Grid container>
                    {/* TODO fix autocomplete fields not working with filter */}
                    <Accordion sx={{ bgcolor: "#313439", borderRadius: "10px", width: "100%" }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h5" color="textPrimary">Filter</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ paddingTop: "30px", borderTop: "solid 0.5px" }}>
                            <Grid container spacing={3} sx={{ width: "100%" }}>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField  label="WO Code" variant="outlined" fullWidth value={filter.code} onChange={(e) => setFilter(prev => ({ ...prev, code: e.target.value }))} />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker  label="From WO Date" variant="outlined" sx={{ width: "100%" }} value={filter.fromDate} onChange={(e) => setFilter(prev => ({ ...prev, fromDate: e }))} />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="From WO Number" variant="outlined" fullWidth value={filter.fromNumber} onChange={(e) => setFilter(prev => ({ ...prev, fromNumber: e.target.value }))} />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <Autocomplete variant="outlined" options={Suggestions.location || []} fullWidth renderInput={(params) => (<TextField {...params} label="Location"
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {isLoading.location ? <CircularProgress size={20} color="white" /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>)
                                            }
                                        }} onClick={() => (Suggestions.location ? null : getAutoCompleteSuggestions(6001, "location"))} />)} onChange={(e,v)=> setFilter(prev => ({ ...prev, locationId: v }))} value={filter.locationId} />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <Autocomplete variant="outlined" options={Suggestions.maintenanceType || []} fullWidth renderInput={(params) => (<TextField {...params} label="Maintenance Type"
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {isLoading.maintenanceType ? <CircularProgress size={20} color="white" /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>)
                                            }
                                        }} onClick={() => (Suggestions.maintenanceType ? null : getAutoCompleteSuggestions(6005, "maintenanceType"))} />)}   onChange={(e,v)=> setFilter(prev => ({ ...prev, maintenanceTypeId: v }))} value={filter.maintenanceTypeId} />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="WO Number" variant="outlined" fullWidth value={filter.number} onChange={(e) => setFilter(prev => ({ ...prev, number: e.target.value }))} />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <Autocomplete variant="outlined" options={Suggestions.priority || []} fullWidth renderInput={(params) => (<TextField {...params} label="Priority"
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {isLoading.priority ? <CircularProgress size={20} color="white" /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>)
                                            }
                                        }} onClick={() => (Suggestions.priority ? null : getAutoCompleteSuggestions(6004, "priority"))} />)} onChange={(e,v)=> setFilter(prev => ({ ...prev, priorityId: v }))} value={filter.priorityId} />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <Autocomplete variant="outlined" options={Suggestions.status || []} fullWidth renderInput={(params) => (<TextField {...params} label="Status"
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {isLoading.status ? <CircularProgress size={20} color="white" /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>)
                                            }
                                        }} onClick={() => (Suggestions.status ? null : getAutoCompleteSuggestions(6003, "status"))} />)} onChange={(e,v)=> setFilter(prev => ({ ...prev, status: v }))} value={filter.status} />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="WO Title" variant="outlined" fullWidth value={filter.title} onChange={(e) => setFilter(prev => ({ ...prev, title: e.target.value }))} />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker label="To WO Date" variant="outlined" sx={{ width: "100%" }} value={filter.toDate} onChange={(e) => setFilter(prev => ({ ...prev, toDate: e }))} />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="To WO Number" variant="outlined" fullWidth value={filter.toNumber} onChange={(e) => setFilter(prev => ({ ...prev, toNumber: e.target.value }))} />
                                </Grid>
                                <Grid item size={{ xs: 12 }} sx={{ textAlign: "center" }}>
                                    <Button onClick={getTableData} variant="contained" sx={{}} >APPLY FILTER</Button>
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
                            <Button onClick={() => navigate("/transactions/workorder/new")} sx={{ fontWeight: "bold" }} variant="contained">
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
                                    data.list ? data.list.map((item) => (
                                        <TableRow key={item.ID} sx={{ bgcolor: "#313439" }}>
                                            <TableCell sx={{ padding: "0px", textAlign: "center" }}>
                                                <Button onClick={() => navigate(`/transactions/workorder/${item.ID}`)} sx={{ color: "rgba(255, 255, 255, 0.54)" }}>
                                                    <ArrowForwardIcon />
                                                </Button>
                                            </TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.number}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.code}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.status}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.priorityId}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.title}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.LocationId}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.workOrderDate}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.completedDate}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.dueDate}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.assetItemId}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.assetLocationId}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.maintenanceRequestId}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.maintenancePlanId}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.cancelDate}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.cancelBy}</TableCell>
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