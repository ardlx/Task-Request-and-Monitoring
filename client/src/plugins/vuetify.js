import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import colors from 'vuetify/lib/util/colors'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

Vue.use(Vuetify)

export default new Vuetify({
icons: {
    iconfont: 'mdi', // default - only for display purposes
},
theme: {
    themes: {
        light: {
            active_list: colors.deepPurple.accent4,
        },
        dark: {
            primary: colors.red.darken1, // #E53935
            secondary: colors.red.lighten4, // #FFCDD2
            accent: colors.indigo.base, // #3F51B5
        }
    },
    },
});
