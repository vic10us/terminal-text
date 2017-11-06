[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg?style=flat-square)](https://www.webcomponents.org/element/vic10us/terminal-text)

# \<terminal-text\>

An element that simulates the old-school terminals of the 70s and 80s

<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="terminal-text.html">
    <style>
        terminal-text {
            height: 80px;
            font-size: 20pt; 
            line-height: 1.5; 
            background-color: #424242;
            font-family: "Andale Mono", Consolas, "Courier New";
            --terminal-text-pre-text-color: #00ff00;
            --terminal-text-text-color: #ffffff;
            --terminal-text-cursor-color: #00ff00;
        }
    </style>
    <terminal-text 
        id="tt"
        clear-delay="1000"
        back-delay="10"
        blink-speed="250"
        value="{{output}}"
        text='["^250.^250.^250.^1000","auti~1o^1000 type terminal commands.","including new lines,\npauses^2000, character deletion^250~20 and other features."," auto delete^2000, customisable cursor.|_^2000|▋"," and loads^150~5^150 more..."," what will you do?"]'>
    #&nbsp;</terminal-text>
  </template>
</custom-element-demo>
```
-->

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your application locally.

## Viewing Your Application

```
$ polymer serve
```

## Building Your Application

```
$ polymer build
```

This will create a `build/` folder with `bundled/` and `unbundled/` sub-folders
containing a bundled (Vulcanized) and unbundled builds, both run through HTML,
CSS, and JS optimizers.

You can serve the built versions by giving `polymer serve` a folder to serve
from:

```
$ polymer serve build/bundled
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
