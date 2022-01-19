<template>
  <div style="margin-top:40px">

    <div class="mx-5" tile>
      <v-row class="mb-2">
        <a-col>
          <div  style="font-size:28px; color:#5b5858" class="mx-3"><strong>KSK Task Monitoring</strong></div>
        </a-col>
        <a-col class="ml-5 mt-1">
          <a-badge :count=" storeUser !== 0  ? filteredForApprovalTable.length : ''">
            <a-button @click="getForApprovalTable()" type="primary">For Approval<a-icon type='bell'></a-icon></a-button>
          </a-badge>
          
        </a-col>
        <a-col class="ml-5  mt-1"> 
          <a-button @click="getApprovedTable()" type="primary">Approved<a-icon type='like'></a-icon></a-button>
        </a-col>
        <a-col class="ml-5  mt-1">
          <a-button @click="getDisapprovedTable()" type="primary" >Disapproved<a-icon type='dislike'></a-icon></a-button>
        </a-col>

      <v-layout class="mx-4">
      <v-spacer></v-spacer>
        <div class="mt-2 style">{{storeUser === 1 || storeUser === 2  ? KSKUserEmployeeName : 'Guest' }}</div>
        <template>
          <a-popover  v-model='blnLogInShow' title="Select Account" trigger='click' placement='leftBottom'>
            <template slot='content'>
              <div style="margin-bottom:10px;">
                <a-select v-model="selectAccount" placeholder="Select Account" class="a-select" style="width:100%" small>
                  <a-icon slot="suffixIcon" type="user" />
                  <a-select-option  v-for="accountObj in accountObj" :key="accountObj.ID " :value="accountObj.ID" suffixIcon type="user" >{{ accountObj.ApproverName }}</a-select-option>
                </a-select>
              </div>

              <div style="margin-bottom:10px;">
                <a-input-password v-model='selecPassword' placeholder="Password">
                  <a-icon slot="prefix" type="lock" />
                </a-input-password>
              </div>
              <div>
                <a-button @click="getJapaneseUsers()" type ='primary' block>Login</a-button>
              </div>
            </template>
          <a-button @click="LoginBtnCls()" v-if="storeUser !== 1 && storeUser !== 2" class="mt-1  ml-3" >Login <a-icon type="user" /></a-button>
          </a-popover>

          <a-popover v-model="blnLogOutShow" title="Welcome " trigger="click" placement='leftBottom'>
            <template slot='content' > 
              <div style="padding:15px">
                <v-row>
                    <a-avatar style="margin-right:5px;margin-top:5px" shape="square" :size="55" :src="`http://adminsql1/photos/jap/${KSKUserEmployeeCode}.jpg`"></a-avatar>
                  <a-col>
                    <div class=" disable-select"> {{KSKUserEmployeeName}}</div>
                    <a-button style="margin-top:10px;" @click="Logout()" type='primary' block>Logout</a-button>
                  </a-col>
                </v-row>
              </div>
            </template>
            <a-button v-if="storeUser === 1 || storeUser === 2" class="mt-1  ml-3" > <a-icon type='setting'></a-icon></a-button>
          </a-popover>
        </template>
      </v-layout>
      </v-row>
      <v-col cols='auto'>
      <v-row  v-if="forApprovalBln === false && disapprovedBln === false"  class="mb-0 ">
        <v-col cols="auto" style="color:#5b5858">
          <div ><strong>Legend:</strong></div>
        </v-col>
        <v-col cols="auto" style=" color:#5b5858" >
          <v-layout>
            <a-avatar class="mr-3" shape="square" size="small" :style="{ backgroundColor: 'red', verticalAlign: 'middle', }"></a-avatar>
            - Cancelled Task
          </v-layout>
        </v-col>
        <v-col cols="auto" style=" color:#5b5858">
          <v-layout>
            <a-avatar class="mr-3" shape="square" size="small" :style="{ backgroundColor: 'green', verticalAlign: 'middle', }"></a-avatar>
            - Finished Task
          </v-layout>
        </v-col>
      </v-row>
      </v-col>
    </div>

<!-- Table for Approved Requests -------->

    <v-card  v-if="forApprovalBln === false && disapprovedBln === false" class="mx-5"  outlined>
      <v-row>
        <v-col>
          <div style="font-size:16px; color:#5b5858;padding:15px"><strong>Approved Tasks</strong></div>
        </v-col>
        <v-col>
          <v-layout>
            <v-spacer></v-spacer>
            <a-input-search v-model='searchforapproved' placeholder="Search" enter-button style="width: 400px;padding:15px" />
          </v-layout>
        </v-col>
      </v-row>
      <div class="pl-3 pr-3">
        <div>
          <a-spin :spinning="spinBln" tip="Loading...">
            <a-table 
              :columns="approvedColumn" :data-source="filteredApprovedTable" 
              :rowClassName="(record, index) => (record.StatusCode === 4 ? 'red' : record.StatusCode === 3 ? 'green' : null)" 
              :scroll="{ y: 520, x:400 }" size='small' height='500' bordered
              class="headerFont">
              <template  slot="action" slot-scope="item">
                <a @click="openViewModal(item)">View</a>
              </template>
            </a-table>
          </a-spin>
        </div>
      </div>
    </v-card>

<!-- Table for Approval Requests -->

    <v-card v-if="forApprovalBln === true" class="mx-5"  outlined>
      <v-row>
        <v-col>
          <div style="font-size:16px; color:#5b5858;padding:15px"><strong>For Approval Tasks</strong></div>
        </v-col>
        <v-col>
          <v-layout>
            <v-spacer></v-spacer>
            <a-input-search v-model='searchforapproval' placeholder="Search" enter-button style="width: 400px;padding:15px" />
          </v-layout>
        </v-col>
      </v-row>
      <div class="pa-3">

        <div>
          <a-spin :spinning="spinBln" tip="Loading...">
            <a-table 
              :columns="storeUser == 0 ? forGuestApprovalColumn : forApprovalColumn"  
              :data-source="filteredForApprovalTable" 
              :scroll="{ y: 520, x:400 }" size='small' height='=1000' bordered >
              <template v-slot:approve ><a>Approve</a></template>
              <template v-slot:disapprove><a>Disapprove</a></template>
            </a-table>
          </a-spin>
        </div>
      </div>
    </v-card>

<!-- Table for Disapproved Requests -->

    <v-card v-if="disapprovedBln === true" class="mx-5"  outlined>
      <v-row>
        <v-col>
          <div style="font-size:16px; color:#5b5858;padding:15px"><strong>Disapproved Tasks</strong></div>
        </v-col>
        <v-col>
          <v-layout>
            <v-spacer></v-spacer>
            <a-input-search v-model='searchfordisapproved' placeholder="Search" enter-button style="width: 400px;padding:15px" />
          </v-layout>
        </v-col>
      </v-row>
      <div class="pa-3">
        <div>
          <a-spin :spinning="spinBln" tip="Loading...">
            <a-table 
            :columns="disapprovedColumn"  :data-source=" filteredDisapprovedTable" 
            :scroll="{ y: 520, x:400 }" size='small' height='=1000' bordered ></a-table>
          </a-spin>
        </div>
      </div>
    </v-card>

  <!-- View Modal -->
 
  <a-modal v-model="visible" :title="modalItems.RequestNo" centered width='85%' :maskClosable="false" :footer="null">
    <a-card class="MyCard1" :bordered='false' >
      <a-row >
        <a-card-grid  style="width: 100%;padding: 8px; "  :hoverable="false">
          <span ><b>System Name:</b></span>
          <br/> 
          <span>{{modalItems.SystemName !== "" && modalItems.SystemName != null  ? modalItems.SystemName : "None"}}</span>
        </a-card-grid>
      </a-row>
      <a-row>
    <a-card-grid style="width: 25%;padding: 8px; " :hoverable="false">
      <span ><b>Kind:</b></span>
      <br/>
      <span>{{modalItems.KindName !== "" && modalItems.KindName != null  ? modalItems.KindName : "None"}}</span>
    </a-card-grid>
    <a-card-grid style="width: 25%; padding: 8px; " :hoverable="false" >
      <span><b>Request No:</b></span>
      <br/>
      <span>{{modalItems.RequestNo !== "" && modalItems.RequestNo != null  ? modalItems.RequestNo : "None"}}</span>
    </a-card-grid>
    <a-card-grid style="width: 25%; padding: 8px; " :hoverable="false">
      <span ><b>Request Type:</b></span>
      <br/>
    <span>{{modalItems.RequestName !== "" && modalItems.RequestName != null  ? modalItems.RequestName : "None"}}</span>
    </a-card-grid>
    <a-card-grid style="width: 25%; padding: 8px; " :hoverable="false">
      <span><b>Status Type:</b></span>
      <br/>
      <span>{{modalItems.StatusName !== "" && modalItems.StatusName != null  ? modalItems.StatusName : "None"}}</span>
    </a-card-grid>
    </a-row>
    <a-row>
      <a-card-grid style="width: 25%;padding: 8px; " :hoverable="false">
          <span ><b>Company:</b></span>
          <br/>
          <span>{{modalItems.AbbreviationName !== "" && modalItems.AbbreviationName != null  ? modalItems.AbbreviationName : "None"}}</span>
        </a-card-grid>
        <a-card-grid style="width: 25%; padding: 8px; " :hoverable="false" >
          <span><b>Department:</b></span>
          <br/>
          <span>{{modalItems.Department !== "" && modalItems.Department != null  ? modalItems.Department : "None"}}</span>
        </a-card-grid>
        <a-card-grid style="width: 25%; padding: 8px; " :hoverable="false">
          <span ><b>Requester Name:</b></span>
          <br/>
          <span>{{modalItems.Requester !== "" && modalItems.Requester != null  ? modalItems.Requester : "None"}}</span>
        </a-card-grid>
        <a-card-grid style="width: 25%; padding: 8px; " :hoverable="false">
          <span ><b>Email:</b></span>
          <br/>
          <span>{{modalItems.Email !== "" && modalItems.Email !== ""   ? modalItems.Email : "None"}}</span>
        </a-card-grid>
      </a-row>
    <a-row>
   <a-card-grid style="width: 100%;padding: 8px; " :hoverable="false">
      <span ><b>Details:</b></span>
      <br/>
      <span>{{modalItems.DetailOfRequest !== "" && modalItems.DetailOfRequest != null  ? modalItems.DetailOfRequest : "None"}}</span>
    </a-card-grid>
    </a-row>
    <a-row>
    <a-card-grid style="width: 100%; padding: 8px; " :hoverable="false" >
      <span ><b>Background:</b></span>
      <br/>
      <span>{{modalItems.Background !== "" && modalItems.Background != null  ? modalItems.Background : "None"}}</span>
    </a-card-grid>
  </a-row>
   <a-row>
    <a-card-grid style="width: 100%; padding: 8px; " :hoverable="false">
      <span ><b>Attachment/s:</b></span>
      <br/>
      <div >
        <span >{{modalItems.Attachments !== "" && modalItems.Attachments != null  ? modalItems.Attachments : "None"}}</span>
      </div>
    </a-card-grid>
  </a-row>
  <a-row>
   <a-card-grid style="width: 33%;padding: 8px; " :hoverable="false">
      <span ><b>In-Charged:</b></span>
      <br/>
      <span>{{modalItems.KindName !== "" && modalItems.KindName != null  ? modalItems.KindName : "None"}}</span>
    </a-card-grid>
    <a-card-grid style="width: 34%; padding: 8px; " :hoverable="false" >
      <span><b>PMS Reference:</b></span>
      <br/>
      <span>{{modalItems.RequestNo !== "" && modalItems.RequestNo != null  ? modalItems.RequestNo : "None"}}</span>
    </a-card-grid>
    <a-card-grid style="width: 33%; padding: 8px; " :hoverable="false">
      <span><b>Date Requested:</b></span>
      <br/>
      <span>{{modalItems.RequestNo !== "" && modalItems.RequestNo != null  ? modalItems.RequestNo : "None"}}</span>
    </a-card-grid>
  </a-row>
  <a-row>
   <a-card-grid style="width: 18%;padding: 8px; " :hoverable="false">
      <span ><b>Due Date:</b></span>
      <br/>
      <span>{{modalItems.FormattedDueDate !== "" && modalItems.FormattedDueDate != null  ? modalItems.FormattedDueDate : "None"}}</span>
    </a-card-grid>
    <a-card-grid style="width: 18%; padding: 8px; " :hoverable="false" >
      <span><b>Estimated Hours:</b></span>
      <br/>
      <span>{{modalItems.EstimatedHours !== "" && modalItems.EstimatedHours != null  ? modalItems.EstimatedHours : "None"}}</span>
    </a-card-grid>
    <a-card-grid style="width: 18%; padding: 8px; " :hoverable="false">
      <span><b>Finished Date:</b></span>
      <br/>
      <span>{{modalItems.FinishedDate !== "" && modalItems.FinishedDate != null  ? modalItems.FinishedDate : "None"}}</span>
    </a-card-grid>
     <a-card-grid style="width: 18%; padding: 8px; " :hoverable="false">
      <span><b>Completion Hours:</b></span>
      <br/>
      <span>{{modalItems.CompletionHours !== ""  && modalItems.CompletionHours != null  ? modalItems.CompletionHours : "None"}}</span>
    </a-card-grid>
     <a-card-grid style="width: 28%; padding: 8px; " :hoverable="false">
      <span><b>Send by:</b></span>
      <br/>
      <span>{{modalItems.RegisteredBy !== "" && modalItems.RegisteredBy != null  ? modalItems.RegisteredBy : "None"}}</span>
    </a-card-grid>
  </a-row>
  
  </a-card>
  </a-modal>

  </div>
</template>

<script>
  import moment from 'moment'
  import store from '@/store'
  import axios from "axios"
  export default {
    data(){
      return{
        approvedColumn: [
          { title: 'Date Request', width: 115, dataIndex: 'FormattedRequestDate', key: 'FormattedRequestDate', fixed: 'left', },
          { title: 'Kind', width: 100, dataIndex: 'KindName', key: 'KindName', fixed: 'left' },
          { title: 'Request No.', width: 120, dataIndex: 'RequestNo', key: 'RequestNo', fixed: 'left' },
          { title: 'System Name', width: 150, dataIndex:   'SystemName', key: 'SystemName', fixed: 'left' },
          { title: 'Company', width: 100, dataIndex: 'CompanyName', key: 'CompanyName' },
          { title: 'Department', width: 150, dataIndex: 'Department', key: 'Department' },
          { title: 'Requester', width: 150, dataIndex: 'Requester', key: 'Requester' },
          { title: 'Request Type', width: 130, dataIndex: 'RequestName', key: 'RequestName' },
          { title: 'Background', width: 250, dataIndex: 'Background', key: 'Background' },
          { title: 'Detail of Request', width: 450, dataIndex: 'DetailOfRequest', key: 'DetailOfRequest' },
          { title: 'Attachment', width: 200, dataIndex: 'Attachments', key: 'Attachments', scopedSlots: { customRender: 'Attachments' }, },
          { title: 'Due Date', width: 90, dataIndex: 'FormattedDueDate', key: 'FormattedDueDate' },
          { title: 'Estimated Hours', width: 140, dataIndex: 'EstimatedHours', key: 'EstimatedHours' },
          { title: 'Completion Hours', width: 150, dataIndex: 'CompletionHours', key: 'CompletionHours' },
          { title: 'Action', width: 70, key: 'action', fixed: 'right', align:'center', scopedSlots: { customRender: 'action' }, },
        ],
        forApprovalColumn : [
          { title: 'Date Request', width: 115, dataIndex: 'FormattedRequestDate', key: 'FormattedRequestDate', fixed: 'left', },
          { title: 'Kind', width: 100, dataIndex: 'KindName', key: 'KindName', fixed: 'left' },
          { title: 'System Name', width: 150, dataIndex:   'SystemName', key: 'SystemName', fixed: 'left' },
          { title: 'Company', width: 100, dataIndex: 'CompanyName', key: 'CompanyName' },
          { title: 'Department', width: 150, dataIndex: 'Department', key: 'Department' },
          { title: 'Requester', width: 150, dataIndex: 'Requester', key: 'Requester' },
          { title: 'Request Type', width: 130, dataIndex: 'RequestName', key: 'RequestName' },
          { title: 'Background', width: 250, dataIndex: 'Background', key: 'Background' },
          { title: 'Detail of Request', width: 450, dataIndex: 'DetailOfRequest', key: 'DetailOfRequest' },
          { title: 'Attachment', width: 200, dataIndex: 'Attachments', key: 'Attachments' },
          { title: 'Due Date', width: 90, dataIndex: 'FormattedDueDate', key: 'FormattedDueDate' },
          { title: 'Estimated Hours', width: 140, dataIndex: 'EstimatedHours', key: 'EstimatedHours' },
          { title: 'Approve' , width: 80,  key: 'approve', fixed: 'right', scopedSlots: { customRender: 'approve' }, },
          { title: 'Disapprove', width: 100,  key: 'disapprove', fixed: 'right', scopedSlots: { customRender: 'disapprove' }, },
        ],
        forGuestApprovalColumn : [
          { title: 'Date Request', width: 115, dataIndex: 'FormattedRequestDate', key: 'FormattedRequestDate', fixed: 'left', },
          { title: 'Kind', width: 100, dataIndex: 'KindName', key: 'KindName', fixed: 'left' },
          { title: 'System Name', width: 150, dataIndex:   'SystemName', key: 'SystemName', fixed: 'left' },
          { title: 'Company', width: 100, dataIndex: 'CompanyName', key: 'CompanyName' },
          { title: 'Department', width: 150, dataIndex: 'Department', key: 'Department' },
          { title: 'Requester', width: 150, dataIndex: 'Requester', key: 'Requester' },
          { title: 'Request Type', width: 130, dataIndex: 'RequestName', key: 'RequestName' },
          { title: 'Background', width: 250, dataIndex: 'Background', key: 'Background' },
          { title: 'Detail of Request', width: 450, dataIndex: 'DetailOfRequest', key: 'DetailOfRequest' },
          { title: 'Attachment', width: 200, dataIndex: 'Attachments', key: 'Attachments' },
          { title: 'Due Date', width: 90, dataIndex: 'FormattedDueDate', key: 'FormattedDueDate' },
          { title: 'Estimated Hours', width: 140, dataIndex: 'EstimatedHours', key: 'EstimatedHours' },
        ],
        disapprovedColumn : [
          { title: 'Date Request', width: 115, dataIndex: 'FormattedRequestDate', key: 'FormattedRequestDate', fixed: 'left', },
          { title: 'Kind', width: 100, dataIndex: 'KindName', key: 'KindName', fixed: 'left' },
          { title: 'System Name', width: 150, dataIndex:   'SystemName', key: 'SystemName', fixed: 'left' },
          { title: 'Company', width: 100, dataIndex: 'CompanyName', key: 'CompanyName' },
          { title: 'Department', width: 150, dataIndex: 'Department', key: 'Department' },
          { title: 'Requester', width: 150, dataIndex: 'Requester', key: 'Requester' },
          { title: 'Request Type', width: 130, dataIndex: 'RequestName', key: 'RequestName' },
          { title: 'Background', width: 250, dataIndex: 'Background', key: 'Background' },
          { title: 'Detail of Request', width: 450, dataIndex: 'DetailOfRequest', key: 'DetailOfRequest' },
          { title: 'Attachment', width: 200, dataIndex: 'Attachments', key: 'Attachments' },
          { title: 'Due Date', width: 90, dataIndex: 'FormattedDueDate', key: 'FormattedDueDate' },
          { title: 'Estimated Hours', width: 140, dataIndex: 'EstimatedHours', key: 'EstimatedHours' },
        ],
        requestnumber:'',
        selecPassword: undefined,
        selectAccount: undefined,
        spinBln:false,
        blnLogInShow: false,
        blnLogOutShow: false,
        forApprovalBln:false,
        disapprovedBln:false,
        visible: false,
        forApprovalTitleCondition:false,
        storeUser: 0,
        searchforapproved:'',
        searchforapproval:'',
        searchfordisapproved:'',
        modalItems:{},
        loginInfos: {},
        accountDetailsObj:{},
        approvedTableItems:[],
        forApprovalTableItems:[],
        disapprovedTableItems:[],
        accountObj: [],
        KSKUserInfoObj:{},
        KSKUserEmployeeCode:'',
        KSKUserEmployeeName:'',
        listOfCompanyURL:'http://adminsql1/api/companies',
      }
    },
    created() {
      this.storeUser = store.state.ksk_userInfo
      this.getJapaneseUsers()
      this.GetCompany()
      this.getJapaneseID()
      // this.getGuestTable()
    },
    computed: {
      filteredApprovedTable(){
        let data = this.approvedTableItems

        if(this.storeUser != undefined && this.storeUser != null && this.storeUser != 0){
          data = data.filter(rec => {
            return rec.ID == this.storeUser
          })
        }

        if(this.searchforapproved != undefined && this.searchforapproved != null && this.searchforapproved != ""){
          data = data.filter(rec => {

            let RequestNo = rec.RequestNo !== undefined || rec.RequestNo !== null || rec.RequestNo !== "" ? rec.RequestNo.toUpperCase() : ""
            let SystemName = rec.SystemName !== undefined || rec.SystemName !== null || rec.SystemName !== "" ? rec.SystemName.toUpperCase() : ""
            let KindName = rec.KindName !== undefined || rec.KindName !== null || rec.KindName !== "" ? rec.KindName.toUpperCase() : ""
            let Department = rec.Department !== undefined || rec.Department !== null || rec.Department !== "" ? rec.Department.toUpperCase() : ""
            let RequestName = rec.RequestName !== undefined || rec.RequestName !== null || rec.RequestName !== "" ? rec.RequestName.toUpperCase() : ""
            let CompanyName = rec.CompanyName !== undefined || rec.CompanyName !== null || rec.CompanyName !== "" ? rec.CompanyName.toUpperCase() : ""
            let Requester = rec.Requester !== undefined || rec.Requester !== null || rec.Requester !== "" ? rec.Requester.toUpperCase() : ""

            return  RequestNo.includes(this.searchforapproved.toUpperCase()) || 
                    SystemName.includes(this.searchforapproved.toUpperCase()) ||
                    KindName.includes(this.searchforapproved.toUpperCase()) ||
                    Department.includes(this.searchforapproved.toUpperCase()) ||
                    RequestName.includes(this.searchforapproved.toUpperCase()) ||
                    CompanyName.includes(this.searchforapproved.toUpperCase()) ||
                    Requester.includes(this.searchforapproved.toUpperCase()) ||
                    rec.FormattedRequestDate.includes(this.searchforapproved) 

            // return rec.RequestName === undefined || rec.RequestName === null || rec.RequestName === ""
          })
        }

        return data
      },
      filteredForApprovalTable(){
        let data = this.forApprovalTableItems

        if(this.storeUser != undefined && this.storeUser != null && this.storeUser != 0){
          data = data.filter(rec => {
            return rec.ID == this.storeUser
          })
        }

        if(this.searchforapproval != undefined && this.searchforapproval != null && this.searchforapproval != ""){
          data = data.filter(rec => {

            let SystemName = rec.SystemName !== undefined || rec.SystemName !== null || rec.SystemName !== "" ? rec.SystemName.toUpperCase() : ""
            let KindName = rec.KindName !== undefined || rec.KindName !== null || rec.KindName !== "" ? rec.KindName.toUpperCase() : ""
            let Department = rec.Department !== undefined || rec.Department !== null || rec.Department !== "" ? rec.Department.toUpperCase() : ""
            let RequestName = rec.RequestName !== undefined || rec.RequestName !== null || rec.RequestName !== "" ? rec.RequestName.toUpperCase() : ""
            let CompanyName = rec.CompanyName !== undefined || rec.CompanyName !== null || rec.CompanyName !== "" ? rec.CompanyName.toUpperCase() : ""
            let Requester = rec.Requester !== undefined || rec.Requester !== null || rec.Requester !== "" ? rec.Requester.toUpperCase() : ""


            return  rec.FormattedDueDate.includes(this.searchforapproval)  ||
                    SystemName.includes(this.searchforapproval.toUpperCase()) || 
                    rec.FormattedRequestDate.includes(this.searchforapproval) || 
                    KindName.includes(this.searchforapproval.toUpperCase())  ||
                    Department.includes(this.searchforapproval.toUpperCase())  ||
                    RequestName.includes(this.searchforapproval.toUpperCase()) ||
                    CompanyName.includes(this.searchforapproval.toUpperCase())  ||
                    Requester.includes(this.searchforapproval.toUpperCase())
          })
        }

        return data
      },
      filteredDisapprovedTable(){
        let data = this.disapprovedTableItems
        if(this.storeUser != undefined && this.storeUser != null && this.storeUser != 0){
          data = data.filter(rec => {
            return rec.ID == this.storeUser
          })
        }

        if(this.searchfordisapproved != undefined && this.searchfordisapproved != null && this.searchfordisapproved != ""){
          data = data.filter(rec => {

            let SystemName = rec.SystemName !== undefined || rec.SystemName !== null || rec.SystemName !== "" ? rec.SystemName.toUpperCase() : ""
            let KindName = rec.KindName !== undefined || rec.KindName !== null || rec.KindName !== "" ? rec.KindName.toUpperCase() : ""
            let Department = rec.Department !== undefined || rec.Department !== null || rec.Department !== "" ? rec.Department.toUpperCase() : ""
            let RequestName = rec.RequestName !== undefined || rec.RequestName !== null || rec.RequestName !== "" ? rec.RequestName.toUpperCase() : ""
            let CompanyName = rec.CompanyName !== undefined || rec.CompanyName !== null || rec.CompanyName !== "" ? rec.CompanyName.toUpperCase() : ""
            let Requester = rec.Requester !== undefined || rec.Requester !== null || rec.Requester !== "" ? rec.Requester.toUpperCase() : ""


            return  SystemName.includes(this.searchfordisapproved.toUpperCase()) || 
                    rec.FormattedRequestDate.includes(this.searchfordisapproved) || 
                    KindName.includes(this.searchfordisapproved.toUpperCase()) ||
                    Department.includes(this.searchfordisapproved.toUpperCase()) ||
                    RequestName.includes(this.searchfordisapproved.toUpperCase()) ||
                    CompanyName.includes(this.searchfordisapproved.toUpperCase()) ||
                    Requester.includes(this.searchfordisapproved.toUpperCase())
          })
        }
        return data
      },
    },
    methods: {
    GetCompany(){
      axios.get(`${this.api}/getCompanyDB`).then(res=>{
        let arrCompanyDB = res.data
        axios.get(this.listOfCompanyURL, {
          headers: {
          'master-api': 'db588403f0a1d3b897442a28724166b4'
          }
        }).then(res=>{
          this.arrCompanyAPI = res.data
          this.companyListdepartmentDatas = this.arrCompanyAPI.concat(arrCompanyDB)
          this.companyListdepartmentDatas.filter(Company => {
            if(Company.ShortName !== undefined && Company.ShortName !== null && Company.ShortName !== ""){
                return Company
            }
          })
          this.LoadData()
        })
      })
    },
      GetCompanyName(CompanyCode){
        let CompanyData = this.companyListdepartmentDatas.find(Company => {
          return Company.CompanyCode === CompanyCode
        })
        if(CompanyData !== undefined){
          return CompanyData.ShortName
        }
        else{
          return ""
        }
      },

      getJapaneseUsers(){
        axios.get(`${this.api}/getJapaneseUsers`).then((res)=>{
          this.accountObj = res.data.filter(users =>{
            if(users.ApproverName !== undefined && users.ApproverName !== null && users.ApproverName !== '' )
              return users
          })
        })
        // getInfo
        let UserID = 0
        if(this.storeUser === undefined || this.storeUser === null || this.storeUser === 0){
          UserID = this.selectAccount

        }
        else{
          UserID = this.storeUser
        }

        axios.get(`${this.api}/LogInSelect/${UserID}`).then(res=>{
          this.loginInfos = res.data[0]
              
          if(this.selectAccount){ this.onLogin() } 
        }) 
      },
      getJapaneseID(){
        axios.get(`${this.api}/getUserInfo`).then(res=>{
              res.data.filter(rec=>{
                return rec.ID === this.storeUser
              }).map(rec1=>{
                this.KSKUserEmployeeCode = rec1.EmployeeCode
                this.KSKUserEmployeeName = rec1.ApproverName
              })
            })
      },
      LoadData(){
         // getApprovedTable
          this.spinBln = true
          axios.get(`${this.api}/getApprovedTable`).then((res)=>{
            let tempApprovedData = res.data
            let AttachmentsFromFolder = ''
            tempApprovedData.forEach(Data => {
              Data.Attachments = ''
              Data.FormattedRequestDate = moment(Data.RequestDate).format('YYYY/MM/DD')
              Data.FormattedDueDate = moment(Data.DueDate).format('YYYY/MM/DD')
              axios.get(`${this.api}/getFileAttachments/${Data.RequestNo}`).then(res => {
                AttachmentsFromFolder = res.data
                AttachmentsFromFolder.forEach(Attachment => {
                  if(Data.Attachments === []){
                    Data.Attachments = '・' + Attachment.fileName
                  }
                  else{
                    Data.Attachments = Data.Attachments+ "\n• " + Attachment.fileName
                  }
                }) 
              })
              Data.CompanyName = this.GetCompanyName(Data.CompanyCode)  
            })
            this.approvedTableItems = tempApprovedData
            this.spinBln = false
          })

         // getDisapprovedTable
          axios.get(`${this.api}/getDisapprovedTable`).then((res)=>{
          let tempDisapprovedData = res.data
          let AttachmentsFromFolder = ''
          tempDisapprovedData.forEach(Data => {
            Data.Attachments = ''
            Data.FormattedRequestDate = moment(Data.RequestDate).format('YYYY/MM/DD')
            Data.FormattedDueDate = moment(Data.DueDate).format('YYYY/MM/DD')
            axios.get(`${this.api}/getFileAttachmentsTemporary/${Data.TemporaryNo}`).then(res => {
                AttachmentsFromFolder = res.data
                AttachmentsFromFolder.forEach(Attachment => {
                  if(Data.Attachments === []){
                    Data.Attachments = '・' + Attachment.fileName
                  }
                  else{
                    Data.Attachments = Data.Attachments+ "\n• " + Attachment.fileName
                  }
                }) 
              Data.CompanyName = this.GetCompanyName(Data.CompanyCode) 
              })
          })
          this.disapprovedTableItems = tempDisapprovedData
        })

        // getForApprovalTable

          axios.get(`${this.api}/getForApprovalTable`).then((res)=>{
          let tempApprovalData = res.data
          let AttachmentsFromFolder = ''
          tempApprovalData.forEach(Data => {
            Data.Attachments = ''
            Data.FormattedRequestDate = moment(Data.RequestDate).format('YYYY/MM/DD')
            Data.FormattedDueDate = moment(Data.DueDate).format('YYYY/MM/DD')
            axios.get(`${this.api}/getFileAttachmentsTemporary/${Data.TemporaryNo}`).then(res => {
                AttachmentsFromFolder = res.data
                AttachmentsFromFolder.forEach(Attachment => {
                  if(Data.Attachments === []){
                    Data.Attachments = '・' + Attachment.fileName
                  }
                  else{
                    Data.Attachments = Data.Attachments+ "\n• " + Attachment.fileName
                  }
                }) 
              Data.CompanyName = this.GetCompanyName(Data.CompanyCode) 
              })
          })
          this.forApprovalTableItems = tempApprovalData
          this.spinBln = false
        })
        
      },

      getApprovedTable(){
      this.forApprovalBln=false
        this.disapprovedBln=false
      },
      getForApprovalTable(){
        this.forApprovalBln = true
        this.disapprovedBln = false
      },
      getDisapprovedTable(){
        this.disapprovedBln=true
        this.forApprovalBln=false
      },
      LoginBtnCls(){
        this.selecPassword = ''
        this.selectAccount = undefined
      },
      openViewModal(item){
        this.modalItems = item
        this.visible = true
      },
      onLogin() {
        if(this.selecPassword !== this.loginInfos.Password ){
          alert('Incorrect Password')
          this.selecPassword = ''
        }else{
          this.storeUser = this.loginInfos.ID
          store.commit('CHANGE_USER_INFO', this.loginInfos.ID) 
          this.blnLogInShow = false
          this.getJapaneseID()
          this.getApprovedTable()
          this.$notification.success({message: 'SYSTEM',description: 'Successfully Logged in',})
          } 
          // let Avatar = `http://adminsql1/photos/jap/${this.KSKUserEmployeeCode}.jpg`
          //   this.$notification.open({
          //     style: "background-color:#afafaf;",
          //     icon: <a-avatar src={Avatar}></a-avatar>,
          //     message: 'SYSTEM',
          //     description: <div >Welcome {this.KSKUserEmployeeName}!</div>,
          //   })
        },
      Logout(){
        this.getJapaneseID()
        this.blnLogOutShow = false
        this.storeUser = 0
        store.commit('CHANGE_USER_INFO', 0) 
        this.getApprovedTable()
        this.$notification.success({message: 'SYSTEM',description: 'Successfully Logged out',})
      },
    },
  }
</script>
<style>
  #MyBorder{
    border: 2px solid #e0e0e0;
    margin-right:65%;
  }
  .style{
    color:#5b5858;
  }
  .columns{
    font-weight: bold;
  }
  .MyCard1{
      max-height: 650px;
      overflow-x: auto;
      overflow-y: auto;
      margin:0 auto;
  }
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
  th {
    font-weight:bold !important;
    color:#5b5858 !important;
    
  }
</style>