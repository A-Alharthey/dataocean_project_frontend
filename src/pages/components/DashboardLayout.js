import { AppBar, Avatar, Box, Button, Collapse, Container, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Paper, SvgIcon, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
function DashboardLayout() {
    const [showMoreElement, setShowMoreElement] = useState({})
    //save the id of the element that is clicked in the showMoreElement state and toggle it on click
    function handleShowMore(e) {
        const elementId = e.currentTarget.id
        if (showMoreElement[elementId]) {
            setShowMoreElement(prev => {
                prev[elementId] = false
                return { ...prev }
            })
        } else {
            setShowMoreElement(prev => ({ ...prev, [elementId]: true }))
        }
    }
    return (
        <>
            <AppBar position="fixed" sx={{ borderRadius: "0px", bgcolor: "#1c2025", zIndex: "1300" }}>
                <Toolbar>
                    <a href="/">
                        <img src="/logo.png" />
                    </a>
                    <Box sx={{ flexGrow: "1" }} />
                    <IconButton>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </IconButton>
                    <IconButton>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </IconButton>
                    <IconButton>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" title="Calendar" class=""><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </IconButton>
                    <IconButton>
                        <SvgIcon><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"></path></SvgIcon>
                    </IconButton>
                    <IconButton>
                        <SvgIcon><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path></SvgIcon>
                    </IconButton>
                    <IconButton>
                        <SvgIcon><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></SvgIcon>
                    </IconButton>
                    <IconButton>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </IconButton>
                    <Button type="button">
                        <Avatar variant="circular">
                            <SvgIcon>
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                            </SvgIcon>
                        </Avatar>
                        <Typography sx={{ marginLeft: "8px" }} variant="body2" color="textPrimary">Ahmed</Typography>
                    </Button>
                    <Button type="button">
                        <Avatar variant="circular" src="/Company_Logo.jpg" />
                        <Typography sx={{ marginLeft: "8px" }} variant="body2" color="textPrimary">mnt-test</Typography>
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" variant="permanent" sx={{ "& .MuiDrawer-paper": { bgcolor: "#313439", top: "64px", width: "256px", height: "calc(100% - 64px)" } }}>
                <List>
                    <ListItem>
                        <ListItemButton id="dashboardSettings" selected>
                            <ListItemText primary="Dashboard Settings" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton id="inventoryManagement" onClick={(e) => handleShowMore(e)}>
                            <ListItemText primary="Inventory Management" />
                            {showMoreElement["inventoryManagement"] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={showMoreElement["inventoryManagement"]} timeout="auto">
                        <List sx={{ pl: 4 }}>
                            <ListItemButton id="Settings" onClick={(e) => handleShowMore(e)}>
                                <ListItemText primary="Settings" />
                                {showMoreElement["Settings"] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={showMoreElement["Settings"]} timeout="auto">
                                <List sx={{ pl: 4 }}>
                                    <ListItemButton>
                                        <ListItemText primary="Locations" />
                                    </ListItemButton>
                                    <ListItemButton>
                                        <ListItemText primary="Items" />
                                    </ListItemButton>
                                </List>
                            </Collapse>
                        </List>
                    </Collapse>
                    <ListItem>
                        <ListItemButton id="maintenanceManagement" onClick={(e) => handleShowMore(e)}>
                            <ListItemText primary="Maintenance Management" />
                            {showMoreElement["maintenanceManagement"] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={showMoreElement["maintenanceManagement"]} timeout="auto">
                        <List sx={{ pl: 4 }}>
                            <ListItemButton id="transactions" onClick={(e) => handleShowMore(e)}>
                                <ListItemText primary="Transactions" />
                                {showMoreElement["transactions"] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={showMoreElement["transactions"]} timeout="auto">
                                <List sx={{ pl: 4 }}>
                                    <ListItemButton>
                                        <ListItemText primary="Work Orders" />
                                    </ListItemButton>
                                    <ListItemButton>
                                        <ListItemText primary="Technician Services" />
                                    </ListItemButton>
                                </List>
                            </Collapse>
                        </List>
                    </Collapse>
                </List>
            </Drawer>
        </>
    )
}
export default DashboardLayout