const axios = require('axios')

const getMessege =async (res) =>{
    axios
    .get("http://localhost:5000/getMessege")
    .then((res) => {
      console.log(res);
      setMessegeData(res);
    })
    .catch((err) => {
      console.log(err);
    });
    const setMessegeData = async (res) => {
    let messege = res.data.map((item) => {
      return ({
         username:item.username,
         messege:item.messege
        }
      );
    });
    console.log(messege)
    return messege
}
}

module.exports= getMessege;