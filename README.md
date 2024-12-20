# Chat Game
## Introduction

Generative AI is booming, and so is the creation of fakes and deep fakes. At the same time, there is a lack of fun and easy-to-use deep fake detection exercises in schools. This is where Fight Fakes comes in, developing a game environment where young people can playfully learn to evaluate information quickly and intuitively. 

The Chat Game is part of Fight Fakes. This game simulates a chat where text messages, pictures and videos can be sent and answered by other players. 

Fight Fakes is a project of the [ÖIAT](https://oiat.at/) initiatitve [Saferinternet.at](https://saferinternet.at/) and was funded by [netidee](https://www.netidee.at/). More information about the project can be found here: [https://www.saferinternet.at/projekte/fight-fakes](https://www.saferinternet.at/projekte/fight-fakes).

## Configuration
### Design
The style of the game can be customised in the settings.json file. The following options are available:

- main-color `CSS Color`  
    colour of the background and your messages
- accent-color `CSS Color`  
    colour for accents and player messages
- text-color `CSS Color`  
    font color of your messages
- text-color2 `CSS Color`  
    font colour of player messages
- welcome  
    splash screen: `banner` is optional, set to `false` to hide

The images, icons, and background music that are included in the game folder can be replaced with other files of the same format.

### Settings
The game settings can also be customised in the settings.json file.

- sender `string`  
  chat partner's name, displayed in game
- randomizeanswer `bool`  
  shows cards in random order
- questionwait `int`  
  time between two cards
- colorfeedback `bool`  
  displays emoji reactions for correct/incorrect answers
- showscore `bool`  
  displays the score in the game
- colorfeedbacktrue / colorfeedbackfalse `string`  
  Emoji das als jeweilige Reaktion verwendet wird
- mute `bool`  
  deactivates background music

### Questions and Answers
The messages can be configured using the questions.json file.
The file contains a 'questions' object which can contain any number of card objects. Structure of a card object:

```
{
  "question": "Hey there! Do you know what Pixelshakes is?",
  "feedback": {
    "true": {
      "text": "Yes exactly!"
    },
    "false": {
      "text": "Pixelshakes is an easy to use tool for creating custom marketing games."
    }
  },
  "answers": [
    {
      "text": "Yes, it\u0027s an easy to use tool for creating custom marketing games.",
      "points": 5
    },
    {
      "text": "Pixelshakes? Sounds yummy, i think it\u0027s like a desert?",
      "points": -3
    },
    {
      "text": "Never heard of it...",
      "points": -1
    }
  ]
}
```

- question `string`  
  message to player
- img `string` *optional*   
  image image as message, ignored if video is set
- vid `string` *optional*  
  video as message
- feedback `object` *optional*  
  sends a message depending on whether the question was answered correctly or incorrectly. can contain `text` and/or `img` 
- answers `array`  
  answer options available to the player, each answer as `object`: 
    - text `string` *optional*  
      message
    - img `string` *optional*  
      image, text and image can be combined
    - points `int`
      points for this answer choice. > 0 counts as a correct answer (see feedback)

## Credits
The Swipe Game was developed by [bytewood](https://bytewood.com/) and uses [jQuery](https://jquery.com). 