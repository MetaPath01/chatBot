<template>
  <div class="service-dialog">
      <div class="top-title">
          <div class="left">GPTbot</div>
      </div>
      <div class="content" ref="chatContent">
          <div class="chat-list">
              <div class="answer">
                  <img src="./assets/img/chatbot.png" alt="">
                  <div class="text-content">
                      <div class="inner">
                        Welcome to GPTbot, we will embark on a magical AI journey for you.
                      </div>
                  </div>
              </div>
          </div>
          <div class="chat-list" v-for="(item,index) in chatList" :key="index" :class="item.role == 'user' ? 'right-content' : ''">
              <div v-if="item.role == 'user'" class="question">
                  <div class="text-content">
                      <div class="inner">
                          {{item.content}}
                      </div>
                  </div>
                  <img src="./assets/img/user.png" alt="">
              </div>
              <div v-if="item.role == 'assistant'" class="answer">
                  <img src="./assets/img/chatbot.png" alt="">
                  <div class="text-content">
                      <div class="inner">
                          {{item.content}}
                      </div>
                  </div>
              </div>
          </div>
          <div class="chat-list" v-if="loading">
              <div class="answer">
                  <img src="./assets/img/chatbot.png" alt="">
                  <div class="text-content">
                      <div class="inner">
                          <div v-if="step == 1" class="three-bounce"><div class="one"></div><div class="two"></div><div class="three"></div></div>
                          <TextComponents ref="TextComponents" @onComplete="onComplete"  v-if="step == 2" :text="showText" />
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div class="bottom-input">
          <button class="stop" v-if="loading && step == 2" @click="stop">
              <img src="./assets/img/stop.png" alt="">
              Stop generating
          </button>
          <button class="regenerateResponse" v-if="!loading && step == 3" @click="regenerateResponse">
              <img src="./assets/img/repeat.png" alt="">
              Regenerate  response
          </button>
          <input class="input" placeholder="Type a message to GPTbot..." v-model="question" type="text" v-on:keyup.enter="send">
          <button class="send" @click="send">
              <img src="./assets/img/iconsend.png" alt="">
          </button>
      </div>
  </div>
</template>

<script>
import TextComponents from './components/TextComponents.vue'
import axios from 'axios'
export default {
  name: 'WidgetServiceDialog',

  data() {
      return {
          question:'',
          chatList: JSON.parse(localStorage.getItem('chatGptList')) || [],
          loading: false,
          step: '1',
          showText: '', 
      };
  },
  components:{
      TextComponents
  },
  computed:{

  },
  mounted() {
      const self = this
      setTimeout(() => {
              self.scrollToBottom() 
          },100)
  },
  watch:{
     'chatList.length'(){
      localStorage.setItem('chatGptList',JSON.stringify(this.chatList))
     }
  },
  methods: {
      async mpcbot(data){
          this.loading = true
          this.step = 1
          if(data){
              this.chatList.push(data)
          }
          try{
            const res = await axios.post('https://www.swftc.info/ai/mpcbot',{
              content: this.chatList,
              "equipmentNo":"4meAzpfBDrBmp4wSUjHmzQAwvBJ6TaJ8",
              "sourceFlag":"widget"
              
            })
            const result = res.data
            console.log(result)
              if(result.resCode == 800){
                  this.showText = result.data.content
                  this.step = 2
              }else{
                  this.loading = false
                  this.step = 3
              }
          }catch(err){
              this.loading = false
              this.step = 3
          }
      },
      async send(){
          const self = this
          if(self.loading || this.question == ''){
               return
          }
          const chat = {
              role: 'user',
              content:this.question,
          }
          self.chatList.push(chat)
          self.question = ''
          self.mpcbot()
          setTimeout(() => {
              self.scrollToBottom() 
          },500)
      },
      onComplete(text){
          const self = this
          const chat = {
              role: 'assistant',
              content:text,
          }
          self.chatList.push(chat)
          self.loading = false
          setTimeout(() => {
              self.step = 3
          },100)
      },
      scrollToBottom() {
          var element = this.$refs.chatContent;
          element.scrollTop = element.scrollHeight;
      },
      regenerateResponse(){
          const userList = this.chatList.filter( item => item.role == 'user')
          const data = {
              role: 'user',
              content: userList[userList.length - 1].content
          }
          this.mpcbot(data)
          const self = this
          setTimeout(() => {
              self.scrollToBottom() 
          },500)
      },
      stop(){
          this.$refs.TextComponents.stop()
      },
  },
};
</script>

<style lang="scss" scoped>
.service-dialog{
  margin: 0 auto;
  width: 90%;
  height: 90vh;
  margin-top: 5vh;
  background: #FFFFFF;
  border-radius: .5rem;
  opacity: 1;
  border: 1px solid #E2E2E2;
  box-sizing: border-box;
  padding: .8rem .3rem .3rem .3rem;
  display: flex;
  flex-direction: column;
 
  .top-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: .2rem;
      position: relative;
      .close-AI{
          width: .45rem;
          position: absolute;
          right: 0;
          top: -.6rem;
          cursor: pointer;
      }
      .left{
          font-size: .4rem;
          font-family: Poppins-SemiBold, Poppins;
          font-weight: 600;
          color: #000000;
      }
      .right{
          display: flex;
          align-items: center;
          height: .8rem;
          padding: 0 .2rem;
          background: #F4F8FF;
          border-radius: .8rem;
          opacity: 1;
          cursor: pointer;
          font-size: .25rem;
          font-family: Poppins-SemiBold, Poppins;
          font-weight: 600;
          color: #050505;
          .service-img{
              width: .6rem;
              margin-right: .1rem;
          }
      }
  }
  .content{
      flex: 1;
      overflow: hidden;
      overflow-y: auto;
      padding: .2rem 0 1.3rem;
      .chat-list{
          text-align: left;
          display: flex;
          margin-top: .3rem;
         &.right-content{
          justify-content: flex-end;
         }
          .question,.answer{
              display: flex;
              width: calc(100% - 1rem);
              img{
                  width: .8rem;
                  height: .8rem;
              }
             .text-content{
                  flex: 1;
                  min-height: 1rem;
                  box-sizing: border-box;
                  display: flex;
                  align-items: center;
                  .inner{
                      padding: .2rem;
                      font-size: 14px;
                      font-family: Poppins-Regular, Poppins;
                      font-weight: 400;
                  }
              }
          }
          .question{
              .text-content{
                  justify-content: flex-end;
                  .inner{
                      margin-right: .1rem;
                      background: #277FFA;
                      border-radius: .25rem .1rem  .25rem  .25rem;
                      color: #FFFFFF;
                  }
              }
             
          }
          .answer{
              .text-content{
                 .inner{
                  margin-left: .1rem;
                  background: #F4F8FF;
                  border-radius:  .1rem  .25rem  .25rem .25rem;
                 }
              }
          }
      }
    
  }
  .bottom-input{
      position: relative;
      padding-top: .2rem;
      .input{
          width: 100%;
          height: 1rem;
          background: #FFFFFF;
          opacity: 1;
          border: 1px solid #E2E2E2;
          border-radius: .2rem;
          box-sizing: border-box;
          padding: 0 2rem 0 .2rem;
          font-size: 0.3rem;
          font-family: Poppins-Regular, Poppins;
          &::placeholder {
              font-family: Poppins-Regular, Poppins;
          }
      }
      .stop,.regenerateResponse{
          border: 1px solid #277FFA;
          border-radius: .1rem;
          background: #FFFFFF;
          cursor: pointer;
          display: flex;
          align-items: center;
          height: .7rem;
          font-size: .26rem;
          font-family: Poppins-Regular, Poppins;
          font-weight: 400;
          color: #277FFA;
          position: absolute;
          bottom: .9rem;
          left: 50%;
          transform: translate(-50%, -50%);
          img{
              width: .4rem;
              height: .4rem;
              margin-right: .1rem;
          }
      }
      .send{
          position: absolute;
          right: .2rem;
          top: .3rem;
          width: 1.6rem;
          height: .8rem;
          border: none;
          cursor: pointer;
          border-radius: .1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          background: #277ffa;
          img{
              width: .6rem;
          }
      }
  }
}
</style>
<style>
.three-bounce {
  text-align: left;
  display: flex;
  align-items: center;
}
.three-bounce .one {
  -webkit-animation-delay: -.32s;
  animation-delay: -.32s;
}
.three-bounce .two {
  -webkit-animation-delay: -.16s;
  animation-delay: -.16s;
}
.three-bounce>div {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 100%;
  top: 50%;
  background: #aeadba;
  -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
  animation: bouncedelay 1.4s infinite ease-in-out;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@keyframes bouncedelay {
  0%,100%,80% {
      transform: scale(0);
      -webkit-transform: scale(0)
  }

  40% {
      transform: scale(1);
      -webkit-transform: scale(1)
  }
}
</style>