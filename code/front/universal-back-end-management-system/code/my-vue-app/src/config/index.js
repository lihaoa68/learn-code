const env = import.meta.env.MODE || "prod"

const EnvConfig = {
    development: {
        baseApi:"/api",
        mockApi:"http://127.0.0.1:4523/m1/4313212-3955947-default/api"
    },
    test: {
        baseApi:"//test.future.com/api",
        mockApi:"http://127.0.0.1:4523/m1/4313212-3955947-default/api"
    },
    prod: {
        baseApi:"//future.com/api",
        mockApi:"http://127.0.0.1:4523/m1/4313212-3955947-default/api"
    }
}


export default {
    env,
    ...EnvConfig[env],
    mock:false
}