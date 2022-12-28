<template>
  <v-card class="w-full mt-5 mx-2" v-for="item in polls" :key="item.id">
    <v-card-text>
      <div>{{ item.code }}: {{ item.question }}</div>
    </v-card-text>
    <v-card-text v-if="item.id" class="text-center">
      <v-btn text color="error accent-4" @click="closePoll(item.id)">
        {{ item.close }}
      </v-btn>
    </v-card-text>
  </v-card>

  <ConfirmDialog ref="Confirm"/>
  <SuccessBar ref="Success"/>

</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { $axios } from "../services/api";
  import ConfirmDialog from "../components/ConfirmDialog.vue";
  import SuccessBar from "../components/SuccessBar.vue";

  type Poll = {
    id: number,
    code: string,
    question: string,
    close: string,
  }
  
  export default defineComponent({
    components: { ConfirmDialog, SuccessBar },
    data() {
      return {
        polls: [],
      } as { polls: Poll[] }
    },
    methods: {
      async getList() {
        const response = await $axios.get('/api/poll/list?isClosed=false')
        if (response.data && response.data.length > 0) {
          this.polls = response.data.map((e: any) => {
            return {
              id: e.id,
              code: e.code,
              question: e.question,
              close: 'ปิดโพล'
            }
          })
        } else {
          this.polls = []
        }
      },
      async closePoll (id: number) {
        const refs: any = this.$refs
        let isOk = await refs.Confirm.show()
        if (isOk) {
          const response = await $axios.patch(`api/poll/close/${id}`,
            { status: 2 }
          )          
          if (response.data) {
            refs.Success.show()
            await this.getList()
          }
        }
      },
    },
    async mounted() {
      await this.getList()
    }
  })
</script>

<style>

</style>
