import { createContext, useState,  useEffect } from "react";
import PropTypes from "prop-types";
import  axios  from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setLoggedInUserName] = useState(null);
  const [id, setId] = useState(null);
  useEffect(() => {
    let token
    if(document.cookie){
      token = document.cookie
      .split('; ')
      .find(row => row.startsWith('AlgoByte='))
      .split('=')[1];
    }
        // console.log(token)
    if (token) {
      axios.get("/user/profile",{
          headers: {
            "Content-Type":'application/json',
            "Authorization": `Bearer ${token}`
          }
        })
        .then((res) => {
          // console.log(res.data)
          setLoggedInUserName(res.data.name);
          setId(res.data._id)
          console.log(res.data.msg)
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ username, id, setLoggedInUserName, setId }}>
      {children}
    </UserContext.Provider>
  );
}

UserContextProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
