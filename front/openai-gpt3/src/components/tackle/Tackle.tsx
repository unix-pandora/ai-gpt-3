import React from "react";
import "./tackle.scss";
// import { getOpenAiModel } from "../../api/model-build";
import axios from "axios";

class Tackle extends React.Component {
  constructor(props) {
    super(props);

    console.log("Tackle constructor...");
    console.dir(this);
  }

  state = {
    questionTextValue: "",
    answerTextValue: "",
    inputColumnNum: 40,
    inputRowNum: 5,
    outputColumnNum: 50,
    outputRowNum: 15,
    isReadOnly: true,
    timeRecordName: "time_record_now",
    timeLimitNumber: 20 * 1000,
    lastQuestionName: "Last_Question_Context",
    spaceRegExp: /^\s+$/, // 空格之正则式
  };

  //在组件的更新已经同步到DOM中之后立刻被调用,该方法不会在初始化渲染的时候调用,使用该方法可以在组件更新之后操作DOM元素
  componentDidUpdate(prevProps, prevState) {
    console.info("Tackle component did update...");
    console.dir(this);
    console.dir(prevProps, prevState);
  }

  handleInput = (type, event) => {
    console.dir(type, event);

    let value = event.target.value;
    let newState = {};
    newState[type] = value;
    this.setState(newState);
  };

  resetQuestionText = () => {
    this.setState({
      questionTextValue: "",
    });
  };

  setNowTime = () => {
    let times: any = Date.now();
    localStorage.setItem(this.state.timeRecordName, times);
  };

  judgeLimitTime = () => {
    let times = Date.now();

    let previousTimes = localStorage.getItem(this.state.timeRecordName);
    if (
      previousTimes === undefined ||
      previousTimes === "" ||
      previousTimes === null
    ) {
      return true;
    }

    let lastTime = parseInt(previousTimes);
    console.log(times + " - " + lastTime);

    if (times - lastTime <= this.state.timeLimitNumber) {
      alert(
        "切勿频繁提问,请20秒后再提问\nDon't ask questions frequently, please ask questions after 20 seconds"
      );
      return false;
    }

    return true;
  };

  verifyQuestText = (doubtInfo: string) => {
    console.info("verifyQuestText-doubtInfo:" + doubtInfo);

    if (
      doubtInfo.match(this.state.spaceRegExp) ||
      doubtInfo === null ||
      doubtInfo === undefined ||
      doubtInfo === ""
    ) {
      alert(
        "您没有输入任何内容,请重新输入问题\nYou have not entered anything, please re-enter the question"
      );
      return false;
    }
    return true;
  };

  verifyContextLimit = (doubtInfo: string) => {
    var leng = doubtInfo.length;
    console.dir("length: " + leng);

    //如果为true意为超出限制.假为反之
    if (leng > 1024) {
      alert(
        "超出上下文限制(1024个字符), 请减少字符后再提问\nExceeded the context limit (1024 characters), please reduce the characters before asking questions"
      );
      return false;
    }

    return true;
  };

  sendQuestion2 = (doubtInfo: string) => {
    let url = `http://localhost:3111/generate`;

    axios
      .post(
        url,
        { issue: doubtInfo },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((resp) => {
        console.dir(resp);
        const message = resp.data.text;
        console.log("message: " + message);

        this.setState({
          answerTextValue: message,
        });
        this.setNowTime();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  replaceStrSpace = () => {
    const textQuestion = this.state.questionTextValue
      .trim()
      .replace(/[\r\n]+/g, ",")
      .replace(/\s*,\s*/g, ",")
      .replace(/,+$/g, ""); //去除所提交的问题文本内容中的开头和末尾的空格,以及回车行和空白行
    console.log("textQuestion:\n" + textQuestion);
    return textQuestion;
  };

  //备份上一次提问互动完成的问题,提问时进行检测是否重复,避免浪费资源
  detectRepeat = (doubtInfo) => {
    var repeatFlag = true;
    var lastDoubtInfo = localStorage.getItem(this.state.lastQuestionName);
    console.log("lastDoubtInfo:  " + lastDoubtInfo);

    if (
      lastDoubtInfo !== null ||
      lastDoubtInfo !== undefined ||
      lastDoubtInfo !== ""
    ) {
      if (lastDoubtInfo === doubtInfo) {
        alert(
          "连续两次提问的内容一致,为了避免浪费资源,请重新输入另外的问题\nThe content of two consecutive questions is consistent. To avoid wasting resources, please re-enter another question"
        );
        repeatFlag = false;
      }
    }

    localStorage.setItem(this.state.lastQuestionName, doubtInfo);
    return repeatFlag;
  };

  uploadQuestion = () => {
    let text = this.replaceStrSpace();

    let verifyFlag = this.verifyQuestText(text);
    if (verifyFlag === false) {
      return;
    }
    console.log("pass through - 1");

    let timeFlag = this.judgeLimitTime();
    if (timeFlag === false) {
      return;
    }
    console.log("pass through - 2");

    let limitFlag = this.verifyContextLimit(text);
    if (limitFlag === false) {
      return;
    }
    console.log("pass through - 3");

    let repeat_flag = this.detectRepeat(text);
    if (repeat_flag === false) {
      return;
    }
    console.log("pass through - 4");

    this.sendQuestion2(text);
  };

  render() {
    return (
      <div className="form_div">
        <form id="mineSubmitForm">
          <div className="questLabelDiv">
            <label>
              <textarea
                form="mineSubmitForm"
                placeholder="请输入问题(每个问题的提问间隔时间为20秒)"
                cols={this.state.inputColumnNum}
                rows={this.state.inputRowNum}
                className="questionInput"
                wrap="hard"
                typeof="reset"
                value={this.state.questionTextValue}
                onChange={this.handleInput.bind(this, "questionTextValue")}
              ></textarea>
            </label>
          </div>
          <div className="btnsDiv">
            <div className="submitDiv">
              <input
                type="button"
                value="提交"
                className="submitInput"
                onClick={this.uploadQuestion}
              />
            </div>
            <div className="resetDiv">
              <input
                type="button"
                value="清空"
                className="resetInput"
                onClick={this.resetQuestionText}
              />
            </div>
          </div>
          <div className="answerLabelDiv">
            <label htmlFor="answerText"></label>
            <textarea
              wrap="hard"
              id="answerText"
              cols={this.state.outputColumnNum}
              rows={this.state.outputRowNum}
              readOnly={this.state.isReadOnly}
              value={this.state.answerTextValue}
            >
              {this.state.answerTextValue}
            </textarea>
          </div>
        </form>
      </div>
    );
  }
}

export default Tackle;
