<template>
    <v-row justify="center">
      <v-dialog
        v-model="dialog.toggle"
        persistent
      >
        <v-card>
          <v-card-title class="text-h5">{{ dialog.title }}</v-card-title>
          <v-card-text>{{ dialog.text }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red-darken-1" variant="text" @click="isConfirmed = false">
              ยกเลิก
            </v-btn>
            <v-btn color="green-darken-1" variant="text" @click="isConfirmed = true">
              ยืนยัน
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </template>
  <script lang="ts">import { defineComponent } from 'vue'
    type Data =  {
        dialog: {
            toggle: boolean,
            title: string,
            text: string
        },
        isConfirmed: null | boolean
    }
    export default defineComponent({
      data () {
        return {
            dialog: {
                toggle: false,
                title: 'ต้องการลบข้อมูลใช่หรือไม่?',
                text: 'กรุณาตรวจสอบข้อมูลจากนั้นกดยืนยัน'
            },
            isConfirmed: null
        } as Data
      },
      methods: {
            show(){
                this.dialog.toggle = true;
                return new Promise<boolean>((rs) => {
                   let closeWatch = this.$watch('isConfirmed', (nv: boolean)=>{
                        this.dialog.toggle = false
                        rs(nv)
                        closeWatch()
                        this.isConfirmed = null
                    })
                })
            },
            hide(){
                this.dialog.toggle = true;
            }
        }
    })
  </script>