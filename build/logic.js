var settings, questions;
var score = 0;
var questioncounter = 0;
var timerhelper;
var maxquestions;
var eventVars = {
  gameState: "gameOver",
  score: 0,
  done: false,
  timer: 0
};
$(document).ready(function(){
      initGame();
  });
  
async function initGame() {
  try {
      settings = await fetchJSON('settings.json');
      customizeGame(settings);
      questions = await fetchQuestions();
      preloadimages(questions);
      startGame();
  } catch (error) {
      console.error(error);
  }
}

async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`An error occurred: ${response.status}`);
  return response.json();
}

async function fetchQuestions() {
  const data = await fetchJSON('questions.json');
  return settings.randomizeQuestions ? shuffleArray(data.questions) : data.questions;
}

function customizeGame(settings) {
  $(':root').css('--main-color', settings['main-color']);
  $(':root').css('--accent-color', settings['accent-color']);
  $(':root').css('--text-color', settings['text-color']);
  $(':root').css('--text-color2', settings['text-color2']);
  $(':root').css('--feedback-true', "\""+settings['colorfeedbacktrue']+"\"");
  $(':root').css('--feedback-false', "\""+settings['colorfeedbackfalse']+"\"");
  $(':root').css('--timer', `${settings.questionwait}ms`);
  $('.game-wrapper').hide();

  $('.intro h1').text(settings["welcome"]["title"]);
  if(settings["welcome"]["banner"]){
    $('.intro-banner img').attr("src","c_intro-rectangle_1.png");
  }else{
    $('.intro-banner img').hide();
  }
  $('.intro p').text(settings["welcome"]["message"]);
  $('.startbtn').text(settings["welcome"]["startbtn"]);
  $('.startbtn').off('click').on('click', startQuestions);
  if(settings["showscore"]){
    $(".header #score-counter").show();
  }else{
    $(".header #score-counter").hide();
  }
  $(".header .profile span").empty().text(settings["sender"]);
}

function startGame() {
  setTimeout( function(){
    document.getElementById("splashscreen").style.display = "none";
    if (!settings["mute"]){
      document.getElementById("backgroundmusic").muted = false;
    }
    document.getElementById("backgroundmusic").play();
  },2000);
}

function startQuestions() {
  $(".intro-wrapper").hide();
  $(".game-wrapper").show();
  questioncounter = 0;
  score = 0;
  nextMessage()
}

function nextMessage(){
  if(questioncounter < questions.length){
    currentquestion = questions[questioncounter];
    receiveMessage(currentquestion);
  }else{
    console.log("end");
    $(".phone-screen .choice-area").empty();
    $("video").each(function(i,e){
      $(e)[0].pause();
    });
    var eventVars = {
      gameState: "gameOver",
      score: score,
      done: true,
      timer: 0
    };
    gameOverEvent =  new CustomEvent('gameOver', {detail: eventVars } );
    document.getElementById("backgroundmusic").muted = true;
    document.getElementById("backgroundmusic").pause();
    window.parent.document.dispatchEvent(gameOverEvent);
  }
}

function receiveMessage(question){
  let imgmsg = null;
  let textmsg = null;
  if(question.img){
    imgmsg = $("<div></div>",{"class":"message received"}).append($("<img />",{"src":question.img}));
  }
  if(question.vid){
    imgmsg = $("<div></div>",{"class":"message received"}).append($("<video/>",{"src":question.vid,"loop":true,"autoplay":true}).on("click",function(){
      let video = $(this)[0];
      console.log(video);
      if (video.paused){
        video.play();
      }else{
        video.pause();
      }
    }));
  }
  if(question.question){
    textmsg = $("<div></div>",{"class":"message received"}).text(question.question.toString().replace(/<br\s*[\/]?>/gi, "\n"));
  }
  if(imgmsg && textmsg){
    $(".phone-screen .chat-list").append(imgmsg);
    $(".phone-screen .chat-list").animate({scrollTop:$(".phone-screen .chat-list").prop('scrollHeight')},{
      duration:750,
      queue:true,
      ease:"swing",
      done:function(){
        $(".phone-screen .chat-list").append(textmsg);
        $(".phone-screen .chat-list").animate({scrollTop:$(".phone-screen .chat-list").prop('scrollHeight')},{
          duration:750,
          queue:true,
          ease:"swing",
          done:function(){
            prepareanswers(question.answers);
          }
        });
      }
    });
    return;
  }
  if(imgmsg){
    $(".phone-screen .chat-list").append(imgmsg);
    $(".phone-screen .chat-list").animate({scrollTop:$(".phone-screen .chat-list").prop('scrollHeight')},{
      duration:750,
      queue:true,
      ease:"swing",
      done:function(){
        prepareanswers(question.answers);
      }
    });
    return;
  }
  if(textmsg){
    $(".phone-screen .chat-list").append(textmsg);
    $(".phone-screen .chat-list").animate({scrollTop:$(".phone-screen .chat-list").prop('scrollHeight')},{
      duration:750,
      queue:true,
      ease:"swing",
      done:function(){
        prepareanswers(question.answers);
      }
    });
    return;
  }
}

function prepareanswers(answers){
  if(settings.randomizeanswers){
    answers = shuffleArray(answers);
  }
  $(".phone-screen .choice-area").empty();
  answers.forEach(element => {
    let answer = $("<div></div>",{"class":"choice"}).data("score",element.points).css("opacity","0");
    if(element.img){
      answer.append($("<img />",{"src":element.img}));
    }
    if(element.text){
      answer.append($("<div></div>").text(element.text.toString().replace(/<br\s*[\/]?>/gi, "\n")));
    }
    answer.off("click").one("click",function(){
      let answer = element;
      $(this).addClass("clicked");
      $("video").each(function(i,e){
        $(e)[0].pause();
      });
      sendMessage(answer);
    });
    $(".phone-screen .choice-area").append(answer);
    answer.animate({opacity:1},{
      duration:300,
      queue:true,
      ease:"linear"
    });
  });
}

function sendMessage(answer){
  let imgmsg = null;
  let textmsg = null;
  setTimeout(function(){$(".phone-screen .choice-area > *").fadeOut(300,function(){$(".phone-screen .choice-area").empty()})},250);
  if(answer.img){
    imgmsg = $("<div></div>",{"class":"message sent"}).append($("<img />",{"src":answer.img}));
  }
  if(answer.text){
    textmsg = $("<div></div>",{"class":"message sent"}).text(answer.text.toString().replace(/<br\s*[\/]?>/gi, "\n"));
  }

  if(imgmsg && textmsg){
    $(".phone-screen .chat-list").append(imgmsg);
    $(".phone-screen .chat-list").animate({scrollTop:$(".phone-screen .chat-list").prop('scrollHeight')},{
      duration:750,
      queue:true,
      ease:"swing",
      done:function(){
        $(".phone-screen .chat-list").append(textmsg);
        $(".phone-screen .chat-list").animate({scrollTop:$(".phone-screen .chat-list").prop('scrollHeight')},{
          duration:750,
          queue:true,
          ease:"swing",
          done:function(){
            resolveAnswer(answer.points);
          }
        });
      }
    });
    return;
  }
  if(imgmsg){
    $(".phone-screen .chat-list").append(imgmsg);
    $(".phone-screen .chat-list").animate({scrollTop:$(".phone-screen .chat-list").prop('scrollHeight')},{
      duration:750,
      queue:true,
      ease:"swing",
      done:function(){
        resolveAnswer(answer.points);
      }
    });
    return;
  }
  if(textmsg){
    $(".phone-screen .chat-list").append(textmsg);
    $(".phone-screen .chat-list").animate({scrollTop:$(".phone-screen .chat-list").prop('scrollHeight')},{
      duration:750,
      queue:true,
      ease:"swing",
      done:function(){
        resolveAnswer(answer.points);
      }
    });
    return;
  }
}

function resolveAnswer(points){
  let imgmsg = null;
  let textmsg = null;
  score += parseInt(points);
  questioncounter++;
  $("#scoreValue").empty().text(score);
  if(settings.colorfeedback){
    if(points > 0){
      $(".chat-list .message.sent").last().addClass("true");
    }else{
      $(".chat-list .message.sent").last().addClass("false");
    }
  }
  if(currentquestion.feedback){
    if(currentquestion.feedback.true && points > 0){
      if(currentquestion.feedback.true.img){
        imgmsg = $("<div></div>",{"class":"message received"}).append($("<img />",{"src":currentquestion.feedback.true.img}));
      }
      if(currentquestion.feedback.true.text){
        textmsg = $("<div></div>",{"class":"message received"}).text(currentquestion.feedback.true.text.toString().replace(/<br\s*[\/]?>/gi, "\n"));
      }
    }else if(currentquestion.feedback.false && points <= 0){
      if(currentquestion.feedback.false.img){
        imgmsg = $("<div></div>",{"class":"message received"}).append($("<img />",{"src":currentquestion.feedback.false.img}));
      }
      if(currentquestion.feedback.false.text){
        textmsg = $("<div></div>",{"class":"message received"}).text(currentquestion.feedback.false.text.toString().replace(/<br\s*[\/]?>/gi, "\n"));
      }
    }else{
      setTimeout(nextMessage,settings.questionwait);
      return;
    }
    if(imgmsg && textmsg){
      $(".phone-screen .chat-list").append(imgmsg);
      $(".phone-screen .chat-list").animate({scrollTop:$(".phone-screen .chat-list").prop('scrollHeight')},{
        duration:750,
        queue:true,
        ease:"swing",
        done:function(){
          $(".phone-screen .chat-list").append(textmsg);
          $(".phone-screen .chat-list").animate({scrollTop:$(".phone-screen .chat-list").prop('scrollHeight')},{
            duration:750,
            queue:true,
            ease:"swing",
            done:function(){
              setTimeout(nextMessage,settings.questionwait);
            }
          });
        }
      });
      return;
    }
    if(imgmsg){
      $(".phone-screen .chat-list").append(imgmsg);
      $(".phone-screen .chat-list").animate({scrollTop:$(".phone-screen .chat-list").prop('scrollHeight')},{
        duration:750,
        queue:true,
        ease:"swing",
        done:function(){
          setTimeout(nextMessage,settings.questionwait);
        }
      });
      return;
    }
    if(textmsg){
      $(".phone-screen .chat-list").append(textmsg);
      $(".phone-screen .chat-list").animate({scrollTop:$(".phone-screen .chat-list").prop('scrollHeight')},{
        duration:750,
        queue:true,
        ease:"swing",
        done:function(){
          setTimeout(nextMessage,settings.questionwait);
        }
      });
      return;
    }
    setTimeout(nextMessage,settings.questionwait);
    return;
  }else{
    setTimeout(nextMessage,settings.questionwait);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function preloadimages(content){
  content.forEach(function(element){
    if(element.img){
      $('<img />').attr('src',element.img).appendTo('body').css('display','none');
    }
    if(element.answers){
      element.answers.forEach(function(element){
        if(element.img){
          $('<img />').attr('src',element.img).appendTo('body').css('display','none');
        }
      });
    }
  });
}