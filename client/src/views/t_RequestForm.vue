<template>
  <v-main  class="fill-height " >
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col>
        <a-card class="mx-auto"  title="Email Sending" centered style="width:800px">
          <table>
            <tr>
              <td><span class=" mr-1">Kind :</span></td>
                <td>
                  <a-select v-model='formContent.kinds' placeholder="Select Kind" style="width: 200px" >
                  <a-select-option v-for="objKinds in arrKinds" :key="objKinds.KindCode " :value="objKinds.KindCode">
                  {{objKinds.KindName}}</a-select-option></a-select>
                </td>
            </tr>
            <div class="mt-3"></div>
            <tr>
              <td><span  class="mr-1">System Name :</span></td>
              <td>
                <a-select v-model='formContent.systems' placeholder="Select System"  :disabled='formContent.kinds == undefined' style="width: 650px" showSearch :filter-option="filterOption">
                <a-select-option v-for="objSystems in arrSystems" :key="objSystems.SystemCode " :value="objSystems.SystemCode">{{objSystems.SystemName}}</a-select-option>
                </a-select>
              </td>
            </tr>
            <div class="mt-3"></div>
            <tr>
              <td><span class=" mr-1">To :</span></td>
                <td><a-input readOnly ></a-input></td>
            </tr>
            <div class="mt-3"></div>
            <tr>
              <td><span class=" mr-1">Cc :</span> </td>
              <td><a-textarea readOnly ></a-textarea></td>
            </tr>
            <div class="mt-3"></div>
            <tr>
              <td><span class=" mr-1">Subject :</span></td>
              <td><a-input readOnly ></a-input></td>
            </tr>
            <div class="mt-3"></div>
            <tr>
              <td><span class=" mr-1">Attachment(s) :</span></td>
              <td >
                <div >
                <input  @change="fileUpload()" style="display:none" type="file" ref="file" multiple /> <!-- Hidden button for file selection -->
                <a-button  icon="file-add" @click="fileUploadBtn()"> Upload File(s) </a-button>
              </div>
              </td>
            </tr>
          </table>
              <a-list v-model='fileAttachments' v-if="arrAttachments.length !== 0" :data-source="arrAttachments" class="mt-3 mb-2" size="small"  bordered>
                <a-list-item   :id="item.name">
                  <a-list-item-meta>
                    <span slot="title">
                      <v-layout>
                        <v-icon :style="`color:${FileIconColor (item.name)};`"> {{FileIcon(item.name)}} </v-icon>
                        <div  align="center" justify="center"> {{item.name}} </div>
                        <v-spacer></v-spacer>
                        <a-tooltip title="Remove" placement="right">
                          <v-icon style="color:#e04c4c; cursor:pointer;" @click="removeAttachmentBtn(item)"> mdi-delete-outline </v-icon>
                        </a-tooltip>
                      </v-layout>
                    </span>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
          <table>
            <div class="mt-3"></div>
            <tr>  
              <td><span  class="mr-1 ">Requester Name :</span></td>
              <td><a-input v-model='formContent.requesterName'></a-input></td>
              <td><span  class="  ml-3 mr-1">Email :</span></td>
              <td><a-input v-model='formContent.email' style="width: 267px"></a-input></td>
            </tr>
            <div class="mt-3"></div>
            <tr>
              <td><span  class="mr-1">Company :</span></td>
              <td>
                <a-select v-model='formContent.company' @change="GettDepartment()" placeholder="Select Company" style="width: 267px" showSearch :filter-option="filterOption">
                <a-select-option v-for="departmentData in companyListdepartmentDatas" :key="departmentData.CompanyCode " :value="departmentData.CompanyCode"  >{{ departmentData.CompanyName }}</a-select-option>
                </a-select>
              </td>
                <td><span  class="ml-3 mr-1">Department :</span></td>
              <td>
                <a-select v-model='formContent.department' v-if="formContent.company !== 'ICJ' && formContent.company !== 'SRG' && formContent.company !== 'NSG' && formContent.company !== 'USA' && formContent.company !== 'KSK'"   allowClear  @change="GetCompany(),GettDepartment()" placeholder="Select Department" :disabled='formContent.company == undefined' style="width: 267px" showSearch :filter-option="filterOption">
                <a-select-option v-for="departmentData in departmentListdepartmentDatas" :key="departmentData.DepartmentName" :value="departmentData.DepartmentName" >{{ departmentData.DepartmentName }}</a-select-option>
                </a-select>
                <a-input v-model='formContent.department' v-else  allowClear  @change="GetCompany(),GettDepartment()" placeholder="Input Department"   style="width: 267px"></a-input>
              </td>
            </tr>
            <div class="mt-3"></div>
            <tr>
              <td><span  class="mr-1">Request Kind :</span></td>
              <td>
                <a-select v-model='formContent.requestkinds' placeholder="Select Request Kind"  style="width: 267px" showSearch :filter-option="filterOption">
                <a-select-option v-for="objRequestKind in arrRequestKind" :key="objRequestKind.RequestCode" :value="objRequestKind.RequestCode" >{{ objRequestKind.RequestName }}</a-select-option>
                </a-select>
              </td>
                <td v-if="formContent.kinds == 2 && formContent.kinds !== ''"><span class="ml-3 mr-1">OS:</span></td>
              <td  v-if="formContent.kinds == 2 && formContent.kinds !== ''"><a-input  v-model='formContent.operatingsystem' allowClear placeholder="Operating System"   style="width: 267px"></a-input></td>
            </tr>
            <div class="mt-3"></div>
              <tr>
              <td  v-if="formContent.kinds == 2 && formContent.kinds !== ''"><span  class="mr-1">Trouble Start:</span></td>
              <td  v-if="formContent.kinds == 2 && formContent.kinds !== ''"><a-input v-model="formContent.troublestart" allowClear placeholder="24 hrs Format HH:MM:SS"   style="width: 267px"></a-input></td>
              <td  v-if="formContent.kinds == 2 && formContent.kinds !== ''"><span class="ml-3 mr-1">Affected PC:</span></td>
              <td  v-if="formContent.kinds == 2 && formContent.kinds !== ''"><a-input v-model="formContent.affectedpc" allowClear placeholder="Numbers Affected"   style="width: 267px"></a-input></td>
            </tr>
            <table class="mt-3">
            <tr>
              <td><span class=" mr-1">Background :</span></td>
            </tr>
          </table>  
          </table>
            <a-textarea v-model='formContent.background' allow-clear :rows="3" ><div></div></a-textarea>
          <table class="mt-3">
            <tr>
              <td><span class=" mr-1">Details :</span></td>
            </tr>
          </table>  
          <a-textarea v-model='formContent.details' allow-clear :rows="3"><div></div></a-textarea>

          <table class="mt-3">
            <tr>
              <td><span  class=" mr-1">Delivery Date :</span></td>
              <td><a-input v-model='formContent.date' style="width: 245px" :value="`${formatYearMonthDay(new Date())}`"></a-input></td>
              <td><span  class=" ml-3 mr-1">Sender :</span></td>
              <td><a-input v-model='formContent.sender' style="width: 245px"></a-input> </td>
            </tr>
            <div class="mt-3"></div>
            <tr>
              <td><span  class=" mr-1">Estimated Hours/Day :</span></td>
              <td><a-input v-model='formContent.estimatedHours' style="width: 245px" ></a-input></td>
              <td><span  class=" ml-3 mr-1">Reference No. :</span></td>
              <td><a-input v-model='formContent.referenceNo' style="width: 245px" ></a-input></td>
            </tr>
          </table>
          <br/>
          <a-button @click="SendEmail()" style="float:right" type='primary'  ghost>Send Email</a-button>
        </a-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
  // import moment from 'moment' 
  import axios from 'axios'
  export default {

    data(){
      return{
        files: [],
        // company:undefined,
        // department:undefined,
        // systems:undefined,
        // kinds: undefined,
        // requestkinds:undefined,
        // operatingsystem:'',
        // troublestart:'',
        // affectedpc:'',
        fileAttachments:undefined,
        arrKinds:[], 
        arrSystems:[], 
        arrRequestKind:[],
        arrCompanyDB:[],
        arrCompanyAPI:[],
        companyListdepartmentDatas:[],
        departmentListdepartmentDatas:[],
        arrAttachments:[],
        objSystems:{},
        formContent:{},
        listOfDepartment:'http://adminsql1/api/company/department',
        listOfCompanyURL:'http://adminsql1/api/companies',
      }
    },

    created(){
      this.getKinds()
      this.getRequestKind()
      this.getSystems()
      this.GetCompany()
      this.GettDepartment()
    },

    computed:{

    },

    methods: {
    GetCompany(){
      axios.get(`${this.api}/getCompanyDB`).then(res=>{
        this.arrCompanyDB = res.data
        axios.get(this.listOfCompanyURL, {
          headers: {
          'master-api': 'db588403f0a1d3b897442a28724166b4'
          }
        }).then(res=>{
          this.arrCompanyAPI = res.data
          this.companyListdepartmentDatas = this.arrCompanyAPI.concat(this.arrCompanyDB)
          this.companyListdepartmentDatas.filter(Company => {
          if(Company.ShortName !== undefined && Company.ShortName !== null && Company.ShortName !== ""){
              return Company
          }
          })
        })
      })
    },
    GettDepartment(){
      axios.get(`${this.listOfDepartment}/${this.formContent.company}`, {
        headers: {
        'master-api': 'db588403f0a1d3b897442a28724166b4'
        }
        }).then(res=>{
          this.departmentListdepartmentDatas = res.data.filter(Department=>{
            if(Department.DepartmentName !== undefined && Department.DepartmentName !== null && Department.DepartmentName !== "" && Department.DeletedDate == null ){
              return Department
          }
        })
      })
    },
    getKinds(){
      axios.get(`${this.api}/getKinds`).then(res=>{
        this.arrKinds = res.data
      })
    },
    getSystems(){
      axios.get(`${this.api}/getSystems`).then(res=>{
        this.arrSystems = res.data
        console.log(this.arrSystems)
      })
    },
    getRequestKind(){
      axios.get(`${this.api}/getRequestKinds`).then(res=>{
        this.arrRequestKind = res.data
      })
    },
    fileUploadBtn(){
        this.$refs.file.value = null
        this.$refs.file.click()
      },
      fileUpload(){
        let Attachments = this.$refs.file.files

        Attachments.forEach(File => {
          let isExist = false

          this.arrAttachments.forEach(FileToUpload => {
            if(File.name === FileToUpload.name){
              isExist = true
            }
          })

          if(isExist === false){
            this.arrAttachments.push(File)
          }
          else{
            this.$notification.warning({
              message: 'SYSTEM',
              description: <div >File <strong><i>{File.name}</i></strong> is already in the list for uploading</div>,
              duration:7
              })
            }
        })
      },
      removeAttachmentBtn(file){
        let index = this.arrAttachments.indexOf(file)
        this.arrAttachments.splice(index, 1)
      },
      filterOption(input,option){
        return(option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    },
      FileIcon(FileName){
        let filename = FileName.toLowerCase().split(".")
        if(filename[1] === '7z' || filename[1] === 'arj' || filename[1] === 'deb' || filename[1] === 'pkg' || filename[1] === 'rar' || filename[1] === 'rpm' || filename[1] === 'tar' || filename[1] === 'z' || filename[1] === 'zip'){
          return 'mdi-folder-zip'
        }
        else if(filename[1] === 'email' || filename[1] === 'eml' || filename[1] === 'emlx' || filename[1] === 'msg' || filename[1] === 'oft' || filename[1] === 'ost' || filename[1] === 'pst' || filename[1] === 'vcf'){
          return 'mdi-email'
        }
        else if(filename[1] === 'ai' || filename[1] === 'bmp' || filename[1] === 'gif' || filename[1] === 'ico' || filename[1] === 'jpeg' || filename[1] === 'jpg' || filename[1] === 'png' || filename[1] === 'ps' || filename[1] === 'psd' || filename[1] === 'svg' || filename[1] === 'tif' || filename[1] === 'tiff'){
          return 'mdi-image'
        }
        else if(filename[1] === 'ods' || filename[1] === 'xls' || filename[1] === 'xlsm' || filename[1] === 'xlsx'){
          return 'mdi-file-excel'
        }
        else if(filename[1] === 'doc' || filename[1] === 'docx' || filename[1] === 'odt' || filename[1] === 'rtf' || filename[1] === 'tex' || filename[1] === 'txt' || filename[1] === 'wpd'){
          return 'mdi-file-document'
        }
        else if(filename[1] === 'pdf'){
          return 'mdi-file-pdf-box'
        }
        else{
          return 'mdi-file'
        }
      },
      FileIconColor(FileName){
        let filename = FileName.toLowerCase().split(".")
        if(filename[1] === '7z' || filename[1] === 'arj' || filename[1] === 'deb' || filename[1] === 'pkg' || filename[1] === 'rar' || filename[1] === 'rpm' || filename[1] === 'tar' || filename[1] === 'z' || filename[1] === 'zip'){
          return 'purple'
        }
        else if(filename[1] === 'email' || filename[1] === 'eml' || filename[1] === 'emlx' || filename[1] === 'msg' || filename[1] === 'oft' || filename[1] === 'ost' || filename[1] === 'pst' || filename[1] === 'vcf'){
          return 'grey'
        }
        else if(filename[1] === 'ai' || filename[1] === 'bmp' || filename[1] === 'gif' || filename[1] === 'ico' || filename[1] === 'jpeg' || filename[1] === 'jpg' || filename[1] === 'png' || filename[1] === 'ps' || filename[1] === 'psd' || filename[1] === 'svg' || filename[1] === 'tif' || filename[1] === 'tiff'){
          return 'orange'
        }
        else if(filename[1] === 'ods' || filename[1] === 'xls' || filename[1] === 'xlsm' || filename[1] === 'xlsx'){
          return 'green'
        }
        else if(filename[1] === 'doc' || filename[1] === 'docx' || filename[1] === 'odt' || filename[1] === 'rtf' || filename[1] === 'tex' || filename[1] === 'txt' || filename[1] === 'wpd'){
          return 'blue'
        }
        else if(filename[1] === 'pdf'){
          return 'red'
        }
        else{
          return 'black'
        }
      },
      sendEmailTesting(){
        let urls = `${this.api}/sendEmailTesting`
          axios.post(urls).then(res=>{
         console.log(res.data)
      })
      },

      SendEmail(){
        let Data = this.arrSystems.filter(rec=>{ 
          return rec.SystemCode == this.formContent.systems
          })
          if(Data[0].ApproverID == 1){
          console.log('no')
          }  
          if(Data[0].ApproverID == 2){
            console.log('no')
          }
        console.log(this.formContent)
      }
  
    // uploadFile(){
    //   let formData = new FormData()
    //   let myData = {
    //     uploadedBy: 'your name',
    //     uploadedDate: moment().format('YYYY-MM-DD')
    //   }
    //   formData.append('myData', JSON.stringify(myData))
    //   for( var j = 0; j < this.files.length; j++ ){
    //       let file = this.files[j];
    //       formData.append('files[]', file);
    //   }
    //   let url = `${this.api}submitform`
    //   axios.post(url, formData, {
    //       headers: {
    //           'Content-Type': 'multipart/form-data',
    //           dataType: 'json',
    //       }
    //   }).then(res => {
    //     this.files = []
    //     console.log(res.data)
    //   })
    // }
    },
  }
</script>

<style>
  .disable-select{
    user-select: none; /* supported by Chrome and Opera */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
  }
  
  .ant-result-title {
    color: rgba(0, 0, 0, 0.85);
    font-size: 24px;
    line-height: 1.8;
    text-align: center;
    user-select: none; /* supported by Chrome and Opera */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
  }

  .ant-result-subtitle {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 1.6;
    text-align: center;
    user-select: none; /* supported by Chrome and Opera */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
  }
</style>