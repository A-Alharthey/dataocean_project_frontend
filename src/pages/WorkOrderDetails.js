import { Box, Accordion, AccordionSummary, Typography, AccordionDetails, TextField, Grid, Button, AppBar, Toolbar, Table, TableBody, TableRow, TableCell, TableHead, FormControl, FormControlLabel, Checkbox, Select, MenuItem, Autocomplete, CircularProgress } from "@mui/material";
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
    async function  getPrioritiesByAsset(elementName) {
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
                                    <TextField onClick={() => (getSuggestion("vendorId", 6006))} label="Vendor" {...params} slotProps={{
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
                                {/* TODO: fix priorities not working due to default value loading being broken */}
                                <Autocomplete disabled={formData.disableWOAssets} variant="outlined" sx={{ width: "100%" }} onChange={(event, value) => { setFormData((prev) => ({ ...prev, priorityId: value.ID })) }} value={suggestions.priorityId?.find((item) => item.ID === formData.priorityId) || null} options={suggestions.priorityId || []} getOptionLabel={(option) => option.textField || ""} fullWidth renderInput={(params) => (
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
                                <Autocomplete variant="outlined" sx={{ width: "100%" }} onChange={(event, value) => { setFormData((prev) => ({ ...prev, statusId: value.ID })) }} value={suggestions.statusId?.find((item) => item.ID === formData.statusId) || null} options={suggestions.statusId || []} getOptionLabel={(option) => option.StatusName || ""} fullWidth renderInput={(params) => (
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
                                <TextField label="Remarks" variant="outlined" fullWidth />
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    )
}

export default WorkOrderDetails