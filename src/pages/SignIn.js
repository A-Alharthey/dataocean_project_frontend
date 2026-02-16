import { Box, Container, Paper, Card, CardContent, CardMedia, Typography, TextField, Alert, Avatar, SvgIcon, Button, Divider, Link, useTheme} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
function SignIn() {
  const theme = useTheme()
  const matches= useMediaQuery(theme.breakpoints.up("md"))
  const navigate = useNavigate()
  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const [errors,setErrors]=useState({username:"",password:""})
  const [isLoading,setIsLoading] = useState(false)
  function handleSignIn(e){
    if (checkError(e)){
      return
    }
    const config = {
      method:"POST",
      body:JSON.stringify({username,password}),
      headers:{
        "Content-Type":"application/json",
        "Accept":"application/json"
      }
    }
    setIsLoading(true)
    fetch("http://92.205.234.30:7071/api/Login",config).then((res)=>res.json()).then((data)=>{
      window.localStorage.setItem("token",data.token)
      navigate("/dashboard")
    }).catch((e)=>alert("something went wrong!")).finally(()=>setIsLoading(false))

  }
  function checkError(e){
    const elementName= e.target.id
    const temp = {...errors}
    let isError = false
    if (elementName === "username" || elementName === "submit"){
      if(username.trim() === ""){
        temp.username = "username is required"
        isError=true
      }
      else temp.username = ""
    }
    if (elementName === "password" || elementName === "submit"){
      if(password.trim() === ""){
        temp.password = "password is required"
        isError=true
      }
      else temp.password = ""
    }
    setErrors(temp)
    return isError
  }
  return (
    <>
    <Box sx={{ bgcolor: "#1c2025", height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
      <Paper elevation={1} sx={{ position: "relative", bgcolor: "#1c2025", maxWidth: "md", flexGrow: "1", marginX: "24px" }}>
        <Avatar sx={{ position: "absolute", color: "#fff", bgcolor: "#4caf50", width: "64px", height: "64px", borderRadius: "4px", top: "-32px", left: "24px" }} variant='circular' >
          <SvgIcon fontSize='large'>
            <path d='M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z' />
          </SvgIcon>
        </Avatar>
        <Card sx={{ bgcolor: "transparent", display: "flex", flexDirection: "row" }} >
          <CardContent sx={{ flex: "1", display: "flex", flexDirection: "column", margin: "10px", flexBasis: "50%" }}>
            <Typography variant={"h4"} sx={{ fontFamily: "Roboto, Helvetica, Arial, sans-serif", color: "#e6e5e8", marginY: "20px" }} >Sign In</Typography>
            <Paper sx={{ marginBottom: "20px" }}>
              <Alert severity='info'>Use yor user name and password to access DataOcean cloud ERP</Alert>
            </Paper>
            <TextField onChange={e=>setUsername(e.target.value)} id="username" label="User Name" variant='outlined' color='primary' sx={{ marginBottom: "20px" }} helperText={errors.username} error={Boolean(errors.username)} onBlur={(e)=>checkError(e)}></TextField>
            <TextField onChange={e=>setPassword(e.target.value)} id="password" label="Password" variant='outlined' color='primary' type='password' onBlur={(e)=>checkError(e)} helperText={errors.password} error={Boolean(errors.password)}></TextField>
            <Button onClick={(e)=>handleSignIn(e)} id="submit" variant='contained' size='large' sx={{ marginY: "20px", fontSize: "0.9375rem", fontFamily: "Roboto, Helvetica, Arial, sans-serif", }} loading={isLoading}>LOG IN</Button>
            <Divider />
            <Typography color='primary' sx={{ marginTop: "20px" }}>
              <Link underline='hover' href='/forgetpassword'>Forget Password</Link>
            </Typography>
          </CardContent>
          { matches && <CardMedia image='/auth.png' sx={{ flexGrow: "1", flexBasis: "50%" }} />}
        </Card>
      </Paper>
    </Box>
    </>
  );
}

export default SignIn;
