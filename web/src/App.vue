<template>
  <v-app>
    <router-view v-if="idToken" />
  </v-app>
</template>

<script lang="ts">
import liff from '@line/liff/dist/lib'
import { defineComponent } from 'vue'
import { $axios } from './services/api'
import Poll from './views/Poll.vue'
import LIFFInspectorPlugin from '@line/liff-inspector';


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
    CheckLogin: (decode: any | null = {exp: 0}, groupId: string) => {
      console.log('CheckLogin');

      let now = Math.floor(new Date().getTime() / 1000)
      let minute = Math.round((decode.exp - now) / 60)
      console.log(minute)
      
      if (minute <= 1) {
        console.log(true)
        liff.logout()
        liff.login({ redirectUri: `${import.meta.env.VITE_LIFF_ENDPOINT}/${window.location.pathname}${groupId ? `?groupId=${groupId}` : '' }` }) 
      }
}
  },

  async mounted() {
    await liff.init({
      liffId: import.meta.env.VITE_LIFF_ID,
      // withLoginOnExternalBrowser: true
    });
    liff.ready.then(() => {
      const params: any = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop: any) => searchParams.get(prop),
      });
      const groupId = params.groupId

      if (liff.isLoggedIn()) {
        try {
          let decode = liff.getDecodedIDToken()
          this.CheckLogin(decode, groupId)
          const idToken: string | null = liff.getIDToken()
          $axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`
          this.idToken = idToken
        } catch (error) {
          console.log('error', error)
        }
      } else {
        liff.login({ redirectUri: `${import.meta.env.VITE_LIFF_ENDPOINT}/${window.location.pathname}${groupId ? `?groupId=${groupId}` : '' }` }) 
      }
    })

  }

    
})
</script>
