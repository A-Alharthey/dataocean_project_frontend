import logo from './logo.svg';
import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import SignIn from './pages/SignIn';
import { ThemeProvider,createTheme } from '@mui/material';
const router = createBrowserRouter([
  {path:"/",element:<SignIn/>},
  {},
  {}])
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
