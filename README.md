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
```

* props: 用来接收 props 数据
* context: 用来定义上下文, 上下文对象中包含了一些有用的属性,这些属性在 vue2 中需要通过 this 才能访问, 在 setup() 函数中无法访问this
* 返回值: return {}, 返回响应式数据, 模版中需要使用的函数



# reactive



* reactive() 函数接收一个普通对象,返回一个响应式的数据对象,创建出来之后,在 setup 中 return 出去,直接在 template 中调用即可

```vue
let state = reactive({
	name: 'test'
});
```



# ref



* ref() 函数用来根据给定的值创建一个响应式的数据对象,返回值是一个对象,这个对象上只包含一个 value 属性,只在 setup 函数内部访问 ref 函数需要加.value

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



# toRef



* 该函数可以将 reactive() 创建出来的响应式对象转换为普通对象,只不过,这个对象上的每个属性节点,都是 ref() 类型的响应式数据



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



# LifeCycle Hooks



* 新版的生命周期函数,可以按需导入到组件中,且只能在 setup() 函数中使用, 但是也可以在 setup 外定义, 在 setup 中使用

```vue
<script lang="ts">
    import { set } from 'lodash';
    import { defineComponent, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onErrorCaptured, onMounted, onUnmounted, onUpdated } from 'vue';
    export default defineComponent({
        setup(props, context) {
            onBeforeMount(()=> {
                console.log('beformounted!')
            })
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



* Vue3 新增了 defineAsyncComponent 函数来处理动态引入的组件.defineAsyncComponent 可以接受返回Promise的工厂函数.当从服务器检索到组件定义时,应该调用 Promise 的解析回调,还可以调用 reject(reason)来指示负载已经失败

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
        <template #default>
            <my-component />
        </template>
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



# slot



* 子组件

```
<slot name="title">
```

* 父组件

```
<template v-slot="title">
  <h1>哈哈哈</h1>
</template>
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
