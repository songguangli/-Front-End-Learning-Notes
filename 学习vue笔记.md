在vue中，我们把数据加入到vue的响应式系统中，即把对象中的所有property加入到vue的响应式系统中。
当这些property的值发生改变的时候，原始数据的值也会随之改变，即完成了数据的双向绑定。
另一点，只有当vue的实例被创建时就已经存在的数据才能是响应式的，
如果你此时添加了vm.b = 'hi' 那么对b的改动不会触发视图的更新
如果你知道你在后面呢需要用到一个property，你需要设置初始值
比如
data: {
  newTodoText: '',
  visitCount: 0,
  hideCompletedTodos: false,
  todos: [],
  error: null
}
除非使用Object.freeze()，会阻止修改现有的property，这时响应式系统就不起作用了

实现生命周期钩子
目的是给用户在不同阶段添加自己的代码的机会
比如created钩子可以用来在一个实例被创建之后执行代码
它的this指向调用它的vm实例
mounted钩子、updated钩子、destroyed钩子
注意一点，不要在property或者回调上使用箭头函数
比如created: () => console.log(this.a)
或vm.$watch('a', newValue => this.myMethod())
因为箭头函数并没有 this
this 会作为变量一直向上级词法作用域查找，直至找到为止，
经常导致
Uncaught TypeError: Cannot read property of undefined
Uncaught TypeError: this.myMethod is not a function 之类的错误

模板
数据绑定组常见的形式就是使用双大括号{{ msg }}的文本插值
最后这个标签将会被替代为对应数据对象上msg 的property的值
v-once，执行一次性的插值，当数据改变时，插值处的内容不会更新
写法是<span v-once>这个将不会改变: {{ msg }}</span>
双大括号会将数据解释为普通文本，而不是HTML代码
为了输出真正的HTML，要使用v-html指令
<p>Using mustaches: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>

计算属性和侦听器

Class与Style绑定

View
ll
ll
ll
ViewModel
ll
ll
ll
Model
ViewModel将Model的数据绑定到View的DOM元素上
Model的数据发生变化，通过ViewModel数据绑定机制，触发View里面DOM元素的变化
另一方面又通过ViewModel来监听View里面的DOM元素的数据变化，如果发生改变，同时影响Model的数据变化
所以ViewModel就像是一个中介、桥梁
ViewModel就是一个Vue的实例，这个实例作用域单个或者多个html元素
从而实现Dom树监听和数据绑定的双向更新操作
v-text 和 v-html 都是只能从Model到View的单项绑定，反过来不可以

<input id="basketball" type="checkbox" value="篮球" v-model="Hobby">
<label for="basketball">篮球</label>
<input type="checkbox" id="football" value="足球" v-model="Hobby">

<body>
  <div id="app">
    <h1>姓名: <label v-text="Name">

<div id="app">
  <ul>
    <li v-for="(value, key) in values">
        {{ key }} : {{ value }}
    </li>
  </ul>
</div>
<script type="text/javascript">
//ViewModel
var vue = new Vue({
  el: '#app',
  data: {
    values: {Name：＂小明＂，Age: 20, Gender:　＂男＂}
  }
})
</script>

v-bind:property = "expression"
css外部样式
<link href="Content/bootstrap/css/bootstrap.css"

在组件上使用v-model
自定义事件也可以用于创建支持v-model的自定义输入组件
<input v-model="searchText">
等价于：
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
当在组件上使用时，v-model是这样的
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
>
这个组件内的input必须：
将它的value attrtibute绑定到一个叫value的prop上
在他的input事件被触发的时候，将它的值通过自定义的input事件抛出
Vue.component('custom-input',{
  props: ['value'],
  template:`
  <input
    v-bind:value="value"
    v-on:input="$emit('input',$event.target.value)"
  >
  `
})

<custom-input v-model="searchText"></custom-input>

组件名
组件名字时Vue.component的第一个参数
建议使用字母全小写且必须包含一个连字符
my-component-name
全局注册会造成用户下载的javascript无谓的增加
可以通过一个对象来定义组件
var ComponentA = { /*....*/ }
然后再components选项中固定翼你想要的使用的组件
new Vue({
  el: '#app',
  components: {
    'component-a': ComponentA,
    'component-b':　ComponentB
  }
})
Component-a就是自定义元素的名字，后面的值就是这个组件的选项对象
如果使用了webpack的代码是
import ComponentA from './ComponentA.vue'

export default {
  Component: {
    'component-a': ComponentA
  },
  // ...
}

在es2015+中，在对象中放一个类似ComponentA的变量名其实是ComponentA：ComponentA
的缩写，即这个变量名同时是：
用在模板中的自定义元素的名称
和包含了这个组件选项的变量名

模块系统
使用webpack的情况下，推荐创建一个components目录，并将每个组件放置在其各自的文件中

基础组件的自动化全局注册

prop类型
props: ['title','likes','abc'...]
可以指定每个prop都有指定的值类型
props：{
  title: String,
  likes: Number,
  ...
}
<blog-post title="My journey with Vue"></blog-post>
prop也可以通过使用v-bind动态赋值
v-bind:title="post.title"
实际上任何类型的值都可以传给一个prop
prop可以接受任何类型的值
我们大多数情况都需要使用v-bind，即使这个数据是静态的
如果想要把一个对象的所有property都作为prop传入，你可以使用不带参数的v-bind取代v-bind：prop-name

单向数据流
单向下行绑定，父级prop的更新会向下流动到子组件中，但是反过来不行
prop验证
如果你不希望组件的根元素继承 attribute，
你可以在组件的选项中设置 inheritAttrs: false
Vue.component('my-component', {
  inheritAttrs: false,
  // ...
})

遍历A节点下的所有子节点
var b = document.getelementById('a').parentNode.children

用递归求1-100和
function add(num1,num2){
  var num = num1+num2
  if(num2 > 100)
}

父子组件传值
1.prop是父组件向子组件传值
子组件通过prop来接收数据
props: ['masVal']
props: {
  masVal: Array   //指定传入数据的类型
}
props: {
  msgVal: {
    type:　Array，
    default: [0,0,0]   //指定默认的值
  }
}
父子组件传值，数据是异步的请求，
有可能因为数据还没有获取到就已经渲染节点了
可以在父组件需要传递数据的节点加上---
v-if = isReady (isReady默认为false)
异步请求成功获取数据之后，将isReady赋为true

子组件向父组件传递数据
通过$emit方法，主要是触发事件，回调函数来完成参数的传递
子组件：
<template>
  <div class="children">
    <button @click="emitToParent">按钮点击传值给父组件</button>
  </div>
</template>

export default {
  methods：{
    emitToParent(){            //下面这个是要传递的参数
      this.$emit('child-event','我是子组件向父组件中传递的内容')
                  child-event是子组件中自定义的方法
    }
  }
}
子组件的事件绑定一个方法，这个方法连接到父组件的方法上
然后父组件调用自己的方法，父组件的方法，传递的参数data就是从
子组件中拿来的data

父组件：
<template>
  <div class="parent">
    //这里是父组件使用子组件了
    <children @child-event='parentEvent'></children>
  </div>
</template>

import Children from 'components/children'
export default {
  component: {
    Children
  }
  methods:{
    parentsEvent:(data){
      console.log(data)
    }
  }
}

使用vuex
首先需要先引入vue和vuex
import Vue from 'vue'
improt Vuex from 'vuex'

使用vuex
Vue.use(Vuex)

创建Vuex实例
const store = new Vuex.Store({
    state:{
      count:1 
      //数据源，需要保存的数据就保存在这里，
      可以通过this.$store.state来获取数据
    }
})

导出Vuex实例store
exprot default store

下面在main.js 入口文件中引入该文件
import store from './store'

然后在vue实例全局引入store对象
new Vue ({
  el: '#app',
  store,
  ...,
  ...,
})

引用store中state的值
<template>
  <div class='hello'>
    <h2>{{ this.$store.state.count }}</h2>
    //调用vuex实例中的count值
  </div>
</template>

生命周期钩子：在 “某一时刻” 会 “自动执行” 的函数
beforeCreate //实例生成之前
created // 实例生成之后
然后判断是否有 template
beforeMount //在组件内容被渲染到页面之前立即执行的函数
mounted // 在组件内容被渲染到页面之后自动执行的函数
beforeUpdate // 当data 中的数据发生变化时会自动执行的函数
updated // 数据被改变，同时页面重新渲染后会自动执行的函数
beforeUnmount // 当 Vue 实例销毁时 ---
unmounted //当 Vue 实例彻底销毁时，且 DOM 更新后

<!-- 模板知识点： -->
{{ 插值表达式 }}

如果想要在模板中把 data 里的 message 的
'<strong>hello world</strong>'
展示出来，那么就不能使用插值表达式了
需要使用 v-html 指令
<div v-html="message"></div>
含义就是在这个 div 标签上通过 html 展示 message 变量

如果想要让 title 显示 data 的 message 的值
下面这么写是没用的，title 的值会显示为 message
<div title="message">hello world</div>
需要使用 v-bind 指令，将数据绑定起来
<div v-bind:title="message">hello world</div>
含义是让 title 的值与 message 做绑定
可以用 <div :title="message"> 简写
事件绑定 v-on: 可以用 @ 替代

data(){
  name: 'title'
}
<div :[name]="message">

阻止默认事件
@click.prevent="handleClick"

如果想让模板中使用的 message 展示之后，改变 message，dom显示的不改变，可以使用 v-once
<div v-once>{{ message }}</div>
可以降低无用的渲染，提升性能


使用计算属性 computed 
那么 computed 与 methods 里面的方法有什么区别呢
computed 当计算属性依赖的内容发生变更时，才会重新执行计算
methods 只要页面重新渲染，才会重新计算

computed 和 methods 都能实现的一个功能，建议使用computed，因为有缓存
computed 和 watch 都能实现的功能，建议使用computed，因为代码会更加简洁

如果子组件的模板有两个节点，那么不能在父组件调用时直接加上
<demo class="xxx" />
如果加了的话，可以在子组件的节点上加上
<div :class="$attrs.class">

使用 styleObject{
  color: 'red',
  background: 'yellow'
}

v-if 和 v-show 
v-show 是通过 style 样式控制的 display：none
v-if 会直接移除 dom 元素
如果涉及频繁显示或隐藏dom元素，用 v-show ，不会重新渲染dom

<!-- vue 中的条件判断 -->
v-if
v-else-if 
v-else

v-if 和 v-else 要贴在一起

<!-- 列表循环渲染 -->
v-for

listArray: ['a','b','c']
<div v-for="(items, index) in list" :key="items">
{{ items }} --{{ index }}
</div>

listObject: {
  firstName: "aaa"
  lastName: "bbb"
  job: "ccc"
}
<div v-for="(value , key , index) in listObject">
{{ value }} --- {{ key }}
打印的 value 是 aaa 、bbb 、ccc
key 是下标  firstName ，lastName

用vue循环的时候，要加key值，可以提升性能，避免重复渲染相同的dom元素

改变页面元素方法
1.使用数组的变更函数，push、pop、shift、splice、reverse等
2.直接替换数组
可以使用 cancat 和 filter
3.直接更新数组的内容
this.listArray[1] = 'hello'

在同一个元素标签上同时写 v-for 和 v-if 会出错误
v-for 的优先级更高
同时用的话 ，为了防止出现两层div
可以使用占位符 
<template v-for>
  <div v-if>
  </div>
</template>


<!-- 事件绑定 -->
methods: {
  handleBtnClick (num, event){
    this.counter += num
  }
}
<button @click="handleBtnClick(2, $event)">

如果要绑定两个事件的话，需要在方法后面加上（）
<button @click="handleBtnClick() , handleBtnClick1()">

停止冒泡 修饰符
<button @click.stop="xxx">

self 必须是自己本身这个元素触发的事件
<div @click.self="xxx">

阻止默认行为
prevent

捕获
capture

只执行一次
once

滚动事件的默认行为 (即滚动行为) 将会立即触发
passive


<!-- 按键修饰符 -->
enter、delete、tab、esc、up、down、left、right
<input @keydown.enter="xxx">

<!-- 鼠标修饰符 -->
left、right、middle
<div @click.left="xxx">

<!-- 精确修饰符 -->
exact

<!-- 表单中双向绑定 -->
input、textarea、checkbox、radio
都使用 v-model 实现双向数据绑定
checkbox 和 radio 要加 value 值
使用checkbox的话 data 中的 message 可以设成一个空数组 []
使用 radio 因为是单选，message 设置空字符串， ''

message : []
<select v-model="message" multiple>
  <option disabled value=''>请选择内容</option>
  <option value='A'>A</option>
  <option value='B'>B</option>
  <option value='C'>C</option>
</seclect>

checkbox 中 默认的值 true 和 false 可以改变
true-value="hello"
false-value="world"

v-model.number
v-model.trim  //把字符串前后的空格去掉
v-model.lazy


<!-- 组件 -->
组件具备复用性
每个组件中的数据是独享的，不共用
全局组件，只要定义了，处处可以使用，性能不高，但是使用简单
名字建议小写字母开头，用 - 间隔

局部组件，在根组件中用如下语法
components: { 'counter'（组件名）: counter（外部定义的） }
名字一样可以直接使用 { counter }
定义了之后，要注册之后才能使用，性能比较高

局部组件的名字大写 比如 HelloWorld ，大写开头，驼峰命名
局部组件要做名字和组件之间的映射对象，vue也会自动转换

动态传参  、  静态传参
content="123"  //静态 typeof是string

data() {
  return {
    num: 123
  }
}
v-bind:content="num"

<!-- 子组件接收参数校验 -->
props: {
  content: {
    type:　String,
    required： true, //必填
    default: function() {
      return 123;
    }  //默认值
    validator: function(value) {
      return value < 1000;
    }  //深度校验
}


把要传递的参数放在父组件的data中，用对象 params 包裹
v-bind="params"
相当于下面的简写
:content="params.content"
:a="params.a"


如果父组件传参使用 :content-abc="content" 向子组件传递参数
子组件接收需要使用驼峰 props: ['contentAbc']


子组件不能修改父组件中的数据，只能展示
如果想要用父组件中的数据进行修改，只能在data中复制一份父组件中的数据，this.data
为什么要设置单向数据流呢，比如父组件中有多个地方调用了父组件中的数据，如果子组件能够修改父组件中的数据，就会造成组件之间的数据耦合，造成潜在的bug


<!-- Non-Props 属性 -->
inheritAttrs : false
这样的话就不会把父组件传给子组件的值放在子组件的属性上
一般用在父组件给子组件传递样式 style

如果子组件有多个 div ，并且没用props接收
父组件传的参数不会挂载
可以使用 <div v-bind="$attrs"> 就能接收全部的父组件传递的non-props 属性
也可以在后面加上属性名字选择性的绑定属性 
v-bind:msg="$attrs.msg"


<!-- 父子组件间如何通过事件进行通信 -->
子组件触发事件用驼峰命名
this.$emit('addOne')

父组件在模板的标签中监听事件的时候需要使用 add-one 命名
@="handleAddOne"

整个子组件向父组件进行通信的过程大概是
子组件在模板中绑定一个事件 handleClick
子组件中的方法 handleClick 中使用 $emit 调用，传递一个自定义事件名称为 addOne (驼峰命名)
父组件在模板中使用事件绑定 @add-one="handleAddOne"接收响应，执行自身methods中的 handleAddOne 方法
父组件中定义的 handleAddOne 方法，修改自身属性

如果在 $emit() 中添加额外的参数，例如
$emit('add', 2)
父组件中的方法要用 handleAdd (param) 接收参数

子组件也可以在自身把需要的属性值计算出来，再传递给父组件
例如 this.$emit('add', this.count += 3)
父组件用 handleAdd (count) {
  this.count = count;
}
这样接收就可以了

在子组件中用 emits: {
  add: () => {
    if(count < 0) {
      return true
    } 
    return false ;
  }
}
可以用这个对传递出去的参数进行校验
如果不匹配，vue会发出警告


也可以使用 v-model 完成父子组件间的双向数据绑定
子组件的 props: ['modelValue'] 这个写法约定俗成
methods:　{
  handleClick() {
    this.$emit('update:modelVaule', this.modelValue + 3)
  }
}
template: `
  <div @click="handleClick">{{modelValue}}</div>
`

父组件使用子组件：
template: `
  <counter v-model="count" />
`

主要就是使用 update:modelValue,
modelValue 是默认值，如果想要换成别的名字，在父组件中使用
v-model:xxx="count"

子组件通过 modelModifiers 接收父组件在 v-model. 上的修饰符
props:{  
  'modelModifiers': {
    default: () => ({})   // 默认值，如果不传修饰符就置空
  }
}
可以实现当父组件在子组件模板上使用 v-model 添加修饰符时使用
然后在 methods 中做一些方法，然后再传递给父组件


<!-- 使用插槽和具名插槽解决组件内容传递问题 -->
slot
子组件使用插槽
<slot><slot>
父组件：
<myform>
  <div>提交</div>
</myform>
<myform>
  <button>提交</button>
</myform>

注意： slot 不能使用事件绑定
可以在外层添加一个 span 标签，在 span 上做事件绑定
插槽也可以在父组件中传递子组件

slot 中使用的数据，作用域的问题
父模板里调用的数据属性，使用的都是父模板里的数据
子模板里调用的数据属性，使用的都是子模板里的数据
{{ text }} 写在哪个里就用哪里的数据


给插槽中添加默认值
<slot> default value </slot>
如果父组件使用子组件时里面不是空的，就不会使用默认值



<!-- 具名插槽 -->
如何把 slot 拆分
slot 需要用 template(占位符) 包裹
父组件：
<layout>
  <template #header(简写)>
    <div> header </div>
  </template>
  <template v-slot:footer>
    <div> footer </div>
  </template>
</layout>

子组件：
<div>
  <slot name="header"></slot>
  <div>content</div>
  <slot name="footer"></slot>
</div>


插槽slot主要用 标签 、DOM 的传递


<!-- 作用域插槽 -->
父组件在使用子组件时使用如下来接收数据
<layout v-slot="slotProps">
使用时用 slotProps.item

子组件使用
<slot :item="item">

作用域插槽解决什么问题
当子组件要渲染的内容要由父组件决定的时候，作用域插槽能够让父组件调用子组件的数据

作用域插槽的内部工作原理是将你的插槽内容包裹在一个拥有单个参数的函数里
function (slotProps) {
  // 插槽内容
}

解构插槽
<current-user v-slot="{ user }">
  {{ user.firstName }}
</current-user>


<!-- 动态组件 -->
多个组件，例如 input-item 和 common-item
父组件的data 中 currentItem:'input-item'
模板中使用
<keep-alive>
<component :is="currentItem">
</keep-alive>
缓存

动态组件：根据数据的变化，结合 compoment 标签，来随时切换组件的显示


<!-- 异步组件 -->
app.component('async-common-item' , Vue.defineAsyncComponent(() => {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      resolve({
        template: `
        <div> this is an async component </div>
        `
      })
    },4000)
  })
}))


<!-- ref -->
获取 Dom 节点
也可以获得子组件的引用，然后调用子组件的方法
this.$refs.common.sayHello()

<!-- provide / inject -->
父组件用：
provide: {
  count: 1
}

孙子组件用：
inject: ['count']

使多层组件传值更加方便

如果要把data 中的数据全部传递，需要把 provide 变成一个方法
然后 return 出去
provide() {
  return this.count
}
传递出去的数据是一次性的，count 不会改变


<!-- 过渡，动画 -->
<transition>
</transition>
入场过渡效果
.v-enter-from
.v-enter-active
.v-enter-to

出场过渡效果
v-leave-from
v-leave-active
v-leave-to

可以在 <transition name="aaa">
.aaa-enter-to

<transition type="transition">
<transition type="animation">
<transition :duration="1000">
<transition :duration="{enter: 1000, leave: 1000}">
控制动画和过渡同步执行时的效果

<!-- 写JS动画 -->
<transition :css="false"
  @before-enter="handleBeforeEnter"     el
  @enter="handleEnterActive"   两个参数：el,done 
  @after-enter="handleEnterEnd"         el
  @before-leave    el
  @leave           el,done
  @after-leave     el
>
methods: {
  handleBeforeEnter(el) {
    el.style.color = "red";
  },
  handleEnterActive(el, done) {
    const animation = setInterval(() => {
      const color = el.style.color;
      if(color === 'red') {
        el.style.color = 'green';
      } else {
        el.style.color = 'red';
      }
    }, 1000)
    setTimeout(() => {
      clearInterval(animation);
      done();
    }, 1000)
  }
}


<!-- 组件和元素切换动画的实现 -->
先出再入
<transition mode="out-in">
先入再出
<transition mode="in-out">

控制刚进入的时候是否有动画效果
<transition appear>

做多个单组件之间的切换，除了可以使用 v-if, v-else
也可以使用 <component :is="component" />


<!-- 列表动画的实现 -->
v-move
<transition-group>

<!-- 状态动画 -->
通过控制数据实现


<!-- mixin -->
mixin 混入
组件中 data 优先级高于 mixin data 优先级
生命周期函数，先执行 mixin 里面的，再执行组件里的
组件中 methods 优先级高于 mixin methods 优先级

const myMixin = {
  data() {
    return {
      number: 2
    }
  },
  created() {
    console.log('mixin created')
  },
  methods {

  }
}

实例中：
mixins: [myMixin],

全局 mixin ，子组件也可以不引入就调用
app.mixin() {
  data() {
    return {
      number: 1
    }
  }
}

自定义的属性，组件中的优先级高于 mixin 属性的优先级
number: 1
this.$options.number 使用

修改组件和mixin 之间 使用数据的优先级
app.config.optionMergeStrategies.number = (mixinVal, appValue) => {
  return mixinVal || appValue;
}


<!-- 自定义指令 directive -->
    directive

全局自定义指令：
app.directive('focus', {
  mounted(el) {
    el.focus();
  }
})

局部自定义指令：
const directives = {
  focus: {
    mounted(el) {
      el.focus();
    }
  }
}
组件中： 
directives: directives,

使用 v-focus

如果想要使用数据绑定 v-pos="100"
app.directive('pos', {
  mounted(el, binding){
    el.style.top = (binding.value + 'px')
  }
})

如果生命周期函数，比如 mounted 和 updated 实现的功能一致
可以简写为：
app.directive('pos', (el, binding) => {
  el.style[binding.arg] = (binding.value + 'px')
})

v-pos:abc="xxx"
binding.arg = abc
el.style[binding.arg]


<!-- 传送门  teleprot -->
<teleport to="body">
<div><div>
</teleport>

<teleport to="#hello">


<!-- render -->
render funciton
template -> render -> h -> 虚拟DOM（JS对象）
-> 真实对象 -> 渲染展示

父组件 template:
<my-title :level="2">
hello world
</my-title>

render() {
  const { h } = Vue;
  return h('h' + this.level, {}, 
  [this.$slots.default(),
   h('h4', {}, ['aaa'])   //可以用一个数组，做多层嵌套
  ])
}

// 虚拟 DOM
{
  tagName: 'h2',
  text: 'hello world',
  attrtibutes: {}
}

第一个参数，定义标签是什么
第二个参数，{} 包含的属性
第三个参数，文本


<!-- 插件 -->
  plugin 插件
解决的问题：把通用性的功能封装起来

const myPlugin = {
  install(app, options) {
    
  }
}

使用： app.use(myPlugin)