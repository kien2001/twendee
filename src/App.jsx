import React, { useState, useEffect } from 'react'
import './App.css';

function App() {
  /* A hook that allows us to get data from api in a functional component. */
  const [userData, setUserData] = useState();
  /* A hook that allows us to create data in template with every 10 users in a functional component. format: [Object1:{order: 1, groupUser: "10 users"}, Object1:{order: 2, groupUser: "10 users next"},...] */
  const [userList, setUserList] = useState();
  /* A hook that allows us to create table user with 10 rows in a functional component. format: [Object1:{id: 1, user: user1}, Object2:{id: 2, user: user2}] */
  const [userTable, setUserTable] = useState();
  // check asc sort
  const [isAsc, setIsAsc] = useState(false);
  // length pagination
  const [paginationArr, setPaginationArr] = useState()
  // sort function
  const sortName = (field) => {
    // sort fullname according to alphabet
    if (field === "fullname") {
      // asc
      if (!isAsc) {
        setIsAsc((prev) => !prev);
        setUserTable((prev) => {
          prev.sort(function (a, b) {
            if (a.user.name.first.charAt(0) > b.user.name.first.charAt(0)) {
              return 1;
            }
            if (a.user.name.first.charAt(0) < b.user.name.first.charAt(0)) {
              return -1;
            }
            return 0;
          });

          return [...prev];
        });
        // desc
      } else {
        setIsAsc((prev) => !prev);
        setUserTable((prev) => {
          prev.sort(function (a, b) {
            if (a.user.name.first.charAt(0) > b.user.name.first.charAt(0)) {
              return -1;
            }
            if (a.user.name.first.charAt(0) < b.user.name.first.charAt(0)) {
              return 1;
            }
            return 0;
          });

          return [...prev];
        });
      }
       // sort username according to alphabet
    } else if (field === "username") {
      // asc
      if (!isAsc) {
        setIsAsc((prev) => !prev);
        setUserTable((prev) => {
          prev.sort(function (a, b) {
            if (a.user.login.username.charAt(0) > b.user.login.username.charAt(0)) {
              return 1;
            }
            if (a.user.login.username.charAt(0) < b.user.login.username.charAt(0)) {
              return -1;
            }
            return 0;
          });

          return [...prev];
        });
        // desc
      } else {
        setIsAsc((prev) => !prev);
        setUserTable((prev) => {
          prev.sort(function (a, b) {
            if (a.user.login.username.charAt(0) > b.user.login.username.charAt(0)) {
              return -1;
            }
            if (a.user.login.username.charAt(0) < b.user.login.username.charAt(0)) {
              return 1;
            }
            return 0;
          });

          return [...prev];
        });
      }
    }
  };
  /**
    Event Click for pagination to set userTable when choose pagination
   */
  const handleClick = (e) => {
    if (userList.length !== 0) {
      const order = +e.target.innerHTML - 1;
      setUserTable(userList[order].groupUser)
      console.log(userList[order].groupUser);
    }
    document.querySelectorAll(".active")[0].classList.remove("active");
    e.target.classList.add("active")
  }
  /* This is a function that gets data from api and set data to userData. */
  useEffect(() => {
    fetch("https://randomuser.me/api/?results=100")
      .then(result => {
        return result.json();
      })
      .then(data => {
        setUserData(data.results)
        return data.results
      })
      .then(data => {
        // handle pagination
        let count = 1;
        const paginationLength = data.length % 10 === 0 ? Math.floor((data.length) / 10) : Math.floor((data.length) / 10) + 1
        const arr = Array(paginationLength).fill().map(() => {
          return count++;
        })
        setPaginationArr(arr)

        const paginationElement = document.querySelectorAll(".pagination span")
        if (paginationElement.length > 0) {
          paginationElement[0].classList.add("active")
        }
      })
  }, [])
  // handle data table
  useEffect(() => {
    if (userData) {
      let listUser = []; // save list user 
      let subArrUser = []; // save user, if equal 10, push into listUser then reset
      // create
      for (let i = 0; i < userData.length; i++) {
        subArrUser.push({ id: i, user: userData[i] }) // save every 10 row into an arr
        if (subArrUser.length === 10) {
          listUser.push({ order: Math.floor(subArrUser[0].id / 10) + 1, groupUser: subArrUser }) // save every ten-row arr into an arr
          subArrUser = [] // reset arr
        }
      }
      // if userData do not divide into ten-row table
      if (subArrUser.length !== 0) {
        listUser.push({ order: Math.floor(subArrUser[0].id / 10) + 1, groupUser: subArrUser })
      }
      console.log(listUser);
      setUserList(listUser) // set user list
      setUserTable(listUser[0].groupUser) // set default data table
    }
  }, [userData])
  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th onClick={() => sortName("fullname")}>Full name</th>
            <th onClick={() => sortName("username")}>Username</th>
          </tr>
        </thead>
        <tbody>
          {
            userTable?.map((item, index) => {
              return (
                <tr key={index}>
                  <td><img src={item.user.picture.thumbnail} alt="thumbnail" /></td>
                  <td>{`${item.user.name.title}.${item.user.name.first} ${item.user.name.last}`}</td>
                  <td>{item.user.login.username}</td>
                </tr>
              )
            }
            )
          }
        </tbody>
      </table>
      <div className='pagination'>
        {paginationArr?.map((item, index) => {
          return <span key={index} onClick={handleClick}>{item}</span>
        })}
      </div>
    </div>
  );
}

export default App;
