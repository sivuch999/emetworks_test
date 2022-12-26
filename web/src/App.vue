<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import liff from '@line/liff/dist/lib'
import { defineComponent } from 'vue'
import { $axios } from './services/api'
import Poll from './views/Poll.vue'

type Data =  {
    idToken: string | null
  }

export default defineComponent({
  name: 'App',
  components: {
    Poll,
  },
  data () {
    return {
      idToken: ''
    } as Data
  },
  methods: {
    CheckLogin: (decode: any | null = {exp: 0}) => {
      let now = Math.floor(new Date().getTime() / 1000);
      let minute = Math.round((decode.exp - now) / 60);
      if (minute <= 1) {
        liff.logout()
        liff.login({ redirectUri: window.location.pathname })
      }
}
  },

  async mounted() {
    await liff.init({
      liffId: import.meta.env.VITE_LIFF_ID,
      withLoginOnExternalBrowser: true
    });
    
    // if (liff.isLoggedIn()) {
      let decode = await liff.getDecodedIDToken()
      this.CheckLogin(decode)
      const idToken: string | null = liff.getIDToken()
      this.idToken = idToken
      $axios.defaults.headers.common['Authorization'] = `Bearer ${this.idToken}`
    // }
  }

    
})
</script>
