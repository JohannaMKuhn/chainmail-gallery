fetch('http://localhost:4200/apis', {
    method:'post',
    headers: {'Content-Type': 'application/json'},
    body:JSON.stringify({name: 'gary', email:'goober@gary.com', message: 'just a goober', subject: 'did it work', website:''})
}).then(response => response.json()).then(data =>  {console.log(data)})