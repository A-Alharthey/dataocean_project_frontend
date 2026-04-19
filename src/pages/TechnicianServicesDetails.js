import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Button, CircularProgress, FormControl, FormControlLabel, Grid, TextField, Typography } from "@mui/material";
import DashboardLayout from "./components/DashboardLayout";
import { use, useEffect, useRef, useState } from "react";
import { CheckBox, ExpandMore } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

function TechnicianServicesDetails() {
    const [formData, setFormData] = useState({});
    const [suggestions, setSuggestions] = useState({});
    const [isLoading, setIsLoading] = useState({});
    const imageInputBefore = useRef(null)
    const imageInputAfter = useRef(null)
    const { id } = useParams()
    useEffect(() => {
        getLocations();
        getById();
        getStatuses();
    }, [])
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "formid": "903005"
        }
    }
    async function getById() {
        const response = await fetch(`http://92.205.234.30:7071/api/TechnicianServices/GetByID?ID=${id}`, config)
        if (!response.ok) {
            alert("Error fetching data")
            return;
        }
        const textData = await response.text();
        if (!textData) {
            alert("No data found")
            return;
        }
        const data = JSON.parse(textData);
        setFormData(data);
    }
    async function getLocations() {
        setIsLoading({ ...isLoading, location: true });
        const response = await fetch(`http://92.205.234.30:7071/api/Locations/GetLocations?mode=mnt`, config).finally(() => setIsLoading({ ...isLoading, location: false }));
        const data = await response.json();
        setSuggestions({ ...suggestions, locations: data.list });
    }
    async function getStatuses() {
        setIsLoading({ ...isLoading, status: true });
        const response = await fetch(`http://92.205.234.30:7071/api/TechnicianServices/GetMNTServiceTypeGroupStatuses`, config).finally(() => setIsLoading({ ...isLoading, status: false }));
        const data = await response.json();
        setSuggestions({ ...suggestions, statuses: data.list });
    }
    function sendData() {
    }
    return (
        <Box sx={{ height: "100vh", width: "100vw", bgcolor: "#1c2025", display: "flex" }}>
            <DashboardLayout />
            <Box elevation sx={{ overflowY: "scroll", overflowX: "hidden", width: "100%", marginTop: "60px", marginLeft: "256px", padding: "20px", paddingTop: "30px", paddingBottom: "50px" }}>
                <Grid container justifyContent={"space-between"}>
                    <Grid item xs={12}>
                        <Typography variant="h4" color="textPrimary" >Technician Services</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained">Cancel</Button>
                        <Button variant="contained" onClick={sendData}>Save</Button>
                        <Button variant="contained">Print</Button>
                    </Grid>
                </Grid>
                <Accordion defaultExpanded sx={{ bgcolor: "#313439", width: "100%", marginTop: "20px" }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="h6" color="textPrimary">Main Data</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ borderTop: "0.5px solid rgb(224, 224, 224)" }}>
                        <Grid container spacing={3} sx={{ width: "100%", paddingTop: "15px" }}>
                            <Grid item size={{ xs: 6 }}>
                                <TextField fullWidth disabled value={formData.serviceTypeGroupSequence ?? ""} label="Sequence" variant="outlined" />
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <TextField fullWidth disabled value={formData.number ?? ""} label="WO Number" variant="outlined" />
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <TextField fullWidth disabled value={formData.code ?? ""} label="WO Code" variant="outlined" />
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <TextField fullWidth disabled value={formData.title ?? ""} label="WO Title" variant="outlined" />
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <Autocomplete
                                    disabled
                                    options={suggestions.locations ?? []}
                                    value={suggestions.locations ? suggestions.locations.find((option) => option.ID === formData.locationId) : null}
                                    onChange={(event, newValue) => setFormData({ ...formData, locationId: newValue.ID })}
                                    getOptionLabel={(option) => option.LocationName}
                                    isOptionEqualToValue={(option, value) => option.ID === value.ID}
                                    renderInput={(params) => <TextField {...params} label="Location" variant="outlined"
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                endAdornment:
                                                    <>
                                                        {isLoading.location ? <CircularProgress sx={{ color: "text.primary", marginRight: "10px" }} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                            }
                                        }}
                                    />}
                                />
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        sx={{ width: "100%" }}
                                        disabled
                                        label="Work Order Date"
                                        value={formData.workOrderDate ? dayjs(formData.workOrderDate) : null}
                                        onChange={(newValue) => setFormData({ ...formData, workOrderDate: newValue })}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        sx={{ width: "100%" }}
                                        disabled
                                        label="WO Due Date"
                                        value={formData.dueDate ? dayjs(formData.dueDate) : null}
                                        onChange={(newValue) => setFormData({ ...formData, dueDate: newValue })}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <FormControlLabel control={<CheckBox sx={{ marginX: "10px" }} disabled checked={formData.needConfirmByRequester ?? false} />} label="Need Confirm by Requester" fullWidth sx={{ marginTop: "10px" }} />
                            </Grid>
                            {/**same problem as in workOrderDetails.js, Maintenance Requests is always empty and no api call for the suggestions to be put */}
                            <Grid item size={{ xs: 6 }}>
                                <Autocomplete
                                    disabled
                                    renderInput={(params) => <TextField {...params} label="Maintenance Requests" fullWidth />} />
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <Autocomplete
                                    disabled
                                    options={[formData.assetItemId] ?? []}
                                    getOptionLabel={(option) => option.textField}
                                    value={formData.assetItemId ?? null}
                                    renderInput={(params) => <TextField {...params} label="Asset Items" fullWidth />} />
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <Autocomplete
                                    disabled
                                    options={[formData.serviceTypeGroupId] ?? []}
                                    getOptionLabel={(option) => option.textField}
                                    value={formData.serviceTypeGroupId ?? null}
                                    renderInput={(params) => <TextField {...params} label="Service Type Group" fullWidth />} />
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <Autocomplete
                                    disabled
                                    options={[formData.technicianId] ?? []}
                                    getOptionLabel={(option) => option.textField}
                                    value={formData.technicianId ?? null}
                                    renderInput={(params) => <TextField {...params} label="Assign To Technician" fullWidth />} />
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <Autocomplete
                                    disabled
                                    options={[formData.priorityId] ?? []}
                                    getOptionLabel={(option) => option.textField}
                                    value={formData.priorityId ?? null}
                                    renderInput={(params) => <TextField {...params} label="Priority" fullWidth />} />
                            </Grid>
                            <Grid item size={{ xs: 8 }}>
                                <TextField fullWidth disabled value={formData.remarks ?? ""} label="WO Remarks" variant="outlined" />
                            </Grid>
                            <Grid item size={{ xs: 8 }}>
                                <TextField fullWidth disabled value={formData.serviceTypeGroupNotes ?? ""} label="Service Type Group Notes" variant="outlined" />
                            </Grid>
                            <Grid item size={{ xs: 8 }}>
                                <TextField fullWidth value={formData.technicianNotes ?? ""} label="Technician Notes" variant="outlined" />
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <Autocomplete
                                    disabled
                                    options={suggestions.statuses ?? []}
                                    value={suggestions.statuses ? suggestions.statuses.find((option) => option.ID === formData.statusId) : null}
                                    onChange={(event, newValue) => setFormData({ ...formData, statusId: newValue.ID })}
                                    getOptionLabel={(option) => option.StatusName}
                                    isOptionEqualToValue={(option, value) => option.ID === value.statusId}
                                    renderInput={(params) => <TextField {...params} label="Status" variant="outlined"
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                endAdornment:
                                                    <>
                                                        {isLoading.status ? <CircularProgress sx={{ color: "text.primary", marginRight: "10px" }} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                            }
                                        }}
                                    />}
                                />
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        sx={{ width: "100%" }}
                                        disabled
                                        label="Service Group Complete Date"
                                        value={formData.serviceGroupCompletedDate ? dayjs(formData.serviceGroupCompletedDate) : null}
                                        onChange={(newValue) => setFormData({ ...formData, serviceGroupCompletedDate: newValue })}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        sx={{ width: "100%" }}
                                        disabled
                                        label="Rejected Date"
                                        value={formData.rejectedDate ? dayjs(formData.rejectedDate) : null}
                                        onChange={(newValue) => setFormData({ ...formData, rejectedDate: newValue })}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        sx={{ width: "100%" }}
                                        disabled
                                        label="Accepted Date"
                                        value={formData.acceptedDate ? dayjs(formData.acceptedDate) : null}
                                        onChange={(newValue) => setFormData({ ...formData, acceptedDate: newValue })}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <Typography variant="h6" color="textPrimary">Image Before</Typography>
                                <Box sx={{ position: "relative", gap: 2, width: "100%", minHeight: "200px", bgcolor: "#313439", display: "flex", justifyContent: "center", alignItems: "end", marginTop: "10px", backgroundImage: formData.imageBefore ? `url(${formData.imageBefore})` : "none", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}>
                                    {formData.imageBefore ? null : <Typography variant="h6" sx={{ position: "absolute", bottom: "50%", left: "50%", transform: "translate(-50%, 50%)" }} color="textSecondary">No Image</Typography>}
                                    <Button variant="contained" onClick={() => imageInputBefore.current?.click()}>Upload</Button>
                                    <input ref={imageInputBefore} type="file" style={{ display: "none" }} onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData({ ...formData, imageBefore: reader.result });
                                            }
                                            reader.readAsDataURL(file);
                                        }
                                    }} />
                                    <Button variant="contained" color="error" onClick={() => setFormData({ ...formData, imageBefore: null })}>Remove</Button>
                                </Box>
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                                <Typography variant="h6" color="textPrimary">Image After</Typography>
                                <Box sx={{ position: "relative", gap: 2, width: "100%", minHeight: "200px", bgcolor: "#313439", display: "flex", justifyContent: "center", alignItems: "end", marginTop: "10px", backgroundImage: formData.imageAfter ? `url(${formData.imageAfter})` : "none", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}>
                                    {formData.imageAfter ? null : <Typography variant="h6" sx={{ position: "absolute", bottom: "50%", left: "50%", transform: "translate(-50%, 50%)" }} color="textSecondary">No Image</Typography>}
                                    <Button variant="contained" onClick={() => imageInputAfter.current?.click()}>Upload</Button>
                                    <input ref={imageInputAfter} type="file" style={{ display: "none" }} onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData({ ...formData, imageAfter: reader.result });
                                            }
                                            reader.readAsDataURL(file);
                                        }
                                    }} />
                                    <Button variant="contained" color="error" onClick={() => setFormData({ ...formData, imageAfter: null })}>Remove</Button>
                                </Box>
                            </Grid>
                            <Button variant="contained" onClick={sendData} sx={{ marginTop: "20px" }}>ACCEPT SERVICE</Button>
                            <Button variant="contained" onClick={sendData} sx={{ marginTop: "20px" }}>REJECT SERVICE</Button>
                            <Button variant="contained" onClick={sendData} sx={{ marginTop: "20px" }}>CHECKLIST</Button>
                            <Grid item size={{ xs: 12 }}>
                                <TextField disabled sx={{ width: "100%" }} value={formData.rejectedReason ?? ""} label="Rejected Reason" variant="outlined" />
                            </Grid>
                        </Grid>
                        <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
                            <Button variant="text" onClick={sendData} sx={{ marginTop: "20px" }}>Start</Button>
                            <Button variant="text" onClick={sendData} sx={{ marginTop: "20px" }}>Pause</Button>
                            <Button variant="text" onClick={sendData} sx={{ marginTop: "20px" }}>End</Button>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>
            {/*TODO: make the Technician Services Details table */}
        </Box>
    )
}

export default TechnicianServicesDetails