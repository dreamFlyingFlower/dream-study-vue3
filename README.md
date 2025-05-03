# Vue3+TS+Vite



# setup



* setup() 为使用Composition API 新特性提供了统一入口, setup()会在 beforeCreate 之后、created 之前执行, vue3 也是取消了这两个钩子,统一用 setup 代替, 该函数相当于一个生命周期函数,vue 中过去的 data,methods,watch 等全部都用对应的新增 api 写在 setup()函数中

```vue
<script lang="ts">
    setup(props: Prop, context: SetupContext) {
        context.attrs;
        context.slots;
        context.parent;
        context.root;
        context.emit;
        context.refs;

        return {

        }
    }
</script>
// 顶层setup,语法糖,script脚本中的内容就是setup(){},且定义在其中的对象可以被html直接使用
<script setup>
	import {defineProps,defineEmit} from "vue";
    // 在顶层中使用props,相当于原生的props
    cosnt props=defineProps({})
    // 调用父组件方法
    const emit=defineEmit(["父组件方法1","父组件方法2"])
    emit("父组件方法1",arg1...)
</script>
```

* props: 用来接收 props 数据
* context: 用来定义上下文, 上下文对象中包含了一些有用的属性,这些属性在 vue2 中需要通过 this 才能访问, 在 setup() 函数中无法访问this
* 返回值: return {}, 返回响应式数据, 模版中需要使用的函数



# reactive



* reactive() 函数接收一个普通对象或数组,返回一个响应式的数据对象,创建出来之后,在 setup 中 return 出去,直接在 template 中调用即可
* 使用ES6语法解构reactive对象,那么之后无论是修改解构后的对象,还是修改reactive返回的对象,数据都不再是响应式的

```vue
let state = reactive({
	name: 'test'
});

// 当前的state还是响应式的
const state = reactive({name:"test",age:18});
// 解构后,name,age,state全都不是响应式数据
const {name,age} = state
// 使用toRefs可以将state对象中的所有属性转为响应式的ref对象.注意,使用let才可以后续修改name和age,const不可修改
let {name,age} = toRefs(state)
```

* `isProxy`:检查对象是否由reactive或readonly创建的proxy
* `isReactive`:检查对象是否由reactive创建的对象
* `toRaw`:返回reactive或readonly代理对象的原始对象



# ref



* ref() 函数用来根据给定的基本类型值创建一个响应式对象,返回值是一个对象,这个对象上只包含一个 value 属性,在 setup 内部访问 ref 函数需要加.value

```vue
<script lang="ts">
    import { defineComponent, ref } from 'vue';
    export default defineComponent({
        setup() {
            const count = ref<number>(10)
            // 在js 中获取ref 中定义的值, 需要通过value属性
            console.log(count.value);
            return {
                count
            }
        }
    });
</script>
```

* 在reactive 对象中访问 ref 创建的响应式数据

```vue
<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue';
export default defineComponent({
  setup() {
    const count = ref<number>(10)
    const obj = reactive({
      t: 100,
      count
    })
    // 通过reactive 来获取ref 的值时,不需要使用.value属性
    console.log(obj.count);
    return {
        // 将obj中的所有属性转换为单个响应式对象
       ...toRefs(obj)
    }
   }
});
</script>
```

* 在dom中使用ref

```vue
<template>
// el当前元素,divs是存储每个元素的数组
<div v-for="(item, index) in list" :ref="el => { divs[index] = el }">
    {{ item }}
    </div>
</template>

<script>
    import {
        onMounted,
        ref,
    } from 'vue';

    export default {
        setup() {
            const divs = ref([]);

            onMounted(() => {
                console.log(divs.value)
            });

            return {
                divs
            };
        },
    };
</script>
```



# unref



* 获取一个ref对象的value,但是该方法会先判断需要获取的对象是否为一个ref对象,如果不是,则直接返回

```
const name = ref("xxxx");
// 相当于想调用isRef(name),如果返回true,则调用name.value,否则直接返回name
unref(name);
```



# toRef



* 将 reactive() 对象中的指定属性解构为单个响应式对象,解构出的对象是 ref() 类型的响应式对象

```
let state = reactive({
	name: 'test'
});

// 当前的state还是响应式的
const state = reactive({name:"test",age:18});
// 解构后,将name解构为ref对象.注意,要修改就使用let,const不可修改对象
let name = toRef(state,"name");
```



# toRefs



* 将reactive创建的对象完全解构为响应式对象,每个对象都是ref类型的响应式对象



# readonly



* `readonly(object)`:只读属性.object可以是一个普通的对象,也可以是响应式对象
* 当object是一个响应式对象时,从父组件将只读响应式对象传到子组件时,子组件不可以修改只读响应式对象
* 父组件可以通过修改object来让修改只读响应式对象中的内容



# computed



* 该函数用来创造计算属性,返回的值是一个 ref 对象.里面可以传方法,或者一个对象,对象中包含 set()、get()方法

```vue
<script>
    import { computed, defineComponent, ref } from 'vue';

    export default defineComponent({
        setup(props, context) {
            const age = ref(18);

            // 根据 age 的值,创建一个响应式的计算属性 readOnlyAge,它会根据依赖的 ref 自动计算并返回一个新的 ref
            const readOnlyAge = computed(() => age.value++); // 19

            return {
                age,
                readOnlyAge
            }
        }
    });
</script>
```

* 通过 set()、get()方法创建一个可读可写的计算属性

```vue
<script lang="ts">
    import { computed, defineComponent, ref } from 'vue';
    export default defineComponent({
        setup(props, context) {
            const age = ref<number>(18)

            const computedAge = computed({
                get: () => age.value + 1,
                set: value => age.value + value
            })
            // 为计算属性赋值的操作,会触发 set 函数, 触发 set 函数后,age 的值会被更新
            age.value = 100
            return {
                age,
                computedAge
            }
        }
    });
</script>
```



# watchEffect



* 监听页面内所有响应式对象,从加载页面就开始监听,不需要像watch那样指定immediate属性

```vue
<script lang="ts">
    import { set } from 'lodash';
    import { defineComponent, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onErrorCaptured, onMounted, onUnmounted, onUpdated } from 'vue';
    export default defineComponent({
        setup(props, context) {
            const name = ref("xxx");
            cosnt age = ref(20);
			// 直接从页面加载就开始监听name和age,每次name或age改变时都会调用watchEffect函数            
            const stop() = watchEffect(()=>{
            	console.log(name)
                console.log(age)
            })
            // 停止监听watchEffect
            stop();
        }
    });
</script>
```



# watch



```vue
<script lang="ts">
    import { set } from 'lodash';
    import { defineComponent, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onErrorCaptured, onMounted, onUnmounted, onUpdated } from 'vue';
    export default defineComponent({
        setup(props, context) {
            // 直接监听对象
            watch(name,(newVal,oldVal)=>{
                
            })
            // 监听对象中的某个属性
            watch(()=>name.test,(newVal,oldVal)=>{
                
            })
            // 监听对象属性,此时newVal和oldVal都是数组,对应前面的属性
            watch([name,age],(newVal,oldVal)=>{
                
            })
            // 监听对象属性
            watch([name,age],([newName,oldName],[newAge,oldAge])=>{
                
            })
        }
    });
</script>
```



# LifeCycle Hooks



* 新版的生命周期函数,可以按需导入到组件中,且只能在 setup() 函数中使用, 但是也可以在 setup 外定义, 在 setup 中使用
* setup中没有和`beforeCreated`,`created`对应的方法,setup中的数据处理比`beforeCreated`还要早

```vue
<script lang="ts">
    import { set } from 'lodash';
    import { defineComponent, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onErrorCaptured, onMounted, onUnmounted, onUpdated } from 'vue';
    export default defineComponent({
        setup(props, context) {
            // 相当于原生的beforeMount
            onBeforeMount(()=> {
                console.log('beformounted!')
            })
            // 相当于原生的mounted
            onMounted(() => {
                console.log('mounted!')
            })

            onBeforeUpdate(()=> {
                console.log('beforupdated!')
            })
            onUpdated(() => {
                console.log('updated!')
            })

            onBeforeUnmount(()=> {
                console.log('beforunmounted!')
            })
            onUnmounted(() => {
                console.log('unmounted!')
            })

            onErrorCaptured(()=> {
                console.log('errorCaptured!')
            })

            return {}
        }
    });
</script>
```



# Suspense



* Vue3 新增了 defineAsyncComponent 函数来处理动态引入的组件,同时还可以在打包时进行分包
* defineAsyncComponent 可以接受返回Promise的工厂函数.当从服务器检索到组件定义时,应该调用 Promise 的解析回调,还可以调用 reject(reason)来指示负载已经失败

```vue
<script>
    import { defineAsyncComponent } from 'vue';
    const AsyncComp = defineAsyncComponent(() =>import('./components/AsyncComponent.vue'));
    app.component('async-component', AsyncComp);
</script>
```



```vue
<template>
    <Suspense>
        // 固定写法:默认使用指定组件
        <template #default>
            <my-component />
        </template>
		// 如果默认组件加载失败,使用回调组件,类似于降级
        <template #fallback>
            Loading ...
        </template>
    </Suspense>
</template>

<script lang='ts'>
    import { defineComponent, defineAsyncComponent } from "vue";
    const MyComponent = defineAsyncComponent(() => import('./Component'));

    export default defineComponent({
        components: {
            MyComponent
        },
        setup() {
            return {}
        }
    })
</script>
```



# $refs



* `this.$refs`:获取所有组件
* 在setup中不能使用this,需要使用ref定义

```vue
<template>
	<my-component ref="myComponent"></my-component>
</template>

<script lang='ts'>

    export default defineComponent({
        components: {
            MyComponent
        },
        setup() {
            // 获取myComponent组件,变量名需要和组件上的ref值一样
            const myComponent = ref(null);
            return {}
        },
        methods:{
            test(){
                // 获取MyComponent组件
                console.log(this.$refs.myComponent);
                // 获取MyComponent组件的根元素
                console.log(this.$refs.myComponet.$el)
            }
        }
    })
</script>
```



# $parent



* `this.$parent`:可以直接获取父组件.`$children`在Vue3中已经移除,使用ref来获取



# $root



* `this.$root`:获取根节点组件



# $emits



* 子组件调用父组件方法时,需要首先在`emits`中定义调用的父组件方法,然后在调用时使用`$emit`进行调用

```
emits:["父组件的方法名"];

this.$emit("父组件的方法名","参数1","参数2"...)
```



# 父子组件



## 父组件获取子组件内容,渲染子组件



* 在父组件的setup里通过`context.slots.default()`拿到子组件数组,然后通过component组件渲染
* vue3中所有的组件最后都会导出一个对象,该对象就是子组件里的type(context.slots.default()[0].type),可以通过type判断子组件是不是我们要求的子组件
* TabsDemo.vue

```vue
<Tabs>
    <Tab title="导航1">内容1</Tab>
    <Tab title="导航2">内容2</Tab>
</Tabs>
```

- Tabs.vue

```vue
<template>
<component v-for="(tab, index) in defaults" :key="index" :is="tab"></component>
</template>

<script lang="ts">
    import {SetupContext} from 'vue'
    export default {
        setup(props, context: SetupContext) {
            const defaults = context.slots.default();
            return {
                defaults
            }
        }
    }
</script>
```

- Tabs.vue

```vue
<script>
    import Tab from './Tab.vue';
    export default {
        setup(props, context: SetupContext) {
            const defaults = context.slots.default();
            defaults.forEach(tag => {
                if (tag.type !== Tab) {
                    throw new Error('Tabs 子标签必须是 Tab');
                }
            })
            return {
                defaults
            }
        }
    }
</script>
```



# 非父子组件



* Provide/Inject:虽然是非父子组件,其实是孙子,孙子子类似的组件,兄弟组件中也无法使用

  * 最上级组件中使用`provide`属性,定义可以向下传递的内容
  * 子组件或更下层的子组件使用`inject`选择性接收`provide`中是属性,不需要接收`provide`中的全部属性
  * `provide`中的属性不是响应式的数据,如果需要使用响应式数据,需要使用`computed`

  ```
  provide:["属性1","属性2"]
  // 如果要使用this,需要定义为方法
  provide(){
  	return {
  		属性1:"",
  		属性2:"",
  		属性3: computed(()=>this.names.length)
  	}
  }
  ```

* Mitt全局事件总线:mitt依赖,类似于eventBus,使用方式可参考官网



# slot



* 插槽:在子组件中使用`<slot>`标签,父组件使用子组件时,写在子组件标签内的所有内容将被渲染到子组件的`<slot>`标签中
* `v-slot:`可以缩写成`#`,注意,冒号也是
* 子组件:name可以使用动态属性

```
<span>xxx</span>
<slot name="title">
	默认的内容,如果父组件没有插入任何内容就会显示默认内容
</slot>
<slot name="user">
	默认的内容,如果父组件没有插入任何内容就会显示默认内容
</slot>
<span>xxxxxx</span>
```

* 父组件:插槽里可以是组件,也可以直接写html元素

```
<template>
	// 以下所有内容会直接替换子组件slot元素
	<h1>哈哈哈</h1>
	<h2>xxxx</h2>
</template>
// 如果有多个插槽,则需要根据插槽的name属性匹配.当前内容只会插入到子组件的title插槽,user插槽不会改变
<template v-slot:"title">
	// 等同于<template #title>
	// 以下所有内容会直接替换子组件slot元素
	<h1>哈哈哈</h1>
	<h2>xxxx</h2>
</template>
// 绑定一个动态的属性name
<template v-slot:[name]>
	// 以下所有内容会直接替换子组件slot元素
	<h1>哈哈哈</h1>
	<h2>xxxx</h2>
</template>
```

* 父组件获取子组件中的值

```
// 子组件
<slot :item="item" :index="index">
	默认的内容,如果父组件没有插入任何内容就会显示默认内容
</slot>
// 父组件使用子组件,填充到子组件插槽的内容
// slotProps可以自定义,表示获取到子组件中所有的属性
<template v-slot="slotProps">
	<span>{{slotProps.item}} - {{slotProps.index}}</span>
</template>
```

* 如果即需要指定插槽名,又需要使用子组件的数据,写法:`v-slot:left=slotProps`或`#left=slotProps`



# 动态组件



```vue
<template>
	// 如果需要传值,和普通的组件一样,直接写在component上
	<component :is="current"></component>
</template>
<script>
    // 使用component的is属性可以动态切换组件
    // 首先需要引入所有动态组件,注册,然后绑定一个属性,根据其他方式修改绑定属性的值4
    // 注意引入组件的大小写和绑定属性的大小写
    data(){
        return {
            // 组件名小写或使用-的形式
            current:home
        }
    }
    components:{
        // 组件名首字母大写
        Home,
        Main,
        Footer
    }
</script>
```



# 动态挂载组件



* 通过引入h函数,参数依次为:组件;元素的属性(第一个参数组件的props,也就是直接可以在使用组件的时候传入的属性);插槽的属性
* 在render里监听v-model绑定的update事件的时候,需要使用`onUpdate:属性名`

```vue
<script>
    import {createApp, h} from 'vue'
    import Dialog from './Dialog.vue'
    export const openDialog = (options: Options) => {
        const {title, content} = options;
        const div = document.createElement('div');
        document.body.append(div);
        const app = createApp({
            render() {
                return h(Dialog, {
                    visible: true, cancel: () => {},
                    'onUpdate:visible': (newValue: boolean) => {
                        if (newValue === false) {
                            app.unmount(div)
                        }
                    }
                }, {title, content});
            }
        })
        app.mount(div)
    }
</script>
```



# 属性绑定



* 默认所有属性都绑定到根元素
* 使用`inheritAttrs: false可以取消默认绑定`
* 使用attrs或者context.attrs获取所有属性
* 使用v-bing="$attrs"批量绑定属性
* 使用 const {size, level, ...rest} = context.attrs 将属性分开
* vue2中在父组件绑定click事件,子组件必须内部触发click,而vue3中在父组件绑定子组件的根元素上也会跟着绑定
* ButtonDemo.vue

```vue
<div>
    <Button @click="onClick" @focus="onClick" size="small">你好</Button>
</div>
<script>
    setup() {
        const onClick = () => {
            console.log("aaa")
        }
        return {onClick}
    },
</script>
```

- Button.vue

```
<template>
  <div>
    <button>
      <slot/>
    </button>
  </div>
</template>
```

* 上面的代码Button的click事件会在根元素div上绑定,如果要指定click的区域为button元素的话就需要使用inheritAttrs
* Button.vue

```vue
<template>
<div>
    <button v-bind="$attrs">
        <slot/>
    </button>
    </div>
</template>
<script lang="ts">
    export default {
        inheritAttrs: false
    }
</script>
```

* 如果想要一部分属性绑定在button上一部分在div上就需要在setup里

- Button.vue

```vue
<template>
<div :size="size">
    <button v-bind="rest">
        <slot/>
    </button>
    </div>
</template>
<script lang="ts">
    import {SetupContext} from 'vue'
    export default {
        inheritAttrs: false,
        setup(props: any, context:SetupContext ) {
            const {size, ...rest} = context.attrs
            return {size, rest}
        }
    }
</script>
```



# Vue的全局配置



```vue
<script lang="ts">
    const app = Vue.createApp({});
    app.config = {};
    // 为组件渲染功能和观察程序期间的未捕获错误分配处理程序,错误和应用程序实例将调用处理程序
    app.config.errorHandler = (err, vm, info) => {};
    // 可以在应用程序内的任何组件实例中访问的全局属性,组件的属性将具有优先权,这可以代替 Vue 2.xVue.prototype 扩展
    app.config.globalProperties.$http = 'xxxxxxxxs';
    // 在组件中通过 getCurrentInstance() 获取全局 globalProperties,getCurrentInstance()获取当前组件实例,然后通过 ctx 获得当前上下文,这样就能在 setup 中使用 router 和 vuex
    setup( ) {
        const { ctx } = getCurrentInstance();
        ctx.$http;
    }
</script>
```



# 单文件组件



* [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) 
* 更简单的书写代码,不需要使用export default defineComponent以及return



# 缓存组件



* `keep-alive`: 如果在多个tab页之间切换,需要保存之前tab页的状态,可以使用keep-alive标签包裹组件
  * 缓存组件在切换时,只会调用一次`created`,再次切换回来,不会再次调用
  * 缓存组件切换到其他组件时,不会调用`unmounted`
* `activated(){}`:当从其他组件切换回缓存组件时会调用该方法,类似于`created`
* `deactivated(){}`:当缓存组件切换到其他组件时会调用该方法,类似于`unmounted`



# modelValue



```vue
<template>
	<!-- 在组件上绑定值,类似于在input元素上双向绑定 -->
	<my-component v-model="message"></my-component>
	<!-- 该写法等同于上面的写法,上面是简写 -->
	<!-- modelValue是传递给子组件的属性,可自定义 -->
	<!-- @update:model-value是固定写法,model-value是自定义的属性名,根据实际情况修改 -->
	<!-- 子组件会通过this.$emits[update:modelValue]来调用@update:model-value方法,修改message的值 -->
	<my-component :modelValue="message" @update:model-value="message = $event"></my-component>
</template>

<script lang='ts'>
    export default defineComponent({
        components: {
            MyComponent
        },
        setup() {
            return {}
        }
    })
</script>
```



# 插件



* element-plus:样式,在main.js中使用

  ```js
  import { createApp } from 'vue';
  import App from './App.vue';
  import ElementPlus from 'element-plus';
  import 'element-plus/dist/index.css';
  
  createApp(App).use(ElementPlus).mount('#app');
  ```

* unplugin-vue-components`和`unplugin-auto-import:减少打包体积,在vite.config.js中使用

  ```js
  import { defineConfig } from 'vite';
  import vue from '@vitejs/plugin-vue';
  import AutoImport from 'unplugin-auto-import/vite';
  import Components from 'unplugin-vue-components/vite';
  import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
  
  export default defineConfig({
    plugins: [
      vue(),
        <!-- 使用element-plus无需手动导入 -->
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  })
  ```

  

* axios:ajax请求

* vue-i18n:国际化,新建一个ts文件

  ```ts
  // src/i18n.ts
  import { createI18n } from 'vue-i18n';
  
  // 定义消息对象
  const messages = {
    en: {
      message: {
        username: 'Username',
        password: 'Password',
        login: 'Login',
        inputUsername: 'Please enter the username',
        inputPassword: 'Please enter the password'
      }
    },
    zh: {
      message: {
        username: '用户名',
        password: '密码',
        login: '登录',
        inputUsername: '请输入用户名',
        inputPassword: '请输入密码'
      }
    }
  };
  
  // 创建 i18n 实例
  const i18n = createI18n({
    locale: 'zh', // 设置默认语言为中文
    messages,
  });
  
  export default i18n;
  ```

  ```ts
  <!-- main.ts -->
  // main.ts
  import { createApp } from 'vue';
  import App from './App.vue';
  import ElementPlus from 'element-plus';
  import 'element-plus/dist/index.css';
  import i18n from './i18n'; // 引入 i18n
  
  const app = createApp(App);
  app.use(ElementPlus);
  app.use(i18n); // 使用 i18n 插件
  app.mount('#app');
  ```

  







