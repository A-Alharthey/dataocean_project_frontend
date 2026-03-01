import { Box, Accordion, AccordionSummary, Typography, AccordionDetails, TextField, Grid, Button, AppBar, Toolbar, Table, TableBody, TableRow, TableCell, TableHead, TablePagination, Select, Autocomplete, CircularProgress } from "@mui/material";
import DashboardLayout from "./Components/DashboardLayout"
import { ExpandMore, Label } from "@mui/icons-material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs";
function TechnicianServices() {
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
    }, [page, pageSize])
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
                temp.push({ valueField: element.ID, textField: element.name, searchField: element.searchField })
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
        fetch(`http://92.205.234.30:7071/api/TechnicianServices/GetList?pageSize=${pageSize}&pageNumber=${page + 1}&criteria=${JSON.stringify(filter)}`, config).then(res => {
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
                    <Accordion sx={{ bgcolor: "#313439", borderRadius: "10px", width: "100%" }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h5" color="textPrimary">Filter</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ paddingTop: "30px", borderTop: "solid 0.5px" }}>
                            <Grid container spacing={3} sx={{ width: "100%" }}>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="WO Code" variant="outlined" fullWidth value={filter.code} onChange={(e) => setFilter(prev => ({ ...prev, code: e.target.value }))} />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker label="From WO Date" variant="outlined" sx={{ width: "100%" }} value={filter.fromDate ? dayjs(filter.fromDate, "MM-DD-YYYY") : null} onChange={(e) => setFilter(prev => ({ ...prev, fromDate: e ? dayjs(e).format("MM-DD-YYYY") : null }))} />
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
                                        }} onClick={() => (Suggestions.location ? null : getAutoCompleteSuggestions(6001, "location"))} />)} isOptionEqualToValue={(option, value) => option.valueField === value.valueField} getOptionLabel={(option) => option.textField || ""} onChange={(e, v) => setFilter(prev => ({ ...prev, locationId: v }))} value={filter.locationId || null} />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="WO Number" variant="outlined" fullWidth value={filter.number} onChange={(e) => setFilter(prev => ({ ...prev, number: e.target.value }))} />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <Autocomplete variant="outlined" options={Suggestions.serviceTypeGroup || []} fullWidth renderInput={(params) => (<TextField {...params} label="Service Type Group"
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {isLoading.serviceTypeGroup ? <CircularProgress size={20} color="white" /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>)
                                            }
                                        }} onClick={() => (Suggestions.serviceTypeGroup ? null : getAutoCompleteSuggestions(6006, "serviceTypeGroup"))} />)} onChange={(e, v) => setFilter(prev => ({ ...prev, serviceTypeGroupId: v }))} getOptionLabel={(option) => option.textField} isOptionEqualToValue={(option, value) => option.valueField === value.valueField} value={filter.serviceTypeGroupId || null} />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <Autocomplete variant="outlined" options={Suggestions.serviceTypeGroupStatus || []} fullWidth renderInput={(params) => (<TextField {...params} label="Service Type Group Status"
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {isLoading.serviceTypeGroupStatus ? <CircularProgress size={20} color="white" /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>)
                                            }
                                        }} onClick={() => (Suggestions.serviceTypeGroupStatus ? null : getAutoCompleteSuggestions(6008, "serviceTypeGroupStatus"))} />)} onChange={(e, v) => setFilter(prev => ({ ...prev, status: v }))} getOptionLabel={(option) => option.textField} isOptionEqualToValue={(option, value) => option.valueField === value.valueField} value={filter.status || null} />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <Autocomplete variant="outlined" options={Suggestions.assignToTechnician || []} fullWidth renderInput={(params) => (<TextField {...params} label="Assign To Technician"
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {isLoading.assignToTechnician ? <CircularProgress size={20} color="white" /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>)
                                            }
                                        }} onClick={() => (Suggestions.assignToTechnician ? null : getAutoCompleteSuggestions(6007, "assignToTechnician"))} />)} getOptionLabel={(option) => option.textField} isOptionEqualToValue={(option, value) => option.valueField === value.valueField} onChange={(e, v) => setFilter(prev => ({ ...prev, technicianId: v }))} value={filter.technicianId || null} />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="WO Title" variant="outlined" fullWidth value={filter.title} onChange={(e) => setFilter(prev => ({ ...prev, title: e.target.value }))} />
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker label="To WO Date" variant="outlined" sx={{ width: "100%" }} value={filter.toDate ? dayjs(filter.toDate, "YYYY-MM-DD") : null} onChange={(e) => setFilter(prev => ({ ...prev, toDate: e ? e.format("YYYY-MM-DD") : null }))} />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item size={{ xs: 4 }}>
                                    <TextField label="To WO Number" variant="outlined" fullWidth value={filter.toNumber || ""} onChange={(e) => setFilter(prev => ({ ...prev, toNumber: e.target.value }))} />
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
                            <Typography color="textPrimary">Technician Services</Typography>
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
                                    <TableCell>Service Type Group Sequence</TableCell>
                                    <TableCell>Service Type Group</TableCell>
                                    <TableCell>Service Type Group Status</TableCell>
                                    <TableCell>Assign To Technician</TableCell>
                                    <TableCell>Completed Date</TableCell>
                                    <TableCell>Technician Notes</TableCell>
                                    <TableCell>WO Number</TableCell>
                                    <TableCell>WO Code</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Work Order Date</TableCell>
                                    <TableCell>WO Due Date</TableCell>
                                    <TableCell>Asset Items</TableCell>
                                    <TableCell>Maintenance Requests</TableCell>
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
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.serviceTypeGroupSequence}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.serviceTypeGroupId}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.status}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.technicianId}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.completedDate}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.technicianNotes}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.number}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.code}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.title}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.LocationId}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.workOrderDate}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.dueDate}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.assetItemId}</TableCell>
                                            <TableCell sx={{ padding: "10px", textAlign: "center" }}>{item.maintenanceRequestId}</TableCell>
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

export default TechnicianServices