import {
    defineStore,
  
} from 'pinia'
import {
    ref,
    watch,
} from 'vue'

const initState = function () {
    return {
        isCollapse: true,
        tags: [{
                path: "/home",
                name: "home",
                label: "首页",
                icon: 'home'
            }

        ],
        currentMenu: null,
        menuList: [],
        token: "",
        routerList: []
    }
}

export const userAllData = defineStore("userAllData", () => {

    let state = ref(initState())
    
    
    watch(state,
        (newObj) => {
            console.log("newObj:", newObj)
            console.log("newObj-token:", newObj.token)
            if (!newObj.token) return;
            localStorage.setItem("store", JSON.stringify(newObj))
            console.log(JSON.parse(localStorage.getItem("store")))
        }, {deep: true});

        
        function addMenu(router,type) {
            
            if (type === "refresh") {
                if (JSON.parse(localStorage.getItem("store"))) {
                    console.log(JSON.parse(localStorage.getItem("store")))
                    state.value = JSON.parse(localStorage.getItem("store"));
                    state.value.routerList = [];
                    console.log(JSON.parse(localStorage.getItem("store")))
            }else {
                return
            }
        }
        console.log(state.value)
        
        const menu = state.value.menuList;
        const module = import.meta.glob("../views/**/*.vue");
        const routeArr = [];
        menu.forEach((item) => {
            if (item.children) {
                item.children.forEach((val) => {
                    let url = `../views/${val.url}.vue`;
                    val.component = module[url];
                    console.log(...item.children)
            
                    routeArr.push(...item.children);
                    
                })
            } else {
                let url = `../views/${item.url}.vue`;
                item.component = module[url];
                console.log(item)
               
                routeArr.push(item)
                
            };
        });
        console.log(routeArr)
        state.value.routerList = []
        console.log(router.getRoutes());
        let routers = router.getRoutes()
        routers.forEach(item => {
            if (item.name == 'main' || item.name == 'login' || item.name == '404') {
                return
            } else {
                router.removeRoute(item.name)
            }
        })
        console.log(state.value.routerList)
        routeArr.forEach((item) => {
            state.value.routerList.push(router.addRoute("main", item));
        })
        console.log(state.value.routerList)
    }

    function selectPath(val) {
        if (val.name === 'home') {
            state.value.currentMenu = null
        } else {
            state.value.currentMenu = val
            let index = state.value.tags.findIndex(item => item.name === val.name)
            index === -1 ? state.value.tags.push(val) : ""
        }

    }

    function undateTag(tag) {
        let index = state.value.tags.findIndex((item) => item.name === tag.name)
        state.value.tags.splice(index, 1)
        // console.log("---undateTag----")
        // console.log(index)
        // console.log(state.value.tags)
    }

    function updateMenu(menuList) {
        state.value.menuList = menuList
    }

    function clean() {
        state.value.routerList.forEach((item) => {
            if (item) item();
        })
        state.value = initState()
        localStorage.removeItem("store")
    }



    return {
        state,
        selectPath,
        undateTag,
        updateMenu,
        clean,
        addMenu
    }
})
