import logo from './logo.svg';
import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import SignIn from './pages/SignIn';
import { ThemeProvider,createTheme } from '@mui/material';
import Dashboard from './pages/Dashboard';
import TechnicianServices from './pages/TechnicianServices';
import WorkOrder from './pages/WorkOrder';
import WorkOrderDetails from './pages/WorkOrderDetails';
const router = createBrowserRouter([
  {path:"/",element:<SignIn/>},
  {path:"/dashboard",element:<Dashboard/>},
  {path:"/transactions/workorder", element:<WorkOrder/>},
  {path:"/transactions/technicianservices", element:<TechnicianServices/>},
  {path:"/transactions/workorder/:id", element:<WorkOrderDetails/>,loader:()=>({editMode:true})},
  {path:"/transactions/workorder/new", element:<WorkOrderDetails />,loader:()=>({editMode:false})},
])
const theme = createTheme({
  palette:{
    mode:"dark",
    primary:{
      main:"#8a85ff"
    }
  }
})
function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router}/>
    </ThemeProvider>
  );
}

export default App;
