import axios from "axios"
import { UserContextProvider } from "./components/Register/UserContext";
import Routes from "./Routes";


function App() {
  axios.defaults.baseURL="https://cyan-concerned-puffer.cyclic.app/";
  return (
    <UserContextProvider>
      <Routes/>
    </UserContextProvider>
  )
}

export default App
