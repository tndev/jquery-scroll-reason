# jQuery scroll reason

This plugin adds an additional property to the `scroll` event that will allow to determin
if the `scroll` event was caused by user interaction or programmatically.

Usage:

```js
   $(document).on('scroll', function(event) {
     console.log(event.scrollType);
   });
```

`event.scrollType`  will be either `user` or `programm`

## WARNING

This plugin is still under development and the API might change.

