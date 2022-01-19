const express = require('express')



// ======================================== REQUEST
// const port = 5003;
// ======================================== 

// ======================================== MONITORING
const port = 1011;
// ======================================== 



const router = require('./routes/controller.js')
const app = express()

app.use('/api', router)
 
app.listen(port,function(){
	console.log('listening to port ' + port);
})