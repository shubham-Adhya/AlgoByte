import axios from "axios"
import { UserContextProvider } from "./components/Register/UserContext";
import Routes from "./Routes";


function App() {
  axios.defaults.baseURL="http://localhost:8080/";
  return (
    <UserContextProvider>
      <Routes/>
    </UserContextProvider>
  )
}

export default App
