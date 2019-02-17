import uuidv1 from "uuid/v1";

export function requestContent(path, type, filter, isAuthCallBack, forbidenCallBack) {
  for (const key in filter) filter[key] += "";

  const body = {
    integerList: null,
    data: { filter: filter }
  };
  request(path, type, body, isAuthCallBack, forbidenCallBack);
};

export function requestDeleteContent(path, credentialId, isAuthCallBack, forbidenCallBack) {
  credentialId = credentialId.map(val => parseInt(val, 10));

  const body = {
    integerList: credentialId,
    data: null
  };
  request(path, "delete", body, isAuthCallBack, forbidenCallBack);
};

export function requestInsertOrUpdateCredential(path, type, credential, isAuthCallBack, forbidenCallBack) {
  for (const key in credential) credential[key] += "";

  const body = {
    integerList: null,
    data: { credential: credential }
  };
  request(path, type, body, isAuthCallBack, forbidenCallBack);
};

export function requestPeriods(credentialId, callBack) {

  const body = {
    integerList: [credentialId],
    data: null
  };
  request("home", "periods", body, callBack);
};

export function loginRequest(user, pass, callBack) {

  fetch("/getawr/rest/edit/in?arg1=" + user + "&arg2=" + pass, {
    method: "post",   
  }).then(callBack);
};

export function logoutRequest(callBack) {

  fetch("/getawr/rest/edit/out", {
    method: "post",   
  }).then(callBack);
};

function request(path, type, body, isAuthCallBack, forbidenCallBack) {
  fetch("/getawr/rest/" + path, {
    method: "post",
    headers: new Headers({ "content-type": "application/json;charset=UTF-8" }),
    body: JSON.stringify({
      id: uuidv1().toString(),
      time: Date.UTC(),
      type: type,
      body: { ...body }
    })
  }).then(function(response) {
    if (response.status !== 403) 
      response.json().then(isAuthCallBack); 
    else if (!(forbidenCallBack === undefined || forbidenCallBack === null))
      forbidenCallBack(response);    
  });
};

// function requestPublic(path, type, body, callBack) {
//   fetch("/getawr/rest/" + path, {
//     method: "post",
//     headers: new Headers({ "content-type": "application/json;charset=UTF-8" }),
//     body: JSON.stringify({
//       id: uuidv1().toString(),
//       time: Date.UTC(),
//       type: type,
//       body: { ...body }
//     })
//   }).then(function(response) {
//     response.json().then(callBack);
//   });
// };
