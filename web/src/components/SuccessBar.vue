<template>
    <v-snackbar color="success" v-model="snackbar.toggle" :timeout="snackbar.timeout">
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
                text: 'สำเร็จ',
                timeout: 2000,
            },
            }
        },
        methods: {
            show(){
                this.snackbar.toggle = true;
            }
        }
    })
</script>