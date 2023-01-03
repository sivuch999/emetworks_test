<template>
  <v-card class="w-full mt-5 mx-2" v-for="item in polls" :key="item.id">
    <v-card-text>
      <div> กลุ่ม {{ item.groupName }}: {{ item.question }}</div>
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
    groupName: string,
    question: string,
    close: string,
  }
  
  export default defineComponent({
    components: { ConfirmDialog, SuccessBar },
    data() {
      return {
        groupId: '',
        polls: [],
      } as { groupId: string, polls: Poll[] }
    },
    methods: {
      async getList() {
        const response = await $axios.get(`/poll/list?isClosed=false${this.groupId != '' ? `&groupId=${this.groupId}` : ''}`)
        if (response.data && response.data.length > 0) {
          this.polls = response.data.map((e: any) => {
            return {
              id: e.id,
              code: e.code,
              question: e.question,
              groupName: e.groupName,
              close: 'ปิดโพล'
            }
          })
        } else {
          this.polls = []
        }
      },
      async closePoll (id: number) {
        const refs: any = this.$refs
        let ok = await refs.Confirm.show()
        if (ok) {
          const response = await $axios.patch(`/poll/close/${id}`, { status: 2 })          
          if (response.data) {
            refs.Success.show()
            await this.getList()
          }
        }
      },
    },
    async mounted() {
      let groupId: any = this.$route.query.groupId
      this.groupId = groupId ?? ''
      await this.getList()
    }
  })
</script>

<style>

</style>
