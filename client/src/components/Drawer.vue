<template>
  <div>
<!-- ============================================================================================== -->
<!-- ========================================== App Bar =========================================== -->
<!-- ============================================================================================== -->
    <v-app-bar dense clipped-left color="transparent" app>
      <v-app-bar-nav-icon >
        <v-img max-width="40px" src="Logo.png" alt="SYSTEM"></v-img>
      </v-app-bar-nav-icon>

      <v-spacer></v-spacer>
      <v-icon left>mdi-apps-box</v-icon>
      <v-toolbar-title>
        <a class="red--text disable-select">SYSTEM</a>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <a-popover class="disable-select" title="PERSONAL INFORMATION" placement="leftTop">
        <a-button type="dashed" icon="meh"></a-button>
        <template #content>
          <v-layout>
            <span class="Avatar" style="padding-top:7px;">
              <a-avatar class="disable-select" style="border:1px black solid;" :size="45" shape="square"> ? </a-avatar>
            </span>

            <span class="disable-select" style="padding-left:10px; padding-top:5px; color:black; font-family:arial; font-size:12px; font-weight:bold;">
              <div> Text1 </div>
              <div> Text1 </div>
            </span>
          
            <v-spacer></v-spacer>

            <span class="disable-select" style="padding-left:20px; color:black; font-family:arial; font-size:12px; font-weight:bold;">
              <div>
                <a-tooltip :title="`Change Password (No function)`" placement="left">
                  <a-button type="primary" shape="circle" icon="lock" style="border: 1px black solid;"></a-button>
                </a-tooltip>
              </div>

              <div style="padding-top:5px;">
                <a-tooltip :title="`Log out`" placement="left">
                  <a-button @click="ClickLogOut()" type="danger" shape="circle" icon="poweroff" style="border: 1px black solid;"></a-button>
                </a-tooltip>
              </div>
            </span>
          </v-layout>
        </template>
      </a-popover>

    </v-app-bar>
<!-- ============================================================================================== -->
<!-- ===================================== Navigation Drawer ====================================== -->
<!-- ============================================================================================== -->
    <v-navigation-drawer clipped app expand-on-hover permanent :mini-variant="Drawer" >
      <v-list shaped dense nav>
        <v-list-item v-for="item in PageList" :key="item.title" @click="ChangePage(item.router)">
          <v-list-item-icon>
            <v-icon color="black">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title style="font-size:11px; font-family:arial; color:black; font-weight:bold;">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group v-for="item in DropDownPageList" :key="item.title" v-model="item.active" no-action>
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon color="black">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.title" style="font-size:11px; font-family:arial; color:black; font-weight:bold;"></v-list-item-title>
            </v-list-item-content>
          </template>
          
          <v-list-item v-for="child in item.items" :key="child.title" @click="ChangePage(child.router)">
            <v-list-item-icon>
                <v-icon color="black">{{ child.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="child.title" style="font-size:11px; font-family:arial; color:black; font-weight:bold;"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>

      <template v-slot:append>
        <a-input-number placeholder="Numeric Input" style="width: 100%"></a-input-number>
        <a-input placeholder="Alpha Input" style="width: 100%"></a-input>
      </template>
    </v-navigation-drawer>
  </div>
</template>
<!-- ************************************************************************************************* -->
<!-- ============================================= Script ============================================ -->
<!-- ************************************************************************************************* -->
<script>
//   import axios from "axios"
  export default {
// ************************************************************************************* //
// ===================================== Components ==================================== //
// ************************************************************************************* //
    components:{

    },
// ******************************************************************************* //
// ===================================== Data ==================================== //
// ******************************************************************************* //
    data(){
      return{
        Drawer: true,
      }
    },
// ********************************************************************************** //
// ===================================== Created ==================================== //
// ********************************************************************************** //
    created(){

    },
// *********************************************************************************** //
// ===================================== Computed ==================================== //
// *********************************************************************************** //
    computed:{
      PageList(){
        let data = [
          {
            title: "Main Page",
            icon: "mdi-view-list-outline",
            router: "/main",
            show: true,
          },
          {
            title: "Page 1",
            icon: "mdi-pause-octagon",
            router: "/Page 1",
            show: true,
          },
          {
            title: "Page 2",
            icon: "mdi-pause-octagon",
            router: "/Page 2",
            show: true,
          },
          {
            title: "Page 3",
            icon: "mdi-pause-octagon-outline",
            router: "/Page 3",
            show: false,
          },
        ]
        data = data.filter(rec => {
          return rec.show == true
        })
        return data
      },
      DropDownPageList(){
        let data = [
          {
            title: 'Dropdown List',
            icon: 'mdi-format-list-bulleted',
            show: true,
            items: [
              {
                title: "Dropdown 1",
                icon: "mdi-pause-octagon-outline",
                router: "/Dropdown 1",
              },
              {
                title: "Dropdown 2",
                icon: "mdi-pause-octagon-outline",
                router: "/Dropdown 2",
              },
              {
                title: "Dropdown 3",
                icon: "mdi-pause-octagon-outline",
                router: "/Dropdown 3",
              },
            ],
          },           
        ]
        data = data.filter(rec => {
            return rec.show === true
        })
        return data
      }
    },
// ********************************************************************************** //
// ===================================== Methods ==================================== //
// ********************************************************************************** //
    methods:{
// ============================================================= //
// ===================== Data Load Events ====================== //
// ============================================================= //

// ============================================================= //
// ===================== User Action Events ==================== //
// ============================================================= //
      ChangePage(data){
        if(this.$router.app._route.path != data){
          this.$router.push(data)
        }
      },
      ClickLogOut(){
        let me = this
        me.$confirm({
          title: "Confirm log out?",
          cancelText: "No",
          okText: "Yes",
          content: (<div style="color:black"> You will be redirected to Log In Page. </div>),
          onOk(){ me.ConfirmLogOut() },
          onCancel(){},
        })
      },
      ConfirmLogOut(){
        this.$store.commit("CHANGE_USER", "")
        this.$store.commit("CHANGE_LOGIN", "")
        this.$notification.success({
          style: "background-color:#505050;",
          icon: <a-avatar src="Icon.png"></a-avatar>,
          message: <b style="color:white;">SYSTEM</b>,
          description: <div style="color:white;">Successfully logged out!</div>,
        })
        this.$router.push('/login')
      },
    },
  }
</script>
<!-- ************************************************************************************************* -->
<!-- ============================================= Style ============================================= -->
<!-- ************************************************************************************************* -->
<style>
  .Avatar:hover {
    -ms-transform: scale(3); /* IE 9 */
    -webkit-transform: scale(3); /* Safari 3-8 */
    transform: scale(3); 
  }

  .ant-tooltip-inner{
    font-family: arial;
    font-size: 12px;
    font-weight: bold;
    -webkit-touch-callout: none;
    -webkit-user-select: none;    /* Safari */
    -khtml-user-select: none;     /* Konqueror HTML */
    -moz-user-select: none;       /* Firefox */
    -ms-user-select: none;        /* Internet Explorer/Edge */
    user-select: none;            /* supported by Chrome and Opera */
  }

  .ant-popover-title {
    font-family: arial !important;
    font-size: 15px !important;
    font-weight: bold !important;
    -webkit-touch-callout: none;
    -webkit-user-select: none;    /* Safari */
    -khtml-user-select: none;     /* Konqueror HTML */
    -moz-user-select: none;       /* Firefox */
    -ms-user-select: none;        /* Internet Explorer/Edge */
    user-select: none;            /* supported by Chrome and Opera */
  }

  .ant-modal-title {
    font-family: arial !important;
    font-size: 15px !important;
    font-weight: bold !important;
    -webkit-touch-callout: none;
    -webkit-user-select: none;    /* Safari */
    -khtml-user-select: none;     /* Konqueror HTML */
    -moz-user-select: none;       /* Firefox */
    -ms-user-select: none;        /* Internet Explorer/Edge */
    user-select: none;            /* supported by Chrome and Opera */
  }

  .ant-modal-confirm-body .ant-modal-confirm-title {
    display: block !important;
    overflow: hidden !important;
    color: rgba(0, 0, 0, 0.85) !important;
    font-size: 16px !important;
    line-height: 1.4 !important;
    font-family: arial !important;
    font-weight: bold !important;
    -webkit-touch-callout: none;
    -webkit-user-select: none;    /* Safari */
    -khtml-user-select: none;     /* Konqueror HTML */
    -moz-user-select: none;       /* Firefox */
    -ms-user-select: none;        /* Internet Explorer/Edge */
    user-select: none;            /* supported by Chrome and Opera */
  }

  .ant-modal-confirm-body {
    font-size: 14px !important;
    line-height: 1.5 !important;
    word-wrap: break-word !important;
    font-family: arial !important;
    -webkit-touch-callout: none;
    -webkit-user-select: none;    /* Safari */
    -khtml-user-select: none;     /* Konqueror HTML */
    -moz-user-select: none;       /* Firefox */
    -ms-user-select: none;        /* Internet Explorer/Edge */
    user-select: none;            /* supported by Chrome and Opera */
  }

  .disable-select{
    -webkit-touch-callout: none;
    -webkit-user-select: none;    /* Safari */
    -khtml-user-select: none;     /* Konqueror HTML */
    -moz-user-select: none;       /* Firefox */
    -ms-user-select: none;        /* Internet Explorer/Edge */
    user-select: none;            /* supported by Chrome and Opera */
  }

  .ant-tooltip-inner {
    min-width: 30px;
    min-height: 32px;
    padding: 6px 8px;
    color: #fff;
    text-align: left;
    text-decoration: none;
    word-wrap: break-word;
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    -webkit-touch-callout: none;
    -webkit-user-select: none;    /* Safari */
    -khtml-user-select: none;     /* Konqueror HTML */
    -moz-user-select: none;       /* Firefox */
    -ms-user-select: none;        /* Internet Explorer/Edge */
    user-select: none;            /* supported by Chrome and Opera */
  }
</style>