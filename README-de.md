# Chat Game

[Englische Version](README-de.md)

## Einführung

Generative KI boomt und mit ihr die Erstellung von Fakes und Deep Fakes. Gleichzeitig fehlt es an kurzweiligen und leicht in der Schule einsetzbaren Übungen zum Thema Deep Fake-Erkennung. Hier setzt das Projekt Fight Fakes an, bei dem eine Spielumgebung entwickelt wurde, in der Jugendliche spielerisch lernen können, Informationen schnell und intuitiv zu bewerten. 

Das Chat Game ist Teil von Fight Fakes. In diesem Spiel wird ein Chat simuliert um Textnachrichten, Bilder und Videos zu versenden und von den Spieler:innen beantworten zu lassen. 

Das Projekt Fight Fakes ist ein Projekt der [ÖIAT (Austrian Institute for Applied Telecommunication)](https://oiat.at/)-Initiatitve [Saferinternet.at](https://saferinternet.at/) und wurde von durch eine [netidee](https://www.netidee.at/)-Förderung ermöglicht. Hier finden Sie weitere Informationen zum Projekt: [https://www.saferinternet.at/projekte/fight-fakes](https://www.saferinternet.at/projekte/fight-fakes)

## Konfiguration
### Design
In der Datei settings.json kann der Style des Games angepasst werden. Folgende Einstellungen stehen zur Verfügung:

- main-color `CSS Color`  
    Farbe des Hintergrunds und deiner Nachrichten
- accent-color `CSS Color`  
    Farbe für Akzente und Spielernachrichten
- text-color `CSS Color`  
    Schriftfarbe deiner Nachrichten
- text-color2 `CSS Color`  
    Schriftfarbe der Spielernachrichten
- welcome  
    Inhalt des Startbildschirm. `banner` ist optional, zum Ausblenden auf `false` setzen.

Die im Spielordner enthaltenen Bilder, Icons und Hintergrundmusik können durch andere Dateien im selben Format ersetzt werden.

### Einstellungen
In der Datei settings.json können ebenfalls die Einstellungen des Spiels angepastt werden.

- sender `string`  
  Name des Chatpartners, wird im Spiel angezeigt
- randomizeanswer `bool`  
  Zeigt die Antworten in zufäliger Reihenfolge an
- questionwait `int`  
  Zeit zwischen 2 Fragen in ms
- colorfeedback `bool`  
  Zeigt Emoji-Reaktionen für richtige/falsche Antworten
- showscore `bool`  
  Zeigt den Punktestand im Spiel an
- colorfeedbacktrue / colorfeedbackfalse `string`  
  Emoji das als jeweilige Reaktion verwendet wird
- mute `bool`  
  deaktiviert die Hintergrundmusik

### Fragen und Antworten
Die Chatnachrichten können über die Datei questions.json konfiguriert werden.
Die Datei enthält ein object "questions" das beliebig viele Frage-Objekte enthalten kann. Struktur eines Fragenobjekts:

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
  Nachricht an den Spieler
- img `string` *optional*   
  Bild als Nachricht. Wird ignoriert falls Video gesetzt wird
- vid `string` *optional*  
  Video als Nachricht
- feedback `object` *optional*  
  Sendet eine Nachricht, je nachdem ob die Frage richtig oder falsch beantwortet wurde. kann `text` und/oder `img` enthalten
- answers `array`  
  Antwortmöglichkeiten die dem Spieler zur Verfügung stehen. Jede Antwort als `object` : 
    - text `string` *optional*  
      Nachricht
    - img `string` *optional*  
      Bild. Text und BIld können kombiniert werdern
    - points `int`
      Punkte dieser Antwortmöglichkeit. > 0 wird als richtige Antwort gewertet (siehe feedback)

