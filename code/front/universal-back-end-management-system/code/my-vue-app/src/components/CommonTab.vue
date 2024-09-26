<template>
    <div class="tags">
        <el-tag
        v-for="(tag,index) in tags"
        :key="tag.name"
        :closable="tag.name !== 'home'"
        :effect="route.name === tag.name ?'dark':'plain'"
        @close="handleClose(tag,index)"
        @click="selectTag(tag)"
        >
        {{tag.label}}
        </el-tag>
    </div>
</template>
<script setup>
import {ref,computed} from 'vue';
import {useRouter,useRoute} from 'vue-router';
import {userAllData} from '@/stores/store.js'
const tags = ref()
const store = userAllData()
tags.value = store.state.tags
const router = useRouter()
const route = useRoute()
const handleClose = (tag,index)=>{
    store.undateTag(tag)    

    //自己写的错误代码
    // if(tag.path === route.path){
    //     router.push(tags.value[index - 1])
    // }
    // console.log(tags.value)
    // tags.value.splice(index,1)
    // console.log(tags.value)
    // console.log(store.state.tags)
    // store.selectPath(tags)


    //正确的代码调试
    // console.log("----handleClose---")
    // console.log(index)
    // console.log(tags.value)
    // console.log(store.state.tags)

    if(tag.name !== route.name) return
    if(index === store.state.tags.length){
        store.selectPath(tags.value[index-1])
        router.push(tags.value[index-1])
    }else{
        store.selectPath(tags.value[index])
        router.push(tags.value[index])
    }

    
}
const selectTag = (tag)=>{
    router.push(tag.path)
}
// store.state.selectPath(route)

</script>
<style lang="less" scoped>

.tags{
    margin:20px 0 0 20px;
    .el-tag{
        margin-right: 20px;
    }
}

</style>