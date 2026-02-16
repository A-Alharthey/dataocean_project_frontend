import { AppBar, Avatar, Box, Button, Collapse, Container, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Paper, SvgIcon, Toolbar, Typography } from "@mui/material";
import DashboardLayout from "./Components/DashboardLayout"
function TechnicianServices() {
    return (
        <Box sx={{ height: "100vh", width: "100vw", bgcolor: "#1c2025", display: "flex" }}>
            <DashboardLayout/>
            <Box sx={{ paddingLeft: "256px", paddingTop: "64px", width: "100%", display: "flex", height: "calc(100% - 64px)", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="h6" color="textPrimary" sx={{ mt: 2 }}>Technician Services Page is under construction. Kindly Select Your Dashboard Here</Typography>
            </Box>
        </Box>
    )
}

export default TechnicianServices