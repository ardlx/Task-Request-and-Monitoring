const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const fs = require('fs')
const multer = require('multer')
const nodemailer = require('nodemailer')

const bodyParser = require('body-parser')
const cors = require('cors')
const mssql = require('mssql')

dotenv.config()
router.use(cors())

router.use(express.json({limit:'200mb'}));
router.use(express.urlencoded({limit:'200mb',extended: true}))


const KSKTaskRequestAndMonitoring = {
    user    : process.env.VUE_APP_MSSQL_USERNAME,
    password: process.env.VUE_APP_MSSQL_PASSWORD,
    server  : process.env.VUE_APP_MSSQL_SERVER,
    database: process.env.VUE_APP_MSSQL_DATABASE,
    options : { abortTransactionOnError: true, enableArithAbort: true, encrypt: false, },
};

// ================================================================================ //
// ==================================== routes ==================================== //
// ================================================================================ //
let storage  = multer.diskStorage({ 
    destination:function ( req, file, cb ) {
        var dir = `//HV12-HRD41/D/Deployment/LOAAttachments/LOA_${req.headers.directoryno}`
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }　
        cb(null, dir)
    },
    filename: function ( req, file, cb ) {
        cb(null, file.originalname)
    }
})
 
let upload = multer({storage: storage});
 
router.post('/UploadAttachment', upload.array("files[]"), (req, res) => {
    res.send('ok')
})
router.get('/getUserInfo', (req,res) => {
    let sql = `EXECUTE dbo.KSKUserInfo `

    mssql.connect(KSKTaskRequestAndMonitoring, function(error) {
        if (error) {
            console.log('getUserInfo Error', error);
        }
        var request = new mssql.Request();
        request.query(sql, function (error, recordset) {
            if (error){ 
                console.log('getUserInfo Query Error', error)
            } else{
                res.send(recordset.recordsets[0])
            }
        })
    })
    // mssql.close()
})  

router.get('/getJapaneseUsers', (req,res) => {
    let sql = `SELECT *FROM	T_ApproverAccounts`

    mssql.connect(KSKTaskRequestAndMonitoring, function(error) {
        if (error) {
            console.log('getJapaneseUsers Error', error);
        }
        var request = new mssql.Request();
        request.query(sql, function (error, recordset) {
            if (error){ 
                console.log('getJapaneseUsers Query Error', error)
            } else{
                res.send(recordset.recordsets[0])
            }
        })
    })
    // mssql.close()
}) 

router.get('/getApprovedTable', (req,res) => {
    let sql = `EXECUTE dbo.KSKApprovedTable`

    mssql.connect(KSKTaskRequestAndMonitoring, function(error) {
        if (error) {
            console.log('getApprovedTable Error', error);
        }
        var request = new mssql.Request();
        request.query(sql, function (error, recordset) {
            if (error){ 
                console.log('getApprovedTable Query Error', error)
            } else{
                res.send(recordset.recordsets[0])
            }
        })
    })
    // mssql.close()
})

router.get('/getForApprovalTable', (req,res) => {
    let sql = `EXECUTE dbo.KSKForApprovalTable`

    mssql.connect(KSKTaskRequestAndMonitoring, function(error) {
        if (error) {
            console.log('getForApprovalTable Error', error);
        }
        var request = new mssql.Request();
        request.query(sql, function (error, recordset) {
            if (error){ 
                console.log('getForApprovalTable Query Error', error)
            } else{
                res.send(recordset.recordsets[0])
            }
        })
    })
    // mssql.close()
})

router.get('/getDisapprovedTable', (req,res) => {
    let sql = `EXECUTE dbo.KSKForDisapprovedTable`

    mssql.connect(KSKTaskRequestAndMonitoring, function(error) {
        if (error) {
            console.log('getDisapprovedTable Error', error);
        }
        var request = new mssql.Request();
        request.query(sql, function (error, recordset) {
            if (error){ 
                console.log('getDisapprovedTable Query Error', error)
            } else{
                res.send(recordset.recordsets[0])
            }
        })
    })
    // mssql.close()
})

// router.get('/LogInSelect/:ID', (req,res) => {
//     let sqlQuery = `SELECT	* FROM	T_ApproverAccounts	WHERE	ID = ${req.params.ID}`
//     mssql.connect( KSKTaskRequestAndMonitoring, function(error) {
//         if(!error){
//             var request = new mssql.Request();
//             request.query( sqlQuery, (err, data ) => {
//                 if(!err) {
//                 res.send(data.recordset);
//                 } else{
//                     console.log(err) 
//                     res.json({message: err})
//                 }
//             })
//         }
//         else{
//             console.log(error)
//             res.json({message: error })
//         }
//     })
// })

router.get('/LogInSelect/:ID', (req,res) => {
    let sql = `SELECT   * FROM	T_ApproverAccounts	WHERE	ID = ${req.params.ID}`

    mssql.connect(KSKTaskRequestAndMonitoring, function(error) {
        if (error) {
            console.log('LogInSelect Error', error);
        }
        var request = new mssql.Request();
        request.query(sql, function (error, recordset) {
            if (error){ 
                console.log('LogInSelect Query Error', error)
            } else{
                res.send(recordset.recordsets[0])
            }
        })
    })
    // mssql.close()
})

router.get('/getKinds', (req,res) => {
    let sql = `SELECT * FROM M_Kinds
                WHERE DeletedDate IS NULL`

    mssql.connect(KSKTaskRequestAndMonitoring, function(error) {
        if (error) {
            console.log('GetKinds Error', error);
        }
        var request = new mssql.Request();
        request.query(sql, function (error, recordset) {
            if (error){ 
                console.log('GetKinds Query Error', error)
            } else{
                res.send(recordset.recordsets[0])
            }
        })
    })
    // mssql.close()
})

router.get('/getRequestKinds', (req,res) => {
    let sql = `SELECT * FROM M_Requests
                WHERE DeletedDate IS NULL`

    mssql.connect(KSKTaskRequestAndMonitoring, function(error) {
        if (error) {
            console.log('GetRequestKind Error', error);
        }
        var request = new mssql.Request();
        request.query(sql, function (error, recordset) {
            if (error){ 
                console.log('GetRequestKind Query Error', error)
            } else{
                res.send(recordset.recordsets[0])
            }
        })
    })
    // mssql.close()
})


router.get('/getSystems', (req,res) => {
    let sql = `SELECT * FROM M_KSKSystems
                WHERE DeletedDate IS NULL`

    mssql.connect(KSKTaskRequestAndMonitoring, function(error) {
        if (error) {
            console.log('GetSystems Error', error);
        }
        var request = new mssql.Request();
        request.query(sql, function (error, recordset) {
            if (error){ 
                console.log('GetSystems Query Error', error)
            } else{
                res.send(recordset.recordsets[0])
            }
        })
    })
    // mssql.close()
})

router.get('/getCompanyDB', (req,res) => {
    let sql = `SELECT * FROM M_Companies
                WHERE DeletedDate IS NULL`

    mssql.connect(KSKTaskRequestAndMonitoring, function(error) {
        if (error) {
            console.log('GetCompanyDB Error', error);
        }
        var request = new mssql.Request();
        request.query(sql, function (error, recordset) {
            if (error){ 
                console.log('GetCompanyDB Query Error', error)
            } else{
                res.send(recordset.recordsets[0])
            }
        })
    })
    // mssql.close()
})
// For Attachments Approved

router.get('/getFileAttachments/:RequestNo', (req, res) => {
    let fileList = []
    let dir = `//hrdapps9/KSK_TaskMonitoring/${req.params.RequestNo}`
    if(!fs.existsSync(dir)){
        res.json([])
    } else {
        const files = fs.readdirSync(dir)
        for (const file of files) {
            fileList.push({fileName: file})
        }
        res.json(fileList)
    }
    
})

// For Attachments Dissapproved

router.get('/getFileAttachmentsTemporary/:TemporaryNo', (req, res) => {
    let fileList = []
    let dir = `//hrdapps9/KSK_TaskMonitoring/ForApprovals/${req.params.TemporaryNo}`
    if(!fs.existsSync(dir)){
        res.json([])
    } else {
        const files = fs.readdirSync(dir)
        for (const file of files) {
            fileList.push({fileName: file})
        }
        res.json(fileList)
    }
    
})


// Email Sending
router.post('/sendEmailTesting',(req,res)=>{
    let myAttach = []
    
    // Get the all Attachment selected
    if(req.body.selectedAttach !== undefined){
    req.body.selectedAttach.map(r=>{
        if(r.oPath !== undefined){
        myAttach.push({filename:r.details, path:r.oPath})
        }
    })
    }
    const transporter = nodemailer.createTransport({
    host: 'HRDSMTP',
    port: 25,
    use_authentication: false,
    tls: {
        rejectUnauthorized: false
    }
});
    let mailOptions = {
    from: `ardel0294@gmail.com`,
    // to: 'sd1test@hrd-s.com',
    to: `ardel0294@gmail.com`,
    cc : `smd_isd@hrd-s.com`, 
    subject: `Testing`,
    text:`
    test.
    `,
    attachments : myAttach
    };
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        res.end("Error Message");
    } else {
        res.end("Message Sent");
    }
    }); 
})

//Save to database (Email Form)

router.post('/saveImailForm',(req,res)=>{
    let Data = req.body
    let sql = `INSERT  INTO    T_RequestForApproval
                (
                    TemporaryNo,
                    EmailStatusCode,
                    SystemCode,
                    KindCode,
                    RequestCode,
                    StatusCode,
                    CompanyCode,
                    Department,
                    SystemName,
                    Requester,
                    Background,
                    DetailOfRequest,
                    RMSReference,
                    EstimatedHours,
                    RequestDate,
                    DueDate,
                    AffectedPC,
                    OperatingSystem,
                    TroubleStartTime,
                    CreatedDate,
                    RegisteredBy
                )
                Values
                (
                    'temporaryNo',
                    2,
                    ${Data.systems},
                    ${Data.kinds},
                    ${Data.requestkinds},
                    1,
                    '${Data.company}',
                    '${Data.department}',
                    'systemname',
                    '${Data.requesterName}',
                    '${Data.background}',
                    '${Data.details}',
                    'rmsreference',
                    '${Data.estimatedHours}',
                    ${Data.date},
                    'duedate',
                    ${Data.affectedpc},
                    '${Data.operatingsystem}',
                    '${Data.troublestart}',
                    GETDATE(),
                    '${Data.sender}'
                )`

        mssql.connect(KSKTaskRequestAndMonitoring, function(error) {
            if (error) {
                console.log('GetSystems Error', error);
            }
            var request = new mssql.Request();
            request.query(sql, function (error, recordset) {
            if (error){ 
                console.log('GetSystems Query Error', error)
            } else{
            res.send(recordset.recordsets[0])
            }
        })
    })
        // mssql.close()
})

  

module.exports = router;