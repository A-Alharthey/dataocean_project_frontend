import { AppBar, Avatar, Box, Button, Collapse, Container, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Paper, SvgIcon, Toolbar, Typography } from "@mui/material";
import DashboardLayout from "./Components/DashboardLayout"
function Dashboard() {
    return (
        <Box sx={{ height: "100vh", width: "100vw", bgcolor: "#1c2025", display: "flex" }}>
            <DashboardLayout/>
            <Box sx={{ paddingLeft: "256px", paddingTop: "64px", width: "100%", display: "flex", height: "calc(100% - 64px)", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{marginTop:"60px",justifyContent:"center",display:"flex",width: "100%", flexGrow: "1", backgroundImage: "url('/DashBoard_Default.png')", backgroundSize: "Contain", backgroundRepeat: "no-repeat" }}>
                    <Typography variant="h6" color="textPrimary" sx={{ mt: 2 }}>No Dashboards Selected. Kindly Select Your Dashboard Here</Typography>
                </div>
            </Box>
        </Box>
    )
}

export default Dashboard