<template>
    <v-snackbar color="warning" v-model="snackbar.toggle" :timeout="snackbar.timeout">
        {{ snackbar.text }}
        <template v-slot:actions>
        <v-btn
            color="white"
            variant="text"
            @click="snackbar.toggle = false"
        >ปิด</v-btn>
        </template>
    </v-snackbar>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: "SuccessBar",
        data() {
            return {
            snackbar: {
                toggle: false,
                text: 'บันทึกสำเร็จ',
                timeout: 2000,
            },
            }
        },
        methods: {
            show(msg: string){
                this.snackbar.text = msg
                this.snackbar.toggle = true;
            }
        }
    })
</script>