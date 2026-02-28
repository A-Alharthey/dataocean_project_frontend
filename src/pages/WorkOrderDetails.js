import { Box, Accordion, AccordionSummary, Typography, AccordionDetails, TextField, Grid, Button, AppBar, Toolbar, Table, TableBody, TableRow, TableCell, TableHead, FormControl, FormControlLabel, Checkbox, Select, MenuItem, Autocomplete, CircularProgress, TablePagination } from "@mui/material";
import DashboardLayout from "./Components/DashboardLayout"
import { ExpandMore, Label } from "@mui/icons-material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
function WorkOrderDetails() {
    const { id } = useParams()
    const { editMode } = useLoaderData()
    const [suggestions, setSuggestions] = useState({})
    const [formData, setFormData] = useState({})
    const [isLoading, setIsLoading] = useState({})
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [editingRowID, setEditingRowID] = useState(null)
    const [modifiedWorkOrderDetails, setModifiedWorkOrderDetails] = useState({})
    const Navigate = useNavigate()
    const config = {
        method: "GET",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Authorization": `bearer ${window.localStorage.getItem("token")}`,
            "formid": "903005"
        }
    }
    useEffect(() => {
        getLocations()
        getStatuses()
    }, [])
    useEffect(() => {
        if (formData.locationId) {
            setCodeAndNumber()
        }
    }, [formData.locationId])
    useEffect(() => {
        if (editMode && formData.assetItemId) {
            getPrioritiesByAsset("priorityId")
        }
    }, [formData.assetItemId])
    //incase of edit mode, get the data by id and fill the form also disable all three fields number code and location and make them uneditable
    async function getByID() {
        const result = await fetch(`http://92.205.234.30:7071/api/WorkOrder/GetByID?ID=${id}`, config)
        if (!result.ok) {
            alert("getByID went wrong!")
            return
        }
        const data = await result.json()
        setFormData(data)
    }
    async function setCodeAndNumber() {
        const result = await fetch(`http://92.205.234.30:7071/api/WorkOrder/GetNextCodeWO?LocationId=${formData.locationId}`, config)
        if (!result.ok) {
            alert("setCodeAndNumber went wrong!")
            return
        }
        const data = await result.json()
        console.log(JSON.stringify(data))
        setFormData((prev) => ({ ...prev, code: data, number: data })) //in the api both code and number are the same but in real life they might be different so i set them both to the same value for now
    }
    async function getLocations() {
        const result = await fetch("http://92.205.234.30:7071/api/Locations/GetLocations?mode=mnt", config)
        if (!result.ok) {
            alert("getLocations went wrong!")
            return
        }
        const data = await result.json()
        setSuggestions((prev) => ({ ...prev, locations: data.list }))
        setFormData((prev) => ({ ...prev, locationId: data.list?.[0]?.ID }))
        if (editMode) {
            getByID()
        }
    }
    async function getSuggestion(elementName, id) {
        if (suggestions[elementName]) return
        setIsLoading((prev) => ({ ...prev, [elementName]: true }))
        const result = await fetch(`http://92.205.234.30:7071/api/General/Search?SearchID=${id}&loadLimit=100`, config).finally(() => setIsLoading((prev) => ({ ...prev, [elementName]: false })))
        if (!result.ok) {
            alert("getSuggestion went wrong!")
            return
        }
        const data = await result.json()
        let temp = []
        data.list.forEach(element => {
            temp.push({ valueField: element.ID, textField: element.name })
        })
        setSuggestions((prev) => ({ ...prev, [elementName]: temp }))
    }
    async function getAssets(elementName) {
        setIsLoading((prev) => ({ ...prev, [elementName]: true }))
        const result = await fetch(`http://92.205.234.30:7071/api/WorkOrder/GetAllAssetItems?LocationId=${formData.locationId}&assetLocationId=${formData.assetLocationId?.valueField}`, config).finally(() => setIsLoading((prev) => ({ ...prev, [elementName]: false })))
        if (!result.ok) {
            alert("getAssets went wrong!")
            return
        }
        const textData = await result.text()
        if (!textData) {
            setSuggestions((prev) => ({ ...prev, [elementName]: [] }))
            return
        }
        const data = JSON.parse(textData)
        setSuggestions((prev) => ({ ...prev, [elementName]: data.list }))
    }
    async function getPrioritiesByAsset(elementName) {
        if (!formData.assetItemId) return
        setIsLoading((prev) => ({ ...prev, [elementName]: true }))
        const result = await fetch(`http://92.205.234.30:7071/api/WorkOrder/GetPrioritiesByAsset?formid=903005&assetItemId=${formData.assetItemId}`, config).finally(() => setIsLoading((prev) => ({ ...prev, [elementName]: false })))
        if (!result.ok) {
            alert("getPrioritiesByAsset went wrong!")
            return
        }
        const textData = await result.text()
        if (!textData) {
            setSuggestions((prev) => ({ ...prev, [elementName]: [] }))
            return
        }
        const data = JSON.parse(textData)
        setSuggestions((prev) => ({ ...prev, [elementName]: data.list }))
    }
    async function getStatuses() {
        if (suggestions.statusId) return
        setIsLoading((prev) => ({ ...prev, statusId: true }))
        const result = await fetch(`http://92.205.234.30:7071/api/WorkOrder/GetMNTWorkOrderStatuses`, config).finally(() => setIsLoading((prev) => ({ ...prev, statusId: false })))
        if (!result.ok) {
            alert("getStatuses went wrong!")
            return
        }
        const textData = await result.text()
        if (!textData) {
            setSuggestions((prev) => ({ ...prev, statusId: [] }))
            return
        }
        const data = JSON.parse(textData)
        setSuggestions((prev) => ({ ...prev, statusId: data.list }))
    }
    function handleRowSave() {
        formData.workOrderdetails = formData.workOrderdetails.map((detail) => {
            if (detail.ID === editingRowID) {
                return { ...detail, ...modifiedWorkOrderDetails }
            }
            return detail
        })
        setEditingRowID(null)
    }
    return (
        <Box sx={{ height: "100vh", width: "100vw", bgcolor: "#1c2025", display: "flex" }}>
            <DashboardLayout />
            <Box elevation sx={{ overflowY: "scroll", overflowX: "hidden", width: "100%", marginTop: "60px", marginLeft: "256px", padding: "20px", paddingTop: "30px", paddingBottom: "50px" }}>
                <Grid container justifyContent={"space-between"}>
                    <Grid item xs={12}>
                        <Typography variant="h4" color="textPrimary" >Work Orders</Typography>
                    </Grid>
                    {/*TODO: make the functionality for these buttons and apply the correct styles*/}
                    <Grid item xs={12}>
                        <Button variant="contained">Cancel</Button>
                        <Button variant="contained">Save</Button>
                        <Button variant="contained">Print</Button>
                    </Grid>
                </Grid>
                <Accordion defaultExpanded sx={{ bgcolor: "#313439", width: "100%", marginTop: "20px" }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="h6" color="textPrimary">Main Data</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ borderTop: "0.5px solid rgb(224, 224, 224)" }}>
                        <Grid container spacing={3} sx={{ width: "100%", paddingTop: "15px" }}>
                            <Grid item size={{ xs: 4 }}>
                                <TextField disabled value={formData.number ?? ""} label="Number" variant="outlined" />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField disabled value={formData.code ?? ""} label="Code" variant="outlined" />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <Autocomplete disableClearable disabled={editMode} onChange={(event, value) => { setFormData((prev) => ({ ...prev, locationId: value?.ID })) }} value={formData.locationId ? suggestions.locations?.find((loc) => loc.ID === formData.locationId) || null : suggestions.locations?.[0] || null} isOptionEqualToValue={(option, value) => option.ID === value.ID} getOptionKey={(option) => option.ID} options={suggestions.locations || []} getOptionLabel={(option) => option.LocationName || ""} fullWidth renderInput={(params) => (
                                    <TextField label="Location" {...params} slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            endAdornment:
                                                <>
                                                    {suggestions.locations ? null : <CircularProgress sx={{ color: "text.primary", marginRight: "10px" }} />}
                                                    {params.InputProps.endAdornment}
                                                </>
                                        }
                                    }} />
                                )}
                                />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField value={formData.title ?? ""} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} label="Title" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker disabled value={formData.workOrderDate ? dayjs(formData.workOrderDate) : dayjs()} onChange={(e) => setFormData(prev => ({ ...prev, workOrderDate: e }))} label="Work Order Date" variant="outlined" sx={{ width: "100%" }} />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker disabled={editMode} value={formData.dueDate ? dayjs(formData.dueDate) : dayjs()} onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e }))} label="Due Date" variant="outlined" sx={{ width: "100%" }} />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <Autocomplete onChange={(event, value) => { setFormData((prev) => ({ ...prev, maintenanceTypeId: value })) }} value={formData.maintenanceTypeId || null} isOptionEqualToValue={(option, value) => option.valueField === value.valueField} getOptionKey={(option) => option.valueField} options={suggestions.maintenanceTypeId || []} getOptionLabel={(option) => option.textField || ""} fullWidth renderInput={(params) => (
                                    <TextField onClick={() => (getSuggestion("maintenanceTypeId", 6005))} label="Maintenance Type" {...params} slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            endAdornment:
                                                <>
                                                    {isLoading.maintenanceTypeId ? <CircularProgress sx={{ color: "text.primary", marginRight: "10px" }} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                        }
                                    }} />
                                )}
                                />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <FormControlLabel control={<Checkbox checked={formData.extMaintenance ?? false} onChange={(e) => setFormData(prev => ({ ...prev, extMaintenance: e.target.checked }))} />} label="External Maintenance" />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <FormControlLabel control={<Checkbox checked={formData.needConfirmByRequester ?? false} onChange={(e) => { setFormData(prev => ({ ...prev, needConfirmByRequester: e.target.checked })) }} />} label="Required Requester Confirmation" />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <Autocomplete onChange={(event, value) => { setFormData((prev) => ({ ...prev, vendorId: value })) }} value={formData.vendorId || null} isOptionEqualToValue={(option, value) => option.valueField === value.valueField} getOptionKey={(option) => option.valueField} options={suggestions.vendorId || []} getOptionLabel={(option) => option.textField || ""} fullWidth renderInput={(params) => (
                                    <TextField onClick={() => (getSuggestion("vendorId", 6015))} label="Vendor" {...params} slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            endAdornment:
                                                <>
                                                    {isLoading.vendorId ? <CircularProgress sx={{ color: "text.primary", marginRight: "10px" }} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                        }
                                    }} />
                                )}
                                />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                {/*until i know whats the api id for the suggestion search, this will only be functionable for editMode only */}
                                <Autocomplete disabled onChange={(event, value) => { setFormData((prev) => ({ ...prev, maintenanceRequestId: value })) }} value={formData.maintenanceRequestId || null} isOptionEqualToValue={(option, value) => option.valueField === value.valueField} getOptionKey={(option) => option.valueField} options={suggestions.maintenanceRequestId || []} getOptionLabel={(option) => option.textField || ""} fullWidth renderInput={(params) => (
                                    <TextField label="Maintenance Requests" {...params} />
                                )}
                                />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <Autocomplete disabled={formData.disableWOAssets} variant="outlined" sx={{ width: "100%" }} onChange={(event, value) => { setFormData((prev) => ({ ...prev, assetLocationId: value })) }} value={formData.assetLocationId || null} options={suggestions.assetLocationId || []} getOptionLabel={(option) => option.textField || ""} fullWidth renderInput={(params) => (
                                    <TextField onClick={() => getSuggestion("assetLocationId", 707)} label="Asset Items Location" {...params} slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            endAdornment:
                                                <>
                                                    {isLoading.assetLocationId ? <CircularProgress sx={{ color: "text.primary", marginRight: "10px" }} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                        }
                                    }} />
                                )}
                                />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <Autocomplete disabled={formData.disableWOAssets} variant="outlined" sx={{ width: "100%" }} onChange={(event, value) => { setFormData((prev) => { console.log("assetItemId changed:", value); return { ...prev, assetItemId: value } }) }} value={formData.assetItemId || null} options={suggestions.assetItemId || []} getOptionLabel={(option) => option.textField || ""} fullWidth renderInput={(params) => (
                                    <TextField onClick={() => getAssets("assetItemId")} label="Asset Items" {...params} slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            endAdornment:
                                                <>
                                                    {isLoading.assetItemId ? <CircularProgress sx={{ color: "text.primary", marginRight: "10px" }} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                        }
                                    }} />
                                )}
                                />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <Autocomplete disabled={formData.disableWOAssets} variant="outlined" sx={{ width: "100%" }} onChange={(event, value) => { setFormData((prev) => ({ ...prev, priorityId: value.ID })) }} value={suggestions.priorityId?.find((item) => item.ID === formData.priorityId) || null} options={suggestions.priorityId || []} getOptionLabel={(option) => option.priorityName || ""} fullWidth renderInput={(params) => (
                                    <TextField onClick={() => getPrioritiesByAsset("priorityId")} label="Priority" {...params} slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            endAdornment:
                                                <>
                                                    {isLoading.priorityId ? <CircularProgress sx={{ color: "text.primary", marginRight: "10px" }} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                        }
                                    }} />
                                )}
                                />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <Autocomplete disableClearable variant="outlined" sx={{ width: "100%" }} onChange={(event, value) => { setFormData((prev) => ({ ...prev, statusId: value.ID })) }} value={suggestions.statusId?.find((item) => item.ID === formData.statusId) || null} options={suggestions.statusId || []} getOptionLabel={(option) => option.StatusName || ""} fullWidth renderInput={(params) => (
                                    <TextField onClick={() => getStatuses()} label="Status" {...params} slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            endAdornment:
                                                <>
                                                    {isLoading.statusId ? <CircularProgress sx={{ color: "text.primary", marginRight: "10px" }} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                        }
                                    }} />
                                )}
                                />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker disabled value={formData.completedDate} onChange={(newValue) => setFormData((prev) => ({ ...prev, completedDate: newValue }))} label="Completed Date" variant="outlined" sx={{ width: "100%" }} />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker disabled value={formData.closedDate} onChange={(event, value) => { setFormData((prev) => ({ ...prev, closedDate: value })) }} label="Closed Date" variant="outlined" sx={{ width: "100%" }} />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField onChange={(e) => setFormData((prev) => ({ ...prev, referenceNumber1: e.target.value }))} value={formData.referenceNumber1 || ""} label="Reference Number1" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField onChange={(e) => setFormData((prev) => ({ ...prev, referenceNumber2: e.target.value }))} value={formData.referenceNumber2 || ""} label="Reference Number2" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 4 }}>
                                <TextField onChange={(e) => setFormData((prev) => ({ ...prev, referenceNumber3: e.target.value }))} value={formData.referenceNumber3 || ""} label="Reference Number3" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item size={{ xs: 8 }}>
                                <TextField onChange={(e) => setFormData((prev) => ({ ...prev, remarks: e.target.value }))} value={formData.remarks || ""} label="Remarks" variant="outlined" fullWidth />
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Grid container>
                    <Grid item size={{ xs: 12 }} sx={{ marginTop: "20px" }}>
                        <Toolbar sx={{ bgcolor: "#313439", marginTop: "20px", borderRadius: "5px" }}>
                            <Typography color="textPrimary">Work Order details</Typography>
                            <div style={{ flexGrow: "1" }}></div>
                            <Button onClick={() => alert("test")} sx={{ fontWeight: "bold" }} variant="contained">
                                + NEW
                            </Button>
                        </Toolbar>
                    </Grid>
                    <Grid overflow={"scroll"} item size={{ xs: 12 }} sx={{ borderTop: "0.5px solid rgb(224, 224, 224)" }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: "#313439" }}>
                                    <TableCell>Sequence</TableCell>
                                    <TableCell>Service Type Group</TableCell>
                                    <TableCell>Service Type Group Name</TableCell>
                                    <TableCell>Assign to Technician</TableCell>
                                    <TableCell>Technician Notes</TableCell>
                                    <TableCell>Service Type Group Status</TableCell>
                                    <TableCell>Service Type Group Link</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            {/*TODO: make the functionality for adding new workOrderdetails rows */}
                            <TableBody sx={{ bgcolor: "#1c2025" }}>
                                {formData.workOrderdetails && formData.workOrderdetails?.length > 0 ? formData.workOrderdetails?.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.sequence}</TableCell>
                                        {editingRowID === row.ID ?
                                            <TableCell>
                                                {console.log(suggestions, modifiedWorkOrderDetails)}
                                                <Autocomplete disableClearable onChange={(e, value) => { setModifiedWorkOrderDetails(prev => ({ ...prev, serviceTypeGroup: value.valueField, serviceTypeGroupName: value.textField })) }} value={suggestions.serviceTypeGroupId?.find((item) => item.valueField === modifiedWorkOrderDetails.serviceTypeGroup) || null} options={suggestions.serviceTypeGroupId || []} getOptionLabel={(option) => option.textField || ""} fullWidth renderInput={(params) => (
                                                    <TextField variant="standard" onClick={() => getSuggestion("serviceTypeGroupId", 6006)} label="Service Type Group" {...params} slotProps={{
                                                        input: {
                                                            ...params.InputProps,
                                                            endAdornment:
                                                                <>
                                                                    {isLoading.serviceTypeGroupId ? <CircularProgress sx={{ color: "text.primary", marginRight: "10px" }} /> : null}
                                                                    {params.InputProps.endAdornment}
                                                                </>
                                                        }
                                                    }} />)
                                                } />
                                            </TableCell> : <TableCell>{row.serviceTypeGroupName}</TableCell>
                                        }

                                        <TableCell>{row.serviceTypeGroupNotes}</TableCell>
                                        {editingRowID === row.ID ?
                                            <TableCell>
                                                {console.log(suggestions, modifiedWorkOrderDetails)}
                                                <Autocomplete disableClearable onChange={(e, value) => { setModifiedWorkOrderDetails(prev => ({ ...prev, technician: value.valueField, technicianName: value.textField })) }} value={suggestions.technicianId?.find((item) => item.valueField === modifiedWorkOrderDetails.technician) || null} options={suggestions.technicianId || []} getOptionLabel={(option) => option.textField || ""} fullWidth renderInput={(params) => (
                                                    <TextField variant="standard" onClick={() => getSuggestion("technicianId", 6007)} label="Technician" {...params} slotProps={{
                                                        input: {
                                                            ...params.InputProps,
                                                            endAdornment:
                                                                <>
                                                                    {isLoading.technicianId ? <CircularProgress sx={{ color: "text.primary", marginRight: "10px" }} /> : null}
                                                                    {params.InputProps.endAdornment}
                                                                </>
                                                        }
                                                    }} />)
                                                } />
                                            </TableCell> : <TableCell>{row.technicianName}</TableCell>
                                        }
                                        {editingRowID === row.ID ? <TableCell><TextField variant="standard" value={modifiedWorkOrderDetails.technicianNotes || ""} onChange={(e) => setModifiedWorkOrderDetails(prev => ({ ...prev, technicianNotes: e.target.value }))} /></TableCell> : <TableCell>{row.technicianNotes}</TableCell>}
                                        {editingRowID === row.ID ?
                                            <TableCell>
                                                {console.log(suggestions, modifiedWorkOrderDetails)}
                                                <Autocomplete disableClearable onChange={(e, value) => { setModifiedWorkOrderDetails(prev => ({ ...prev, serviceTypeGroupStatus: value.valueField, serviceTypeGroupStatusName: value.textField })) }} value={suggestions.serviceTypeGroupStatus?.find((item) => item.valueField === modifiedWorkOrderDetails.serviceTypeGroupStatus) || null} options={suggestions.serviceTypeGroupStatus || []} getOptionLabel={(option) => option.textField || ""} fullWidth renderInput={(params) => (
                                                    <TextField variant="standard" onClick={() => getSuggestion("serviceTypeGroupStatus", 6008)} label="Service Type Group Status" {...params} slotProps={{
                                                        input: {
                                                            ...params.InputProps,
                                                            endAdornment:
                                                                <>
                                                                    {isLoading.serviceTypeGroupStatus ? <CircularProgress sx={{ color: "text.primary", marginRight: "10px" }} /> : null}
                                                                    {params.InputProps.endAdornment}
                                                                </>
                                                        }
                                                    }} />)
                                                } />
                                            </TableCell> : <TableCell>{row.serviceTypeGroupStatusName}</TableCell>
                                        }
                                        <TableCell>
                                            <Button onClick={() => Navigate(`/transactions/technicianservices/${row.serviceTypeGroupLink}`)}>View</Button>
                                        </TableCell>
                                        <TableCell>
                                            {editingRowID === row.ID ? <Button variant="outlined" size="small" onClick={() => handleRowSave()}>Save</Button> : <Button variant="outlined" size="small" onClick={() => setEditingRowID(row.ID)}>Edit</Button>}
                                            {console.log(formData.workOrderdetails, index)}
                                            {editingRowID === row.ID ? <Button variant="outlined" size="small" onClick={() => { setEditingRowID(null); setModifiedWorkOrderDetails({}) }} sx={{ ml: 1 }}>Cancel</Button> : <Button variant="outlined" size="small" onClick={() => setFormData((prev) => ({ ...prev, workOrderdetails: prev.workOrderdetails.filter((_, i) => i !== index) }))} sx={{ ml: 1 }}>Delete</Button>}
                                        </TableCell>
                                    </TableRow>
                                )) : <Typography variant="body1" color="textPrimary" sx={{ padding: "20px" }}>No details found.</Typography>}
                            </TableBody>
                        </Table>
                    </Grid>
                    <TablePagination
                        sx={{ bgcolor: "#313439", width: "100%" }}
                        component="div"
                        count={formData.workOrderDetails?.total || 0}
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

export default WorkOrderDetails