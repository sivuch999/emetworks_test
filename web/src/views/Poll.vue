<template>
  <div id="app" class="container">

    <v-label>โปรดระบุรายละเอียด Poll</v-label>


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
              :rules="answerRules"
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

        <!-- <v-row>
          <v-col cols="4">
            <v-text-field
              type="number"
              variant="outlined"
              v-model="dayExpire"
              :rules="dayExpireRules"
              label="จำนวนวันหมดอายุ"
              required
            ></v-text-field>
          </v-col>
        </v-row> -->

        <v-row>
          <v-col cols="12">
            <v-btn @click="addAnswer">เพิ่มตัวเลือก</v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn @click="submit" color="success">ยืนยัน</v-btn>
          </v-col>
        </v-row>

      </v-container>
    </v-form>

  <SuccessBar ref="Success"/>
  <WarningBar ref="Warning"/>

  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import SuccessBar from "../components/SuccessBar.vue";
  import WarningBar from "../components/WarningBar.vue";
  import { $axios } from "../services/api";

  export default defineComponent({
    components: { SuccessBar, WarningBar },
    data() {
      return {
        alertRef: this.$refs,
        valid: true,
        answerRules: [
          (v: any) => !!v || 'Answer is required',
          (v: string | any[]) => (v && v.length <= 30) || 'Answer must be less than 30 characters',
        ],
        questionRules: [
          (v: any) => !!v || 'Question is required',
        ],
        dayExpireRules: [
          (v: any) => !!v || 'Day Expire is required',
          (v: number) => (v && v >= 0) || 'Day Expire  must be minimum 0' 
        ],
        question: '',
        // dayExpire: 0,
        pollList: [
          {
            answer: '123'
          }
        ],
        submitData: {}
      };
    },
    methods : {
      addAnswer () {
        const refs: any = this.$refs
        if (this.pollList.length <= 10) {
          this.pollList.push({
            answer: '',
          })
        } else {
          refs.Warning.show('จำนวนตัวเลือกสูงสุด 10')
        }
      },
      removeAnswer (index: number) {
        if (this.pollList.length > 1) {
          this.pollList.splice(index, 1)
        }
      },
      async submit () {
        const refs: any = this.$refs
        const filterEmptyPollList = this.pollList.filter((e: any) => e.answer != '').map((e: any) => e)
        if (filterEmptyPollList.length > 0) {
          const response = await $axios.post('/api/poll', {
            question: this.question,
            pollLists: filterEmptyPollList,
          })
          if (response.data) {
            refs.Success.show()
          }
        }
      }
    },
    mounted() {
    
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
