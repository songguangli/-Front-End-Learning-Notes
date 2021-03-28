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
    values: {Name：＂小明＂，Age: 20, Sex:　＂男＂}
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

