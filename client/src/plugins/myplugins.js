import { mapState, mapMutations } from 'vuex'
import CryptoJS from 'crypto-js'
import moment from 'moment'
// import axios from "axios"
// import moment from "moment"
const myPlugins = {
    install(Vue){
        Vue.mixin({
// ******************************************************************************* //
// ===================================== Data ==================================== //
// ******************************************************************************* //
            data:() => ({
                api: process.env.VUE_APP_URL,
            }),
// *********************************************************************************** //
// ===================================== Computed ==================================== //
// *********************************************************************************** //
            computed:{
                ...mapState([
                    'ksk_user',
                ]),
            },
// ********************************************************************************** //
// ===================================== Created ==================================== //
// ********************************************************************************** //
            created(){
                this.$notification.config({ placement: "bottomRight", duration: 4 })
            },
// ******************************************************************************* //
// =================================== Methods =================================== //
// ******************************************************************************* //
            methods:{             
                ...mapMutations([
                    'CHANGE_USER',
                ]),
                DecryptText(text){
                    var bytes  = CryptoJS.AES.decrypt(text, process.env.VUE_APP_SECRETKEY )
                    var originalText = bytes.toString(CryptoJS.enc.Utf8)
                    return originalText
                },
                formatYearMonthDay( date ){
                    return moment(date).format("YYYY-MM-DD")
                },
            }
        })
    }
}

export default myPlugins