<template>
  <div id="app" class="container">

    <v-card v-if="!groupId" class="w-full mt-5 mx-2" v-for="item in members" :key="item.groupId">
      <v-card-text class="text-center">
        <v-btn text color="info accent-4" @click="$router.push(`/poll?groupId=${item.groupId}`)">
          กลุ่ม {{ item.groupName }}
        </v-btn>
      </v-card-text>
    </v-card>

    <div v-if="groupId">
      <v-label>โปรดระบุรายละเอียด Poll</v-label>
      {{ groupId }}
      <v-form class="form-poll-component" ref="form" v-model="valid" lazy-validation>
        <v-container class="mb-6">
          <v-row>
            <v-col cols="12">
              <v-text-field
                variant="outlined"
                v-model="question"
                :rules="questionRules"
                label="คำถาม"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="anwser-wrapper" v-for="(value, index) in pollList" :key="index" no-gutters>
            <v-col cols="10">
              <v-text-field
                variant="outlined"
                v-model="value.answer"
                :counter="30"
                :rules="[...answerRules, formDuplicateValidation]"
                label="ตัวเลือก"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn @click="removeAnswer(index)">
                <v-icon
                  dark
                  right
                >
                  mdi-close-circle
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-btn @click="addAnswer">เพิ่มตัวเลือก</v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-btn @click="submit" color="success">
                <v-progress-circular
                  v-if="progressBtnSubmit"
                  indeterminate
                  color="green"
                ></v-progress-circular>
                <div v-if="!progressBtnSubmit">ยืนยัน</div>
              </v-btn>
            </v-col>
          </v-row>

        </v-container>
      </v-form>
    </div>
   

  <SuccessBar ref="Success"/>
  <WarningBar ref="Warning"/>

  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import SuccessBar from "../components/SuccessBar.vue";
  import WarningBar from "../components/WarningBar.vue";
  import { $axios } from "../services/api";

  type Member = {
    groupId: number,
    groupName: string,
  }

  export default defineComponent({
    components: { SuccessBar, WarningBar },
    data() {
      return {
        groupId: '',
        progressBtnSubmit: false,
        alertRef: this.$refs,
        valid: true,
        answerRules: [
          (v: any) => !!v || 'กรุณาระบุตัวเลือกคำตอบ',
          (v: string | any[]) => (v && v.length <= 30) || 'คำตอบสูงสุด 30 ตัวอักษร',
        ],
        questionRules: [
          (v: any) => !!v || 'กรุณาระบุคำถาม',
        ],
        members: [],
        question: '',
        pollList: [
          {
            answer: ''
          }
        ],
        submitData: {}
      } as {
        groupId: string,
        progressBtnSubmit: boolean,
        alertRef: any,
        valid: boolean,
        answerRules: any[],
        questionRules: any[],
        members: Member[],
        question: string,
        pollList: any[],
        submitData: any
      }
    },
    methods : {
      formDuplicateValidation(value: any) {
        let counter = 0
        this.pollList.forEach((e: any) => {
          counter += (e.answer.trim() == value.trim()) ? 1 : 0
        })
        return counter >= 2 ? 'มีคำตอบที่ซ้ำกันกรุณาตรวจสอบ' : true
      },
      watchQueryString(query: any) {
        this.groupId = query.groupId
      },
      async getMemberList() {
        const response = await $axios.get(`/member/group`)
        if (response.data && response.data.length > 0) {
          this.members = response.data.map((e: any) => {
            return {
              groupId: e.groupId,
              groupName: e.groupName,
            }
          })
        } else {
          this.members = []
        }
      },
      addAnswer() {
        const refs: any = this.$refs
        if (this.pollList.length <= 10) {
          this.pollList.push({
            answer: '',
          })
        } else {
          refs.Warning.show('จำนวนตัวเลือกสูงสุด 10')
        }
      },
      removeAnswer(index: number) {
        if (this.pollList.length > 1) {
          this.pollList.splice(index, 1)
        }
      },
      async submit() {
        const refs: any = this.$refs
        const { valid } = await refs.form.validate()
          if (valid) {
            this.progressBtnSubmit = true
            const filterEmptyPollList = this.pollList.filter((e: any) => e.answer != '').map((e: any) => e)
            if (filterEmptyPollList.length > 0) {
              const response = await $axios.post('/poll', {
                question: this.question,
                pollLists: filterEmptyPollList,
                oaGid: this.groupId
              })
              if (response.data) {
                this.progressBtnSubmit = false
                refs.Success.show()
                refs.form.reset()
                this.pollList = [{ answer: '' }]
              }
            }
          }
        
       
      }
    },
    watch: {
      "$route.query": function (value) {
        this.watchQueryString(value)
      }
    },
    computed: {
      page () {
        return this.$route.query.groupId
      }
    },

    async mounted() {
      if (this.$route.query.groupId) {
        let groupId: any = this.$route.query.groupId
        this.groupId = groupId ?? ''
      } else {
        await this.getMemberList()
      }
    }
  });
</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .form-poll-component {
     .v-btn {
       min-height: var(--v-input-control-height, 56px);
     }
     .anwser-wrapper {
        .v-btn {
          box-shadow: unset;
        }
     }
  }
</style>
