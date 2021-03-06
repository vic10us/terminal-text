import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/utils/async.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import 'web-animations-js/web-animations.min.js';
/**
 * # Awesome Retro Terminal Text Element
 * `<terminal-text>`
 * An element that simulates the old-school terminals of the 70s and 80s
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class TerminalText extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        --terminal-text-text-color0: var(--terminal-text-text-color, #000000);
        --terminal-text-pre-text-color0: var(--terminal-text-pre-text-color, #000000);
        --terminal-text-cursor-color0: var(--terminal-text-cursor-color, #000000);
      }
      .cursor {
        color: var(--terminal-text-cursor-color0);
        font-weight: 600;
      }
      .animated-text {
        white-space: pre-line;
        color: var(--terminal-text-text-color0);
        @apply --terminal-text-text;
      }
      .pre-text {
        color: var(--terminal-text-pre-text-color0);
        font-weight: 600;
        @apply --terminal-text-pre-text;
      }
    </style>
    <span class="pre-text">
      <slot>[[prefix]]</slot>
    </span>
    <span class="animated-text">[[ _outputText ]]<span id="cursor" hidden\$="[[!showCursor]]" class="cursor">[[cursor]]</span>
  </span>
`;
  }

  static get is() {return 'terminal-text'}
  static get properties() { 
    return {
      _version: {
        type: String,
        readonly: true,
        value: 'v2.0.0'
      },
      /**
      * List of strings to output.
      */
      text: {
        type: Array,
        value: function() { 
          return ['Lorem\n ipsum alb~3dolor sit amet.','Donec ^1000molestie ultricies velit, tempus.','Etiam quis iaculis nunc, vitae.']; 
        }
      },
      /**
      * Minimum delay, in ms, between typing characters.
      */
      typeDelay: {
        type: Number,
        value: 100
      },
      /**
      * Minimum delay, in ms, before clearing characters to resume next.
      */
      clearDelay: {
        type: Number,
        value: 10
      },
      /**
      * Minimum delay, in ms, between deleting characters.
      */
      backDelay: {
        type: Number,
        value: 50
      },
      /**
      * Interval, in ms, that the cursor will flash.
      */
      blinkSpeed: {
        type: Number,
        value: 500,
        observer: '_blinkSpeedChanged'
      },
      /**
      * Character used to represent the cursor.
      */
      cursor: {
        type: String,
        value: '▋'
      },
      /**
      * Time in ms to pause before deleting the current text.
      */
      delay: {
        type: Number,
        value: 2000
      },
      /**
      * Prevent auto delete of the current string and begin outputting the next string.
      */
      preserve: {
        type: Boolean,
        value: false
      },
      /**
      * Begin each string with this prefix value.
      */
      prefix: {
        type: String,
        value: '[terminal-text ~]# '
      },
      /**
      * Number of times to loop through the output strings, for unlimited use 0.
      */
      loop: {
        type: Number,
        value: 0
      },
      /**
      * Add a random delay before each character to represent human interaction.
      */
      humanize: {
        type: Boolean,
        value: false
      },
      /**
      * Blink the cursor.
      */
      blink: {
        type: Boolean,
        value: true
      },
      /**
      * Show the cursor leading the text.
      */
      showCursor: {
        type: Boolean,
        value: true
      },
      /**
      * The current value in the text buffer
      */
      value: {
        type: String,
        value: '',
        notify: true
      },
      _current: {
        type: Object,
        value: function() {
          return {
            str: '',
            index: 0,
            position: 0,
            loop: 0
          };
        }
      },
      _outputText: {
        type: String,
        computed: '_textFormat(_output)'
      },
      _output: {
        type: String,
        value: '',
        observer: '_outputChanged'
      },
      _cursorAnimation: {
        type: Object,
        value: function() { return {}; }
      }
    }
  }

  _textFormat(txt) {
    return txt;
  }

  _next() {
    this._current.index++;
    if ( this._current.index >= this.text.length ) {
      this._current.index = 0;
      this._current.loop++;
      if ( this.loop !== false && ( this.loop == this._current.loop ) ) {
        return false;
      }
    }
    this._current.position = 0;
    this._setCurrentString();
    if ( typeof( this.callbackNext ) == 'function' ) {
      this.callbackNext( this._current, object );
    }
    return true;        
  }

  _isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  _type() {
    if (!!!this._current.str || this._current.str.length <= 0) {
      return;
    }
    var letters = this._current.str.split( '' ),
      letter = letters[this._current.position],
      start = this._current.position + 1;
    if ( letter == '^' || letter == '~' ) {
      var end = this._current.str.substr( start ).search( /[^0-9]/ );
      if ( end == -1 ) {
        end = this._current.str.length;
      }
      var value = this._current.str.substr( start, end );
      if ( this._isNumeric( value ) ) {
        this._current.str = this._current.str.replace( letter + value, '' );
        if ( letter == '^' ) {
          setTimeout(function() {
            setTimeout( function() {
              var that = this;
              that._type();
            }.bind(this), this._delay( this.typeDelay ) );
          }.bind(this), value );
        } else {
          var index = this._current.position - value;
          this._current.str = this._current.str.substr( 0, index - 1 ) + this._current.str.substr( this._current.position - 1 );
          setTimeout( function() {
            this._backspace( Math.max( index, 0 ) );
          }.bind(this), this._delay( this.backDelay ) );
        }
        return;
      }
    }
    if ( letter == '|' ) {
      var value = this._current.str.substr( start, 1 );
      this.cursor = value;
      this._current.str = this._current.str.replace( letter + value , '' );
      this._type();
      return;
    }
    if ( letter !== undefined ) {
      this._output += letter;
    }
    this._current.position++;
    if ( this._current.position < this._current.str.length ) {
      setTimeout( function() { this._type(); }.bind(this), this._delay( this.typeDelay ) );
    } else if ( this.preserve === false ) {
      setTimeout( function() {
        var that = this;
        setTimeout( function() { this._backspace(); }.bind(that), this._delay( this.backDelay ) );
      }.bind(this), this.delay );
    } else {
      if ( this._next() ) {
        setTimeout( function() {
          this._output = '';
          this._type();
        }.bind(this), this.clearDelay );
      }
      this.dispatchEvent(new CustomEvent('terminal-text-finished', { bubbles: true, composed: true, detail: { value: this._output } }));
    }
    this.dispatchEvent(new CustomEvent('terminal-text-type', { bubbles: true, composed: true, detail: { letter: letter, current: this._current } }));
  }

  _backspace(stop) {
    if ( !stop ) {
      stop = 0;
    }
    if ( this._current.position > stop ) {
      this._output = this._output.slice(0, -1);
      setTimeout( function() {
        this._backspace( stop );
      }.bind(this), this._delay( this.backDelay ) );
      this._current.position--;
    } else {
      if ( stop === 0 ) {
        if ( this._next() === false ) {
          return;
        }
      }
      setTimeout( function() { 
        this._type(); 
      }.bind(this), this._delay( this.typeDelay ) );
    }
  }

  _delay(speed) {
    var time = parseInt( speed );
    if ( this.humanize ) {
      time += Math.floor( Math.random() * 200 );
    }
    return time;
  }

  _setCurrentString() {
    if (!!this.text) {
      this._current.str = this.text[this._current.index]; // .replace(/\n/g, "\\n");
    }
  }

  _animateCursor() {
    if (!!!this._cursorAnimation || !!!this._cursorAnimation.playState) {
      var elem = this.$.cursor;
      // debugger;
      this._cursorAnimation = elem.animate({
        opacity: [0, 1],
        transform: ['scale(0.5)', 'scale(1)'],
      }, {
        direction: 'alternate',
        duration: this.blinkSpeed,
        iterations: Infinity,
      });
    }
    this._cursorAnimation.play();
  }

  ready() {
    super.ready();
    this._setCurrentString();
    this._type();
    if (this.blink) {
      this._animateCursor();
    }
  }

  _cursorClass(b) {
    return b ? 'blink_me' : 'no-blink';
  }

  _blinkChanged(b) {
    if (!!!b && !!this._cursorAnimation) {
      this._cursorAnimation.pause();
      this._cursorAnimation.currentTime = this.blinkSpeed;
      return;
    }
    if (!!b) {
      this._animateCursor();
    }
  }

  _blinkSpeedChanged(n, o){
    if (!!n && !!this._cursorAnimation && !!this._cursorAnimation.cancel) {
      this._cursorAnimation.cancel();
      this._cursorAnimation = null;
      this._animateCursor();
    }
  }

  _outputChanged(n) {
    this.value = n;
  }

  static get observers() { return [
      '_blinkChanged(blink)'
    ];
  }


  /**
  * Fired when `element` changes its awesomeness level.
  *
  * @event terminal-text-finished
  * @param {string} value The output text value
  */

  /**
  * Fired when `terminal-text` character is typed.
  *
  * @event terminal-text-type
  * @param {string} letter The letter that was typed
  * @param {string} current The current text buffer
  */
}

window.customElements.define(TerminalText.is, TerminalText);
