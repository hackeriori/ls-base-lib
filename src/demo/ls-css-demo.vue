<template>
  <div class="height100" style="padding: 2em;box-sizing: border-box">
    <el-scrollbar>
      <div class="title">absolute绝对布局</div>
      <div class="detail">外边框使用<span class="highlight">ls-abs-outer</span>来相对定位</div>
      <div class="detail">内边框使用<span class="highlight">ls-abs-inner</span>来绝对定位</div>
      <div class="ls-abs-outer bigBox">
        <div class="ls-abs-inner smallBox"></div>
      </div>
      <div class="title">flex布局</div>
      <div class="detail">外边框使用<span class="highlight">ls-flex ls-flex-center ls-flex-centerV</span>来相对定位
      </div>
      <div class="ls-flex ls-flex-center ls-flex-centerV bigBox">
        <div class="smallBox"></div>
      </div>
      <div class="title">flex自动换行</div>
      <div class="detail">外边框使用<span class="highlight">ls-flexWap</span>来换行</div>
      <div class="ls-flexWap middleBox">
        <div v-for="(item,index) in 6" :key="index" class="miniBox" style="margin:5px 10px">{{ item }}</div>
      </div>
      <div class="detail">外边框使用<span class="highlight">ls-flexWapV</span>来换行</div>
      <div class="ls-flexWapV middleBox">
        <div v-for="(item,index) in 6" :key="index" class="miniBox" style="margin:5px 10px">{{ item }}</div>
      </div>
      <div class="title">flex对齐方式</div>
      <div class="detail">外边框使用<span class="highlight">ls-flex ls-flex-end</span>来对齐主轴</div>
      <div class="ls-flex ls-flex-end middleBox">
        <div v-for="(item,index) in 2" :key="index" class="miniBox" style="margin:5px 10px">{{ item }}</div>
      </div>
      <div class="detail">外边框使用<span class="highlight">ls-flex ls-flex-endV</span>来对齐交叉轴</div>
      <div class="ls-flex ls-flex-endV middleBox">
        <div v-for="(item,index) in 2" :key="index" class="miniBox" style="margin:5px 10px">{{ item }}</div>
      </div>
      <div class="detail">外边框使用<span class="highlight">ls-flex ls-flex-between</span>来对齐主轴</div>
      <div class="ls-flex ls-flex-between middleBox">
        <div v-for="(item,index) in 2" :key="index" class="miniBox" style="margin:5px 10px">{{ item }}</div>
      </div>
      <div class="detail">外边框使用<span class="highlight">ls-flex ls-flex-around</span>来对齐主轴</div>
      <div class="ls-flex ls-flex-around middleBox">
        <div v-for="(item,index) in 2" :key="index" class="miniBox" style="margin:5px 10px">{{ item }}</div>
      </div>
      <div class="detail">外边框使用<span class="highlight">ls-flex ls-flex-evenly</span>来对齐主轴</div>
      <div class="ls-flex ls-flex-evenly middleBox">
        <div v-for="(item,index) in 2" :key="index" class="miniBox" style="margin:5px 10px">{{ item }}</div>
      </div>
      <div class="title">flex子项属性</div>
      <div class="detail">外边框<span class="highlight">ls-flex ls-flex-unShrink</span>来批量设置不缩小</div>
      <div class="detail">内边框2使用<span class="highlight">ls-flex-subItem-grow</span>来占据剩余空间</div>
      <div class="ls-flex ls-flex-unShrink ls-flex-centerV middleBox">
        <div class="miniBox" style="margin:5px 10px">1</div>
        <div class="miniBox ls-flex-subItem-grow" style="margin:5px 10px">2</div>
        <div class="miniBox" style="margin:5px 10px">3</div>
      </div>
      <div class="detail">外边框<span class="highlight">ls-flexV ls-flex-unShrink</span>来批量设置不缩小</div>
      <div class="detail">内边框1使用<span class="highlight">ls-flex-subItem-growV</span>来占据剩余空间</div>
      <div class="ls-flexV ls-flex-unShrink ls-flex-centerV bigBox">
        <div class="miniBox ls-flex-subItem-growV" style="margin:5px 10px">1</div>
        <div class="miniBox" style="margin:5px 10px">2</div>
        <div class="miniBox" style="margin:5px 10px">3</div>
      </div>
      <div class="title">文本超出长度后显示省略号，使用<span class="highlight">ls-text-unWarp</span>来省略</div>
      <div class="textBox ls-text-unWarp" title="这是一个比较长的测试文字">这是一个比较长的测试文字</div>
      <div class="title">文本超出长度后显示省略号，使用<span class="highlight">ls-text-unWarp ls-text-rtl</span>来省略，并且省略前部分
      </div>
      <div class="textBox ls-text-unWarp ls-text-rtl" title="这是一个比较长的测试文字">这是一个比较长的测试文字</div>
      <div class="title">文本居中显示，使用<span class="highlight">ls-text-center</span>来居中</div>
      <div class="textBox ls-text-center">居中显示</div>
      <div class="title">鼠标悬浮样式<span class="highlight">ls-text-hover</span>鼠标移上去后变成蓝色(--el-color-primary)</div>
      <div class="textBox ls-text-hover">鼠标移上去</div>
      <div class="title">文本间隔一行<span class="highlight">ls-marginV-1</span></div>
      <div style="border:1px solid var(--el-border-color)">
        <div class="textBox ls-marginV-1">我上下有一行</div>
      </div>
      <div class="title">文本间隔半行<span class="highlight">ls-marginV-half</span></div>
      <div style="border:1px solid var(--el-border-color)">
        <div class="textBox ls-marginV-half">我上下有半行</div>
      </div>
      <div class="title">文本间隔一行<span class="highlight">ls-paddingV-1</span></div>
      <div style="border:1px solid var(--el-border-color)">
        <div class="textBox ls-paddingV-1">我上下有一行</div>
      </div>
      <div class="title">文本间隔半行<span class="highlight">ls-paddingV-half</span></div>
      <div style="border:1px solid var(--el-border-color)">
        <div class="textBox ls-paddingV-half">我上下有半行</div>
      </div>
      <div class="title">类似的还有ls-<code style="color: #48df1e">(padding|margin)</code><code
        style="color: #0d84ff">(V|H|Top|Right|Bottom|Left)</code>-<code style="color: brown">([1,2])([half])</code>
      </div>
      <div class="title">面板样式<span class="highlight">ls-panel</span>，面板带有圆角，阴影和边框</div>
      <div class="middleBox ls-panel" style="background-color: white">
      </div>
      <div class="title">宽度100%<span class="highlight">width100</span>观察蓝色部分占比</div>
      <div class="textBox ls-flex">
        <div style="width: 50%">
          <div style="width: 1em;height: 1em;background-color: #0d84ff">1em</div>
        </div>
        <div style="width: 50%">
          <div class="width100" style="height: 1em;background-color: #0d84ff">100%</div>
        </div>
      </div>
      <div class="title">从右侧进入动画，需结合vue transition组件使用，设置name<span class="highlight">ls-am-right</span>
      </div>
      <el-button @click="showRightPanel=!showRightPanel" size="small" type="primary">
        {{ showRightPanel ? '离开' : '进入' }}
      </el-button>
      <div class="middleBox ls-abs-outer" style="overflow: hidden">
        <transition name="ls-am-right">
          <div v-if="showRightPanel" class="panelBox" style="right:0;height:100%;width:50px;top:0"></div>
        </transition>
      </div>
      <div class="title">从下方进入动画，需结合vue transition组件使用，设置name<span class="highlight">ls-am-bottom</span>
      </div>
      <el-button @click="showBottomPanel=!showBottomPanel" size="small" type="primary">
        {{ showBottomPanel ? '离开' : '进入' }}
      </el-button>
      <div class="middleBox ls-abs-outer" style="overflow: hidden">
        <transition name="ls-am-bottom">
          <div v-if="showBottomPanel" class="panelBox" style="left:0;height:50px;width:100%;bottom: 0"></div>
        </transition>
      </div>
      <div class="title">从左侧进入动画，需结合vue transition组件使用，设置name<span class="highlight">ls-am-left</span>
      </div>
      <el-button @click="showLeftPanel=!showLeftPanel" size="small" type="primary">
        {{ showLeftPanel ? '离开' : '进入' }}
      </el-button>
      <div class="middleBox ls-abs-outer" style="overflow: hidden">
        <transition name="ls-am-left">
          <div v-if="showLeftPanel" class="panelBox" style="left:0;height:100%;width:50px;top: 0"></div>
        </transition>
      </div>
      <div class="title">从上方进入动画，需结合vue transition组件使用，设置name<span class="highlight">ls-am-top</span>
      </div>
      <el-button @click="showTopPanel=!showTopPanel" size="small" type="primary">
        {{ showTopPanel ? '离开' : '进入' }}
      </el-button>
      <div class="middleBox ls-abs-outer" style="overflow: hidden">
        <transition name="ls-am-top">
          <div v-if="showTopPanel" class="panelBox" style="left:0;height:50px;width:100%;top: 0"></div>
        </transition>
      </div>
      <div class="title">从中间进入动画，需结合vue transition组件使用，设置name
        <span class="highlight">ls-am-center</span>，适用于translate(-50%,-50%)的方式居中
      </div>
      <el-button @click="showCenterPanel=!showCenterPanel" size="small" type="primary">
        {{ showCenterPanel ? '离开' : '进入' }}
      </el-button>
      <div class="middleBox ls-abs-outer" style="overflow: hidden">
        <transition name="ls-am-center">
          <div v-if="showCenterPanel" class="panelBox ls-abs-inner" style="height:50px;width:100px"></div>
        </transition>
      </div>
      <div class="title">从中间进入动画，需结合vue transition组件使用，设置name
        <span class="highlight">ls-am-center-fix</span>，适用于设置了Left,Top,Right,Bottom这类方式的固定位置
      </div>
      <el-button @click="showCenterFixPanel=!showCenterFixPanel" size="small" type="primary">
        {{ showCenterFixPanel ? '离开' : '进入' }}
      </el-button>
      <div class="middleBox ls-abs-outer" style="overflow: hidden">
        <transition name="ls-am-center-fix">
          <div v-if="showCenterFixPanel" class="panelBox" style="height:50px;width:100px;left: 2em;top:1em"></div>
        </transition>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'ls-css-test',
  data() {
    return {
      showRightPanel: false,
      showBottomPanel: false,
      showLeftPanel: false,
      showTopPanel: false,
      showCenterPanel: false,
      showCenterFixPanel: false
    }
  }
})
</script>

<style scoped>
.title {
  color: var(--el-text-color-primary);
  margin: 1em 0;
}

.detail {
  color: var(--el-text-color-regular);
  margin: 1em 0;
  font-size: 14px;
}

.highlight {
  color: var(--el-color-warning);
  margin: 0 0.3em;
}

.bigBox {
  background-color: var(--el-color-info);
  width: 300px;
  height: 300px;
}

.smallBox {
  background-color: var(--el-color-danger);
  width: 200px;
  height: 200px;
}

.middleBox {
  background-color: var(--el-color-info);
  width: 300px;
  height: 150px;
}

.miniBox {
  background-color: var(--el-color-danger);
  width: 45px;
  height: 45px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.textBox {
  width: 8em;
  background-color: var(--el-color-info);
}

.panelBox {
  position: absolute;
  background-color: var(--el-color-danger);
}
</style>
